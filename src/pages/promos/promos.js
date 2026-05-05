var PromosPage = (function () {
  function render($el) {
    return Router.fetchTemplate('src/pages/promos/promos.html').then(function(html){
      $el.innerHTML = html; _render();
    });
  }
  function _render() {
    var promos=DB.getAll('promotions');
    var tbody=document.getElementById('promos-body');
    if(!promos.length){tbody.innerHTML='<tr><td colspan="5" class="empty-state"><span class="material-symbols-outlined">local_offer</span>Chưa có CTKM</td></tr>';return;}
    tbody.innerHTML=promos.map(function(p){
      return '<tr><td><strong style="font-family:monospace">'+p.ma_ctbh+'</strong></td>'+
        '<td>'+p.ten_ctbh+'</td>'+
        '<td style="color:var(--muted)">'+(p.mo_ta||'—')+'</td>'+
        '<td><span class="badge '+(p.active!==false?'badge-green':'badge-red')+'">'+(p.active!==false?'Đang áp dụng':'Tạm dừng')+'</span></td>'+
        '<td style="display:flex;gap:6px">'+
          '<button class="btn-icon" onclick="PromosPage.openModal(\''+p.id+'\')"><span class="material-symbols-outlined" style="font-size:16px">edit</span></button>'+
          '<button class="btn-icon" onclick="PromosPage.del(\''+p.id+'\')"><span class="material-symbols-outlined" style="font-size:16px;color:var(--danger)">delete</span></button>'+
        '</td></tr>';
    }).join('');
  }
  var _currentModal = null;
  function openModal(id) {
    var p = id ? DB.find('promotions', id) : null;
    
    var contentHtml = `
      <input type="hidden" id="prom-id" value="${p ? p.id : ''}">
      <div class="form-grid">
        <div class="form-group"><label>Mã CTBH *</label><input id="prom-ma" placeholder="CKCB" value="${p ? p.ma_ctbh : ''}"></div>
        <div class="form-group"><label>Tên CTBH *</label><input id="prom-ten" placeholder="Chiết khấu cơ bản" value="${p ? p.ten_ctbh : ''}"></div>
        <div class="form-group span2"><label>Mô tả</label><input id="prom-mota" placeholder="Mô tả ngắn..." value="${p ? (p.mo_ta || '') : ''}"></div>
        <div class="form-group"><label>Trạng thái</label>
          <select id="prom-active">
            <option value="true" ${(!p || p.active !== false) ? 'selected' : ''}>Đang áp dụng</option>
            <option value="false" ${(p && p.active === false) ? 'selected' : ''}>Tạm dừng</option>
          </select>
        </div>
      </div>
    `;

    var footerHtml = document.createElement('div');
    footerHtml.innerHTML = `
      <button class="btn btn-ghost" onclick="PromosPage.closeModal()">Hủy</button>
      <button class="btn btn-primary" onclick="PromosPage.save()">Lưu</button>
    `;

    _currentModal = UIModal.show({
      id: 'modal-promo',
      title: p ? 'Sửa CTKM' : 'Thêm CTKM',
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
    var id=document.getElementById('prom-id').value;
    var data={ma_ctbh:document.getElementById('prom-ma').value.trim(),
      ten_ctbh:document.getElementById('prom-ten').value.trim(),
      mo_ta:document.getElementById('prom-mota').value.trim(),
      active:document.getElementById('prom-active').value==='true'};
    if(!data.ma_ctbh||!data.ten_ctbh){showToast('Vui lòng nhập Mã và Tên CTBH!',false);return;}
    if(id) DB.update('promotions',id,data); else DB.add('promotions',{...data,id:data.ma_ctbh});
    closeModal(); _render(); showToast('Đã lưu CTKM');
  }
  function del(id){if(!confirm('Xóa CTKM này?'))return;DB.remove('promotions',id);_render();showToast('Đã xóa CTKM');}
  return { render:render, openModal:openModal, closeModal:closeModal, save:save, del:del };
})();
