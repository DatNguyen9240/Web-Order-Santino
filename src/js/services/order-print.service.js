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

  function _printData(order) {
    if (!order) return {};
    
    var rawLines = Array.isArray(order.ChiTietDonHang) ? order.ChiTietDonHang
      : (Array.isArray(order.lines) ? order.lines
      : (Array.isArray(order.print_items) ? order.print_items : []));

    var formattedLines = rawLines.map(function (line, index) {
      var price = _parseMoney(line.don_gia || line.UnitPrice || line.DonGia);
      var qty = Number(line.so_luong || line.Quantity || line.SoLuong || 0);
      var rawTotal = line.thanh_tien || line.Amount || line.ThanhTien;
      var total = rawTotal !== undefined && rawTotal !== null ? _parseMoney(rawTotal) : (price * qty);
      var stt = line.STT || line.stt || (index + 1);
      var itemName = line.ten_hang || line.ItemName || line.TenHang || line.ten_hang_2 || '';
      var itemCode = line.ma_hang || line.ItemID || line.MaHang || line.ten_hang_2 || '';
      var unit = line.dvt || line.don_vi_tinh || line.Unit || line.DVT || 'Chiếc';
      var kho = line.kho || line.Kho || line.BranchName || order.chi_nhanh || order.BranchID || '';
      var discount = line.chiet_khau || line.ChietKhau || 0;

      return Object.assign({}, line, {
        STT: stt,
        stt: stt,
        Kho: kho,
        kho: kho,
        MaHang: itemCode,
        ma_hang: itemCode,
        TenHang: itemName,
        ten_hang: itemName,
        DVT: unit,
        dvt: unit,
        don_vi_tinh: unit,
        DonGia: _money(price),
        don_gia: price,
        don_gia_display: _money(price),
        SoLuong: qty,
        so_luong: qty,
        so_luong_display: qty,
        ChietKhau: discount,
        chiet_khau: discount,
        ThanhTien: _money(total),
        thanh_tien: total,
        thanh_tien_display: _money(total)
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
      kh_ten: order.kh_ten || order.TenKhachHang || order.ObjectName || '',
      khach_hang: order.khach_hang || order.TenKhachHang || order.ObjectName || '',
      MaKH: order.MaKH || order.ma_kh || order.ObjectID || '',
      ma_kh: order.ma_kh || order.MaKH || order.ObjectID || '',
      DiaChi: order.DiaChi || order.dia_chi || order.diachi || order.Address || '',
      dia_chi: order.dia_chi || order.DiaChi || order.Address || '',
      SDT: order.SDT || order.sdt || order.Phone || '',
      sdt: order.sdt || order.SDT || order.Phone || '',
      DienGiai: order.DienGiai || order.ghi_chu || order.dien_giai || order.Memo || '',
      ghi_chu: order.ghi_chu || order.DienGiai || order.Memo || '',
      dien_giai: order.dien_giai || order.DienGiai || order.Memo || '',
      
      TongTienHang: _money(totalMoney),
      total_money: totalMoney,
      total_money_display: _money(totalMoney),
      TienChietKhau: _money(order.TienChietKhau || 0),
      TienSauChietKhau: _money(order.TienSauChietKhau || totalMoney),
      ChietKhauKhac: order.ChietKhauKhac || 0,
      TongThanhToan: _money(order.TongThanhToan || totalMoney),
      TongSoLuong: totalQty,
      total_qty: totalQty,

      ChiTietDonHang: formattedLines,
      lines: formattedLines,
      print_items: formattedLines
    });

    return payload;
  }

  function generate(order) {
    var config = _documentConfig();
    var baseApi = config && config.BASE_API;
    var template = config && config.ORDER_TEMPLATE;
    var uploadsUrl = config && config.UPLOADS_URL;

    if (!baseApi || !uploadsUrl || !template) {
      _message('error', 'Chưa cấu hình in DOCX', 'Thiếu DOCUMENT_MANAGER trong env.js.');
      return Promise.reject(new Error('Document Server chưa được cấu hình.'));
    }

    var docId = order && (order.so_ct || order.SoPhieu || order.DocumentID || order.id);
    if (!docId) {
      _message('error', 'Không thể in đơn hàng', 'Không tìm thấy số chứng từ của đơn hàng.');
      return Promise.reject(new Error('Thiếu số chứng từ.'));
    }

    var fetchApiData = Promise.resolve(null);
    if (typeof Http !== 'undefined' && typeof API_CONFIG !== 'undefined') {
      fetchApiData = Http.get(API_CONFIG.ENDPOINTS.CATEGORIES.LIST, {
        q: JSON.stringify({ Loai: 'InDonHang', TimKiem: docId, DocumentID: docId }),
        _t: Date.now()
      }).then(function (res) {
        var record = null;
        if (res && res.records && res.records.length > 0) record = res.records[0];
        else if (res && res.JsonPayload) record = res;
        else if (Array.isArray(res) && res.length > 0) record = res[0];

        if (record) {
          if (record.JsonPayload) {
            return typeof record.JsonPayload === 'string' ? JSON.parse(record.JsonPayload) : record.JsonPayload;
          }
          return record;
        }
        return null;
      }).catch(function (err) {
        console.warn('[OrderPrintService] Lỗi gọi API_InDonHang, dùng dữ liệu đơn hàng sẵn có:', err);
        return null;
      });
    }

    return fetchApiData.then(function (apiData) {
      var sourceData = apiData ? Object.assign({}, order, apiData) : order;
      var finalPayload = _printData(sourceData);

      return fetch(baseApi + '/generate', {
        method: 'POST',
        headers: _authHeaders(),
        body: JSON.stringify({
          templateType: template,
          outputFileName: 'Phieu_dat_hang_' + _safeFilePart(finalPayload.SoPhieu || docId),
          rowData: finalPayload
        })
      });
    })
      .then(function (response) {
        return response.json().catch(function () { return {}; }).then(function (body) {
          if (!response.ok || !body.success) {
            throw new Error(body.message || 'Document Server không thể tạo file DOCX.');
          }
          return body;
        });
      })
      .then(function (result) {
        var fileName = (result && result.fileName) || (result && result.data && result.data.fileName) || '';
        var fileUrl = (result && result.fileUrl) || (result && result.data && result.data.fileUrl) || '';
        var downloadUrl = fileName ? (uploadsUrl + encodeURIComponent(fileName)) : fileUrl;

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
        _message('error', 'Không thể in DOCX', err.message || 'Không kết nối được Document Server.');
        throw err;
      });
  }

  return { generate: generate };
})();

