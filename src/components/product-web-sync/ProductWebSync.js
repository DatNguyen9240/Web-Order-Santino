/**
 * Product Web Sync Component
 */
var UIProductWebSync = (function () {
  /**
   * Tạo component thanh đồng bộ sản phẩm qua Web đặt hàng
   * @param {Object} options - { onSync, onUnsync }
   */
  function create(options) {
    options = options || {};

    var container = document.createElement('div');
    container.className = 'product-web-sync-toolbar';
    container.style.display = 'flex';
    container.style.gap = '12px';
    container.style.alignItems = 'center';

    var btnSync = document.createElement('button');
    btnSync.className = 'btn btn-success btn-sm';
    btnSync.style.whiteSpace = 'nowrap';
    btnSync.style.height = '30px';
    btnSync.style.padding = '0 10px';
    btnSync.style.fontSize = '12px';
    btnSync.innerHTML = '<span class="material-symbols-outlined" style="font-size: calc(13px * var(--text-scale, 1)); vertical-align: middle;">public</span><span>Lấy sang Web</span>';
    btnSync.addEventListener('click', function () {
      if (typeof options.onSync === 'function') {
        options.onSync();
      }
    });

    var btnUnsync = document.createElement('button');
    btnUnsync.className = 'btn btn-danger btn-sm';
    btnUnsync.style.whiteSpace = 'nowrap';
    btnUnsync.style.height = '30px';
    btnUnsync.style.padding = '0 10px';
    btnUnsync.style.fontSize = '12px';
    btnUnsync.innerHTML = '<span class="material-symbols-outlined" style="font-size: calc(13px * var(--text-scale, 1)); vertical-align: middle;">public_off</span><span>Hủy lấy sang Web</span>';
    btnUnsync.addEventListener('click', function () {
      if (typeof options.onUnsync === 'function') {
        options.onUnsync();
      }
    });

    container.appendChild(btnSync);
    container.appendChild(btnUnsync);

    return container;
  }

  return {
    create: create
  };
})();
