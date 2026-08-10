var OrdersPage = (function () {
  var currentPage = 1;
  var itemsPerPage = 20;
  var gridApi = null;
  var orderMetadata = null;

  function _splitColumnNames(value) {
    return String(value || '').split(';').map(function (name) {
      return name.trim();
    }).filter(Boolean);
  }

  function _isHiddenField(field, config) {
    var hiddenNames = _splitColumnNames(config && config.hideColumnArr).map(function (name) {
      return name.toLowerCase();
    });
    var showInGrid = field && field.showInGrid;
    return hiddenNames.indexOf(String(field.name).toLowerCase()) >= 0
      || showInGrid === false
      || showInGrid === 0
      || showInGrid === '0'
      || String(showInGrid).toLowerCase() === 'false';
  }

  function _configuredFields(metadata) {
    var fields = (metadata && metadata.fields) || [];
    var config = metadata && metadata.config;
    var byName = {};
    fields.forEach(function (field) {
      byName[String(field.name).toLowerCase()] = field;
    });

    var configuredNames = _splitColumnNames(config && config.defaultColumnArr);
    var selectedFields = configuredNames.length
      ? configuredNames.map(function (name) { return byName[name.toLowerCase()]; }).filter(Boolean)
      : fields.slice().sort(function (a, b) {
        return Number(a.orderNo || 0) - Number(b.orderNo || 0);
      });

    return selectedFields.filter(function (field) {
      return !_isHiddenField(field, config);
    });
  }

  function _isMoneyField(field) {
    if (!field) return false;
    var renderRule = String(field.renderRule || field.FormatID || field.formatID || '').toUpperCase();
    var fieldName = String(field.name || '').toLowerCase();
    var fieldLabel = String(field.label || '').toLowerCase();

    return renderRule === 'B' 
      || fieldName === 'basetotal' 
      || fieldName === 'totalamount'
      || fieldName === 'khachdua'
      || fieldName === 'tralai'
      || fieldName === 'unitprice'
      || fieldName === 'amount'
      || fieldName.indexOf('tien') >= 0 
      || fieldName.indexOf('amount') >= 0 
      || fieldName.indexOf('total') >= 0 
      || fieldName.indexOf('price') >= 0
      || fieldName.indexOf('gia') >= 0
      || fieldLabel.indexOf('tiền') >= 0
      || fieldLabel.indexOf('thanh toán') >= 0;
  }

  function _applyMetadataFormat(column, field) {
    var renderRule = String(field.renderRule || field.FormatID || field.formatID || '').toUpperCase();
    var fieldName = String(field.name || '').toLowerCase();

    if (_isMoneyField(field)) {
      column.valueFormatter = function (params) {
        if (params.value == null || params.value === '') return '';
        var num = Number(params.value);
        if (isNaN(num)) return params.value;
        return typeof Utils !== 'undefined' && Utils.formatMoney
          ? Utils.formatMoney(num)
          : num.toLocaleString('vi-VN') + ' đ';
      };
      column.cellStyle = function (params) {
        if (params.node && params.node.rowPinned === 'bottom') {
          return { textAlign: 'right', fontWeight: '700', color: 'var(--danger, #ef4444)', fontSize: '15px' };
        }
        return { textAlign: 'right' };
      };
      column.type = 'numericColumn';
    } else if (renderRule === 'D' || fieldName.indexOf('ngay') >= 0 || fieldName.indexOf('date') >= 0) {
      column.valueFormatter = function (params) {
        if (params.node && params.node.rowPinned === 'bottom') return '';
        return params.value && typeof Utils !== 'undefined' && Utils.formatDate
          ? Utils.formatDate(params.value)
          : params.value;
      };
    } else {
      var origFormatter = column.valueFormatter;
      column.valueFormatter = function (params) {
        if (params.node && params.node.rowPinned === 'bottom') {
          return params.value || '';
        }
        return origFormatter ? origFormatter(params) : params.value;
      };
      column.cellStyle = function (params) {
        if (params.node && params.node.rowPinned === 'bottom') {
          return { fontWeight: '700', color: 'var(--text, #1e293b)', fontSize: '15px' };
        }
        return null;
      };
    }
    return column;
  }

  function _buildListColumnDefs(metadata) {
    var columns = _configuredFields(metadata).map(function (field) {
      return _applyMetadataFormat({
        field: field.name,
        headerName: field.label || field.name,
        minWidth: String(field.dataType || '').toLowerCase().indexOf('char') >= 0 ? 150 : 110
      }, field);
    });

    columns.push({
      headerName: (typeof t !== 'undefined' ? t('table.col.action') : 'Thao tác'),
      sortable: false,
      filter: false,
      floatingFilter: false,
      width: 150,
      cellRenderer: function (params) {
        if (params.node && params.node.rowPinned === 'bottom') {
          return '';
        }
        var o = params.data;
        var primaryKey = metadata && metadata.config && metadata.config.primaryKey;
        var rowId = primaryKey && o ? o[primaryKey] : '';
        var detailText = (typeof t !== 'undefined') ? t('btn.detail') : 'Chi tiết';
        var wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.gap = '6px';
        wrapper.style.alignItems = 'center';

        var detailButton = document.createElement('button');
        detailButton.className = 'btn btn-ghost btn-sm';
        detailButton.textContent = detailText;
        detailButton.onclick = function () { view(rowId); };

        var editButton = document.createElement('button');
        editButton.className = 'btn btn-outline btn-sm';
        editButton.title = 'Chỉnh sửa đơn hàng';
        editButton.style.padding = '2px 8px';
        editButton.style.height = '26px';
        editButton.style.fontSize = '12px';
        editButton.innerHTML = '<span class="material-symbols-outlined" style="font-size: 14px">edit</span><span>Sửa</span>';
        editButton.onclick = function () { edit(rowId); };

        var deleteButton = document.createElement('button');
        deleteButton.className = 'btn-icon';
        deleteButton.innerHTML = '<span class="material-symbols-outlined" style="font-size: calc(16px * var(--text-scale, 1));color:var(--danger)">delete</span>';
        deleteButton.onclick = function () { del(rowId); };

        wrapper.appendChild(detailButton);
        wrapper.appendChild(editButton);
        wrapper.appendChild(deleteButton);
        return wrapper;
      }
    });

    return columns;
  }

  function _parseNumeric(val) {
    if (val == null || val === '') return 0;
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    var cleanStr = String(val).replace(/,/g, '').trim();
    var num = parseFloat(cleanStr);
    return isNaN(num) ? 0 : num;
  }

  function _calculateSummaryRow(orders, metadata) {
    if (!Array.isArray(orders) || orders.length === 0) return [];
    
    var fields = _configuredFields(metadata);
    if (!fields || fields.length === 0) {
      fields = Object.keys(orders[0] || {}).map(function (key) {
        return { name: key, label: key };
      });
    }

    var firstFieldName = fields.length > 0 ? fields[0].name : 'DocumentID';
    var summaryRow = {};

    summaryRow[firstFieldName] = 'Σ';

    fields.forEach(function (field) {
      if (_isMoneyField(field)) {
        var sum = 0;
        orders.forEach(function (o) {
          if (o && o[field.name] != null) {
            sum += _parseNumeric(o[field.name]);
          }
        });
        summaryRow[field.name] = Math.round((sum + Number.EPSILON) * 100) / 100;
      }
    });

    return [summaryRow];
  }

  function render($el) {
    gridApi = null;
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

      _loadSubordinateCustomers().then(function () {
        _render();
      });
    });
  }

  async function _loadSubordinateCustomers() {
    try {
      var user = JSON.parse(localStorage.getItem('santino_user') || '{}');
      var role = user.role || user.Group || '';
      var empID = user.EmployeeID || '';
      var objID = user.ObjectID || '';
      if (objID && objID !== '') {
        empID = '';
      }

      const queryObj = {
        Loai: 'Customer',
        chinhanh: '',
        UserRole: role,
        UserEmployeeID: empID,
        UserObjectID: objID,
        Page: 1
      };

      const params = { q: JSON.stringify(queryObj), _t: Date.now() };
      const res = await Http.get(API_CONFIG.ENDPOINTS.CATEGORIES.LIST, params);
      const list = res.records || res;

      var select = document.getElementById('orders-filter-subordinate');
      var wrapper = document.getElementById('sub-customer-filter-wrapper');

      if (select && wrapper && Array.isArray(list) && list.length > 1) {
        select.innerHTML = '<option value="">-- Tất cả khách hàng --</option>';
        list.forEach(function (c) {
          var id = c.id || c.Id || '';
          var name = c.name || c.Name || '';
          var option = document.createElement('option');
          option.value = id;
          option.textContent = name + ' (' + id + ')';
          select.appendChild(option);
        });
        wrapper.style.display = 'block';
      } else if (wrapper) {
        wrapper.style.display = 'none';
      }
    } catch (e) {
      console.warn('Lỗi load danh sách khách hàng cấp dưới:', e);
    }
  }

  function _initGrid(orders, metadata, summaryData) {
    const container = document.getElementById('orders-grid-container');
    if (!container) return;

    const gridOptions = {
      pagination: false, // Dung pagination ngoai nhu cu
      columnDefs: _buildListColumnDefs(metadata),
      rowData: orders,
      pinnedBottomRowData: summaryData || []
    };

    gridApi = AppGrid.create(container, gridOptions);
  }

  async function _render() {
    var qInput = document.getElementById('orders-search');
    var fromInput = document.getElementById('orders-from');
    var toInput = document.getElementById('orders-to');
    var subSelect = document.getElementById('orders-filter-subordinate');

    var q = qInput ? qInput.value : '';
    var fromDate = fromInput ? fromInput.value : '';
    var toDate = toInput ? toInput.value : '';
    var subCustomerId = subSelect ? subSelect.value : '';

    var orders = [];
    var totalItems = 0;

    try {
      if (!orderMetadata) orderMetadata = await OrderService.getMetadata();
    } catch (metadataError) {
      console.warn('Không tải được metadata WEB_OrderFrm, dùng cấu hình cột dự phòng:', metadataError);
    }

    if (gridApi) {
      gridApi.showLoadingOverlay();
    }

    try {
      const queryObj = { Loai: 'Order' };
      const timKiemData = { page: currentPage, limit: itemsPerPage };
      if (q && q.trim()) timKiemData.q = q.trim();
      if (fromDate) timKiemData.from = fromDate;
      if (toDate) timKiemData.to = toDate;
      if (subCustomerId) timKiemData.customer_id = subCustomerId;

      queryObj.TimKiem = JSON.stringify(timKiemData);

      var user = JSON.parse(localStorage.getItem('santino_user') || '{}');
      var role = user.role || user.Group || '';
      var empID = user.EmployeeID || '';
      var objID = user.ObjectID || '';
      if (objID && objID !== '') {
        empID = '';
      }
      queryObj.chinhanh = '';
      queryObj.UserRole = role;
      queryObj.UserEmployeeID = empID;
      queryObj.UserObjectID = objID;
      queryObj.Page = currentPage;

      const params = {
        page: currentPage,
        limit: itemsPerPage,
        q: JSON.stringify(queryObj),
        _t: Date.now()
      };

      const res = orderMetadata
        ? await OrderService.getOrders({
          page: currentPage,
          limit: itemsPerPage,
          q: q,
          from: fromDate,
          to: toDate,
          customer_id: subCustomerId
        })
        : await Http.get(API_CONFIG.ENDPOINTS.CATEGORIES.LIST, params);
      orders = res.records || res;
      if (!Array.isArray(orders)) orders = [];

      totalItems = res._recordtotal || orders.length;
    } catch (err) {
      console.warn('Lỗi tải danh sách đơn hàng:', err);
    }

    var paginationContainer = document.getElementById('orders-pagination');
    if (paginationContainer) paginationContainer.innerHTML = '';

    var summaryData = _calculateSummaryRow(orders, orderMetadata);

    if (!gridApi) {
      _initGrid(orders, orderMetadata, summaryData);
    } else {
      gridApi.setGridOption('rowData', orders);
      gridApi.setGridOption('pinnedBottomRowData', summaryData);
      if (orders.length === 0) {
        gridApi.showNoRowsOverlay();
      } else {
        gridApi.hideOverlay();
      }
    }

    if (paginationContainer && totalItems > 0 && typeof Pagination !== 'undefined') {
      var pag = Pagination.create({
        totalItems: totalItems,
        itemsPerPage: itemsPerPage,
        currentPage: currentPage,
        onPageChange: function (page) {
          currentPage = page;
          _render();
        },
        onRefresh: function () {
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
          showToast(err.message || ('Lỗi khi gọi API xóa đơn hàng ' + id), 'error');
        }
      }
    });
  }
  function view(id) {
    window._viewOrderId = id;
    Router.go('/order-detail?id=' + id);
  }

  function edit(id) {
    if (!id) return;
    Router.go('/order?id=' + id);
  }

  return { render: render, filter: filter, del: del, view: view, edit: edit };
})();
