var ProductsPage = (function () {
  function render($el) {
    return Router.fetchTemplate('src/pages/products/products.html').then(function(html){
      $el.innerHTML = html; _render();
    });
  }
  function _render() {
    var q=(document.getElementById('product-search')||{}).value||'';
    var form=(document.getElementById('product-filter-form')||{}).value||'';
    var prods=DB.getAll('products').filter(function(p){
      return (!q||p.ten_hang_2.toLowerCase().includes(q.toLowerCase())||p.mau.toLowerCase().includes(q.toLowerCase()))&&(!form||p.form===form);
    });
    var tbody=document.getElementById('products-body');
    if(!prods.length){tbody.innerHTML='<tr><td colspan="9" class="empty-state"><span class="material-symbols-outlined">inventory_2</span>Không có sản phẩm</td></tr>';return;}
    tbody.innerHTML=prods.map(function(p){
      return '<tr><td><strong>'+p.ten_hang_2+'</strong></td><td>'+p.nhom_hang+'</td>'+
        '<td><span class="badge badge-blue">'+p.form+'</span></td>'+
        '<td>'+p.mau+'</td><td><span class="badge badge-green">'+p.nhom_size+'</span></td>'+
        '<td style="font-weight:700;color:var(--accent)">'+Utils.formatMoney(p.don_gia)+'</td>'+
        '<td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+p.ten_hang_hoa+'</td>'+
        '<td><span class="badge '+(p.ngung_su_dung?'badge-red':'badge-green')+'">'+( p.ngung_su_dung?'Ngừng bán':'Đang bán')+'</span></td>'+
        '<td style="display:flex;gap:6px">'+
          '<button class="btn-icon" onclick="ProductsPage.openModal(\''+p.id+'\')"><span class="material-symbols-outlined" style="font-size:16px">edit</span></button>'+
          '<button class="btn-icon" onclick="ProductsPage.del(\''+p.id+'\')"><span class="material-symbols-outlined" style="font-size:16px;color:var(--danger)">delete</span></button>'+
        '</td></tr>';
    }).join('');
  }
  var _currentModal = null;
  function openModal(id) {
    var p = id ? DB.find('products', id) : null;
    
    var nsOptions = getAllSizeGroupNames().map(function(g) { 
      return `<option ${(p && p.nhom_size === g) ? 'selected' : ''}>${g}</option>`; 
    }).join('');

    var contentHtml = `
      <input type="hidden" id="pm-id" value="${p ? p.id : ''}">
      <div class="form-grid">
        <div class="form-group span2"><label>Tên hàng 2 *</label><input id="pm-ten" placeholder="VD: AMC545S659" value="${p ? (p.ten_hang_2 || '') : ''}"></div>
        <div class="form-group"><label>Nhóm hàng</label>
          <select id="pm-nhom">
            <option ${(!p || p.nhom_hang === 'SKU101') ? 'selected' : ''}>SKU101</option>
            <option ${(p && p.nhom_hang === 'SKU102') ? 'selected' : ''}>SKU102</option>
          </select>
        </div>
        <div class="form-group"><label>Form</label>
          <select id="pm-form">
            <option ${(!p || p.form === 'AMC') ? 'selected' : ''}>AMC</option>
            <option ${(p && p.form === 'ARC') ? 'selected' : ''}>ARC</option>
            <option ${(p && p.form === 'AMD') ? 'selected' : ''}>AMD</option>
          </select>
        </div>
        <div class="form-group"><label>Design</label><input id="pm-design" placeholder="S659" value="${p ? (p.design || '') : ''}"></div>
        <div class="form-group"><label>Màu</label><input id="pm-mau" placeholder="S659-Xanh navy" value="${p ? (p.mau || '') : ''}"></div>
        <div class="form-group"><label>Nhóm size</label><select id="pm-nhom-size">${nsOptions}</select></div>
        <div class="form-group"><label>Đơn giá</label><input id="pm-gia" type="number" placeholder="545000" value="${p ? (p.don_gia || '') : ''}"></div>
        <div class="form-group span2"><label>Tên hàng hóa</label><input id="pm-tenhh" placeholder="Áo sơ mi-AMC545S659" value="${p ? (p.ten_hang_hoa || '') : ''}"></div>
        <div class="form-group"><label>Tên nhóm hàng</label>
          <select id="pm-tennhom">
            <option ${(!p || p.ten_nhom_hang === 'SỔ MI NGẮN TAY') ? 'selected' : ''}>SỔ MI NGẮN TAY</option>
            <option ${(p && p.ten_nhom_hang === 'SỔ MI DÀI TAY') ? 'selected' : ''}>SỔ MI DÀI TAY</option>
            <option ${(p && p.ten_nhom_hang === 'QUẦN ÂU') ? 'selected' : ''}>QUẦN ÂU</option>
          </select>
        </div>
        <div class="form-group"><label>Trạng thái</label>
          <select id="pm-ngung">
            <option value="false" ${(!p || p.ngung_su_dung === false) ? 'selected' : ''}>Đang bán</option>
            <option value="true" ${(p && p.ngung_su_dung === true) ? 'selected' : ''}>Ngừng bán</option>
          </select>
        </div>
      </div>
    `;

    var footerHtml = document.createElement('div');
    footerHtml.innerHTML = `
      <button class="btn btn-ghost" onclick="ProductsPage.closeModal()">Hủy</button>
      <button class="btn btn-primary" onclick="ProductsPage.save()">Lưu</button>
    `;

    _currentModal = UIModal.show({
      id: 'modal-product',
      title: p ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm',
      width: '600px',
      content: contentHtml,
      footer: footerHtml
    });
  }

  function closeModal() {
    if (_currentModal) _currentModal.close();
    _currentModal = null;
  }

  function save() {
    var id=document.getElementById('pm-id').value;
    var data={ten_hang_2:document.getElementById('pm-ten').value.trim(),
      nhom_hang:document.getElementById('pm-nhom').value,
      form:document.getElementById('pm-form').value,
      design:document.getElementById('pm-design').value.trim(),
      mau:document.getElementById('pm-mau').value.trim(),
      nhom_size:document.getElementById('pm-nhom-size').value,
      don_gia:parseInt(document.getElementById('pm-gia').value)||0,
      ten_hang_hoa:document.getElementById('pm-tenhh').value.trim(),
      ten_nhom_hang:document.getElementById('pm-tennhom').value,
      ngung_su_dung:document.getElementById('pm-ngung').value==='true',
      ten_form:document.getElementById('pm-form').value==='AMC'?'Modern Fit':'Regular'};
    if(!data.ten_hang_2){showToast('Vui lòng nhập Tên hàng 2!',false);return;}
    if(id) DB.update('products',id,data); else DB.add('products',data);
    closeModal(); _render();
    showToast(id?'Đã cập nhật':'Đã thêm sản phẩm');
  }
  function del(id){if(!confirm('Xóa sản phẩm này?'))return;DB.remove('products',id);_render();showToast('Đã xóa');}
  return { render:render, openModal:openModal, closeModal:closeModal, save:save, del:del };
})();
