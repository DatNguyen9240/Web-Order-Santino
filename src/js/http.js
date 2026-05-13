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
  
  function _getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
  }

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
    return _getCookie('auth_token');
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
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
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
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
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
