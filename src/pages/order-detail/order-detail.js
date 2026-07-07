var OrderDetailPage = (function () {
  var gridApi = null;
  var allLines = [];
  var currentPage = 1;
  var itemsPerPage = 10;

  function renderLines() {
    var container = document.getElementById('detail-grid-container');
    if (!container) return;

    var pageLines = allLines.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    var gridOptions = {
      pagination: false,
      columnDefs: [
        { field: 'ten_hang_2', headerName: (typeof t !== 'undefined' ? t('table.col.name2') : 'Tên hàng 2'), cellStyle: { fontWeight: '700' } },
        { field: 'ten_hang', headerName: (typeof t !== 'undefined' ? t('table.col.product_name') : 'Tên hàng hóa'), minWidth: 150 },
        { 
          field: 'chi_tiet_size', 
          headerName: (typeof t !== 'undefined' ? t('table.col.size') : 'Size'),
          minWidth: 150,
          cellStyle: { color: 'var(--text-secondary, #6b7280)', fontSize: '13px' },
          cellRenderer: function(params) {
            var val = params.value;
            if (!val) return '—';
            try {
              var arr = typeof val === 'string' ? JSON.parse(val) : val;
              if (Array.isArray(arr)) {
                return arr.map(function(s) { return s.size + '(' + s.qty + ')'; }).join(', ');
              }
            } catch (e) {
              console.warn('Error parsing size details:', e);
            }
            return val;
          }
        },
        { 
          field: 'so_luong', 
          headerName: (typeof t !== 'undefined' ? t('order.col.qty') : 'SL'),
          cellStyle: { color: 'var(--accent, #4F46E5)', fontWeight: '700' }
        },
        { 
          field: 'don_gia', 
          headerName: (typeof t !== 'undefined' ? t('table.col.price') : 'Đơn giá'),
          valueFormatter: function(params) {
            if (typeof Utils !== 'undefined' && Utils.formatMoney) {
              return Utils.formatMoney(params.value || 0);
            }
            return params.value;
          }
        },
        { 
          field: 'thanh_tien', 
          headerName: (typeof t !== 'undefined' ? t('order.total.money') : 'Thành tiền'),
          cellStyle: { fontWeight: '700' },
          valueFormatter: function(params) {
            if (typeof Utils !== 'undefined' && Utils.formatMoney) {
              return Utils.formatMoney(params.value || 0);
            }
            return params.value;
          }
        }
      ],
      rowData: pageLines
    };

    if (!gridApi) {
      gridApi = AppGrid.create(container, gridOptions);
    } else {
      gridApi.setGridOption('rowData', pageLines);
    }

    // Render custom Pagination
    var paginationContainer = document.getElementById('detail-pagination');
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
      allLines = [];
      currentPage = 1;
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
