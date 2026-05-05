var SettingsPage = (function () {
  function render($el) {
    return Router.fetchTemplate('src/pages/settings/settings.html').then(function(html){
      $el.innerHTML = html;
      _initActiveStates();
    });
  }

  function _initActiveStates() {
    // 1. Theme state
    var t = localStorage.getItem('santino_theme') || 'light';
    var elTheme = document.getElementById('theme-' + t);
    if(elTheme) elTheme.classList.add('active');

    // 2. Font state
    var f = localStorage.getItem('santino_font') || 'Plus Jakarta Sans';
    var fontId = f.toLowerCase().includes('plus') ? 'font-plus' : (f.toLowerCase() === 'inter' ? 'font-inter' : 'font-nunito');
    var elFont = document.getElementById(fontId);
    if(elFont) elFont.classList.add('active');

    // 3. Language state
    var l = localStorage.getItem('santino_lang') || 'vi';
    var elLang = document.getElementById('lang-' + l);
    if(elLang) elLang.classList.add('active');

    // 4. Color state
    var c = localStorage.getItem('santino_color') || '#2563eb'; // fallback based on global CSS
    document.documentElement.style.setProperty('--accent', c);
    document.querySelectorAll('.color-circle').forEach(function(el) {
      if(el.getAttribute('style').includes(c)) {
        el.classList.add('active');
      }
    });
  }

  function _clearActive(selector) {
    document.querySelectorAll(selector).forEach(function(el){ el.classList.remove('active'); });
  }

  function setTheme(t, el) {
    if(t==='dark') document.documentElement.classList.add('dark-theme');
    else document.documentElement.classList.remove('dark-theme');
    
    localStorage.setItem('santino_theme', t);
    
    _clearActive('.theme-card');
    if(el) el.classList.add('active');
    
    showToast('Đã chuyển giao diện: '+(t==='dark'?'Tối':'Sáng'));
  }

  function setFont(f, el) {
    document.documentElement.style.setProperty('--font-body', "'" + f + "', sans-serif");
    document.documentElement.style.setProperty('--font-display', "'" + f + "', sans-serif");
    
    localStorage.setItem('santino_font', f);
    
    _clearActive('.font-card');
    if(el) el.classList.add('active');
    
    showToast('Đã đổi phông chữ: ' + f);
  }

  function setColor(c, el) {
    document.documentElement.style.setProperty('--accent', c);
    
    localStorage.setItem('santino_color', c);
    
    _clearActive('.color-circle');
    // If clicked on the color picker parent (label), we add active to it
    if(el) {
      el.classList.add('active');
      if (el.tagName === 'LABEL') {
        el.style.border = '2px solid var(--bg)';
        el.style.outline = '2px solid ' + c;
        el.style.outlineOffset = '2px';
      }
    }
    
    showToast('Đã đổi màu chủ đạo');
  }

  function setLanguage(l, el) {
    localStorage.setItem('santino_lang', l);
    
    _clearActive('.lang-card');
    if(el) el.classList.add('active');
    
    showToast('Đã đổi ngôn ngữ. Vui lòng tải lại trang để áp dụng!');
  }

  function resetData() {
    if(!confirm('CẢNH BÁO: Reset toàn bộ về dữ liệu mặc định? Các đơn hàng mới tạo sẽ bị xóa vĩnh viễn!')) return;
    ['santino_products','santino_sizes','santino_promotions','santino_orders'].forEach(function(k){localStorage.removeItem(k);});
    DB.initSeed();
    showToast('Đã khôi phục dữ liệu mặc định thành công');
    // Reload page to reflect new DB state immediately
    setTimeout(function() { window.location.reload(); }, 1000);
  }

  return { render:render, setTheme:setTheme, setFont:setFont, setColor:setColor, setLanguage:setLanguage, resetData:resetData };
})();
