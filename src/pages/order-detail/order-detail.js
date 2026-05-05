var OrderDetailPage = (function () {
  function render($el) {
    return Router.fetchTemplate('src/pages/order-detail/order-detail.html').then(function(html){
      $el.innerHTML = html;
      var id = window._viewOrderId;
      var o = id ? DB.find('orders', id) : null;
      if(!o){$el.innerHTML='<div class="empty-state"><span class="material-symbols-outlined">search_off</span><p>' + t('order.not_found') + '</p></div>';return;}
      document.getElementById('detail-title').textContent = t('btn.detail') + ': '+o.so_ct;
      document.getElementById('detail-info').innerHTML = [
        '<div><small style="color:var(--muted)"><span data-i18n="order.no">' + t('order.no') + '</span></small><div style="font-weight:700">'+o.so_ct+'</div></div>',
        '<div><small style="color:var(--muted)"><span data-i18n="order.date">' + t('order.date') + '</span></small><div>'+o.ngay_ct+'</div></div>',
        '<div><small style="color:var(--muted)"><span data-i18n="order.branch">' + t('order.branch') + '</span></small><div>'+o.chi_nhanh+'</div></div>',
        '<div><small style="color:var(--muted)"><span data-i18n="order.staff">' + t('order.staff') + '</span></small><div>'+o.nhan_vien+'</div></div>',
        '<div><small style="color:var(--muted)"><span data-i18n="order.promo">' + t('order.promo') + '</span></small><div><span class="badge badge-yellow">'+o.ma_ctbh+'</span></div></div>',
        '<div><small style="color:var(--muted)"><span data-i18n="order.total.money">' + t('order.total.money') + '</span></small><div style="font-weight:800;color:var(--accent)">'+Utils.formatMoney(o.total_money||0)+'</div></div>',
        '<div><small style="color:var(--muted)"><span data-i18n="order.note">' + t('order.note') + '</span></small><div>'+(o.ghi_chu||'—')+'</div></div>',
      ].join('');
      document.getElementById('detail-body').innerHTML = (o.lines||[]).map(function(l){
        return '<tr><td>'+l.ten_hang_2+'</td><td style="font-family:monospace;font-size:12px">'+l.sku+'</td>'+
          '<td>'+(l.ten_hang||'')+'</td><td>'+l.size+'</td>'+
          '<td style="font-weight:700;color:var(--accent)">'+l.so_luong+'</td>'+
          '<td>'+Utils.formatMoney(l.don_gia)+'</td>'+
          '<td style="font-weight:700">'+Utils.formatMoney(l.thanh_tien)+'</td>'+
          '<td><span class="badge badge-yellow">'+(l.ma_ctbh||'')+'</span></td>'+
          '<td style="color:var(--muted)">'+(l.ghi_chu||'')+'</td></tr>';
      }).join('');
    });
  }
  return { render:render };
})();
