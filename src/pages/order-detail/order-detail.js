var OrderDetailPage = (function () {
  var gridApi = null;
  var allLines = [];
  var currentPage = 1;
  var itemsPerPage = 10;
  var $container = null;
  var currentOrderData = null;
  var currentOrder = null;

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
      const queryObj = { Loai: 'OrderDetail', TimKiem: id };

      var user = JSON.parse(localStorage.getItem('santino_user') || '{}');
      var role = user.role || user.Group || '';
      var empID = user.EmployeeID || '';
      var objID = user.ObjectID || '';
      if (objID && objID !== '') {
        empID = '';
      }
      queryObj.chinhanh = '';
      queryObj.UserRole = role;
      queryObj.UserEmployeeID = empID;
      queryObj.UserObjectID = objID;
      queryObj.Page = 1;

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
    allLines = o.lines || [];
    currentOrder = o;
    await bindPrintButton();

    var titleEl = document.getElementById('detail-title');
    if (titleEl) titleEl.textContent = t('btn.detail') + ': ' + o.so_ct;

    var infoEl = document.getElementById('detail-info');
    if (infoEl) {
      infoEl.innerHTML = `
        <table style="table-layout: fixed; width: 100%;">
          <tbody>
            <tr>
              <td class="info-label" data-i18n="order.no" style="width: 100px;">${t('order.no')}</td>
              <td class="info-value highlight-code" style="word-break: break-word; white-space: normal;">${o.so_ct}</td>
            </tr>
            <tr>
              <td class="info-label" data-i18n="order.date">${t('order.date')}</td>
              <td class="info-value" style="word-break: break-word; white-space: normal;">${o.ngay_ct || '—'}</td>
            </tr>
            <tr>
              <td class="info-label">Khách hàng</td>
              <td class="info-value" style="word-break: break-word; white-space: normal;"><strong>${o.kh_ten || '—'}</strong> ${o.ma_kh ? `<span style="color:var(--muted); font-size:12px;">(${o.ma_kh})</span>` : ''}</td>
            </tr>
            <tr>
              <td class="info-label">Địa chỉ</td>
              <td class="info-value" style="word-break: break-word; white-space: normal; line-height: 1.4;">${o.dia_chi || '—'}</td>
            </tr>
            <tr>
              <td class="info-label">Số điện thoại</td>
              <td class="info-value" style="word-break: break-word; white-space: normal;">${o.sdt || '—'}</td>
            </tr>
            <tr>
              <td class="info-label" data-i18n="order.branch">${t('order.branch')}</td>
              <td class="info-value" style="word-break: break-word; white-space: normal;">${o.chi_nhanh || '—'}</td>
            </tr>
            <tr>
              <td class="info-label" data-i18n="order.staff">${t('order.staff')}</td>
              <td class="info-value" style="word-break: break-word; white-space: normal;">${o.nvkd || '—'}</td>
            </tr>
            <tr>
              <td class="info-label" data-i18n="order.promo">${t('order.promo')}</td>
              <td class="info-value" style="word-break: break-word; white-space: normal;">
                ${o.ma_ctbh && o.ma_ctbh !== 'Không' && o.ma_ctbh !== 'none' ? `<span class="order-promo-badge"><span class="material-symbols-outlined" style="font-size:16px;">sell</span>${o.ma_ctbh}</span>` : '<span style="color:var(--muted)">—</span>'}
              </td>
            </tr>
            <tr>
              <td class="info-label" data-i18n="order.total.money">${t('order.total.money')}</td>
              <td class="info-value highlight-money" style="word-break: break-word; white-space: normal;">${Utils.formatMoney(o.total_money || 0)}</td>
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
    }

    renderLines();
  }

  async function printOrder() {
    var btn = document.getElementById('btn-print-order');
    if (btn) btn.disabled = true;

    try {
      var id = window._viewOrderId;
      if (!id && currentOrderData) {
        id = currentOrderData.so_ct || currentOrderData.id;
      }

      if (!id) {
        alert('Không tìm thấy mã đơn hàng!');
        return;
      }

      // Gọi API_InDonHang để lấy đúng duy nhất các trường chuẩn thiết kế cho in phiếu Santino
      var printData = null;
      try {
        const queryObj = { Loai: 'InDonHang', TimKiem: id, DocumentID: id };
        const params = { q: JSON.stringify(queryObj), _t: Date.now() };
        const res = await Http.get(API_CONFIG.ENDPOINTS.CATEGORIES.LIST, params);
        if (res && res.records && res.records.length > 0) {
          printData = res.records[0];
        } else if (res && res.JsonPayload) {
          printData = typeof res.JsonPayload === 'string' ? JSON.parse(res.JsonPayload) : res.JsonPayload;
        }
      } catch (apiErr) {
        console.warn('Không gọi được API_InDonHang riêng, sử dụng dữ liệu trang:', apiErr);
      }

      // Nếu có printData từ API_InDonHang thì dùng, nếu chưa có thì dùng dữ liệu hiện tại
      var rowDataPayload = printData || {
        SoPhieu: currentOrderData.so_ct || '',
        NgayLap: currentOrderData.ngay_ct || '',
        TenKhachHang: currentOrderData.kh_ten || '',
        MaKH: currentOrderData.ma_kh || '',
        DiaChi: currentOrderData.dia_chi || '',
        SDT: currentOrderData.sdt || '',
        DienGiai: currentOrderData.dien_giai || currentOrderData.ghi_chu || '',
        TongSoLuong: currentOrderData.total_qty || 0,
        TongTienHang: currentOrderData.total_money || 0,
        TongThanhToan: currentOrderData.total_money || 0,
        ChiTietDonHang: currentOrderData.print_items || currentOrderData.lines || []
      };

      if (typeof OrderPrintService !== 'undefined' && typeof OrderPrintService.generate === 'function') {
        return OrderPrintService.generate(currentOrderData);
      }

      var docConfig = (window.API_CONFIG && API_CONFIG.ENDPOINTS && API_CONFIG.ENDPOINTS.DOCUMENT_MANAGER)
        ? API_CONFIG.ENDPOINTS.DOCUMENT_MANAGER
        : null;

      if (!docConfig || !docConfig.BASE_API) {
        alert('Chưa cấu hình DOCUMENT_MANAGER trong env.js');
        return;
      }

      var payload = {
        templateType: docConfig.ORDER_TEMPLATE,
        outputFileName: 'Phieu_Dat_Hang_' + String(rowDataPayload.SoPhieu || id).replace(/[\/\\:*?"<>|()+]/g, '_'),
        rowData: rowDataPayload
      };

      var res = await fetch(docConfig.BASE_API + '/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      var result = await res.json();
      var downloadUrl = '';
      if (result.success) {
        if (result.data && result.data.fileUrl) {
          downloadUrl = result.data.fileUrl;
        } else if (result.fileUrl) {
          downloadUrl = result.fileUrl;
        } else if (result.fileName) {
          downloadUrl = docConfig.UPLOADS_URL + encodeURIComponent(result.fileName);
        }
      }

      if (downloadUrl) {
        window.open(downloadUrl, '_blank');
      } else {
        alert('Lỗi tạo phiếu in: ' + (result.message || 'Chưa rõ nguyên nhân'));
      }
    } catch (err) {
      console.error('Lỗi khi in đơn hàng:', err);
      alert('Lỗi khi kết nối đến server in tài liệu: ' + err.message);
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  return { 
    render: render,
    printOrder: printOrder
  };
})();
