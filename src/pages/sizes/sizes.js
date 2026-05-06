var SizesPage = (function () {
  function render($el) {
    return Router.fetchTemplate('src/pages/sizes/sizes.html').then(function (html) {
      $el.innerHTML = html; 
      var footer = document.getElementById('global-footer');
      if (footer) footer.style.display = 'none';
      _render();
    });
  }
  function _render() {
    var sizes = DB.getAll('sizes').sort(function (a, b) { return a.nhom_size.localeCompare(b.nhom_size) || a.size - b.size; });
    var tbody = document.getElementById('sizes-body');
    if (!sizes.length) { tbody.innerHTML = '<tr><td colspan="4" class="empty-state"><span class="material-symbols-outlined">straighten</span><span data-i18n="table.empty">' + t('table.empty') + '</span></td></tr>'; return; }
    tbody.innerHTML = sizes.map(function (s) {
      return '<tr>' +
        '<td><strong>' + s.size + '</strong></td>' +
        '<td>' + (s.ten_size || s.size) + '</td>' +
        '<td style="text-align:center"><span class="badge badge-yellow" style="background:rgba(251,191,36,0.08); color:#b45309; font-size:11px">' + s.nhom_size + '</span></td>' +
        '<td style="display:flex; gap:6px; justify-content:center">' +
          '<button class="icon-btn" style="border:1px solid var(--border);" onclick="SizesPage.openModal(\'' + s.id + '\')"><span class="material-symbols-outlined" style="font-size: 18px">edit</span></button>' +
          '<button class="icon-btn" onclick="SizesPage.del(\'' + s.id + '\')"><span class="material-symbols-outlined" style="font-size: 18px; color:var(--danger)">delete</span></button>' +
        '</td></tr>';
    }).join('');
  }
  function openModal(id) {
    var s = id ? DB.find('sizes', id) : null;
    document.getElementById('sm-title').textContent = s ? 'Sửa Size' : 'Thêm Size';
    document.getElementById('sm-id').value = s ? s.id : '';
    document.getElementById('sm-size').value = s ? s.size : '';
    document.getElementById('sm-ten').value = s ? s.ten_size : '';
    document.getElementById('sm-nhom').value = s ? s.nhom_size : 'Nhóm 3';
    window.openModal('modal-size');
  }
  function save() {
    var id = document.getElementById('sm-id').value;
    var sz = parseInt(document.getElementById('sm-size').value);
    if (!sz) { showToast('Vui lòng nhập size!', false); return; }
    var data = { size: sz, ten_size: document.getElementById('sm-ten').value || String(sz), nhom_size: document.getElementById('sm-nhom').value.trim() || 'Nhóm 3' };
    if (id) DB.update('sizes', id, data); else DB.add('sizes', { ...data, id: data.nhom_size + '_' + sz });
    closeModal('modal-size'); _render(); showToast('Đã lưu size');
  }
  function del(id) {
    ConfirmModal.show({
      title: 'Xóa size',
      message: 'Xóa size này?',
      confirmText: 'Xóa',
      confirmClass: 'btn-danger',
      onConfirm: function() {
        DB.remove('sizes', id);
        _render();
        showToast('Đã xóa size');
      }
    });
  }
  return { render: render, openModal: openModal, save: save, del: del };
})();
