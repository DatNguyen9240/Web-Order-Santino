/**
 * SoundUtils — Quản lý hiệu ứng âm thanh (Web Audio API & MP3)
 * Chơi file âm thanh được tải về từ bên ngoài để dễ dàng tùy biến.
 */
var SoundUtils = (function () {
  // Sửa lại đường dẫn thêm src/ vì index.html nằm ở thư mục gốc
  var clickAudio = new Audio('src/assets/sounds/click.mp3');
  // Thêm file âm thanh cho Sidebar (Mở hòm/Inventory)
  var sidebarAudio = new Audio('src/assets/sounds/chest-opens-minecraft-sound-fx.wav');

  function playThemeToggle(isDark) {
    if (!clickAudio) return;

    // Reset lại thời gian về 0 để có thể click liên tục nhiều lần không bị độ trễ
    clickAudio.currentTime = 0;
    
    // Phát âm thanh, dùng catch để bỏ qua lỗi nếu trình duyệt chặn tự động phát
    clickAudio.play().catch(function(error) {
      console.warn('Trình duyệt chưa cho phép phát âm thanh, hoặc không tìm thấy file click.mp3:', error);
    });
  }

  // Âm thanh khi mở Sidebar (Mở hòm/Inventory)
  function playSidebarOpen() {
    // Tạm tắt tiếng theo yêu cầu
    /*
    if (!sidebarAudio) return;
    
    sidebarAudio.currentTime = 0;
    sidebarAudio.play().catch(function(error) {
      console.warn('Không thể phát âm thanh sidebar, hoặc không tìm thấy file chest-opens-minecraft-sound-fx.wav:', error);
    });
    */
  }

  return {
    playThemeToggle: playThemeToggle,
    playSidebarOpen: playSidebarOpen
  };
})();