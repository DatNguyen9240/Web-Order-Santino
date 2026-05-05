var OrdersPage = (function () {
  function render($el) {
    return Router.fetchTemplate('src/pages/orders/orders.html').then(function(html){
      $el.innerHTML = html; _render();
    });
  }
  function _render(q) {
    q = q || '';
    var orders = DB.getAll('orders').filter(function(o){return !q||o.so_ct.includes(q);}).reverse();
    var tbody = document.getElementById('orders-body');
    if(!orders.length){tbody.innerHTML='<tr><td colspan="8" class="empty-state"><span class="material-symbols-outlined">receipt_long</span><span data-i18n="orders.search.empty">' + t('orders.search.empty') + '</span></td></tr>';return;}
    tbody.innerHTML = orders.map(function(o){
      return '<tr><td><strong>'+o.so_ct+'</strong></td><td>'+o.ngay_ct+'</td><td>'+o.chi_nhanh+'</td>'+
        '<td><span class="badge badge-yellow">'+o.ma_ctbh+'</span></td>'+
        '<td style="font-weight:700">'+(o.total_qty||0)+' ' + t('order.preview.sp') + '</td>'+
        '<td style="font-weight:700;color:var(--accent)">'+Utils.formatMoney(o.total_money||0)+'</td>'+
        '<td style="color:var(--muted)">'+(o.ghi_chu||'—')+'</td>'+
        '<td style="display:flex;gap:6px">'+
          '<button class="btn btn-ghost btn-sm" onclick="OrdersPage.view(\''+o.id+'\')">' + t('btn.detail') + '</button>'+
          '<button class="btn-icon" onclick="OrdersPage.del(\''+o.id+'\')"><span class="material-symbols-outlined" style="font-size:16px;color:var(--danger)">delete</span></button>'+
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
        DB.remove('orders', id);
        _render();
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
