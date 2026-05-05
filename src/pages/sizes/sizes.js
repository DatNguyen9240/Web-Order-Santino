var SizesPage = (function () {
  function render($el) {
    return Router.fetchTemplate('src/pages/sizes/sizes.html').then(function(html){
      $el.innerHTML = html; _render();
    });
  }
  function _render() {
    var sizes=DB.getAll('sizes').sort(function(a,b){return a.nhom_size.localeCompare(b.nhom_size)||a.size-b.size;});
    var tbody=document.getElementById('sizes-body');
    if(!sizes.length){tbody.innerHTML='<tr><td colspan="4" class="empty-state"><span class="material-symbols-outlined">straighten</span>Chưa có size</td></tr>';return;}
    tbody.innerHTML=sizes.map(function(s){
      return '<tr><td style="font-weight:700;font-size:16px">'+s.size+'</td>'+
        '<td>'+(s.ten_size||s.size)+'</td>'+
        '<td><span class="badge badge-blue">'+s.nhom_size+'</span></td>'+
        '<td style="display:flex;gap:6px">'+
          '<button class="btn-icon" onclick="SizesPage.openModal(\''+s.id+'\')"><span class="material-symbols-outlined" style="font-size:16px">edit</span></button>'+
          '<button class="btn-icon" onclick="SizesPage.del(\''+s.id+'\')"><span class="material-symbols-outlined" style="font-size:16px;color:var(--danger)">delete</span></button>'+
        '</td></tr>';
    }).join('');
  }
  var _currentModal = null;
  function openModal(id) {
    var s = id ? DB.find('sizes', id) : null;
    
    var contentHtml = `
      <input type="hidden" id="sm-id" value="${s ? s.id : ''}">
      <div class="form-grid">
        <div class="form-group"><label>Size (số) *</label><input id="sm-size" type="number" placeholder="40" value="${s ? s.size : ''}"></div>
        <div class="form-group"><label>Tên size</label><input id="sm-ten" placeholder="40" value="${s ? (s.ten_size || '') : ''}"></div>
        <div class="form-group"><label>Nhóm size *</label><input id="sm-nhom" placeholder="Nhóm 3" value="${s ? (s.nhom_size || '') : 'Nhóm 3'}"></div>
      </div>
    `;

    var footerHtml = document.createElement('div');
    footerHtml.innerHTML = `
      <button class="btn btn-ghost" onclick="SizesPage.closeModal()">Hủy</button>
      <button class="btn btn-primary" onclick="SizesPage.save()">Lưu</button>
    `;

    _currentModal = UIModal.show({
      id: 'modal-size',
      title: s ? 'Sửa Size' : 'Thêm Size',
      width: '500px',
      content: contentHtml,
      footer: footerHtml
    });
  }
  function closeModal() {
    if (_currentModal) _currentModal.close();
    _currentModal = null;
  }
  function save() {
    var id=document.getElementById('sm-id').value;
    var sz=parseInt(document.getElementById('sm-size').value);
    if(!sz){showToast('Vui lòng nhập size!',false);return;}
    var data={size:sz,ten_size:document.getElementById('sm-ten').value||String(sz),nhom_size:document.getElementById('sm-nhom').value.trim()||'Nhóm 3'};
    if(id) DB.update('sizes',id,data); else DB.add('sizes',{...data,id:data.nhom_size+'_'+sz});
    closeModal(); _render(); showToast('Đã lưu size');
  }
  function del(id){if(!confirm('Xóa size này?'))return;DB.remove('sizes',id);_render();showToast('Đã xóa size');}
  return { render:render, openModal:openModal, closeModal:closeModal, save:save, del:del };
})();
