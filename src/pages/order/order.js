var OrderPage = (function () {
  var orderRows = [];
  var multiSelectedCodes = [];
  var cachedProds = {};
  var cachedSizes = [];
  var _createCustomerModalInstance = null;
  var _customerModalContent = null;
  var _cachedProvinces = [];
  var _cachedObjectGroups = [];

  var _userPerm = { isAdmin: false, isManager: false, isAgent: false };
  var _canAddCustomer = false;

  async function _loadUserPermission() {
    try {
      var res = await _searchCategory('UserPermission', '', false, 1);
      if (res && res[0]) {
        var parseBool = function (val) {
          if (!val) return false;
          var s = String(val).toLowerCase().trim();
          return s === '1' || s === 'true';
        };
        _userPerm.isAdmin = parseBool(res[0].isAdmin);
        _userPerm.isManager = parseBool(res[0].isManager);
        _userPerm.isAgent = parseBool(res[0].isAgent);
      }
    } catch (err) {
      console.warn('[OrderPage] Lỗi load quyền người dùng:', err);
    }

    try {
      var user = JSON.parse(localStorage.getItem('santino_user') || '{}');
      var role = user.role || user.Group || user.GroupUser || user.GroupID;
      if (role && typeof PermissionsService !== 'undefined') {
        var records = await PermissionsService.getFullMenusByGroup(role);
        if (Array.isArray(records)) {
          var customerMenu = records.find(function (item) {
            var formName = item.formName || item.FormName || '';
            var formKey = item.formKey || item.FormKey || '';
            return formName.toLowerCase() === 'web_customerfrm' ||
              formName.toLowerCase() === 'customers' ||
              formKey.toLowerCase() === 'customers';
          });
          _canAddCustomer = customerMenu ? (customerMenu.IsAdd == 1 || customerMenu.isAdd == 1) : false;
        }
      }
    } catch (e) {
      console.warn('[OrderPage] Lỗi load quyền thêm khách hàng:', e);
      _canAddCustomer = false;
    }
  }

  function _getUserPermission() {
    var user = JSON.parse(localStorage.getItem('santino_user') || '{}');
    var isPrivileged = _userPerm.isAdmin || _userPerm.isManager;

    return {
      user: user,
      role: (user.role || user.Group || '').toLowerCase(),
      isAdmin: _userPerm.isAdmin,
      isPrivileged: isPrivileged,
      isAgent: _userPerm.isAgent,
      empID: user.EmployeeID || '',
      objID: user.ObjectID || ''
    };
  }

  // Load script động nếu chưa có trong bundle
  function _dynScript(src) {
    return new Promise(function (resolve) {
      if (document.querySelector('script[src*="' + src.split('/').pop() + '"]')) {
        resolve(); return;
      }
      var el = document.createElement('script');
      el.src = src + '?v=' + Date.now();
      el.onload = resolve;
      el.onerror = function () { console.warn('Could not load:', src); resolve(); };
      document.body.appendChild(el);
    });
  }

  function _dynCss(src) {
    var id = 'dyn-css-' + src.split('/').pop().replace('.', '-');
    if (document.getElementById(id)) return;
    var el = document.createElement('link');
    el.id = id;
    el.rel = 'stylesheet';
    el.href = src + '?v=' + Date.now();
    document.head.appendChild(el);
  }

  async function _ensureComponents() {
    if (window.UIControls && UIControls.createDataComboBox) return; // Đã có trong bundle
    // Load CSS trước
    _dynCss('src/components/ui-utils/shared-dropdown.css');
    _dynCss('src/components/data-combobox/combobox.css');
    // Load JS theo thứ tự
    await _dynScript('src/components/ui-utils/UIUtils.js');
    await _dynScript('src/components/data-combobox/DataComboBox.js');
  }

  function render($el) {
    // Reset toàn bộ state khi render lại trang (Xóa sạch form)
    _catValues = {
      khach_hang: { id: '', name: '' },
      chi_nhanh: { id: '', name: '' },
      nvkd: { id: '', name: '' },
      dieu_khoan: { id: '', name: '' },
      ht_tt: { id: '', name: '' },
      remarks: { id: '', name: '' },
      notes: { id: '', name: '' }
    };
    _combos = {};
    orderRows = [];
    // Cho phép trang này rộng tối đa theo container-order
    $el.classList.add('is-full-width');

    return Router.fetchTemplate('src/pages/order/order.html')
      .then(function (html) {
        $el.innerHTML = html;
        _init();
      });
  }

  async function _init() {
    await _loadUserPermission();
    // 1. Lấy bảng size và thông tin cơ bản
    var resSizes = await ProductService.getSizes();
    if (Array.isArray(resSizes) && resSizes.length > 0) {
      cachedSizes = resSizes;
    }
    document.getElementById('o-so-ct').value = Utils.genOrderNo();
    document.getElementById('o-ngay').value = Utils.today();
    document.getElementById('o-ngay').addEventListener('change', function () {
      var currentSoCT = document.getElementById('o-so-ct').value || '';
      var existingSeq = currentSoCT.split('/')[1] || null;
      var ngayCT = this.value;
      var branchId = _catValues && _catValues.chi_nhanh ? _catValues.chi_nhanh.id : '';
      document.getElementById('o-so-ct').value = Utils.genOrderNo(branchId, ngayCT, existingSeq);

      // Cập nhật Ngày TT dựa vào Điều khoản TT hiện tại
      var days = (_catValues.dieu_khoan && _catValues.dieu_khoan.due_days) ? parseInt(_catValues.dieu_khoan.due_days, 10) : 0;
      var d = ngayCT ? new Date(ngayCT) : new Date();
      d.setDate(d.getDate() + days);
      document.getElementById('o-ngay-tt').value = d.toISOString().split('T')[0];
    });

    document.getElementById('o-kh-ten').value = '';
    document.getElementById('o-ma-kh').value = '';
    document.getElementById('o-ma-dl').value = '';
    document.getElementById('o-ngay-tt').value = Utils.today();
    document.getElementById('o-kh-dc').value = '';
    if (document.getElementById('o-remarks')) document.getElementById('o-remarks').value = '';
    if (_combos.remark) _combos.remark.querySelector('input').value = '';
    if (document.getElementById('o-notes')) document.getElementById('o-notes').value = '';
    if (_combos.note) _combos.note.querySelector('input').value = '';
    if (document.getElementById('o-nguoi-giao')) document.getElementById('o-nguoi-giao').value = '';
    if (_combos.delivery) _combos.delivery.querySelector('input').value = '';
    if (document.getElementById('o-nguon-don')) document.getElementById('o-nguon-don').value = '';
    if (_combos.source) _combos.source.querySelector('input').value = '';

    // 2. Đảm bảo component đã load, rồi mới inject danh mục
    await _ensureComponents();
    _loadCategories();

    var sel = document.getElementById('o-ctbh');
    if (sel) {
      sel.value = '';
    }

    renderMatrix();
    document.addEventListener('click', function (e) {
      var list = document.getElementById('ac-list');
      var wrap = document.querySelector('.autocomplete-wrap');
      if (list && list.classList.contains('show')) {
        // Nếu click ra ngoài cả danh sách (list) VÀ vùng tìm kiếm (wrap)
        if (!list.contains(e.target) && (!wrap || !wrap.contains(e.target))) {
          closeAc();
        }
      }
    });
  }

  // Tìm kiếm danh mục server-side — gọi Http trực tiếp,
  // tránh dùng CategoryService cũ có thể đang trong bundle cũ.
  function _searchCategory(loai, timKiem, ignoreBranchFilter, page) {
    var q = { Loai: loai };
    if (timKiem && timKiem.trim()) q.TimKiem = timKiem.trim();
    if (loai === 'Customer' || loai === 'UserPermission') {
      if (loai === 'Customer' && !ignoreBranchFilter && _catValues && _catValues.chi_nhanh && _catValues.chi_nhanh.id) {
        q.chinhanh = _catValues.chi_nhanh.id;
      } else {
        q.chinhanh = ''; // ensure chinhanh is defined
      }
      if (page) {
        q.Page = page;
      }
      // Truyền tham số quyền chuẩn qua JSON thay vì nhồi vào biến chinhanh
      try {
        var perm = _getUserPermission();
        var role = perm.user.role || perm.user.Group || '';
        var empID = perm.empID;
        var objID = perm.objID;

        // FIX CỰC QUAN TRỌNG: 
        // Vì SQL dùng phép OR, nếu Khách lẻ (Chị Thủy) truyền cả ObjectID và EmployeeID(VP) 
        // xuống thì SQL sẽ hiểu nhầm bả là nhân viên VP -> Nhả ra 17 khách của VP!
        // Giải pháp: Khách lẻ thì xóa sạch EmployeeID trước khi gửi!
        if (objID && objID !== '') {
          empID = '';
        }

        q.UserRole = role;
        q.UserEmployeeID = empID;
        q.UserObjectID = objID;
      } catch (e) { }
    }

    var params = { q: JSON.stringify(q) };
    if (page || (timKiem && timKiem.trim())) {
      params._t = Date.now(); // force no cache
    }
    return Http.get(API_CONFIG.ENDPOINTS.CATEGORIES.LIST, params)
      .then(function (res) {
        var data = res.records || res;
        if (!Array.isArray(data)) return [];
        if (loai === 'UserPermission') {
          return data;
        }
        return data.map(function (item) {
          return {
            id: item.id || item.Id || '',
            name: item.name || item.Name || '',
            address: item.address || '',
            phone: item.phone || '',
            department: item.department || '',
            due_days: item.due_days != null ? item.due_days : null,
            is_default: item.is_default || false,
            employee_id: item.employee_id || item.EmployeeID || '',
            branch_id: item.branch_id || item.BranchID || '',
            group_id: item.group_id || item.ObjectGroupID || ''
          };
        });
      })
      .catch(function () { return []; });
  }

  var _catValues = {
    khach_hang: { id: '', name: '' },
    chi_nhanh: { id: '', name: '' },
    nvkd: { id: '', name: '' },
    dieu_khoan: { id: '', name: '' },
    ht_tt: { id: '', name: '' },
    remarks: { id: '', name: '' },
    notes: { id: '', name: '' }
  };

  var _combos = {};

  async function _loadCategories() {
    try {
      const [employees, customers, promotions, remarks, notes] = await Promise.all([
        CategoryService.getCategories('Employee'),
        CategoryService.getCategories('Customer'),
        CategoryService.getCategories('Promotion'),
        CategoryService.getCategories('Remark'),
        CategoryService.getCategories('Note')
      ]);
      const branches = [];
      const payTypes = [];
      const payTerms = [];
      const vehicles = [];
      const deliveryPersons = [];
      const sources = [];

      // ── Diễn giải (MỚI) ──────────────────────────────────────────
      var wrapRemark = document.getElementById('wrap-remark');
      if (wrapRemark && UIControls && UIControls.createDataComboBox) {
        _combos.remark = UIControls.createDataComboBox({
          id: 'o-remarks-search',
          placeholder: '-- Chọn hoặc nhập diễn giải --',
          headers: ['Diễn giải'],
          data: remarks.map(function (r) { return [r.name]; }),
          onSearch: function (q) {
            return _searchCategory('Remark', q).then(function (list) {
              return list.map(function (r) { return [r.name]; });
            });
          },
          onSelect: function (row) {
            document.getElementById('o-remarks').value = row[0];
            _catValues.remarks = { id: row[0], name: row[0] };
          }
        });
        wrapRemark.appendChild(_combos.remark);
      }

      // ── Ghi chú (MỚI) ──────────────────────────────────────────
      var wrapNote = document.getElementById('wrap-note');
      if (wrapNote && UIControls && UIControls.createDataComboBox) {
        _combos.note = UIControls.createDataComboBox({
          id: 'o-notes-search',
          placeholder: '-- Chọn hoặc nhập ghi chú --',
          headers: ['Ghi chú'],
          data: notes.map(function (n) { return [n.name]; }),
          onSearch: function (q) {
            return _searchCategory('Note', q).then(function (list) {
              return list.map(function (n) { return [n.name]; });
            });
          },
          onSelect: function (row) {
            document.getElementById('o-notes').value = row[0];
            _catValues.notes = { id: row[0], name: row[0] };
          }
        });
        wrapNote.appendChild(_combos.note);
      }

      // ── Người giao (MỚI) ──────────────────────────────────────────
      var wrapNguoiGiao = document.getElementById('wrap-nguoi-giao');
      if (wrapNguoiGiao && UIControls && UIControls.createDataComboBox) {
        _combos.delivery = UIControls.createDataComboBox({
          id: 'o-nguoi-giao-search',
          placeholder: '-- Chọn người giao --',
          headers: ['Người giao', 'Ghi chú'],
          data: deliveryPersons.map(function (d) { return [d.name, d.memo || '']; }),
          onSearch: function (q) {
            return _searchCategory('DeliveryPerson', q).then(function (list) {
              return list.map(function (d) { return [d.name, d.memo || '']; });
            });
          },
          onSelect: function (row) {
            document.getElementById('o-nguoi-giao').value = row[0];
          }
        });
        wrapNguoiGiao.appendChild(_combos.delivery);
      }

      // ── Nguồn đơn (MỚI) ──────────────────────────────────────────
      var wrapNguonDon = document.getElementById('wrap-nguon-don');
      if (wrapNguonDon && UIControls && UIControls.createDataComboBox) {
        _combos.source = UIControls.createDataComboBox({
          id: 'o-nguon-don-search',
          placeholder: '-- Chọn nguồn đơn --',
          headers: ['Nguồn đơn', 'Ghi chú'],
          data: sources.map(function (s) { return [s.name, s.memo || '']; }),
          onSearch: function (q) {
            return _searchCategory('OrderSource', q).then(function (list) {
              return list.map(function (s) { return [s.name, s.memo || '']; });
            });
          },
          onSelect: function (row) {
            document.getElementById('o-nguon-don').value = row[0];
          }
        });
        wrapNguonDon.appendChild(_combos.source);
      }

      // ── Khách hàng (MỚI) ──────────────────────────────────────────
      var wrapKH = document.getElementById('wrap-khach-hang');
      if (wrapKH && UIControls && UIControls.createDataComboBox) {
        _combos.kh = UIControls.createDataComboBox({
          id: 'o-ma-kh-search',
          placeholder: '-- Tìm khách hàng --',
          hideDropdownOnInput: true,
          enablePagination: true,
          showAddNew: _canAddCustomer,
          headers: ['Khách hàng', 'Tên kh/hàng', 'Địa chỉ', 'Mã NV', 'Chi nhánh'],
          data: customers.map(function (c) { return [c.id, c.name, c.address || '', c.employee_id || '', c.branch_id || '', c.group_id || 'Khác']; }),
          colFilterIndex: 1,
          colHighlightIndex: 1,
          colGroupIndex: 5,
          onSearch: function (q, page) {
            return _searchCategory('Customer', q, false, page).then(function (list) {
              return list.map(function (c) { return [c.id, c.name, c.address || '', c.employee_id || '', c.branch_id || '', c.group_id || 'Khác']; });
            });
          },
          onSelect: function (row) {
            var id = row[0], name = row[1], addr = row[2], empId = row[3], branchId = row[4];
            document.getElementById('o-ma-kh').value = id;
            document.getElementById('o-kh-ten').value = name;
            document.getElementById('o-kh-dc').value = addr;
            _catValues.khach_hang = { id: id, name: name };

            // Tự động tìm và set cho Chi nhánh
            if (branchId) {
              var b = branches.find(x => x.id === branchId);
              var branchName = b ? b.name : branchId;
              if (_combos.branch) {
                _combos.branch.querySelector('input').value = branchName;
              }
              _catValues.chi_nhanh = { id: branchId, name: branchName };
            }
            // Tự động tìm và set cho Nhân viên
            if (empId && _combos.nvkd) {
              var e = employees.find(x => x.id === empId);
              if (e) {
                _combos.nvkd.querySelector('input').value = e.name;
                _catValues.nvkd = { id: e.id, name: e.name };
              }
            }
            updateInfoSummary();
          },
          onF2: function () {
            _openCreateCustomerModal();
          }
        });

        // -------------------------------------------------------------
        // KHOÁ Ô KHÁCH HÀNG NẾU LÀ KHÁCH LẺ (CÓ OBJECT_ID)
        // -------------------------------------------------------------
        try {
          var perm = _getUserPermission();

          // KHÔNG KHÓA đối với Đại lý/NPP (Cua hang, DL, Ban dai ly) vì họ cần chọn khách con!
          if (perm.objID && perm.objID !== '' && !perm.isPrivileged && !perm.isAgent) {
            var inputEl = _combos.kh.querySelector('input');
            if (inputEl) {
              inputEl.value = perm.user.name || perm.user.DisplayName || perm.objID;
              inputEl.readOnly = true;
              inputEl.style.backgroundColor = '#f1f5f9';
              inputEl.style.cursor = 'not-allowed';
            }

            var actionBtn = _combos.kh.querySelector('.combo-action-btn');
            if (actionBtn) {
              actionBtn.innerHTML = '<span class="material-symbols-outlined" style="color:#94a3b8; font-size:18px;">lock</span>';
            }

            // Chặn tuyệt đối mọi tương tác chuột vào Combobox
            _combos.kh.style.pointerEvents = 'none';

            // Tự động thiết lập giá trị ngầm để khi Lưu đơn hàng lấy được mã KH
            var name = perm.user.name || perm.user.DisplayName || perm.objID;
            document.getElementById('o-ma-kh').value = perm.objID;
            document.getElementById('o-kh-ten').value = name;
            _catValues.khach_hang = { id: perm.objID, name: name };

            // Tự động map Nhân viên phụ trách
            var empId = perm.empID;
            if (empId) {
              var e = employees.find(x => x.id === empId);
              if (e && _combos.nvkd) {
                _combos.nvkd.querySelector('input').value = e.name;
                _catValues.nvkd = { id: e.id, name: e.name };
              }
            }

            // Tự động map Chi nhánh
            var branchId = perm.user.BranchID || '';
            if (branchId) {
              var b = branches.find(x => x.id === branchId);
              var branchName = b ? b.name : branchId;
              if (_combos.branch) {
                _combos.branch.querySelector('input').value = branchName;
              }
              _catValues.chi_nhanh = { id: branchId, name: branchName };
            }
            updateInfoSummary();
          }
        } catch (e) { }

        wrapKH.appendChild(_combos.kh);
      }

      // ── Mã đại lý (Dùng chung danh mục Customer) ──────────────
      var wrapMaDL = document.getElementById('wrap-ma-dl');
      if (wrapMaDL && UIControls && UIControls.createDataComboBox) {
        _combos.ma_dl = UIControls.createDataComboBox({
          id: 'o-ma-dl-search',
          placeholder: '-- Tìm đại lý --',
          hideDropdownOnInput: true,
          enablePagination: true,
          headers: ['Khách hàng', 'Tên khách hàng', 'Địa chỉ'],
          data: customers.map(function (c) { return [c.id, c.name, c.address || '', c.group_id || 'Khác']; }),
          colFilterIndex: 1,
          colHighlightIndex: 1,
          colGroupIndex: 3,
          onSearch: function (q, page) {
            return _searchCategory('Customer', q, true, page).then(function (list) {
              return list.map(function (c) { return [c.id, c.name, c.address || '', c.group_id || 'Khác']; });
            });
          },
          onSelect: function (row) {
            document.getElementById('o-ma-dl').value = row[0];
          }
        });

        // -------------------------------------------------------------
        // KHOÁ Ô ĐẠI LÝ NẾU TÀI KHOẢN CÓ OBJECT_ID (Khách/Đại lý)
        // -------------------------------------------------------------
        try {
          var perm = _getUserPermission();

          if (perm.objID && perm.objID !== '' && !perm.isPrivileged) {
            var inputEl = _combos.ma_dl.querySelector('input');
            if (inputEl) {
              inputEl.value = perm.user.name || perm.user.DisplayName || perm.objID;
              inputEl.readOnly = true;
              inputEl.style.backgroundColor = '#f1f5f9';
              inputEl.style.cursor = 'not-allowed';
            }
            var actionBtn = _combos.ma_dl.querySelector('.combo-action-btn');
            if (actionBtn) {
              actionBtn.innerHTML = '<span class="material-symbols-outlined" style="color:#94a3b8; font-size:18px;">lock</span>';
            }
            _combos.ma_dl.style.pointerEvents = 'none';
            document.getElementById('o-ma-dl').value = perm.objID;
          }
        } catch (e) { }

        wrapMaDL.appendChild(_combos.ma_dl);
      }

      // ── Chi nhánh ─────────────────────────────────────────────
      var wrapBranch = document.getElementById('wrap-chi-nhanh');
      if (wrapBranch && UIControls && UIControls.createDataComboBox) {
        _catValues.chi_nhanh = { id: '', name: '' };

        _combos.branch = UIControls.createDataComboBox({
          id: 'o-chi-nhanh',
          placeholder: '-- Chọn chi nhánh --',
          headers: ['Tên chi nhánh', 'Chi nhánh', 'STT'],
          data: branches.map(function (b) { return [b.name, b.id, b.stt]; }),
          colFilterIndex: 0,
          colHighlightIndex: 0,
          onSearch: function (q) {
            return _searchCategory('Branch', q).then(function (list) {
              return list.map(function (b) { return [b.name, b.id, b.stt]; });
            });
          },
          onSelect: function (row) {
            _catValues.chi_nhanh = { id: row[1], name: row[0] };

            // Cập nhật Số CT theo mã chi nhánh và ngày CT
            var currentSoCT = document.getElementById('o-so-ct').value || '';
            var existingSeq = currentSoCT.split('/')[1] || null; // lấy phần đuôi (VD: 0001)
            var ngayCT = document.getElementById('o-ngay').value;

            document.getElementById('o-so-ct').value = Utils.genOrderNo(row[1], ngayCT, existingSeq);
          }
        });
        wrapBranch.appendChild(_combos.branch);
      }

      // ── Nhân viên KD ──────────────────────────────────────────
      var wrapNvkd = document.getElementById('wrap-nvkd');
      if (wrapNvkd && UIControls && UIControls.createDataComboBox) {
        _combos.nvkd = UIControls.createDataComboBox({
          id: 'o-nvkd',
          placeholder: '-- Chọn nhân viên --',
          headers: ['Tên nhân viên', 'Mã NV'],
          data: employees.map(function (e) { return [e.name, e.id]; }),
          colFilterIndex: 0,
          colHighlightIndex: 0,
          onSearch: function (q) {
            return _searchCategory('Employee', q).then(function (list) {
              return list.map(function (e) { return [e.name, e.id]; });
            });
          },
          onSelect: function (row) {
            _catValues.nvkd = { id: row[1], name: row[0] };
          }
        });

        // -------------------------------------------------------------
        // KHOÁ Ô NHÂN VIÊN NẾU TÀI KHOẢN CÓ EMPLOYEE_ID (NVKD / Khách của NVKD)
        // -------------------------------------------------------------
        try {
          var perm = _getUserPermission();

          if (perm.empID && perm.empID !== '' && !perm.isPrivileged) {
            var e = employees.find(x => x.id === perm.empID);
            var empName = e ? e.name : perm.empID;
            var inputEl = _combos.nvkd.querySelector('input');
            if (inputEl) {
              inputEl.value = empName;
              inputEl.readOnly = true;
              inputEl.style.backgroundColor = '#f1f5f9';
              inputEl.style.cursor = 'not-allowed';
            }
            var actionBtn = _combos.nvkd.querySelector('.combo-action-btn');
            if (actionBtn) {
              actionBtn.innerHTML = '<span class="material-symbols-outlined" style="color:#94a3b8; font-size:18px;">lock</span>';
            }
            _combos.nvkd.style.pointerEvents = 'none';
            _catValues.nvkd = { id: perm.empID, name: empName };
          }
        } catch (e) { }

        wrapNvkd.appendChild(_combos.nvkd);
      }

      // ── Điều khoản TT ─────────────────────────────────────────
      var wrapDK = document.getElementById('wrap-dieu-khoan');
      if (wrapDK && UIControls && UIControls.createDataComboBox) {
        _combos.dk = UIControls.createDataComboBox({
          id: 'o-dieu-khoan',
          placeholder: '-- Chọn điều khoản --',
          headers: ['Tên điều khoản', 'Điều khoản TT'],
          data: payTerms.map(function (p) { return [p.name, p.id, p.due_days || 0]; }),
          colFilterIndex: 0,
          colHighlightIndex: 0,
          onSearch: function (q) {
            return _searchCategory('PaymentTerm', q).then(function (list) {
              return list.map(function (p) { return [p.name, p.id, p.due_days || 0]; });
            });
          },
          onSelect: function (row) {
            if (row) {
              var days = parseInt(row[2], 10) || 0;
              _catValues.dieu_khoan = { id: row[1], name: row[0], due_days: days };
              var baseDate = document.getElementById('o-ngay').value;
              var d = baseDate ? new Date(baseDate) : new Date();
              d.setDate(d.getDate() + days);
              document.getElementById('o-ngay-tt').value = d.toISOString().split('T')[0];
            } else {
              _catValues.dieu_khoan = { id: '', name: '', due_days: 0 };
              document.getElementById('o-ngay-tt').value = document.getElementById('o-ngay').value || Utils.today();
            }
          }
        });
        wrapDK.appendChild(_combos.dk);
      }

      // ── Hình thức thanh toán ───────────────────────────────────
      var wrapHT = document.getElementById('wrap-ht-thanh-toan');
      if (wrapHT && UIControls && UIControls.createDataComboBox) {
        _catValues.ht_tt = { id: '', name: '' };

        _combos.ht = UIControls.createDataComboBox({
          id: 'o-ht-thanh-toan',
          placeholder: '-- Chọn hình thức --',
          headers: ['Tên hình thức', 'Hình thức thanh toán'],
          data: payTypes.map(function (p) { return [p.name, p.id]; }),
          colFilterIndex: 0,
          colHighlightIndex: 0,
          onSearch: function (q) {
            return _searchCategory('PaymentType', q).then(function (list) {
              return list.map(function (p) { return [p.name, p.id]; });
            });
          },
          onSelect: function (row) {
            _catValues.ht_tt = { id: row[1], name: row[0] };
          }
        });
        wrapHT.appendChild(_combos.ht);
      }

      // ── CTKM ──────────────────────────────────────────────────
      var wrapKM = document.getElementById('wrap-ctkm');
      if (wrapKM && UIControls && UIControls.createDataComboBox) {
        _combos.ctkm = UIControls.createDataComboBox({
          id: 'o-ctkm-search',
          placeholder: '-- Chọn CTKM --',
          headers: ['Tên chiết khấu', 'Chiết khấu'],
          data: promotions.map(function (p) { return [p.name, p.id]; }),
          colFilterIndex: 0,
          colHighlightIndex: 0,
          onSearch: function (q) {
            return _searchCategory('Promotion', q).then(function (list) {
              return list.map(function (p) { return [p.name, p.id]; });
            });
          },
          onSelect: function (row) {
            document.getElementById('o-ctbh').value = row[1];
            updateInfoSummary();
          }
        });
        wrapKM.appendChild(_combos.ctkm);
      }

      // ── PT Giao hàng ──────────────────────────────────────────
      var wrapPT = document.getElementById('wrap-pt-giao');
      if (wrapPT && UIControls && UIControls.createDataComboBox) {
        _combos.pt_giao = UIControls.createDataComboBox({
          id: 'o-pt-giao-search',
          placeholder: '-- Chọn phương tiện --',
          headers: ['Mã phương tiện', 'Phương tiện giao hàng', 'Ghi chú'],
          data: vehicles.map(function (v) { return [v.id, v.name, v.memo || '']; }),
          colFilterIndex: 0,
          colHighlightIndex: 0,
          onSearch: function (q) {
            return _searchCategory('PTGiaoHang', q).then(function (list) {
              return list.map(function (v) { return [v.id, v.name, v.memo || '']; });
            });
          },
          onSelect: function (row) {
            if (row) {
              document.getElementById('o-pt-giao').value = row[0];
              document.getElementById('o-pt-giao-name').value = row[1];
            } else {
              document.getElementById('o-pt-giao').value = '';
              document.getElementById('o-pt-giao-name').value = '';
            }
          }
        });
        wrapPT.appendChild(_combos.pt_giao);
      }
    } catch (err) {
      console.warn('[OrderPage] Lỗi load danh mục:', err);
    }
  }

  var acScrollHandler = null;
  var acScrollTargets = [];
  function _attachAcScroll() {
    if (acScrollHandler) return;
    var input = document.getElementById('ac-input');
    var list = document.getElementById('ac-list');
    acScrollHandler = function () {
      if (list.classList.contains('show') && window.UIControls && UIControls.utils) {
        UIControls.utils.computeDropdownPosition(input, list);
      }
    };
    acScrollTargets = (window.UIControls && UIControls.utils) ? UIControls.utils.getScrollableAncestors(input) : [window];
    acScrollTargets.forEach(function (t) { t.addEventListener('scroll', acScrollHandler, { passive: true, capture: false }); });
    window.addEventListener('resize', acScrollHandler, { passive: true });
  }
  function _detachAcScroll() {
    if (!acScrollHandler) return;
    acScrollTargets.forEach(function (t) { t.removeEventListener('scroll', acScrollHandler, { capture: false }); });
    window.removeEventListener('resize', acScrollHandler);
    acScrollHandler = null;
    acScrollTargets = [];
  }


  function updateInfoSummary() {
    var name = document.getElementById('o-kh-ten').value.trim();
    var maKH = document.getElementById('o-ma-kh').value.trim();
    var ptGiao = document.getElementById('o-pt-giao').value;
    var summary = document.getElementById('info-summary-display');
    if (!summary) return;

    if (!name && !maKH) {
      summary.innerHTML = 'Chạm để khai báo thông tin...';
      summary.style.color = 'var(--text)';
    } else {
      var displayName = (maKH ? maKH + ' - ' : '') + (name || 'Khách lẻ');
      var parts = [displayName];
      if (ptGiao) parts.push(ptGiao);
      summary.innerHTML = parts.join(' | ');
      summary.style.color = 'var(--primary)';
    }
  }

  function finishOrderInfo() {
    var maKH = document.getElementById('o-ma-kh').value.trim();
    var chiNhanh = _catValues.chi_nhanh.id || _catValues.chi_nhanh.name;

    var perm = _getUserPermission();

    // Nếu không phải Khách lẻ mà chưa chọn chi nhánh thì mới báo lỗi
    // (Khách lẻ mặc định bị ẩn ô chi nhánh nên không bắt buộc chọn)
    if (!chiNhanh && perm.isAdmin) {
      showToast('Vui lòng chọn chi nhánh', false);
      return;
    }
    if (!maKH) {
      showToast('Vui lòng chọn khách hàng', false);
      return;
    }

    closeModal('modal-order-info');
    updateInfoSummary();
    setTimeout(function () {
      var inp = document.getElementById('ac-input');
      if (inp && orderRows.length === 0) inp.focus();
    }, 300);
  }

  let acSearchTimer = null;
  let acSearchId = 0;
  function acSearch(val) {
    if (acSearchTimer) clearTimeout(acSearchTimer);

    var btnClear = document.getElementById('ac-clear');
    if (btnClear) btnClear.style.display = val ? 'block' : 'none';

    var list = document.getElementById('ac-list');
    var input = document.getElementById('ac-input');
    // Lệnh yêu cầu: "focus vào ô input mà trống thì hiện tất cả"
    // Nên ta sẽ loại bỏ đoạn chặn (!val || val.length < 2) này
    /* 
    if (!val || val.length < 2) { 
      list.classList.remove('show'); 
      input.style.borderBottomLeftRadius = '';
      input.style.borderBottomRightRadius = '';
      _detachAcScroll();
      return; 
    }
    */

    var currentSearchId = ++acSearchId;
    acSearchTimer = setTimeout(async function () {

      // Gọi API qua Service lấy sản phẩm
      var prods = await ProductService.getProducts(val);

      // NẾU người dùng đã đóng bảng TRƯỚC KHI API trả về kết quả, thì HỦY render
      if (currentSearchId !== acSearchId) return;

      prods.forEach(function (p) { cachedProds[p.ten_hang_2] = p; });

      if (!prods.length) {
        list.innerHTML = '<div class="ac-item"><small>Không tìm thấy sản phẩm</small></div>';
        list.classList.add('show');
        if (window.UIControls && UIControls.utils) {
          UIControls.utils.computeDropdownPosition(input, list);
          _attachAcScroll();
          input.style.borderBottomLeftRadius = '0';
          input.style.borderBottomRightRadius = '0';
        }
        return;
      }

      var html = '<div class="ac-header"><div style="width:24px; margin-right:12px; flex-shrink:0"></div><div class="ac-col-1">SẢN PHẨM</div><div class="ac-col-2" style="min-width:45px">FORM</div><div class="ac-col-3" style="min-width:26px; text-align:center">TỒN</div><div class="ac-col-3" style="min-width:75px">ĐƠN GIÁ</div></div>';

      html += prods.slice(0, 8).map(function (p) {
        var pos = multiSelectedCodes.indexOf(p.ten_hang_2);
        var isChecked = pos !== -1 ? 'checked' : '';
        var numDisplay = pos !== -1 ? 'flex' : 'none';
        var numVal = pos !== -1 ? (pos + 1) : '';
        var brand = p.ten_hang_2.match(/^[A-Z]+/); brand = brand ? brand[0] : '';
        var stock = p.ton_kho !== undefined ? p.ton_kho : (Math.floor(Math.random() * 50) + 10);
        var stockColor = stock > 20 ? 'var(--success)' : 'var(--accent)';
        return '<div class="ac-table-row" onclick="OrderPage.toggleAcSelect(event, \'' + p.ten_hang_2 + '\')">' +
          '<div style="position:relative; margin-right:12px; width:18px; height:18px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">' +
          '<input type="checkbox" class="chk-code" ' + isChecked + ' id="chk-' + p.ten_hang_2 + '" value="' + p.ten_hang_2 + '" onclick="event.stopPropagation(); OrderPage.toggleAcSelect(event, \'' + p.ten_hang_2 + '\')" style="margin:0; width:16px; height:16px; cursor:pointer;">' +
          '<div class="chk-num" id="chk-num-' + p.ten_hang_2 + '" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); pointer-events:none; display:' + numDisplay + '; align-items:center; justify-content:center; width:18px; height:18px; background:var(--primary); color:white; font-size:11px; font-weight:bold; border-radius:4px;">' + numVal + '</div>' +
          '</div>' +
          '<div class="ac-col-1" style="padding-right:4px;"><strong>' + p.ten_hang_2 + '</strong><div style="font-size:calc(12px * var(--text-scale,1)); color:var(--muted); white-space:normal; line-height:1.2"><span class="ac-desc">' + p.ten_hang_hoa + '</span> - <small>' + p.mau + '</small></div></div>' +
          '<div class="ac-col-2" style="min-width:45px"><span class="ac-form-badge">' + brand + '</span></div>' +
          '<div class="ac-col-3" style="min-width:26px; text-align:center; font-weight:700; color:' + stockColor + '">' + stock + '</div>' +
          '<div class="ac-col-3" style="min-width:75px">' + Utils.formatMoney(p.don_gia) + '</div>' +
          '</div>';
      }).join('');

      html += '<div class="ac-actions" style="display:flex;gap:8px;padding:12px;border-top:1px solid var(--border);background:var(--surface);position:sticky;bottom:-8px;margin:0 -8px -8px -8px;z-index:10;border-radius:0 0 12px 12px">' +
        '<button class="btn btn-ghost btn-sm" style="flex:1" onclick="OrderPage.closeAc()">Hủy</button>' +
        '<button id="btn-add-multi" class="btn btn-primary btn-sm" style="flex:1" onclick="OrderPage.addSelectedProds()">Thêm đã chọn</button>' +
        '</div>';
      list.innerHTML = html;
      list.classList.add('show');

      // Tận dụng UIUtils để tính toán vị trí thông minh (fixed position, chống bị che)
      if (window.UIControls && UIControls.utils) {
        UIControls.utils.computeDropdownPosition(input, list);
        _attachAcScroll();
        input.style.borderBottomLeftRadius = '0';
        input.style.borderBottomRightRadius = '0';
      }
    }, 400); // 400ms debounce
  }

  function selectAcSingle(code) {
    var input = document.getElementById('ac-input');
    input.value = code;
    document.getElementById('ac-list').classList.remove('show');
    input.style.borderBottomLeftRadius = '';
    input.style.borderBottomRightRadius = '';
    _detachAcScroll();
    addProductRow();
  }

  function toggleAcSelect(e, code) {
    if (e && e.target.tagName !== 'INPUT') {
      var chk = document.getElementById('chk-' + code);
      if (chk) chk.checked = !chk.checked;
    }

    var chk = document.getElementById('chk-' + code);
    if (chk) {
      var idx = multiSelectedCodes.indexOf(code);
      if (chk.checked && idx === -1) {
        multiSelectedCodes.push(code);
      } else if (!chk.checked && idx !== -1) {
        multiSelectedCodes.splice(idx, 1);
      }
    }

    document.querySelectorAll('.ac-table-row').forEach(function (row) {
      var cCode = row.querySelector('.chk-code');
      if (cCode) {
        var cVal = cCode.value;
        var numB = document.getElementById('chk-num-' + cVal);
        var pos = multiSelectedCodes.indexOf(cVal);
        if (pos !== -1) {
          cCode.checked = true;
          if (numB) { numB.textContent = (pos + 1); numB.style.display = 'flex'; }
        } else {
          cCode.checked = false;
          if (numB) { numB.style.display = 'none'; }
        }
      }
    });

    _updateMultiAddButton();
  }

  function _updateMultiAddButton() {
    var count = multiSelectedCodes.length;
    var btn = document.getElementById('btn-add-multi');
    if (btn) {
      btn.innerHTML = count > 0 ? ('Thêm ' + count + ' sản phẩm') : 'Thêm đã chọn';
    }
  }

  function closeAc() {
    if (acSearchTimer) clearTimeout(acSearchTimer);
    acSearchId++; // Vô hiệu hóa mọi cục API đang bị delay (nếu có)
    multiSelectedCodes = [];
    document.getElementById('ac-list').classList.remove('show');
    var input = document.getElementById('ac-input');
    if (input) {
      input.style.borderBottomLeftRadius = '';
      input.style.borderBottomRightRadius = '';
    }
    _detachAcScroll();
  }

  function addSelectedProds() {
    var codes = multiSelectedCodes;
    if (codes.length === 0) {
      showToast('Vui lòng chọn sản phẩm', false);
      return;
    }
    var added = 0;
    for (var i = codes.length - 1; i >= 0; i--) {
      var code = codes[i];
      var prod = cachedProds[code];
      if (prod && !orderRows.find(function (r) { return r.ten_hang_2 === code; })) {
        var nhomSize = prod.nhom_size || prod.nhom_hang || prod.Nhom_hang || prod.NhomHang || 'Nhóm 1';
        // Map tự động từ CategoryID (nhom_hang) sang NhomSize nếu API thiếu trường nhom_size
        var mapNhom = { 'TL': 'Nhóm 1', 'QA': 'Nhóm 2', 'SKU101': 'Nhóm 1', 'SKU102': 'Nhóm 3' };
        var mappedNhomSize = mapNhom[nhomSize] || mapNhom[nhomSize.toUpperCase()] || 'Nhóm 1';

        var sizes = [];
        if (prod.sizes_json && prod.sizes_json !== 'null') {
          try {
            var parsed = JSON.parse(prod.sizes_json);
            if (parsed && Array.isArray(parsed)) {
              var realSizes = parsed.map(function (s) { return s.Size; });
              sizes = cachedSizes.filter(function (s) {
                return realSizes.indexOf(s.size || s.Size || s.ten_size) !== -1;
              });
            }
          } catch (e) { console.error('Lỗi parse sizes_json', e); }
        }

        // Nếu sản phẩm chưa sinh SKU (sizes_json rỗng), fallback cho phép dùng toàn bộ bảng Size
        if (sizes.length === 0) {
          sizes = cachedSizes.slice();
        }

        sizes.sort(function (a, b) { return (a.stt || a.STT || 0) - (b.stt || b.STT || 0); });

        orderRows.unshift({ ten_hang_2: code, product: prod, sizes: sizes, quantities: {} });
        added++;
      }
    }
    if (added > 0) { renderMatrix(); showToast('Đã thêm ' + added + ' sản phẩm'); }
    else { showToast('Sản phẩm đã có trong đơn', false); }
    document.getElementById('ac-input').value = '';
    acSearch('');
    closeAc();
  }

  function addProductRow() {
    var code = document.getElementById('ac-input').value.trim();
    if (!code) { showToast('Vui lòng nhập sản phẩm', false); return; }
    var prod = cachedProds[code];
    if (!prod) { showToast('Không tìm thấy sản phẩm ' + code, false); return; }
    if (orderRows.find(function (r) { return r.ten_hang_2 === code; })) { showToast('Sản phẩm đã có trong đơn', false); return; }
    var nhomSize = prod.nhom_size || prod.nhom_hang || prod.Nhom_hang || prod.NhomHang || 'Nhóm 1';
    var mapNhom = { 'TL': 'Nhóm 1', 'QA': 'Nhóm 2', 'SKU101': 'Nhóm 1', 'SKU102': 'Nhóm 3' };
    var mappedNhomSize = mapNhom[nhomSize] || mapNhom[nhomSize.toUpperCase()] || 'Nhóm 1';

    var sizes = [];
    if (prod.sizes_json && prod.sizes_json !== 'null') {
      try {
        var parsed = JSON.parse(prod.sizes_json);
        if (parsed && Array.isArray(parsed)) {
          var realSizes = parsed.map(function (s) { return s.Size; });
          sizes = cachedSizes.filter(function (s) {
            return realSizes.indexOf(s.size || s.Size || s.ten_size) !== -1;
          });
        }
      } catch (e) { console.error('Lỗi parse sizes_json', e); }
    }

    if (sizes.length === 0) {
      sizes = cachedSizes.slice();
    }

    sizes.sort(function (a, b) { return (a.stt || a.STT || 0) - (b.stt || b.STT || 0); });

    orderRows.unshift({ ten_hang_2: code, product: prod, sizes: sizes, quantities: {} });
    document.getElementById('ac-input').value = '';
    acSearch('');
    renderMatrix();
    showToast('Đã thêm ' + code);
  }

  function renderMatrix() {
    var container = document.getElementById('matrix-container');
    if (!orderRows.length) {
      container.innerHTML = '<div class="empty-state" style="background:var(--surface); border-radius:12px; padding:32px; border:1px solid var(--border);"><span class="material-symbols-outlined">table_chart</span><span>Tìm và thêm sản phẩm để bắt đầu nhập số lượng</span></div>';
      _updateTotal(); return;
    }

    container.innerHTML = orderRows.map(function (row, ri) {
      var badgeHtml = '';
      var ctbh = document.getElementById('o-ctbh') ? document.getElementById('o-ctbh').value : '';
      if (ctbh) badgeHtml = '<span class="badge-success"><span class="material-symbols-outlined" style="font-size:12px">check</span> Đã áp CTKM</span>';

      var sizeRowsHtml = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(72px, 1fr)); gap: 12px; margin-top: 16px;">';
      sizeRowsHtml += row.sizes.map(function (s) {
        var sz = s.size || s.Size || s.ten_size || s.Ten_size || s.TenSize || s.tenSize || '?';
        var qty = row.quantities[sz] || '';
        var isFilled = qty > 0;
        var boxClass = isFilled ? 'size-box filled' : 'size-box';
        return '<div class="' + boxClass + '">' +
          '<div class="size-box-lbl">' + sz + '</div>' +
          '<input type="number" inputmode="numeric" min="0" placeholder="0" value="' + qty + '" oninput="OrderPage.updateQty(' + ri + ',\'' + sz + '\',this)">' +
          '</div>';
      }).join('');
      sizeRowsHtml += '</div>';

      return '<div class="card product-card">' +
        '<div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1px solid var(--border-light); padding-bottom:12px; gap:8px;">' +
        '<div style="flex:1; min-width:0;">' +
        '<div style="display:flex; flex-wrap:wrap; align-items:center; gap:6px 8px; margin-bottom:4px;">' +
        '<div style="font-size: 18px; font-weight:800; color:var(--primary); word-break: break-word;">' + row.ten_hang_2 + '</div>' +
        badgeHtml +
        '</div>' +
        '<div style="font-size: 14px; color:var(--muted);">' + (row.product.nhom_size || row.product.nhom_hang || 'TL') + ' | ' + (row.product.mau || 'Không màu') + ' | ' + Utils.formatMoney(row.product.don_gia || 0) + '</div>' +
        '</div>' +
        '<div style="display:flex; gap:8px;">' +
        '<button class="btn-icon" onclick="OrderPage.removeRow(' + ri + ')" title="Xóa sản phẩm" style="color:var(--danger)"><span class="material-symbols-outlined">delete</span></button>' +
        '</div>' +
        '</div>' +
        sizeRowsHtml +
        '</div>';
    }).join('');
    _updateTotal();
  }

  function updateQty(ri, size, inputEl) {
    var val = parseInt(inputEl.value) || 0;
    orderRows[ri].quantities[size] = val;
    if (val > 0) {
      inputEl.parentElement.classList.add('filled');
    } else {
      inputEl.parentElement.classList.remove('filled');
    }
    _updateTotal();
  }


  function removeRow(ri) { orderRows.splice(ri, 1); renderMatrix(); }

  function _updateTotal() {
    var qty = 0, money = 0;
    orderRows.forEach(function (r) { Object.entries(r.quantities).forEach(function (e) { if (e[1] > 0) { qty += e[1]; money += e[1] * r.product.don_gia; } }); });
    document.getElementById('total-qty').textContent = qty;
    document.getElementById('total-money').textContent = Utils.formatMoney(money);
    var oTongTien = document.getElementById('o-tong-tien');
    if (oTongTien) {
      oTongTien.value = Utils.formatMoney(money);
      oTongTien.dataset.value = money;
      calcChange();
    }
  }

  function calcChange() {
    var total = parseInt(document.getElementById('o-tong-tien').dataset.value || 0);
    var givenStr = document.getElementById('o-khach-dua').value;
    var given = givenStr ? parseInt(givenStr) : 0;
    var change = given - total;
    document.getElementById('o-tra-lai').value = Utils.formatMoney(change > 0 ? change : 0);
  }

  function _buildLines() {
    var ma_ctbh = document.getElementById('o-ctbh').value;
    var note = document.getElementById('o-notes').value || (_combos.note ? _combos.note.querySelector('input').value : '');
    var lines = [];
    orderRows.forEach(function (row) {
      var chi_tiet_size = [];
      var total_qty = 0;
      var total_money = 0;

      Object.entries(row.quantities).forEach(function (e) {
        var size = e[0], qty = parseInt(e[1]) || 0;
        if (qty > 0) {
          chi_tiet_size.push({ size: size, qty: qty });
          total_qty += qty;
          total_money += qty * (row.product.don_gia || 0);
        }
      });

      if (total_qty > 0) {
        lines.push({
          ten_hang_2: row.ten_hang_2,
          ten_hang: row.product.ten_hang_hoa,
          nhom_size: row.product.nhom_size,
          mau: row.product.mau,
          so_luong: total_qty,
          don_gia: row.product.don_gia,
          thanh_tien: total_money,
          ma_ctbh: ma_ctbh,
          ghi_chu: note,
          chi_tiet_size: chi_tiet_size
        });
      }
    });
    return lines;
  }

  function previewOrder() {
    if (!orderRows.length) { showToast('Vui lòng chọn sản phẩm và nhập số lượng', false); return; }

    // Đóng danh sách tìm kiếm (nếu đang mở) để không bị đè lên modal
    closeAc();

    // 1. Thu thập tất cả các size có số lượng > 0
    var uniqueSizes = [];
    var sizeMap = {};
    var totalQtyAll = 0;

    orderRows.forEach(function (row) {
      Object.entries(row.quantities).forEach(function (e) {
        var sz = e[0], q = parseInt(e[1]) || 0;
        if (q > 0) {
          totalQtyAll += q;
          if (!sizeMap[sz]) {
            sizeMap[sz] = true;
            uniqueSizes.push(sz);
          }
        }
      });
    });

    if (totalQtyAll === 0) { showToast('Vui lòng nhập số lượng', false); return; }

    // 2. Sắp xếp uniqueSizes theo thứ tự trong cachedSizes
    var allSizeNames = cachedSizes.map(function (s) {
      return s.size || s.Size || s.ten_size || s.Ten_size || s.TenSize || s.tenSize;
    });
    uniqueSizes.sort(function (a, b) {
      var idxA = allSizeNames.indexOf(a);
      var idxB = allSizeNames.indexOf(b);
      return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
    });

    // 3. Xây dựng Header
    var headHtml = '<tr><th style="min-width:120px">Sản phẩm</th><th>Màu</th>';
    uniqueSizes.forEach(function (sz) {
      headHtml += '<th style="text-align:center; min-width:40px">' + sz + '</th>';
    });
    headHtml += '<th style="text-align:center">Tổng</th><th style="text-align:right">Thành tiền</th></tr>';

    // 4. Xây dựng Body
    var totalMoneyAll = 0;
    var sizeTotals = {};
    uniqueSizes.forEach(function (sz) { sizeTotals[sz] = 0; });

    var bodyHtml = orderRows.map(function (row) {
      var rowQty = 0;
      var hasQty = false;

      var rowCells = uniqueSizes.map(function (sz) {
        var q = row.quantities[sz] || 0;
        if (q > 0) {
          rowQty += q;
          sizeTotals[sz] += q;
          hasQty = true;
        }
        return '<td style="text-align:center">' + (q > 0 ? '<strong>' + q + '</strong>' : '-') + '</td>';
      }).join('');

      if (!hasQty) return ''; // Bỏ qua sản phẩm không có số lượng

      var rowMoney = rowQty * (row.product.don_gia || 0);
      totalMoneyAll += rowMoney;

      return '<tr>' +
        '<td><div style="font-weight:800; color:var(--primary)">' + row.ten_hang_2 + '</div><div style="font-size:11px; color:var(--muted); white-space:normal">' + row.product.ten_hang_hoa + '</div></td>' +
        '<td><small>' + (row.product.mau || '—') + '</small></td>' +
        rowCells +
        '<td style="text-align:center; background:var(--bg); font-weight:bold">' + rowQty + '</td>' +
        '<td style="text-align:right; font-weight:bold">' + Utils.formatMoney(rowMoney) + '</td>' +
        '</tr>';
    }).join('');

    // 5. Xây dựng Footer
    var footHtml = '<tr style="font-weight:700; background:var(--bg)"><td colspan="2" style="text-align:right">Tổng cộng:</td>';
    uniqueSizes.forEach(function (sz) {
      footHtml += '<td style="text-align:center">' + sizeTotals[sz] + '</td>';
    });
    footHtml += '<td style="text-align:center; color:var(--primary)">' + totalQtyAll + '</td><td style="text-align:right; color:var(--accent)">' + Utils.formatMoney(totalMoneyAll) + '</td></tr>';

    // Cập nhật Modal
    document.getElementById('preview-head').innerHTML = headHtml;
    document.getElementById('preview-body').innerHTML = bodyHtml;
    document.getElementById('preview-foot').innerHTML = footHtml;

    var info = document.getElementById('preview-info');
    info.innerHTML = [
      '<div><strong>Người nhận:</strong> ' + (document.getElementById('o-kh-ten')?.value || '—') + '</div>',
      '<div><strong>Mã KH:</strong> ' + (document.getElementById('o-ma-kh')?.value || '—') + '</div>',
      '<div><strong>Địa chỉ:</strong> ' + (document.getElementById('o-kh-dc')?.value || '—') + '</div>',
    ].join('');

    openModal('modal-preview');
  }

  async function saveOrder() {
    var lines = _buildLines();
    if (!lines || lines.length === 0) {
      showToast('Vui lòng chọn ít nhất 1 sản phẩm', false);
      return;
    }

    var chiNhanh = _catValues.chi_nhanh.id || _catValues.chi_nhanh.name;
    var perm = _getUserPermission();

    if (!chiNhanh && perm.isAdmin) {
      showToast('Vui lòng chọn chi nhánh', false);
      return;
    }

    var kh_ten = document.getElementById('o-kh-ten').value.trim();
    var ma_kh = document.getElementById('o-ma-kh').value.trim();
    if (!ma_kh) { showToast('Vui lòng nhập mã khách hàng', false); return; }


    var order = {
      id: Utils.uuid(), // Generate ID
      so_ct: document.getElementById('o-so-ct').value,
      ngay_ct: document.getElementById('o-ngay').value,
      chi_nhanh: _catValues.chi_nhanh.id || _catValues.chi_nhanh.name,
      nvkd: _catValues.nvkd.id || _catValues.nvkd.name,
      nguoi_tao: document.getElementById('o-nguoi-tao').value,
      ma_kh: ma_kh,
      ma_dl: document.getElementById('o-ma-dl').value,
      kh_ten: document.getElementById('o-kh-ten').value.trim(),
      kh_dc: document.getElementById('o-kh-dc').value,
      nguon_don: document.getElementById('o-nguon-don').value || (_combos.source ? _combos.source.querySelector('input').value : ''),
      dien_giai: document.getElementById('o-remarks').value || (_combos.remark ? _combos.remark.querySelector('input').value : ''),
      ghi_chu: document.getElementById('o-notes').value || (_combos.note ? _combos.note.querySelector('input').value : ''),
      pt_giao: document.getElementById('o-pt-giao').value,
      nguoi_giao: document.getElementById('o-nguoi-giao').value || (_combos.delivery ? _combos.delivery.querySelector('input').value : ''),
      dieu_khoan: _catValues.dieu_khoan.id || _catValues.dieu_khoan.name,
      ht_thanh_toan: _catValues.ht_tt.id || _catValues.ht_tt.name,
      ngay_tt: document.getElementById('o-ngay-tt').value,
      khach_dua: document.getElementById('o-khach-dua').value,
      ma_ctbh: document.getElementById('o-ctbh').value,
      total_qty: lines.reduce(function (s, l) { return s + l.so_luong; }, 0),
      total_money: lines.reduce(function (s, l) { return s + l.thanh_tien; }, 0),
      lines: lines, created_at: new Date().toISOString()
    };

    if (!API_CONFIG.BASE_URL) {
      showToast('Hệ thống đang chạy offline, không thể lưu đơn.', false);
      return;
    }

    try {
      const res = await OrderService.createOrder(order);


      // Kiểm tra kết quả trả về từ SQL Server
      let isSuccess = true;
      let actualSoCT = order.so_ct;
      let msg = '';

      if (res && res.records && res.records[0]) {
        if (res.records[0].Success !== 1 && res.records[0].Success !== '1') {
          isSuccess = false;
          msg = res.records[0].Message || 'Lỗi từ CSDL';
        } else {
          actualSoCT = res.records[0].DocumentID || actualSoCT;
          msg = 'Đã lưu đơn: ' + actualSoCT;
        }
      } else if (res && res[0]) {
        if (res[0].Success !== 1 && res[0].Success !== '1') {
          isSuccess = false;
          msg = res[0].Message || 'Lỗi từ CSDL';
        } else {
          actualSoCT = res[0].DocumentID || actualSoCT;
          msg = 'Đã lưu đơn: ' + actualSoCT;
        }
      } else {
        msg = 'Đã lưu đơn: ' + actualSoCT;
      }

      if (!isSuccess) {
        throw new Error(msg);
      }

      closeModal('modal-preview');

      var actionBtn = '<a href="#/order-detail?id=' + encodeURIComponent(actualSoCT) + '" style="color:#000; background:var(--accent); padding:4px 10px; border-radius:4px; font-weight:600; text-decoration:none; display:inline-block;">Xem đơn</a>';
      showToast(msg, true, actionBtn, 8000);
      render(document.getElementById('app-content'));
    } catch (err) {
      console.warn('[OrderService] Lỗi tạo đơn qua API:', err);

      showToast(err.message || 'Lỗi tạo đơn qua API. Vui lòng thử lại.', false);
    }
  }


  function clearOrder() {
    ConfirmModal.show({
      title: 'Hủy đơn hàng',
      message: 'Bạn có chắc muốn xóa toàn bộ sản phẩm đã chọn?',
      confirmText: 'Xác nhận xóa',
      confirmClass: 'btn-danger',
      onConfirm: function () {
        render(document.getElementById('app-content'));
      }
    });
  }

  function clearSearch() {
    var inp = document.getElementById('ac-input');
    if (inp) { inp.value = ''; inp.focus(); acSearch(''); }
  }

  return {
    render: render, acSearch: acSearch, toggleAcSelect: toggleAcSelect, closeAc: closeAc,
    addSelectedProds: addSelectedProds, addProductRow: addProductRow, selectAcSingle: selectAcSingle,
    updateQty: updateQty, removeRow: removeRow, previewOrder: previewOrder,
    saveOrder: saveOrder, clearOrder: clearOrder, clearSearch: clearSearch,
    updateInfoSummary: updateInfoSummary, calcChange: calcChange,
    createNewCustomer: createNewCustomer, finishOrderInfo: finishOrderInfo
  };

  async function _openCreateCustomerModal() {
    try {
      showToast('Đang tải danh mục Tỉnh/Thành & Nhóm khách...', true);

      // Load Provinces
      if (_cachedProvinces.length === 0) {
        var res = await _searchCategory('Location', '', false, 1);
        if (Array.isArray(res)) {
          _cachedProvinces = res;
        }
      }

      // Load Object Groups
      if (_cachedObjectGroups.length === 0) {
        var resG = await _searchCategory('ObjectGroup', '', false, 1);
        if (Array.isArray(resG)) {
          _cachedObjectGroups = resG;
        }
      }

      // Load Dealers
      var dealers = await CategoryService.getCategories('Dealer');

      var _t = document.getElementById('toast');
      if (_t) _t.classList.remove('show'); // Ẩn loading

      var content = document.createElement('div');
      content.id = 'form-create-customer';
      content.style.padding = '16px 0';
      content.innerHTML = `
        <div class="modal-body" style="padding-right: 8px;">
          <div class="form-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">

            <!-- THÔNG TIN CHUNG -->
            <div class="form-group span2"
              style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-bottom: 8px;">
              <h4 style="margin: 0; color: var(--primary);">Thông tin cơ bản</h4>
            </div>

            <div class="form-group">
              <label>Tên khách hàng *</label>
              <input id="cust-name" class="ui-input" placeholder="Nhập tên khách hàng..." required>
            </div>

            <div class="form-group">
              <label>Số điện thoại</label>
              <input id="cust-phone" class="ui-input" placeholder="Nhập số điện thoại...">
            </div>

            <div class="form-group">
              <label>Nhóm khách hàng *</label>
              <select id="cust-group" class="ui-input" required>
                <option value="" disabled selected>-- Chọn nhóm khách hàng --</option>
                ${_cachedObjectGroups.map(g => `<option value="${g.id}">${g.name || g.id}</option>`).join('')}
              </select>
            </div>

            <div class="form-group" id="cust-dealer-group" style="display: none;">
              <label>Đại lý / NPP quản lý</label>
              <select id="cust-dealer" class="ui-input">
                <option value="">-- Chọn đại lý quản lý --</option>
                ${dealers.map(d => `<option value="${d.id}">${d.name || d.id}</option>`).join('')}
              </select>
            </div>

            <div class="form-group span2"
              style="grid-column: span 2; display: grid; grid-template-columns: 1fr 2fr; gap: 16px; align-items: end;">
              <div class="form-group" style="margin-bottom: 0;">
                <label>Tỉnh/Thành phố * <span style="font-size:11px; color:var(--text-secondary)">(Phân loại)</span></label>
                <select id="cust-location" class="ui-input" required>
                  <option value="" disabled selected>-- Chọn Tỉnh/Thành phố --</option>
                  ${_cachedProvinces.map(l => `<option value="${l.id}">${l.name || l.id}</option>`).join('')}
                </select>
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label>Địa chỉ * <span style="font-size:11px; color:var(--text-secondary)">(Gõ tỉnh/thành phố ở cuối để tự sinh mã vùng)</span></label>
                <input id="cust-address" class="ui-input" placeholder="VD: Số 12 Nguyễn Trãi, Thanh Xuân, Hà Nội" required>
              </div>
            </div>

            <div class="form-group span2" style="grid-column: span 2;">
              <label>Ghi chú khách hàng</label>
              <textarea id="cust-notes" class="ui-input" rows="2"
                placeholder="Ghi chú về khách hàng (chính sách đặc biệt, thói quen...)" style="resize:vertical;"></textarea>
            </div>

            <!-- THÔNG TIN TÀI KHOẢN -->
            <div class="form-group span2" id="cust-account-section"
              style="grid-column: span 2; margin-top: 12px; padding: 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--bg);">
              <label
                style="display: flex; align-items: center; justify-content: flex-start; gap: 8px; cursor: pointer; font-weight: 600; margin-bottom: 12px;">
                <input type="checkbox" id="cust-has-account" style="width: auto; height: auto; margin: 0; cursor: pointer;">
                <span>Tạo tài khoản đăng nhập liên kết</span>
              </label>

              <div id="cust-account-fields"
                style="display: none; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 8px;">
                <div class="form-group">
                  <label>Tên đăng nhập *</label>
                  <input id="cust-username" class="ui-input" placeholder="Mặc định dùng Mã khách hàng...">
                </div>
                <div class="form-group" id="cust-initial-password-group">
                  <label>Mật khẩu khởi tạo *</label>
                  <input id="cust-password" class="ui-input" type="password" placeholder="Nhập mật khẩu tài khoản...">
                </div>
              </div>
            </div>

          </div>
        </div>
      `;

      var perm = _getUserPermission();
      var dealerGroupEl = content.querySelector('#cust-dealer-group');
      if (dealerGroupEl) {
        // Chỉ cho phép nhân viên nội bộ (không phải Đại lý/Agent) chọn Đại lý quản lý
        if (!perm.isAgent) {
          dealerGroupEl.style.display = 'block';
        } else {
          dealerGroupEl.style.display = 'none';
        }
      }

      // Chọn nhóm mặc định nếu là Agent con
      var defaultNhom = perm.isAgent ? perm.objID : '';
      if (defaultNhom) {
        var selectGroup = content.querySelector('#cust-group');
        if (selectGroup) {
          selectGroup.value = defaultNhom;
        }
      }

      // Xử lý sự kiện checkbox account
      var chkHasAcc = content.querySelector('#cust-has-account');
      var fieldsDiv = content.querySelector('#cust-account-fields');
      chkHasAcc.addEventListener('change', function () {
        fieldsDiv.style.display = chkHasAcc.checked ? 'grid' : 'none';
      });

      var footer = document.createElement('div');
      footer.style.display = 'flex';
      footer.style.gap = '12px';
      footer.style.width = '100%';

      var btnCancel = document.createElement('button');
      btnCancel.className = 'btn btn-ghost';
      btnCancel.style.flex = '1';
      btnCancel.textContent = 'Hủy';
      btnCancel.onclick = function () {
        if (_createCustomerModalInstance) _createCustomerModalInstance.close();
      };

      var btnSave = document.createElement('button');
      btnSave.className = 'btn btn-primary';
      btnSave.style.flex = '2';
      btnSave.innerHTML = '<span class="material-symbols-outlined">save</span> Lưu & Chọn khách hàng';
      btnSave.onclick = function () {
        createNewCustomer();
      };

      footer.appendChild(btnCancel);
      footer.appendChild(btnSave);

      _customerModalContent = content;

      _createCustomerModalInstance = UIModal.show({
        id: 'modal-create-customer-wrapper',
        title: 'Tạo khách hàng mới',
        width: '800px',
        content: content,
        footer: footer
      });

    } catch (err) {
      console.error('[OrderPage] Lỗi mở modal:', err);
      showToast('Lỗi mở modal: ' + err.message, false);
    }
  }

  async function createNewCustomer() {
    var form = _customerModalContent;
    if (!form) return;

    var name = form.querySelector('#cust-name').value.trim();
    var phone = form.querySelector('#cust-phone').value.trim();
    var group_id = form.querySelector('#cust-group').value;
    var location_id = form.querySelector('#cust-location').value;
    var address = form.querySelector('#cust-address').value.trim();
    var notes = form.querySelector('#cust-notes').value.trim();

    if (!name) { showToast('Vui lòng nhập Tên khách hàng!', false); return; }
    if (!group_id) { showToast('Vui lòng chọn Nhóm khách hàng!', false); return; }
    if (!location_id) { showToast('Vui lòng chọn Tỉnh/Thành phố hợp lệ!', false); return; }
    if (!address) { showToast('Vui lòng nhập Địa chỉ khách hàng!', false); return; }

    var hasAccount = form.querySelector('#cust-has-account').checked;
    var username = form.querySelector('#cust-username').value.trim();
    var usergroup = ''; // SQL tự gán là KHACH
    var password = form.querySelector('#cust-password').value;

    if (hasAccount) {
      if (!password) { showToast('Vui lòng nhập mật khẩu khởi tạo tài khoản!', false); return; }
      if (password.length < 4) { showToast('Mật khẩu tối thiểu phải từ 4 ký tự!', false); return; }
    }

    var perm = _getUserPermission();
    var curUser = perm.user;
    var nhaPhanPhoi = '';
    if (perm.isAgent) {
      nhaPhanPhoi = perm.objID || '';
    } else {
      var dealerSelect = form.querySelector('#cust-dealer');
      nhaPhanPhoi = dealerSelect ? dealerSelect.value : '';
    }

    var branchId = perm.user.BranchID || '';

    // Dữ liệu khách hàng để gửi API
    var customerData = {
      ObjectID: '',
      ObjectName: name,
      Phone: phone,
      Address: address,
      ObjectGroupID: group_id,
      LocationID: location_id,
      EmployeeID: perm.empID || '',
      BranchID: branchId,
      Notes: notes,
      NhaPhanPhoi: nhaPhanPhoi,
      UserLogin: curUser.id || curUser.UserName || 'Admin'
    };

    try {
      showToast('Đang lưu thông tin khách hàng...', true);
      // 1. Lưu khách hàng
      var res = await CustomerService.save(customerData);

      var generatedID = '';
      if (res) {
        var resObj = Array.isArray(res) ? res[0] : res;
        generatedID = resObj.ObjectID || resObj.ObjectID_Out || resObj.id || resObj.Id || '';
      }

      if (!generatedID) {
        throw new Error('Không nhận được mã khách hàng mới từ hệ thống!');
      }

      // 2. Tạo tài khoản nếu được chọn
      if (hasAccount) {
        var finalUsername = username || generatedID;
        var userData = {
          UserName: finalUsername,
          HoTen: name,
          UserGroupID: usergroup,
          ObjectID: generatedID,
          Disable: 0
        };
        await CustomerService.saveUserAccount(userData);

        if (password) {
          try {
            await CustomerService.resetPassword(finalUsername, '', password);
          } catch (pwErr) {
            console.warn('[OrderPage] Khởi tạo mật khẩu thất bại:', pwErr);
            showToast('Tài khoản đã tạo nhưng thiết lập mật khẩu khởi tạo gặp lỗi!', false);
          }
        }
      }

      showToast('Thêm khách hàng mới thành công!', true);

      // Tự động chọn khách hàng mới này cho đơn hàng
      document.getElementById('o-ma-kh').value = generatedID;
      document.getElementById('o-kh-ten').value = name;
      document.getElementById('o-kh-dc').value = address;
      _catValues.khach_hang = { id: generatedID, name: name };

      if (_combos.kh) {
        if (typeof _combos.kh.clearCache === 'function') {
          _combos.kh.clearCache();
        }
        var inputEl = _combos.kh.querySelector('input');
        if (inputEl) inputEl.value = name;
      }
      updateInfoSummary();

      if (_createCustomerModalInstance) {
        _createCustomerModalInstance.close();
      }
    } catch (err) {
      console.error(err);
      showToast('Lỗi khi lưu khách hàng: ' + err.message, false);
    }
  }

})();
