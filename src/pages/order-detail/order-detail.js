var OrderDetailPage = (function () {
  var currentPage = 1;
  var itemsPerPage = 10;
  var allLines = [];

  function renderLines() {
    var tbody = document.getElementById('detail-body');
    var paginationContainer = document.getElementById('detail-pagination');
    if (!tbody) return;

    var startIndex = (currentPage - 1) * itemsPerPage;
    var endIndex = startIndex + itemsPerPage;
    var paginatedLines = allLines.slice(startIndex, endIndex);

    if (paginatedLines.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-state"><span class="material-symbols-outlined">inbox</span><p>' + t('table.empty') + '</p></td></tr>';
      if (paginationContainer) paginationContainer.innerHTML = '';
      return;
    }

    tbody.innerHTML = paginatedLines.map(function (l) {
      var sizesText = '—';
      if (l.chi_tiet_size) {
        try {
          var sizesArr = typeof l.chi_tiet_size === 'string' ? JSON.parse(l.chi_tiet_size) : l.chi_tiet_size;
          sizesText = sizesArr.map(function (s) { return s.size + '(' + s.qty + ')' }).join(', ');
        } catch (e) { }
      }
      return '<tr onclick="Utils.toggleRow(this)"><td>' + (l.ten_hang_2 || '—') + '</td>' +
        '<td>' + (l.ten_hang || '—') + '</td><td style="font-size: calc(12px * var(--text-scale, 1)); color: var(--text-secondary)">' + sizesText + '</td>' +
        '<td style="font-weight:700;color:var(--accent)">' + l.so_luong + '</td>' +
        '<td>' + Utils.formatMoney(l.don_gia) + '</td>' +
        '<td style="font-weight:700">' + Utils.formatMoney(l.thanh_tien) + '</td></tr>';
    }).join('');

    if (paginationContainer) {
      paginationContainer.innerHTML = '';
      if (allLines.length > 0 && typeof Pagination !== 'undefined') {
        var pag = Pagination.create({
          totalItems: allLines.length,
          itemsPerPage: itemsPerPage,
          currentPage: currentPage,
          onPageChange: function (page) {
            currentPage = page;
            renderLines();
          }
        });
        paginationContainer.appendChild(pag);
      }
    }
  }

  async function render($el) {
    try {
      currentPage = 1;
      allLines = [];
      // Cho phép trang này hiển thị rộng tối đa màn hình
      $el.classList.add('is-full-width');

      const html = await Router.fetchTemplate('src/pages/order-detail/order-detail.html');
      $el.innerHTML = html;
      var id = window._viewOrderId;
      var o = null;

      try {
        const queryObj = { Loai: 'OrderDetail', TimKiem: id };

        var user = JSON.parse(localStorage.getItem('santino_user') || '{}');
        var role = user.role || user.Group || '';
        var empID = user.EmployeeID || '';
        var objID = user.ObjectID || '';
        if (objID && objID !== '') {
          empID = '';
        }
        queryObj.chinhanh = '|PAGE:1|ROLE:' + role + '|EMP:' + empID + '|OBJ:' + objID;

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

      allLines = o.lines || [];

      document.getElementById('detail-title').textContent = t('btn.detail') + ': ' + o.so_ct;
      document.getElementById('detail-info').innerHTML = `
        <table>
          <tbody>
            <tr>
              <td class="info-label" data-i18n="order.no">${t('order.no')}</td>
              <td class="info-value highlight-code">${o.so_ct}</td>
            </tr>
            <tr>
              <td class="info-label" data-i18n="order.date">${t('order.date')}</td>
              <td class="info-value">${o.ngay_ct || '—'}</td>
            </tr>
            <tr>
              <td class="info-label" data-i18n="order.branch">${t('order.branch')}</td>
              <td class="info-value">${o.chi_nhanh || '—'}</td>
            </tr>
            <tr>
              <td class="info-label" data-i18n="order.staff">${t('order.staff')}</td>
              <td class="info-value">${o.nvkd || '—'}</td>
            </tr>
            <tr>
              <td class="info-label" data-i18n="order.promo">${t('order.promo')}</td>
              <td class="info-value">
                ${o.ma_ctbh && o.ma_ctbh !== 'Không' && o.ma_ctbh !== 'none' ? `<span class="order-promo-badge"><span class="material-symbols-outlined" style="font-size:16px;">sell</span>${o.ma_ctbh}</span>` : '<span style="color:var(--muted)">—</span>'}
              </td>
            </tr>
            <tr>
              <td class="info-label" data-i18n="order.total.money">${t('order.total.money')}</td>
              <td class="info-value highlight-money">${Utils.formatMoney(o.total_money || 0)}</td>
            </tr>
            <tr>
              <td colspan="2" style="border-bottom: none; padding-top: 8px;">
                <span class="info-label" data-i18n="order.note" style="display: block; margin-bottom: 4px;">${t('order.note')}</span>
                <div class="order-info-note-box">
                  ${o.ghi_chu || '—'}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      `;

      renderLines();
    } catch (e) {
      console.warn('Lỗi render order detail:', e);
    }
  }
  return { render: render };
})();
