/**
 * Router — Hash-based SPA
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
    if (route) document.title = (typeof t === 'function' ? t(route.title) : route.title);
  }

  // ── Main handler ──────────────────────────────────────────────────────
  function _handle() {
    if (_isNavigating) return;
    _isNavigating = true;

    var $el = document.getElementById('app-content');
    var fullHash = window.location.hash.replace('#', '') || '/order';
    var pathParts = fullHash.split('?');
    var hash = pathParts[0];
    var qs = pathParts[1] || '';
    var route = _routeMap[hash];

    // Cập nhật params vào biến toàn cục để các page tự lấy
    window._queryParams = new URLSearchParams(qs);
    if (window._queryParams.has('id')) {
      window._viewOrderId = window._queryParams.get('id');
    }

    _updateNav(hash);
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (!route) {
      $el.innerHTML = '<div class="empty-state"><span class="material-symbols-outlined">search_off</span><p>Trang không tồn tại: ' + hash + '</p></div>';
      _isNavigating = false;
      return;
    }

    _fadeOut($el)
      .then(function () { 
        if (window.LoadingSpinner) LoadingSpinner.show('Đang tải trang...');
        return _loadScript(route.script); 
      })

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
        if (window.LoadingSpinner) LoadingSpinner.hide();
      })

      .catch(function (err) {
        if (window.LoadingSpinner) LoadingSpinner.hide();
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
