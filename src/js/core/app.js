/**
 * App Bootstrap — Khởi tạo hệ thống
 * Chạy sau khi tất cả scripts đã load
 */
document.addEventListener('DOMContentLoaded', function () {
  // 1. Khởi tạo User Menu Component
  if (typeof UserMenu !== 'undefined') {
    UserMenu.render('user-menu-navbar');
    UserMenu.render('user-menu-sidebar-header');
  }


  // 2. Khôi phục Cài đặt
  var theme = localStorage.getItem('santino_theme') || 'auto';
  if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark-theme');
  } else {
    document.documentElement.classList.remove('dark-theme');
  }

  var zoom = localStorage.getItem('santino_zoom');
  if (zoom === null) zoom = '115';
  document.documentElement.style.setProperty('--text-scale', (parseInt(zoom) / 100).toString());

  var font = localStorage.getItem('santino_font');
  if (font) document.documentElement.style.setProperty('--font', '"' + font + '", sans-serif');

  var color = localStorage.getItem('santino_color');
  if (color) {
    document.documentElement.style.setProperty('--accent', color);
    var colorFg = localStorage.getItem('santino_color_fg');
    if (colorFg) document.documentElement.style.setProperty('--accent-fg', colorFg);
  }
  Router.init();

  // 3. Khởi tạo Load Menu động
  if (typeof MenuService !== 'undefined') {
    MenuService.getChildren('').then(function (items) {
      if (Array.isArray(items) && items.length > 0) {
        var html = '';
        items.forEach(function (item) {
          // Bỏ qua các menu bị ẩn (isDisable = 1)
          if (String(item.isDisable) === '1' || item.isDisable === true) return;

          // Map URLPara hoặc FormKey sang route
          var route = item.URLPara ? item.URLPara : '';
          if (!route) {
            if (item.FormName === 'WEB_OrderDetailFrm' || item.FormKey === 'List') route = '/orders';
            else if (item.FormName === 'WEB_OrderFrm' || item.FormKey === 'Null') route = '/order';
            else if (item.FormKey && item.FormKey !== '') route = '/' + item.FormKey.toLowerCase();
          }
          if (!route || route === '/' || route === '/null') return;
          if (!route.startsWith('/')) route = '/' + route;

          // Map IconClass
          var icon = item.IconClass;
          // Fallback mapping in case DB uses 'icon-grid' for both but we want specific icons
          if (icon === 'icon-grid' || !icon) {
            if (route === '/orders') icon = 'receipt_long';
            if (route === '/order') icon = 'shopping_bag';
          }
          if (!icon) icon = 'label';

          var title = item.VN || item.FormName;

          html += '<a class="nav-item" href="#' + route + '" data-route="' + route + '">';
          html += '<span class="material-symbols-outlined icon">' + icon + '</span>';
          html += '<span>' + title + '</span></a>';
        });

        // Cập nhật Navbar links
        var navLinks = document.getElementById('navbar-dynamic-links');
        if (navLinks) {
          navLinks.innerHTML = html;
        }

        // Cập nhật Sidebar links
        var sidebarLinks = document.getElementById('sidebar-dynamic-links');
        if (sidebarLinks) {
          sidebarLinks.innerHTML = html;

          // Gắn sự kiện auto-close cho mobile
          sidebarLinks.querySelectorAll('.nav-item').forEach(function (el) {
            el.addEventListener('click', function () {
              if (window.innerWidth <= 1024) {
                var sidebar = document.querySelector('.sidebar');
                var overlay = document.querySelector('.sidebar-overlay');
                if (sidebar) sidebar.classList.remove('show');
                if (overlay) overlay.classList.remove('show');
                document.body.style.overflow = '';
              }
            });
          });
        }

        // Re-apply language if needed
        applyLanguage();
        // Cập nhật trạng thái active
        if (typeof Router !== 'undefined' && Router._highlightActive) {
          Router._highlightActive();
        } else {
          _highlightActiveNav();
        }
      }
    });
  }

  // Ẩn splash nếu có
  var splash = document.getElementById('app-splash');
  if (splash) splash.style.display = 'none';
});

// Helper highlight active nav sau khi load động
function _highlightActiveNav() {
  var hash = window.location.hash || '#/dashboard';
  var route = hash.replace('#', '').split('?')[0];
  document.querySelectorAll('.nav-item').forEach(function (el) {
    el.classList.toggle('active', el.getAttribute('data-route') === route);
  });
}

// ── Global helpers (dùng được từ bất kỳ page nào) ─────────────────────

function toggleTheme() {
  var isDark = document.documentElement.classList.toggle('dark-theme');
  localStorage.setItem('santino_theme', isDark ? 'dark' : 'light');
  if (typeof SoundUtils !== 'undefined') {
    SoundUtils.playThemeToggle(isDark);
  }
}


function showToast(msg, ok, actionHtml, duration) {
  var t = document.getElementById('toast');
  var m = document.getElementById('toast-msg');
  if (!t || !m) return;

  if (!msg) {
    t.classList.remove('show');
    clearTimeout(t._timer);
    return;
  }

  if (ok === undefined) ok = true;
  t.querySelector('.material-symbols-outlined').textContent = ok ? 'check_circle' : 'error';

  if (actionHtml) {
    m.innerHTML = msg + '&nbsp;&nbsp;' + actionHtml;
  } else {
    m.innerHTML = msg;
  }

  t.classList.add('show');
  clearTimeout(t._timer);
  var hideTime = duration ? duration : (actionHtml ? 7000 : 3000);
  t._timer = setTimeout(function () { t.classList.remove('show'); }, hideTime);
}

function openModal(id) {
  var el = document.getElementById(id);
  if (el) {
    el.classList.add('show');
    // Đẩy trạng thái mới vào history để nút Back có thể đóng modal
    history.pushState({ modalId: id }, null, "");
  }
}

function closeModal(id) {
  var el = document.getElementById(id);
  if (el && el.classList.contains('show')) {
    el.classList.remove('show');
    // Nếu đóng thủ công, ta quay lại history 1 bước để xóa state của modal
    if (history.state && history.state.modalId === id) {
      history.back();
    }
  }
}

// Xử lý nút Back của trình duyệt/điện thoại
window.addEventListener('popstate', function (e) {
  // Tìm tất cả các modal đang mở và đóng chúng
  var openModals = document.querySelectorAll('.modal-overlay.show, .modal.show');
  if (openModals.length > 0) {
    openModals.forEach(function (m) {
      m.classList.remove('show');
    });
  }
  // Đóng các dropdown combobox
  document.dispatchEvent(new CustomEvent('close-other-comboboxes'));
});

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
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    if (dict[key]) {
      // Dùng innerHTML hoặc textContent, tuỳ yêu cầu. Dùng textContent an toàn hơn.
      el.textContent = dict[key];
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
    var key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });
}

// Chạy dịch ngôn ngữ khi tải trang và sau khi render xong Router
document.addEventListener('DOMContentLoaded', applyLanguage);

