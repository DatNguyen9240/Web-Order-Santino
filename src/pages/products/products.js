var ProductsPage = (function () {
  var gridApi = null;
  var prodsData = [];

  function render($el) {
    return Router.fetchTemplate('src/pages/products/products.html').then(function (html) {
      $el.innerHTML = html;
      _initGrid();
    });
  }

  async function _initGrid() {
    try {
      prodsData = await ProductService.getProducts();
    } catch (err) {
      console.warn('[ProductsPage] Lỗi lấy sản phẩm từ API:', err);
      prodsData = [];
    }

    if (!prodsData || !prodsData.length) {
      // Mock data if API is empty
      prodsData = [
        { id: '1', ten_hang_2: 'AMC545S659', nhom_hang: 'SKU101', form: 'AMC', design: 'S659', mau: 'S659-Xanh navy', nhom_size: 'Nhóm 1', don_gia: 545000, ten_hang_hoa: 'Áo sơ mi-AMC545S659', ten_nhom_hang: 'SỔ MI NGẮN TAY', ngung_su_dung: false },
        { id: '2', ten_hang_2: 'ARC425S102', nhom_hang: 'SKU102', form: 'ARC', design: 'S102', mau: 'S102-Đen', nhom_size: 'Nhóm 1', don_gia: 425000, ten_hang_hoa: 'Áo sơ mi-ARC425S102', ten_nhom_hang: 'SỔ MI DÀI TAY', ngung_su_dung: false },
        { id: '3', ten_hang_2: 'AMD320S089', nhom_hang: 'SKU101', form: 'AMD', design: 'S089', mau: 'S089-Trắng', nhom_size: 'Nhóm 2', don_gia: 320000, ten_hang_hoa: 'Áo thun-AMD320S089', ten_nhom_hang: 'QUẦN ÂU', ngung_su_dung: true }
      ];
    }

    var container = document.getElementById('products-grid-container');
    if (!container) return;

    var gridOptions = {
      columnDefs: [
        { field: 'ten_hang_2', headerName: 'Tên hàng 2', cellStyle: { fontWeight: '700' } },
        { field: 'nhom_hang', headerName: 'Nhóm hàng' },
        {
          field: 'form',
          headerName: 'Form',
          cellRenderer: function (params) {
            return params.value ? '<span class="badge badge-blue">' + params.value + '</span>' : '—';
          }
        },
        { field: 'mau', headerName: 'Design/Màu' },
        {
          field: 'nhom_size',
          headerName: 'Nhóm size',
          cellRenderer: function (params) {
            return params.value ? '<span class="badge badge-green">' + params.value + '</span>' : '—';
          }
        },
        {
          field: 'don_gia',
          headerName: 'Đơn giá',
          cellStyle: { color: 'var(--accent, #4F46E5)', fontWeight: '700' },
          valueFormatter: function (params) {
            if (typeof Utils !== 'undefined' && Utils.formatMoney) {
              return Utils.formatMoney(params.value);
            }
            return params.value;
          }
        },
        { field: 'ten_hang_hoa', headerName: 'Tên hàng hóa', tooltipField: 'ten_hang_hoa' },
        {
          field: 'ngung_su_dung',
          headerName: 'Trạng thái',
          cellRenderer: function (params) {
            var stopped = !!params.value;
            var badgeClass = stopped ? 'badge-red' : 'badge-green';
            var badgeText = stopped ? 'Ngừng bán' : 'Đang bán';
            return '<span class="badge ' + badgeClass + '">' + badgeText + '</span>';
          }
        },
        {
          headerName: 'Thao tác',
          sortable: false,
          filter: false,
          floatingFilter: false,
          cellRenderer: function (params) {
            var p = params.data;
            var wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.gap = '6px';
            wrapper.style.alignItems = 'center';
            wrapper.innerHTML = `
              <button class="btn-icon" onclick="ProductsPage.openModal('${p.id}')">
                <span class="material-symbols-outlined" style="font-size: calc(16px * var(--text-scale, 1))">edit</span>
              </button>
              <button class="btn-icon" onclick="ProductsPage.del('${p.id}')">
                <span class="material-symbols-outlined" style="font-size: calc(16px * var(--text-scale, 1));color:var(--danger)">delete</span>
              </button>
            `;
            return wrapper;
          }
        }
      ],
      rowData: prodsData
    };

    gridApi = AppGrid.create(container, gridOptions);
  }

  function openModal(id) {
    var p = prodsData.find(item => item.id === id);
    document.getElementById('pm-title').textContent = p ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm';
    document.getElementById('pm-id').value = p ? p.id : '';

    var ns = document.getElementById('pm-nhom-size');
    if (typeof getAllSizeGroupNames !== 'undefined') {
      ns.innerHTML = getAllSizeGroupNames().map(function (g) { return '<option>' + g + '</option>'; }).join('');
    } else {
      ns.innerHTML = '<option>Nhóm 1</option><option>Nhóm 2</option>';
    }

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
      document.getElementById('pm-nhom').selectedIndex = 0;
      document.getElementById('pm-form').selectedIndex = 0;
      document.getElementById('pm-tennhom').selectedIndex = 0;
      document.getElementById('pm-ngung').selectedIndex = 0;
    }
    window.openModal('modal-product');
  }

  function copyProduct() {
    if (!gridApi) return;
    var selectedRows = gridApi.getSelectedRows();
    if (!selectedRows || selectedRows.length === 0) {
      showToast('Vui lòng chọn một dòng để sao chép!', false);
      return;
    }
    var p = selectedRows[0];
    openModal(''); // Open as Add mode

    // Pre-populate values
    document.getElementById('pm-ten').value = p.ten_hang_2 ? (p.ten_hang_2 + ' - Copy') : '';
    document.getElementById('pm-nhom').value = p.nhom_hang || 'SKU102';
    document.getElementById('pm-form').value = p.form || 'AMC';
    document.getElementById('pm-design').value = p.design || '';
    document.getElementById('pm-mau').value = p.mau || '';
    var ns = document.getElementById('pm-nhom-size');
    if (ns) ns.value = p.nhom_size || '';
    document.getElementById('pm-gia').value = p.don_gia || '';
    document.getElementById('pm-tenhh').value = p.ten_hang_hoa || '';
    document.getElementById('pm-tennhom').value = p.ten_nhom_hang || 'SỔ MI NGẮN TAY';
    document.getElementById('pm-ngung').value = String(!!p.ngung_su_dung);
  }

  function save() {
    var id = document.getElementById('pm-id').value;
    var name2 = document.getElementById('pm-ten').value.trim();
    if (!name2) { showToast('Vui lòng nhập Tên hàng 2!', false); return; }

    var productItem = {
      id: id || String(Date.now()),
      ten_hang_2: name2,
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

    if (id) {
      // Edit
      var idx = prodsData.findIndex(item => item.id === id);
      if (idx !== -1) prodsData[idx] = productItem;
    } else {
      // Add new
      prodsData.push(productItem);
    }

    closeModal('modal-product');
    if (gridApi) {
      gridApi.setGridOption('rowData', prodsData);
    }
    showToast(id ? 'Đã cập nhật sản phẩm' : 'Đã thêm sản phẩm');
  }

  function del(id) {
    ConfirmModal.show({
      title: 'Xóa sản phẩm',
      message: 'Xóa sản phẩm này?',
      confirmText: 'Xóa',
      confirmClass: 'btn-danger',
      onConfirm: function () {
        prodsData = prodsData.filter(item => item.id !== id);
        if (gridApi) {
          gridApi.setGridOption('rowData', prodsData);
        }
        showToast('Đã xóa sản phẩm');
      }
    });
  }

  function onSearch(val) {
    if (gridApi) {
      gridApi.setGridOption('quickFilterText', val);
    }
  }

  function onFormFilter(val) {
    if (gridApi) {
      var filterInstance = gridApi.getColumnFilterModel('form');
      if (val) {
        gridApi.setColumnFilterModel('form', {
          filterType: 'text',
          type: 'equals',
          filter: val
        }).then(function () {
          gridApi.onFilterChanged();
        });
      } else {
        gridApi.setColumnFilterModel('form', null).then(function () {
          gridApi.onFilterChanged();
        });
      }
    }
  }

  return { render: render, openModal: openModal, copyProduct: copyProduct, save: save, del: del, onSearch: onSearch, onFormFilter: onFormFilter };
})();
