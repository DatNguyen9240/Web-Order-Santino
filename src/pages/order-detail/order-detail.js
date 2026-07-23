var OrderDetailPage = (function () {
  var gridApi = null;
  var allLines = [];
  var currentPage = 1;
  var itemsPerPage = 10;
  var $container = null;
  var currentOrderData = null;
  var currentOrder = null;

  async function bindPrintButton() {
    var btnPrint = document.getElementById('btn-print-order') || document.getElementById('order-detail-print');
    var btnPreview = document.getElementById('btn-preview-order');

    var canPrint = typeof PermissionsService !== 'undefined'
      && typeof PermissionsService.canExportExcel === 'function'
      && await PermissionsService.canExportExcel('WEB_OrderDetailFrm');

    if (btnPrint) btnPrint.hidden = !canPrint;
    if (btnPreview) btnPreview.hidden = !canPrint;
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

  async function previewOrder() {
    var btn = document.getElementById('btn-preview-order');
    if (btn) btn.disabled = true;

    try {
      if (!currentOrderData) return;
      var docConfig = (window.API_CONFIG && API_CONFIG.ENDPOINTS && API_CONFIG.ENDPOINTS.DOCUMENT_MANAGER) ? API_CONFIG.ENDPOINTS.DOCUMENT_MANAGER : null;
      if (!docConfig || !docConfig.BASE_API) {
        alert('Chưa cấu hình DOCUMENT_MANAGER trong env.js');
        return;
      }

      var rowDataPayload = {
        SoPhieu: currentOrderData.so_ct || id,
        Ngay: currentOrderData.ngay_ct || '',
        ChiNhanh: currentOrderData.chi_nhanh || '',
        NhanVienKD: currentOrderData.nvkd || '',
        KhachHang: currentOrderData.kh_ten || currentOrderData.ObjectName || '',
        MaKhachHang: currentOrderData.ma_kh || currentOrderData.ObjectID || '',
        DiaChi: currentOrderData.kh_dc || '',
        SDT: currentOrderData.sdt || '',
        DienGiai: currentOrderData.dien_giai || currentOrderData.ghi_chu || '',
        TongSoLuong: currentOrderData.total_qty || 0,
        TongTienHang: currentOrderData.total_money || 0,
        TongThanhToan: currentOrderData.total_money || 0,
        ChiTietDonHang: currentOrderData.print_items || currentOrderData.lines || []
      };

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
      if (result.success) {
        var fileName = (result.data && result.data.fileName) || result.fileName || 'Phieu_Dat_Hang.docx';
        var downloadUrl = docConfig.UPLOADS_URL + encodeURIComponent(fileName);
        _showPreviewModal(downloadUrl, fileName);
      } else {
        alert('Lỗi tạo phiếu xem trước: ' + (result.message || 'Chưa rõ nguyên nhân'));
      }
    } catch (err) {
      console.error('Lỗi khi xem trước phiếu:', err);
      alert('Lỗi xem trước: ' + err.message);
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  function _showPreviewModal(fileUrl, fileName) {
    var modalId = 'modal-docx-preview';
    var oldModal = document.getElementById(modalId);
    if (oldModal) oldModal.remove();

    var fullFileUrl = fileUrl.startsWith('/') ? (location.protocol + '//' + location.host + fileUrl) : fileUrl;
    var o = currentOrderData || {};
    var items = o.print_items || o.lines || [];

    var itemsHtml = items.map(function (item, idx) {
      var name = item.ten_hang_2 || item.ItemName || item.ten_hang_hoa || item.ten_hang || 'Sản phẩm';
      var size = item.size || item.Size || '—';
      var color = item.mau || item.MauSac || '—';
      var qty = item.so_luong || item.Quantity || item.qty || 0;
      var price = item.don_gia || item.UnitPrice || 0;
      var amount = item.thanh_tien || item.Amount || (qty * price);

      return `
        <tr>
          <td style="text-align:center; border:1px solid #cbd5e1; padding:8px;">${idx + 1}</td>
          <td style="border:1px solid #cbd5e1; padding:8px;"><strong>${name}</strong></td>
          <td style="text-align:center; border:1px solid #cbd5e1; padding:8px;">${size}</td>
          <td style="text-align:center; border:1px solid #cbd5e1; padding:8px;">${color}</td>
          <td style="text-align:center; border:1px solid #cbd5e1; padding:8px;">${qty}</td>
          <td style="text-align:right; border:1px solid #cbd5e1; padding:8px;">${Utils.formatMoney(price)}</td>
          <td style="text-align:right; border:1px solid #cbd5e1; padding:8px;"><strong>${Utils.formatMoney(amount)}</strong></td>
        </tr>
      `;
    }).join('');

    var html = `
      <div class="modal-overlay active" id="${modalId}" style="z-index:99999;">
        <div class="modal" style="width:92%; max-width:900px; height:88vh; display:flex; flex-direction:column; padding:0; background:#f8fafc; border-radius:10px; overflow:hidden;">
          <div class="modal-hdr" style="padding:14px 20px; background:var(--primary); color:#fff; display:flex; justify-content:space-between; align-items:center;">
            <h3 style="margin:0; font-size:15px; color:#fff; display:flex; align-items:center; gap:8px;">
              <span class="material-symbols-outlined">visibility</span> Xem Trước Phiếu Đặt Hàng (${o.so_ct || 'Phiếu'})
            </h3>
            <div style="display:flex; gap:10px; align-items:center;">
              <a href="${fullFileUrl}" target="_blank" download="${fileName}" class="btn btn-sm" style="background:#fff; color:var(--primary); text-decoration:none; padding:6px 14px; font-size:12px; font-weight:700; border-radius:6px; display:inline-flex; align-items:center; gap:4px; box-shadow:0 2px 4px rgba(0,0,0,0.15);">
                <span class="material-symbols-outlined" style="font-size:16px;">download</span> Tải File DOCX
              </a>
              <button class="btn-icon" onclick="document.getElementById('${modalId}').remove()" style="color:#fff;"><span class="material-symbols-outlined">close</span></button>
            </div>
          </div>
          <div class="modal-body" style="flex:1; padding:24px; overflow-y:auto; background:#f1f5f9;">
            <div style="max-width:800px; margin:0 auto; background:#fff; padding:32px; border:1px solid #e2e8f0; border-radius:8px; box-shadow:0 10px 25px -5px rgba(0,0,0,0.1); font-family:sans-serif; color:#0f172a;">
              <div style="text-align:center; margin-bottom:24px; border-bottom:2px solid var(--primary); padding-bottom:16px;">
                <h2 style="margin:0; color:var(--primary); font-size:22px; text-transform:uppercase; letter-spacing:1px;">PHIẾU ĐẶT HÀNG SỈ</h2>
                <div style="font-size:13px; color:#64748b; margin-top:6px;">Số CT: <strong style="color:#0f172a;">${o.so_ct || '—'}</strong> | Ngày lập: ${o.ngay_ct || '—'}</div>
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:24px; font-size:13px; background:#f8fafc; padding:16px; border-radius:8px; border:1px solid #e2e8f0;">
                <div><strong>Khách hàng:</strong> ${o.kh_ten || o.ObjectName || '—'}</div>
                <div><strong>Mã KH:</strong> ${o.ma_kh || o.ObjectID || '—'}</div>
                <div><strong>Địa chỉ:</strong> ${o.dia_chi || o.kh_dc || '—'}</div>
                <div><strong>Số điện thoại:</strong> ${o.sdt || '—'}</div>
                <div><strong>Chi nhánh:</strong> ${o.chi_nhanh || '—'}</div>
                <div><strong>Nhân viên KD:</strong> ${o.nvkd || '—'}</div>
              </div>

              <table style="width:100%; border-collapse:collapse; font-size:13px; margin-bottom:20px;">
                <thead>
                  <tr style="background:var(--primary); color:#fff;">
                    <th style="border:1px solid var(--primary); padding:10px; width:40px;">STT</th>
                    <th style="border:1px solid var(--primary); padding:10px; text-align:left;">Tên Sản Phẩm</th>
                    <th style="border:1px solid var(--primary); padding:10px; width:60px;">Size</th>
                    <th style="border:1px solid var(--primary); padding:10px; width:80px;">Màu</th>
                    <th style="border:1px solid var(--primary); padding:10px; width:60px;">SL</th>
                    <th style="border:1px solid var(--primary); padding:10px; width:100px; text-align:right;">Đơn Giá</th>
                    <th style="border:1px solid var(--primary); padding:10px; width:110px; text-align:right;">Thành Tiền</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml || '<tr><td colspan="7" style="text-align:center; padding:16px;">Không có sản phẩm</td></tr>'}
                </tbody>
                <tfoot>
                  <tr style="background:#f8fafc; font-weight:bold;">
                    <td colspan="4" style="text-align:right; border:1px solid #cbd5e1; padding:10px;">Tổng Cộng:</td>
                    <td style="text-align:center; border:1px solid #cbd5e1; padding:10px; color:var(--primary); font-size:14px;">${o.total_qty || 0}</td>
                    <td colspan="2" style="text-align:right; border:1px solid #cbd5e1; padding:10px; color:var(--accent); font-size:15px;">${Utils.formatMoney(o.total_money || 0)}</td>
                  </tr>
                </tfoot>
              </table>

              ${o.dien_giai || o.ghi_chu ? `<div style="font-size:12px; color:#64748b; font-style:italic; border-top:1px dashed #cbd5e1; padding-top:12px;">Ghi chú: ${o.dien_giai || o.ghi_chu}</div>` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  return { 
    render: render,
    printOrder: printOrder,
    previewOrder: previewOrder
  };
})();
