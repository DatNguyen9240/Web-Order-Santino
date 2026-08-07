/**
 * OrderPrintService
 * Tạo DOCX phiếu đặt hàng qua Document Server. Template và URL server được
 * cấu hình trong env.js, nên không gắn cứng vào màn hình chi tiết đơn hàng.
 */
var OrderPrintService = (function () {
  function _documentConfig() {
    return window.API_CONFIG
      && window.API_CONFIG.ENDPOINTS
      && window.API_CONFIG.ENDPOINTS.DOCUMENT_MANAGER;
  }

  function _authHeaders() {
    var token = '';
    var cookiePrefix = '; auth_token=';
    var cookieParts = ('; ' + document.cookie).split(cookiePrefix);
    if (cookieParts.length === 2) token = cookieParts.pop().split(';').shift();

    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {})
    };
  }

  function _safeFilePart(value) {
    return String(value || 'don-hang').replace(/[^a-zA-Z0-9_-]+/g, '_');
  }

  function _money(value) {
    if (value === null || value === undefined || value === '') return '0';
    if (typeof value === 'string') {
      var trimmed = value.trim();
      if (trimmed.indexOf(',') >= 0 || trimmed.indexOf('.') >= 0 || trimmed.indexOf('đ') >= 0 || trimmed.indexOf('đ') >= 0) {
        return trimmed;
      }
    }
    var num = Number(value);
    if (isNaN(num)) return String(value);
    return num.toLocaleString('en-US');
  }

  function _parseMoney(val) {
    if (val === null || val === undefined || val === '') return 0;
    if (typeof val === 'number') return val;
    var cleaned = String(val).replace(/,/g, '').replace(/\./g, '').replace(/đ/g, '').trim();
    var num = Number(cleaned);
    return isNaN(num) ? 0 : num;
  }

  function _message(type, title, detail) {
    if (typeof Alert !== 'undefined' && typeof Alert[type] === 'function') {
      Alert[type](title, detail);
      return;
    }
    if (typeof showToast === 'function') showToast(detail || title, type === 'success');
  }

  function _parseSizeList(line) {
    if (!line) return [];
    var target = line.Size !== undefined ? line.Size 
      : (line.chi_tiet_size !== undefined ? line.chi_tiet_size 
      : (line.sizes !== undefined ? line.sizes : line.chi_tiet_size_list));
    if (typeof target === 'string') {
      try { return JSON.parse(target) || []; } catch (e) { return []; }
    }
    return Array.isArray(target) ? target : [];
  }

  function _sortSizes(sizes) {
    return sizes;
  }

  function _printData(order) {
    if (!order) return {};
    
    var rawLines = Array.isArray(order.ChiTietDonHang) ? order.ChiTietDonHang
      : (Array.isArray(order.Lines) ? order.Lines
      : (Array.isArray(order.lines) ? order.lines
      : (Array.isArray(order.print_items) ? order.print_items : [])));

    var orderTotalSizeMap = {};

    var formattedLines = rawLines.map(function (line, index) {
      var price = _parseMoney(line.don_gia || line.UnitPrice || line.DonGia || line.don_gia_ban || 0);
      var qty = Number(line.so_luong || line.Quantity || line.SoLuong || 0);
      var rawTotal = line.thanh_tien || line.Amount || line.ThanhTien;
      var total = rawTotal !== undefined && rawTotal !== null ? _parseMoney(rawTotal) : (price * qty);
      var sttNum = Number(line.STT || line.stt || (index + 1));
      var stt = isNaN(sttNum) ? String(index + 1).padStart(2, '0') : String(sttNum).padStart(2, '0');
      var itemName = line.ten_hang_goc || line.ten_hang || line.ItemName || line.TenHang || line.TenHangHoa || line.ten_hang_hoa || line.ten_hang_2 || '';
      var itemCode = line.ma_hang || line.ItemID || line.MaHang || line.MaHangHoa || line.ma_hang_hoa || line.ten_hang_2 || '';
      var unit = line.dvt || line.don_vi_tinh || line.Unit || line.DVT || 'Chiếc';
      var kho = line.kho || line.Kho || line.BranchName || order.chi_nhanh || order.BranchID || '';
      var discount = line.chiet_khau || line.ChietKhau || 0;

      var sizesArr = _parseSizeList(line);
      
      var sizeText = '';
      var formattedSizesList = [];
      var lineSizeItems = [];

      if (Array.isArray(sizesArr) && sizesArr.length > 0) {
        sizeText = ' (Size: ' + sizesArr.map(function (s) {
          var sz = String(s.size || s.Size || s.ten_size || s.TenSize || '').trim();
          var q = Math.round(Number(s.qty || s.Qty || s.so_luong || s.Quantity || 0));
          if (sz && q > 0) {
            formattedSizesList.push({ sz: sz, q: q, size: sz, qty: q, Size: sz, Quantity: q });
            lineSizeItems.push(sz + '×' + q);
            orderTotalSizeMap[sz] = (orderTotalSizeMap[sz] || 0) + q;
          }
          return sz + '(' + q + ')';
        }).join(', ') + ')';
      }
      
      var sizeQtyText = lineSizeItems.join(' · ');
      var finalItemName = itemName;
      var color = line.mau || line.MauSac || line.Mau || line.mau_sac || '';

      return Object.assign({}, line, {
        STT: stt,
        Kho: kho,
        MaHang: itemCode,
        ten_hang_2: itemCode,
        TenHang: finalItemName,
        ten_hang_goc: itemName,
        DVT: unit,
        DonGia: _money(price),
        don_gia: price,
        SoLuong: qty,
        so_luong: qty,
        mau: color,
        MauSac: color,
        ChietKhau: discount,
        ThanhTien: _money(total),
        thanh_tien: total,
        size_qty_text: sizeQtyText,
        chi_tiet_size: formattedSizesList
      });
    });

    var totalQty = formattedLines.reduce(function (acc, l) { return acc + Number(l.SoLuong || 0); }, 0);
    var totalMoney = _parseMoney(order.TongTienHang || order.total_money || order.BaseTotal || formattedLines.reduce(function (acc, l) { return acc + _parseMoney(l.ThanhTien); }, 0));

    var payload = Object.assign({}, order, {
      SoPhieu: order.SoPhieu || order.so_ct || order.DocumentID || '',
      so_ct: order.so_ct || order.SoPhieu || order.DocumentID || '',
      NgayLap: order.NgayLap || order.ngay_ct || order.DocumentDate || '',
      ngay_ct: order.ngay_ct || order.NgayLap || order.DocumentDate || '',
      TenKhachHang: order.TenKhachHang || order.kh_ten || order.khach_hang || order.ObjectName || '',
      MaKH: order.MaKH || order.ma_kh || order.ObjectID || '',
      DiaChi: order.DiaChi || order.dia_chi || order.diachi || order.Address || '',
      SDT: order.SDT || order.sdt || order.Phone || '',
      DienGiai: order.DienGiai || order.ghi_chu || order.dien_giai || order.Memo || '',
      
      TongTienHang: _money(totalMoney),
      TienChietKhau: _money(order.TienChietKhau || 0),
      TienSauChietKhau: _money(order.TienSauChietKhau || totalMoney),
      ChietKhauKhac: _money(order.ChietKhauKhac || 0),
      TongThanhToan: _money(order.TongThanhToan || totalMoney),
      TongSoLuong: totalQty,
      TienBangChu: order.TienBangChu || order.bang_chu || '',
      tong_theo_size: order.tong_theo_size || order.tong_size_text || '',

      ChiTietDonHang: formattedLines,
      lines: formattedLines
    });

    return payload;
  }

  function _resolvePrintData(order) {
    if (!order) return Promise.resolve({});
    
    var docId = typeof order === 'string' ? order 
      : (order.so_ct || order.SoPhieu || order.DocumentID || order.id || '');
      
    if (!docId) {
      var baseObj = typeof order === 'object' ? order : {};
      return Promise.resolve(_printData(baseObj));
    }

    var baseOrderObj = typeof order === 'object' ? order : { DocumentID: docId };

    if (typeof Http === 'undefined' || typeof API_CONFIG === 'undefined') {
      return Promise.resolve(_printData(baseOrderObj));
    }

    return Http.get(API_CONFIG.ENDPOINTS.CATEGORIES.LIST, {
      q: JSON.stringify({ Loai: 'InDonHang', TimKiem: docId, DocumentID: docId }),
      _t: Date.now()
    }).then(function (res) {
      var record = null;
      if (res && res.records && res.records.length > 0) record = res.records[0];
      else if (res && res.JsonPayload) record = res;
      else if (Array.isArray(res) && res.length > 0) record = res[0];

      if (record) {
        var apiData = null;
        if (record.JsonPayload) {
          try {
            apiData = typeof record.JsonPayload === 'string' ? JSON.parse(record.JsonPayload) : record.JsonPayload;
          } catch(e) {
            console.warn('[OrderPrintService] Error parsing JsonPayload:', e);
          }
        }
        if (apiData) {
          // SQL Server đã xử lý hoàn chỉnh JsonPayload (đọc số tiền, nhóm size, format tiền)
          // Sử dụng trực tiếp dữ liệu từ SQL để đạt hiệu năng tối đa
          if (!apiData.lines && apiData.ChiTietDonHang) apiData.lines = apiData.ChiTietDonHang;
          if (!apiData.ChiTietDonHang && apiData.lines) apiData.ChiTietDonHang = apiData.lines;
          return Object.assign({}, baseOrderObj, apiData);
        }
        return _printData(Object.assign({}, baseOrderObj, record));
      }
      return _printData(baseOrderObj);
    }).catch(function (err) {
      console.warn('[OrderPrintService] Lỗi gọi API_InDonHang, dùng dữ liệu sẵn có:', err);
      return _printData(baseOrderObj);
    });
  }

  function generate(order) {
    var config = _documentConfig();
    var baseApi = config && config.BASE_API;
    var template = config && config.ORDER_TEMPLATE;
    var uploadsUrl = config && config.UPLOADS_URL;

    if (!baseApi || !uploadsUrl || !template) {
      _message('error', 'Chưa cấu hình in ấn', 'Thiếu DOCUMENT_MANAGER trong env.js.');
      return Promise.reject(new Error('Document Server chưa được cấu hình.'));
    }

    var docId = typeof order === 'string' ? order 
      : (order && (order.so_ct || order.SoPhieu || order.DocumentID || order.id));
    if (!docId) {
      _message('error', 'Không thể in đơn hàng', 'Không tìm thấy số chứng từ của đơn hàng.');
      return Promise.reject(new Error('Thiếu số chứng từ.'));
    }

    return _resolvePrintData(order).then(function (finalPayload) {
      return fetch(baseApi + '/generate', {
        method: 'POST',
        headers: _authHeaders(),
        body: JSON.stringify({
          templateType: template,
          outputFileName: 'Phieu_dat_hang_' + _safeFilePart(finalPayload.SoPhieu || docId),
          rowData: finalPayload,
          convertToPdf: false
        })
      });
    })
      .then(function (response) {
        return response.json().catch(function () { return {}; }).then(function (body) {
          if (!response.ok || !body.success) {
            throw new Error(body.message || 'Document Server không thể tạo file tài liệu.');
          }
          return body;
        });
      })
      .then(function (result) {
        var fileName = (result && result.fileName) || (result && result.data && result.data.fileName) || '';
        var fileUrl = (result && result.fileUrl) || (result && result.data && result.data.fileUrl) || '';

        var downloadUrl = fileUrl || (fileName ? (uploadsUrl + fileName) : '');

        if (downloadUrl) {
          var isLocal = ['localhost', '127.0.0.1'].indexOf(window.location.hostname) !== -1;
          if (!isLocal) {
            if (downloadUrl.indexOf('http://') === 0 || downloadUrl.indexOf('https://') === 0) {
              try {
                var urlObj = new URL(downloadUrl);
                if (urlObj.pathname.indexOf('/output/') === 0) {
                  downloadUrl = '/docserver' + urlObj.pathname;
                }
              } catch (e) {
                console.warn('[OrderPrintService] Lỗi parse URL download:', e);
              }
            } else if (downloadUrl.indexOf('/output/') === 0) {
              downloadUrl = '/docserver' + downloadUrl;
            }
          }
        }

        if (!downloadUrl || downloadUrl.endsWith('/undefined')) {
          throw new Error('Server không trả về tập tin hợp lệ.');
        }

        var anchor = document.createElement('a');
        anchor.href = downloadUrl;
        anchor.target = '_blank';
        anchor.rel = 'noopener';
        anchor.download = fileName || 'Phieu_dat_hang.docx';
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        _message('success', 'Đã tạo phiếu đặt hàng', 'File DOCX đang được tải xuống.');
        return result;
      })
      .catch(function (err) {
        _message('error', 'Không thể tạo file Word DOCX', err.message || 'Không kết nối được Document Server.');
        throw err;
      });
  }

  function _formatDateVietnamese(dateStr) {
    if (!dateStr) return 'Ngày ... tháng ... năm ...';
    var date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      var parts = dateStr.split(/[-/]/);
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          return 'Ngày ' + parts[2] + ' tháng ' + parts[1] + ' năm ' + parts[0];
        }
        return 'Ngày ' + parts[0] + ' tháng ' + parts[1] + ' năm ' + parts[2];
      }
      return dateStr;
    }
    var d = String(date.getDate()).padStart(2, '0');
    var m = String(date.getMonth() + 1).padStart(2, '0');
    var y = date.getFullYear();
    return 'Ngày ' + d + ' tháng ' + m + ' năm ' + y;
  }

  function printBrowser(order) {
    if (!order) return;
    
    _resolvePrintData(order).then(function (finalPayload) {
      var lines = finalPayload.lines || [];
      if (!lines.length) {
        _message('error', 'Không có sản phẩm để in');
        return;
      }
      
      // 1. Extract unique sizes
      var uniqueSizes = [];
      var sizeMap = {};
      lines.forEach(function (line) {
        var sizesArr = _parseSizeList(line);
        if (Array.isArray(sizesArr)) {
          sizesArr.forEach(function (s) {
            var sz = String(s.size || s.Size || s.ten_size || s.TenSize || '').trim();
            var q = parseInt(s.qty || s.Qty || s.so_luong || s.Quantity || 0);
            if (sz && q > 0) {
              if (!sizeMap[sz]) {
                sizeMap[sz] = true;
                uniqueSizes.push(sz);
              }
            }
          });
        }
      });
      
      _sortSizes(uniqueSizes);
      
      // 3. Build Table Headers
      var headHtml = '<tr><th style="min-width:120px; text-align:left;">SẢN PHẨM</th><th>MÀU</th>';
      uniqueSizes.forEach(function (sz) {
        headHtml += '<th class="text-center">' + sz + '</th>';
      });
      headHtml += '<th class="text-center">TỔNG</th><th class="text-right">THÀNH TIỀN</th></tr>';
      
      // 4. Build Table Rows
      var totalQtyAll = 0;
      var totalMoneyAll = 0;
      var sizeTotals = {};
      uniqueSizes.forEach(function (sz) { sizeTotals[sz] = 0; });
      
      var bodyRowsHtml = lines.map(function (line) {
        var productCode = line.ItemID || line.ten_hang_2 || line.ma_hang || line.MaHang || '';
        var productName = line.ItemName || line.ten_hang || line.TenHang || '';
        var color = line.mau || line.MauSac || line.Mau || '—';
        
        var lineSizes = {};
        var sizesArr = _parseSizeList(line);
        
        if (Array.isArray(sizesArr)) {
          sizesArr.forEach(function (s) {
            var sz = s.size || s.Size || s.ten_size || s.TenSize;
            var q = parseInt(s.qty || s.Qty || s.so_luong || s.Quantity || 0);
            if (sz) {
              lineSizes[sz] = (lineSizes[sz] || 0) + q;
            }
          });
        }
        
        var lineQty = 0;
        var sizeCellsHtml = uniqueSizes.map(function (sz) {
          var q = lineSizes[sz] || 0;
          lineQty += q;
          sizeTotals[sz] += q;
          return '<td class="text-center">' + (q > 0 ? q : '-') + '</td>';
        }).join('');
        
        if (uniqueSizes.length === 0 || lineQty === 0) {
          var fallbackQty = Number(line.so_luong || line.Quantity || line.SoLuong || 0);
          if (fallbackQty > 0) lineQty = fallbackQty;
        }
        
        totalQtyAll += lineQty;
        var rawPrice = line.DonGia || line.don_gia || line.UnitPrice;
        var price = _parseMoney(rawPrice);
        var amount = (line.ThanhTien !== undefined && line.ThanhTien !== null && line.ThanhTien !== '') 
          ? _parseMoney(line.ThanhTien) 
          : (lineQty * price);
        totalMoneyAll += amount;
        
        var displayAmount = (line.ThanhTien && String(line.ThanhTien).trim()) ? line.ThanhTien : _money(amount);
        
        return '<tr>' +
          '<td>' +
            '<div class="product-name-container">' +
              '<span class="product-code">' + productCode + '</span>' +
              '<span class="product-desc">' + productName + '</span>' +
            '</div>' +
          '</td>' +
          '<td class="text-center">' + color + '</td>' +
          sizeCellsHtml +
          '<td class="text-center text-bold">' + lineQty + '</td>' +
          '<td class="text-right text-bold">' + displayAmount + '</td>' +
          '</tr>';
      }).join('');
      
      // 5. Build Table Footer
      var displayTotalMoney = finalPayload.TongTienHang || finalPayload.TongThanhToan || _money(totalMoneyAll);
      var footerHtml = '<tr class="total-row">' +
        '<td colspan="2" class="text-right">Tổng cộng:</td>';
      uniqueSizes.forEach(function (sz) {
        footerHtml += '<td class="text-center orange-text">' + sizeTotals[sz] + '</td>';
      });
      footerHtml += '<td class="text-center orange-text">' + totalQtyAll + '</td>' +
        '<td class="text-right orange-text">' + displayTotalMoney + '</td>' +
        '</tr>';
        
      // 6. Build Customer Info
      var documentNo = finalPayload.SoPhieu || '';
      var dateStr = finalPayload.NgayLap || '';
      var dateFormatted = _formatDateVietnamese(dateStr);
      
      var logoUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, "") + "/images/logo.png";
      
      var html = [
        '<div class="invoice-container" style="background: #fff; font-family: \'Times New Roman\', Times, serif; color: #000; position: relative;">',
        '  <table style="width: 100%; border-collapse: collapse; margin-bottom: 5px;">',
        '    <tr>',
        '      <td style="width: 30%; text-align: left; vertical-align: middle; padding: 0;">',
        '        <img src="' + logoUrl + '" alt="SANTINO" style="height: 48px; display: inline-block;">',
        '      </td>',
        '      <td style="width: 70%; text-align: right; vertical-align: middle; font-size: 11px; line-height: 1.4; color: #000; padding: 0;">',
        '        <div style="font-size: 14px; font-weight: bold; text-transform: uppercase; margin-bottom: 2px;">Công ty CP LSP Việt Nam</div>',
        '        <div>Số 48, Phố Lạc Trung, Q. Hai Bà Trưng, Hà Nội</div>',
        '        <div>Tel: (024) 3204 9988  |  Fax: (024) 3215 1142</div>',
        '        <div>Email: info@santino.com.vn  |  Web: www.santino.com.vn</div>',
        '      </td>',
        '    </tr>',
        '  </table>',
        '  <div style="border-top: 2px solid #000; margin: 8px 0 12px 0;"></div>',
        '  <div style="text-align: center; margin-bottom: 15px; position: relative;">',
        '    <h2 style="font-size: 20px; font-weight: bold; margin: 0 0 4px 0; letter-spacing: 0.5px;">PHIẾU ĐẶT HÀNG</h2>',
        '    <div style="font-size: 13px; font-style: italic; color: #333; margin: 0;">' + dateFormatted + '</div>',
        '    <div style="position: absolute; right: 0; bottom: 0; font-size: 12px; font-weight: bold;">' + documentNo + '</div>',
        '  </div>',
        '  <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 13.5px; line-height: 1.5;">',
        '    <tr>',
        '      <td style="padding: 2px 0; width: 60%;">',
        '        <span style="font-weight: bold; display: inline-block; width: 90px;">Khách hàng :</span>',
        '        <span style="font-weight: bold;">' + (finalPayload.TenKhachHang || '—') + '</span>',
        '      </td>',
        '      <td style="padding: 2px 0; width: 40%;">',
        '        <span style="font-weight: bold; display: inline-block; width: 60px;">MKH :</span>',
        '        <span style="font-weight: bold;">' + (finalPayload.MaKH || '—') + '</span>',
        '      </td>',
        '    </tr>',
        '    <tr>',
        '      <td style="padding: 2px 0; vertical-align: top;">',
        '        <span style="font-weight: bold; display: inline-block; width: 90px; vertical-align: top;">Địa chỉ :</span>',
        '        <span style="display: inline-block; width: calc(100% - 95px); line-height: 1.3;">' + (finalPayload.DiaChi || '—') + '</span>',
        '      </td>',
        '      <td style="padding: 2px 0; vertical-align: top;">',
        '        <span style="font-weight: bold; display: inline-block; width: 60px;">SĐT :</span>',
        '        <span>' + (finalPayload.SDT || '—') + '</span>',
        '      </td>',
        '    </tr>',
        '    <tr>',
        '      <td colspan="2" style="padding: 2px 0;">',
        '        <span style="font-weight: bold; display: inline-block; width: 90px;">Diễn giải :</span>',
        '        <span>' + (finalPayload.DienGiai || '—') + '</span>',
        '      </td>',
        '    </tr>',
        '  </table>',
        '  <div class="tbl-wrap" style="border: 1px solid #000;">',
        '    <table style="width: 100%; border-collapse: collapse;">',
        '      <thead>' + headHtml + '</thead>',
        '      <tbody>' + bodyRowsHtml + '</tbody>',
        '      <tfoot>' + footerHtml + '</tfoot>',
        '    </table>',
        '  </div>',
        '  <div style="border: 1px solid #000; border-top: none; padding: 6px 8px; font-size: 12.5px; font-weight: bold; background: #fff; margin-bottom: 12px;">',
        '    Tổng theo size: <span style="font-weight: normal;">' + (finalPayload.tong_theo_size || '—') + '</span>',
        '  </div>',
        '  <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 13px; line-height: 1.6;">',
        '    <tr>',
        '      <td style="vertical-align: top; width: 55%;">',
        '        <div style="font-weight: bold;">Tổng số lượng: <span style="font-weight: normal;">' + totalQtyAll + ' sản phẩm</span></div>',
        '        <div style="font-style: italic; color: #333; margin-top: 4px;">Bằng chữ: ' + (finalPayload.TienBangChu || '—') + '</div>',
        '      </td>',
        '      <td style="vertical-align: top; width: 45%; text-align: right; line-height: 1.5;">',
        '        <div>Tổng tiền hàng: <span style="font-weight: bold;">' + displayTotalMoney + ' đ</span></div>',
        '        <div>Chiết khấu: <span style="font-weight: bold;">' + (finalPayload.TienChietKhau || '0') + ' đ</span></div>',
        '        <div>Chiết khấu khác: <span style="font-weight: bold;">' + (finalPayload.ChietKhauKhac || '0') + ' đ</span></div>',
        '        <div style="border-top: 1px solid #000; margin: 6px 0 4px auto; width: 75%;"></div>',
        '        <div style="font-size: 14px; font-weight: bold;">TỔNG THANH TOÁN: ' + (finalPayload.TongThanhToan || displayTotalMoney) + ' đ</div>',
        '      </td>',
        '    </tr>',
        '  </table>',
        '  <table style="width: 100%; text-align: center; margin-top: 35px; font-size: 13px; line-height: 1.4;">',
        '    <tr>',
        '      <td style="width: 20%; vertical-align: top;"><span style="font-weight: bold;">Người nhận</span><br><span style="font-style: italic; font-size: 11px;">(Ký / họ tên)</span></td>',
        '      <td style="width: 20%; vertical-align: top;"><span style="font-weight: bold;">Người giao</span><br><span style="font-style: italic; font-size: 11px;">(Ký / họ tên)</span></td>',
        '      <td style="width: 20%; vertical-align: top;"><span style="font-weight: bold;">Thủ kho</span><br><span style="font-style: italic; font-size: 11px;">(Ký / họ tên)</span></td>',
        '      <td style="width: 20%; vertical-align: top;"><span style="font-weight: bold;">Kế toán</span><br><span style="font-style: italic; font-size: 11px;">(Ký / họ tên)</span></td>',
        '      <td style="width: 20%; vertical-align: top;"><span style="font-weight: bold;">Thủ trưởng</span><br><span style="font-style: italic; font-size: 11px;">(Ký / họ tên)</span></td>',
        '    </tr>',
        '  </table>',
        '</div>'
      ].join('\n');
      
      // Open a new print window
      var printWindow = window.open('', '_blank', 'width=900,height=800');
      if (!printWindow) {
        _message('error', 'Không thể in', 'Vui lòng tắt trình chặn popup của trình duyệt.');
        return;
      }
      
      printWindow.document.write('<html><head><title>Phiếu đặt hàng - ' + documentNo + '</title>');
      printWindow.document.write('<style>');
      printWindow.document.write('body { font-family: "Times New Roman", Times, serif; color: #000; margin: 1cm; padding: 0; background: #fff; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }');
      printWindow.document.write('.tbl-wrap table { width: 100%; border-collapse: collapse; }');
      printWindow.document.write('.tbl-wrap th, .tbl-wrap td { border: 1px solid #000; padding: 6px 4px; font-size: 12.5px; vertical-align: middle; }');
      printWindow.document.write('.tbl-wrap th { background-color: #f2f2f2 !important; font-weight: bold; font-size: 12px; }');
      printWindow.document.write('.product-name-container { display: flex; flex-direction: column; }');
      printWindow.document.write('.product-code { font-weight: bold; color: #d97706; }');
      printWindow.document.write('.product-desc { font-size: 10.5px; color: #555; margin-top: 2px; }');
      printWindow.document.write('.text-center { text-align: center; }');
      printWindow.document.write('.text-right { text-align: right; }');
      printWindow.document.write('.text-bold { font-weight: bold; }');
      printWindow.document.write('.orange-text { color: #d97706 !important; }');
      printWindow.document.write('.total-row { font-weight: bold; background-color: #f9f9f9 !important; }');
      printWindow.document.write('@media print { body { margin: 1cm; } }');
      printWindow.document.write('</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write(html);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      
      setTimeout(function() {
        try {
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        } catch(e) {
          console.error('Lỗi khi in:', e);
        }
      }, 450);
    }).catch(function (err) {
      _message('error', 'Không thể in', err.message || 'Lỗi chuẩn bị dữ liệu in.');
    });
  }

  return { 
    generate: generate,
    printBrowser: printBrowser
  };
})();

