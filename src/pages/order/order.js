var OrderPage = (function () {
  var orderRows = [];
  var multiSelectedCodes = {};

  function render($el) {
    return Router.fetchTemplate('src/pages/order/order.html')
      .then(function (html) {
        $el.innerHTML = html;
        var footer = document.getElementById('global-footer');
        if (footer) footer.style.display = 'flex';
        var saveBtn = document.getElementById('btn-save-draft');
        if (saveBtn) saveBtn.style.display = 'inline-flex';
        _init();
      });
  }

  function _init() {
    document.getElementById('o-so-ct').value = Utils.genOrderNo();
    document.getElementById('o-ngay').value = Utils.today();
    document.getElementById('o-kh-ten').value = '';
    document.getElementById('o-kh-sdt').value = '';
    document.getElementById('o-kh-dc').value = '';
    var sel = document.getElementById('o-ctbh');
    sel.innerHTML = DB.getAll('promotions').filter(function (p) { return p.active !== false; })
      .map(function (p) { return '<option value="' + p.ma_ctbh + '">' + p.ma_ctbh + ' - ' + p.ten_ctbh + '</option>'; }).join('');
    
    // Header Persistence
    var savedCtkm = localStorage.getItem('santino_order_ctkm');
    var savedNote = localStorage.getItem('santino_order_note');
    if (savedCtkm) sel.value = savedCtkm;
    if (savedNote) document.getElementById('o-note').value = savedNote;

    sel.addEventListener('change', function() {
      localStorage.setItem('santino_order_ctkm', this.value);
      _flashCards();
    });
    document.getElementById('o-note').addEventListener('input', function() {
      localStorage.setItem('santino_order_note', this.value);
    });

    renderMatrix();
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.autocomplete-wrap') && !e.target.closest('#btn-multi-mode')) {
        var acList = document.getElementById('ac-list');
        if (acList) acList.classList.remove('show');
      }
    });
  }

  function _flashCards() {
    document.querySelectorAll('.card.product-card').forEach(function(c) {
      c.classList.remove('flash-effect');
      void c.offsetWidth; // trigger reflow
      c.classList.add('flash-effect');
    });
    renderMatrix(); // re-render to update badge if needed
  }



  function acSearch(val) {
    var list = document.getElementById('ac-list');
    if (!val || val.length < 2) { list.classList.remove('show'); return; }
    var prods = DB.getAll('products').filter(function (p) {
      return !p.ngung_su_dung && (p.ten_hang_2.toLowerCase().includes(val.toLowerCase()) || p.mau.toLowerCase().includes(val.toLowerCase()));
    });
    if (!prods.length) { list.innerHTML = '<div class="ac-item"><small>' + t('order.ac.not_found') + '</small></div>'; list.classList.add('show'); return; }

    var html = '<div class="ac-header"><div class="ac-col-1">TÊN HÀNG 2</div><div class="ac-col-color">MÀU/THIẾT KẾ</div><div class="ac-col-2" style="text-align:center">FORM</div><div class="ac-col-3">ĐƠN GIÁ</div></div>';
    html += prods.slice(0, 8).map(function (p) {
      var isChecked = multiSelectedCodes[p.ten_hang_2] ? 'checked' : '';
      var brand = p.ten_hang_2.match(/^[A-Z]+/); brand = brand ? brand[0] : '';
      return '<div class="ac-table-row" onclick="OrderPage.toggleAcSelect(event, \'' + p.ten_hang_2 + '\')">' +
        '<input type="checkbox" ' + isChecked + ' style="margin-right:12px; cursor:pointer;" id="chk-' + p.ten_hang_2 + '" value="' + p.ten_hang_2 + '" onclick="event.stopPropagation(); OrderPage.toggleAcSelect(event, \'' + p.ten_hang_2 + '\')">' +
        '<div class="ac-col-1"><strong>' + p.ten_hang_2 + '</strong></div>' +
        '<div class="ac-col-color">' + (p.design || p.mau || '') + '</div>' +
        '<div class="ac-col-2" style="text-align:center"><span class="ac-form-badge">' + brand + '</span></div>' +
        '<div class="ac-col-3">' + Utils.formatMoney(p.don_gia) + '</div>' +
        '</div>';
    }).join('');

    html += '<div class="ac-actions" style="display:flex;gap:8px;padding:8px 12px;border-top:1px solid var(--border);background:var(--surface);position:sticky;bottom:0;z-index:10;">' +
      '<button class="btn btn-ghost" style="flex:1; padding:6px; font-size:13px; min-height:32px;" onclick="OrderPage.closeAc()">' + (typeof t === 'function' ? t('btn.cancel') : 'Hủy bỏ') + '</button>' +
      '<button id="btn-add-multi" class="btn btn-primary" style="flex:2; padding:6px; font-size:13px; min-height:32px;" onclick="OrderPage.addSelectedProds()">' + (typeof t === 'function' ? t('btn.add') : 'Thêm đã chọn') + '</button>' +
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
    var chk = document.getElementById('chk-' + code);
    if (e && e.target.tagName !== 'INPUT') {
      if (chk) chk.checked = !chk.checked;
    }
    if (chk) {
      if (chk.checked) multiSelectedCodes[code] = true;
      else delete multiSelectedCodes[code];
    }
    _updateMultiAddButton();
  }

  function _updateMultiAddButton() {
    var count = Object.keys(multiSelectedCodes).length;
    var btn = document.getElementById('btn-add-multi');
    if (btn) {
      btn.innerHTML = count > 0 ? ('Thêm ' + count + ' sản phẩm') : 'Thêm đã chọn';
    }
  }

  function closeAc() {
    multiSelectedCodes = {};
    document.getElementById('ac-list').classList.remove('show');
  }

  function addSelectedProds() {
    var codes = Object.keys(multiSelectedCodes);
    if (codes.length === 0) {
      showToast(typeof t === 'function' ? t('toast.enter_product') : 'Vui lòng chọn sản phẩm', false);
      return;
    }
    var added = 0;
    codes.forEach(function (code) {
      var prod = DB.getAll('products').find(function (p) { return p.ten_hang_2 === code; });
      if (prod && !orderRows.find(function (r) { return r.ten_hang_2 === code; })) {
        var sizes = DB.getAll('sizes').filter(function (s) { return s.nhom_size === prod.nhom_size; }).sort(function (a, b) { return a.size - b.size; });
        orderRows.push({ ten_hang_2: code, product: prod, sizes: sizes, quantities: {} });
        added++;
      }
    });

    if (added > 0) {
      renderMatrix();
      showToast('Đã thêm ' + added + ' sản phẩm');
    } else {
      showToast('Sản phẩm đã tồn tại trong đơn', false);
    }

    document.getElementById('ac-input').value = '';
    closeAc();
  }

  function addProductRow() {
    var code = document.getElementById('ac-input').value.trim();
    if (!code) { showToast(t('toast.enter_product'), false); return; }
    var prod = DB.getAll('products').find(function (p) { return p.ten_hang_2 === code; });
    if (!prod) { showToast(t('toast.not_found') + code, false); return; }
    if (orderRows.find(function (r) { return r.ten_hang_2 === code; })) { showToast(t('toast.already_in_order'), false); return; }
    var sizes = DB.getAll('sizes').filter(function (s) { return s.nhom_size === prod.nhom_size; }).sort(function (a, b) { return a.size - b.size; });
    orderRows.push({ ten_hang_2: code, product: prod, sizes: sizes, quantities: {} });
    document.getElementById('ac-input').value = '';
    renderMatrix();
    showToast(t('toast.added') + code);
  }

  function renderMatrix() {
    var container = document.getElementById('matrix-container');
    if (!orderRows.length) {
      container.innerHTML = '<div class="empty-state" style="background:var(--surface); border-radius:12px; padding:32px; border:1px solid var(--border);"><span class="material-symbols-outlined">table_chart</span><span data-i18n="order.search.empty">' + t('order.search.empty') + '</span></div>';
      _updateTotal(); return;
    }
    
    container.innerHTML = orderRows.map(function (row, ri) {
      var yeuTo1 = row.ten_hang_2.substring(0, 3) || ''; 
      var yeuTo2 = row.ten_hang_2.substring(3) || '';
      var ghiChu = document.getElementById('o-note') ? document.getElementById('o-note').value : '';
      var ctbh = document.getElementById('o-ctbh') ? document.getElementById('o-ctbh').value : '';
      var badgeHtml = ctbh ? '<span class="badge-success"><span class="material-symbols-outlined" style="font-size:12px">check</span> Đã áp CTKM</span>' : '';

      var sizeRowsHtml = '<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(52px, 1fr)); gap:12px; margin-top: 12px;">';
      sizeRowsHtml += row.sizes.map(function(s) {
        var qty = row.quantities[s.size] || '';
        var cssClass = qty > 0 ? 'input-filled' : 'input-empty';
        return '<div style="display:flex; flex-direction:column; align-items:center; gap:4px;">' +
               '<div style="font-size: calc(13px * var(--text-scale, 1)); font-weight:600; color:var(--muted);">' + s.size + '</div>' +
               '<input type="number" min="0" placeholder="0" value="' + qty + '" class="' + cssClass + '" oninput="OrderPage.updateQty(' + ri + ',' + s.size + ',this)" style="width:100%; text-align:center; border-radius:6px; padding:8px; font-size: calc(14px * var(--text-scale, 1)); outline:none;">' +
               '</div>';
      }).join('');
      sizeRowsHtml += '</div>';
      
      return '<div class="card product-card" style="margin-bottom:0; box-shadow:0 4px 12px rgba(0,0,0,0.05);">' +
             '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid var(--border-light);">' +
             '<div>' +
               '<div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">' +
                 '<div style="font-size: calc(18px * var(--text-scale, 1)); font-weight:800; color:var(--primary);">' + row.ten_hang_2 + '</div>' +
                 badgeHtml +
               '</div>' +
               '<div style="font-size: calc(14px * var(--text-scale, 1)); font-weight:500; color:var(--muted); margin-bottom:8px;">' + row.product.nhom_size + ' | ' + row.product.mau + ' | ' + Utils.formatMoney(row.product.don_gia) + '</div>' +
               '<span id="badge-yeuto-' + ri + '" class="badge-brand" style="transition: all 0.2s;">YẾU TỐ: ' + yeuTo1 + '</span> ' +
               '<span id="btn-details-' + ri + '" onclick="OrderPage.toggleDetails(' + ri + ')" style="color:#0056b3; cursor:pointer; text-decoration:underline; font-size: calc(13px * var(--text-scale, 1)); display:inline-block; margin-left: 8px;">Tùy chỉnh</span>' +
             '</div>' +
             '<div style="display:flex; gap:8px;">' +
               '<button class="btn-icon" onclick="OrderPage.quickClear(' + ri + ')" title="Reset số lượng" style="background:#f1f3f5; color:var(--muted); padding:8px; border-radius:8px;"><span class="material-symbols-outlined" style="font-size: calc(20px * var(--text-scale, 1));">backspace</span></button>' +
               '<button class="btn-icon" onclick="OrderPage.removeRow(' + ri + ')" title="Xóa dòng" style="background:#ffeeee; color:var(--danger); padding:8px; border-radius:8px;"><span class="material-symbols-outlined" style="font-size: calc(20px * var(--text-scale, 1));">delete</span></button>' +
             '</div>' +
             '</div>' +
             
             '<div id="details-' + ri + '" style="display:none; background:#f8f9fa; border-radius:8px; padding:16px; margin-bottom:16px; font-size: calc(13px * var(--text-scale, 1)); color:var(--text); border:1px solid var(--border-light);">' +
               '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px;">' +
                 '<div><strong style="color:var(--muted)">Mã CTB:</strong><br><input type="text" value="' + (row.custom_ctb !== undefined ? row.custom_ctb : (ctbh || 'CKCB')) + '" oninput="OrderPage.updateCustomField(' + ri + ',\'custom_ctb\',this.value)" style="width:100%; margin-top:4px; padding:6px 8px; border:1px solid var(--border); border-radius:4px; outline:none;"></div>' +
                 '<div><strong style="color:var(--muted)">Yếu tố 1:</strong><br><input type="text" value="' + (row.custom_yeuTo1 !== undefined ? row.custom_yeuTo1 : yeuTo1) + '" oninput="OrderPage.updateCustomField(' + ri + ',\'custom_yeuTo1\',this.value)" style="width:100%; margin-top:4px; padding:6px 8px; border:1px solid var(--border); border-radius:4px; outline:none;"></div>' +
                 '<div><strong style="color:var(--muted)">Yếu tố 2:</strong><br><input type="text" value="' + (row.custom_yeuTo2 !== undefined ? row.custom_yeuTo2 : yeuTo2) + '" oninput="OrderPage.updateCustomField(' + ri + ',\'custom_yeuTo2\',this.value)" style="width:100%; margin-top:4px; padding:6px 8px; border:1px solid var(--border); border-radius:4px; outline:none;"></div>' +
                 '<div><strong style="color:var(--muted)">Ghi chú:</strong><br><input type="text" value="' + (row.custom_ghiChu !== undefined ? row.custom_ghiChu : (ghiChu || '')) + '" oninput="OrderPage.updateCustomField(' + ri + ',\'custom_ghiChu\',this.value)" style="width:100%; margin-top:4px; padding:6px 8px; border:1px solid var(--border); border-radius:4px; outline:none;" placeholder="Nhập ghi chú..."></div>' +
                 '<div style="grid-column: 1 / -1;"><strong style="color:var(--muted)">Tên hàng / dịch vụ:</strong><br><input type="text" value="' + (row.custom_tenHang !== undefined ? row.custom_tenHang : row.product.ten_hang_hoa) + '" oninput="OrderPage.updateCustomField(' + ri + ',\'custom_tenHang\',this.value)" style="width:100%; margin-top:4px; padding:6px 8px; border:1px solid var(--border); border-radius:4px; outline:none;"></div>' +
               '</div>' +
             '</div>' +
             
             sizeRowsHtml +
             '</div>';
    }).join('');
    
    _updateTotal();
  }

  function toggleDetails(ri) {
    var el = document.getElementById('details-' + ri);
    var btn = document.getElementById('btn-details-' + ri);
    var badge = document.getElementById('badge-yeuto-' + ri);
    
    if (el.style.display === 'none') {
      el.style.display = 'block';
      if(btn) btn.innerHTML = 'Thu gọn';
      if(badge) badge.style.display = 'none';
    } else {
      el.style.display = 'none';
      if(btn) btn.innerHTML = 'Tùy chỉnh';
      if(badge) badge.style.display = 'inline-flex';
    }
  }

  function updateCustomField(ri, field, val) {
    if (orderRows[ri]) {
      orderRows[ri][field] = val;
    }
  }

  function updateQty(ri, size, inputEl) { 
    var val = parseInt(inputEl.value) || 0;
    orderRows[ri].quantities[size] = val;
    if (val > 0) {
      inputEl.classList.remove('input-empty');
      inputEl.classList.add('input-filled');
    } else {
      inputEl.classList.remove('input-filled');
      inputEl.classList.add('input-empty');
    }
    _updateTotal(); 
  }
  
  function quickClear(ri) {
    orderRows[ri].quantities = {};
    renderMatrix();
  }
  
  function removeRow(ri) { orderRows.splice(ri, 1); renderMatrix(); }

  function _updateTotal() {
    var qty = 0, money = 0;
    orderRows.forEach(function (r) { Object.entries(r.quantities).forEach(function (e) { if (e[1] > 0) { qty += e[1]; money += e[1] * r.product.don_gia; } }); });
    
    // Update Global Footer
    var gQty = document.getElementById('f-total-qty');
    var gMoney = document.getElementById('f-total-money');
    if (gQty) gQty.textContent = qty;
    if (gMoney) gMoney.textContent = Utils.formatMoney(money);
  }

  function _buildLines() {
    var ctbhEl = document.getElementById('o-ctbh');
    var ma_ctbh = ctbhEl.value;
    var note = document.getElementById('o-note').value;
    var lines = [];
    orderRows.forEach(function (row) {
      Object.entries(row.quantities).forEach(function (e) {
        var size = e[0], qty = parseInt(e[1]) || 0;
        if (qty > 0) lines.push({
          ten_hang_2: row.ten_hang_2, sku: Utils.buildSKU(row.ten_hang_2, size),
          ten_hang: row.product.ten_hang_hoa, nhom_size: row.product.nhom_size,
          size: parseInt(size), so_luong: qty, don_gia: row.product.don_gia,
          thanh_tien: qty * row.product.don_gia, ma_ctbh: ma_ctbh, ghi_chu: note
        });
      });
    });
    return lines;
  }

  function previewOrder() {
    var lines = _buildLines();
    if (!lines.length) { showToast(t('toast.empty_qty'), false); return; }

    var info = document.getElementById('preview-info');
    info.innerHTML = [
      '<div><small style="color:var(--muted)"><span data-i18n="order.no">' + t('order.no') + '</span></small><div style="font-weight:700">' + document.getElementById('o-so-ct').value + '</div></div>',
      '<div><small style="color:var(--muted)"><span data-i18n="order.customer_name">Khách hàng</span></small><div style="font-weight:700;color:var(--primary)">' + (document.getElementById('o-kh-ten').value || '—') + '</div></div>',
      '<div><small style="color:var(--muted)"><span data-i18n="order.promo">' + t('order.promo') + '</span></small><div style="font-weight:700">' + document.getElementById('o-ctbh').value + '</div></div>',
    ].join('');

    // Xếp theo hàng ngang (Ma trận) cho Preview
    var orderedSizes = [...new Set(lines.map(function (l) { return l.size; }))].sort(function (a, b) { return a - b; });
    var headHtml = '<tr><th>Tên hàng 2</th><th>Màu</th><th>Nhóm size</th>' +
      orderedSizes.map(function (s) { return '<th style="text-align:center">' + s + '</th>'; }).join('') +
      '<th style="text-align:center">Tổng SL</th><th style="text-align:right">Thành tiền</th></tr>';

    var totalQtyAll = 0;
    var totalMoneyAll = 0;
    var bodyHtml = orderRows.map(function (row) {
      var rowTotalQty = 0;
      var rowTotalMoney = 0;
      Object.values(row.quantities).forEach(function (q) {
        if (q > 0) { rowTotalQty += q; rowTotalMoney += q * row.product.don_gia; }
      });
      if (rowTotalQty === 0) return '';

      totalQtyAll += rowTotalQty;
      totalMoneyAll += rowTotalMoney;

      var tr = '<tr><td><strong>' + row.ten_hang_2 + '</strong></td>' +
        '<td><small style="color:var(--muted)">' + row.product.mau + '</small></td>' +
        '<td>' + row.product.nhom_size + '</td>';
      orderedSizes.forEach(function (s) {
        var qty = row.quantities[s] || 0;
        if (qty > 0) {
          var brand = row.ten_hang_2.match(/^[A-Z]+/);
          brand = brand ? brand[0] : '';
          var code = brand ? row.ten_hang_2.slice(brand.length) : row.ten_hang_2;
          var sku = Utils.buildSKU(row.ten_hang_2, s);
          var tooltip = '[Brand: ' + brand + '] + [Size: ' + s + '] + [Code: ' + code + ']';
          tr += '<td style="text-align:center;font-weight:bold;color:var(--primary);cursor:help" title="SKU: ' + sku + '\n' + tooltip + '">' + qty + '</td>';
        } else {
          tr += '<td style="text-align:center;color:var(--muted)">-</td>';
        }
      });
      tr += '<td style="text-align:center;font-weight:bold">' + rowTotalQty + '</td>' +
        '<td style="text-align:right;font-weight:bold;color:var(--accent)">' + Utils.formatMoney(rowTotalMoney) + '</td></tr>';
      return tr;
    }).join('');

    var footHtml = '<tr style="font-weight:700;background:var(--bg)">' +
      '<td colspan="3" style="padding:10px 12px;text-align:right">Tổng cộng:</td>' +
      orderedSizes.map(function () { return '<td></td>'; }).join('') +
      '<td style="padding:10px 12px;text-align:center">' + totalQtyAll + '</td>' +
      '<td style="padding:10px 12px;color:var(--accent);text-align:right">' + Utils.formatMoney(totalMoneyAll) + '</td></tr>';

    document.getElementById('preview-head').innerHTML = headHtml;
    document.getElementById('preview-body').innerHTML = bodyHtml;
    document.getElementById('preview-foot').innerHTML = footHtml;
    openModal('modal-preview');
  }

  function saveOrder() {
    var lines = _buildLines();
    if (!lines.length) { showToast(t('toast.empty_lines'), false); return; }
    var kh_ten = document.getElementById('o-kh-ten').value.trim();
    if (!kh_ten) { showToast(typeof t === 'function' ? t('toast.enter_customer') || 'Vui lòng nhập tên khách hàng' : 'Vui lòng nhập tên khách hàng', false); return; }

    // Data Integrity Check (Sprint 4)
    var total_ui_qty = parseInt(document.getElementById('total-qty').textContent) || 0;
    var total_array_qty = lines.reduce(function (s, l) { return s + l.so_luong; }, 0);
    if (total_ui_qty !== total_array_qty) {
      alert('⚠️ LỖI NGHIÊM TRỌNG: Dữ liệu giao diện (' + total_ui_qty + ') không khớp với lõi hệ thống (' + total_array_qty + '). Vui lòng tải lại trang để tránh lỗi!');
      return;
    }

    var order = {
      so_ct: document.getElementById('o-so-ct').value,
      ngay_ct: document.getElementById('o-ngay').value,
      chi_nhanh: document.getElementById('o-chi-nhanh').value,
      nhan_vien: document.getElementById('o-nv').value,
      kh_ten: kh_ten,
      kh_sdt: document.getElementById('o-kh-sdt').value,
      kh_dc: document.getElementById('o-kh-dc').value,
      ma_ctbh: document.getElementById('o-ctbh').value,
      ghi_chu: document.getElementById('o-note').value,
      total_qty: lines.reduce(function (s, l) { return s + l.so_luong; }, 0),
      total_money: lines.reduce(function (s, l) { return s + l.thanh_tien; }, 0),
      lines: lines, created_at: new Date().toISOString()
    };
    DB.add('orders', order);
    closeModal('modal-preview');
    showToast(t('toast.order_saved') + order.so_ct);
    orderRows = [];
    _init();
  }

  function clearOrder() {
    ConfirmModal.show({
      title: t('order.cancel.title'),
      message: t('order.cancel.msg'),
      confirmText: t('order.cancel.btn'),
      confirmClass: 'btn-danger',
      onConfirm: function () {
        orderRows = [];
        _init();
      }
    });
  }

  return {
    render: render, acSearch: acSearch, toggleAcSelect: toggleAcSelect, closeAc: closeAc,
    addSelectedProds: addSelectedProds, addProductRow: addProductRow, selectAcSingle: selectAcSingle,

    updateQty: updateQty, quickClear: quickClear, removeRow: removeRow, previewOrder: previewOrder,
    toggleDetails: toggleDetails,
    saveOrder: saveOrder, clearOrder: clearOrder
  };
})();
