var PromosPage = (function () {
  var gridApi = null;
  var promosData = [];

  function render($el) {
    return Router.fetchTemplate('src/pages/promos/promos.html').then(function (html) {
      $el.innerHTML = html;
      _initGrid();
    });
  }

  function _initGrid() {
    // Mock data for promotions
    if (!promosData || !promosData.length) {
      promosData = [
        { id: '1', ma_ctbh: 'CKCB', ten_ctbh: 'Chiết khấu cơ bản', mo_ta: 'Chiết khấu cơ bản áp dụng cho toàn bộ đơn hàng lẻ', active: true },
        { id: '2', ma_ctbh: 'KMHE', ten_ctbh: 'Khuyến mãi Hè 2026', mo_ta: 'Mùa hè rực rỡ giảm giá 10% các mặt hàng thun', active: true },
        { id: '3', ma_ctbh: 'KMDK', ten_ctbh: 'Khuyến mãi Đại lý', mo_ta: 'Chiết khấu bổ sung cho đại lý VIP', active: false }
      ];
    }

    var container = document.getElementById('promos-grid-container');
    if (!container) return;

    var gridOptions = {
      columnDefs: [
        { 
          field: 'ma_ctbh', 
          headerName: 'Mã CTBH', 
          cellStyle: { fontFamily: 'monospace', fontWeight: 'bold' } 
        },
        { field: 'ten_ctbh', headerName: 'Tên CTBH' },
        { 
          field: 'mo_ta', 
          headerName: 'Mô tả',
          cellStyle: { color: 'var(--color-text-secondary, #6b7280)' },
          cellRenderer: function(params) {
            return params.value || '—';
          }
        },
        { 
          field: 'active', 
          headerName: 'Trạng thái',
          cellRenderer: function(params) {
            var active = params.value !== false;
            var badgeClass = active ? 'badge-green' : 'badge-red';
            var badgeText = active ? 'Đang áp dụng' : 'Tạm dừng';
            return '<span class="badge ' + badgeClass + '">' + badgeText + '</span>';
          }
        },
        {
          headerName: 'Thao tác',
          sortable: false,
          filter: false,
          floatingFilter: false,
          cellRenderer: function(params) {
            var p = params.data;
            var wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.gap = '6px';
            wrapper.style.alignItems = 'center';
            wrapper.innerHTML = `
              <button class="btn-icon" onclick="PromosPage.openModal('${p.id}')">
                <span class="material-symbols-outlined" style="font-size: calc(16px * var(--text-scale, 1))">edit</span>
              </button>
              <button class="btn-icon" onclick="PromosPage.del('${p.id}')">
                <span class="material-symbols-outlined" style="font-size: calc(16px * var(--text-scale, 1));color:var(--danger)">delete</span>
              </button>
            `;
            return wrapper;
          }
        }
      ],
      rowData: promosData
    };

    gridApi = AppGrid.create(container, gridOptions);
  }

  function openModal(id) {
    var p = promosData.find(item => item.id === id);
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
    var ma = document.getElementById('prom-ma').value.trim();
    var ten = document.getElementById('prom-ten').value.trim();
    var mota = document.getElementById('prom-mota').value.trim();
    var active = document.getElementById('prom-active').value === 'true';

    if (!ma || !ten) { showToast('Vui lòng nhập Mã và Tên CTBH!', false); return; }

    var promoItem = {
      id: id || String(Date.now()),
      ma_ctbh: ma,
      ten_ctbh: ten,
      mo_ta: mota,
      active: active
    };

    if (id) {
      // Edit
      var idx = promosData.findIndex(item => item.id === id);
      if (idx !== -1) promosData[idx] = promoItem;
    } else {
      // Add new
      promosData.push(promoItem);
    }

    closeModal('modal-promo');
    if (gridApi) {
      gridApi.setGridOption('rowData', promosData);
    }
    showToast('Đã lưu CTKM');
  }

  function del(id) {
    ConfirmModal.show({
      title: 'Xóa CTKM',
      message: 'Xóa CTKM này?',
      confirmText: 'Xóa',
      confirmClass: 'btn-danger',
      onConfirm: function() {
        promosData = promosData.filter(item => item.id !== id);
        if (gridApi) {
          gridApi.setGridOption('rowData', promosData);
        }
        showToast('Đã xóa CTKM');
      }
    });
  }

  return { render: render, openModal: openModal, save: save, del: del };
})();
