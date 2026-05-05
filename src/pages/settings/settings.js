var SettingsPage = (function () {
  function render($el) {
    return Router.fetchTemplate('src/pages/settings/settings.html').then(function(html){
      $el.innerHTML = html;
      _init();
    });
  }

  function _init() {
    // Lấy trạng thái hiện tại từ localStorage
    var theme = localStorage.getItem('santino_theme') || 'auto';
    var font = localStorage.getItem('santino_font') || 'Plus Jakarta Sans';
    var lang = localStorage.getItem('santino_lang') || 'vi';
    var color = localStorage.getItem('santino_color') || '#eab308';

    // Đánh dấu Theme
    document.querySelectorAll('.theme-card').forEach(function(c) { c.classList.remove('active'); });
    var themeCard = document.querySelector('.theme-card[data-theme="' + theme + '"]');
    if(themeCard) themeCard.classList.add('active');

    // Đánh dấu Font
    document.querySelectorAll('.font-card').forEach(function(c) { c.classList.remove('active'); });
    var fontCard = document.querySelector('.font-card[data-font="' + font + '"]');
    if(fontCard) fontCard.classList.add('active');

    // Đánh dấu Lang
    document.querySelectorAll('.lang-card').forEach(function(c) { c.classList.remove('active'); });
    var langCard = document.querySelector('.lang-card[data-lang="' + lang + '"]');
    if(langCard) langCard.classList.add('active');

    // Đánh dấu Color
    document.querySelectorAll('.color-circle').forEach(function(c) { c.classList.remove('active'); });
    var colorCard = document.querySelector('.color-circle[data-color="' + color + '"]');
    if(colorCard) colorCard.classList.add('active');
  }

  function setMode(mode) {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark-theme');
      localStorage.setItem('santino_theme', 'dark');
    } else if (mode === 'light') {
      document.documentElement.classList.remove('dark-theme');
      localStorage.setItem('santino_theme', 'light');
    } else {
      localStorage.setItem('santino_theme', 'auto');
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark-theme');
      } else {
          document.documentElement.classList.remove('dark-theme');
      }
    }
    _init();
    showToast('Đã đổi chủ đề');
  }

  function setFont(fontName) {
    document.documentElement.style.setProperty('--font', '"' + fontName + '", sans-serif');
    localStorage.setItem('santino_font', fontName);
    _init();
    showToast('Đã đổi phông chữ');
  }

  function setLanguage(lang) {
    localStorage.setItem('santino_lang', lang);
    _init();
    if (typeof applyLanguage === 'function') applyLanguage();
    showToast('Đã đổi ngôn ngữ');
  }

  function setColor(hex) {
    document.documentElement.style.setProperty('--accent', hex);
    localStorage.setItem('santino_color', hex);
    _init();
  }

  function resetData() {
    ConfirmModal.show({
      title: 'Xóa dữ liệu',
      message: 'Reset toàn bộ về dữ liệu mặc định? Đơn hàng và các cài đặt sẽ bị xóa!',
      confirmText: 'Reset',
      confirmClass: 'btn-danger',
      onConfirm: function() {
        ['santino_products','santino_sizes','santino_promotions','santino_orders', 'santino_theme', 'santino_font', 'santino_color', 'santino_lang'].forEach(function(k){localStorage.removeItem(k);});
        DB.initSeed();
        showToast('Đã reset dữ liệu về mặc định. Vui lòng tải lại trang.');
        setTimeout(function() { window.location.reload(); }, 1500);
      }
    });
  }

  return { render:render, setMode:setMode, setFont:setFont, setLanguage:setLanguage, setColor:setColor, resetData:resetData };
})();
