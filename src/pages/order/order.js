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
    sel.innerHTML = DB.getAll('promotions').filter(function(p){return p.active!==false;})
      .map(function(p){return '<option value="'+p.ma_ctbh+'">'+p.ma_ctbh+' - '+p.ten_ctbh+'</option>';}).join('');
    renderMatrix();
    document.addEventListener('click', function(e){
      if(!e.target.closest('.autocomplete-wrap')) document.getElementById('ac-list').classList.remove('show');
    });
  }

  function acSearch(val) {
    var list = document.getElementById('ac-list');
    if(!val||val.length<2){list.classList.remove('show');return;}
    var prods = DB.getAll('products').filter(function(p){
      return !p.ngung_su_dung && (p.ten_hang_2.toLowerCase().includes(val.toLowerCase())||p.mau.toLowerCase().includes(val.toLowerCase()));
    });
    if(!prods.length){list.innerHTML='<div class="ac-item"><small>Không tìm thấy</small></div>';list.classList.add('show');return;}
    list.innerHTML = prods.slice(0,8).map(function(p){
      return '<div class="ac-item" onclick="OrderPage.selectAc(\''+p.ten_hang_2+'\')"><strong>'+p.ten_hang_2+'</strong><small>'+p.mau+' · '+Utils.formatMoney(p.don_gia)+'</small></div>';
    }).join('');
    list.classList.add('show');
  }

  function selectAc(code) {
    document.getElementById('ac-input').value = code;
    document.getElementById('ac-list').classList.remove('show');
  }

  function addProductRow() {
    var code = document.getElementById('ac-input').value.trim();
    if(!code){showToast('Vui lòng nhập Tên hàng 2',false);return;}
    var prod = DB.getAll('products').find(function(p){return p.ten_hang_2===code;});
    if(!prod){showToast('Không tìm thấy: '+code,false);return;}
    if(orderRows.find(function(r){return r.ten_hang_2===code;})){showToast('Đã có trong đơn!',false);return;}
    var sizes = DB.getAll('sizes').filter(function(s){return s.nhom_size===prod.nhom_size;}).sort(function(a,b){return a.size-b.size;});
    orderRows.push({ten_hang_2:code, product:prod, sizes:sizes, quantities:{}});
    document.getElementById('ac-input').value='';
    renderMatrix();
    showToast('Đã thêm: '+code);
  }

  function renderMatrix() {
    var head = document.getElementById('matrix-head');
    var body = document.getElementById('matrix-body');
    if(!orderRows.length){
      head.innerHTML='';
      body.innerHTML='<tr><td colspan="20" class="empty-state"><span class="material-symbols-outlined">table_chart</span>Tìm và thêm sản phẩm để bắt đầu nhập số lượng</td></tr>';
      _updateTotal(); return;
    }
    var allSizes = [...new Set(orderRows.flatMap(function(r){return r.sizes.map(function(s){return s.size;});}))].sort(function(a,b){return a-b;});
    head.innerHTML = '<tr><th>Tên hàng 2</th><th>Form</th><th>Đơn giá</th><th>Nhóm size</th>'+allSizes.map(function(s){return '<th class="size-col">'+s+'</th>';}).join('')+'<th></th></tr>';
    body.innerHTML = orderRows.map(function(row,ri){
      var rowSizes = row.sizes.map(function(s){return s.size;});
      return '<tr><td><strong>'+row.ten_hang_2+'</strong><br><small style="color:var(--muted)">'+row.product.mau+'</small></td>'+
        '<td><span class="badge badge-blue">'+row.product.form+'</span></td>'+
        '<td style="font-weight:700;color:var(--accent)">'+Utils.formatMoney(row.product.don_gia)+'</td>'+
        '<td>'+row.product.nhom_size+'</td>'+
        allSizes.map(function(s){
          if(!rowSizes.includes(s)) return '<td class="size-cell"><span style="color:var(--muted)">—</span></td>';
          return '<td class="size-cell"><input type="number" min="0" placeholder="-" value="'+(row.quantities[s]||'')+'" oninput="OrderPage.updateQty('+ri+','+s+',this.value)" style="width:50px;text-align:center;background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:5px;color:var(--text);outline:none"></td>';
        }).join('')+
        '<td><button class="btn-icon" onclick="OrderPage.removeRow('+ri+')"><span class="material-symbols-outlined" style="font-size:16px;color:var(--danger)">delete</span></button></td></tr>';
    }).join('');
    _updateTotal();
  }

  function updateQty(ri, size, val) { orderRows[ri].quantities[size]=parseInt(val)||0; _updateTotal(); }
  function removeRow(ri) { orderRows.splice(ri,1); renderMatrix(); }

  function _updateTotal() {
    var qty=0, money=0;
    orderRows.forEach(function(r){Object.entries(r.quantities).forEach(function(e){if(e[1]>0){qty+=e[1];money+=e[1]*r.product.don_gia;}});});
    document.getElementById('total-qty').textContent=qty;
    document.getElementById('total-money').textContent=Utils.formatMoney(money);
  }

  function _buildLines() {
    var ctbhEl=document.getElementById('o-ctbh');
    var ma_ctbh=ctbhEl.value;
    var note=document.getElementById('o-note').value;
    var lines=[];
    orderRows.forEach(function(row){
      Object.entries(row.quantities).forEach(function(e){
        var size=e[0], qty=parseInt(e[1])||0;
        if(qty>0) lines.push({ten_hang_2:row.ten_hang_2, sku:Utils.buildSKU(row.ten_hang_2,size),
          ten_hang:row.product.ten_hang_hoa, nhom_size:row.product.nhom_size,
          size:parseInt(size), so_luong:qty, don_gia:row.product.don_gia,
          thanh_tien:qty*row.product.don_gia, ma_ctbh:ma_ctbh, ghi_chu:note});
      });
    });
    return lines;
  }

  var _currentModal = null;
  function previewOrder() {
    var lines=_buildLines();
    if(!lines.length){showToast('Chưa nhập số lượng!',false);return;}
    
    var infoHtml = [
      '<div><small style="color:var(--muted)">Số CT</small><div style="font-weight:700">'+document.getElementById('o-so-ct').value+'</div></div>',
      '<div><small style="color:var(--muted)">Ngày</small><div>'+document.getElementById('o-ngay').value+'</div></div>',
      '<div><small style="color:var(--muted)">CTKM</small><div style="font-weight:700">'+document.getElementById('o-ctbh').value+'</div></div>',
    ].join('');
    
    var tbodyHtml = lines.map(function(l){
      return '<tr><td>'+l.ten_hang_2+'</td><td style="font-family:monospace">'+l.sku+'</td><td>'+l.size+'</td>'+
        '<td style="font-weight:700;color:var(--accent)">'+l.so_luong+'</td><td>'+Utils.formatMoney(l.don_gia)+'</td>'+
        '<td style="font-weight:700">'+Utils.formatMoney(l.thanh_tien)+'</td>'+
        '<td><span class="badge badge-yellow">'+l.ma_ctbh+'</span></td><td>'+l.ghi_chu+'</td></tr>';
    }).join('');
    
    var tq=lines.reduce(function(s,l){return s+l.so_luong;},0);
    var tm=lines.reduce(function(s,l){return s+l.thanh_tien;},0);

    var contentHtml = `
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:13px;margin-bottom:12px">${infoHtml}</div>
      <div class="tbl-wrap" style="max-height:360px;overflow-y:auto">
        <table>
          <thead><tr><th>Tên hàng 2</th><th>SKU</th><th>Size</th><th>SL</th><th>Đơn giá</th><th>Thành tiền</th><th>CTBH</th><th>Ghi chú</th></tr></thead>
          <tbody>${tbodyHtml}</tbody>
          <tfoot><tr style="font-weight:700;background:var(--bg)">
            <td colspan="3" style="padding:10px 12px">Tổng cộng</td>
            <td style="padding:10px 12px">${tq} SP</td>
            <td></td>
            <td style="padding:10px 12px;color:var(--accent)">${Utils.formatMoney(tm)}</td>
            <td colspan="2"></td>
          </tr></tfoot>
        </table>
      </div>
    `;

    var footerHtml = document.createElement('div');
    footerHtml.innerHTML = `
      <button class="btn btn-ghost" onclick="OrderPage.closeModal()">Đóng</button>
      <button class="btn btn-accent" onclick="OrderPage.saveOrder()">
        <span class="material-symbols-outlined" style="font-size:16px">save</span>Lưu đơn
      </button>
    `;

    _currentModal = UIModal.show({
      id: 'modal-preview',
      title: '👁 Xem Trước Đơn Hàng',
      width: 'min(800px, 95vw)',
      content: contentHtml,
      footer: footerHtml
    });
  }

  function closeModal() {
    if (_currentModal) _currentModal.close();
    _currentModal = null;
  }

  function saveOrder() {
    var lines=_buildLines();
    if(!lines.length){showToast('Chưa có dòng hàng!',false);return;}
    var order={
      so_ct:document.getElementById('o-so-ct').value,
      ngay_ct:document.getElementById('o-ngay').value,
      chi_nhanh:document.getElementById('o-chi-nhanh').value,
      nhan_vien:document.getElementById('o-nv').value,
      ma_ctbh:document.getElementById('o-ctbh').value,
      ghi_chu:document.getElementById('o-note').value,
      total_qty:lines.reduce(function(s,l){return s+l.so_luong;},0),
      total_money:lines.reduce(function(s,l){return s+l.thanh_tien;},0),
      lines:lines, created_at:new Date().toISOString()
    };
    DB.add('orders',order);
    closeModal();

    showToast('Đã lưu đơn: '+order.so_ct);
    orderRows=[];
    _init();
  }

  function clearOrder() { if(!confirm('Hủy đơn hàng này?'))return; orderRows=[]; _init(); }

  return { render:render, acSearch:acSearch, selectAc:selectAc, addProductRow:addProductRow,
           updateQty:updateQty, removeRow:removeRow, previewOrder:previewOrder,
           closeModal:closeModal, saveOrder:saveOrder, clearOrder:clearOrder };
})();
