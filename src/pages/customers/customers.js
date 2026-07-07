var CustomersPage = (function () {
  var $container;
  var currentPage = 1;
  var itemsPerPage = 20;
  var customersList = [];
  var objectGroups = [];
  var employees = [];
  var locations = [];
  var branches = [];
  var payTypes = [];
  var payTerms = [];
  var userGroups = [];
  var dealers = [];

  function render(containerElement) {
    $container = containerElement;
    $container.classList.add('is-full-width');

    return Router.fetchTemplate('src/pages/customers/customers.html').then(function (html) {
      $container.innerHTML = html;
      _init();
    });
  }

  async function _init() {
    try {
      // 1. Tải toàn bộ danh mục cho dropdowns
      const [groupsData, empsData, locsData, branchData, payTypeData, payTermData, userGroupData, dealersData] = await Promise.all([
        CategoryService.getCategories('ObjectGroup'),
        CategoryService.getCategories('Employee'),
        CategoryService.getCategories('Location'),
        CategoryService.getCategories('Branch'),
        CategoryService.getCategories('PaymentType'),
        CategoryService.getCategories('PaymentTerm'),
        CategoryService.getCategories('UserGroup'),
        CategoryService.getCategories('Dealer')
      ]);

      objectGroups = groupsData;
      employees = empsData;
      locations = locsData;
      branches = branchData;
      payTypes = payTypeData;
      payTerms = payTermData;
      userGroups = userGroupData;
      dealers = dealersData;

      // 2. Populate dữ liệu vào các combobox dropdown
      _populateDropdowns();

      // 3. Tải danh sách khách hàng và hiển thị
      await _fetchAndRender();
    } catch (err) {
      console.error('[CustomersPage] Khởi tạo thất bại:', err);
      showToast('Không tải được danh sách danh mục hỗ trợ', false);
    }
  }

  function _populateDropdowns() {
    // Dropdown bộ lọc Nhóm KH ở thanh tìm kiếm
    const filterGroupEl = document.getElementById('customer-filter-group');
    if (filterGroupEl) {
      filterGroupEl.innerHTML = '<option value="">Tất cả Nhóm KH</option>' +
        objectGroups.map(g => `<option value="${g.id}">${g.name || g.id}</option>`).join('');
    }

    // Modal Dropdowns
    const groupEl = document.getElementById('cust-group');
    if (groupEl) {
      groupEl.innerHTML = '<option value="" disabled selected>-- Chọn nhóm khách hàng --</option>' +
        objectGroups.map(g => `<option value="${g.id}">${g.name || g.id}</option>`).join('');
    }

    const locEl = document.getElementById('cust-location');
    if (locEl) {
      locEl.innerHTML = '<option value="" disabled selected>-- Chọn Tỉnh/Thành phố --</option>' +
        locations.map(l => `<option value="${l.id}">${l.name || l.id}</option>`).join('');
    }

    const empEl = document.getElementById('cust-employee');
    if (empEl) {
      if (employees) {
        empEl.innerHTML = '<option value="">-- Chọn nhân viên --</option>' +
          employees.map(e => `<option value="${e.id}">${e.id} - ${e.name}</option>`).join('');
      } else {
        empEl.innerHTML = '<option value="">-- Trống --</option>';
      }
    }

    const branchEl = document.getElementById('cust-branch');
    if (branchEl) {
      branchEl.innerHTML = '<option value="">-- Chọn chi nhánh --</option>' +
        branches.map(b => `<option value="${b.id}">${b.name || b.id}</option>`).join('');
    }

    const payTypeEl = document.getElementById('cust-paytype');
    if (payTypeEl) {
      if (payTypes) {
        payTypeEl.innerHTML = '<option value="">-- Hình thức --</option>' +
          payTypes.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
      }
    }

    const payTermEl = document.getElementById('cust-payterm');
    if (payTermEl) {
      if (payTerms) {
        payTermEl.innerHTML = '<option value="">-- Điều khoản --</option>' +
          payTerms.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
      }
    }

    const userGroupEl = document.getElementById('cust-usergroup');
    if (userGroupEl) {
      if (userGroups && userGroups.length > 0) {
        userGroupEl.innerHTML = userGroups.map(ug => `<option value="${ug.id}">${ug.name}</option>`).join('');
      } else {
        userGroupEl.innerHTML = '<option value="">-- Trống --</option>';
      }
    }

    const dealerEl = document.getElementById('cust-dealer');
    if (dealerEl) {
      dealerEl.innerHTML = '<option value="">-- Chọn đại lý quản lý --</option>' +
        dealers.map(d => `<option value="${d.id}">${d.name || d.id}</option>`).join('');
    }
  }

  var gridApi = null;

  function _initGrid(customers) {
    const container = document.getElementById('customers-grid-container');
    if (!container) return;

    const gridOptions = {
      pagination: false,
      columnDefs: [
        { field: 'customer_id', headerName: (typeof t !== 'undefined' ? t('customers.col.id') : 'Mã KH'), cellStyle: { fontWeight: '700' }, width: 120, minWidth: 100 },
        { field: 'name', headerName: (typeof t !== 'undefined' ? t('customers.col.name') : 'Tên khách hàng'), minWidth: 160 },
        { field: 'phone', headerName: (typeof t !== 'undefined' ? t('customers.col.phone') : 'Điện thoại'), width: 130, minWidth: 110, valueFormatter: p => p.value || '-' },
        { field: 'address', headerName: (typeof t !== 'undefined' ? t('customers.col.address') : 'Địa chỉ'), minWidth: 200, tooltipField: 'address' },
        { field: 'employee_name', headerName: (typeof t !== 'undefined' ? t('customers.col.employee') : 'Nhân viên quản lý'), minWidth: 150, valueFormatter: p => p.value || p.data.employee_id || '-' },
        { field: 'group_name', headerName: (typeof t !== 'undefined' ? t('customers.col.group') : 'Nhóm khách hàng'), minWidth: 140, valueFormatter: p => p.value || p.data.group_id || '-' },
        {
          field: 'username',
          headerName: (typeof t !== 'undefined' ? t('customers.col.username') : 'Tài khoản'),
          minWidth: 140,
          cellRenderer: function (params) {
            const c = params.data;
            if (!c.username) return '<span style="color:var(--text-secondary, #6b7280); font-style:italic;">' + (typeof t !== 'undefined' ? t('customers.status.no_account') : 'Chưa tạo') + '</span>';
            const isUserDisabled = c.user_disable === true || c.user_disable == 1 || c.user_disable === 'true' || c.user_disable === '1';
            const statusLabel = isUserDisabled
              ? (typeof t !== 'undefined' ? t('customers.status.locked_account') : '[TK Bị Khóa]')
              : (typeof t !== 'undefined' ? t('customers.status.active_account') : '[TK Mở]');
            return `<div style="display:flex; flex-direction:column; gap:2px; line-height: 1.2; padding: 4px 0;">
                      <strong>${c.username}</strong>
                      <span style="font-size:10px; color:${isUserDisabled ? 'var(--danger, #ef4444)' : 'var(--success, #10b981)'}">${statusLabel}</span>
                    </div>`;
          }
        },
        {
          field: 'is_disable',
          headerName: (typeof t !== 'undefined' ? t('customers.col.status') : 'Trạng thái'),
          width: 120,
          cellRenderer: function (params) {
            const c = params.data;
            const isDisabled = c.is_disable === true || c.is_disable == 1 || c.is_disable === 'true' || c.is_disable === '1';
            const label = isDisabled
              ? (typeof t !== 'undefined' ? t('customers.status.locked') : 'Đã khóa')
              : (typeof t !== 'undefined' ? t('customers.status.active') : 'Hoạt động');
            return isDisabled
              ? `<span class="badge badge-red">${label}</span>`
              : `<span class="badge badge-green">${label}</span>`;
          }
        },
        {
          headerName: (typeof t !== 'undefined' ? t('table.col.action') : 'Thao tác'),
          sortable: false,
          filter: false,
          floatingFilter: false,
          width: 160,
          cellRenderer: function (params) {
            const c = params.data;
            const isUserDisabled = c.user_disable === true || c.user_disable == 1 || c.user_disable === 'true' || c.user_disable === '1';

            const unlockTitle = typeof t !== 'undefined' ? t('customers.action.unlock') : 'Mở khóa tài khoản';
            const lockTitle = typeof t !== 'undefined' ? t('customers.action.lock') : 'Khóa tài khoản';
            const resetPwTitle = typeof t !== 'undefined' ? t('customers.action.reset_pw') : 'Đặt lại mật khẩu';

            const btnToggleLock = c.username
              ? `<button class="btn-icon" style="padding: 6px; border-radius: 6px;" onclick="CustomersPage.toggleLockAccount('${c.username}', '${c.name}', ${isUserDisabled}, '${c.usergroup_id || 'DL'}', '${c.customer_id}')" title="${isUserDisabled ? unlockTitle : lockTitle}">
                   <span class="material-symbols-outlined" style="font-size:16px; color:${isUserDisabled ? 'var(--success)' : 'var(--warning)'}">${isUserDisabled ? 'lock_open' : 'lock'}</span>
                 </button>`
              : '';

            const btnResetPw = c.username
              ? `<button class="btn-icon" style="padding: 6px; border-radius: 6px;" onclick="CustomersPage.openResetPasswordModal('${c.username}')" title="${resetPwTitle}">
                   <span class="material-symbols-outlined" style="font-size:16px; color:var(--primary)">key</span>
                 </button>`
              : '';

            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.gap = '4px';
            wrapper.style.alignItems = 'center';
            wrapper.style.justifyContent = 'center';
            wrapper.innerHTML = `
              <button class="btn-icon" style="padding: 6px; border-radius: 6px;" onclick="CustomersPage.openCustomerModal('${c.customer_id}')" title="Sửa thông tin khách hàng">
                <span class="material-symbols-outlined" style="font-size:16px; color:var(--text)">edit</span>
              </button>
              ${btnResetPw}
              ${btnToggleLock}
              <button class="btn-icon" style="padding: 6px; border-radius: 6px;" onclick="CustomersPage.deleteCustomer('${c.customer_id}')" title="Xóa khách hàng">
                <span class="material-symbols-outlined" style="font-size:16px; color:var(--danger)">delete</span>
              </button>
            `;
            return wrapper;
          }
        }
      ],
      rowData: customers
    };

    gridApi = AppGrid.create(container, gridOptions);
  }

  async function _fetchAndRender() {
    const searchInput = document.getElementById('customer-search');
    const filterGroup = document.getElementById('customer-filter-group');

    const search = searchInput ? searchInput.value.trim() : '';
    const groupId = filterGroup ? filterGroup.value : '';

    if (gridApi) {
      gridApi.showLoadingOverlay();
    }

    const customers = await CustomerService.getAll(search, groupId, currentPage, itemsPerPage);
    customersList = customers;

    var totalItems = (customers.length > 0 && customers[0].total_rows) ? customers[0].total_rows : 0;

    const countEl = document.getElementById('customers-count');
    if (countEl) {
      var countLabel = (typeof t !== 'undefined') ? t('pager.total_count') : 'Tổng số: {0} khách hàng';
      countEl.textContent = countLabel.replace('{0}', totalItems);
    }

    if (!gridApi) {
      _initGrid(customers);
    } else {
      gridApi.setGridOption('rowData', customers);
      if (customers.length === 0) {
        gridApi.showNoRowsOverlay();
      } else {
        gridApi.hideOverlay();
      }
    }

    // Render custom Pagination
    var paginationContainer = document.getElementById('customers-pagination');
    if (paginationContainer) {
      paginationContainer.innerHTML = '';
      if (totalItems > 0 && typeof Pagination !== 'undefined') {
        var pag = Pagination.create({
          totalItems: totalItems,
          itemsPerPage: itemsPerPage,
          currentPage: currentPage,
          onPageChange: function (page) {
            currentPage = page;
            _fetchAndRender();
          }
        });
        paginationContainer.appendChild(pag);
      }
    }

    if (typeof applyLanguage === 'function') applyLanguage();
  }

  function openCustomerModal(id = '') {
    const isEdit = !!id;
    document.getElementById('cust-is-edit').value = isEdit ? '1' : '';
    document.getElementById('cust-modal-title').textContent = isEdit ? 'Chỉnh Sửa Thông Tin Khách Hàng' : 'Thêm Khách Hàng Mới';

    // Reset các trường
    const fieldsToClear = [
      'cust-id', 'cust-name', 'cust-group', 'cust-phone', 'cust-email', 'cust-address',
      'cust-location', 'cust-quanhuyen', 'cust-notes', 'cust-username', 'cust-password', 'cust-dealer'
    ];
    fieldsToClear.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    const isEditInput = document.getElementById('cust-id');
    if (isEditInput) isEditInput.readOnly = isEdit;

    // Reset Checkbox & Account sections
    const hasAccCheck = document.getElementById('cust-has-account');
    if (hasAccCheck) {
      hasAccCheck.checked = false;
      hasAccCheck.disabled = false;
    }
    toggleAccountFields();

    // Ẩn/hiện ô chọn đại lý cấp trên dựa vào quyền hạn
    var curUser = JSON.parse(localStorage.getItem('santino_user') || '{}');
    var curRole = (curUser.role || curUser.Group || '').toLowerCase();
    var dealerGroupEl = document.getElementById('cust-dealer-group');
    if (dealerGroupEl) {
      if (curRole === 'admin' || curRole === 'ketoan' || curRole === 'sales' || curRole === 'nvkd') {
        dealerGroupEl.style.display = 'block';
      } else {
        dealerGroupEl.style.display = 'none';
      }
    }

    if (isEdit) {
      const c = customersList.find(x => x.customer_id === id);
      if (c) {
        document.getElementById('cust-id').value = c.customer_id || '';
        document.getElementById('cust-name').value = c.name || '';
        document.getElementById('cust-phone').value = c.phone || '';
        document.getElementById('cust-address').value = c.address || '';
        document.getElementById('cust-group').value = c.group_id || '';
        document.getElementById('cust-location').value = c.location_id || '';
        if (document.getElementById('cust-dealer')) document.getElementById('cust-dealer').value = c.nha_phan_phoi || c.NhaPhanPhoi || '';
        if (document.getElementById('cust-quanhuyen')) document.getElementById('cust-quanhuyen').value = c.quan_huyen || '';
        if (document.getElementById('cust-employee')) document.getElementById('cust-employee').value = c.employee_id || '';
        if (document.getElementById('cust-branch')) document.getElementById('cust-branch').value = c.branch_id || '';
        if (document.getElementById('cust-paytype')) document.getElementById('cust-paytype').value = c.payment_type_id || '';
        if (document.getElementById('cust-payterm')) document.getElementById('cust-payterm').value = c.payment_term_id || '';
        if (document.getElementById('cust-debt')) document.getElementById('cust-debt').value = c.dinh_muc_no != null ? c.dinh_muc_no : '';
        if (document.getElementById('cust-due')) document.getElementById('cust-due').value = c.thoi_han_thanh_toan != null ? c.thoi_han_thanh_toan : '';
        if (document.getElementById('cust-main-prod')) document.getElementById('cust-main-prod').value = c.san_pham_chinh || '';
        if (document.getElementById('cust-tax')) document.getElementById('cust-tax').value = c.tax_code || '';
        if (document.getElementById('cust-invoice-company')) document.getElementById('cust-invoice-company').value = c.don_vi_mua_hang || '';
        if (document.getElementById('cust-invoice-address')) document.getElementById('cust-invoice-address').value = c.address_hd || '';
        document.getElementById('cust-notes').value = c.notes || '';

        // Xử lý tài khoản
        if (c.username) {
          if (hasAccCheck) {
            hasAccCheck.checked = true;
            hasAccCheck.disabled = true; // Không cho phép tắt checkbox nếu tài khoản đã tồn tại
          }
          toggleAccountFields();

          const usernameInput = document.getElementById('cust-username');
          if (usernameInput) {
            usernameInput.value = c.username;
            usernameInput.readOnly = true;
            usernameInput.style.backgroundColor = '#f1f5f9';
            usernameInput.style.cursor = 'not-allowed';
          }

          // Lấy user group từ database
          const userGroupEl = document.getElementById('cust-usergroup');
          if (userGroupEl) userGroupEl.value = c.usergroup_id || 'DL';
          // Ẩn trường mật khẩu khởi tạo khi edit (nếu muốn reset thì đã có modal reset riêng biệt)
          const initialPwGroup = document.getElementById('cust-initial-password-group');
          if (initialPwGroup) initialPwGroup.style.display = 'none';
        } else {
          const usernameInput = document.getElementById('cust-username');
          if (usernameInput) {
            usernameInput.readOnly = false;
            usernameInput.style.backgroundColor = '';
            usernameInput.style.cursor = '';
          }
          const initialPwGroup = document.getElementById('cust-initial-password-group');
          if (initialPwGroup) initialPwGroup.style.display = 'block';
        }
      }
    } else {
      // Trường hợp thêm mới
      const usernameInput = document.getElementById('cust-username');
      if (usernameInput) {
        usernameInput.readOnly = false;
        usernameInput.style.backgroundColor = '';
        usernameInput.style.cursor = '';
      }
      const initialPwGroup = document.getElementById('cust-initial-password-group');
      if (initialPwGroup) initialPwGroup.style.display = 'block';
    }

    window.openModal('modal-customer');
  }

  function copyCustomer() {
    if (!gridApi) return;
    var selectedRows = gridApi.getSelectedRows();
    if (!selectedRows || selectedRows.length === 0) {
      showToast('Vui lòng chọn một dòng để sao chép!', false);
      return;
    }
    var c = selectedRows[0];
    openCustomerModal(''); // Open as Add mode

    // Pre-populate values except ID & Account username (since they must be unique)
    document.getElementById('cust-name').value = c.name ? (c.name + ' - Copy') : '';
    document.getElementById('cust-phone').value = c.phone || '';
    document.getElementById('cust-address').value = c.address || '';
    document.getElementById('cust-group').value = c.group_id || '';
    document.getElementById('cust-location').value = c.location_id || '';
    if (document.getElementById('cust-dealer')) document.getElementById('cust-dealer').value = c.nha_phan_phoi || c.NhaPhanPhoi || '';
    if (document.getElementById('cust-quanhuyen')) document.getElementById('cust-quanhuyen').value = c.quan_huyen || '';
    if (document.getElementById('cust-employee')) document.getElementById('cust-employee').value = c.employee_id || '';
    if (document.getElementById('cust-branch')) document.getElementById('cust-branch').value = c.branch_id || '';
    if (document.getElementById('cust-paytype')) document.getElementById('cust-paytype').value = c.payment_type_id || '';
    if (document.getElementById('cust-payterm')) document.getElementById('cust-payterm').value = c.payment_term_id || '';
    if (document.getElementById('cust-debt')) document.getElementById('cust-debt').value = c.dinh_muc_no != null ? c.dinh_muc_no : '';
    if (document.getElementById('cust-due')) document.getElementById('cust-due').value = c.thoi_han_thanh_toan != null ? c.thoi_han_thanh_toan : '';
    if (document.getElementById('cust-main-prod')) document.getElementById('cust-main-prod').value = c.san_pham_chinh || '';
    if (document.getElementById('cust-tax')) document.getElementById('cust-tax').value = c.tax_code || '';
    if (document.getElementById('cust-invoice-company')) document.getElementById('cust-invoice-company').value = c.don_vi_mua_hang || '';
    if (document.getElementById('cust-invoice-address')) document.getElementById('cust-invoice-address').value = c.address_hd || '';
    document.getElementById('cust-notes').value = c.notes || '';
  }

  function toggleAccountFields() {
    const hasAcc = document.getElementById('cust-has-account').checked;
    const fieldsDiv = document.getElementById('cust-account-fields');
    if (fieldsDiv) {
      fieldsDiv.style.display = hasAcc ? 'grid' : 'none';
    }
  }

  async function saveCustomer() {
    const isEdit = document.getElementById('cust-is-edit').value === '1';

    // Validate thông tin bắt buộc
    const name = document.getElementById('cust-name').value.trim();
    const address = document.getElementById('cust-address').value.trim();
    const group_id = document.getElementById('cust-group').value;
    const location_id = document.getElementById('cust-location').value;

    if (!name) { showToast('Vui lòng nhập Tên khách hàng!', false); return; }
    if (!group_id) { showToast('Vui lòng chọn Nhóm khách hàng!', false); return; }
    if (!address) { showToast('Vui lòng nhập Địa chỉ khách hàng!', false); return; }
    if (!location_id) { showToast('Vui lòng chọn Tỉnh/Thành phố hợp lệ!', false); return; }

    // Validate Account fields
    const hasAccount = document.getElementById('cust-has-account').checked;
    const username = document.getElementById('cust-username').value.trim();
    const userGroupEl = document.getElementById('cust-usergroup');
    const usergroup = userGroupEl ? userGroupEl.value : '';
    const password = document.getElementById('cust-password').value;

    if (hasAccount && !isEdit) {
      if (!password) { showToast('Vui lòng nhập mật khẩu khởi tạo tài khoản!', false); return; }
      if (password.length < 4) { showToast('Mật khẩu tối thiểu phải từ 4 ký tự!', false); return; }
    }

    const curUser = JSON.parse(localStorage.getItem('santino_user') || '{}');

    // Xác định nhà phân phối/đại lý cấp trên
    let nhaPhanPhoi = '';
    const curRole = (curUser.role || curUser.Group || '').toLowerCase();
    if (curRole === 'dl' || curRole === 'ban dai ly') {
      nhaPhanPhoi = curUser.ObjectID || ''; // Tự động gán chính đại lý đó
    } else {
      const dealerSelect = document.getElementById('cust-dealer');
      nhaPhanPhoi = dealerSelect ? dealerSelect.value : '';
    }

    // Dữ liệu khách hàng để gửi API
    const customerData = {
      ObjectID: document.getElementById('cust-id').value.trim(),
      ObjectName: name,
      Phone: document.getElementById('cust-phone').value.trim(),
      Address: address,
      ObjectGroupID: group_id,
      LocationID: location_id,
      QuanHuyen: document.getElementById('cust-quanhuyen')?.value?.trim() || '',
      EmployeeID: document.getElementById('cust-employee')?.value || '',
      BranchID: document.getElementById('cust-branch')?.value || '',
      PaymentTypeID: document.getElementById('cust-paytype')?.value || '',
      PaymentTermID: document.getElementById('cust-payterm')?.value || '',
      DinhMucNo: parseFloat(document.getElementById('cust-debt')?.value || 0) || 0,
      ThoiHanThanhToan: parseFloat(document.getElementById('cust-due')?.value || 0) || 0,
      SanPhamChinh: document.getElementById('cust-main-prod')?.value?.trim() || '',
      TaxCode: document.getElementById('cust-tax')?.value?.trim() || '',
      DonViMuaHang: document.getElementById('cust-invoice-company')?.value?.trim() || '',
      AddressHD: document.getElementById('cust-invoice-address')?.value?.trim() || '',
      Notes: document.getElementById('cust-notes').value.trim(),
      NhaPhanPhoi: nhaPhanPhoi,
      UserLogin: curUser.id || curUser.UserName || 'Admin'
    };

    try {
      // 1. Lưu thông tin khách hàng
      const res = await CustomerService.save(customerData);

      // Lấy ObjectID vừa được thêm (hoặc sửa)
      const objectId = res.id || res.ObjectID || customerData.ObjectID;
      const message = res.message || (isEdit ? 'Cập nhật khách hàng thành công' : 'Thêm khách hàng thành công');

      // 2. Nếu tick tạo tài khoản (hoặc tài khoản đã tồn tại)
      if (hasAccount) {
        const finalUsername = username || objectId; // Nếu không nhập username thì mặc định lấy mã ObjectID làm username
        const userData = {
          UserName: finalUsername,
          HoTen: name,
          UserGroupID: usergroup,
          ObjectID: objectId,
          Disable: 0
        };
        // Tạo mới hoặc Cập nhật tài khoản liên kết (nhóm quyền, họ tên)
        await CustomerService.saveUserAccount(userData);

        // Thiết lập mật khẩu ban đầu (chỉ khi tài khoản chưa tồn tại trước đó)
        const isNewAccount = !customersList.find(x => x.customer_id === objectId)?.username;
        if (isNewAccount && password) {
          try {
            await CustomerService.resetPassword(finalUsername, '', password);
          } catch (pwErr) {
            console.warn('[CustomersPage] Khởi tạo mật khẩu thất bại:', pwErr);
            showToast('Tài khoản đã tạo nhưng thiết lập mật khẩu khởi tạo gặp lỗi!', false);
          }
        }
      }

      showToast(message, true);
      closeModal('modal-customer');
      _fetchAndRender();
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Lỗi lưu dữ liệu', false);
    }
  }

  function deleteCustomer(objectId) {
    if (!objectId) return;

    ConfirmModal.show({
      title: 'Xóa Khách Hàng',
      message: `Bạn chắc chắn muốn xóa khách hàng <strong>${objectId}</strong>? Thao tác này sẽ tự động khóa hoặc xóa tài khoản liên kết.`,
      confirmText: 'Xóa bỏ',
      confirmClass: 'btn-danger',
      onConfirm: async function () {
        try {
          const res = await CustomerService.deleteCustomer(objectId);
          showToast(res.msg || 'Đã thực hiện xóa khách hàng thành công', true);
          _fetchAndRender();
        } catch (err) {
          showToast(err.message || 'Lỗi xóa khách hàng', false);
        }
      }
    });
  }

  async function toggleLockAccount(username, fullname, currentDisable, groupUser, objectId) {
    try {
      // Parse currentDisable robustly (có thể là boolean, số, hoặc string từ HTML)
      let isCurrentlyDisabled = false;
      if (typeof currentDisable === 'string') {
        isCurrentlyDisabled = (currentDisable === 'true' || currentDisable === '1');
      } else {
        isCurrentlyDisabled = !!currentDisable;
      }
      const nextDisable = !isCurrentlyDisabled; // true nếu cần khóa, false nếu cần mở khóa

      const userData = {
        UserName: username,
        HoTen: fullname,
        UserGroupID: groupUser || 'DL',
        ObjectID: objectId,
        Disable: nextDisable ? 1 : 0 // Cần gửi 0 hoặc 1 nếu backend SQL nhận bit, hoặc gửi true/false. Ta gửi boolean để C# map tốt nhất:
      };

      // Để chắc ăn cho cả C# và SQL, ta gửi boolean true/false
      userData.Disable = nextDisable;

      await CustomerService.saveUserAccount(userData);
      showToast(`${nextDisable ? 'Đã khóa' : 'Đã mở khóa'} tài khoản ${username} thành công.`, true);
      _fetchAndRender();
    } catch (err) {
      showToast(err.message || 'Lỗi thay đổi trạng thái tài khoản', false);
    }
  }

  function openResetPasswordModal(username) {
    document.getElementById('reset-username').value = username;
    document.getElementById('reset-newpassword').value = '';
    document.getElementById('reset-newpassword2').value = '';

    window.openModal('modal-reset-password');
  }

  async function submitResetPassword() {
    const username = document.getElementById('reset-username').value;
    const newpw = document.getElementById('reset-newpassword').value;
    const newpw2 = document.getElementById('reset-newpassword2').value;

    if (!newpw) { showToast('Vui lòng nhập mật khẩu mới!', false); return; }
    if (newpw.length < 4) { showToast('Mật khẩu tối thiểu phải từ 4 ký tự!', false); return; }
    if (newpw !== newpw2) { showToast('Mật khẩu xác nhận không trùng khớp!', false); return; }

    try {
      // Vì là Admin reset hộ, truyền currentPassword = ""
      const res = await CustomerService.resetPassword(username, '', newpw);
      showToast(res.msg || `Đặt lại mật khẩu cho tài khoản ${username} thành công.`, true);
      closeModal('modal-reset-password');
      _fetchAndRender();
    } catch (err) {
      showToast(err.message || 'Đặt lại mật khẩu thất bại', false);
    }
  }

  var _searchTimeout = null;
  function filter() {
    if (_searchTimeout) clearTimeout(_searchTimeout);
    _searchTimeout = setTimeout(function () {
      currentPage = 1;
      _fetchAndRender();
    }, 450);
  }

  return {
    render: render,
    filter: filter,
    openCustomerModal: openCustomerModal,
    copyCustomer: copyCustomer,
    toggleAccountFields: toggleAccountFields,
    saveCustomer: saveCustomer,
    deleteCustomer: deleteCustomer,
    toggleLockAccount: toggleLockAccount,
    openResetPasswordModal: openResetPasswordModal,
    submitResetPassword: submitResetPassword
  };
})();
