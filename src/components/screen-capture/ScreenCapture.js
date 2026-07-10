/* ═══════════════════════════════════════════
   SCREEN CAPTURE COMPONENT (Canvas-based)
   ═══════════════════════════════════════════ */
var ScreenCapture = (function () {

  var overlayCanvas = null;
  var ctx = null;
  var startX = 0, startY = 0;
  var isDrawing = false;
  var currentRect = null;
  var currentCallback = null;
  var ww = 0, wh = 0;
  
  var mode = 'select'; // 'select' | 'draw'
  var shapes = []; // {left, top, width, height}
  var shapeStartX = 0, shapeStartY = 0;
  var currentShape = null;

  var toolbar = null;
  var isShapeModeActive = false; // Bắt buộc click nút mới được vẽ

  function showMsg(msg, isSuccess) {
    if (typeof showToast !== 'undefined') {
      showToast(msg, isSuccess);
    } else if (typeof UIToast !== 'undefined') {
      UIToast.show(msg, isSuccess ? 'success' : 'error');
    } else {
      console.log(msg);
    }
  }

  function initOverlay() {
    if (overlayCanvas) return;
    
    ww = window.innerWidth;
    wh = window.innerHeight;
    
    mode = 'select';
    shapes = [];
    currentRect = null;
    currentShape = null;
    isDrawing = false;
    isShapeModeActive = false;

    overlayCanvas = document.createElement('canvas');
    overlayCanvas.className = 'screen-capture-canvas';
    overlayCanvas.width = ww;
    overlayCanvas.height = wh;
    
    ctx = overlayCanvas.getContext('2d');
    
    document.body.appendChild(overlayCanvas);
    
    drawMask(0, 0, 0, 0); 
    
    overlayCanvas.addEventListener('mousedown', onMouseDown);
    overlayCanvas.addEventListener('mousemove', onMouseMove);
    overlayCanvas.addEventListener('mouseup', onMouseUp);
    document.addEventListener('keydown', onKeyDown);
  }

  function destroyOverlay() {
    if (overlayCanvas) {
      overlayCanvas.removeEventListener('mousedown', onMouseDown);
      overlayCanvas.removeEventListener('mousemove', onMouseMove);
      overlayCanvas.removeEventListener('mouseup', onMouseUp);
      if (overlayCanvas.parentNode) {
        document.body.removeChild(overlayCanvas);
      }
      overlayCanvas = null;
      ctx = null;
    }
    if (toolbar) {
      if (toolbar.parentNode) document.body.removeChild(toolbar);
      toolbar = null;
    }
    document.removeEventListener('keydown', onKeyDown);
  }

  function createToolbarBtn(icon, title, onClick) {
    var btn = document.createElement('button');
    btn.innerHTML = '<span class="material-symbols-outlined">' + icon + '</span>';
    btn.title = title;
    btn.onclick = onClick;
    return btn;
  }

  function showToolbar() {
    if (!toolbar) {
      toolbar = document.createElement('div');
      toolbar.className = 'screen-capture-toolbar';
      
      var btnRect = createToolbarBtn('crop_square', 'Vẽ khung đỏ', function() {
        isShapeModeActive = true;
        btnRect.classList.add('active');
        overlayCanvas.style.cursor = 'crosshair';
      });
      
      var btnCopy = createToolbarBtn('content_copy', 'Copy (Ctrl+C)', function() {
        captureAndAction();
      });
      btnCopy.classList.add('btn-copy');

      var btnClose = createToolbarBtn('close', 'Hủy (ESC)', function() {
        destroyOverlay();
      });
      btnClose.classList.add('btn-close');
      
      toolbar.appendChild(btnRect);
      var divider = document.createElement('div');
      divider.style.width = '1px';
      divider.style.background = 'var(--border, #E5E7EB)';
      divider.style.margin = '4px';
      toolbar.appendChild(divider);
      toolbar.appendChild(btnCopy);
      toolbar.appendChild(btnClose);
      
      document.body.appendChild(toolbar);
    }
    
    toolbar.style.display = 'flex';
    
    // Position toolbar at bottom right of the selection
    var tLeft = currentRect.left + currentRect.width - 120;
    var tTop = currentRect.top + currentRect.height + 10;
    if (tLeft < 10) tLeft = 10;
    if (tTop + 50 > wh) tTop = currentRect.top - 50;
    
    toolbar.style.left = tLeft + 'px';
    toolbar.style.top = tTop + 'px';
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      destroyOverlay();
    } else if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      if (mode === 'draw' && currentRect) {
        e.preventDefault();
        captureAndAction();
      }
    }
  }

  function drawMask(x, y, w, h) {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, ww, wh); // Xóa sạch canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, 0, ww, wh);

    if (mode === 'select') {
      if (w > 0 && h > 0) {
        ctx.clearRect(x, y, w, h);
        ctx.strokeStyle = '#4F46E5';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(x, y, w, h);
      }
      
      if (!isDrawing && w === 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(ww/2 - 150, 20, 300, 40);
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Nhấn và kéo chuột để chọn vùng', ww/2, 45);
      }
    } else if (mode === 'draw') {
      ctx.clearRect(currentRect.left, currentRect.top, currentRect.width, currentRect.height);
      ctx.strokeStyle = '#4F46E5';
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.strokeRect(currentRect.left, currentRect.top, currentRect.width, currentRect.height);
      
      ctx.strokeStyle = '#EF4444'; // Red
      ctx.lineWidth = 3;
      
      shapes.forEach(function(s) {
        ctx.strokeRect(s.left, s.top, s.width, s.height);
      });
      
      if (isDrawing && currentShape && isShapeModeActive) {
        ctx.strokeRect(currentShape.left, currentShape.top, currentShape.width, currentShape.height);
      }
    }
  }

  function onMouseDown(e) {
    if (mode === 'select') {
      isDrawing = true;
      startX = e.clientX;
      startY = e.clientY;
      drawMask(startX, startY, 0, 0);
    } else if (mode === 'draw') {
      if (!isShapeModeActive) return; // Không cho vẽ nếu chưa click nút hình
      
      var cx = e.clientX;
      var cy = e.clientY;
      
      // Chỉ cho phép vẽ bên trong vùng đã chọn
      if (cx >= currentRect.left && cx <= currentRect.left + currentRect.width &&
          cy >= currentRect.top && cy <= currentRect.top + currentRect.height) {
        isDrawing = true;
        shapeStartX = cx;
        shapeStartY = cy;
        currentShape = { left: shapeStartX, top: shapeStartY, width: 0, height: 0 };
        if (toolbar) toolbar.style.display = 'none'; // Ẩn toolbar khi đang vẽ cho đỡ vướng
      }
    }
  }

  var rafId = null;
  function onMouseMove(e) {
    if (!isDrawing) return;
    var currentX = e.clientX;
    var currentY = e.clientY;

    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(function() {
      if (mode === 'select') {
        var left = Math.min(startX, currentX);
        var top = Math.min(startY, currentY);
        var width = Math.abs(currentX - startX);
        var height = Math.abs(currentY - startY);
        drawMask(left, top, width, height);
      } else if (mode === 'draw') {
        if (!isShapeModeActive) return;
        
        // Giới hạn trong currentRect
        var limitedX = Math.max(currentRect.left, Math.min(currentX, currentRect.left + currentRect.width));
        var limitedY = Math.max(currentRect.top, Math.min(currentY, currentRect.top + currentRect.height));
        
        var sLeft = Math.min(shapeStartX, limitedX);
        var sTop = Math.min(shapeStartY, limitedY);
        var sWidth = Math.abs(limitedX - shapeStartX);
        var sHeight = Math.abs(limitedY - shapeStartY);
        
        currentShape = { left: sLeft, top: sTop, width: sWidth, height: sHeight };
        drawMask();
      }
    });
  }

  function onMouseUp(e) {
    if (!isDrawing) return;
    isDrawing = false;
    
    if (mode === 'select') {
      var endX = e.clientX;
      var endY = e.clientY;
      var left = Math.min(startX, endX);
      var top = Math.min(startY, endY);
      var width = Math.abs(endX - startX);
      var height = Math.abs(endY - startY);

      if (width > 20 && height > 20) {
        currentRect = { left: left, top: top, width: width, height: height };
        mode = 'draw';
        overlayCanvas.style.cursor = 'default';
        drawMask();
        showToolbar();
      } else {
        destroyOverlay(); 
      }
    } else if (mode === 'draw') {
      if (currentShape && currentShape.width > 5 && currentShape.height > 5) {
        shapes.push(currentShape);
      }
      currentShape = null;
      drawMask();
      if (toolbar) toolbar.style.display = 'flex';
    }
  }

  function captureAndAction() {
    if (typeof html2canvas === 'undefined') {
      showMsg('Thư viện html2canvas chưa load!', false);
      destroyOverlay();
      return;
    }

    // Ẩn UI
    if (toolbar) toolbar.style.display = 'none';

    var shapeContainer = document.createElement('div');
    shapeContainer.className = 'screen-capture-shape-container';

    shapes.forEach(function(s) {
      var div = document.createElement('div');
      div.className = 'screen-capture-shape';
      div.style.left = (s.left + window.scrollX) + 'px';
      div.style.top = (s.top + window.scrollY) + 'px';
      div.style.width = s.width + 'px';
      div.style.height = s.height + 'px';
      shapeContainer.appendChild(div);
    });
    document.body.appendChild(shapeContainer);

    destroyOverlay(); // Xóa canvas
    
    showMsg('Đang xử lý ảnh...', true);

    var isDone = false;
    var timeoutId = setTimeout(function() {
      if (!isDone) {
        showMsg('Xử lý ảnh quá lâu!', false);
        if (shapeContainer.parentNode) document.body.removeChild(shapeContainer);
        isDone = true;
      }
    }, 5000);

    try {
      html2canvas(document.body, {
        x: currentRect.left + window.scrollX,
        y: currentRect.top + window.scrollY,
        width: currentRect.width,
        height: currentRect.height,
        useCORS: true,
        allowTaint: true,
        scale: 1,
        logging: false,
        backgroundColor: null
      }).then(function(canvas) {
        if (isDone) return;
        isDone = true;
        clearTimeout(timeoutId);
        
        if (shapeContainer.parentNode) document.body.removeChild(shapeContainer);

        if (currentCallback) {
          currentCallback(canvas);
          return;
        }

        function fallbackDownload() {
          try {
            var imgData = canvas.toDataURL('image/png');
            var a = document.createElement('a');
            a.href = imgData;
            a.download = 'screenshot_' + new Date().getTime() + '.png';
            a.click();
            showMsg('Đã lưu ảnh về máy!', true);
          } catch (e) {
            showMsg('Không thể xuất ảnh: Lỗi bảo mật CORS trình duyệt!', false);
          }
        }

        try {
          canvas.toBlob(function(blob) {
            if (!blob) return fallbackDownload();
            if (navigator.clipboard && window.ClipboardItem) {
              navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]).then(function() {
                showMsg('Đã copy ảnh!', true);
              }).catch(function() { fallbackDownload(); });
            } else {
              fallbackDownload();
            }
          });
        } catch (e) {
          fallbackDownload();
        }
      }).catch(function(err) {
        if (isDone) return;
        isDone = true;
        clearTimeout(timeoutId);
        if (shapeContainer.parentNode) document.body.removeChild(shapeContainer);
        showMsg('Lỗi chụp hình: ' + ((err && err.message) || 'Lỗi bảo mật hoặc CORS'), false);
      });
    } catch(err) {
      if (isDone) return;
      isDone = true;
      clearTimeout(timeoutId);
      if (shapeContainer.parentNode) document.body.removeChild(shapeContainer);
      showMsg('Lỗi chụp hình: ' + ((err && err.message) || 'Lỗi hệ thống'), false);
    }
  }

  function start(onCaptureCallback) {
    currentCallback = onCaptureCallback || null;
    initOverlay();
  }

  return {
    start: start
  };
})();
