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

    // Đánh dấu Zoom
    var zoom = localStorage.getItem('santino_zoom');
    if (zoom === null) zoom = '115';
    var zoomValue = document.getElementById('zoom-value');
    if (zoomValue) zoomValue.textContent = zoom + '%';
    var slider = document.getElementById('zoom-slider');
    if (slider) slider.value = zoom;

    // Đánh dấu Lang
    document.querySelectorAll('.lang-card').forEach(function(c) { c.classList.remove('active'); });
    var langCard = document.querySelector('.lang-card[data-lang="' + lang + '"]');
    if(langCard) langCard.classList.add('active');

    // Đánh dấu Color
    document.querySelectorAll('.color-circle').forEach(function(c) { c.classList.remove('active'); });
    // Dùng querySelector với fallback nếu không tìm thấy color preset
    var colorCard = document.querySelector('.color-circle[data-color="' + color + '"]');
    if(colorCard) {
        colorCard.classList.add('active');
    } else {
        // Nếu chọn tự do, active vào picker
        var pickerWrapper = document.querySelector('.color-picker-wrapper');
        if(pickerWrapper) {
            pickerWrapper.style.outline = '2px solid ' + color;
            pickerWrapper.style.outlineOffset = '2px';
        }
    }

    // LUÔN áp dụng màu cho document khi init settings
    document.documentElement.style.setProperty('--accent', color);
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
    
    // Đảm bảo màu accent không bị đè bởi class dark-theme
    var color = localStorage.getItem('santino_color') || '#FBBF24';
    document.documentElement.style.setProperty('--accent', color);
    
    _init();
    showToast(t('toast.theme_changed'));
  }

  function setFont(fontName) {
    document.documentElement.style.setProperty('--font', '"' + fontName + '", sans-serif');
    localStorage.setItem('santino_font', fontName);
    _init();
    showToast(t('toast.font_changed'));
  }

  function setLanguage(lang) {
    localStorage.setItem('santino_lang', lang);
    _init();
    if (typeof applyLanguage === 'function') applyLanguage();
    showToast(t('toast.lang_changed'));
  }

  function changeZoom(val, isAbsolute) {
    var zoom = localStorage.getItem('santino_zoom');
    if (zoom === null) zoom = 115;
    
    var newZoom = isAbsolute ? parseInt(val) : (parseInt(zoom) + val);
    if (newZoom < 50) newZoom = 50;
    if (newZoom > 200) newZoom = 200;
    
    document.getElementById('zoom-value').textContent = newZoom + '%';
    var slider = document.getElementById('zoom-slider');
    if (slider && slider.value != newZoom) slider.value = newZoom;

    document.documentElement.style.setProperty('--text-scale', (newZoom/100).toString());
    localStorage.setItem('santino_zoom', newZoom);
  }

  function _calculateFg(hex) {
    if (!hex || hex === 'auto') return '#000000';
    var c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(function(x) { return x + x; }).join('');
    if (c.length !== 6) return '#000000';
    var r = parseInt(c.substr(0, 2), 16);
    var g = parseInt(c.substr(2, 2), 16);
    var b = parseInt(c.substr(4, 2), 16);
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 150) ? '#000000' : '#ffffff';
  }

  function setColor(hex) {
    document.documentElement.style.setProperty('--accent', hex);
    var fg = _calculateFg(hex);
    document.documentElement.style.setProperty('--accent-fg', fg);
    localStorage.setItem('santino_color', hex);
    localStorage.setItem('santino_color_fg', fg);
    
    // Xóa màu outline cũ của picker nếu có
    var pickerWrapper = document.querySelector('.color-picker-wrapper');
    if (pickerWrapper) {
        pickerWrapper.style.outline = 'none';
    }
    
    _init();
    showToast(t('toast.color_changed'));
  }

  function resetData() {
    ConfirmModal.show({
      title: t('settings.reset.confirm.title'),
      message: t('settings.reset.confirm.msg'),
      confirmText: t('settings.reset.confirm.btn'),
      confirmClass: 'btn-danger',
      onConfirm: function() {
        ['santino_products','santino_sizes','santino_promotions','santino_orders', 'santino_theme', 'santino_font', 'santino_color', 'santino_lang'].forEach(function(k){localStorage.removeItem(k);});
        DB.initSeed();
        showToast(t('toast.reset_done'));
        setTimeout(function() { window.location.reload(); }, 1500);
      }
    });
  }

  return { render:render, setMode:setMode, setFont:setFont, setLanguage:setLanguage, setColor:setColor, changeZoom:changeZoom, resetData:resetData };
})();
