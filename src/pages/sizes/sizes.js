var SizesPage = (function () {
  function render($el) {
    return Router.fetchTemplate('src/pages/sizes/sizes.html').then(function (html) {
      $el.innerHTML = html; _render();
    });
  }
  function _render() {
    var sizes = [];
    var tbody = document.getElementById('sizes-body');
    if (!sizes.length) { tbody.innerHTML = '<tr><td colspan="4" class="empty-state"><span class="material-symbols-outlined">straighten</span><span data-i18n="table.empty">' + t('table.empty') + '</span></td></tr>'; return; }
    tbody.innerHTML = sizes.map(function (s) {
      return '<tr><td style="font-weight:700;font-size: calc(16px * var(--text-scale, 1))">' + s.size + '</td>' +
        '<td>' + (s.ten_size || s.size) + '</td>' +
        '<td><span class="badge badge-blue">' + s.nhom_size + '</span></td>' +
        '<td style="display:flex;gap:6px">' +
        '<button class="btn-icon" onclick="SizesPage.openModal(\'' + s.id + '\')"><span class="material-symbols-outlined" style="font-size: calc(16px * var(--text-scale, 1))">edit</span></button>' +
        '<button class="btn-icon" onclick="SizesPage.del(\'' + s.id + '\')"><span class="material-symbols-outlined" style="font-size: calc(16px * var(--text-scale, 1));color:var(--danger)">delete</span></button>' +
        '</td></tr>';
    }).join('');
  }
  function openModal(id) {
    var s = null;
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
    showToast('Chức năng thêm/sửa size vô hiệu hóa (chưa có API)');
    closeModal('modal-size'); _render(); showToast('Đã lưu size');
  }
  function del(id) {
    ConfirmModal.show({
      title: 'Xóa size',
      message: 'Xóa size này?',
      confirmText: 'Xóa',
      confirmClass: 'btn-danger',
      onConfirm: function() {
        showToast('Chức năng xóa vô hiệu hóa (chưa có API)');
        _render();
        showToast('Đã xóa size');
      }
    });
  }
  return { render: render, openModal: openModal, save: save, del: del };
})();
