var ProductsPage = (function () {
  function render($el) {
    return Router.fetchTemplate('src/pages/products/products.html').then(function (html) {
      $el.innerHTML = html; _render();
    });
  }
  function _render() {
    var q = (document.getElementById('product-search') || {}).value || '';
    var form = (document.getElementById('product-filter-form') || {}).value || '';
    var prods = []; // API chưa hỗ trợ hiển thị kho sản phẩm

    var tbody = document.getElementById('products-body');
    if (!prods.length) { tbody.innerHTML = '<tr><td colspan="9" class="empty-state"><span class="material-symbols-outlined">inventory_2</span><span data-i18n="table.empty">' + t('table.empty') + '</span></td></tr>'; return; }
    tbody.innerHTML = prods.map(function (p) {
      return '<tr><td><strong>' + p.ten_hang_2 + '</strong></td><td>' + p.nhom_hang + '</td>' +
        '<td><span class="badge badge-blue">' + p.form + '</span></td>' +
        '<td>' + p.mau + '</td><td><span class="badge badge-green">' + p.nhom_size + '</span></td>' +
        '<td style="font-weight:700;color:var(--accent)">' + Utils.formatMoney(p.don_gia) + '</td>' +
        '<td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + p.ten_hang_hoa + '</td>' +
        '<td><span class="badge ' + (p.ngung_su_dung ? 'badge-red' : 'badge-green') + '">' + (p.ngung_su_dung ? 'Ngừng bán' : 'Đang bán') + '</span></td>' +
        '<td style="display:flex;gap:6px">' +
        '<button class="btn-icon" onclick="ProductsPage.openModal(\'' + p.id + '\')"><span class="material-symbols-outlined" style="font-size: calc(16px * var(--text-scale, 1))">edit</span></button>' +
        '<button class="btn-icon" onclick="ProductsPage.del(\'' + p.id + '\')"><span class="material-symbols-outlined" style="font-size: calc(16px * var(--text-scale, 1));color:var(--danger)">delete</span></button>' +
        '</td></tr>';
    }).join('');
  }
  function openModal(id) {
    var p = null;
    document.getElementById('pm-title').textContent = p ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm';
    document.getElementById('pm-id').value = p ? p.id : '';
    var ns = document.getElementById('pm-nhom-size');
    ns.innerHTML = getAllSizeGroupNames().map(function (g) { return '<option>' + g + '</option>'; }).join('');
    if (p) {
      document.getElementById('pm-ten').value = p.ten_hang_2 || '';
      document.getElementById('pm-nhom').value = p.nhom_hang || 'SKU102';
      document.getElementById('pm-form').value = p.form || 'AMC';
      document.getElementById('pm-design').value = p.design || '';
      document.getElementById('pm-mau').value = p.mau || '';
      ns.value = p.nhom_size || '';
      document.getElementById('pm-gia').value = p.don_gia || '';
      document.getElementById('pm-tenhh').value = p.ten_hang_hoa || '';
      document.getElementById('pm-tennhom').value = p.ten_nhom_hang || 'SỔ MI NGẮN TAY';
      document.getElementById('pm-ngung').value = String(!!p.ngung_su_dung);
    } else {
      ['pm-ten', 'pm-design', 'pm-mau', 'pm-gia', 'pm-tenhh'].forEach(function (i) { document.getElementById(i).value = ''; });
    }
    window.openModal('modal-product');
  }
  function save() {
    var id = document.getElementById('pm-id').value;
    var data = {
      ten_hang_2: document.getElementById('pm-ten').value.trim(),
      nhom_hang: document.getElementById('pm-nhom').value,
      form: document.getElementById('pm-form').value,
      design: document.getElementById('pm-design').value.trim(),
      mau: document.getElementById('pm-mau').value.trim(),
      nhom_size: document.getElementById('pm-nhom-size').value,
      don_gia: parseInt(document.getElementById('pm-gia').value) || 0,
      ten_hang_hoa: document.getElementById('pm-tenhh').value.trim(),
      ten_nhom_hang: document.getElementById('pm-tennhom').value,
      ngung_su_dung: document.getElementById('pm-ngung').value === 'true',
      ten_form: document.getElementById('pm-form').value === 'AMC' ? 'Modern Fit' : 'Regular'
    };
    if (!data.ten_hang_2) { showToast('Vui lòng nhập Tên hàng 2!', false); return; }
    showToast('Chức năng sửa sản phẩm đã vô hiệu hóa (chưa có API)');
    closeModal('modal-product'); _render();
    showToast(id ? 'Đã cập nhật' : 'Đã thêm sản phẩm');
  }
  function del(id){
    ConfirmModal.show({
      title: 'Xóa sản phẩm',
      message: 'Xóa sản phẩm này?',
      confirmText: 'Xóa',
      confirmClass: 'btn-danger',
      onConfirm: function() {
        showToast('Chức năng xóa đã vô hiệu hóa (chưa có API)');
        _render();
        showToast('Đã xóa');
      }
    });
  }
  return { render: render, openModal: openModal, save: save, del: del };
})();
