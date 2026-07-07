var SizesPage = (function () {
  var gridApi = null;
  var sizesData = [];

  function render($el) {
    return Router.fetchTemplate('src/pages/sizes/sizes.html').then(function (html) {
      $el.innerHTML = html;
      _initGrid();
    });
  }

  async function _initGrid() {
    try {
      sizesData = await ProductService.getSizes();
    } catch (err) {
      console.warn('[SizesPage] Lỗi lấy sizes từ API:', err);
      sizesData = [];
    }

    if (!sizesData || !sizesData.length) {
      // Mock data if API has no records
      sizesData = [
        { id: '1', size: 39, ten_size: '39', nhom_size: 'Nhóm 1' },
        { id: '2', size: 40, ten_size: '40', nhom_size: 'Nhóm 1' },
        { id: '3', size: 41, ten_size: '41', nhom_size: 'Nhóm 2' }
      ];
    }

    var container = document.getElementById('sizes-grid-container');
    if (!container) return;

    var gridOptions = {
      columnDefs: [
        { field: 'size', headerName: 'Size', cellStyle: { fontWeight: '700' } },
        { field: 'ten_size', headerName: 'Tên size' },
        { 
          field: 'nhom_size', 
          headerName: 'Nhóm size',
          cellRenderer: function(params) {
            return '<span class="badge badge-blue">' + params.value + '</span>';
          }
        },
        {
          headerName: 'Thao tác',
          sortable: false,
          filter: false,
          floatingFilter: false,
          cellRenderer: function(params) {
            var s = params.data;
            var wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.gap = '6px';
            wrapper.style.alignItems = 'center';
            wrapper.innerHTML = `
              <button class="btn-icon" onclick="SizesPage.openModal('${s.id}')">
                <span class="material-symbols-outlined" style="font-size: calc(16px * var(--text-scale, 1))">edit</span>
              </button>
              <button class="btn-icon" onclick="SizesPage.del('${s.id}')">
                <span class="material-symbols-outlined" style="font-size: calc(16px * var(--text-scale, 1));color:var(--danger)">delete</span>
              </button>
            `;
            return wrapper;
          }
        }
      ],
      rowData: sizesData
    };

    gridApi = AppGrid.create(container, gridOptions);
  }

  function openModal(id) {
    var s = sizesData.find(item => item.id === id);
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
    
    var sizeItem = { 
      id: id || String(Date.now()), 
      size: sz, 
      ten_size: document.getElementById('sm-ten').value || String(sz), 
      nhom_size: document.getElementById('sm-nhom').value.trim() || 'Nhóm 3' 
    };

    if (id) {
      // Edit
      var idx = sizesData.findIndex(item => item.id === id);
      if (idx !== -1) sizesData[idx] = sizeItem;
    } else {
      // Add new
      sizesData.push(sizeItem);
    }

    closeModal('modal-size');
    if (gridApi) {
      gridApi.setGridOption('rowData', sizesData);
    }
    showToast('Đã lưu size');
  }

  function del(id) {
    ConfirmModal.show({
      title: 'Xóa size',
      message: 'Xóa size này?',
      confirmText: 'Xóa',
      confirmClass: 'btn-danger',
      onConfirm: function() {
        sizesData = sizesData.filter(item => item.id !== id);
        if (gridApi) {
          gridApi.setGridOption('rowData', sizesData);
        }
        showToast('Đã xóa size');
      }
    });
  }

  return { render: render, openModal: openModal, save: save, del: del };
})();
