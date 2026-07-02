var PromosPage = (function () {
  function render($el) {
    return Router.fetchTemplate('src/pages/promos/promos.html').then(function (html) {
      $el.innerHTML = html; _render();
    });
  }
  function _render() {
    var promos = [];
    var tbody = document.getElementById('promos-body');
    if (!promos.length) { tbody.innerHTML = '<tr><td colspan="5" class="empty-state"><span class="material-symbols-outlined">local_offer</span><span data-i18n="table.empty">' + t('table.empty') + '</span></td></tr>'; return; }
    tbody.innerHTML = promos.map(function (p) {
      return '<tr><td><strong style="font-family:monospace">' + p.ma_ctbh + '</strong></td>' +
        '<td>' + p.ten_ctbh + '</td>' +
        '<td style="color:var(--muted)">' + (p.mo_ta || '—') + '</td>' +
        '<td><span class="badge ' + (p.active !== false ? 'badge-green' : 'badge-red') + '">' + (p.active !== false ? 'Đang áp dụng' : 'Tạm dừng') + '</span></td>' +
        '<td><div style="display:flex;gap:6px;align-items:center">' +
        '<button class="btn-icon" onclick="PromosPage.openModal(\'' + p.id + '\')"><span class="material-symbols-outlined" style="font-size: calc(16px * var(--text-scale, 1))">edit</span></button>' +
        '<button class="btn-icon" onclick="PromosPage.del(\'' + p.id + '\')"><span class="material-symbols-outlined" style="font-size: calc(16px * var(--text-scale, 1));color:var(--danger)">delete</span></button>' +
        '</div></td></tr>';
    }).join('');
  }
  function openModal(id) {
    var p = null;
    document.getElementById('prom-title').textContent = p ? 'Sửa CTKM' : 'Thêm CTKM';
    document.getElementById('prom-id').value = p ? p.id : '';
    document.getElementById('prom-ma').value = p ? p.ma_ctbh : '';
    document.getElementById('prom-ten').value = p ? p.ten_ctbh : '';
    document.getElementById('prom-mota').value = p ? p.mo_ta || '' : '';
    document.getElementById('prom-active').value = p ? String(p.active !== false) : 'true';
    window.openModal('modal-promo');
  }
  function save() {
    var id = document.getElementById('prom-id').value;
    var data = {
      ma_ctbh: document.getElementById('prom-ma').value.trim(),
      ten_ctbh: document.getElementById('prom-ten').value.trim(),
      mo_ta: document.getElementById('prom-mota').value.trim(),
      active: document.getElementById('prom-active').value === 'true'
    };
    if (!data.ma_ctbh || !data.ten_ctbh) { showToast('Vui lòng nhập Mã và Tên CTBH!', false); return; }
    showToast('Chức năng thêm/sửa CTKM vô hiệu hóa (chưa có API)');
    closeModal('modal-promo'); _render(); showToast('Đã lưu CTKM');
  }
  function del(id) {
    ConfirmModal.show({
      title: 'Xóa CTKM',
      message: 'Xóa CTKM này?',
      confirmText: 'Xóa',
      confirmClass: 'btn-danger',
      onConfirm: function() {
        showToast('Chức năng xóa vô hiệu hóa (chưa có API)');
        _render();
        showToast('Đã xóa CTKM');
      }
    });
  }
  return { render: render, openModal: openModal, save: save, del: del };
})();
