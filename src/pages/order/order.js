var OrderPage = (function () {
  var orderRows = [];
  var multiSelectedCodes = [];
  var cachedProds = {};
  var cachedSizes = [];

  function render($el) {
    return Router.fetchTemplate('src/pages/order/order.html')
      .then(function (html) {
        $el.innerHTML = html;
        _init();
      });
  }

  async function _init() {
    var resSizes = await ProductService.getSizes();
    if (Array.isArray(resSizes) && resSizes.length > 0) {
      cachedSizes = resSizes;
    }
    document.getElementById('o-so-ct').value = Utils.genOrderNo();
    document.getElementById('o-ngay').value = Utils.today();
    document.getElementById('o-kh-ten').value = '';
    document.getElementById('o-ma-kh').value = '';
    document.getElementById('o-ma-dl').value = '';
    document.getElementById('o-ngay-tt').value = Utils.today();
    document.getElementById('o-kh-dc').value = '';

    var sel = document.getElementById('o-ctbh');
    sel.innerHTML = '<option value="">-- Không áp dụng CTKM --</option>';

    if (sel.options.length > 0) sel.selectedIndex = 0;

    renderMatrix();
    document.addEventListener('click', function (e) {
      // In default multi-mode, user must explicitly click "Hủy" or "Thêm đã chọn"
    });
  }

  function updateInfoSummary() {
    var name = document.getElementById('o-kh-ten').value.trim();
    var maKH = document.getElementById('o-ma-kh').value.trim();
    var ptGiao = document.getElementById('o-pt-giao').value;
    var summary = document.getElementById('info-summary-display');
    if (!summary) return;

    if (!name && !maKH) {
      summary.innerHTML = 'Chạm để khai báo thông tin...';
      summary.style.color = 'var(--text)';
    } else {
      var displayName = (maKH ? maKH + ' - ' : '') + (name || 'Khách lẻ');
      var parts = [displayName];
      if (ptGiao) parts.push(ptGiao);
      summary.innerHTML = parts.join(' | ');
      summary.style.color = 'var(--primary)';
    }
  }

  async function acSearch(val) {
    var btnClear = document.getElementById('ac-clear');
    if (btnClear) btnClear.style.display = val ? 'block' : 'none';

    var list = document.getElementById('ac-list');
    if (!val || val.length < 2) { list.classList.remove('show'); return; }

    // Gọi API qua Service lấy sản phẩm
    var prods = await ProductService.getProducts(val);
    prods.forEach(function(p) { cachedProds[p.ten_hang_2] = p; });

    if (!prods.length) {
      list.innerHTML = '<div class="ac-item"><small>Không tìm thấy sản phẩm</small></div>';
      list.classList.add('show');
      return;
    }

    var html = '<div class="ac-header"><div style="width:24px; margin-right:12px; flex-shrink:0"></div><div class="ac-col-1">SẢN PHẨM</div><div class="ac-col-2" style="min-width:45px">FORM</div><div class="ac-col-3" style="min-width:26px; text-align:center">TỒN</div><div class="ac-col-3" style="min-width:75px">ĐƠN GIÁ</div></div>';

    html += prods.slice(0, 8).map(function (p) {
      var pos = multiSelectedCodes.indexOf(p.ten_hang_2);
      var isChecked = pos !== -1 ? 'checked' : '';
      var numDisplay = pos !== -1 ? 'flex' : 'none';
      var numVal = pos !== -1 ? (pos + 1) : '';
      var brand = p.ten_hang_2.match(/^[A-Z]+/); brand = brand ? brand[0] : '';
      var stock = p.ton_kho !== undefined ? p.ton_kho : (Math.floor(Math.random() * 50) + 10);
      var stockColor = stock > 20 ? 'var(--success)' : 'var(--accent)';
      return '<div class="ac-table-row" onclick="OrderPage.toggleAcSelect(event, \'' + p.ten_hang_2 + '\')">' +
        '<div style="position:relative; margin-right:12px; width:18px; height:18px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">' +
        '<input type="checkbox" class="chk-code" ' + isChecked + ' id="chk-' + p.ten_hang_2 + '" value="' + p.ten_hang_2 + '" onclick="event.stopPropagation(); OrderPage.toggleAcSelect(event, \'' + p.ten_hang_2 + '\')" style="margin:0; width:16px; height:16px; cursor:pointer;">' +
        '<div class="chk-num" id="chk-num-' + p.ten_hang_2 + '" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); pointer-events:none; display:' + numDisplay + '; align-items:center; justify-content:center; width:18px; height:18px; background:var(--primary); color:white; font-size:11px; font-weight:bold; border-radius:4px;">' + numVal + '</div>' +
        '</div>' +
        '<div class="ac-col-1" style="padding-right:4px;"><strong>' + p.ten_hang_2 + '</strong><div style="font-size:calc(12px * var(--text-scale,1)); color:var(--muted); white-space:normal; line-height:1.2"><span class="ac-desc">' + p.ten_hang_hoa + '</span> - <small>' + p.mau + '</small></div></div>' +
        '<div class="ac-col-2" style="min-width:45px"><span class="ac-form-badge">' + brand + '</span></div>' +
        '<div class="ac-col-3" style="min-width:26px; text-align:center; font-weight:700; color:' + stockColor + '">' + stock + '</div>' +
        '<div class="ac-col-3" style="min-width:75px">' + Utils.formatMoney(p.don_gia) + '</div>' +
        '</div>';
    }).join('');

    html += '<div class="ac-actions" style="display:flex;gap:8px;padding:12px;border-top:1px solid var(--border);background:var(--surface);position:sticky;bottom:-8px;margin:0 -8px -8px -8px;z-index:10;border-radius:0 0 12px 12px">' +
      '<button class="btn btn-ghost btn-sm" style="flex:1" onclick="OrderPage.closeAc()">Hủy</button>' +
      '<button id="btn-add-multi" class="btn btn-primary btn-sm" style="flex:1" onclick="OrderPage.addSelectedProds()">Thêm đã chọn</button>' +
      '</div>';
    list.innerHTML = html;
    list.classList.add('show');
  }

  function selectAcSingle(code) {
    document.getElementById('ac-input').value = code;
    document.getElementById('ac-list').classList.remove('show');
    addProductRow();
  }

  function toggleAcSelect(e, code) {
    if (e && e.target.tagName !== 'INPUT') {
      var chk = document.getElementById('chk-' + code);
      if (chk) chk.checked = !chk.checked;
    }
    
    var chk = document.getElementById('chk-' + code);
    if (chk) {
      var idx = multiSelectedCodes.indexOf(code);
      if (chk.checked && idx === -1) {
        multiSelectedCodes.push(code);
      } else if (!chk.checked && idx !== -1) {
        multiSelectedCodes.splice(idx, 1);
      }
    }
    
    document.querySelectorAll('.ac-table-row').forEach(function(row) {
      var cCode = row.querySelector('.chk-code');
      if (cCode) {
        var cVal = cCode.value;
        var numB = document.getElementById('chk-num-' + cVal);
        var pos = multiSelectedCodes.indexOf(cVal);
        if (pos !== -1) {
          cCode.checked = true;
          if(numB) { numB.textContent = (pos + 1); numB.style.display = 'flex'; }
        } else {
          cCode.checked = false;
          if(numB) { numB.style.display = 'none'; }
        }
      }
    });

    _updateMultiAddButton();
  }

  function _updateMultiAddButton() {
    var count = multiSelectedCodes.length;
    var btn = document.getElementById('btn-add-multi');
    if (btn) {
      btn.innerHTML = count > 0 ? ('Thêm ' + count + ' sản phẩm') : 'Thêm đã chọn';
    }
  }

  function closeAc() {
    multiSelectedCodes = [];
    document.getElementById('ac-list').classList.remove('show');
  }

  function addSelectedProds() {
    var codes = multiSelectedCodes;
    if (codes.length === 0) {
      showToast('Vui lòng chọn sản phẩm', false);
      return;
    }
    var added = 0;
    for (var i = codes.length - 1; i >= 0; i--) {
      var code = codes[i];
      var prod = cachedProds[code];
      if (prod && !orderRows.find(function (r) { return r.ten_hang_2 === code; })) {
        var nhomSize = prod.nhom_size || prod.nhom_hang || prod.Nhom_hang || prod.NhomHang || 'Nhóm 1';
        // Map tự động từ CategoryID (nhom_hang) sang NhomSize nếu API thiếu trường nhom_size
        var mapNhom = { 'TL': 'Nhóm 1', 'QA': 'Nhóm 2', 'SKU101': 'Nhóm 1', 'SKU102': 'Nhóm 3' };
        var mappedNhomSize = mapNhom[nhomSize] || mapNhom[nhomSize.toUpperCase()] || 'Nhóm 1';

        var sizes = cachedSizes.filter(function (s) { 
          var ns = s.nhom_size || s.Nhom_size || s.NhomSize || s.nhomSize;
          return ns === nhomSize || ns === mappedNhomSize; 
        }).sort(function (a, b) { return (a.stt || a.STT || 0) - (b.stt || b.STT || 0); });
        
        orderRows.unshift({ ten_hang_2: code, product: prod, sizes: sizes, quantities: {} });
        added++;
      }
    }
    if (added > 0) { renderMatrix(); showToast('Đã thêm ' + added + ' sản phẩm'); }
    else { showToast('Sản phẩm đã có trong đơn', false); }
    document.getElementById('ac-input').value = '';
    acSearch('');
    closeAc();
  }

  function addProductRow() {
    var code = document.getElementById('ac-input').value.trim();
    if (!code) { showToast('Vui lòng nhập sản phẩm', false); return; }
    var prod = cachedProds[code];
    if (!prod) { showToast('Không tìm thấy sản phẩm ' + code, false); return; }
    if (orderRows.find(function (r) { return r.ten_hang_2 === code; })) { showToast('Sản phẩm đã có trong đơn', false); return; }
    var nhomSize = prod.nhom_size || prod.nhom_hang || prod.Nhom_hang || prod.NhomHang || 'Nhóm 1';
    var mapNhom = { 'TL': 'Nhóm 1', 'QA': 'Nhóm 2', 'SKU101': 'Nhóm 1', 'SKU102': 'Nhóm 3' };
    var mappedNhomSize = mapNhom[nhomSize] || mapNhom[nhomSize.toUpperCase()] || 'Nhóm 1';

    var sizes = cachedSizes.filter(function (s) { 
      var ns = s.nhom_size || s.Nhom_size || s.NhomSize || s.nhomSize;
      return ns === nhomSize || ns === mappedNhomSize; 
    }).sort(function (a, b) { return (a.stt || a.STT || 0) - (b.stt || b.STT || 0); });
    
    orderRows.unshift({ ten_hang_2: code, product: prod, sizes: sizes, quantities: {} });
    document.getElementById('ac-input').value = '';
    acSearch('');
    renderMatrix();
    showToast('Đã thêm ' + code);
  }

  function renderMatrix() {
    var container = document.getElementById('matrix-container');
    if (!orderRows.length) {
      container.innerHTML = '<div class="empty-state" style="background:var(--surface); border-radius:12px; padding:32px; border:1px solid var(--border);"><span class="material-symbols-outlined">table_chart</span><span>Tìm và thêm sản phẩm để bắt đầu nhập số lượng</span></div>';
      _updateTotal(); return;
    }

    container.innerHTML = orderRows.map(function (row, ri) {
      var badgeHtml = '';
      var ctbh = document.getElementById('o-ctbh') ? document.getElementById('o-ctbh').value : '';
      if (ctbh) badgeHtml = '<span class="badge-success"><span class="material-symbols-outlined" style="font-size:12px">check</span> Đã áp CTKM</span>';

      var sizeRowsHtml = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(72px, 1fr)); gap: 12px; margin-top: 16px;">';
      sizeRowsHtml += row.sizes.map(function (s) {
        var sz = s.size || s.Size || s.ten_size || s.Ten_size || s.TenSize || s.tenSize || '?';
        var qty = row.quantities[sz] || '';
        var isFilled = qty > 0;
        var boxClass = isFilled ? 'size-box filled' : 'size-box';
        return '<div class="' + boxClass + '">' +
          '<div class="size-box-lbl">' + sz + '</div>' +
          '<input type="number" inputmode="numeric" min="0" placeholder="0" value="' + qty + '" oninput="OrderPage.updateQty(' + ri + ',\'' + sz + '\',this)">' +
          '</div>';
      }).join('');
      sizeRowsHtml += '</div>';

      return '<div class="card product-card">' +
        '<div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1px solid var(--border-light); padding-bottom:12px; gap:8px;">' +
        '<div style="flex:1; min-width:0;">' +
        '<div style="display:flex; flex-wrap:wrap; align-items:center; gap:6px 8px; margin-bottom:4px;">' +
        '<div style="font-size: 18px; font-weight:800; color:var(--primary); word-break: break-word;">' + row.ten_hang_2 + '</div>' +
        badgeHtml +
        '</div>' +
        '<div style="font-size: 14px; color:var(--muted);">' + (row.product.nhom_size || row.product.nhom_hang || 'TL') + ' | ' + (row.product.mau || 'Không màu') + ' | ' + Utils.formatMoney(row.product.don_gia || 0) + '</div>' +
        '</div>' +
        '<div style="display:flex; gap:8px;">' +
        '<button class="btn-icon" onclick="OrderPage.removeRow(' + ri + ')" title="Xóa sản phẩm" style="color:var(--danger)"><span class="material-symbols-outlined">delete</span></button>' +
        '</div>' +
        '</div>' +
        sizeRowsHtml +
        '</div>';
    }).join('');
    _updateTotal();
  }

  function updateQty(ri, size, inputEl) {
    var val = parseInt(inputEl.value) || 0;
    orderRows[ri].quantities[size] = val;
    if (val > 0) {
      inputEl.parentElement.classList.add('filled');
    } else {
      inputEl.parentElement.classList.remove('filled');
    }
    _updateTotal();
  }


  function removeRow(ri) { orderRows.splice(ri, 1); renderMatrix(); }

  function _updateTotal() {
    var qty = 0, money = 0;
    orderRows.forEach(function (r) { Object.entries(r.quantities).forEach(function (e) { if (e[1] > 0) { qty += e[1]; money += e[1] * r.product.don_gia; } }); });
    document.getElementById('total-qty').textContent = qty;
    document.getElementById('total-money').textContent = Utils.formatMoney(money);
    var oTongTien = document.getElementById('o-tong-tien');
    if (oTongTien) {
      oTongTien.value = Utils.formatMoney(money);
      oTongTien.dataset.value = money;
      calcChange();
    }
  }

  function calcChange() {
    var total = parseInt(document.getElementById('o-tong-tien').dataset.value || 0);
    var givenStr = document.getElementById('o-khach-dua').value;
    var given = givenStr ? parseInt(givenStr) : 0;
    var change = given - total;
    document.getElementById('o-tra-lai').value = Utils.formatMoney(change > 0 ? change : 0);
  }

  function _buildLines() {
    var ma_ctbh = document.getElementById('o-ctbh').value;
    var note = document.getElementById('o-note').value;
    // Lớp khiên VIP Aggregator: Sử dụng Map để gộp dòng (Data Normalization)
    var linesMap = {};

    orderRows.forEach(function (row) {
      Object.entries(row.quantities).forEach(function (e) {
        var size = e[0], qty = parseInt(e[1]) || 0;
        if (qty > 0) {
          var compositeKey = row.ten_hang_2 + '|' + size; // Khóa tổ hợp duy nhất
          
          if (linesMap[compositeKey]) {
            // Trùng lặp: Cộng dồn số lượng
            linesMap[compositeKey].so_luong += qty;
            linesMap[compositeKey].thanh_tien += (qty * (row.product.don_gia || 0));
          } else {
            // Mới: Khởi tạo dòng
            linesMap[compositeKey] = {
              ten_hang_2: row.ten_hang_2, sku: Utils.buildSKU(row.ten_hang_2, size),
              ten_hang: row.product.ten_hang_hoa, nhom_size: row.product.nhom_size,
              mau: row.product.mau,
              size: size, so_luong: qty, don_gia: (row.product.don_gia || 0),
              thanh_tien: qty * (row.product.don_gia || 0), ma_ctbh: ma_ctbh, ghi_chu: note
            };
          }
        }
      });
    });
    return Object.values(linesMap);
  }

  function previewOrder() {
    var lines = _buildLines();
    if (!lines.length) { showToast('Vui lòng chọn sản phẩm và nhập số lượng', false); return; }
    var info = document.getElementById('preview-info');
    info.innerHTML = [
      '<div><strong>Người nhận:</strong> ' + (document.getElementById('o-kh-ten')?.value || '—') + '</div>',
      '<div><strong>SĐT:</strong> ' + (document.getElementById('o-kh-sdt')?.value || '—') + '</div>',
      '<div><strong>Địa chỉ:</strong> ' + (document.getElementById('o-kh-dc')?.value || '—') + '</div>',
      '<div><strong>Ghi chú:</strong> ' + (document.getElementById('o-note')?.value || '—') + '</div>',
    ].join('');

    var totalQtyAll = lines.reduce(function(sum, l) { return sum + l.so_luong; }, 0);
    var totalMoneyAll = lines.reduce(function(sum, l) { return sum + l.thanh_tien; }, 0);

    var bodyHtml = orderRows.map(function(row) {
        var totalRowQty = 0;
        var totalRowMoney = 0;
        
        var sizeBoxesHtml = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(72px, 1fr)); gap: 12px; margin-top: 16px;">';
        
        row.sizes.forEach(function(s) {
            var sz = s.size || s.Size || s.ten_size || s.Ten_size || s.TenSize || s.tenSize || '?';
            var qty = row.quantities[sz] || 0;
            if (qty > 0) {
                totalRowQty += qty;
                totalRowMoney += qty * (row.product.don_gia || 0);
                sizeBoxesHtml += '<div class="size-box filled" style="pointer-events: none;">' + 
                    '<div class="size-box-lbl">' + Utils.escHtml(sz) + '</div>' +
                    '<div style="text-align:center; padding:8px 0; font-weight:bold; color:var(--primary); font-size:16px;">' + qty + '</div>' +
                '</div>';
            }
        });
        sizeBoxesHtml += '</div>';

        if (totalRowQty === 0) return '';

        return '<div class="preview-card card" style="margin-bottom: 12px; padding: 16px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface);">' +
            '<div class="preview-card-header" style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom: 1px solid var(--border-light); padding-bottom: 12px;">' +
              '<div>' +
                '<div style="font-size: 18px; font-weight:800; color:var(--primary); margin-bottom: 4px;">' + Utils.escHtml(row.ten_hang_2) + '</div>' +
                '<div style="font-size: 14px; color:var(--muted);">' + Utils.escHtml(row.product.mau || 'Không màu') + ' | ' + Utils.formatMoney(row.product.don_gia) + '</div>' +
              '</div>' +
              '<div style="text-align:right;">' +
                '<div style="font-size: 14px; color:var(--muted);">Tổng SL: <strong style="font-size: 16px; color: var(--text);">' + totalRowQty + '</strong></div>' +
                '<div style="font-size: 16px; font-weight:bold; color:var(--accent); margin-top: 4px;">' + Utils.formatMoney(totalRowMoney) + '</div>' +
              '</div>' +
            '</div>' +
            sizeBoxesHtml +
        '</div>';
    }).join('');

    var wrap = document.querySelector('#modal-preview .tbl-wrap');
    if (wrap) {
        wrap.innerHTML = '<div style="max-height:400px; overflow-y:auto; padding-right:4px;">' + bodyHtml + '</div>' + 
                         '<div style="display:flex; justify-content:space-between; align-items:center; margin-top: 16px; padding: 16px; background: var(--surface); border-radius: 12px; border: 1px solid var(--primary);">' + 
                            '<div style="font-weight: 600; font-size: 16px;">Tổng cộng:</div>' +
                            '<div style="text-align:right;">' +
                                '<div style="font-weight: bold; font-size: 16px;">' + totalQtyAll + ' SP</div>' +
                                '<div style="font-weight: 800; font-size: 20px; color: var(--accent);">' + Utils.formatMoney(totalMoneyAll) + '</div>' +
                            '</div>' +
                         '</div>';
    }

    openModal('modal-preview');
  }

  async function saveOrder() {
    var lines = _buildLines();
    var kh_ten = document.getElementById('o-kh-ten').value.trim();
    var ma_kh = document.getElementById('o-ma-kh').value.trim();
    if (!ma_kh) { showToast('Vui lòng nhập mã khách hàng', false); return; }

    var order = {
      id: Utils.uuid(), // Generate ID
      so_ct: document.getElementById('o-so-ct').value,
      ngay_ct: document.getElementById('o-ngay').value,
      chi_nhanh: document.getElementById('o-chi-nhanh').value,
      nvkd: document.getElementById('o-nvkd').value,
      nguoi_tao: document.getElementById('o-nguoi-tao').value,
      ma_kh: ma_kh,
      ma_dl: document.getElementById('o-ma-dl').value,
      kh_ten: document.getElementById('o-kh-ten').value.trim(),
      kh_dc: document.getElementById('o-kh-dc').value,
      nguon_don: document.getElementById('o-nguon-don').value,
      dien_giai: document.getElementById('o-dien-giai').value,
      ghi_chu: document.getElementById('o-note').value,
      pt_giao: document.getElementById('o-pt-giao').value,
      nguoi_giao: document.getElementById('o-nguoi-giao').value,
      dieu_khoan: document.getElementById('o-dieu-khoan').value,
      ht_thanh_toan: document.getElementById('o-ht-thanh-toan').value,
      ngay_tt: document.getElementById('o-ngay-tt').value,
      khach_dua: document.getElementById('o-khach-dua').value,
      ma_ctbh: document.getElementById('o-ctbh').value,
      total_qty: lines.reduce(function (s, l) { return s + l.so_luong; }, 0),
      total_money: lines.reduce(function (s, l) { return s + l.thanh_tien; }, 0),
      lines: lines, created_at: new Date().toISOString()
    };

    if (!API_CONFIG.BASE_URL) {
      showToast('Hệ thống đang chạy offline, không thể lưu đơn.', false);
      return;
    }

    try {
      await OrderService.createOrder(order);
      closeModal('modal-preview');
      showToast('Đã lưu đơn: ' + order.so_ct, true);
      orderRows = []; _init();
    } catch (err) {
      console.warn('[OrderService] Lỗi tạo đơn qua API:', err);
      showToast('Lỗi tạo đơn qua API. Vui lòng thử lại.', false);
    }
  }

  function clearOrder() {
    ConfirmModal.show({
      title: 'Hủy đơn hàng',
      message: 'Bạn có chắc muốn xóa toàn bộ sản phẩm đã chọn?',
      confirmText: 'Xác nhận xóa',
      confirmClass: 'btn-danger',
      onConfirm: function () { orderRows = []; _init(); }
    });
  }

  function clearSearch() {
    var inp = document.getElementById('ac-input');
    if (inp) { inp.value = ''; inp.focus(); acSearch(''); }
  }

  return {
    render: render, acSearch: acSearch, toggleAcSelect: toggleAcSelect, closeAc: closeAc,
    addSelectedProds: addSelectedProds, addProductRow: addProductRow, selectAcSingle: selectAcSingle,
    updateQty: updateQty, removeRow: removeRow, previewOrder: previewOrder,
    saveOrder: saveOrder, clearOrder: clearOrder, clearSearch: clearSearch,
    updateInfoSummary: updateInfoSummary, calcChange: calcChange
  };
})();
