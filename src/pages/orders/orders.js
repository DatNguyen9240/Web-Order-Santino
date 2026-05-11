var OrdersPage = (function () {
  function render($el) {
    return Router.fetchTemplate('src/pages/orders/orders.html').then(function(html){
      $el.innerHTML = html; _render();
    });
  }
  async function _render() {
    var qInput = document.getElementById('orders-search');
    var fromInput = document.getElementById('orders-from');
    var toInput = document.getElementById('orders-to');
    
    var q = qInput ? qInput.value : '';
    var fromDate = fromInput ? fromInput.value : '';
    var toDate = toInput ? toInput.value : '';

    var orders = [];
    try {
      const queryObj = { Loai: 'Order' };
      // Gói chung vào TimKiem dạng JSON
      const timKiemData = {};
      if (q && q.trim()) timKiemData.q = q.trim();
      if (fromDate) timKiemData.from = fromDate;
      if (toDate) timKiemData.to = toDate;
      
      if (Object.keys(timKiemData).length > 0) {
        queryObj.TimKiem = JSON.stringify(timKiemData);
      }
      
      const params = { q: JSON.stringify(queryObj), _t: Date.now() };
      
      const res = await Http.get(API_CONFIG.ENDPOINTS.CATEGORIES.LIST, params);
      orders = res.records || res;
      if (!Array.isArray(orders)) orders = [];
    } catch (err) {
      console.warn('Lỗi tải danh sách đơn hàng:', err);
    }
    var tbody = document.getElementById('orders-body');
    if(!orders || !orders.length){
      tbody.innerHTML='<tr><td colspan="8" class="empty-state"><span class="material-symbols-outlined">receipt_long</span><span data-i18n="orders.search.empty">Không có đơn hàng nào</span></td></tr>';
      return;
    }
    tbody.innerHTML = orders.map(function(o){
      return '<tr><td><strong>'+o.so_ct+'</strong></td><td>'+o.ngay_ct+'</td><td>'+o.chi_nhanh+'</td>'+
        '<td>'+(o.ma_ctbh ? '<span class="badge badge-yellow">'+o.ma_ctbh+'</span>' : '<span style="color:var(--muted)">—</span>')+'</td>'+
        '<td style="font-weight:700">'+(o.total_qty||0)+' ' + t('order.preview.sp') + '</td>'+
        '<td style="font-weight:700;color:var(--accent)">'+Utils.formatMoney(o.total_money||0)+'</td>'+
        '<td style="color:var(--muted)">'+(o.ghi_chu||'—')+'</td>'+
        '<td style="display:flex;gap:6px">'+
          '<button class="btn btn-ghost btn-sm" onclick="OrdersPage.view(\''+o.id+'\')">' + t('btn.detail') + '</button>'+
          '<button class="btn-icon" onclick="OrdersPage.del(\''+o.id+'\')"><span class="material-symbols-outlined" style="font-size: calc(16px * var(--text-scale, 1));color:var(--danger)">delete</span></button>'+
        '</td></tr>';
    }).join('');
  }
  var _searchTimeout = null;
  function filter() { 
    if (_searchTimeout) clearTimeout(_searchTimeout);
    _searchTimeout = setTimeout(function() {
      _render();
    }, 500);
  }
  function del(id) {
    ConfirmModal.show({
      title: t('order.delete.title'),
      message: t('order.delete.msg'),
      confirmText: t('btn.delete'),
      confirmClass: 'btn-danger',
      onConfirm: function() {
        showToast('Chức năng xóa đã vô hiệu hóa (chưa có API)');
        showToast(t('toast.order_deleted'));
      }
    });
  }
  function view(id) {
    window._viewOrderId = id;
    Router.go('/order-detail?id=' + id);
  }
  return { render:render, filter:filter, del:del, view:view };
})();
