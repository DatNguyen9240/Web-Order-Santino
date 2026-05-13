var OrderDetailPage = (function () {
  async function render($el) {
    try {
      // Cho phép trang này hiển thị rộng tối đa màn hình
      $el.classList.add('is-full-width');
      
      const html = await Router.fetchTemplate('src/pages/order-detail/order-detail.html');
      $el.innerHTML = html;
      var id = window._viewOrderId;
      var o = null;

      try {
        const queryObj = { Loai: 'OrderDetail', TimKiem: id };
        const params = { q: JSON.stringify(queryObj), _t: Date.now() };
        const res = await Http.get(API_CONFIG.ENDPOINTS.CATEGORIES.LIST, params);

        if (res && res.records && res.records.length > 0) {
          o = res.records[0];
        } else if (res && res.length > 0) {
          o = res[0];
        }

        if (o && typeof o.lines === 'string') {
          try { o.lines = JSON.parse(o.lines); } catch (e) { }
        }
      } catch (err) {
        console.warn('Lỗi tải chi tiết đơn hàng:', err);
      }

      if (!o) {
        $el.innerHTML = '<div class="empty-state"><span class="material-symbols-outlined">search_off</span><p>' + t('order.not_found') + '</p></div>';
        return;
      }

      document.getElementById('detail-title').textContent = t('btn.detail') + ': ' + o.so_ct;
      document.getElementById('detail-info').innerHTML = [
        '<div style="flex: 1 1 auto; min-width: 140px"><small style="color:var(--muted)"><span data-i18n="order.no">' + t('order.no') + '</span></small><div style="font-weight:700">' + o.so_ct + '</div></div>',
        '<div style="flex: 1 1 auto; min-width: 140px"><small style="color:var(--muted)"><span data-i18n="order.date">' + t('order.date') + '</span></small><div>' + (o.ngay_ct || '—') + '</div></div>',
        '<div style="flex: 1 1 auto; min-width: 140px"><small style="color:var(--muted)"><span data-i18n="order.branch">' + t('order.branch') + '</span></small><div>' + (o.chi_nhanh || '—') + '</div></div>',
        '<div style="flex: 1 1 auto; min-width: 140px"><small style="color:var(--muted)"><span data-i18n="order.staff">' + t('order.staff') + '</span></small><div>' + (o.nvkd || '—') + '</div></div>',
        '<div style="flex: 1.5 1 auto; min-width: 200px"><small style="color:var(--muted)"><span data-i18n="order.promo">' + t('order.promo') + '</span></small><div><span class="badge badge-yellow">' + (o.ma_ctbh || 'Không') + '</span></div></div>',
        '<div style="flex: 1 1 auto; min-width: 140px"><small style="color:var(--muted)"><span data-i18n="order.total.money">' + t('order.total.money') + '</span></small><div style="font-weight:800;color:var(--accent)">' + Utils.formatMoney(o.total_money || 0) + '</div></div>',
        '<div style="flex: 1 1 auto; min-width: 140px"><small style="color:var(--muted)"><span data-i18n="order.note">' + t('order.note') + '</span></small><div>' + (o.ghi_chu || '—') + '</div></div>',
      ].join('');
      document.getElementById('detail-body').innerHTML = (o.lines || []).map(function (l) {
        return '<tr><td>' + l.ten_hang_2 + '</td><td style="font-family:monospace;font-size: calc(12px * var(--text-scale, 1))">' + l.sku + '</td>' +
          '<td>' + (l.ten_hang || '') + '</td><td>' + l.size + '</td>' +
          '<td style="font-weight:700;color:var(--accent)">' + l.so_luong + '</td>' +
          '<td>' + Utils.formatMoney(l.don_gia) + '</td>' +
          '<td style="font-weight:700">' + Utils.formatMoney(l.thanh_tien) + '</td></tr>';
      }).join('');
    } catch (e) {
      console.warn('Lỗi render order detail:', e);
    }
  }
  return { render: render };
})();
