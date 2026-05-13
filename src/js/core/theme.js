/**
 * theme.js
 * Xử lý khởi tạo giao diện (Dark/Light Mode) và sửa lỗi Favicon hiển thị mờ.
 */
(function () {
  // 1. Khởi tạo Theme
  const savedTheme = localStorage.getItem('santino_theme') || 'auto';
  const isDark = savedTheme === 'dark' || (savedTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  if (isDark) {
    document.documentElement.classList.add('dark-theme');
  }

  // 2. Dynamic Favicon Fix
  // Vẽ lại logo thành màu đen để hiển thị rõ trên tab trình duyệt
  const img = new Image();
  img.src = 'images/logo.png';
  img.crossOrigin = 'anonymous';
  img.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Nhuộm đen logo để hiện rõ trên tab
    ctx.filter = 'brightness(0)';
    ctx.drawImage(img, 0, 0, 32, 32);
    
    // Cập nhật link favicon
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'shortcut icon';
      document.head.appendChild(link);
    }
    link.type = 'image/x-icon';
    link.href = canvas.toDataURL('image/png');
  };
})();
