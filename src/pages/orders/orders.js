var OrdersPage = (function () {
  var currentPage = 1;
  var itemsPerPage = 20;

  function render($el) {
    // Cho phép trang này rộng tối đa theo container-order
    $el.classList.add('is-full-width');
    return Router.fetchTemplate('src/pages/orders/orders.html').then(function (html) {
      $el.innerHTML = html;

      // Tính toán giá trị mặc định: Từ ngày = Đầu tháng, Đến ngày = Hôm nay
      var now = new Date();
      var y = now.getFullYear();
      var m = String(now.getMonth() + 1).padStart(2, '0');
      var fromDefault = y + '-' + m + '-01';
      var toDefault = y + '-' + m + '-' + String(now.getDate()).padStart(2, '0');

      // Khởi tạo Custom Date Pickers
      var fromContainer = document.getElementById('orders-from-container');
      var toContainer = document.getElementById('orders-to-container');
      if (fromContainer && toContainer && typeof UIInput !== 'undefined') {
        var fromInput = UIInput.createDate({
          id: 'orders-from',
          name: 'orders-from',
          label: 'Từ ngày',
          placeholder: 'Chọn ngày...',
          value: fromDefault
        });
        var toInput = UIInput.createDate({
          id: 'orders-to',
          name: 'orders-to',
          label: 'Đến ngày',
          placeholder: 'Chọn ngày...',
          value: toDefault
        });
        fromContainer.appendChild(fromInput);
        toContainer.appendChild(toInput);

        var hiddenFrom = document.getElementById('orders-from');
        var hiddenTo = document.getElementById('orders-to');
        if (hiddenFrom) hiddenFrom.addEventListener('change', filter);
        if (hiddenTo) hiddenTo.addEventListener('change', filter);
      }

      _render();
    });
  }
  async function _render() {
    var qInput = document.getElementById('orders-search');
    var fromInput = document.getElementById('orders-from');
    var toInput = document.getElementById('orders-to');

    var q = qInput ? qInput.value : '';
    var fromDate = fromInput ? fromInput.value : '';
    var toDate = toInput ? toInput.value : '';

    var orders = [];
    var totalItems = 0;

    var tbody = document.getElementById('orders-body');
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="8" class="empty-state"><span class="material-symbols-outlined anim-spin" style="color:var(--primary)">sync</span><span>Đang tải danh sách đơn hàng...</span></td></tr>';
    }

    try {
      const queryObj = { Loai: 'Order' };
      // Gói chung vào TimKiem dạng JSON
      const timKiemData = { page: currentPage, limit: itemsPerPage };
      if (q && q.trim()) timKiemData.q = q.trim();
      if (fromDate) timKiemData.from = fromDate;
      if (toDate) timKiemData.to = toDate;

      queryObj.TimKiem = JSON.stringify(timKiemData);

      var user = JSON.parse(localStorage.getItem('santino_user') || '{}');
      var role = user.role || user.Group || '';
      var empID = user.EmployeeID || '';
      var objID = user.ObjectID || '';
      if (objID && objID !== '') {
         empID = '';
      }
      queryObj.chinhanh = '|PAGE:1|ROLE:' + role + '|EMP:' + empID + '|OBJ:' + objID;

      const params = { q: JSON.stringify(queryObj), _t: Date.now() };

      const res = await Http.get(API_CONFIG.ENDPOINTS.CATEGORIES.LIST, params);
      orders = res.records || res;
      if (!Array.isArray(orders)) orders = [];

      if (orders.length > 0 && orders[0].total_rows) {
        totalItems = orders[0].total_rows;
      }
    } catch (err) {
      console.warn('Lỗi tải danh sách đơn hàng:', err);
    }
    var tbody = document.getElementById('orders-body');
    var paginationContainer = document.getElementById('orders-pagination');
    if (paginationContainer) paginationContainer.innerHTML = '';

    if (!orders || !orders.length) {
      tbody.innerHTML = '<tr><td colspan="8" class="empty-state"><span class="material-symbols-outlined">receipt_long</span><span data-i18n="orders.search.empty">Không có đơn hàng nào</span></td></tr>';
      return;
    }
    tbody.innerHTML = orders.map(function (o) {
      return '<tr onclick="Utils.toggleRow(this)"><td><strong>' + o.so_ct + '</strong></td><td>' + o.ngay_ct + '</td><td>' + o.chi_nhanh + '</td>' +
        '<td>' + (o.ma_ctbh ? '<span class="badge badge-yellow">' + o.ma_ctbh + '</span>' : '<span style="color:var(--muted)">—</span>') + '</td>' +
        '<td style="font-weight:700">' + (o.total_qty || 0) + ' ' + t('order.preview.sp') + '</td>' +
        '<td style="font-weight:700;color:var(--accent)">' + Utils.formatMoney(o.total_money || 0) + '</td>' +
        '<td style="color:var(--muted)">' + (o.ghi_chu || '—') + '</td>' +
        '<td><div style="display:flex;gap:6px;align-items:center">' +
        '<button class="btn btn-ghost btn-sm" onclick="OrdersPage.view(\'' + o.id + '\')">' + t('btn.detail') + '</button>' +
        '<button class="btn-icon" onclick="OrdersPage.del(\'' + o.id + '\')"><span class="material-symbols-outlined" style="font-size: calc(16px * var(--text-scale, 1));color:var(--danger)">delete</span></button>' +
        '</div></td></tr>';
    }).join('');

    if (paginationContainer && totalItems > 0 && typeof Pagination !== 'undefined') {
      var pag = Pagination.create({
        totalItems: totalItems,
        itemsPerPage: itemsPerPage,
        currentPage: currentPage,
        onPageChange: function (page) {
          currentPage = page;
          _render();
        }
      });
      paginationContainer.appendChild(pag);
    }
  }
  var _searchTimeout = null;
  function filter() {
    if (_searchTimeout) clearTimeout(_searchTimeout);
    _searchTimeout = setTimeout(function () {
      currentPage = 1;
      _render();
    }, 500);
  }
  function del(id) {
    ConfirmModal.show({
      title: t('order.delete.title') || 'Xóa đơn hàng',
      message: 'Bạn có chắc chắn muốn xóa đơn hàng <strong>' + id + '</strong> không?',
      confirmText: t('btn.delete') || 'Xóa',
      confirmClass: 'btn-danger',
      onConfirm: async function () {
        try {
          const res = await OrderService.deleteOrder(id);
          // Hỗ trợ cả 2 dạng: Array trực tiếp hoặc Object { records: [...] }
          let success = false;
          let msg = 'Không thể xóa đơn hàng ' + id;

          if (Array.isArray(res) && res.length > 0) {
            success = (res[0].Success == '1' || res[0].Success === 1);
            msg = res[0].Message || msg;
          } else if (res && typeof res === 'object') {
            if (res.Success == '1' || res.Success === 1 || res.code === 0) {
              success = true;
            } else if (res.records && res.records.length > 0) {
              success = (res.records[0].Success == '1' || res.records[0].Success === 1);
            }
            // Nếu server trả về chung chung, mình đính kèm thêm ID cho rõ
            var serverMsg = res.Message || (res.records && res.records.length > 0 ? res.records[0].Message : '');
            msg = serverMsg ? (serverMsg + ' (' + id + ')') : ('Đã xóa đơn hàng ' + id + ' thành công');
          }

          if (success) {
            showToast(msg);
            _render(); // Tải lại danh sách
          } else {
            showToast(msg, 'error');
          }
        } catch (err) {
          console.error(err);
          showToast('Lỗi khi gọi API xóa đơn hàng ' + id, 'error');
        }
      }
    });
  }
  function view(id) {
    window._viewOrderId = id;
    Router.go('/order-detail?id=' + id);
  }
  return { render: render, filter: filter, del: del, view: view };
})();
