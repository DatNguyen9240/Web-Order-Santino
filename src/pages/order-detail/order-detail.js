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

  function _isMoneyField(field) {
    if (!field) return false;
    var renderRule = String(field.renderRule || field.FormatID || field.formatID || '').toUpperCase();
    var fieldName = String(field.name || '').toLowerCase();
    var fieldLabel = String(field.label || '').toLowerCase();

    return renderRule === 'B' 
      || fieldName === 'amount' 
      || fieldName === 'unitprice'
      || fieldName === 'price'
      || fieldName.indexOf('tien') >= 0 
      || fieldName.indexOf('gia') >= 0
      || fieldLabel.indexOf('tiền') >= 0
      || fieldLabel.indexOf('giá') >= 0;
  }

  function _buildDetailColumnDefs(metadata) {
    return _configuredDetailFields(metadata).map(function (field) {
      var renderRule = String(field.renderRule || '').trim().toUpperCase();
      var fieldName = String(field.name || '').toLowerCase();

      var column = {
        field: field.name,
        headerName: field.label || field.name,
        minWidth: String(field.dataType || '').toLowerCase().indexOf('char') >= 0 ? 150 : 110
      };

      if (_isMoneyField(field)) {
        column.valueFormatter = function (params) {
          if (params.value == null || params.value === '') return '';
          var num = Number(params.value);
          if (isNaN(num)) return params.value;
          return typeof Utils !== 'undefined' && Utils.formatMoney
            ? Utils.formatMoney(num)
            : num.toLocaleString('vi-VN') + ' đ';
        };
        column.cellStyle = function (params) {
          if (params.node && params.node.rowPinned === 'bottom') {
            return { textAlign: 'right', fontWeight: '700', color: 'var(--danger, #ef4444)', fontSize: '15px' };
          }
          return { textAlign: 'right' };
        };
        column.type = 'numericColumn';
      } else if (renderRule === 'N' || fieldName === 'quantity' || fieldName === 'so_luong') {
        column.cellStyle = function (params) {
          if (params.node && params.node.rowPinned === 'bottom') {
            return { textAlign: 'center', fontWeight: '700', color: 'var(--accent, #4F46E5)', fontSize: '15px' };
          }
          return { color: 'var(--accent, #4F46E5)', fontWeight: '700', textAlign: 'center' };
        };
      } else if (renderRule === 'SIZE' || fieldName === 'size') {
        column.cellStyle = function (params) {
          if (params.node && params.node.rowPinned === 'bottom') return null;
          return { color: 'var(--text-secondary, #6b7280)', fontSize: '13px' };
        };
        column.cellRenderer = function (params) {
          if (params.node && params.node.rowPinned === 'bottom') return '';
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
      } else {
        var origFormatter = column.valueFormatter;
        column.valueFormatter = function (params) {
          if (params.node && params.node.rowPinned === 'bottom') {
            return params.value || '';
          }
          return origFormatter ? origFormatter(params) : params.value;
        };
        column.cellStyle = function (params) {
          if (params.node && params.node.rowPinned === 'bottom') {
            return { fontWeight: '700', color: 'var(--text, #1e293b)', fontSize: '15px' };
          }
          return null;
        };
      }
      return column;
    });
  }

  function _calculateDetailSummaryRow(lines, metadata) {
    if (!Array.isArray(lines) || lines.length === 0) return [];

    var fields = _configuredDetailFields(metadata);
    if (!fields || fields.length === 0) {
      fields = Object.keys(lines[0] || {}).map(function (key) {
        return { name: key, label: key };
      });
    }

    var firstFieldName = fields.length > 0 ? fields[0].name : 'STT';
    var summaryRow = {};

    summaryRow[firstFieldName] = 'Σ';

    fields.forEach(function (field) {
      var fieldName = String(field.name || '').toLowerCase();
      if (_isMoneyField(field)) {
        var sumAmount = 0;
        lines.forEach(function (l) {
          var val = parseFloat(String(l[field.name] || 0).replace(/,/g, ''));
          if (!isNaN(val)) sumAmount += val;
        });
        summaryRow[field.name] = Math.round((sumAmount + Number.EPSILON) * 100) / 100;
      } else if (field.renderRule === 'N' || fieldName === 'quantity' || fieldName === 'so_luong') {
        var sumQty = 0;
        lines.forEach(function (l) {
          var val = parseInt(l[field.name]) || 0;
          sumQty += val;
        });
        summaryRow[field.name] = sumQty;
      }
    });

    return [summaryRow];
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
    var summaryData = _calculateDetailSummaryRow(allLines, orderMetadata);

    var gridOptions = {
      pagination: false,
      columnDefs: _buildDetailColumnDefs(orderMetadata),
      rowData: pageLines,
      pinnedBottomRowData: summaryData
    };

    if (!gridApi) {
      gridApi = AppGrid.create(container, gridOptions);
    } else {
      gridApi.setGridOption('rowData', pageLines);
      gridApi.setGridOption('pinnedBottomRowData', summaryData);
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

  function _formatSizeQtyMultiplier(val) {
    if (!val) return '';
    var arr = val;
    if (typeof val === 'string') {
      try { arr = JSON.parse(val); } catch (e) { return val; }
    }
    if (Array.isArray(arr)) {
      return arr.map(function (s) {
        if (!s) return '';
        var sz = s.Size !== undefined ? s.Size : (s.size !== undefined ? s.size : s.ten_size);
        var q = s.Quantity !== undefined ? s.Quantity : (s.Qty !== undefined ? s.Qty : (s.qty !== undefined ? s.qty : s.so_luong));
        return (sz && Number(q) > 0) ? (sz + '×' + q) : '';
      }).filter(Boolean).join(' · ');
    }
    return String(val);
  }

  function _calculateOverallSizeSummary(lines) {
    var sizeTotals = {};
    lines.forEach(function (line) {
      var val = line.Size || line.size || line.chi_tiet_size || line.sizes;
      var arr = val;
      if (typeof val === 'string') {
        try { arr = JSON.parse(val); } catch (e) {}
      }
      if (Array.isArray(arr)) {
        arr.forEach(function (s) {
          if (!s) return;
          var sz = s.Size !== undefined ? s.Size : (s.size !== undefined ? s.size : s.ten_size);
          var q = Number(s.Quantity !== undefined ? s.Quantity : (s.Qty !== undefined ? s.Qty : (s.qty !== undefined ? s.qty : s.so_luong)));
          if (sz && q > 0) {
            sizeTotals[sz] = (sizeTotals[sz] || 0) + q;
          }
        });
      }
    });
    var parts = [];
    Object.keys(sizeTotals).forEach(function (sz) {
      parts.push(sz + '×' + sizeTotals[sz]);
    });
    return parts.join(' · ');
  }

  async function _getCompanySetup() {
    try {
      if (typeof Http !== 'undefined') {
        var res = await Http.get('/API_LayThongTinCongTy', { _t: Date.now() });
        var record = Array.isArray(res) ? res[0] : (res && res.records ? res.records[0] : res);
        if (record) {
          return {
            TenCongTy: record.TenCongTy || 'CÔNG TY CP LSP VIỆT NAM',
            DiaChi: record.DiaChi || 'Tầng 3, Helios Tower, 75 Tam Trinh, Hoàng Mai, Hà Nội',
            DienThoaiFax: record.DienThoaiFax || 'Tel: (024) 3204 9988 | Fax: (024) 3215 1142',
            TenBrandWeb: record.TenBrandWeb || 'SHOP SANTINO'
          };
        }
      }
    } catch (e) {
      console.warn('Lỗi lấy thông tin công ty từ API_LayThongTinCongTy, dùng mặc định:', e);
    }
    return {
      TenCongTy: 'CÔNG TY CP LSP VIỆT NAM',
      DiaChi: 'Tầng 3, Helios Tower, 75 Tam Trinh, Hoàng Mai, Hà Nội',
      DienThoaiFax: 'Tel: (024) 3204 9988 | Fax: (024) 3215 1142',
      TenBrandWeb: 'SHOP SANTINO'
    };
  }

  async function exportExcel() {
    if (!currentOrderData && !allLines.length) {
      if (typeof showToast === 'function') showToast('Không có dữ liệu đơn hàng để xuất Excel', false);
      return;
    }

    var companyInfo = await _getCompanySetup();

    var o = currentOrderData || {};
    var docId = o.DocumentID || o.so_ct || o.SoPhieu || window._viewOrderId || 'DonHang';

    var docDate = o.DocumentDate || o.ngay_ct || o.NgayLap || '';
    var dateObj = docDate ? new Date(docDate) : new Date();
    var dayStr = String(dateObj.getDate()).padStart(2, '0');
    var monthStr = String(dateObj.getMonth() + 1).padStart(2, '0');
    var yearStr = dateObj.getFullYear();
    var dateFormattedText = 'Ngày ' + dayStr + ' tháng ' + monthStr + ' năm ' + yearStr;

    var overallSizeText = _calculateOverallSizeSummary(allLines);

    var formattedLines = allLines.map(function (line) {
      return {
        itemCode: line.MaHang || line.ItemID || line.ma_hang || '',
        itemName: line.TenHang || line.ItemName || line.ten_hang || '',
        color: line.MauSac || line.mau_sac || line.Mau || line.mau || '',
        sizeText: _formatSizeQtyMultiplier(line.Size || line.size || line.chi_tiet_size || line.sizes),
        chi_tiet_size: line.chi_tiet_size || line.Size || line.size || line.sizes,
        qty: Number(line.Quantity || line.SoLuong || line.so_luong || 0),
        price: Number(line.UnitPrice || line.DonGia || line.don_gia || 0),
        amount: Number(line.Amount || line.ThanhTien || line.thanh_tien || (line.Quantity * line.UnitPrice))
      };
    });

    if (typeof OrderExcelService !== 'undefined') {
      await OrderExcelService.exportOrder({
        docId: docId,
        dateFormattedText: dateFormattedText,
        custName: o.ObjectName || o.TenKhachHang || '',
        custCode: o.ObjectID || o.MaKH || '',
        custAddr: o.Address || o.DiaChi || '—',
        custPhone: o.Phone || o.SDT || '—',
        remarks: o.Notes || o.DienGiai || '—',
        lines: formattedLines,
        rawLines: allLines,
        overallSizeText: overallSizeText,
        companyInfo: companyInfo
      });
      return;
    }

    var html = `
      <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Phiếu Đặt Hàng</x:Name>
                <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <v:shapetype id="_x0000_t75" coordsize="21600,21600" o:spt="75" o:preferrelative="t" path="m@4@5l@4@11@9@11@9@5xe" filled="f" stroked="f">
          <v:stroke joinstyle="miter"/>
          <v:path o:extrusionok="f" gradientshapeok="t" o:connecttype="rect"/>
          <o:lock v:ext="edit" aspectratio="t"/>
        </v:shapetype>
        <![endif]-->
      </head>
      <body style="font-family: 'Times New Roman', Arial, sans-serif; font-size: 13px;">
        <table border="0" cellpadding="2" cellspacing="0" style="width: 100%; font-family: 'Times New Roman', Arial, sans-serif;">
          <tr>
            <td colspan="2" style="vertical-align: top;">
              <div style="font-family: 'Arial Black', Arial, sans-serif; font-size: 24px; font-weight: 900; letter-spacing: 2px; color: #0f172a; line-height: 1.1;">
                SHOP SANTINO
              </div>
            </td>
            <td colspan="3" align="right" style="font-size: 11px; line-height: 1.3; vertical-align: top;">
              <b>${companyInfo.TenCongTy || 'CÔNG TY CP LSP VIỆT NAM'}</b><br/>
              ${companyInfo.DiaChi || 'Tầng 3, Helios Tower, 75 Tam Trinh, Hoàng Mai, Hà Nội'}<br/>
              ${companyInfo.DienThoaiFax || 'Tel: (024) 3204 9988 | Fax: (024) 3215 1142'}
            </td>
          </tr>
          <tr><td colspan="5" style="height: 10px;"></td></tr>
          <tr>
            <td colspan="5" align="center" style="font-size: 20px; font-weight: bold;">PHIẾU ĐẶT HÀNG</td>
          </tr>
          <tr>
            <td colspan="2" align="left" style="font-size: 12px; font-style: italic;">${dateFormattedText}</td>
            <td colspan="3" align="right" style="font-size: 12px; font-weight: bold;">Số: ${docId}</td>
          </tr>
          <tr><td colspan="5" style="height: 8px;"></td></tr>
        </table>

        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: 'Times New Roman', Arial, sans-serif; font-size: 12px; border: 1px solid #000;">
          <tr>
            <td colspan="3" style="border: 1px solid #000;"><b>KHÁCH HÀNG:</b> ${o.ObjectName || o.TenKhachHang || ''}</td>
            <td colspan="2" style="border: 1px solid #000;"><b>MÃ KHÁCH HÀNG:</b> ${o.ObjectID || o.MaKH || ''}</td>
          </tr>
          <tr>
            <td colspan="3" style="border: 1px solid #000;"><b>ĐỊA CHỈ:</b> ${o.Address || o.DiaChi || '—'}</td>
            <td colspan="2" style="border: 1px solid #000;"><b>SỐ ĐIỆN THOẠI:</b> ${o.Phone || o.SDT || '—'}</td>
          </tr>
          <tr>
            <td colspan="5" style="border: 1px solid #000;"><b>DIỄN GIẢI:</b> ${o.Notes || o.DienGiai || '—'}</td>
          </tr>
        </table>

        <br/>

        <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: 'Times New Roman', Arial, sans-serif; font-size: 12px; border: 1px solid #000;">
          <thead>
            <tr style="background-color: #f8fafc; font-weight: bold;">
              <th align="center" style="border: 1px solid #000; width: 45px;">STT</th>
              <th align="left" style="border: 1px solid #000; width: 220px;">SẢN PHẨM</th>
              <th align="left" style="border: 1px solid #000; width: 250px;">SIZE × SỐ LƯỢNG</th>
              <th align="center" style="border: 1px solid #000; width: 65px;">TỔNG</th>
              <th align="right" style="border: 1px solid #000; width: 130px;">THÀNH TIỀN</th>
            </tr>
          </thead>
          <tbody>
    `;

    var totalQty = 0;
    var totalAmount = 0;

    allLines.forEach(function (line, index) {
      var sttNum = index + 1;
      var stt = String(sttNum).padStart(2, '0');
      var itemCode = line.MaHang || line.ItemID || line.ma_hang || '';
      var itemName = line.TenHang || line.ItemName || line.ten_hang || '';
      var color = line.MauSac || line.mau_sac || line.Mau || line.mau || '';
      var sizeText = _formatSizeQtyMultiplier(line.Size || line.size || line.chi_tiet_size || line.sizes);

      var qty = Number(line.Quantity || line.SoLuong || line.so_luong || 0);
      var price = Number(line.UnitPrice || line.DonGia || line.don_gia || 0);
      var amount = Number(line.Amount || line.ThanhTien || line.thanh_tien || (qty * price));

      totalQty += qty;
      totalAmount += amount;

      var formattedAmount = typeof Utils !== 'undefined' && Utils.formatMoney ? Utils.formatMoney(amount) : amount.toLocaleString('vi-VN') + ' đ';

      html += `
        <tr>
          <td align="center" style="border: 1px solid #000; font-weight: bold;">${stt}</td>
          <td align="left" style="border: 1px solid #000;">
            <b>${itemCode}</b><br/>
            ${itemName}<br/>
            ${color ? ('Màu: ' + color) : ''}
          </td>
          <td align="left" style="border: 1px solid #000;">${sizeText}</td>
          <td align="center" style="border: 1px solid #000; font-weight: bold;">${qty}</td>
          <td align="right" style="border: 1px solid #000; font-weight: bold;">${formattedAmount}</td>
        </tr>
      `;
    });

    var formattedTotalAmount = typeof Utils !== 'undefined' && Utils.formatMoney ? Utils.formatMoney(totalAmount) : totalAmount.toLocaleString('vi-VN') + ' đ';
    var moneyInWords = o.TienBangChu || o.bang_chu || (typeof Utils !== 'undefined' && Utils.numberToVietnameseWords ? Utils.numberToVietnameseWords(totalAmount) : '');

    html += `
            <tr>
              <td colspan="5" style="border: 1px solid #000; padding: 6px;"><b>Tổng theo size:</b> ${overallSizeText || '—'}</td>
            </tr>
          </tbody>
        </table>

        <br/>

        <table border="0" cellpadding="4" cellspacing="0" style="width: 100%; font-family: 'Times New Roman', Arial, sans-serif; font-size: 13px;">
          <tr>
            <td colspan="3" style="font-weight: bold;">Tổng số lượng: ${totalQty} sản phẩm</td>
            <td colspan="2" align="right" style="font-weight: bold;">Tổng tiền hàng: ${formattedTotalAmount}</td>
          </tr>
          <tr>
            <td colspan="3" style="font-style: italic;">Bằng chữ: ${moneyInWords || '—'}</td>
            <td colspan="2" align="right">Chiết khấu: 0 đ</td>
          </tr>
          <tr>
            <td colspan="3"></td>
            <td colspan="2" align="right">Chiết khấu khác: 0 đ</td>
          </tr>
          <tr>
            <td colspan="3"></td>
            <td colspan="2" align="right" style="font-size: 15px; font-weight: bold; padding-top: 6px;">TỔNG THANH TOÁN: ${formattedTotalAmount}</td>
          </tr>
        </table>

        <br/><br/>

        <table border="0" cellpadding="2" cellspacing="0" style="width: 100%; font-family: 'Times New Roman', Arial, sans-serif; font-size: 12px; text-align: center;">
          <tr style="font-weight: bold;">
            <td colspan="4" style="width: 80%;"></td>
            <td style="width: 20%; text-align: center;">Kế toán</td>
          </tr>
          <tr style="font-style: italic; color: #64748b;">
            <td colspan="4"></td>
            <td style="text-align: center;">(Ký / họ tên)</td>
          </tr>
        </table>
      </body>
      </html>
    `;

    var blob = new Blob(['\uFEFF' + html], { type: 'application/vnd.ms-excel;charset=utf-8' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (typeof showToast === 'function') {
      showToast('Đã xuất file Excel ' + fileName + ' thành công!');
    }
  }

  return {
    render: render,
    printOrder: printOrder,
    exportExcel: exportExcel
  };
})();

