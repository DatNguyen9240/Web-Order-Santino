var SalesVoucherPage = (function () {
  var schemaFields = [];
  var voucherList = [];
  var orderRows = []; // Trực quan hóa chi tiết giỏ hàng [{ ItemID, ItemName, Size, MauSac, Quantity, UnitPrice, Discount, Amount }]
  var currentVoucher = null;
  var combos = {};
  var gridApi = null;
  var currentPage = 1;
  var itemsPerPage = 20;

  // Web Audio API Synth Beeps
  function playSynthBeep(type) {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.frequency.value = 950;
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'error') {
        osc.frequency.value = 320;
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      } else if (type === 'save') {
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
        setTimeout(function () {
          var ctx2 = new (window.AudioContext || window.webkitAudioContext)();
          var osc2 = ctx2.createOscillator();
          var gain2 = ctx2.createGain();
          osc2.connect(gain2);
          gain2.connect(ctx2.destination);
          osc2.frequency.value = 1100;
          gain2.gain.setValueAtTime(0.06, ctx2.currentTime);
          osc2.start();
          osc2.stop(ctx2.currentTime + 0.1);
        }, 80);
      }
    } catch (e) {
      console.warn('[SalesVoucherPage] Audio beep not allowed by browser:', e);
    }
  }

  // Load script/css động nếu chưa có trong bundle
  function _dynCss(src) {
    var id = 'dyn-css-' + src.split('/').pop().replace('.', '-');
    if (document.getElementById(id)) return;
    var el = document.createElement('link');
    el.id = id;
    el.rel = 'stylesheet';
    el.href = src + '?v=' + Date.now();
    document.head.appendChild(el);
  }

  // --- Render Page Entry ---
  function render($el) {
    schemaFields = [];
    voucherList = [];
    orderRows = [];
    currentVoucher = null;
    combos = {};
    gridApi = null;

    $el.classList.add('is-full-width');
    _dynCss('src/pages/sales-voucher/sales-voucher.css');

    return Router.fetchTemplate('src/pages/sales-voucher/sales-voucher.html').then(async function (html) {
      $el.innerHTML = html;
      await _init();
    });
  }

  // --- Initialize Page Logic ---
  async function _init() {
    if (window.LoadingSpinner) LoadingSpinner.show('Đang tải cấu hình CSDL...');
    try {
      // 1. Tải Metadata động cho Form từ SQL Database (WEB_OrderFrm)
      var rawFields = [];
      try {
        var resConfig = await Http.post('/API_LayCacTruongGiaoDien', { FormName: 'WEB_OrderFrm' });
        rawFields = Array.isArray(resConfig) ? resConfig : (resConfig && (resConfig.records || resConfig.list || resConfig.data)) || [];
      } catch (errConfig) {
        console.warn('[SalesVoucherPage] Failed to fetch dynamic fields configuration, using fallback:', errConfig);
      }

      // Fallback nếu API trống hoặc cấu hình rỗng
      if (!Array.isArray(rawFields) || rawFields.length === 0) {
        console.warn('[SalesVoucherPage] SQL config is empty. Using static fallback schema fields.');
        rawFields = [
          { name: 'DocumentID', label: 'Số CT', required: true, showInAdd: true, showInEdit: true, renderRule: 'text', isReadOnlyAdd: true },
          { name: 'DocumentDate', label: 'Ngày lập đơn', required: true, showInAdd: true, showInEdit: true, renderRule: 'date' },
          { name: 'BranchID', label: 'Chi nhánh', required: true, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_LayCacChiNhanh', dropdownType: 'dropselect' },
          { name: 'ObjectID', label: 'Khách hàng', required: true, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_LayCacKhachHang', dropdownType: 'dropselect' },
          { name: 'ObjectName', label: 'Tên khách hàng', required: false, showInAdd: true, showInEdit: true, renderRule: 'text' },
          { name: 'Memo', label: 'Diễn giải', required: false, showInAdd: true, showInEdit: true, renderRule: 'textarea' },
          { name: 'Notes', label: 'Ghi chú', required: false, showInAdd: true, showInEdit: true, renderRule: 'textarea' },
          { name: 'EmployeeID', label: 'Nhân viên bán hàng', required: true, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_LayCacNhanVien', dropdownType: 'dropselect' },
          { name: 'NguoiGiao', label: 'Người giao', required: false, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_DanhMuc?Loai=Employee', dropdownType: 'dropselect', dropdownValueColumn: 'EmployeeID', dropdownDisplayColumn: 'EmployeeName' },
          { name: 'PTGiaoHang', label: 'Phương thức giao', required: false, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_DanhMuc?Loai=DeliveryMethod', dropdownType: 'dropselect' },
          { name: 'NguonDon', label: 'Nguồn đơn', required: false, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_DanhMuc?Loai=Source', dropdownType: 'dropselect' },
          { name: 'MaDaiLy', label: 'Mã đại lý', required: false, showInAdd: true, showInEdit: true, renderRule: 'text' },
          { name: 'CTKM', label: 'Chương trình KM', required: false, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_DanhMuc?Loai=Promotion', dropdownType: 'dropselect' },
          { name: 'PaymentTypeID', label: 'Hình thức thanh toán', required: false, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_DanhMuc?Loai=PaymentType', dropdownType: 'dropselect' },
          { name: 'PaymentTermID', label: 'Điều khoản TT', required: false, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_DanhMuc?Loai=PaymentTerm', dropdownType: 'dropselect' },
          { name: 'NgayThanhToan', label: 'Ngày thanh toán', required: false, showInAdd: true, showInEdit: true, renderRule: 'date' }
        ];
      }

      if (Array.isArray(rawFields)) {
        schemaFields = rawFields.map(function (f) {
          f.required = (f.required === true || f.required === 1 || String(f.required) === '1' || String(f.required) === 'true');
          f.showInAdd = !(f.showInAdd === false || f.showInAdd === 0 || String(f.showInAdd) === '0' || String(f.showInAdd) === 'false');
          f.showInEdit = !(f.showInEdit === false || f.showInEdit === 0 || String(f.showInEdit) === '0' || String(f.showInEdit) === 'false');
          f.showInGrid = !(f.showInGrid === false || f.showInGrid === 0 || String(f.showInGrid) === '0' || String(f.showInGrid) === 'false');
          f.isReadOnlyEdit = (f.isReadOnlyEdit === true || f.isReadOnlyEdit === 1 || String(f.isReadOnlyEdit) === '1' || String(f.isReadOnlyEdit) === 'true');
          f.isReadOnlyAdd = (f.isReadOnlyAdd === true || f.isReadOnlyAdd === 1 || String(f.isReadOnlyAdd) === '1' || String(f.isReadOnlyAdd) === 'true');
          return f;
        });
      }

      // 2. Render form nhập liệu chung ĐỘNG
      _renderDynamicForm();

      // 3. Khởi tạo left list filters & AgGrid danh sách phiếu
      _initLeftGrid();
      await refreshList();

      // 4. Khởi tạo Autocomplete chọn nhanh sản phẩm (F3)
      _initProductDropdown();

      // 5. Khởi tạo dropdown Người giao & CTKM phụ trợ
      _initAuxiliaryDropdowns();

      // 6. Khởi tạo Tabs
      _initTabs();

      // 7. Gắn bộ quét Barcode và các phím tắt
      _setupBarcodeScan();
      _setupKeyboardShortcuts();

      // 8. Đặt form ở chế độ Thêm mới ban đầu
      resetForm();
      closeDetail();

    } catch (e) {
      console.error('[SalesVoucherPage] Lỗi khởi tạo:', e);
      showToast('Không thể tải cấu hình Dynamic Form: ' + e.message, 'error');
    } finally {
      if (window.LoadingSpinner) LoadingSpinner.hide();
    }
  }

  // --- Render form nhập liệu động ---
  function _renderDynamicForm() {
    var formContainer = document.getElementById('sales-dynamic-form');
    if (!formContainer) return;
    formContainer.innerHTML = '';

    // Lọc các trường được hiển thị
    var displayFields = schemaFields.filter(f => f.showInAdd || f.showInEdit);

    displayFields.forEach(function (f) {
      // Bỏ qua các trường tính toán hệ thống ở cột tổng hợp hoặc xử lý riêng biệt trong Stats Card
      if (['BaseTotal', 'KhachDua', 'TraLai', 'UserCreate', 'DateCreate', 'isLock', 'isBanSi'].indexOf(f.name) !== -1) {
        return;
      }

      var isTextarea = f.renderRule === 'textarea' || f.name === 'Memo' || f.name === 'Notes';
      var spanClass = 'form-group';
      if (f.name === 'Memo') {
        spanClass = 'form-group span3';
      } else if (f.name === 'Notes') {
        spanClass = 'form-group span2';
      } else if (f.name === 'ObjectName') {
        spanClass = 'form-group span1';
      } else if (f.renderRule === 'textarea') {
        spanClass = 'form-group span2';
      }
      var group = document.createElement('div');
      group.className = spanClass;

      var label = document.createElement('label');
      label.textContent = f.label;
      if (f.required) {
        var req = document.createElement('span');
        req.innerText = ' *';
        req.style.color = 'var(--danger)';
        label.appendChild(req);
      }
      group.appendChild(label);

      // Tự động gán dataSource chuẩn cho các trường danh mục nếu chưa có
      if (!f.dataSource || f.renderRule === 'text') {
        if (['NguoiGiao', 'DeliveryPerson', 'Deliverer'].indexOf(f.name) !== -1) {
          f.dataSource = '/API_DanhMuc?Loai=Employee';
          f.dropdownType = 'dropselect';
          f.dropdownValueColumn = 'EmployeeID';
          f.dropdownDisplayColumn = 'EmployeeName';
          f.renderRule = 'dropselect';
        } else if (['PTGiaoHang', 'DeliveryMethod'].indexOf(f.name) !== -1) {
          f.dataSource = '/API_DanhMuc?Loai=DeliveryMethod';
          f.dropdownType = 'dropselect';
          f.renderRule = 'dropselect';
        } else if (['NguonDon', 'OrderSource'].indexOf(f.name) !== -1) {
          f.dataSource = '/API_DanhMuc?Loai=Source';
          f.dropdownType = 'dropselect';
          f.renderRule = 'dropselect';
        } else if (['PaymentTermID', 'DieuKhoanTT'].indexOf(f.name) !== -1) {
          f.dataSource = '/API_DanhMuc?Loai=PaymentTerm';
          f.dropdownType = 'dropselect';
          f.renderRule = 'dropselect';
        }
      }

      var hasDataSource = f.dataSource && f.dataSource.length > 0;
      var dsType = (f.dropdownType || '').toLowerCase().trim();
      var isDynamicLookup = hasDataSource && (dsType === 'dropselect' || dsType === 'dropdown' || dsType === 'combo' || f.dataSource.startsWith('/'));

      if (isDynamicLookup) {
        // Cần khởi tạo DataComboBox động từ CSDL
        var comboId = 'field-' + f.name;
        var comboContainer = UIControls.createDataComboBox({
          id: comboId,
          placeholder: '-- Chọn ' + f.label + ' --',
          readOnly: true,
          headers: ['Mã', 'Tên hiển thị'],
          colHighlightIndex: 1,
          enablePagination: true,
          onSearch: async function (q, page) {
            try {
              var endpoint = f.dataSource;
              var params = { page: page || 1, limit: 100, _t: Date.now() };

              var queryObj = {};
              if (endpoint.includes('?')) {
                var parts = endpoint.split('?');
                endpoint = parts[0];
                var sp = new URLSearchParams(parts[1]);
                sp.forEach((v, k) => { queryObj[k] = v; });
              }
              if (q) {
                queryObj.TimKiem = q;
              }

              var user = JSON.parse(localStorage.getItem('santino_user') || '{}');
              queryObj.UserRole = user.role || user.Group || '';
              queryObj.UserEmployeeID = user.EmployeeID || '';
              queryObj.UserObjectID = user.ObjectID || '';

              params.q = JSON.stringify(queryObj);
              var res = await Http.get(endpoint, params);
              var records = extractList(res);
              if (records.length === 0 && (queryObj.Loai === 'Employee' || endpoint.includes('Loai=Employee'))) {
                queryObj.Loai = 'SalesPerson';
                params.q = JSON.stringify(queryObj);
                res = await Http.get(endpoint, params);
                records = extractList(res);
              }

              return records.map(function (r) {
                var val = r[f.dropdownValueColumn || 'id'] || r.id || r.ObjectID || r.BranchID || r.EmployeeID || r.PaymentTermID || r.PaymentTypeID || r.Code || '';
                var lbl = r[f.dropdownDisplayColumn || 'name'] || r.name || r.ObjectName || r.BranchName || r.EmployeeName || r.PaymentTermName || r.PaymentTypeName || r.FullName || r.Ten || val;
                return [val, lbl, r];
              });
            } catch (err) {
              console.warn('Lỗi tải danh mục ' + f.name + ':', err);
              return [];
            }
          },
          onSelect: function (row) {
            var input = document.getElementById(comboId);
            if (input) {
              input.value = row[0];
              input.dispatchEvent(new Event('change'));
            }
            // Trigger auto-fill nếu chọn khách hàng
            if (f.name === 'ObjectID') {
              var custNameInput = document.getElementById('field-ObjectName');
              if (custNameInput) custNameInput.value = row[1];
            }
          }
        });

        var inner = comboContainer.querySelector('input');
        if (inner) {
          inner.name = f.name;
          inner.id = comboId;
        }
        group.appendChild(comboContainer);
        combos[f.name] = comboContainer;
      } else {
        // Render ô nhập chuẩn thông thường
        var input = document.createElement(isTextarea ? 'textarea' : 'input');
        input.className = 'ui-input';
        input.id = 'field-' + f.name;
        input.name = f.name;

        if (f.dataType === 'datetime' || f.renderRule === 'D') {
          input.type = 'date';
        } else if (f.dataType === 'int' || f.dataType === 'decimal') {
          input.type = 'number';
        } else if (!isTextarea) {
          input.type = 'text';
        }

        if (f.isReadOnlyAdd) {
          input.readOnly = true;
          input.style.background = 'var(--surface)';
          input.style.cursor = 'not-allowed';
        }

        group.appendChild(input);
      }

      formContainer.appendChild(group);
    });
  }

  // --- Cập nhật cột AgGrid theo độ rộng màn hình (Responsive) ---
  var currentGridMode = null;
  function updateGridColumns() {
    if (!gridApi) return;
    var isMobile = window.innerWidth <= 768;
    var newMode = isMobile ? 'mobile' : 'desktop';
    if (currentGridMode === newMode) return;
    currentGridMode = newMode;

    var newDefs = [];
    if (isMobile) {
      newDefs = [
        {
          headerName: 'Phiếu',
          flex: 1,
          minWidth: 150,
          cellRenderer: function (params) {
            var soCt = params.data.so_ct || params.data.DocumentID || '';
            var khTen = params.data.kh_ten || params.data.ObjectName || 'Khách vãng lai';
            return `<div style="line-height: 1.3; padding: 2px 0; overflow: hidden;">
                      <div style="font-weight: 700; color: var(--text); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${soCt}</div>
                      <div style="font-size: 10.5px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px;">${khTen}</div>
                    </div>`;
          }
        },
        {
          headerName: 'Tiền & Ngày',
          width: 110,
          cellRenderer: function (params) {
            var amount = Utils.formatMoney(params.data.total_money || params.data.BaseTotal || 0);
            var date = params.data.ngay_ct || params.data.DocumentDate || '';
            var dateStr = date ? date.split(' ')[0] : '';
            if (dateStr) {
              var parts = dateStr.split('-');
              if (parts.length >= 3) dateStr = parts[2] + '/' + parts[1] + '/' + parts[0].substring(2);
            }
            return `<div style="line-height: 1.3; padding: 2px 0; text-align: right; overflow: hidden;">
                      <div style="font-weight: 700; color: var(--primary, #f59e0b); font-size: 12px; white-space: nowrap;">${amount}</div>
                      <div style="font-size: 10px; color: var(--muted); margin-top: 1px; white-space: nowrap;">${dateStr}</div>
                    </div>`;
          }
        }
      ];
    } else {
      newDefs = [
        { field: 'so_ct', headerName: 'Số CT', cellStyle: { fontWeight: '700' }, width: 140, minWidth: 120 },
        { field: 'ngay_ct', headerName: 'Ngày CT', width: 110, valueFormatter: params => params.value ? params.value.split(' ')[0] : '' },
        { field: 'kh_ten', headerName: 'Khách hàng', minWidth: 180, flex: 1 },
        {
          field: 'total_money',
          headerName: 'Tổng tiền',
          width: 120,
          cellStyle: { color: 'var(--primary)', fontWeight: '700', textAlign: 'right' },
          valueFormatter: params => Utils.formatMoney(params.value || 0)
        },
        {
          field: 'isLock',
          headerName: 'Trạng thái',
          width: 110,
          cellRenderer: function (params) {
            var isLocked = params.value === 1 || params.value === true || String(params.value) === '1' || String(params.value) === 'true';
            var txt = isLocked ? 'Hoàn thành' : 'Đang xử lý';
            var type = isLocked ? 'success' : 'primary';
            return '<span class="status-badge ' + type + '">' + txt + '</span>';
          }
        }
      ];
    }
    gridApi.setColumnDefs(newDefs);
    setTimeout(function () {
      if (gridApi) gridApi.sizeColumnsToFit();
    }, 50);
  }

  // --- Khởi tạo AgGrid danh sách phiếu bên trái ---
  function _initLeftGrid() {
    var container = document.getElementById('sales-grid-container');
    if (!container) return;

    var gridOptions = {
      pagination: false,
      columnDefs: [], // Sẽ được gán thông qua updateGridColumns
      rowData: [],
      onRowClicked: function (params) {
        if (params.data && params.data.id) {
          selectVoucher(params.data.id);
        }
      }
    };

    gridApi = AppGrid.create(container, gridOptions);
    updateGridColumns();

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateGridColumns, 200);
    });
  }

  // --- Tải lại danh sách phiếu bán ---
  async function refreshList() {
    if (gridApi) gridApi.showLoadingOverlay();

    var searchEl = document.getElementById('sales-search');
    var dateEl = document.getElementById('sales-filter-date');

    var q = searchEl ? searchEl.value : '';
    var dateVal = dateEl ? dateEl.value : '';

    try {
      var params = {
        page: currentPage,
        limit: itemsPerPage
      };

      var queryObj = { Loai: 'Order' };
      var timKiemData = { page: currentPage, limit: itemsPerPage };
      if (q && q.trim()) timKiemData.q = q.trim();
      if (dateVal) timKiemData.date = dateVal;
      queryObj.TimKiem = JSON.stringify(timKiemData);

      var user = JSON.parse(localStorage.getItem('santino_user') || '{}');
      queryObj.UserRole = user.role || user.Group || '';
      queryObj.UserEmployeeID = user.ObjectID ? '' : (user.EmployeeID || '');
      queryObj.UserObjectID = user.ObjectID || '';

      params.q = JSON.stringify(queryObj);
      params._t = Date.now();

      var res = await Http.get(API_CONFIG.ENDPOINTS.CATEGORIES.LIST, params);
      var records = res.records || res || [];
      if (!Array.isArray(records)) records = [];

      voucherList = records;

      if (gridApi) {
        gridApi.setGridOption('rowData', voucherList);
        if (voucherList.length === 0) {
          gridApi.showNoRowsOverlay();
        } else {
          gridApi.hideOverlay();
        }
      }

      // Phân trang
      var pagContainer = document.getElementById('sales-pagination');
      if (pagContainer) {
        pagContainer.innerHTML = '';
        var totalCount = res._recordtotal || voucherList.length;
        if (totalCount > 0 && typeof Pagination !== 'undefined') {
          var pag = Pagination.create({
            totalItems: totalCount,
            itemsPerPage: itemsPerPage,
            currentPage: currentPage,
            onPageChange: function (page) {
              currentPage = page;
              refreshList();
            },
            onRefresh: function () {
              refreshList();
            }
          });
          pagContainer.appendChild(pag);
        }
      }

    } catch (e) {
      console.warn('Lỗi tải danh sách phiếu bán:', e);
      if (gridApi) gridApi.showNoRowsOverlay();
    }
  }

  var filterTimer = null;
  function onFilterChange() {
    if (filterTimer) clearTimeout(filterTimer);
    filterTimer = setTimeout(function () {
      currentPage = 1;
      refreshList();
    }, 400);
  }

  // --- Khởi tạo Autocomplete Chọn nhanh sản phẩm (F3) ---
  function _initProductDropdown() {
    var container = document.getElementById('quick-product-dropdown-container');
    if (!container) return;

    var combo = UIControls.createDataComboBox({
      id: 'quick-product-select',
      placeholder: '-- Nhập tên hoặc mã sản phẩm (F3) --',
      readOnly: true,
      headers: ['Mã hàng', 'Tên hàng / Dịch vụ', 'Đơn giá'],
      colHighlightIndex: 1,
      enablePagination: true,
      onSearch: async function (q, page) {
        try {
          var res = await ProductService.getProducts(q);
          if (!Array.isArray(res)) return [];
          return res.map(function (item) {
            var price = item.don_gia || item.UnitPrice || item.DonGia || 0;
            return [
              item.ItemID || item.ItemID2 || item.id || '',
              item.ItemName || item.Name || item.ten_hang_hoa || '',
              Utils.formatMoney(price),
              item
            ];
          });
        } catch (e) {
          return [];
        }
      },
      onSelect: function (row) {
        var rawProd = row[3];
        if (rawProd) {
          var qtyInput = document.getElementById('quick-qty');
          var qtyVal = qtyInput ? parseFloat(qtyInput.value) || 1 : 1;

          addDetailRow({
            ItemID: rawProd.ItemID || rawProd.ItemID2 || rawProd.id || '',
            ItemName: rawProd.ItemName || rawProd.Name || rawProd.ten_hang_hoa || '',
            Size: 'M', // Mặc định size
            MauSac: 'Trắng', // Mặc định màu
            Quantity: qtyVal,
            UnitPrice: rawProd.don_gia || rawProd.UnitPrice || rawProd.DonGia || 0,
            Discount: 0
          });

          // Reset lại dropdown và số lượng
          if (qtyInput) qtyInput.value = 1;
          var innerInput = combo.querySelector('input');
          if (innerInput) innerInput.value = '';
          playSynthBeep('success');
        }
      }
    });

    container.appendChild(combo);
    combos['quick-product'] = combo;
  }

  // --- Khởi tạo các Dropdown phụ trợ ---
  function _initAuxiliaryDropdowns() {
    // 1. Dropdown Người giao hàng
    var deliveryContainer = document.getElementById('quick-delivery-container');
    if (deliveryContainer) {
      var dCombo = UIControls.createDataComboBox({
        id: 'quick-delivery-select',
        placeholder: '-- Người giao --',
        readOnly: true,
        headers: ['Mã', 'Tên nhân viên'],
        colHighlightIndex: 1,
        onSearch: async function (q, page) {
          var res = await Http.get('/API_DanhMuc', { q: JSON.stringify({ Loai: 'SalesPerson', TimKiem: q }) });
          var list = res.records || res || [];
          return list.map(item => [item.EmployeeID || item.id, item.EmployeeName || item.name, item]);
        },
        onSelect: function (row) {
          var input = deliveryContainer.querySelector('input');
          if (input) input.value = row[0];
        }
      });
      deliveryContainer.appendChild(dCombo);
    }

    // 2. Dropdown loại thanh toán của thẻ Metric Card "Loại thu"
    var paymentTypeContainer = document.getElementById('card-select-payment-type');
    if (paymentTypeContainer) {
      var pCombo = UIControls.createDataComboBox({
        id: 'card-payment-type-select',
        placeholder: '-- Chọn loại --',
        readOnly: true,
        headers: ['Mã', 'Hình thức thanh toán'],
        colHighlightIndex: 1,
        onSearch: async function (q, page) {
          var res = await Http.get('/API_DanhMuc', { q: JSON.stringify({ Loai: 'PaymentType', TimKiem: q }) });
          var list = res.records || res || [];
          return list.map(item => [item.PaymentTypeID || item.id, item.PaymentTypeName || item.name]);
        },
        onSelect: function (row) {
          var input = paymentTypeContainer.querySelector('input');
          if (input) input.value = row[0];
        }
      });
      paymentTypeContainer.appendChild(pCombo);
      combos['PaymentType'] = pCombo;
    }

    // 3. Dropdown Chương trình Khuyến mãi ở chân bảng
    var promoContainer = document.getElementById('promo-combobox-container');
    if (promoContainer) {
      var prCombo = UIControls.createDataComboBox({
        id: 'sales-promo-select',
        placeholder: '-- Chọn CTKM --',
        readOnly: true,
        headers: ['Mã KM', 'Tên chương trình'],
        colHighlightIndex: 1,
        onSearch: async function (q, page) {
          var res = await Http.get('/API_DanhMuc', { q: JSON.stringify({ Loai: 'Promotion', TimKiem: q }) });
          var list = res.records || res || [];
          return list.map(item => [item.CTKM || item.id, item.TenCTKM || item.name, item]);
        },
        onSelect: function (row) {
          var input = promoContainer.querySelector('input');
          if (input) input.value = row[0];

          var promo = row[2];
          if (promo && promo.ChietKhau) {
            var discInput = document.getElementById('promo-discount-pct');
            if (discInput) {
              discInput.value = promo.ChietKhau;
              recalculateTotals();
            }
          }
        }
      });
      promoContainer.appendChild(prCombo);
    }
  }

  // --- Khởi tạo Tabs ---
  function _initTabs() {
    var tabsContainer = document.getElementById('sales-tabs-container');
    if (!tabsContainer) return;

    var tabs = UITabs.create([
      { id: 'goods', title: 'Chi tiết hàng hóa', content: document.getElementById('tab-content-goods') },
      { id: 'sales-points', title: 'Doanh số & điểm', content: document.getElementById('tab-content-sales-points') },
      { id: 'history-zns', title: 'Lịch sử / Zalo ZNS', content: document.getElementById('tab-content-history-zns') },
      { id: 'vat-info', title: 'Thông tin xuất hóa đơn', content: document.getElementById('tab-content-vat-info') }
    ]);

    tabsContainer.appendChild(tabs);
  }

  // --- Thêm dòng hàng vào bảng chi tiết ---
  function addDetailRow(row) {
    // Kiểm tra trùng mã hàng để tăng số lượng lên thay vì thêm dòng mới
    var existing = orderRows.find(r => r.ItemID === row.ItemID && r.Size === row.Size && r.MauSac === row.MauSac);
    if (existing) {
      existing.Quantity += row.Quantity;
      existing.Amount = existing.Quantity * existing.UnitPrice * (1 - existing.Discount / 100);
    } else {
      row.Discount = row.Discount || 0;
      row.Amount = row.Quantity * row.UnitPrice * (1 - row.Discount / 100);
      orderRows.push(row);
    }

    _renderDetailsTable();
    recalculateTotals();
  }

  // --- Vẽ lại bảng chi tiết sản phẩm ---
  function _renderDetailsTable() {
    var tbody = document.getElementById('sales-goods-tbody');
    if (!tbody) return;

    if (orderRows.length === 0) {
      tbody.innerHTML = '<tr><td colspan="10" class="text-center" style="padding: 24px; color: var(--muted);">Chưa có sản phẩm nào trong phiếu. Quét barcode hoặc thêm nhanh ở trên.</td></tr>';
      return;
    }

    tbody.innerHTML = '';
    orderRows.forEach(function (row, index) {
      var tr = document.createElement('tr');
      tr.dataset.index = index;

      tr.innerHTML = `
        <td class="text-center" style="font-weight:600; color:var(--text-secondary);">${index + 1}</td>
        <td style="font-weight:700;">${row.ItemID}</td>
        <td>${row.ItemName}</td>
        <td><input type="text" class="tbl-input" style="width:50px;" value="${row.Size || ''}" onchange="SalesVoucherPage.updateRowField(${index}, 'Size', this.value)"></td>
        <td><input type="text" class="tbl-input" style="width:70px;" value="${row.MauSac || ''}" onchange="SalesVoucherPage.updateRowField(${index}, 'MauSac', this.value)"></td>
        <td><input type="number" class="tbl-input" style="width:70px;" value="${row.Quantity}" min="0.1" step="any" oninput="SalesVoucherPage.updateRowField(${index}, 'Quantity', this.value)"></td>
        <td><input type="number" class="tbl-input" style="width:100px; text-align:right;" value="${row.UnitPrice}" min="0" oninput="SalesVoucherPage.updateRowField(${index}, 'UnitPrice', this.value)"></td>
        <td><input type="number" class="tbl-input" style="width:60px;" value="${row.Discount}" min="0" max="100" oninput="SalesVoucherPage.updateRowField(${index}, 'Discount', this.value)"></td>
        <td style="text-align:right; font-weight:700; color:var(--text);" id="row-amount-${index}">${Utils.formatMoney(row.Amount)}</td>
        <td class="text-center">
          <button class="btn-icon" onclick="SalesVoucherPage.deleteRow(${index})" title="Xóa dòng này">
            <span class="material-symbols-outlined" style="color:var(--danger); font-size: 18px;">delete</span>
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });
  }

  // --- Cập nhật trường dữ liệu trên dòng hàng chi tiết ---
  function updateRowField(index, field, value) {
    var r = orderRows[index];
    if (!r) return;

    if (field === 'Quantity' || field === 'UnitPrice' || field === 'Discount') {
      var num = parseFloat(value) || 0;
      r[field] = num;
      r.Amount = r.Quantity * r.UnitPrice * (1 - r.Discount / 100);

      var cellAmount = document.getElementById('row-amount-' + index);
      if (cellAmount) cellAmount.textContent = Utils.formatMoney(r.Amount);

      recalculateTotals();
    } else {
      r[field] = value;
    }
  }

  // --- Xóa dòng hàng chi tiết ---
  function deleteRow(index) {
    orderRows.splice(index, 1);
    _renderDetailsTable();
    recalculateTotals();
    playSynthBeep('success');
  }

  // --- Tính toán tổng tiền, thối lại, tổng số lượng ---
  function recalculateTotals() {
    var totalQty = 0;
    var rawTotal = 0;

    orderRows.forEach(function (row) {
      totalQty += parseFloat(row.Quantity) || 0;
      rawTotal += parseFloat(row.Amount) || 0;
    });

    // Áp dụng chiết khấu tổng đơn nếu có
    var pctInput = document.getElementById('promo-discount-pct');
    var discPct = pctInput ? parseFloat(pctInput.value) || 0 : 0;
    var finalTotal = rawTotal * (1 - discPct / 100);

    // Cập nhật lên UI
    var lblTotalQty = document.getElementById('sales-detail-total-qty');
    var lblTotalMoney = document.getElementById('sales-detail-total-money');
    var cardTotalMoney = document.getElementById('card-total-money');

    if (lblTotalQty) lblTotalQty.textContent = totalQty;
    if (lblTotalMoney) lblTotalMoney.textContent = Utils.formatMoney(finalTotal);
    if (cardTotalMoney) cardTotalMoney.textContent = Utils.formatMoney(finalTotal);

    calcChangeMoney();
  }

  // --- Tính toán tiền thừa trả khách ---
  function calcChangeMoney() {
    var cardTotalMoney = document.getElementById('card-total-money');
    var totalVal = cardTotalMoney ? Utils.parseMoney(cardTotalMoney.textContent) : 0;

    var inputRec = document.getElementById('card-input-received');
    var recMoney = inputRec ? Utils.parseMoney(inputRec.value) : 0;

    var changeVal = recMoney - totalVal;
    if (changeVal < 0) changeVal = 0;

    var cardChange = document.getElementById('card-change-money');
    if (cardChange) cardChange.textContent = Utils.formatMoney(changeVal);
  }

  // --- Xem chi tiết hóa đơn khi chọn từ danh sách trái ---
  async function selectVoucher(id) {
    openDetail();
    if (window.LoadingSpinner) LoadingSpinner.show('Đang tải chi tiết phiếu...');
    try {
      var res = await OrderService.getOrderDetail(id);
      if (!res) throw new Error('Không tìm thấy thông tin phiếu');

      currentVoucher = res;

      // 1. Điền thông tin vào form động
      schemaFields.forEach(function (f) {
        var input = document.getElementById('field-' + f.name);
        if (input) {
          var val = res[f.name];
          if (f.dataType === 'datetime' || f.renderRule === 'D') {
            input.value = val ? val.split('T')[0] : '';
          } else if (input.type === 'checkbox') {
            input.checked = val === 1 || val === true || String(val) === '1' || String(val) === 'true';
          } else {
            input.value = val !== undefined && val !== null ? String(val) : '';
          }
          input.dispatchEvent(new Event('change'));
        }
      });

      // 2. Điền thông tin vào Stats Cards
      var cardTotal = document.getElementById('card-total-money');
      var cardReceived = document.getElementById('card-input-received');
      var cardChange = document.getElementById('card-change-money');
      var cardCreator = document.getElementById('card-creator');

      if (cardTotal) cardTotal.textContent = Utils.formatMoney(res.BaseTotal || 0);
      if (cardReceived) cardReceived.value = Utils.formatMoney(res.KhachDua || 0);
      if (cardChange) cardChange.textContent = Utils.formatMoney(res.TraLai || 0);
      if (cardCreator) cardCreator.textContent = res.UserCreate || 'Admin';

      // Load PaymentType nếu có
      if (combos['PaymentType']) {
        var pInput = combos['PaymentType'].querySelector('input');
        if (pInput) {
          pInput.value = res.PaymentTypeID || '';
          pInput.dispatchEvent(new Event('change'));
        }
      }

      // 3. Load chi tiết hàng hóa
      var lines = Array.isArray(res.lines) ? res.lines : (Array.isArray(res.ChiTietDonHang) ? res.ChiTietDonHang : []);
      orderRows = lines.map(function (l) {
        return {
          ItemID: l.ma_hang || l.ItemID || '',
          ItemName: l.ten_hang || l.ItemName || '',
          Size: l.size || l.Size || 'M',
          MauSac: l.mau_sac || l.MauSac || 'Trắng',
          Quantity: parseFloat(l.so_luong || l.Quantity || 0),
          UnitPrice: parseFloat(l.don_gia || l.UnitPrice || 0),
          Discount: parseFloat(l.chiet_khau || l.ChietKhau || 0),
          Amount: parseFloat(l.thanh_tien || l.Amount || 0)
        };
      });

      _renderDetailsTable();
      recalculateTotals();
      playSynthBeep('success');

      // Đổi tiêu đề cột chi tiết
      var hTitle = document.getElementById('sales-detail-title');
      var hSub = document.getElementById('sales-detail-subtitle');
      if (hTitle) hTitle.textContent = 'Phiếu: ' + res.DocumentID;
      if (hSub) hSub.textContent = 'Khởi tạo lúc: ' + (res.DateCreate ? res.DateCreate.replace('T', ' ').split('.')[0] : '');

    } catch (e) {
      console.warn(e);
      showToast('Lỗi xem chi tiết phiếu: ' + e.message, 'error');
    } finally {
      if (window.LoadingSpinner) LoadingSpinner.hide();
    }
  }

  // --- Khởi tạo chế độ Thêm mới phiếu ---
  function resetForm() {
    currentVoucher = null;
    orderRows = [];
    _renderDetailsTable();

    // Reset các trường trên Form
    schemaFields.forEach(function (f) {
      var input = document.getElementById('field-' + f.name);
      if (input) {
        if (input.type === 'date') {
          input.value = Utils.today();
        } else if (input.type === 'checkbox') {
          input.checked = false;
        } else {
          input.value = '';
        }
        input.dispatchEvent(new Event('change'));
      }
    });

    // Điền Số chứng từ tự động
    var docInput = document.getElementById('field-DocumentID');
    if (docInput) {
      docInput.value = Utils.genOrderNo();
    }

    // Reset Stats Card
    var cardTotal = document.getElementById('card-total-money');
    var cardReceived = document.getElementById('card-input-received');
    var cardChange = document.getElementById('card-change-money');
    var cardCreator = document.getElementById('card-creator');

    if (cardTotal) cardTotal.textContent = '0đ';
    if (cardReceived) cardReceived.value = '0';
    if (cardChange) cardChange.textContent = '0đ';
    if (cardCreator) {
      var u = JSON.parse(localStorage.getItem('santino_user') || '{}');
      cardCreator.textContent = u.Username || 'Admin';
    }

    // Đổi tiêu đề cột chi tiết
    var hTitle = document.getElementById('sales-detail-title');
    var hSub = document.getElementById('sales-detail-subtitle');
    if (hTitle) hTitle.textContent = 'Phiếu bán hàng mới';
    if (hSub) hSub.textContent = 'Nhập thông tin phiếu và thêm sản phẩm';

    playSynthBeep('success');
  }

  // --- Lưu Hóa Đơn ---
  async function saveVoucher() {
    if (orderRows.length === 0) {
      showToast(t('toast.empty_lines') || 'Chưa có sản phẩm trong phiếu bán!', 'error');
      playSynthBeep('error');
      return;
    }

    // Thu thập dữ liệu form động
    var payload = {};
    var isValid = true;

    schemaFields.forEach(function (f) {
      if (!isValid) return;
      var input = document.getElementById('field-' + f.name);
      if (input) {
        var val = input.value;
        if (input.type === 'checkbox') {
          payload[f.name] = input.checked ? 1 : 0;
        } else {
          payload[f.name] = val;
        }

        if (f.required && !val && val !== 0) {
          showToast('Vui lòng điền trường bắt buộc: ' + f.label, 'error');
          input.focus();
          isValid = false;
          playSynthBeep('error');
        }
      }
    });

    if (!isValid) return;

    // Thu thập dữ liệu Stats & payment
    var cardTotal = document.getElementById('card-total-money');
    payload.BaseTotal = cardTotal ? Utils.parseMoney(cardTotal.textContent) : 0;

    var cardReceived = document.getElementById('card-input-received');
    payload.KhachDua = cardReceived ? Utils.parseMoney(cardReceived.value) : 0;

    var cardChange = document.getElementById('card-change-money');
    payload.TraLai = cardChange ? Utils.parseMoney(cardChange.textContent) : 0;

    var user = JSON.parse(localStorage.getItem('santino_user') || '{}');
    payload.UserCreate = user.Username || 'Admin';
    payload.isBanSi = 1;

    if (combos['PaymentType']) {
      var ptInput = combos['PaymentType'].querySelector('input');
      payload.PaymentTypeID = ptInput ? ptInput.value : '';
    }

    // Chi tiết sản phẩm
    payload.lines = orderRows.map(function (row, index) {
      return {
        STT: index + 1,
        ItemID: row.ItemID,
        ItemName: row.ItemName,
        Size: row.Size,
        MauSac: row.MauSac,
        Quantity: row.Quantity,
        UnitPrice: row.UnitPrice,
        Amount: row.Amount,
        TotalAmount: row.Amount
      };
    });

    if (window.LoadingSpinner) LoadingSpinner.show('Đang lưu phiếu bán hàng...');
    try {
      var isEdit = !!currentVoucher;
      var res = isEdit ? await OrderService.updateOrder(payload) : await OrderService.createOrder(payload);

      // Xử lý kiểm tra kết quả lưu
      var success = false;
      var msg = isEdit ? 'Không thể cập nhật phiếu bán hàng' : 'Không thể lưu phiếu bán hàng mới';

      if (Array.isArray(res) && res.length > 0) {
        success = (res[0].Success == '1' || res[0].Success === 1);
        msg = res[0].Message || msg;
      } else if (res && typeof res === 'object') {
        if (res.Success == '1' || res.Success === 1 || res.code === 0) success = true;
        msg = res.Message || (success ? 'Đã lưu phiếu bán hàng thành công' : msg);
      }

      if (success) {
        showToast(msg);
        playSynthBeep('save');
        resetForm();
        refreshList();
      } else {
        showToast(msg, 'error');
        playSynthBeep('error');
      }

    } catch (e) {
      console.warn(e);
      showToast('Lỗi lưu CSDL: ' + e.message, 'error');
      playSynthBeep('error');
    } finally {
      if (window.LoadingSpinner) LoadingSpinner.hide();
    }
  }

  // --- Quét Barcode tự động ---
  var barcodeBuffer = '';
  var barcodeTimer = null;
  function _setupBarcodeScan() {
    document.addEventListener('keypress', function (e) {
      // Bỏ qua nếu người dùng đang gõ vào các ô nhập liệu thông thường như diễn giải, ghi chú
      var activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'TEXTAREA' || (activeEl.tagName === 'INPUT' && activeEl.id !== 'quick-barcode'))) {
        return;
      }

      if (barcodeTimer) clearTimeout(barcodeTimer);

      // Máy quét barcode gõ rất nhanh. Nếu thời gian giữa các phím nhấn < 30ms, ta gộp lại thành chuỗi barcode
      if (e.key === 'Enter') {
        if (barcodeBuffer.length >= 3) {
          e.preventDefault();
          _handleBarcode(barcodeBuffer.trim());
          barcodeBuffer = '';
        }
      } else {
        barcodeBuffer += e.key;
        barcodeTimer = setTimeout(function () {
          barcodeBuffer = ''; // Reset nếu gõ tay quá chậm (> 100ms)
        }, 100);
      }
    });

    var bInput = document.getElementById('quick-barcode');
    if (bInput) {
      bInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          _handleBarcode(this.value.trim());
          this.value = '';
        }
      });
    }
  }

  // Xử lý mã vạch nhận được
  async function _handleBarcode(barcode) {
    if (!barcode) return;
    if (window.LoadingSpinner) LoadingSpinner.show('Đang quét barcode...');
    try {
      // Tìm sản phẩm có mã hàng hoặc barcode tương ứng
      var res = await ProductService.getProducts(barcode);
      var product = Array.isArray(res) && res.length > 0 ? res[0] : null;

      if (product) {
        addDetailRow({
          ItemID: product.ItemID || product.ItemID2 || product.id || '',
          ItemName: product.ItemName || product.Name || product.ten_hang_hoa || '',
          Size: 'M',
          MauSac: 'Trắng',
          Quantity: 1,
          UnitPrice: product.don_gia || product.UnitPrice || product.DonGia || 0,
          Discount: 0
        });
        showToast('Đã quét: ' + (product.ItemName || product.Name));
        playSynthBeep('success');
      } else {
        showToast('Không tìm thấy sản phẩm cho mã: ' + barcode, 'error');
        playSynthBeep('error');
      }
    } catch (e) {
      console.warn(e);
      playSynthBeep('error');
    } finally {
      if (window.LoadingSpinner) LoadingSpinner.hide();
    }
  }

  // --- Lắng nghe Phím Tắt (F2, F3, F6, F7, F8) ---
  function _setupKeyboardShortcuts() {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'F2') {
        e.preventDefault();
        resetForm();
        openDetail();
      } else if (e.key === 'F3') {
        e.preventDefault();
        var pComboInput = document.querySelector('#quick-product-select');
        if (pComboInput) pComboInput.focus();
      } else if (e.key === 'F4') {
        e.preventDefault();
        showAddProductModal();
      } else if (e.key === 'F6') {
        e.preventDefault();
        saveVoucher();
      } else if (e.key === 'F7') {
        e.preventDefault();
        printInvoice();
      } else if (e.key === 'F8') {
        e.preventDefault();
        if (orderRows.length > 0) {
          deleteRow(orderRows.length - 1); // Xóa dòng cuối cùng
        }
      }
    });
  }

  // --- In hóa đơn ---
  function printInvoice() {
    if (orderRows.length === 0) {
      showToast('Không có sản phẩm nào để in!', 'error');
      playSynthBeep('error');
      return;
    }

    var previewArea = document.getElementById('receipt-preview-area');
    if (!previewArea) return;

    var user = JSON.parse(localStorage.getItem('santino_user') || '{}');
    var docNo = document.getElementById('field-DocumentID') ? document.getElementById('field-DocumentID').value : 'MỚI';
    var docDate = document.getElementById('field-DocumentDate') ? document.getElementById('field-DocumentDate').value : Utils.today();
    var custName = document.getElementById('field-ObjectName') ? document.getElementById('field-ObjectName').value : 'Khách vãng lai';

    var totalQty = 0;
    var totalMoney = 0;

    var rowsHtml = orderRows.map(function (r, idx) {
      totalQty += r.Quantity;
      totalMoney += r.Amount;
      return `
        <tr>
          <td>${idx + 1}. ${r.ItemName}<br>&nbsp;&nbsp;${r.ItemID} | Sz:${r.Size} | M:${r.MauSac}</td>
          <td style="text-align:center; vertical-align:top;">${r.Quantity}</td>
          <td style="text-align:right; vertical-align:top;">${Utils.formatMoney(r.Amount)}</td>
        </tr>
      `;
    }).join('');

    previewArea.innerHTML = `
      <div style="text-align: center; margin-bottom: 12px;">
        <h3 style="margin: 0; text-transform: uppercase;">CÔNG TY CP LSP VIỆT NAM</h3>
        <p style="margin: 2px 0; font-size: 10px;">ĐT: (024) 3204 9988 - www.santino.com.vn</p>
        <h4 style="margin: 10px 0 2px 0;">HOÁ ĐƠN BÁN HÀNG</h4>
        <p style="margin: 0; font-size: 10px; font-style: italic;">Số: ${docNo} - Ngày: ${docDate}</p>
      </div>
      <div style="font-size: 11px; margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 6px;">
        Khách hàng: <strong>${custName}</strong><br>
        Nhân viên lập: ${user.Username || 'Admin'}
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
        <thead>
          <tr style="border-bottom: 1px dashed #000;">
            <th style="text-align:left; padding-bottom:4px;">Sản phẩm</th>
            <th style="width:40px; text-align:center; padding-bottom:4px;">SL</th>
            <th style="width:90px; text-align:right; padding-bottom:4px;">T.Tiền</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
      <div style="margin-top: 10px; border-top: 1px dashed #000; padding-top: 6px; font-size: 11px;">
        <div style="display:flex; justify-content:space-between;"><span>Tổng số lượng:</span><strong>${totalQty} SP</strong></div>
        <div style="display:flex; justify-content:space-between; font-size: 13px; margin-top:4px;"><span>TỔNG TIỀN:</span><strong>${Utils.formatMoney(totalMoney)}</strong></div>
      </div>
      <div style="text-align: center; margin-top: 20px; font-size: 10px; font-style: italic;">
        Xin cảm ơn quý khách!<br>Hẹn gặp lại quý khách!
      </div>
    `;

    openModal('modal-sales-print');
    playSynthBeep('success');
  }

  function executePrint() {
    closeModal('modal-sales-print');
    window.print();
  }

  // --- Các modal phụ trợ ---
  function showAddProductModal() {
    var pComboInput = document.querySelector('#quick-product-select');
    if (pComboInput) pComboInput.focus();
  }

  function showComboModal() {
    showToast('Tính năng chọn combo đang được phát triển.', 'warning');
  }

  function applyPromo() {
    recalculateTotals();
    showToast('Đã áp dụng mã giảm giá và chương trình KM!');
    playSynthBeep('success');
  }

  function openSettings() {
    Router.go('/settings');
  }

  function openDetail() {
    var layout = document.querySelector('.sales-layout');
    if (layout) {
      layout.classList.remove('detail-collapsed');
      layout.classList.add('mobile-show-detail');
    }
    setTimeout(function () {
      if (gridApi) gridApi.sizeColumnsToFit();
    }, 100);
  }

  function closeDetail() {
    var layout = document.querySelector('.sales-layout');
    if (layout) {
      layout.classList.add('detail-collapsed');
      layout.classList.remove('mobile-show-detail');
    }
    setTimeout(function () {
      if (gridApi) gridApi.sizeColumnsToFit();
    }, 100);
  }

  return {
    render: render,
    refreshList: refreshList,
    onFilterChange: onFilterChange,
    updateRowField: updateRowField,
    deleteRow: deleteRow,
    calcChangeMoney: calcChangeMoney,
    resetForm: resetForm,
    saveVoucher: saveVoucher,
    printInvoice: printInvoice,
    executePrint: executePrint,
    showAddProductModal: showAddProductModal,
    showComboModal: showComboModal,
    applyPromo: applyPromo,
    openSettings: openSettings,
    openDetail: openDetail,
    closeDetail: closeDetail
  };
})();
