var OrderPage = (function () {
  var orderRows = [];
  var isMultiMode = false;
  var multiSelectedCodes = {};

  function render($el) {
    return Router.fetchTemplate('src/pages/order/order.html')
      .then(function (html) {
        $el.innerHTML = html;
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
    renderMatrix();
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.autocomplete-wrap') && !e.target.closest('#btn-multi-mode')) {
        var acList = document.getElementById('ac-list');
        if (acList) acList.classList.remove('show');
      }
    });
  }

  function toggleMultiMode() {
    isMultiMode = !isMultiMode;
    var btn = document.getElementById('btn-multi-mode');
    var icon = document.getElementById('icon-multi-mode');
    if (isMultiMode) {
      btn.classList.add('btn-primary');
      btn.classList.remove('btn-ghost');
      btn.style.borderColor = 'transparent';
      icon.style.color = '#fff';
    } else {
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-ghost');
      btn.style.borderColor = 'var(--border)';
      icon.style.color = 'var(--muted)';
      multiSelectedCodes = {};
    }
    var val = document.getElementById('ac-input').value;
    if (val) acSearch(val);
  }

  function acSearch(val) {
    var list = document.getElementById('ac-list');
    if (!val || val.length < 2) { list.classList.remove('show'); return; }
    var prods = DB.getAll('products').filter(function (p) {
      return !p.ngung_su_dung && (p.ten_hang_2.toLowerCase().includes(val.toLowerCase()) || p.mau.toLowerCase().includes(val.toLowerCase()));
    });
    if (!prods.length) { list.innerHTML = '<div class="ac-item"><small>' + t('order.ac.not_found') + '</small></div>'; list.classList.add('show'); return; }
    
    var html = '';
    if (isMultiMode) {
      html = prods.slice(0, 8).map(function (p) {
        var isChecked = multiSelectedCodes[p.ten_hang_2] ? 'checked' : '';
        return '<div class="ac-item" style="flex-direction:row;align-items:center;justify-content:flex-start;text-align:left;gap:12px;cursor:pointer" onclick="OrderPage.toggleAcSelect(event, \'' + p.ten_hang_2 + '\')">' +
               '<input type="checkbox" ' + isChecked + ' style="cursor:pointer;flex-shrink:0" id="chk-'+p.ten_hang_2+'" value="'+p.ten_hang_2+'" onclick="event.stopPropagation(); OrderPage.toggleAcSelect(event, \'' + p.ten_hang_2 + '\')">' +
               '<div style="flex:1;min-width:0;display:flex;flex-direction:column;align-items:flex-start;text-align:left;gap:4px"><div style="display:flex;align-items:baseline;gap:6px"><strong>' + p.ten_hang_2 + '</strong><span style="font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + p.ten_hang_hoa + '</span></div><small style="color:var(--muted)">' + p.mau + ' · ' + Utils.formatMoney(p.don_gia) + '</small></div></div>';
      }).join('');

      html += '<div class="ac-actions" style="display:flex;gap:8px;padding:12px;border-top:1px solid var(--border);background:var(--surface);position:sticky;bottom:-8px;margin:8px -8px -8px -8px;z-index:10">' +
              '<button class="btn btn-ghost btn-sm" style="flex:1" onclick="OrderPage.closeAc()">' + (typeof t === 'function' ? t('btn.cancel') : 'Hủy bỏ') + '</button>' +
              '<button class="btn btn-primary btn-sm" style="flex:1" onclick="OrderPage.addSelectedProds()">' + (typeof t === 'function' ? t('btn.add') : 'Thêm') + '</button>' +
              '</div>';
    } else {
      html = prods.slice(0, 8).map(function (p) {
        return '<div class="ac-item" style="text-align:left" onclick="OrderPage.selectAcSingle(\'' + p.ten_hang_2 + '\')">' +
               '<div style="display:flex;align-items:baseline;gap:6px"><strong>' + p.ten_hang_2 + '</strong><span style="font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + p.ten_hang_hoa + '</span></div><small style="color:var(--muted);align-self:flex-start">' + p.mau + ' · ' + Utils.formatMoney(p.don_gia) + '</small></div>';
      }).join('');
    }

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
    codes.forEach(function(code) {
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
    var head = document.getElementById('matrix-head');
    var body = document.getElementById('matrix-body');
    if (!orderRows.length) {
      head.innerHTML = '';
      body.innerHTML = '<tr><td colspan="7" class="empty-state"><span class="material-symbols-outlined">table_chart</span><span data-i18n="order.search.empty">' + t('order.search.empty') + '</span></td></tr>';
      _updateTotal(); return;
    }
    
    head.innerHTML = '<tr><th style="white-space:nowrap; text-align:left;">Tên hàng 2</th><th style="white-space:nowrap; text-align:left;">Mã CTB</th><th style="white-space:nowrap; text-align:left;">Tên CTBH</th><th style="white-space:nowrap; text-align:left;">Nhóm size</th><th style="white-space:nowrap; text-align:center;">Số lượng</th><th style="white-space:nowrap; text-align:center;">Size</th><th style="width:50px;"></th></tr>';
    
    body.innerHTML = orderRows.flatMap(function (row, ri) {
      return row.sizes.map(function(s) {
        var qty = row.quantities[s.size] || '';
        return '<tr>' +
          '<td style="white-space:nowrap; font-weight:600; color:var(--primary);">' + row.ten_hang_2 + '</td>' +
          '<td style="white-space:nowrap; color:var(--text);">CKCB</td>' +
          '<td style="white-space:nowrap; color:var(--text);">Chiết khấu cơ bản</td>' +
          '<td style="white-space:nowrap; color:var(--text);">' + row.product.nhom_size + '</td>' +
          '<td style="text-align:center;"><input type="number" min="0" placeholder="-" value="' + qty + '" oninput="OrderPage.updateQty(' + ri + ',' + s.size + ',this.value)" style="width:70px; text-align:center; background:var(--surface); border:1px solid var(--border); border-radius:6px; padding:8px; font-size:15px; font-weight:600; outline:none; transition:all 0.2s"></td>' +
          '<td style="text-align:center; font-weight:700; font-size:16px;">' + s.size + '</td>' +
          '<td style="text-align:center;"><button class="btn-icon" onclick="OrderPage.removeRow(' + ri + ')"><span class="material-symbols-outlined" style="font-size:18px; color:var(--danger)">delete</span></button></td>' +
          '</tr>';
      });
    }).join('');
    _updateTotal();
  }

  function updateQty(ri, size, val) { orderRows[ri].quantities[size] = parseInt(val) || 0; _updateTotal(); }
  function removeRow(ri) { orderRows.splice(ri, 1); renderMatrix(); }

  function _updateTotal() {
    var qty = 0, money = 0;
    orderRows.forEach(function (r) { Object.entries(r.quantities).forEach(function (e) { if (e[1] > 0) { qty += e[1]; money += e[1] * r.product.don_gia; } }); });
    document.getElementById('total-qty').textContent = qty;
    document.getElementById('total-money').textContent = Utils.formatMoney(money);
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
    var orderedSizes = [...new Set(lines.map(function(l) { return l.size; }))].sort(function(a,b) { return a-b; });
    var headHtml = '<tr><th>Tên hàng 2</th><th>Màu</th><th>Nhóm size</th>' + 
                   orderedSizes.map(function(s) { return '<th style="text-align:center">' + s + '</th>'; }).join('') + 
                   '<th style="text-align:center">Tổng SL</th><th style="text-align:right">Thành tiền</th></tr>';
    
    var totalQtyAll = 0;
    var totalMoneyAll = 0;
    var bodyHtml = orderRows.map(function(row) {
      var rowTotalQty = 0;
      var rowTotalMoney = 0;
      Object.values(row.quantities).forEach(function(q) { 
        if (q > 0) { rowTotalQty += q; rowTotalMoney += q * row.product.don_gia; } 
      });
      if (rowTotalQty === 0) return '';
      
      totalQtyAll += rowTotalQty;
      totalMoneyAll += rowTotalMoney;
      
      var tr = '<tr><td><strong>' + row.ten_hang_2 + '</strong></td>' +
               '<td><small style="color:var(--muted)">' + row.product.mau + '</small></td>' +
               '<td>' + row.product.nhom_size + '</td>';
      orderedSizes.forEach(function(s) {
        var qty = row.quantities[s] || 0;
        if (qty > 0) {
          tr += '<td style="text-align:center;font-weight:bold;color:var(--primary)">' + qty + '</td>';
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
                   orderedSizes.map(function() { return '<td></td>'; }).join('') +
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
      onConfirm: function() {
        orderRows = [];
        _init();
      }
    });
  }

  return {
    render: render, acSearch: acSearch, toggleAcSelect: toggleAcSelect, closeAc: closeAc,
    addSelectedProds: addSelectedProds, addProductRow: addProductRow, selectAcSingle: selectAcSingle,
    toggleMultiMode: toggleMultiMode,
    updateQty: updateQty, removeRow: removeRow, previewOrder: previewOrder,
    saveOrder: saveOrder, clearOrder: clearOrder
  };
})();
