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
    btnSync.className = 'btn';
    btnSync.style.cssText = 'white-space: nowrap; height: 42px; background: #059669; color: white; display: flex; align-items: center; gap: 4px; border: none; cursor: pointer;';
    btnSync.innerHTML = '<span class="material-symbols-outlined" style="font-size: calc(16px * var(--text-scale, 1)); vertical-align: middle;">public</span><span>Lấy sang Web</span>';
    btnSync.addEventListener('click', function () {
      if (typeof options.onSync === 'function') {
        options.onSync();
      }
    });

    var btnUnsync = document.createElement('button');
    btnUnsync.className = 'btn';
    btnUnsync.style.cssText = 'white-space: nowrap; height: 42px; background: #dc2626; color: white; display: flex; align-items: center; gap: 4px; border: none; cursor: pointer;';
    btnUnsync.innerHTML = '<span class="material-symbols-outlined" style="font-size: calc(16px * var(--text-scale, 1)); vertical-align: middle;">public_off</span><span>Hủy lấy sang Web</span>';
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
