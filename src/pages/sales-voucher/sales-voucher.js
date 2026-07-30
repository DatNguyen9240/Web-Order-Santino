var SalesVoucherPage = (function () {
  var schemaFields = [];
  var voucherList = [];
  var orderRows = []; // Trực quan hóa chi tiết giỏ hàng [{ ItemID, ItemName, Size, MauSac, Quantity, UnitPrice, Discount, Amount }]
  var currentVoucher = null;
  var combos = {};
  var gridApi = null;
  var detailsGridApi = null;
  var currentPage = 1;
  var itemsPerPage = 20;
  var audioCtx = null;
  var hasUserInteracted = false;
 
  var isMockMode = false;
 
  var MOCK_DB = {
    fields: [
      { name: 'DocumentID', label: 'Số phiếu', required: true, showInAdd: true, showInEdit: true, renderRule: 'text', isReadOnlyAdd: true },
      { name: 'DocumentDate', label: 'Ngày', required: true, showInAdd: true, showInEdit: true, renderRule: 'date' },
      { name: 'BranchID', label: 'Kho / Chi', required: true, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_LayCacChiNhanh', dropdownType: 'dropselect' },
      { name: 'XuatHoaDonMTT', label: 'Xuất hóa đơn MTT', required: false, showInAdd: true, showInEdit: true, renderRule: 'checkbox' },
      { name: 'SoCCCD', label: 'Số CCCD', required: false, showInAdd: true, showInEdit: true, renderRule: 'text' },
      { name: 'EmployeeID', label: 'Nhân viên KD', required: true, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_LayCacNhanVien', dropdownType: 'dropselect' },
      { name: 'UserCreate', label: 'Người lập', required: false, showInAdd: true, showInEdit: true, renderRule: 'text', isReadOnlyAdd: true },
      { name: 'CTKM', label: 'CTKM', required: false, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_DanhMuc?Loai=Promotion', dropdownType: 'dropselect' },
      { name: 'ObjectID', label: 'Mã khách hàng', required: true, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_LayCacKhachHang', dropdownType: 'dropselect' },
      { name: 'ObjectName', label: 'Tên khách hàng', required: false, showInAdd: true, showInEdit: true, renderRule: 'text' },
      { name: 'DiaChiKH', label: 'Địa chỉ KH', required: false, showInAdd: true, showInEdit: true, renderRule: 'text' },
      { name: 'PaymentTermID', label: 'Điều khoản TT', required: false, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_DanhMuc?Loai=PaymentTerm', dropdownType: 'dropselect' },
      { name: 'PaymentTypeID', label: 'Hình thức TT', required: false, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_DanhMuc?Loai=PaymentType', dropdownType: 'dropselect' },
      { name: 'NgayThanhToan', label: 'Ngày TT', required: false, showInAdd: true, showInEdit: true, renderRule: 'date' },
      { name: 'Memo', label: 'Diễn giải', required: false, showInAdd: true, showInEdit: true, renderRule: 'text' },
      { name: 'NguoiGiao', label: 'Người giao', required: false, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_DanhMuc?Loai=Employee', dropdownType: 'dropselect' },
      { name: 'PTGiaoHang', label: 'PT Giao hàng', required: false, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_DanhMuc?Loai=DeliveryMethod', dropdownType: 'dropselect' },
      { name: 'ChuyenPhat', label: 'Chuyển phát', required: false, showInAdd: true, showInEdit: true, renderRule: 'checkbox' },
      { name: 'KhoXuatHang', label: 'Kho xuất hàng', required: false, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_LayCacChiNhanh', dropdownType: 'dropselect' },
      { name: 'NguonDon', label: 'Nguồn đơn', required: false, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_DanhMuc?Loai=Source', dropdownType: 'dropselect' },
      { name: 'SoDonHang', label: 'Số đơn hàng', required: false, showInAdd: true, showInEdit: true, renderRule: 'text' }
    ],
    vouchers: [],
    products: [
      { id: 'KKG29645K691', ItemID: 'KKG29645K691', ItemName: 'Quần kaki-KKG645K', Name: 'Quần kaki-KKG645K', UnitPrice: 645000, don_gia: 645000 },
      { id: 'KKG31645K691', ItemID: 'KKG31645K691', ItemName: 'Quần kaki-KKG645K', Name: 'Quần kaki-KKG645K', UnitPrice: 645000, don_gia: 645000 },
      { id: 'KKG32645K691', ItemID: 'KKG32645K691', ItemName: 'Quần kaki-KKG645K', Name: 'Quần kaki-KKG645K', UnitPrice: 645000, don_gia: 645000 },
      { id: 'KKG33645K691', ItemID: 'KKG33645K691', ItemName: 'Quần kaki-KKG645K', Name: 'Quần kaki-KKG645K', UnitPrice: 645000, don_gia: 645000 },
      { id: 'KKG34645K691', ItemID: 'KKG34645K691', ItemName: 'Quần kaki-KKG645K', Name: 'Quần kaki-KKG645K', UnitPrice: 645000, don_gia: 645000 },
      { id: 'KKG30645K691', ItemID: 'KKG30645K691', ItemName: 'Quần kaki-KKG645K', Name: 'Quần kaki-KKG645K', UnitPrice: 645000, don_gia: 645000 },
      { id: 'KKG34645K690', ItemID: 'KKG34645K690', ItemName: 'Quần kaki-KKG645K', Name: 'Quần kaki-KKG645K', UnitPrice: 645000, don_gia: 645000 },
      { id: 'KKG33645K690', ItemID: 'KKG33645K690', ItemName: 'Quần kaki-KKG645K', Name: 'Quần kaki-KKG645K', UnitPrice: 645000, don_gia: 645000 },
      { id: 'KKG32645K690', ItemID: 'KKG32645K690', ItemName: 'Quần kaki-KKG645K', Name: 'Quần kaki-KKG645K', UnitPrice: 645000, don_gia: 645000 },
      { id: 'KKG31645K690', ItemID: 'KKG31645K690', ItemName: 'Quần kaki-KKG645K', Name: 'Quần kaki-KKG645K', UnitPrice: 645000, don_gia: 645000 },
      { id: 'KKG30645K690', ItemID: 'KKG30645K690', ItemName: 'Quần kaki-KKG645K', Name: 'Quần kaki-KKG645K', UnitPrice: 645000, don_gia: 645000 },
      { id: 'KKG29645K690', ItemID: 'KKG29645K690', ItemName: 'Quần kaki-KKG645K', Name: 'Quần kaki-KKG645K', UnitPrice: 645000, don_gia: 645000 },
      { id: 'QLK32595Q133', ItemID: 'QLK32595Q133', ItemName: 'Quần âu-QLK595Q133', Name: 'Quần âu-QLK595Q133', UnitPrice: 595000, don_gia: 595000 },
      { id: 'QLK33595Q133', ItemID: 'QLK33595Q133', ItemName: 'Quần âu-QLK595Q133', Name: 'Quần âu-QLK595Q133', UnitPrice: 595000, don_gia: 595000 },
      { id: 'QLK31595Q133', ItemID: 'QLK31595Q133', ItemName: 'Quần âu-QLK595Q133', Name: 'Quần âu-QLK595Q133', UnitPrice: 595000, don_gia: 595000 },
      { id: 'QLK30595Q133', ItemID: 'QLK30595Q133', ItemName: 'Quần âu-QLK595Q133', Name: 'Quần âu-QLK595Q133', UnitPrice: 595000, don_gia: 595000 },
      { id: 'QLK29595Q133', ItemID: 'QLK29595Q133', ItemName: 'Quần âu-QLK595Q133', Name: 'Quần âu-QLK595Q133', UnitPrice: 595000, don_gia: 595000 },
      { id: 'QLK34595Q133', ItemID: 'QLK34595Q133', ItemName: 'Quần âu-QLK595Q133', Name: 'Quần âu-QLK595Q133', UnitPrice: 595000, don_gia: 595000 }
    ],
    employees: [
      { EmployeeID: 'VP', EmployeeName: 'VP' },
      { EmployeeID: 'KT02', EmployeeName: 'KT02' },
      { EmployeeID: 'VAT', EmployeeName: 'VAT' }
    ],
    branches: [
      { BranchID: 'VT', BranchName: 'SANTINO SALES OFFICE' },
      { BranchID: 'BRUNO', BranchName: 'BRUNO BRAND STORE' }
    ],
    paymentTypes: [
      { PaymentTypeID: 'TM', PaymentTypeName: 'Tiền mặt' },
      { PaymentTypeID: 'CK', PaymentTypeName: 'Chuyển khoản' }
    ],
    paymentTerms: [
      { PaymentTermID: 'TT', PaymentTermName: 'Thanh toán ngay' },
      { PaymentTermID: 'CN', PaymentTermName: 'Ghi nợ công nợ' }
    ],
    promotions: [
      { CTKM: 'ST210104', TenCTKM: 'Chương trình chiết khấu 18% Tổng đơn', ChietKhau: 18 }
    ],
    customers: [
      { ObjectID: 'A8183293', ObjectName: 'NPP Đại An - Ninh Bình', Address: 'Thôn II, Cẩm Thạch, Cẩm Thủy, Thanh Hóa' }
    ]
  };

  if (!Utils.parseMoney) {
    Utils.parseMoney = function (str) {
      if (!str) return 0;
      var clean = String(str).replace(/[^\d-]/g, '');
      return parseFloat(clean) || 0;
    };
  }

  if (!Utils.formatDate) {
    Utils.formatDate = function (dateStr) {
      if (!dateStr) return '';
      var parts = dateStr.split('-');
      if (parts.length === 3) {
        return parts[2] + '/' + parts[1] + '/' + parts[0];
      }
      return dateStr;
    };
  }

  function initMockDB() {
    var stored = localStorage.getItem('santino_mock_vouchers');
    if (stored) {
      try {
        MOCK_DB.vouchers = JSON.parse(stored);
        return;
      } catch (e) {}
    }
    MOCK_DB.vouchers = [
      {
        id: 'v1',
        DocumentID: 'VT-BD0726/0001',
        so_ct: 'VT-BD0726/0001',
        DocumentDate: '2026-07-01',
        ngay_ct: '01/07/2026',
        BranchID: 'VT',
        BranchName: 'SANTINO SALES OFFICE',
        XuatHoaDonMTT: 1,
        SoCCCD: '',
        EmployeeID: 'VP',
        UserCreate: 'KT02',
        CTKM: 'ST210104',
        ObjectID: 'A8183293',
        ObjectName: 'NPP Đại An - Ninh Bình',
        DiaChiKH: 'Thôn II, Cẩm Thạch, Cẩm Thủy, Thanh Hóa',
        PaymentTermID: 'TT',
        PaymentTypeID: 'TM',
        NgayThanhToan: '2026-07-01',
        Memo: 'Thúy Nga- Lấy tháng',
        NguoiGiao: 'VAT',
        PTGiaoHang: 'PT08',
        ChuyenPhat: 1,
        KhoXuatHang: 'VT',
        NguonDon: '',
        SoDonHang: 'VT-DH0726/0004',
        BaseTotal: 5100810,
        total_money: 5100810,
        KhachDua: 0,
        TraLai: -5100810,
        isLock: 1,
        isBanSi: 1,
        lines: [
          { STT: 1, ItemID: 'KKG29645K691', ItemName: 'Quần kaki-KKG645K', Size: '29', MauSac: 'K691-Nâu', Quantity: 1, UnitPrice: 645000, Amount: 645000, Discount: 45 },
          { STT: 2, ItemID: 'KKG31645K691', ItemName: 'Quần kaki-KKG645K', Size: '31', MauSac: 'K691-Nâu', Quantity: 1, UnitPrice: 645000, Amount: 645000, Discount: 45 },
          { STT: 3, ItemID: 'KKG32645K691', ItemName: 'Quần kaki-KKG645K', Size: '32', MauSac: 'K691-Nâu', Quantity: 1, UnitPrice: 645000, Amount: 645000, Discount: 45 },
          { STT: 4, ItemID: 'KKG33645K691', ItemName: 'Quần kaki-KKG645K', Size: '33', MauSac: 'K691-Nâu', Quantity: 1, UnitPrice: 645000, Amount: 645000, Discount: 45 },
          { STT: 5, ItemID: 'KKG34645K691', ItemName: 'Quần kaki-KKG645K', Size: '34', MauSac: 'K691-Nâu', Quantity: 1, UnitPrice: 645000, Amount: 645000, Discount: 45 },
          { STT: 6, ItemID: 'KKG30645K691', ItemName: 'Quần kaki-KKG645K', Size: '30', MauSac: 'K691-Nâu', Quantity: 1, UnitPrice: 645000, Amount: 645000, Discount: 45 },
          { STT: 7, ItemID: 'KKG34645K690', ItemName: 'Quần kaki-KKG645K', Size: '34', MauSac: 'K690-Be', Quantity: 1, UnitPrice: 645000, Amount: 645000, Discount: 45 },
          { STT: 8, ItemID: 'KKG33645K690', ItemName: 'Quần kaki-KKG645K', Size: '33', MauSac: 'K690-Be', Quantity: 1, UnitPrice: 645000, Amount: 645000, Discount: 45 },
          { STT: 9, ItemID: 'KKG32645K690', ItemName: 'Quần kaki-KKG645K', Size: '32', MauSac: 'K690-Be', Quantity: 1, UnitPrice: 645000, Amount: 645000, Discount: 45 },
          { STT: 10, ItemID: 'KKG31645K690', ItemName: 'Quần kaki-KKG645K', Size: '31', MauSac: 'K690-Be', Quantity: 1, UnitPrice: 645000, Amount: 645000, Discount: 45 },
          { STT: 11, ItemID: 'KKG30645K690', ItemName: 'Quần kaki-KKG645K', Size: '30', MauSac: 'K690-Be', Quantity: 1, UnitPrice: 645000, Amount: 645000, Discount: 45 },
          { STT: 12, ItemID: 'KKG29645K690', ItemName: 'Quần kaki-KKG645K', Size: '29', MauSac: 'K690-Be', Quantity: 1, UnitPrice: 645000, Amount: 645000, Discount: 45 },
          { STT: 13, ItemID: 'QLK32595Q133', ItemName: 'Quần âu-QLK595Q133', Size: '32', MauSac: 'Q133-Be', Quantity: 1, UnitPrice: 595000, Amount: 595000, Discount: 45 },
          { STT: 14, ItemID: 'QLK33595Q133', ItemName: 'Quần âu-QLK595Q133', Size: '33', MauSac: 'Q133-Be', Quantity: 1, UnitPrice: 595000, Amount: 595000, Discount: 45 },
          { STT: 15, ItemID: 'QLK31595Q133', ItemName: 'Quần âu-QLK595Q133', Size: '31', MauSac: 'Q133-Be', Quantity: 1, UnitPrice: 595000, Amount: 595000, Discount: 45 },
          { STT: 16, ItemID: 'QLK30595Q133', ItemName: 'Quần âu-QLK595Q133', Size: '30', MauSac: 'Q133-Be', Quantity: 1, UnitPrice: 595000, Amount: 595000, Discount: 45 },
          { STT: 17, ItemID: 'QLK29595Q133', ItemName: 'Quần âu-QLK595Q133', Size: '29', MauSac: 'Q133-Be', Quantity: 1, UnitPrice: 595000, Amount: 595000, Discount: 45 },
          { STT: 18, ItemID: 'QLK34595Q133', ItemName: 'Quần âu-QLK595Q133', Size: '34', MauSac: 'Q133-Be', Quantity: 1, UnitPrice: 595000, Amount: 595000, Discount: 45 }
        ]
      },
      {
        id: 'v2',
        DocumentID: 'VT-BD0726/0002',
        so_ct: 'VT-BD0726/0002',
        DocumentDate: '2026-07-01',
        ngay_ct: '01/07/2026',
        BranchID: 'VT',
        BranchName: 'SANTINO SALES OFFICE',
        XuatHoaDonMTT: 0,
        SoCCCD: '',
        EmployeeID: 'VP',
        UserCreate: 'KT02',
        CTKM: '',
        ObjectID: 'KH001',
        ObjectName: 'Khách hàng Đại lý Hà Nội',
        DiaChiKH: 'Cầu Giấy, Hà Nội',
        PaymentTermID: 'TT',
        PaymentTypeID: 'CK',
        NgayThanhToan: '2026-07-01',
        Memo: 'Đơn hàng bán buôn mẫu',
        NguoiGiao: 'VAT',
        PTGiaoHang: 'PT01',
        ChuyenPhat: 0,
        KhoXuatHang: 'VT',
        NguonDon: '',
        SoDonHang: '',
        BaseTotal: 84705590,
        total_money: 84705590,
        KhachDua: 84705590,
        TraLai: 0,
        isLock: 1,
        isBanSi: 1,
        lines: [
          { STT: 1, ItemID: 'KKG29645K691', ItemName: 'Quần kaki-KKG645K', Size: '29', MauSac: 'K691-Nâu', Quantity: 150, UnitPrice: 645000, Amount: 96750000, Discount: 12.45 }
        ]
      },
      {
        id: 'v3',
        DocumentID: 'VT-BD0726/0003',
        so_ct: 'VT-BD0726/0003',
        DocumentDate: '2026-07-01',
        ngay_ct: '01/07/2026',
        BranchID: 'VT',
        BranchName: 'SANTINO SALES OFFICE',
        XuatHoaDonMTT: 0,
        SoCCCD: '',
        EmployeeID: 'VP',
        UserCreate: 'KT02',
        CTKM: '',
        ObjectID: 'KH002',
        ObjectName: 'Cửa hàng thời trang Hải Phòng',
        DiaChiKH: 'Lê Chân, Hải Phòng',
        PaymentTermID: 'TT',
        PaymentTypeID: 'CK',
        NgayThanhToan: '2026-07-01',
        Memo: 'Đơn hàng sỉ Hải Phòng',
        NguoiGiao: 'VAT',
        PTGiaoHang: 'PT02',
        ChuyenPhat: 0,
        KhoXuatHang: 'VT',
        NguonDon: '',
        SoDonHang: '',
        BaseTotal: 61944151,
        total_money: 61944151,
        KhachDua: 61944151,
        TraLai: 0,
        isLock: 1,
        isBanSi: 1,
        lines: [
          { STT: 1, ItemID: 'QLK32595Q133', ItemName: 'Quần âu-QLK595Q133', Size: '32', MauSac: 'Q133-Be', Quantity: 110, UnitPrice: 595000, Amount: 65450000, Discount: 5.36 }
        ]
      },
      {
        id: 'v4',
        DocumentID: 'VT-BD0726/0004',
        so_ct: 'VT-BD0726/0004',
        DocumentDate: '2026-07-01',
        ngay_ct: '01/07/2026',
        BranchID: 'VT',
        BranchName: 'SANTINO SALES OFFICE',
        XuatHoaDonMTT: 0,
        SoCCCD: '',
        EmployeeID: 'VP',
        UserCreate: 'KT02',
        CTKM: '',
        ObjectID: 'KH003',
        ObjectName: 'Nhà phân phối miền Trung',
        DiaChiKH: 'TP Vinh, Nghệ An',
        PaymentTermID: 'TT',
        PaymentTypeID: 'TM',
        NgayThanhToan: '2026-07-01',
        Memo: 'Giao hàng đợt 1',
        NguoiGiao: 'VAT',
        PTGiaoHang: 'PT08',
        ChuyenPhat: 1,
        KhoXuatHang: 'VT',
        NguonDon: '',
        SoDonHang: '',
        BaseTotal: 106619784,
        total_money: 106619784,
        KhachDua: 110000000,
        TraLai: 3380216,
        isLock: 1,
        isBanSi: 1,
        lines: [
          { STT: 1, ItemID: 'KKG29645K691', ItemName: 'Quần kaki-KKG645K', Size: '29', MauSac: 'K691-Nâu', Quantity: 200, UnitPrice: 645000, Amount: 129000000, Discount: 17.35 }
        ]
      },
      {
        id: 'v5',
        DocumentID: 'BRUNO-BD0726/0001',
        so_ct: 'BRUNO-BD0726/0001',
        DocumentDate: '2026-07-01',
        ngay_ct: '01/07/2026',
        BranchID: 'BRUNO',
        BranchName: 'BRUNO BRAND STORE',
        XuatHoaDonMTT: 0,
        SoCCCD: '',
        EmployeeID: 'VP',
        UserCreate: 'KT02',
        CTKM: '',
        ObjectID: 'KH004',
        ObjectName: 'Cửa hàng Bruno Đà Nẵng',
        DiaChiKH: 'Hải Châu, Đà Nẵng',
        PaymentTermID: 'TT',
        PaymentTypeID: 'CK',
        NgayThanhToan: '2026-07-01',
        Memo: 'Đơn hàng BRUNO',
        NguoiGiao: 'VAT',
        PTGiaoHang: 'PT01',
        ChuyenPhat: 0,
        KhoXuatHang: 'BRUNO',
        NguonDon: '',
        SoDonHang: '',
        BaseTotal: 3924500,
        total_money: 3924500,
        KhachDua: 4000000,
        TraLai: 75500,
        isLock: 1,
        isBanSi: 1,
        lines: [
          { STT: 1, ItemID: 'QLK32595Q133', ItemName: 'Quần âu-QLK595Q133', Size: '32', MauSac: 'Q133-Be', Quantity: 10, UnitPrice: 595000, Amount: 5950000, Discount: 34.04 }
        ]
      }
    ];
    localStorage.setItem('santino_mock_vouchers', JSON.stringify(MOCK_DB.vouchers));
  }

  function handleMockCall(method, endpoint, params) {
    var url = String(endpoint || '').split('?')[0];
    var qs = '';
    if (String(endpoint).includes('?')) {
      qs = String(endpoint).split('?')[1];
    }
    var qObj = {};
    if (qs) {
      var sp = new URLSearchParams(qs);
      sp.forEach((v, k) => { qObj[k] = v; });
    }
    if (params && params.q) {
      try {
        var parsed = JSON.parse(params.q);
        Object.assign(qObj, parsed);
      } catch(e) {}
    } else if (params) {
      Object.assign(qObj, params);
    }

    if (url.includes('/API_LayCacTruongGiaoDien')) {
      return MOCK_DB.fields;
    }
    if (url.includes('/API_LayCacChiNhanh') || qObj.Loai === 'Branch' || url.includes('Branch')) {
      return MOCK_DB.branches;
    }
    if (url.includes('/API_LayCacNhanVien') || qObj.Loai === 'Employee' || qObj.Loai === 'SalesPerson' || url.includes('Employee')) {
      return MOCK_DB.employees;
    }
    if (url.includes('/API_LayCacKhachHang') || qObj.Loai === 'Customer' || url.includes('Customer') || url.includes('/API_LayDanhSachKhachHang')) {
      return MOCK_DB.customers;
    }
    if (qObj.Loai === 'PaymentType') {
      return MOCK_DB.paymentTypes;
    }
    if (qObj.Loai === 'PaymentTerm') {
      return MOCK_DB.paymentTerms;
    }
    if (qObj.Loai === 'Promotion') {
      return MOCK_DB.promotions;
    }
    if (url.includes('/API_DanhMuc')) {
      if (qObj.Loai === 'Order') {
        var list = MOCK_DB.vouchers;
        var searchVal = '';
        if (qObj.TimKiem) {
          try {
            var tk = JSON.parse(qObj.TimKiem);
            if (tk.q) searchVal = String(tk.q).toLowerCase();
          } catch(e) {
            searchVal = String(qObj.TimKiem).toLowerCase();
          }
        }
        if (searchVal) {
          list = list.filter(function(v) {
            return String(v.DocumentID).toLowerCase().includes(searchVal) ||
                   String(v.ObjectName).toLowerCase().includes(searchVal);
          });
        }
        var resVal = list.slice();
        resVal._recordtotal = list.length;
        return resVal;
      }
      if (qObj.Loai === 'SalesPerson' || qObj.Loai === 'Employee') {
        return MOCK_DB.employees;
      }
      if (qObj.Loai === 'PaymentType') {
        return MOCK_DB.paymentTypes;
      }
      if (qObj.Loai === 'PaymentTerm') {
        return MOCK_DB.paymentTerms;
      }
      if (qObj.Loai === 'Promotion') {
        return MOCK_DB.promotions;
      }
      return [];
    }
    return [];
  }

  async function _getOrderDetail(id) {
    if (isMockMode) {
      var found = MOCK_DB.vouchers.find(v => v.id === id || v.DocumentID === id);
      return found ? JSON.parse(JSON.stringify(found)) : null;
    }
    try {
      return await OrderService.getOrderDetail(id);
    } catch(e) {
      console.warn('[SalesVoucher] getOrderDetail failed, switching to mock.', e);
      isMockMode = true;
      var found = MOCK_DB.vouchers.find(v => v.id === id || v.DocumentID === id);
      return found ? JSON.parse(JSON.stringify(found)) : null;
    }
  }

  async function _createOrder(payload) {
    if (isMockMode) {
      payload.id = 'v_' + Date.now();
      payload.so_ct = payload.DocumentID;
      payload.ngay_ct = Utils.formatDate(payload.DocumentDate);
      MOCK_DB.vouchers.unshift(payload);
      localStorage.setItem('santino_mock_vouchers', JSON.stringify(MOCK_DB.vouchers));
      return { Success: 1, Message: 'Lưu phiếu bán hàng mới thành công (Offline Mode)' };
    }
    try {
      return await OrderService.createOrder(payload);
    } catch(e) {
      console.warn('[SalesVoucher] createOrder failed, switching to mock.', e);
      isMockMode = true;
      payload.id = 'v_' + Date.now();
      payload.so_ct = payload.DocumentID;
      payload.ngay_ct = Utils.formatDate(payload.DocumentDate);
      MOCK_DB.vouchers.unshift(payload);
      localStorage.setItem('santino_mock_vouchers', JSON.stringify(MOCK_DB.vouchers));
      return { Success: 1, Message: 'Lưu phiếu bán hàng mới thành công (Offline Mode)' };
    }
  }

  async function _updateOrder(payload) {
    if (isMockMode) {
      var idx = MOCK_DB.vouchers.findIndex(v => v.DocumentID === payload.DocumentID || v.id === currentVoucher?.id);
      if (idx !== -1) {
        payload.id = MOCK_DB.vouchers[idx].id;
        payload.so_ct = payload.DocumentID;
        payload.ngay_ct = Utils.formatDate(payload.DocumentDate);
        MOCK_DB.vouchers[idx] = payload;
        localStorage.setItem('santino_mock_vouchers', JSON.stringify(MOCK_DB.vouchers));
      }
      return { Success: 1, Message: 'Cập nhật phiếu bán hàng thành công (Offline Mode)' };
    }
    try {
      return await OrderService.updateOrder(payload);
    } catch(e) {
      console.warn('[SalesVoucher] updateOrder failed, switching to mock.', e);
      isMockMode = true;
      var idx = MOCK_DB.vouchers.findIndex(v => v.DocumentID === payload.DocumentID || v.id === currentVoucher?.id);
      if (idx !== -1) {
        payload.id = MOCK_DB.vouchers[idx].id;
        payload.so_ct = payload.DocumentID;
        payload.ngay_ct = Utils.formatDate(payload.DocumentDate);
        MOCK_DB.vouchers[idx] = payload;
        localStorage.setItem('santino_mock_vouchers', JSON.stringify(MOCK_DB.vouchers));
      }
      return { Success: 1, Message: 'Cập nhật phiếu bán hàng thành công (Offline Mode)' };
    }
  }

  async function _getProducts(q) {
    if (isMockMode) {
      if (!q) return MOCK_DB.products;
      var query = q.toLowerCase().trim();
      return MOCK_DB.products.filter(p => p.ItemID.toLowerCase().includes(query) || p.ItemName.toLowerCase().includes(query));
    }
    try {
      var res = await ProductService.getProducts(q);
      if (!res || res.length === 0) {
        return MOCK_DB.products.filter(p => p.ItemID.toLowerCase().includes(q.toLowerCase()) || p.ItemName.toLowerCase().includes(q.toLowerCase()));
      }
      return res;
    } catch(e) {
      return MOCK_DB.products.filter(p => p.ItemID.toLowerCase().includes(q.toLowerCase()) || p.ItemName.toLowerCase().includes(q.toLowerCase()));
    }
  }

  async function _httpGet(endpoint, params) {
    if (isMockMode) {
      return handleMockCall('GET', endpoint, params);
    }
    try {
      return await Http.get(endpoint, params);
    } catch(e) {
      console.warn(`[SalesVoucher] httpGet to ${endpoint} failed, switching to mock mode.`, e);
      isMockMode = true;
      if (typeof showToast !== 'undefined') {
        showToast('Đang chạy ở chế độ Demo do không kết nối được CSDL.', 'warning');
      }
      return handleMockCall('GET', endpoint, params);
    }
  }

  async function _httpPost(endpoint, body) {
    if (isMockMode) {
      return handleMockCall('POST', endpoint, body);
    }
    try {
      return await Http.post(endpoint, body);
    } catch(e) {
      console.warn(`[SalesVoucher] httpPost to ${endpoint} failed, switching to mock mode.`, e);
      isMockMode = true;
      if (typeof showToast !== 'undefined') {
        showToast('Đang chạy ở chế độ Demo do không kết nối được CSDL.', 'warning');
      }
      return handleMockCall('POST', endpoint, body);
    }
  }

  var hasUserInteracted = false;

  function extractList(res) {
    if (!res) return [];
    var records = res.records || res.list || res.data || res;
    if (!Array.isArray(records)) {
      if (records && typeof records === 'object' && Array.isArray(records.records)) {
        records = records.records;
      } else if (records && typeof records === 'object' && Array.isArray(records.data)) {
        records = records.data;
      } else {
        records = [];
      }
    }
    return records;
  }

  function initAudioOnGesture() {
    var unlock = function () {
      hasUserInteracted = true;
      try {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        if (audioCtx && audioCtx.state === 'running') {
          document.removeEventListener('click', unlock);
          document.removeEventListener('keydown', unlock);
          document.removeEventListener('touchstart', unlock);
        }
      } catch (e) {
        console.warn('[SalesVoucherPage] Audio unlock failed:', e);
      }
    };
    document.addEventListener('click', unlock);
    document.addEventListener('keydown', unlock);
    document.addEventListener('touchstart', unlock);
  }

  // Web Audio API Synth Beeps
  function playSynthBeep(type) {
    var active = false;
    if (window.navigator && navigator.userActivation) {
      active = navigator.userActivation.hasBeenActive;
    } else {
      active = hasUserInteracted;
    }

    if (!active) {
      return; // Fully prevent browser autoplay warnings if no user gesture has occurred yet
    }

    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(function () {});
      }
      if (audioCtx.state === 'suspended') {
        return; // Avoid browser warnings if still suspended
      }

      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'success') {
        osc.frequency.value = 950;
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } else if (type === 'error') {
        osc.frequency.value = 320;
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.22);
      } else if (type === 'save') {
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.06);
        setTimeout(function () {
          if (!audioCtx || audioCtx.state === 'suspended') return;
          try {
            var osc2 = audioCtx.createOscillator();
            var gain2 = audioCtx.createGain();
            osc2.connect(gain2);
            gain2.connect(audioCtx.destination);
            osc2.frequency.value = 1100;
            gain2.gain.setValueAtTime(0.06, audioCtx.currentTime);
            osc2.start();
            osc2.stop(audioCtx.currentTime + 0.1);
          } catch (e2) {
            console.warn('[SalesVoucherPage] Save beep step 2 failed:', e2);
          }
        }, 80);
      }
    } catch (e) {
      console.warn('[SalesVoucherPage] Audio beep not allowed by browser:', e);
    }
  }

  // Trigger audio unlock setup
  initAudioOnGesture();

  // Load script/css động nếu chưa có trong bundle (tự động làm mới cache)
  function _dynCss(src) {
    var id = 'dyn-css-' + src.split('/').pop().replace('.', '-');
    var existing = document.getElementById(id);
    if (existing) {
      existing.href = src + '?v=' + Date.now();
      return;
    }
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
    detailsGridApi = null;

    document.body.classList.add('page-sales-voucher');
    $el.classList.add('is-full-width');
    _dynCss('src/pages/sales-voucher/sales-voucher.css');

    return Router.fetchTemplate('src/pages/sales-voucher/sales-voucher.html').then(async function (html) {
      $el.innerHTML = html;
      await _init();
    });
  }

  // --- Initialize Page Logic ---
  async function _init() {
    initMockDB();
    if (window.LoadingSpinner) LoadingSpinner.show('Đang tải cấu hình CSDL...');
    try {
      // 1. Tải Metadata động cho Form từ SQL Database (WEB_OrderFrm)
      var rawFields = [];
      try {
        var resConfig = await _httpPost('/API_LayCacTruongGiaoDien', { FormName: 'WEB_OrderFrm' });
        rawFields = Array.isArray(resConfig) ? resConfig : (resConfig && (resConfig.records || resConfig.list || resConfig.data)) || [];
      } catch (errConfig) {
        console.warn('[SalesVoucherPage] Failed to fetch dynamic fields configuration, using fallback:', errConfig);
      }
 
      // Fallback nếu API trống hoặc cấu hình rỗng
      if (!Array.isArray(rawFields) || rawFields.length === 0) {
        console.warn('[SalesVoucherPage] SQL config is empty. Using static fallback schema fields.');
        rawFields = [
          { name: 'DocumentID', label: 'Số phiếu', required: true, showInAdd: true, showInEdit: true, renderRule: 'text', isReadOnlyAdd: true },
          { name: 'DocumentDate', label: 'Ngày', required: true, showInAdd: true, showInEdit: true, renderRule: 'date' },
          { name: 'BranchID', label: 'Kho / Chi', required: true, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_LayCacChiNhanh', dropdownType: 'dropselect' },
          { name: 'XuatHoaDonMTT', label: 'Xuất hóa đơn MTT', required: false, showInAdd: true, showInEdit: true, renderRule: 'checkbox' },
          { name: 'SoCCCD', label: 'Số CCCD', required: false, showInAdd: true, showInEdit: true, renderRule: 'text' },
          { name: 'EmployeeID', label: 'Nhân viên KD', required: true, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_LayCacNhanVien', dropdownType: 'dropselect' },
          { name: 'UserCreate', label: 'Người lập', required: false, showInAdd: true, showInEdit: true, renderRule: 'text', isReadOnlyAdd: true },
          { name: 'CTKM', label: 'CTKM', required: false, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_DanhMuc?Loai=Promotion', dropdownType: 'dropselect' },
          { name: 'ObjectID', label: 'Mã khách hàng', required: true, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_LayCacKhachHang', dropdownType: 'dropselect' },
          { name: 'ObjectName', label: 'Tên khách hàng', required: false, showInAdd: true, showInEdit: true, renderRule: 'text' },
          { name: 'DiaChiKH', label: 'Địa chỉ KH', required: false, showInAdd: true, showInEdit: true, renderRule: 'text' },
          { name: 'PaymentTermID', label: 'Điều khoản TT', required: false, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_DanhMuc?Loai=PaymentTerm', dropdownType: 'dropselect' },
          { name: 'PaymentTypeID', label: 'Hình thức TT', required: false, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_DanhMuc?Loai=PaymentType', dropdownType: 'dropselect' },
          { name: 'NgayThanhToan', label: 'Ngày TT', required: false, showInAdd: true, showInEdit: true, renderRule: 'date' },
          { name: 'Memo', label: 'Diễn giải', required: false, showInAdd: true, showInEdit: true, renderRule: 'text' },
          { name: 'NguoiGiao', label: 'Người giao', required: false, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_DanhMuc?Loai=Employee', dropdownType: 'dropselect' },
          { name: 'PTGiaoHang', label: 'PT Giao hàng', required: false, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_DanhMuc?Loai=DeliveryMethod', dropdownType: 'dropselect' },
          { name: 'ChuyenPhat', label: 'Chuyển phát', required: false, showInAdd: true, showInEdit: true, renderRule: 'checkbox' },
          { name: 'KhoXuatHang', label: 'Kho xuất hàng', required: false, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_LayCacChiNhanh', dropdownType: 'dropselect' },
          { name: 'NguonDon', label: 'Nguồn đơn', required: false, showInAdd: true, showInEdit: true, renderRule: 'dropselect', dataSource: '/API_DanhMuc?Loai=Source', dropdownType: 'dropselect' },
          { name: 'SoDonHang', label: 'Số đơn hàng', required: false, showInAdd: true, showInEdit: true, renderRule: 'text' }
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
 
      // 2.1. Khởi tạo AgGrid chi tiết hàng hóa
      _initDetailsGrid();
 
      // 3. Khởi tạo left list filters & AgGrid danh sách phiếu
      _initLeftGrid();
      await refreshList();
 
      // 4. Khởi tạo Autocomplete chọn nhanh sản phẩm (F3)
      _initProductDropdown();
 
      // 5. Khởi tạo dropdown Người giao & CTKM phụ trợ
      _initAuxiliaryDropdowns();
 
      // 6. Khởi tạo Tabs
      _initTabs();
      _initSplitResize();
 
      // 7. Gắn bộ quét Barcode và các phím tắt
      _setupBarcodeScan();
      _setupKeyboardShortcuts();
 
      // 8. Khởi tạo ô chọn ngày dd/mm/yyyy cùng hàng với ô Tìm kiếm
      _initDateFilter();
 
      // 9. Đặt form ở chế độ Thêm mới ban đầu
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
      if (['BaseTotal', 'KhachDua', 'TraLai', 'DateCreate', 'isLock', 'isBanSi'].indexOf(f.name) !== -1) {
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
 
      if (f.renderRule === 'checkbox' || f.dataType === 'bit' || f.dataType === 'bool' || f.dataType === 'boolean') {
        var wrap = document.createElement('label');
        wrap.className = 'checkbox-container';
        wrap.style.marginTop = '6px';
        wrap.style.display = 'flex';
        wrap.style.alignItems = 'center';
        wrap.style.gap = '6px';
        wrap.style.cursor = 'pointer';
 
        var chk = document.createElement('input');
        chk.type = 'checkbox';
        chk.id = 'field-' + f.name;
        chk.name = f.name;
        chk.style.width = '16px';
        chk.style.height = '16px';
 
        wrap.appendChild(chk);
        wrap.appendChild(document.createTextNode(' ' + f.label));
        if (group.contains(label)) {
          group.removeChild(label); // Checkbox doesn't need separate label above it
        }
        group.appendChild(wrap);
      } else if (isDynamicLookup) {
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
 
              var dsL = endpoint.toLowerCase();
              if (dsL.includes('danhmuc') || dsL.includes('gateway') || dsL.includes('router')) {
                params.q = JSON.stringify(queryObj);
              } else {
                Object.assign(params, queryObj);
              }
              var res = await _httpGet(endpoint, params);
              var records = extractList(res);
              if (records.length === 0 && (queryObj.Loai === 'Employee' || endpoint.includes('Loai=Employee'))) {
                queryObj.Loai = 'SalesPerson';
                if (dsL.includes('danhmuc') || dsL.includes('gateway') || dsL.includes('router')) {
                  params.q = JSON.stringify(queryObj);
                } else {
                  Object.assign(params, queryObj);
                }
                res = await _httpGet(endpoint, params);
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
              var custAddressInput = document.getElementById('field-DiaChiKH');
              if (custAddressInput && row[2] && row[2].Address) {
                custAddressInput.value = row[2].Address;
              }
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
 
        if (f.dataType === 'datetime' || f.renderRule === 'D' || f.renderRule === 'date') {
          var dateFn = (window.UIInput && window.UIInput.createDate) || (window.UIControls && window.UIControls.createDate);
          if (dateFn) {
            var datePicker = dateFn({
              id: 'field-' + f.name,
              name: f.name,
              placeholder: 'dd/mm/yyyy'
            });
            group.appendChild(datePicker);
            return;
          }
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

  // --- Khởi tạo AgGrid chi tiết hàng hóa ---
  function _initDetailsGrid() {
    var container = document.getElementById('sales-details-grid-container');
    if (!container) return;

    var columnDefs = [
      {
        headerName: '#',
        width: 50,
        minWidth: 40,
        valueGetter: params => {
          if (params.node.isRowPinned()) return '∑';
          return params.node.rowIndex + 1;
        },
        cellStyle: { textAlign: 'center', fontWeight: '600', color: 'var(--text-secondary)' }
      },
      {
        headerName: 'Mã hàng hóa',
        field: 'ItemID',
        width: 120,
        minWidth: 100,
        cellStyle: { fontWeight: '700' }
      },
      {
        headerName: 'Tên hàng hóa',
        field: 'ItemName',
        minWidth: 180,
        flex: 1
      },
      {
        headerName: 'ĐVT',
        width: 70,
        valueGetter: params => params.node.isRowPinned() ? '' : 'Chiếc',
        cellStyle: { textAlign: 'center', color: 'var(--text-secondary)' }
      },
      {
        headerName: 'Kích cỡ (Size)',
        field: 'Size',
        width: 90,
        editable: params => !params.node.isRowPinned(),
        cellEditor: 'agTextCellEditor',
        cellStyle: { textAlign: 'center' }
      },
      {
        headerName: 'Màu sắc',
        field: 'MauSac',
        width: 90,
        editable: params => !params.node.isRowPinned(),
        cellEditor: 'agTextCellEditor',
        cellStyle: { textAlign: 'center' }
      },
      {
        headerName: 'Số lượng',
        field: 'Quantity',
        width: 90,
        editable: params => !params.node.isRowPinned(),
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: { min: 0.1 },
        cellStyle: { textAlign: 'center' },
        valueParser: params => parseFloat(params.newValue) || 0
      },
      {
        headerName: 'Đơn giá',
        field: 'UnitPrice',
        width: 110,
        editable: params => !params.node.isRowPinned(),
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: { min: 0 },
        cellStyle: { textAlign: 'right' },
        valueFormatter: params => Utils.formatMoney(params.value || 0),
        valueParser: params => parseFloat(params.newValue) || 0
      },
      {
        headerName: 'Thành tiền',
        width: 120,
        cellStyle: { textAlign: 'right', fontWeight: '700' },
        valueGetter: params => {
          if (params.node.isRowPinned()) return params.data.RawAmount;
          return (params.data.Quantity || 0) * (params.data.UnitPrice || 0);
        },
        valueFormatter: params => Utils.formatMoney(params.value || 0)
      },
      {
        headerName: '% Giảm/CK',
        field: 'Discount',
        width: 95,
        editable: params => !params.node.isRowPinned(),
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: { min: 0, max: 100 },
        cellStyle: { textAlign: 'center' },
        valueFormatter: params => params.node.isRowPinned() ? '' : (params.value || 0) + '%',
        valueParser: params => parseFloat(params.newValue) || 0
      },
      {
        headerName: 'Giảm giá/CK',
        width: 120,
        cellStyle: params => params.node.isRowPinned() ? { textAlign: 'right', color: 'var(--danger)', fontWeight: '800' } : { textAlign: 'right', color: 'var(--danger)' },
        valueGetter: params => {
          if (params.node.isRowPinned()) return params.data.DiscountAmount;
          var qty = params.data.Quantity || 0;
          var price = params.data.UnitPrice || 0;
          var disc = params.data.Discount || 0;
          return qty * price * (disc / 100);
        },
        valueFormatter: params => Utils.formatMoney(params.value || 0)
      },
      {
        headerName: '',
        width: 60,
        cellRenderer: function (params) {
          if (params.node.isRowPinned()) return '';
          return `<button class="btn-icon" style="padding:0; min-height:0; display:inline-flex; align-items:center; justify-content:center; border:none; background:transparent; cursor:pointer;" onclick="SalesVoucherPage.deleteRow(${params.node.rowIndex})" title="Xóa dòng này">
                    <span class="material-symbols-outlined" style="color:var(--danger); font-size:18px;">delete</span>
                  </button>`;
        },
        cellStyle: { textAlign: 'center' }
      }
    ];

    var gridOptions = {
      pagination: false,
      columnDefs: columnDefs,
      rowData: [],
      onCellValueChanged: function (params) {
        var index = params.node.rowIndex;
        var field = params.colDef.field;
        var val = params.newValue;
        updateRowField(index, field, val);
      },
      onGridSizeChanged: function (params) {
        if (params.api && params.clientWidth > 0) {
          params.api.sizeColumnsToFit();
        }
      }
    };

    detailsGridApi = AppGrid.create(container, gridOptions);
  }

  // --- Khởi tạo AgGrid danh sách phiếu bên trái ---
  function _initLeftGrid() {
    var container = document.getElementById('sales-grid-container');
    if (!container) return;

    var desktopDefs = [
      { 
        field: 'DocumentID',
        headerName: 'Mã số phiếu', 
        cellStyle: params => {
          if (params.node.isRowPinned()) {
            return { fontWeight: '800', color: 'var(--text)' };
          }
          return { fontWeight: '700' };
        }, 
        width: 145, 
        minWidth: 120 
      },
      { 
        field: 'DocumentDate',
        headerName: 'Ngày lập đơn', 
        width: 115, 
        valueFormatter: params => {
          if (params.node.isRowPinned()) return '';
          return params.value ? params.value.split(' ')[0] : '';
        }
      },
      { 
        field: 'BranchID', 
        headerName: 'Kho / Chi nhánh', 
        width: 130,
        valueFormatter: params => {
          if (params.node.isRowPinned()) return '';
          return params.value || '';
        }
      },
      {
        field: 'BaseTotal',
        headerName: 'Tổng tiền hàng',
        width: 140,
        cellStyle: params => {
          if (params.node.isRowPinned()) {
            return { color: 'var(--danger, #dc2626)', fontWeight: '800', textAlign: 'right' };
          }
          return { color: 'var(--text)', fontWeight: '700', textAlign: 'right' };
        },
        valueFormatter: params => Utils.formatMoney(params.value || 0)
      }
    ];

    var mobileDefs = [
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

    var gridOptions = {
      pagination: false,
      columnDefs: desktopDefs,
      mobileColumnDefs: mobileDefs,
      rowData: [],
      onRowClicked: function (params) {
        if (params.data && (params.data.id || params.data.DocumentID)) {
          selectVoucher(params.data.id || params.data.DocumentID);
        }
      },
      onGridSizeChanged: function (params) {
        if (params.api && params.clientWidth > 0) {
          params.api.sizeColumnsToFit();
        }
      }
    };

    gridApi = AppGrid.create(container, gridOptions);
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

      var res = await _httpGet(API_CONFIG.ENDPOINTS.CATEGORIES.LIST, params);
      var records = res.records || res || [];
      if (!Array.isArray(records)) {
        if (records && typeof records === 'object' && Array.isArray(records.records)) {
          records = records.records;
        } else {
          records = [];
        }
      }

      voucherList = records;

      if (gridApi) {
        gridApi.setGridOption('rowData', voucherList);
        if (voucherList.length === 0) {
          gridApi.showNoRowsOverlay();
          gridApi.setGridOption('pinnedBottomRowData', []);
        } else {
          gridApi.hideOverlay();
          var totalSum = voucherList.reduce((sum, v) => sum + (parseFloat(v.total_money || v.BaseTotal) || 0), 0);
          gridApi.setGridOption('pinnedBottomRowData', [{
            DocumentID: '∑',
            BaseTotal: totalSum
          }]);
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
      if (gridApi) {
        gridApi.showNoRowsOverlay();
        gridApi.setGridOption('pinnedBottomRowData', []);
      }
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

  // Khởi tạo DatePicker dd/mm/yyyy cùng hàng với Tìm kiếm
  function _initDateFilter() {
    var container = document.getElementById('sales-filter-date-container');
    if (!container) return;
    container.innerHTML = '';

    var dateFn = (window.UIInput && window.UIInput.createDate) || (window.UIControls && window.UIControls.createDate);
    if (!dateFn) return;

    var datePicker = dateFn({
      id: 'sales-filter-date',
      name: 'filter_date',
      value: '',
      placeholder: 'dd/mm/yyyy'
    });

    container.appendChild(datePicker);

    var hiddenInput = container.querySelector('input[type="hidden"]') || container.querySelector('input');
    if (hiddenInput) {
      hiddenInput.addEventListener('change', function () {
        currentPage = 1;
        refreshList();
      });
    }
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
          var res = await _getProducts(q);
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
          var res = await _httpGet('/API_DanhMuc', { q: JSON.stringify({ Loai: 'SalesPerson', TimKiem: q }) });
          var list = res.records || res || [];
          if (!Array.isArray(list)) {
            list = [];
          }
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
          var res = await _httpGet('/API_DanhMuc', { q: JSON.stringify({ Loai: 'PaymentType', TimKiem: q }) });
          var list = res.records || res || [];
          if (!Array.isArray(list)) {
            list = [];
          }
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
          var res = await _httpGet('/API_DanhMuc', { q: JSON.stringify({ Loai: 'Promotion', TimKiem: q }) });
          var list = res.records || res || [];
          if (!Array.isArray(list)) {
            list = [];
          }
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

  // --- Thay đổi độ rộng hai khung ---
  function _initSplitResize() {
    var layout = document.querySelector('.sales-layout');
    var splitter = layout ? layout.querySelector('.sales-splitter') : null;
    var leftPane = layout ? layout.querySelector('.sales-left-pane') : null;
    if (!layout || !splitter || !leftPane) return;

    var storageKey = 'salesVoucherLeftPaneWidth';
    var defaultWidth = 360;
    var minLeftWidth = 260;
    var minRightWidth = 480;
    var startX = 0;
    var startWidth = 0;

    function getMaxLeftWidth() {
      return Math.max(minLeftWidth, layout.clientWidth - splitter.offsetWidth - minRightWidth);
    }

    function setLeftWidth(width) {
      var nextWidth = Math.min(Math.max(width, minLeftWidth), getMaxLeftWidth());
      layout.style.setProperty('--sales-left-width', Math.round(nextWidth) + 'px');
      splitter.setAttribute('aria-valuemin', String(minLeftWidth));
      splitter.setAttribute('aria-valuemax', String(Math.round(getMaxLeftWidth())));
      splitter.setAttribute('aria-valuenow', String(Math.round(nextWidth)));
      return nextWidth;
    }

    function saveLeftWidth(width) {
      try {
        window.localStorage.setItem(storageKey, String(Math.round(width)));
      } catch (e) {
        // The splitter still works when browser storage is unavailable.
      }
    }

    function resizeGrids() {
      window.requestAnimationFrame(function () {
        if (gridApi && leftPane.clientWidth > 0) gridApi.sizeColumnsToFit();
        var detailsContainer = document.getElementById('sales-details-grid-container');
        if (detailsGridApi && detailsContainer && detailsContainer.clientWidth > 0) {
          detailsGridApi.sizeColumnsToFit();
        }
      });
    }

    var savedWidth = defaultWidth;
    try {
      savedWidth = parseFloat(window.localStorage.getItem(storageKey)) || defaultWidth;
    } catch (e) {
      savedWidth = defaultWidth;
    }
    setLeftWidth(savedWidth);

    splitter.addEventListener('pointerdown', function (event) {
      if (window.matchMedia('(max-width: 768px)').matches ||
          layout.classList.contains('detail-collapsed')) return;

      startX = event.clientX;
      startWidth = leftPane.getBoundingClientRect().width;
      layout.classList.add('is-resizing');
      splitter.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    splitter.addEventListener('pointermove', function (event) {
      if (!layout.classList.contains('is-resizing')) return;
      setLeftWidth(startWidth + event.clientX - startX);
    });

    function finishResize(event) {
      if (!layout.classList.contains('is-resizing')) return;
      layout.classList.remove('is-resizing');
      if (splitter.hasPointerCapture(event.pointerId)) {
        splitter.releasePointerCapture(event.pointerId);
      }
      saveLeftWidth(leftPane.getBoundingClientRect().width);
      resizeGrids();
    }

    splitter.addEventListener('pointerup', finishResize);
    splitter.addEventListener('pointercancel', finishResize);

    splitter.addEventListener('keydown', function (event) {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      var direction = event.key === 'ArrowLeft' ? -1 : 1;
      var width = setLeftWidth(leftPane.getBoundingClientRect().width + direction * 20);
      saveLeftWidth(width);
      resizeGrids();
      event.preventDefault();
    });

    splitter.addEventListener('dblclick', function () {
      var width = setLeftWidth(defaultWidth);
      saveLeftWidth(width);
      resizeGrids();
    });

    window.addEventListener('resize', function () {
      if (window.matchMedia('(max-width: 768px)').matches ||
          layout.classList.contains('detail-collapsed')) return;
      setLeftWidth(leftPane.getBoundingClientRect().width);
    });
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
    if (detailsGridApi) {
      detailsGridApi.setGridOption('rowData', orderRows);
      if (orderRows.length === 0) {
        detailsGridApi.showNoRowsOverlay();
      } else {
        detailsGridApi.hideOverlay();
      }
    }
  }

  // --- Cập nhật trường dữ liệu trên dòng hàng chi tiết ---
  function updateRowField(index, field, value) {
    var r = orderRows[index];
    if (!r) return;

    if (field === 'Quantity' || field === 'UnitPrice' || field === 'Discount') {
      var num = parseFloat(value) || 0;
      r[field] = num;
      r.Amount = r.Quantity * r.UnitPrice * (1 - r.Discount / 100);

      recalculateTotals();
      _renderDetailsTable();
    } else {
      r[field] = value;
      _renderDetailsTable();
    }
  }

  // --- Xóa dòng hàng chi tiết ---
  function deleteRow(index) {
    orderRows.splice(index, 1);
    recalculateTotals();
    _renderDetailsTable();
    playSynthBeep('success');
  }

  // --- Tính toán tổng tiền, thối lại, tổng số lượng ---
  function recalculateTotals() {
    var totalQty = 0;
    var totalRawAmount = 0;
    var totalDiscount = 0;

    orderRows.forEach(function (row) {
      var qty = parseFloat(row.Quantity) || 0;
      var price = parseFloat(row.UnitPrice) || 0;
      var discPct = parseFloat(row.Discount) || 0;

      totalQty += qty;
      var rawAmt = qty * price;
      totalRawAmount += rawAmt;
      totalDiscount += rawAmt * (discPct / 100);
    });

    // Áp dụng chiết khấu tổng đơn nếu có
    var pctInput = document.getElementById('promo-discount-pct');
    var discPct = pctInput ? parseFloat(pctInput.value) || 0 : 0;
    
    // Tổng cộng sau giảm giá dòng hàng:
    var subtotal = totalRawAmount - totalDiscount;
    var finalTotal = subtotal * (1 - discPct / 100);

    // Cập nhật lên AgGrid pinned bottom row
    if (detailsGridApi) {
      detailsGridApi.setGridOption('pinnedBottomRowData', [{
        RawAmount: totalRawAmount,
        DiscountAmount: totalDiscount,
        Quantity: totalQty
      }]);
    }

    // Cập nhật lên UI headers & stats cards
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

    var cardChange = document.getElementById('card-change-money');
    if (cardChange) cardChange.textContent = Utils.formatMoney(changeVal);
  }

  // --- Xem chi tiết hóa đơn khi chọn từ danh sách trái ---
  async function selectVoucher(id) {
    openDetail();
    if (window.LoadingSpinner) LoadingSpinner.show('Đang tải chi tiết phiếu...');
    try {
      var res = await _getOrderDetail(id);
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

      // Load Promotion & % CK Tổng đơn
      var promoSelectInput = document.querySelector('#sales-promo-select');
      if (promoSelectInput) {
        promoSelectInput.value = res.CTKM || '';
        promoSelectInput.dispatchEvent(new Event('change'));
      }
      
      var discInput = document.getElementById('promo-discount-pct');
      if (discInput) {
        discInput.value = res.CTKM === 'ST210104' ? 18 : 0;
      }

      // 3. Load chi tiết hàng hóa
      var lines = Array.isArray(res.Lines) ? res.Lines
        : (Array.isArray(res.lines) ? res.lines
        : (Array.isArray(res.ChiTietDonHang) ? res.ChiTietDonHang : []));
      orderRows = lines.map(function (l) {
        return {
          ItemID: l.ma_hang || l.ItemID || '',
          ItemName: l.ten_hang || l.ItemName || '',
          Size: l.size || l.Size || 'M',
          MauSac: l.mau_sac || l.MauSac || 'Trắng',
          Quantity: parseFloat(l.so_luong || l.Quantity || 0),
          UnitPrice: parseFloat(l.don_gia || l.UnitPrice || 0),
          Discount: parseFloat(l.chiet_khau || l.Discount || l.ChietKhau || 0),
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
      docInput.value = 'VT-BD' + new Date().getMonth().toString().padStart(2, '0') + new Date().getDate().toString().padStart(2, '0') + '/' + (MOCK_DB.vouchers.length + 1).toString().padStart(4, '0');
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

    var discInput = document.getElementById('promo-discount-pct');
    if (discInput) discInput.value = '0';

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
      showToast('Chưa có sản phẩm trong phiếu bán!', 'error');
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
    payload.total_money = payload.BaseTotal;

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
        Discount: row.Discount,
        TotalAmount: row.Amount
      };
    });

    if (window.LoadingSpinner) LoadingSpinner.show('Đang lưu phiếu bán hàng...');
    try {
      var isEdit = !!currentVoucher;
      var res = isEdit ? await _updateOrder(payload) : await _createOrder(payload);

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
      var container = document.getElementById('sales-grid-container');
      if (gridApi && container && container.clientWidth > 0) {
        gridApi.sizeColumnsToFit();
      }
      var dContainer = document.getElementById('sales-details-grid-container');
      if (detailsGridApi && dContainer && dContainer.clientWidth > 0) {
        detailsGridApi.sizeColumnsToFit();
      }
    }, 100);
  }

  function closeDetail() {
    var layout = document.querySelector('.sales-layout');
    if (layout) {
      layout.classList.add('detail-collapsed');
      layout.classList.remove('mobile-show-detail');
    }
    setTimeout(function () {
      var container = document.getElementById('sales-grid-container');
      if (gridApi && container && container.clientWidth > 0) {
        gridApi.sizeColumnsToFit();
      }
      var dContainer = document.getElementById('sales-details-grid-container');
      if (detailsGridApi && dContainer && dContainer.clientWidth > 0) {
        detailsGridApi.sizeColumnsToFit();
      }
    }, 100);
  }
 
  function toggleDetail() {
    var layout = document.querySelector('.sales-layout');
    var btn = document.getElementById('btn-toggle-detail-pane');
    var icon = btn ? btn.querySelector('.material-symbols-outlined') : null;
    if (layout && layout.classList.contains('detail-collapsed')) {
      openDetail();
      if (icon) icon.textContent = 'dock_to_right';
    } else {
      closeDetail();
      if (icon) icon.textContent = 'dock_to_right';
    }
  }
 
  function toggleToolbarDropdown(event) {
    if (event) event.stopPropagation();
    var dropdown = document.querySelector('.pos-toolbar-mobile.dropdown');
    if (dropdown) {
      dropdown.classList.toggle('open');
    }
  }

  function closeToolbarDropdown() {
    var dropdown = document.querySelector('.pos-toolbar-mobile.dropdown');
    if (dropdown) {
      dropdown.classList.remove('open');
    }
  }

  // Register click outside to close mobile dropdown
  document.addEventListener('click', function (e) {
    var dropdown = document.querySelector('.pos-toolbar-mobile.dropdown');
    if (dropdown && !dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });

  async function deleteCurrentVoucher() {
    if (!currentVoucher) {
      showToast('Không có phiếu nào để xóa!', 'warning');
      return;
    }
    
    var docId = currentVoucher.DocumentID;
    if (!confirm('Bạn có chắc chắn muốn xóa phiếu ' + docId + '?')) {
      return;
    }
 
    if (window.LoadingSpinner) LoadingSpinner.show('Đang xóa phiếu...');
    try {
      var res;
      if (isMockMode) {
        // Tìm và xóa trong MOCK_DB.vouchers
        var idx = MOCK_DB.vouchers.findIndex(v => v.DocumentID === docId || v.id === docId || v.id == currentVoucher.id);
        if (idx !== -1) {
          MOCK_DB.vouchers.splice(idx, 1);
          localStorage.setItem('SANTINO_MOCK_DB', JSON.stringify(MOCK_DB));
        }
        res = { Success: 1, Message: 'Xóa phiếu thành công (Offline Mode)' };
      } else {
        res = await OrderService.deleteOrder(docId);
      }
 
      var success = false;
      var msg = 'Không thể xóa phiếu bán hàng';
      if (res && typeof res === 'object') {
        if (res.Success == '1' || res.Success === 1 || res.code === 0) success = true;
        msg = res.Message || (success ? 'Đã xóa phiếu thành công' : msg);
      }
 
      if (success) {
        showToast(msg);
        playSynthBeep('success');
        resetForm();
        refreshList();
        closeDetail();
      } else {
        showToast(msg, 'error');
        playSynthBeep('error');
      }
    } catch (e) {
      console.warn(e);
      showToast('Lỗi xóa phiếu: ' + e.message, 'error');
      playSynthBeep('error');
    } finally {
      if (window.LoadingSpinner) LoadingSpinner.hide();
    }
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
    closeDetail: closeDetail,
    toggleDetail: toggleDetail,
    deleteCurrentVoucher: deleteCurrentVoucher,
    toggleToolbarDropdown: toggleToolbarDropdown,
    closeToolbarDropdown: closeToolbarDropdown
  };
})();
