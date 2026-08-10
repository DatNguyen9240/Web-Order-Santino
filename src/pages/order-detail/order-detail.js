var OrderDetailPage = (function () {
  var gridApi = null;
  var allLines = [];
  var currentPage = 1;
  var itemsPerPage = 10;
  var $container = null;
  var currentOrderData = null;
  var currentOrder = null;
  var orderMetadata = null;

  function _splitColumnNames(value) {
    return String(value || '').split(';').map(function (name) {
      return name.trim();
    }).filter(Boolean);
  }

  function _isHiddenField(field, config) {
    var hiddenNames = _splitColumnNames(config && config.hideColumnArr).map(function (name) {
      return name.toLowerCase();
    });
    var showInGrid = field && field.showInGrid;
    return hiddenNames.indexOf(String(field.name).toLowerCase()) >= 0
      || showInGrid === false
      || showInGrid === 0
      || showInGrid === '0'
      || String(showInGrid).toLowerCase() === 'false';
  }

  function _configuredDetailFields(metadata) {
    var fields = (metadata && metadata.detailFields) || [];
    var config = metadata && metadata.detailConfig;
    var byName = {};
    fields.forEach(function (field) {
      byName[String(field.name).toLowerCase()] = field;
    });

    var configuredNames = _splitColumnNames(config && config.defaultColumnArr);
    var selectedFields = configuredNames.length
      ? configuredNames.map(function (name) { return byName[name.toLowerCase()]; }).filter(Boolean)
      : fields.slice().sort(function (a, b) {
        return Number(a.orderNo || 0) - Number(b.orderNo || 0);
      });

    return selectedFields.filter(function (field) {
      return !_isHiddenField(field, config);
    });
  }

  function _buildDetailColumnDefs(metadata) {
    return _configuredDetailFields(metadata).map(function (field) {
      var renderRule = String(field.renderRule || '').trim().toUpperCase();
      var column = {
        field: field.name,
        headerName: field.label || field.name,
        minWidth: String(field.dataType || '').toLowerCase().indexOf('char') >= 0 ? 150 : 110
      };

      if (renderRule === 'N') {
        column.cellStyle = { color: 'var(--accent, #4F46E5)', fontWeight: '700' };
      } else if (renderRule === 'B') {
        column.valueFormatter = function (params) {
          if (typeof Utils !== 'undefined' && Utils.formatMoney) {
            return Utils.formatMoney(params.value || 0);
          }
          return params.value;
        };
      } else if (renderRule === 'SIZE' || String(field.name).toLowerCase() === 'size') {
        column.cellStyle = { color: 'var(--text-secondary, #6b7280)', fontSize: '13px' };
        column.cellRenderer = function (params) {
          var val = params.value;
          if (!val) return '—';
          try {
            var arr = typeof val === 'string' ? JSON.parse(val) : val;
            if (Array.isArray(arr)) {
              return arr.map(function (s) {
                var size = s.Size !== undefined ? s.Size : s.size;
                var quantity = s.Quantity !== undefined ? s.Quantity : (s.qty !== undefined ? s.qty : s.Qty);
                return size + '(' + quantity + ')';
              }).join(', ');
            }
          } catch (e) {
            console.warn('Error parsing size details:', e);
          }
          return val;
        };
      }
      return column;
    });
  }

  async function bindPrintButton() {
    var button = document.getElementById('order-detail-print');
    if (!button) return;

    button.hidden = true;
    var canPrint = typeof PermissionsService !== 'undefined'
      && typeof PermissionsService.canExportExcel === 'function'
      && await PermissionsService.canExportExcel('WEB_OrderDetailFrm');
    button.hidden = !canPrint;
    if (!canPrint) return;

    button.onclick = async function () {
      if (!currentOrder || typeof OrderPrintService === 'undefined') return;
      button.disabled = true;
      try {
        var stillAllowed = await PermissionsService.canExportExcel('WEB_OrderDetailFrm');
        if (!stillAllowed) {
          button.hidden = true;
          if (typeof Alert !== 'undefined') Alert.warning('Không có quyền', 'Bạn không có quyền in/xuất đơn hàng.');
          return;
        }
        await printOrder();
      } catch (err) {
        console.error('Lỗi khi in đơn hàng:', err);
      } finally {
        button.disabled = false;
      }
    };
  }

  function renderLines() {
    var container = document.getElementById('detail-grid-container');
    if (!container) return;

    var pageLines = allLines.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    var gridOptions = {
      pagination: false,
      columnDefs: _buildDetailColumnDefs(orderMetadata),
      rowData: pageLines
    };

    if (!gridApi) {
      gridApi = AppGrid.create(container, gridOptions);
    } else {
      gridApi.setGridOption('rowData', pageLines);
    }

    if (gridApi && typeof gridApi.sizeColumnsToFit === 'function') {
      setTimeout(function () {
        gridApi.sizeColumnsToFit();
      }, 50);
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
          },
          onRefresh: function () {
            loadOrderDetailData();
          }
        });
        paginationContainer.appendChild(pag);
      }
    }
  }

  async function render($el) {
    $container = $el;
    try {
      gridApi = null;
      allLines = [];
      currentPage = 1;
      currentOrderData = null;
      currentOrder = null;
      orderMetadata = null;
      $container.classList.add('is-full-width');

      const html = await Router.fetchTemplate('src/pages/order-detail/order-detail.html');
      $container.innerHTML = html;

      await loadOrderDetailData();
    } catch (e) {
      console.warn('Lỗi render order detail:', e);
    }
  }

  async function loadOrderDetailData() {
    if (gridApi) {
      gridApi.showLoadingOverlay();
    }
    var id = window._viewOrderId;
    var o = null;

    try {
      orderMetadata = await OrderService.getMetadata();
      o = await OrderService.getOrderDetail(id);

      if (o && typeof o.Lines === 'string') {
        try { o.Lines = JSON.parse(o.Lines); } catch (e) { }
      }
      if (o && typeof o.print_items === 'string') {
        try { o.print_items = JSON.parse(o.print_items); } catch (e) { }
      }
    } catch (err) {
      console.warn('Lỗi tải chi tiết đơn hàng:', err);
    }

    if (!o) {
      if ($container) {
        $container.innerHTML = '<div class="empty-state"><span class="material-symbols-outlined">search_off</span><p>' + t('order.not_found') + '</p></div>';
      }
      return;
    }

    currentOrderData = o;
    allLines = o.Lines || [];
    currentOrder = o;
    await bindPrintButton();

    var titleEl = document.getElementById('detail-title');
    if (titleEl) titleEl.textContent = t('btn.detail') + ': ' + o.DocumentID;

    var infoEl = document.getElementById('detail-info');
    if (infoEl) {
      infoEl.innerHTML = `
        <table style="table-layout: fixed; width: 100%;">
          <tbody>
            <tr>
              <td class="info-label" data-i18n="order.no" style="width: 100px;">${t('order.no')}</td>
              <td class="info-value highlight-code" style="word-break: break-word; white-space: normal;">${o.DocumentID}</td>
            </tr>
            <tr>
              <td class="info-label" data-i18n="order.date">${t('order.date')}</td>
              <td class="info-value" style="word-break: break-word; white-space: normal;">${o.DocumentDate || '—'}</td>
            </tr>
            <tr>
              <td class="info-label">Khách hàng</td>
              <td class="info-value" style="word-break: break-word; white-space: normal;"><strong>${o.ObjectName || '—'}</strong> ${o.ObjectID ? `<span style="color:var(--muted); font-size:12px;">(${o.ObjectID})</span>` : ''}</td>
            </tr>
            <tr>
              <td class="info-label">Địa chỉ</td>
              <td class="info-value" style="word-break: break-word; white-space: normal; line-height: 1.4;">${o.Address || '—'}</td>
            </tr>
            <tr>
              <td class="info-label">Số điện thoại</td>
              <td class="info-value" style="word-break: break-word; white-space: normal;">${o.Phone || '—'}</td>
            </tr>
            <tr>
              <td class="info-label" data-i18n="order.branch">${t('order.branch')}</td>
              <td class="info-value" style="word-break: break-word; white-space: normal;">${o.BranchName || o.BranchID || '—'}</td>
            </tr>
            <tr>
              <td class="info-label" data-i18n="order.staff">${t('order.staff')}</td>
              <td class="info-value" style="word-break: break-word; white-space: normal;">${o.EmployeeName || o.EmployeeID || '—'}</td>
            </tr>
            <tr>
              <td class="info-label" data-i18n="order.promo">${t('order.promo')}</td>
              <td class="info-value" style="word-break: break-word; white-space: normal;">
                ${o.CTKM && o.CTKM !== 'Không' && o.CTKM !== 'none' ? `<span class="order-promo-badge"><span class="material-symbols-outlined" style="font-size:16px;">sell</span>${o.CTKM}</span>` : '<span style="color:var(--muted)">—</span>'}
              </td>
            </tr>
            <tr>
              <td class="info-label" data-i18n="order.total.money">${t('order.total.money')}</td>
              <td class="info-value highlight-money" style="word-break: break-word; white-space: normal;">${Utils.formatMoney(o.BaseTotal || 0)}</td>
            </tr>
            <tr>
              <td colspan="2" style="border-bottom: none; padding-top: 8px;">
                <span class="info-label" data-i18n="order.note" style="display: block; margin-bottom: 4px;">${t('order.note')}</span>
                <div class="order-info-note-box">
                  ${o.Notes || '—'}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      `;
    }

    renderLines();
  }

  async function printOrder() {
    var btn = document.getElementById('btn-print-order');
    if (btn) btn.disabled = true;

    try {
      var id = window._viewOrderId;
      if (!id && currentOrderData) {
        id = currentOrderData.DocumentID || currentOrderData.so_ct;
      }

      if (!id && !currentOrderData) {
        alert('Không tìm thấy mã đơn hàng!');
        return;
      }

      if (typeof OrderPrintService !== 'undefined' && typeof OrderPrintService.generate === 'function') {
        await OrderPrintService.generate(currentOrderData || id);
      } else {
        alert('Không tìm thấy dịch vụ in OrderPrintService.generate!');
      }
    } catch (err) {
      console.error('Lỗi khi in/tạo đơn hàng:', err);
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  return {
    render: render,
    printOrder: printOrder
  };
})();

