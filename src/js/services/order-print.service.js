/**
 * OrderPrintService
 * Gửi dữ liệu đơn hàng sang Backend Document Server để sinh file Word (.docx)
 * từ template được cấu hình trong env.js.
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
      if (trimmed.indexOf(',') >= 0 || trimmed.indexOf('.') >= 0 || trimmed.indexOf('đ') >= 0) {
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

  function _printData(order) {
    if (!order) return {};
    
    var rawLines = Array.isArray(order.ChiTietDonHang) ? order.ChiTietDonHang
      : (Array.isArray(order.Lines) ? order.Lines
      : (Array.isArray(order.lines) ? order.lines
      : (Array.isArray(order.print_items) ? order.print_items : [])));

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
      var formattedSizesList = [];
      var lineSizeItems = [];

      if (Array.isArray(sizesArr) && sizesArr.length > 0) {
        sizesArr.forEach(function (s) {
          var sz = String(s.size || s.Size || s.ten_size || s.TenSize || '').trim();
          var q = Math.round(Number(s.qty || s.Qty || s.so_luong || s.Quantity || 0));
          if (sz && q > 0) {
            formattedSizesList.push({ size: sz, qty: q });
            lineSizeItems.push(sz + '×' + q);
          }
        });
      }
      
      var sizeQtyText = lineSizeItems.join(' · ');
      var color = line.mau || line.MauSac || line.Mau || line.mau_sac || '';

      return Object.assign({}, line, {
        STT: stt,
        Kho: kho,
        MaHang: itemCode,
        ten_hang_2: itemCode,
        TenHang: itemName,
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
            console.warn('[OrderPrintService] Lỗi parse JsonPayload:', e);
          }
        }
        if (apiData) {
          // SQL Server đã xử lý hoàn chỉnh JsonPayload (đọc số tiền, nhóm size, format tiền)
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

  function generate(order, options) {
    var opts = options || {};
    var convertToPdf = opts.convertToPdf !== undefined ? !!opts.convertToPdf : true;

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
          convertToPdf: convertToPdf
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
        anchor.download = fileName || (convertToPdf ? 'Phieu_dat_hang.pdf' : 'Phieu_dat_hang.docx');
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        _message('success', 'Đã tạo phiếu đặt hàng', (convertToPdf ? 'File PDF' : 'File DOCX') + ' đang được tải xuống.');
        return result;
      })
      .catch(function (err) {
        _message('error', convertToPdf ? 'Không thể tạo file PDF' : 'Không thể tạo file Word DOCX', err.message || 'Không kết nối được Document Server.');
        throw err;
      });
  }

  return { 
    generate: generate
  };
})();
