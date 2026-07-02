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

  async function _loadUserPermission() {
    try {
      var res = await _searchCategory('UserPermission', '', false, 1);
      if (res && res[0]) {
        _userPerm.isAdmin = !!res[0].isAdmin;
        _userPerm.isManager = !!res[0].isManager;
        _userPerm.isAgent = !!res[0].isAgent;
      }
    } catch (err) {
      console.warn('[OrderPage] Lỗi load quyền người dùng:', err);
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
    if (loai === 'Customer') {
      if (!ignoreBranchFilter && _catValues && _catValues.chi_nhanh && _catValues.chi_nhanh.id) {
        q.chinhanh = _catValues.chi_nhanh.id;
      } else {
        q.chinhanh = ''; // ensure chinhanh is defined
      }
      if (page) {
        q.chinhanh += '|PAGE:' + page;
      }
      // TRÙM CUỐI: Bọc tham số quyền vào chinhanh để lách qua C# Backend
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

        // Đảm bảo phải có mỏ neo |PAGE: để SQL API_DanhMuc có thể parse
        if (!page) {
          q.chinhanh += '|PAGE:1';
        }

        q.chinhanh += '|ROLE:' + role + '|EMP:' + empID + '|OBJ:' + objID;
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
          showAddNew: true,
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
    createNewCustomer: createNewCustomer, finishOrderInfo: finishOrderInfo,
    addCustomerRow: addCustomerRow, removeCustomerRow: removeCustomerRow
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
      
      showToast('', true); // Ẩn loading

      var content = document.createElement('div');
      content.id = 'form-create-customer';
      content.style.padding = '16px 0';
      content.innerHTML = `
        <style>
          #customer-grid-table th {
            font-size: 12px;
            font-weight: 700;
            color: var(--text);
            text-transform: uppercase;
            letter-spacing: 0.03em;
            padding: 12px 10px !important;
            border-bottom: 2px solid var(--border) !important;
          }
          #customer-grid-table td {
            vertical-align: middle !important;
            padding: 8px 6px !important;
            border-bottom: 1px solid var(--border) !important;
          }
          .customer-grid-input {
            width: 100% !important;
            height: 38px !important;
            padding: 8px 12px !important;
            border: 1px solid var(--border) !important;
            border-radius: 8px !important;
            font-size: 13px !important;
            outline: none !important;
            background: var(--surface) !important;
            color: var(--text) !important;
            transition: all 0.2s ease !important;
            box-shadow: none !important;
          }
          .customer-grid-input:focus {
            border-color: var(--primary) !important;
            box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.15) !important;
          }
          select.customer-grid-input {
            appearance: none !important;
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>") !important;
            background-repeat: no-repeat !important;
            background-position: right 10px center !important;
            background-size: 16px !important;
            padding-right: 32px !important;
            cursor: pointer !important;
          }
          #form-create-customer .btn-add-row {
            border: 1px dashed var(--border) !important;
            background: transparent !important;
            color: var(--text) !important;
            padding: 8px 16px !important;
            font-weight: 600 !important;
            border-radius: 8px !important;
            transition: all 0.2s ease !important;
          }
          #form-create-customer .btn-add-row:hover {
            border-color: var(--primary) !important;
            color: var(--primary) !important;
            background: rgba(251, 191, 36, 0.05) !important;
          }
        </style>
        <div style="overflow-x: auto; margin-bottom: 16px; border: 1px solid var(--border); border-radius: 8px; box-shadow: var(--shadow-sm);">
          <table class="data-table" id="customer-grid-table" style="margin: 0; width: 100%; min-width: 950px; border-collapse: collapse;">
            <thead>
              <tr style="background: var(--surface);">
                <th style="width: 50px; text-align: center;">STT</th>
                <th style="width: 220px;">Tên khách hàng <span style="color:var(--accent)">*</span></th>
                <th style="width: 140px;">Điện thoại</th>
                <th style="width: 180px;">Tỉnh/Thành phố <span style="color:var(--accent)">*</span></th>
                <th style="width: 180px;">Nhóm khách <span style="color:var(--accent)">*</span></th>
                <th>Địa chỉ giao hàng</th>
                <th style="width: 60px; text-align: center;">Xóa</th>
              </tr>
            </thead>
            <tbody style="font-size: 13px;">
              <!-- Dynamic customer rows -->
            </tbody>
          </table>
        </div>
        <button class="btn btn-add-row" onclick="OrderPage.addCustomerRow()" style="display: flex; align-items: center; gap: 8px;">
          <span class="material-symbols-outlined" style="font-size: 18px;">add</span> Thêm dòng mới
        </button>
      `;

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
        width: '1050px',
        content: content,
        footer: footer
      });

      // Thêm dòng đầu tiên
      _addCustomerGridRow();
    } catch (err) {
      console.error('[OrderPage] Lỗi mở modal:', err);
      showToast('Lỗi mở modal: ' + err.message, false);
    }
  }

  function _addCustomerGridRow() {
    try {
      var tbody = null;
      if (_customerModalContent) {
        tbody = _customerModalContent.querySelector('#customer-grid-table tbody');
      }
      if (!tbody) {
        tbody = document.querySelector('#customer-grid-table tbody');
      }
      if (!tbody) return;

      // Options cho Tỉnh thành
      var optTinh = '<option value="">-- Chọn Tỉnh/Thành --</option>';
      _cachedProvinces.forEach(function (loc) {
        optTinh += `<option value="${loc.id}">${loc.name}</option>`;
      });

      // Options cho Nhóm khách hàng
      var optNhom = '<option value="">-- Chọn Nhóm khách --</option>';
      _cachedObjectGroups.forEach(function (g) {
        optNhom += `<option value="${g.id}">${g.name}</option>`;
      });

      var perm = _getUserPermission();
      var defaultNhom = perm.isAgent ? perm.objID : ''; // Tự động chọn mã đại lý cho Agent con

      var rowCount = tbody.querySelectorAll('tr').length;
      var tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="text-align: center; vertical-align: middle; padding: 6px; border-bottom: 1px solid var(--border);">${rowCount + 1}</td>
        <td style="padding: 6px; border-bottom: 1px solid var(--border);"><input type="text" class="ui-input customer-grid-input grid-input-ten" placeholder="Tên khách hàng"></td>
        <td style="padding: 6px; border-bottom: 1px solid var(--border);"><input type="text" class="ui-input customer-grid-input grid-input-sdt" placeholder="Số điện thoại"></td>
        <td style="padding: 6px; border-bottom: 1px solid var(--border);"><select class="ui-input customer-grid-input grid-input-tinh">${optTinh}</select></td>
        <td style="padding: 6px; border-bottom: 1px solid var(--border);"><select class="ui-input customer-grid-input grid-input-nhom">${optNhom}</select></td>
        <td style="padding: 6px; border-bottom: 1px solid var(--border);"><input type="text" class="ui-input customer-grid-input grid-input-dc" placeholder="Địa chỉ giao hàng"></td>
        <td style="text-align: center; vertical-align: middle; padding: 6px; border-bottom: 1px solid var(--border);">
          <button class="btn-icon text-danger btn-xoa-dong" onclick="OrderPage.removeCustomerRow(this)" style="padding: 4px; display: inline-flex; align-items: center; justify-content: center;">
            <span class="material-symbols-outlined" style="font-size: 18px;">delete</span>
          </button>
        </td>
      `;
      tbody.appendChild(tr);

      // Pre-select group if available
      if (defaultNhom) {
        var selNhom = tr.querySelector('.grid-input-nhom');
        if (selNhom) {
          selNhom.value = defaultNhom;
        }
      }

      _reindexCustomerRows();
    } catch (err) {
      console.error('[OrderPage] Lỗi thêm dòng:', err);
      showToast('Lỗi thêm dòng: ' + err.message, false);
    }
  }

  function _reindexCustomerRows() {
    try {
      var tbody = null;
      if (_customerModalContent) {
        tbody = _customerModalContent.querySelector('#customer-grid-table tbody');
      }
      if (!tbody) {
        tbody = document.querySelector('#customer-grid-table tbody');
      }
      if (!tbody) return;

      var rows = tbody.querySelectorAll('tr');
      rows.forEach(function (tr, index) {
        var firstCell = tr.querySelector('td');
        if (firstCell) {
          firstCell.textContent = index + 1;
        }
        var btn = tr.querySelector('.btn-xoa-dong');
        if (btn) {
          btn.disabled = (rows.length <= 1);
          btn.style.opacity = (rows.length <= 1) ? '0.3' : '1';
          btn.style.cursor = (rows.length <= 1) ? 'not-allowed' : 'pointer';
        }
      });
    } catch (err) {
      console.error('[OrderPage] Lỗi reindex dòng:', err);
      showToast('Lỗi sắp xếp lại dòng: ' + err.message, false);
    }
  }

  function addCustomerRow() {
    _addCustomerGridRow();
  }

  function removeCustomerRow(btn) {
    var tr = btn.closest('tr');
    if (tr) {
      tr.remove();
      _reindexCustomerRows();
    }
  }

  async function createNewCustomer() {
    var tbody = null;
    if (_customerModalContent) {
      tbody = _customerModalContent.querySelector('#customer-grid-table tbody');
    }
    if (!tbody) {
      tbody = document.querySelector('#customer-grid-table tbody');
    }
    if (!tbody) return;
    var rows = tbody.querySelectorAll('tr');
    if (rows.length === 0) return;

    var customersList = [];
    var perm = _getUserPermission();
    var branchId = perm.user.BranchID || '';

    for (var i = 0; i < rows.length; i++) {
      var tr = rows[i];
      var ten = tr.querySelector('.grid-input-ten').value.trim();
      var sdt = tr.querySelector('.grid-input-sdt').value.trim();
      var tinh = tr.querySelector('.grid-input-tinh').value;
      var nhom = tr.querySelector('.grid-input-nhom').value;
      var dc = tr.querySelector('.grid-input-dc').value.trim();

      if (!ten) {
        showToast('Dòng số ' + (i + 1) + ': Vui lòng điền Tên khách hàng', false);
        return;
      }
      if (!tinh) {
        showToast('Dòng số ' + (i + 1) + ': Vui lòng chọn Tỉnh/Thành phố', false);
        return;
      }
      if (!nhom) {
        showToast('Dòng số ' + (i + 1) + ': Vui lòng chọn Nhóm khách hàng', false);
        return;
      }

      customersList.push({
        ObjectID: '',
        ObjectName: ten,
        Phone: sdt,
        Address: dc,
        LocationID: tinh,
        ObjectGroupID: nhom,
        EmployeeID: perm.empID || '',
        BranchID: branchId,
        isDefault: false
      });
    }

    // 2. Tiến hành lưu từng dòng
    try {
      showToast('Đang lưu danh sách khách hàng...', true);
      var lastSavedCust = null;

      for (var j = 0; j < customersList.length; j++) {
        var cust = customersList[j];
        var res = await CategoryService.saveCustomer(cust);
        if (res) {
          var resObj = Array.isArray(res) ? res[0] : res;
          // Cập nhật ObjectID được sinh tự động từ database
          var generatedID = resObj.ObjectID || resObj.ObjectID_Out || resObj.id || resObj.Id || '';
          if (generatedID) {
            cust.ObjectID = generatedID;
          }
          lastSavedCust = cust;
        }
      }

      showToast('Đã tạo thành công ' + customersList.length + ' khách hàng', true);

      // Tự động chọn khách hàng cuối cùng vừa tạo cho đơn hàng
      if (lastSavedCust) {
        document.getElementById('o-ma-kh').value = lastSavedCust.ObjectID;
        document.getElementById('o-kh-ten').value = lastSavedCust.ObjectName;
        document.getElementById('o-kh-dc').value = lastSavedCust.Address || '';

        if (_combos.kh) {
          if (typeof _combos.kh.clearCache === 'function') {
            _combos.kh.clearCache();
          }
          _combos.kh.querySelector('input').value = lastSavedCust.ObjectName;
        }
        updateInfoSummary();
      }

      if (_createCustomerModalInstance) {
        _createCustomerModalInstance.close();
      }
    } catch (err) {
      showToast('Lỗi khi lưu khách hàng: ' + err.message, false);
    }
  }

})();
