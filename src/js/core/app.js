/**
 * App Bootstrap — Khởi tạo Santino B2B
 * Chạy sau khi tất cả scripts đã load
 */
document.addEventListener('DOMContentLoaded', function () {
  // 1. Seed data vào localStorage lần đầu
  DB.initSeed();

  // 2. Khôi phục Cài đặt
  var theme = localStorage.getItem('santino_theme') || 'auto';
  if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark-theme');
  } else {
    document.documentElement.classList.remove('dark-theme');
  }

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

