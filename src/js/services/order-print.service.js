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
    if (typeof Utils !== 'undefined' && typeof Utils.formatMoney === 'function') {
      return Utils.formatMoney(value || 0);
    }
    return Number(value || 0).toLocaleString('vi-VN');
  }

  function _message(type, title, detail) {
    if (typeof Alert !== 'undefined' && typeof Alert[type] === 'function') {
      Alert[type](title, detail);
      return;
    }
    if (typeof showToast === 'function') showToast(detail || title, type === 'success');
  }

  function _printData(order) {
    var data = Object.assign({}, order || {});
    data.lines = (Array.isArray(order && order.lines) ? order.lines : []).map(function (line, index) {
      return Object.assign({
        STT: index + 1,
        dvt: line.dvt || line.don_vi_tinh || '',
        don_gia_display: _money(line.don_gia),
        thanh_tien_display: _money(line.thanh_tien)
      }, line);
    });
    data.khach_hang = order.kh_ten || order.khach_hang || order.ObjectName || '';
    data.dia_chi = order.dia_chi || order.diachi || '';
    data.ghi_chu = order.ghi_chu || order.dien_giai || '';
    data.total_qty = data.lines.reduce(function (total, line) {
      return total + Number(line.so_luong || 0);
    }, 0);
    data.total_money_display = _money(order && order.total_money);
    return data;
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

    if (!order || !order.so_ct) {
      _message('error', 'Không thể in đơn hàng', 'Không tìm thấy số chứng từ của đơn hàng.');
      return Promise.reject(new Error('Thiếu số chứng từ.'));
    }

    return fetch(baseApi + '/generate', {
      method: 'POST',
      headers: _authHeaders(),
      body: JSON.stringify({
        templateType: template,
        outputFileName: 'Phieu_dat_hang_' + _safeFilePart(order.so_ct),
        rowData: _printData(order)
      })
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
        var downloadUrl = uploadsUrl + encodeURIComponent(result.fileName);
        var anchor = document.createElement('a');
        anchor.href = downloadUrl;
        anchor.target = '_blank';
        anchor.rel = 'noopener';
        anchor.download = result.fileName;
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
