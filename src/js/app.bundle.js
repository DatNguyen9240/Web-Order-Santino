/* --- http.js --- */
/**
 * HTTP Client - Wrapper gọi API dùng chung cho Santino Web Order
 * Kế thừa từ Medstand: Tự động gắn Authorization token, xử lý lỗi, caching, timeout
 */
const Http = (() => {
  const TIMEOUT_MS = 15000; // 15s
  const CACHE_TTL_MS = 3 * 60 * 1000; // 3 phút
  const CACHE_PREFIX = '_api_';

  // Base URL của Backend (lấy từ env.js)
  const getApiBaseUrl = () => typeof API_CONFIG !== 'undefined' ? API_CONFIG.BASE_URL : ''; 

  // --- Cache layer (sessionStorage) ---
  function _cacheKey(url) { return CACHE_PREFIX + url; }

  function _getFromCache(key) {
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) return null;
      const entry = JSON.parse(raw);
      if (Date.now() - entry.t > CACHE_TTL_MS) {
        sessionStorage.removeItem(key);
        return null;
      }
      return entry.d;
    } catch (e) { return null; }
  }

  function _setCache(key, data) {
    try {
      sessionStorage.setItem(key, JSON.stringify({ d: data, t: Date.now() }));
    } catch (e) {}
  }

  function clearCache() {
    const keysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      if (k && k.startsWith(CACHE_PREFIX)) keysToRemove.push(k);
    }
    keysToRemove.forEach(k => sessionStorage.removeItem(k));
  }

  // --- Auth & Headers ---
  function _getToken() {
    return localStorage.getItem('auth_token') || '';
  }

  function _headers(extra = {}) {
    const token = _getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...extra,
    };
  }

  // --- Helpers ---
  function _alert(msg, isSuccess = false) {
    if (typeof showToast !== 'undefined') {
      showToast(msg, isSuccess);
    } else {
      console.warn('API:', msg);
    }
  }

  // --- Response Handler ---
  async function _handleResponse(res) {
    // 1. Check Auth
    if (res.status === 401) {
      _alert('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.', false);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('santino_user');
      window.location.href = 'login.html';
      return;
    }

    // 2. Parse JSON
    const raw = await res.text().catch(() => '');
    let data = null;
    try {
      data = JSON.parse(raw);
    } catch {
      try {
        var fixed = raw.replace(/"code"\s*:\s*([A-Za-z0-9]+)(?=[,\s}])/g, '"code":"$1"');
        data = JSON.parse(fixed);
      } catch {}
    }

    // 3. HTTP Error code
    if (!res.ok) {
      const msg = data?.msg || data?.message || `Lỗi từ máy chủ (${res.status})`;
      _alert(msg, false);
      throw new Error(msg);
    }

    // 4. Empty Response
    if (!data) {
      _alert('Không nhận được dữ liệu từ máy chủ.', false);
      throw new Error('Empty response');
    }

    // 5. Business Logic Code (quy ước code = 2 là hết phiên)
    if (data.code === 2) {
      _alert(data.msg || 'Phiên đăng nhập đã hết hạn.', false);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('santino_user');
      window.location.href = 'login.html';
      return;
    }

    // 6. Business Logic Error (quy ước code != 0 là lỗi)
    if (data.code !== undefined && typeof data.code === 'number' && data.code !== 0) {
      const msg = data.msg || data.message || 'Lỗi xử lý từ máy chủ.';
      _alert(msg, false);
      throw new Error(msg);
    }

    return data;
  }

  // --- Fetch with Timeout & Retry ---
  async function _fetchWithTimeout(url, options, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), TIMEOUT_MS);
        const res = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(tid);
        return res;
      } catch (err) {
        if (attempt === retries) {
          const isTimeout = err.name === 'AbortError';
          const msg = isTimeout ? 'Kết nối quá thời gian chờ.' : 'Không thể kết nối đến máy chủ.';
          _alert(msg, false);
          throw new Error(msg);
        }
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt - 1)));
      }
    }
  }

  // --- Public API ---
  async function get(endpoint, params = {}) {
    const qs = new URLSearchParams(params).toString();
    const url = getApiBaseUrl() + endpoint + (qs ? `?${qs}` : '');

    const cached = _getFromCache(_cacheKey(url));
    if (cached) return cached;

    document.body.style.cursor = 'wait';
    try {
      const res = await _fetchWithTimeout(url, { method: 'GET', headers: _headers() });
      const data = await _handleResponse(res);
      
      const hasData = !Array.isArray(data?.records) || data.records.length > 0;
      if (data && (data.code === 0 || data.code === undefined) && hasData) {
        _setCache(_cacheKey(url), data);
      }
      return data;
    } finally {
      document.body.style.cursor = '';
    }
  }

  async function post(endpoint, body = {}) {
    document.body.style.cursor = 'wait';
    try {
      clearCache();
      const url = getApiBaseUrl() + endpoint;
      const res = await _fetchWithTimeout(url, {
        method: 'POST',
        headers: _headers(),
        body: JSON.stringify(body),
      });
      return _handleResponse(res);
    } finally {
      document.body.style.cursor = '';
    }
  }

  async function put(endpoint, body = {}) {
    document.body.style.cursor = 'wait';
    try {
      clearCache();
      const url = getApiBaseUrl() + endpoint;
      const res = await _fetchWithTimeout(url, {
        method: 'PUT',
        headers: _headers(),
        body: JSON.stringify(body),
      });
      return _handleResponse(res);
    } finally {
      document.body.style.cursor = '';
    }
  }

  async function del(endpoint) {
    document.body.style.cursor = 'wait';
    try {
      clearCache();
      const url = getApiBaseUrl() + endpoint;
      const res = await _fetchWithTimeout(url, {
        method: 'DELETE',
        headers: _headers(),
      });
      return _handleResponse(res);
    } finally {
      document.body.style.cursor = '';
    }
  }

  return { get, post, put, del, clearCache };
})();


/* --- product.service.js --- */
/**
 * Product Service
 * Xử lý gọi API liên quan đến Sản phẩm
 */
const ProductService = (() => {
  /**
   * Lấy danh sách sản phẩm (có hỗ trợ tìm kiếm)
   * @param {string} searchTerm - Từ khóa tìm kiếm (mã hoặc tên)
   */
  async function getProducts(searchTerm = '') {
    if (!API_CONFIG.BASE_URL) {
      return [];
    }

    try {
      // Backend yêu cầu format: ?q={"sanpham":"..."}
      const queryObj = { sanpham: searchTerm };
      const res = await Http.get(API_CONFIG.ENDPOINTS.PRODUCTS.LIST, { q: JSON.stringify(queryObj) });
      // Giả sử API trả về mảng trực tiếp hoặc nằm trong { records: [] }
      return res.records || res;
    } catch (error) {
      console.warn('[ProductService] Lỗi gọi API lấy sản phẩm:', error);
      return [];
    }
  }
  async function getSizes() {
    try {
      const res = await Http.get(API_CONFIG.ENDPOINTS.SIZES.LIST);
      return res.records || res;
    } catch (error) {
      console.warn('[ProductService] Lỗi gọi API lấy bảng Size:', error);
      return [];
    }
  }

  return { getProducts, getSizes };
})();


/* --- order.service.js --- */
/**
 * Order Service
 * Xử lý gọi API liên quan đến Đơn hàng
 */
const OrderService = (() => {
  /**
   * Lấy danh sách đơn hàng
   */
  async function getOrders(params = {}) {
    if (!API_CONFIG.BASE_URL) {
      return [];
    }
    try {
      const res = await Http.get(API_CONFIG.ENDPOINTS.ORDERS.LIST, params);
      return res.records || res;
    } catch (e) {
      console.warn('[OrderService] Lỗi gọi API lấy đơn hàng:', e);
      return [];
    }
  }

  /**
   * Tạo đơn hàng mới
   */
  async function createOrder(orderData) {
    return Http.post(API_CONFIG.ENDPOINTS.ORDERS.CREATE, orderData);
  }

  return { getOrders, createOrder };
})();


/* --- utils.js --- */
/** Utility functions */
const Utils = (function () {
  function formatMoney(n) {
    return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
  }

  // Cập nhật Blueprint v2.0: Validation an toàn
  function buildSKU(ten_hang_2, size) {
    if (!ten_hang_2) return 'INVALID_SKU';
    const clean_ten = ten_hang_2.trim();
    const match = clean_ten.match(/^[A-Z]+/);
    if (!match) return `INVALID_${clean_ten}_${size}`;
    const brand = match[0];
    const rest = clean_ten.slice(brand.length);
    return `${brand}${size}${rest}`;
  }

  // DH{MMYY}/{seq:04}
  function genOrderNo() {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(2);
    const seq = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    return `DH${mm}${yy}/${seq}`;
  }

  function uuid() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return { formatMoney, buildSKU, genOrderNo, today, escHtml, uuid };
})();


/* --- ConfirmModal.js --- */
/**
 * Confirm Modal Component
 * Hộp thoại hỏi ý kiến (Xóa/Lưu dữ liệu)
 */
var ConfirmModal = (function () {
  var modalOverlay = null;

  function init() {
    if (document.getElementById('confirm-modal-overlay')) return;

    modalOverlay = document.createElement('div');
    modalOverlay.id = 'confirm-modal-overlay';
    modalOverlay.className = 'modal-overlay';
    modalOverlay.style.display = 'none';

    var html = `
      <div class="modal" style="width: 360px; padding: 24px; animation: slideUp 0.2s ease;">
        <div class="modal-hdr" style="margin-bottom: 16px;">
          <h3 id="confirm-modal-title">Xác nhận</h3>
          <button class="btn-icon" id="confirm-modal-btn-close">
            <span class="material-symbols-outlined" style="font-size: 20px;">close</span>
          </button>
        </div>
        <div>
          <p id="confirm-modal-message" style="margin-bottom: 20px; color: var(--muted); font-size: 14px; line-height: 1.5;"></p>
        </div>
        <div class="modal-actions" style="margin-top: 16px; padding-top: 16px;">
          <button class="btn btn-ghost" id="confirm-modal-btn-cancel">Hủy bỏ</button>
          <button class="btn btn-primary" id="confirm-modal-btn-confirm">Đồng ý</button>
        </div>
      </div>
    `;

    modalOverlay.innerHTML = html;
    document.body.appendChild(modalOverlay);
  }

  /**
   * Mở hộp thoại xác nhận
   * @param {Object} options - { title, message, confirmText, confirmClass, onConfirm }
   */
  function show(options) {
    if (!modalOverlay) init();

    document.getElementById('confirm-modal-title').innerText = options.title || 'Xác nhận';
    document.getElementById('confirm-modal-message').innerText = options.message || 'Bạn có chắc chắn muốn thực hiện hành động này?';
    
    var btnConfirm = document.getElementById('confirm-modal-btn-confirm');
    btnConfirm.innerText = options.confirmText || 'Đồng ý';
    btnConfirm.className = 'btn ' + (options.confirmClass || 'btn-primary');

    var btnCancel = document.getElementById('confirm-modal-btn-cancel');
    var btnClose = document.getElementById('confirm-modal-btn-close');
    
    btnCancel.innerText = options.cancelText || (typeof t === 'function' ? t('btn.cancel') : 'Hủy bỏ');

    // Remove old listeners using clone node trick
    var newBtnConfirm = btnConfirm.cloneNode(true);
    btnConfirm.parentNode.replaceChild(newBtnConfirm, btnConfirm);

    var newBtnCancel = btnCancel.cloneNode(true);
    btnCancel.parentNode.replaceChild(newBtnCancel, btnCancel);

    var newBtnClose = btnClose.cloneNode(true);
    btnClose.parentNode.replaceChild(newBtnClose, btnClose);

    // Add new listeners
    newBtnConfirm.addEventListener('click', function() {
      hide();
      if (typeof options.onConfirm === 'function') options.onConfirm();
    });

    newBtnCancel.addEventListener('click', hide);
    newBtnClose.addEventListener('click', hide);

    modalOverlay.style.display = 'flex';
  }

  function hide() {
    if (modalOverlay) {
      modalOverlay.style.display = 'none';
    }
  }

  return {
    show: show,
    hide: hide
  };
})();


/* --- Modal.js --- */
/**
 * Generic Modal Builder
 * Mở các Pop-up Window Nhập liệu / Báo cáo không cần code cứng HTML
 */
var UIModal = (function () {

  /**
   * Mở một form Modal bất kỳ
   * @param {Object} config - { id, title, width, content (Node/String), footer (Node), onClose }
   */
  function show(config) {
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.display = 'flex';
    if (config.id) overlay.id = config.id;

    var contentWidth = config.width || '600px';

    var html = `
      <div class="modal" style="width: ${contentWidth};">
        <div class="modal-hdr">
          <h3>${config.title || 'Tiêu đề'}</h3>
          <button class="btn-icon btn-close-modal">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="ui-modal-body"></div>
        <div class="modal-actions"></div>
      </div>
    `;
    overlay.innerHTML = html;

    var bodyWrapper = overlay.querySelector('.ui-modal-body');
    if (typeof config.content === 'string') {
      bodyWrapper.innerHTML = config.content;
    } else if (config.content instanceof Node) {
      bodyWrapper.appendChild(config.content);
    }

    var footerWrapper = overlay.querySelector('.modal-actions');
    if (config.footer instanceof Node) {
      footerWrapper.appendChild(config.footer);
    } else {
      footerWrapper.style.display = 'none';
    }

    document.getElementById('modal-container').appendChild(overlay);

    function close() {
      overlay.remove();
      if (typeof config.onClose === 'function') config.onClose();
    }

    overlay.querySelector('.btn-close-modal').addEventListener('click', close);
    // Optional: close on click outside
    /* overlay.addEventListener('click', function(e) {
      if (e.target === overlay) close();
    }); */

    return {
      close: close,
      node: overlay
    };
  }

  return {
    show: show
  };
})();


/* --- router.js --- */
/**
 * Router — Hash-based SPA cho Santino B2B
 * Pattern: #/order → load src/pages/order/order.js → OrderPage.render($el)
 */
var Router = (function () {

  var ROUTES = [
    { path: '/order',        script: 'src/pages/order/order.js',               pageFn: 'OrderPage',        title: 'nav.order' },
    { path: '/orders',       script: 'src/pages/orders/orders.js',             pageFn: 'OrdersPage',       title: 'nav.orders' },
    { path: '/order-detail', script: 'src/pages/order-detail/order-detail.js', pageFn: 'OrderDetailPage',  title: 'nav.order_detail' },
    { path: '/products',     script: 'src/pages/products/products.js',         pageFn: 'ProductsPage',     title: 'nav.products' },
    { path: '/sizes',        script: 'src/pages/sizes/sizes.js',               pageFn: 'SizesPage',        title: 'nav.sizes' },
    { path: '/sku',          script: 'src/pages/sku/sku.js',                   pageFn: 'SkuPage',          title: 'nav.sku' },
    { path: '/promos',       script: 'src/pages/promos/promos.js',             pageFn: 'PromosPage',       title: 'nav.promos' },
    { path: '/settings',     script: 'src/pages/settings/settings.js',        pageFn: 'SettingsPage',     title: 'nav.settings' },
  ];

  var _routeMap = {};
  ROUTES.forEach(function (r) { _routeMap[r.path] = r; });

  var _loadedScripts = {};
  var _templateCache = {};
  var _isNavigating = false;

  // ── Dynamic script loader ─────────────────────────────────────────────
  function _loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (_loadedScripts[src]) { resolve(); return; }
      var el = document.createElement('script');
      el.src = src;
      el.onload = function () { _loadedScripts[src] = true; resolve(); };
      el.onerror = function () { reject(new Error('Load failed: ' + src)); };
      document.body.appendChild(el);
    });
  }

  // ── Template fetch with cache ─────────────────────────────────────────
  function fetchTemplate(url) {
    if (_templateCache[url]) return Promise.resolve(_templateCache[url]);
    return fetch(url + '?v=' + new Date().getTime(), { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error('Template not found: ' + url);
        return r.text();
      })
      .then(function (html) { _templateCache[url] = html; return html; });
  }

  // ── Fade helpers ──────────────────────────────────────────────────────
  function _fadeOut($el) {
    return new Promise(function (resolve) {
      $el.style.opacity = '0';
      $el.style.transition = 'opacity 100ms ease';
      setTimeout(resolve, 100);
    });
  }
  function _fadeIn($el) {
    $el.style.opacity = '1';
    $el.style.transition = 'opacity 150ms ease';
  }

  // ── Nav highlight ─────────────────────────────────────────────────────
  function _updateNav(hash) {
    document.querySelectorAll('.nav-item').forEach(function (el) {
      el.classList.remove('active');
      if (el.getAttribute('data-route') === hash) el.classList.add('active');
    });
    var hdr = document.getElementById('hdr-title');
    var route = _routeMap[hash];
    if (hdr && route) {
      hdr.setAttribute('data-i18n', route.title);
      hdr.textContent = typeof t === 'function' ? t(route.title) : route.title;
    }
    if (route) document.title = (typeof t === 'function' ? t(route.title) : route.title) + ' | SANTINO B2B';
  }

  // ── Main handler ──────────────────────────────────────────────────────
  function _handle() {
    if (_isNavigating) return;
    _isNavigating = true;

    var $el = document.getElementById('app-content');
    var hash = window.location.hash.replace('#', '') || '/order';
    var route = _routeMap[hash];

    _updateNav(hash);
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (!route) {
      $el.innerHTML = '<div class="empty-state"><span class="material-symbols-outlined">search_off</span><p>Trang không tồn tại: ' + hash + '</p></div>';
      _isNavigating = false;
      return;
    }

    _fadeOut($el)
      .then(function () { return _loadScript(route.script); })
      .then(function () {
        var mod = window[route.pageFn];
        if (mod && typeof mod.render === 'function') {
          return mod.render($el);
        }
        throw new Error('Module not found: ' + route.pageFn);
      })
      .then(function () { 
        if (typeof applyLanguage === 'function') applyLanguage();
        _fadeIn($el); 
        _isNavigating = false; 
      })
      .catch(function (err) {
        console.error('[Router]', err);
        $el.innerHTML = '<div class="card" style="color:var(--danger)"><span class="material-symbols-outlined" style="vertical-align:middle">error</span> ' + err.message + '</div>';
        _fadeIn($el);
        _isNavigating = false;
      });
  }

  // ── Init ──────────────────────────────────────────────────────────────
  function init() {
    window.addEventListener('hashchange', _handle);
    if (!window.location.hash) window.location.hash = '#/order';
    else _handle();
  }

  // ── Public navigate helper ────────────────────────────────────────────
  function go(path) { window.location.hash = '#' + path; }

  return { init: init, go: go, fetchTemplate: fetchTemplate, ROUTES: ROUTES };
})();


/* --- app.js --- */
/**
 * App Bootstrap — Khởi tạo Santino B2B
 * Chạy sau khi tất cả scripts đã load
 */
document.addEventListener('DOMContentLoaded', function () {
  // Cài đặt khởi tạo


  // 2. Khôi phục Cài đặt
  var theme = localStorage.getItem('santino_theme') || 'auto';
  if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark-theme');
  } else {
    document.documentElement.classList.remove('dark-theme');
  }
  
  var zoom = localStorage.getItem('santino_zoom');
  if (zoom === null) zoom = '115';
  document.documentElement.style.setProperty('--text-scale', (parseInt(zoom)/100).toString());

  var font = localStorage.getItem('santino_font');
  if(font) document.documentElement.style.setProperty('--font', '"' + font + '", sans-serif');

  var color = localStorage.getItem('santino_color');
  if(color) {
    document.documentElement.style.setProperty('--accent', color);
    var colorFg = localStorage.getItem('santino_color_fg');
    if(colorFg) document.documentElement.style.setProperty('--accent-fg', colorFg);
  }
  Router.init();

  // Ẩn splash nếu có
  var splash = document.getElementById('app-splash');
  if (splash) splash.style.display = 'none';
});

// ── Global helpers (dùng được từ bất kỳ page nào) ─────────────────────

function toggleTheme() {
  var isDark = document.documentElement.classList.toggle('dark-theme');
  localStorage.setItem('santino_theme', isDark ? 'dark' : 'light');
}


function showToast(msg, ok) {
  if (ok === undefined) ok = true;
  var t = document.getElementById('toast');
  var m = document.getElementById('toast-msg');
  if (!t || !m) return;
  t.querySelector('.material-symbols-outlined').textContent = ok ? 'check_circle' : 'error';
  m.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(function () { t.classList.remove('show'); }, 3000);
}

function openModal(id)  { var el = document.getElementById(id); if (el) el.classList.add('show'); }
function closeModal(id) { var el = document.getElementById(id); if (el) el.classList.remove('show'); }

// Đóng modal khi click overlay
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('show');
});

// Chuyển đổi ngôn ngữ
function t(key) {
  var lang = localStorage.getItem('santino_lang') || 'vi';
  var dict = typeof TRANSLATIONS !== 'undefined' ? (TRANSLATIONS[lang] || TRANSLATIONS['vi']) : {};
  return dict[key] || key;
}

function applyLanguage() {
  var lang = localStorage.getItem('santino_lang') || 'vi';
  var dict = typeof TRANSLATIONS !== 'undefined' ? TRANSLATIONS[lang] || TRANSLATIONS['vi'] : {};
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    if (dict[key]) {
      // Dùng innerHTML hoặc textContent, tuỳ yêu cầu. Dùng textContent an toàn hơn.
      el.textContent = dict[key];
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
    var key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });
}

// Chạy dịch ngôn ngữ khi tải trang và sau khi render xong Router
document.addEventListener('DOMContentLoaded', applyLanguage);



