var OrdersPage = (function () {
  function render($el) {
    return Router.fetchTemplate('src/pages/orders/orders.html').then(function(html){
      $el.innerHTML = html; 
      var footer = document.getElementById('global-footer');
      if (footer) footer.style.display = 'none';
      var saveBtn = document.getElementById('btn-save-draft');
      if (saveBtn) saveBtn.style.display = 'none';
      _render();
    });
  }
  async function _render(q) {
    q = q || '';
    var orders = [];
    orders = orders.filter(function(o){return !q||o.so_ct.includes(q);}).reverse();
    var tbody = document.getElementById('orders-body');
    var pInfo = document.getElementById('pagination-info');
    if (pInfo) pInfo.textContent = 'Hiển thị ' + orders.length + ' kết quả';

    if(!orders.length){
      tbody.innerHTML='<tr><td colspan="8">' + 
        '<div class="empty-state" style="margin: 40px 0; background: transparent; border: none;">' +
        '<span class="material-symbols-outlined" style="background: var(--bg);">receipt_long</span>' +
        '<p>Chưa có đơn hàng nào</p>' +
        '<small>Bạn chưa có đơn hàng nào trong hệ thống.</small></div>' +
        '</td></tr>';
      return;
    }
    tbody.innerHTML = orders.map(function(o){
      return '<tr>' +
        '<td><strong>'+o.so_ct+'</strong></td>' +
        '<td>'+o.ngay_ct+'</td>' +
        '<td>'+o.chi_nhanh+'</td>'+
        '<td><span class="badge badge-yellow">'+o.ma_ctbh+'</span></td>'+
        '<td style="font-weight:700; text-align:right">'+(o.total_qty||0)+' SP</td>'+
        '<td style="font-weight:700; color:var(--accent); text-align:right">'+Utils.formatMoney(o.total_money||0)+'</td>'+
        '<td style="color:var(--muted)">'+(o.ghi_chu||'—')+'</td>'+
        '<td style="display:flex; gap:6px; justify-content:center">'+
          '<button class="btn btn-ghost btn-sm" style="border:1px solid var(--border);" onclick="OrdersPage.view(\''+o.id+'\')">Chi tiết</button>'+
          '<button class="icon-btn" onclick="OrdersPage.del(\''+o.id+'\')"><span class="material-symbols-outlined" style="font-size: 18px; color:var(--danger)">delete</span></button>'+
        '</td></tr>';
    }).join('');
  }
  function filter(q) { _render(q); }
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
    Router.go('/order-detail');
  }
  return { render:render, filter:filter, del:del, view:view };
})();
