var SettingsPage = (function () {
  function render($el) {
    return Router.fetchTemplate('src/pages/settings/settings.html').then(function(html){
      $el.innerHTML = html;
    });
  }
  function setTheme(t) {
    if(t==='dark') document.documentElement.classList.add('dark-theme');
    else document.documentElement.classList.remove('dark-theme');
    localStorage.setItem('santino_theme', t);
    showToast('Đã chuyển giao diện: '+(t==='dark'?'Tối':'Sáng'));
  }
  function resetData() {
    if(!confirm('Reset toàn bộ về dữ liệu mặc định? Đơn hàng sẽ bị xóa!'))return;
    ['santino_products','santino_sizes','santino_promotions','santino_orders'].forEach(function(k){localStorage.removeItem(k);});
    DB.initSeed();
    showToast('Đã reset dữ liệu về mặc định');
  }
  return { render:render, setTheme:setTheme, resetData:resetData };
})();
