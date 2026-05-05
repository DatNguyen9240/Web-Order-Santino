var OrderDetailPage = (function () {
  function render($el) {
    return Router.fetchTemplate('src/pages/order-detail/order-detail.html').then(function(html){
      $el.innerHTML = html;
      var id = window._viewOrderId;
      var o = id ? DB.find('orders', id) : null;
      if(!o){$el.innerHTML='<div class="empty-state"><span class="material-symbols-outlined">search_off</span><p>Không tìm thấy đơn hàng</p></div>';return;}
      document.getElementById('detail-title').textContent = 'Chi tiết: '+o.so_ct;
      document.getElementById('detail-info').innerHTML = [
        '<div><small style="color:var(--muted)">Số CT</small><div style="font-weight:700">'+o.so_ct+'</div></div>',
        '<div><small style="color:var(--muted)">Ngày CT</small><div>'+o.ngay_ct+'</div></div>',
        '<div><small style="color:var(--muted)">Chi nhánh</small><div>'+o.chi_nhanh+'</div></div>',
        '<div><small style="color:var(--muted)">Nhân viên</small><div>'+o.nhan_vien+'</div></div>',
        '<div><small style="color:var(--muted)">CTKM</small><div><span class="badge badge-yellow">'+o.ma_ctbh+'</span></div></div>',
        '<div><small style="color:var(--muted)">Tổng tiền</small><div style="font-weight:800;color:var(--accent)">'+Utils.formatMoney(o.total_money||0)+'</div></div>',
        '<div><small style="color:var(--muted)">Ghi chú</small><div>'+(o.ghi_chu||'—')+'</div></div>',
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
