var OrderPage = (function () {
  var orderRows = [];

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
    var sel = document.getElementById('o-ctbh');
    sel.innerHTML = DB.getAll('promotions').filter(function (p) { return p.active !== false; })
      .map(function (p) { return '<option value="' + p.ma_ctbh + '">' + p.ma_ctbh + ' - ' + p.ten_ctbh + '</option>'; }).join('');
    renderMatrix();
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.autocomplete-wrap')) document.getElementById('ac-list').classList.remove('show');
    });
  }

  function acSearch(val) {
    var list = document.getElementById('ac-list');
    if (!val || val.length < 2) { list.classList.remove('show'); return; }
    var prods = DB.getAll('products').filter(function (p) {
      return !p.ngung_su_dung && (p.ten_hang_2.toLowerCase().includes(val.toLowerCase()) || p.mau.toLowerCase().includes(val.toLowerCase()));
    });
    if (!prods.length) { list.innerHTML = '<div class="ac-item"><small>' + t('order.ac.not_found') + '</small></div>'; list.classList.add('show'); return; }
    list.innerHTML = prods.slice(0, 8).map(function (p) {
      return '<div class="ac-item" onclick="OrderPage.selectAc(\'' + p.ten_hang_2 + '\')"><strong>' + p.ten_hang_2 + '</strong><small>' + p.mau + ' · ' + Utils.formatMoney(p.don_gia) + '</small></div>';
    }).join('');
    list.classList.add('show');
  }

  function selectAc(code) {
    document.getElementById('ac-input').value = code;
    document.getElementById('ac-list').classList.remove('show');
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
      body.innerHTML = '<tr><td colspan="20" class="empty-state"><span class="material-symbols-outlined">table_chart</span><span data-i18n="order.search.empty">' + t('order.search.empty') + '</span></td></tr>';
      _updateTotal(); return;
    }
    var allSizes = [...new Set(orderRows.flatMap(function (r) { return r.sizes.map(function (s) { return s.size; }); }))].sort(function (a, b) { return a - b; });
    head.innerHTML = '<tr><th><span data-i18n="order.col.name">' + t('order.col.name') + '</span></th><th><span data-i18n="order.col.form">' + t('order.col.form') + '</span></th><th><span data-i18n="order.col.price">' + t('order.col.price') + '</span></th><th><span data-i18n="order.col.sizegroup">' + t('order.col.sizegroup') + '</span></th>' + allSizes.map(function (s) { return '<th class="size-col">' + s + '</th>'; }).join('') + '<th></th></tr>';
    body.innerHTML = orderRows.map(function (row, ri) {
      var rowSizes = row.sizes.map(function (s) { return s.size; });
      return '<tr><td><strong>' + row.ten_hang_2 + '</strong><br><small style="color:var(--muted)">' + row.product.mau + '</small></td>' +
        '<td><span class="badge badge-blue">' + row.product.form + '</span></td>' +
        '<td style="font-weight:700;color:var(--accent)">' + Utils.formatMoney(row.product.don_gia) + '</td>' +
        '<td>' + row.product.nhom_size + '</td>' +
        allSizes.map(function (s) {
          if (!rowSizes.includes(s)) return '<td class="size-cell"><span style="color:var(--muted)">—</span></td>';
          return '<td class="size-cell"><input type="number" min="0" placeholder="-" value="' + (row.quantities[s] || '') + '" oninput="OrderPage.updateQty(' + ri + ',' + s + ',this.value)" style="width:50px;text-align:center;background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:5px;color:var(--text);outline:none"></td>';
        }).join('') +
        '<td><button class="btn-icon" onclick="OrderPage.removeRow(' + ri + ')"><span class="material-symbols-outlined" style="font-size:16px;color:var(--danger)">delete</span></button></td></tr>';
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
      '<div><small style="color:var(--muted)"><span data-i18n="order.preview.date">' + t('order.preview.date') + '</span></small><div>' + document.getElementById('o-ngay').value + '</div></div>',
      '<div><small style="color:var(--muted)"><span data-i18n="order.promo">' + t('order.promo') + '</span></small><div style="font-weight:700">' + document.getElementById('o-ctbh').value + '</div></div>',
    ].join('');
    document.getElementById('preview-body').innerHTML = lines.map(function (l) {
      return '<tr><td>' + l.ten_hang_2 + '</td><td style="font-family:monospace">' + l.sku + '</td><td>' + l.size + '</td>' +
        '<td style="font-weight:700;color:var(--accent)">' + l.so_luong + '</td><td>' + Utils.formatMoney(l.don_gia) + '</td>' +
        '<td style="font-weight:700">' + Utils.formatMoney(l.thanh_tien) + '</td>' +
        '<td><span class="badge badge-yellow">' + l.ma_ctbh + '</span></td><td>' + l.ghi_chu + '</td></tr>';
    }).join('');
    var tq = lines.reduce(function (s, l) { return s + l.so_luong; }, 0);
    var tm = lines.reduce(function (s, l) { return s + l.thanh_tien; }, 0);
    document.getElementById('pv-qty').textContent = tq + ' ' + t('order.preview.sp');
    document.getElementById('pv-money').textContent = Utils.formatMoney(tm);
    openModal('modal-preview');
  }

  function saveOrder() {
    var lines = _buildLines();
    if (!lines.length) { showToast(t('toast.empty_lines'), false); return; }
    var order = {
      so_ct: document.getElementById('o-so-ct').value,
      ngay_ct: document.getElementById('o-ngay').value,
      chi_nhanh: document.getElementById('o-chi-nhanh').value,
      nhan_vien: document.getElementById('o-nv').value,
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
    render: render, acSearch: acSearch, selectAc: selectAc, addProductRow: addProductRow,
    updateQty: updateQty, removeRow: removeRow, previewOrder: previewOrder,
    saveOrder: saveOrder, clearOrder: clearOrder
  };
})();
