/* --- product_master.js --- */
// Product Master — Tên hàng 2 (nguồn sinh SKU)
// Dữ liệu từ hình 4 requirement
const productMaster = [
  // AMC — Modern Fit
  { ten_hang_2:"AMC395M201", nhom_hang:"SKU102", don_gia:395000, design:"M201", mau:"M201-Trắng", form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC395M201", ngung_su_dung:false, ten_nhom_hang:"SỔ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC525M102", nhom_hang:"SKU102", don_gia:525000, design:"M102", mau:"M102",        form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC525M102", ngung_su_dung:false, ten_nhom_hang:"SỔ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC545S659", nhom_hang:"SKU102", don_gia:545000, design:"S659", mau:"S659",        form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC545S659", ngung_su_dung:false, ten_nhom_hang:"SỔ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC545S660", nhom_hang:"SKU102", don_gia:545000, design:"S660", mau:"S660",        form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC545S660", ngung_su_dung:false, ten_nhom_hang:"SỔ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC545S661", nhom_hang:"SKU102", don_gia:545000, design:"S661", mau:"S661",        form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC545S661", ngung_su_dung:false, ten_nhom_hang:"SỔ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC565S655", nhom_hang:"SKU102", don_gia:565000, design:"S655", mau:"S655",        form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC565S655", ngung_su_dung:false, ten_nhom_hang:"SỔ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC565S656", nhom_hang:"SKU102", don_gia:565000, design:"S656", mau:"S656",        form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC565S656", ngung_su_dung:false, ten_nhom_hang:"SỔ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC565S657", nhom_hang:"SKU102", don_gia:565000, design:"S657", mau:"S657",        form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC565S657", ngung_su_dung:false, ten_nhom_hang:"SỔ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC565S658", nhom_hang:"SKU102", don_gia:565000, design:"S658", mau:"S658",        form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC565S658", ngung_su_dung:false, ten_nhom_hang:"SỔ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC695S810", nhom_hang:"SKU102", don_gia:695000, design:"S810", mau:"S810-Kẻ xanh",form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC695S810", ngung_su_dung:false, ten_nhom_hang:"SỔ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC695S811", nhom_hang:"SKU102", don_gia:695000, design:"S811", mau:"S811-Kẻ chỉ",form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC695S811", ngung_su_dung:false, ten_nhom_hang:"SỔ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC695S812", nhom_hang:"SKU102", don_gia:695000, design:"S812", mau:"S812-Navy",   form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC695S812", ngung_su_dung:false, ten_nhom_hang:"SỔ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC745S750", nhom_hang:"SKU102", don_gia:745000, design:"S750", mau:"S750-Kẻ",    form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC745S750", ngung_su_dung:false, ten_nhom_hang:"SỔ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC745S751", nhom_hang:"SKU102", don_gia:745000, design:"S751", mau:"S751-Kẻ",    form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC745S751", ngung_su_dung:false, ten_nhom_hang:"SỔ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC745S752", nhom_hang:"SKU102", don_gia:745000, design:"S752", mau:"S752-Kẻ",    form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC745S752", ngung_su_dung:false, ten_nhom_hang:"SỔ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC745S753", nhom_hang:"SKU102", don_gia:745000, design:"S753", mau:"S753-Kẻ",    form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC745S753", ngung_su_dung:false, ten_nhom_hang:"SỔ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC745S754", nhom_hang:"SKU102", don_gia:745000, design:"S754", mau:"S754-Kẻ",    form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC745S754", ngung_su_dung:false, ten_nhom_hang:"SỔ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  // ARC — Regular
  { ten_hang_2:"ARC355S101", nhom_hang:"SKU102", don_gia:355000, design:"S101", mau:"S101",        form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi-ARC355S101", ngung_su_dung:false, ten_nhom_hang:"SỔ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC370M101", nhom_hang:"SKU102", don_gia:370000, design:"M101", mau:"M101",        form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi-ARC370M101", ngung_su_dung:false, ten_nhom_hang:"SỔ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC380M105", nhom_hang:"SKU102", don_gia:380000, design:"M105", mau:"M105",        form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi-ARC380M105", ngung_su_dung:false, ten_nhom_hang:"SỔ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC395M101", nhom_hang:"SKU102", don_gia:395000, design:"M101", mau:"M101",        form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi-ARC395M101", ngung_su_dung:false, ten_nhom_hang:"SỔ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC445S537", nhom_hang:"SKU102", don_gia:445000, design:"S537", mau:"S537",        form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi-ARC445S537", ngung_su_dung:false, ten_nhom_hang:"SỔ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC445S538", nhom_hang:"SKU102", don_gia:445000, design:"S538", mau:"S538",        form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi-ARC445S538", ngung_su_dung:false, ten_nhom_hang:"SỔ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC445S553", nhom_hang:"SKU102", don_gia:445000, design:"S553", mau:"S553",        form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi-ARC445S553", ngung_su_dung:false, ten_nhom_hang:"SỔ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC470S391", nhom_hang:"SKU102", don_gia:470000, design:"S391", mau:"S391",        form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi-ARC470S391", ngung_su_dung:false, ten_nhom_hang:"SỔ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC470S468", nhom_hang:"SKU102", don_gia:470000, design:"S468", mau:"S468",        form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi-ARC470S468", ngung_su_dung:false, ten_nhom_hang:"SỔ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC470S469", nhom_hang:"SKU102", don_gia:470000, design:"S469", mau:"S469",        form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi-ARC470S469", ngung_su_dung:false, ten_nhom_hang:"SỔ MI NGẮN TAY", nhom_size:"Nhóm 3" },
];


/* --- size_groups.js --- */
// Size Groups — Nhóm size (từ hình 2)
const sizeGroups = {
  "Nhóm 3": [38, 39, 40, 41, 42, 43, 44, 46, 48],
  // Thêm nhóm khác ở đây khi cần
};

// Helper: lấy sizes theo tên nhóm
function getSizesByGroup(groupName) {
  return sizeGroups[groupName] || [];
}
// Helper: lấy tất cả tên nhóm
function getAllSizeGroupNames() {
  return Object.keys(sizeGroups);
}


/* --- promotions.js --- */
// Promotions — Chương trình bán hàng (từ hình 5)
const promotionsData = [
  { ma_ctbh: "CKCB", ten_ctbh: "Chiết khấu cơ bản",  mo_ta: "Chiết khấu mặc định cho đại lý", active: true },
  { ma_ctbh: "TLDL", ten_ctbh: "Tích lũy du lịch",    mo_ta: "Tích điểm đổi phần thưởng du lịch", active: true },
];


/* --- translations.js --- */
var TRANSLATIONS = {
  vi: {
    // --- Sidebar ---
    "nav.group.business": "Nghiệp vụ",
    "nav.order": "Đặt Hàng",
    "nav.orders": "Danh Sách Đơn",
    "nav.group.catalog": "Danh mục",
    "nav.products": "Sản Phẩm",
    "nav.sizes": "Size",
    "nav.sku": "Cấu hình SKU",
    "nav.promos": "CTKM",
    "nav.group.system": "Hệ thống",
    "nav.settings": "Cài đặt",
    "nav.logout": "Đăng xuất",

    // --- Page Headers ---
    "hdr.order": "Tạo Đơn Hàng Sỉ",
    "hdr.orders": "Danh Sách Đơn Hàng",
    "hdr.products": "Quản Lý Sản Phẩm",
    "hdr.sizes": "Quản Lý Size",
    "hdr.sku": "Cấu Hình SKU",
    "hdr.promos": "Chương Trình Khuyến Mãi",
    
    // --- Common ---
    "btn.add": "Thêm",
    "btn.save": "Lưu",
    "btn.cancel": "Hủy",
    "btn.delete": "Xóa",
    "btn.edit": "Sửa",
    "btn.close": "Đóng",
    "btn.preview": "Xem trước",
    "table.empty": "Không có dữ liệu",
    
    // --- Order Page ---
    "order.info": "Thông tin chung",
    "order.no": "Số CT",
    "order.date": "Ngày lập",
    "order.branch": "Chi nhánh",
    "order.staff": "Nhân viên",
    "order.promo": "Khuyến mãi",
    "order.note": "Ghi chú",
    "order.search.placeholder": "Nhập mã (VD: AMC545)...",
    "order.col.name": "Tên hàng 2",
    "order.col.form": "Form",
    "order.col.price": "Đơn giá",
    "order.col.sizegroup": "Nhóm size",
    "order.total.qty": "Tổng SP",
    "order.total.money": "Thành tiền",

    // --- Settings ---
    "settings.title": "Cài đặt Giao diện & Hiển thị",
    "settings.desc": "Cá nhân hóa trải nghiệm sử dụng hệ thống B2B của bạn.",
    "settings.font": "Phông chữ (Typography)",
    "settings.theme": "Chủ đề Hệ thống (Theme)",
    "settings.lang": "Ngôn ngữ (Language)",
    "settings.color": "Màu sắc Chủ đạo (Color)",
    "settings.reset": "Reset dữ liệu về mặc định"
  },
  en: {
    // --- Sidebar ---
    "nav.group.business": "Business",
    "nav.order": "New Order",
    "nav.orders": "Order History",
    "nav.group.catalog": "Catalog",
    "nav.products": "Products",
    "nav.sizes": "Sizes",
    "nav.sku": "SKU Config",
    "nav.promos": "Promotions",
    "nav.group.system": "System",
    "nav.settings": "Settings",
    "nav.logout": "Logout",

    // --- Page Headers ---
    "hdr.order": "Create Wholesale Order",
    "hdr.orders": "Order List",
    "hdr.products": "Product Management",
    "hdr.sizes": "Size Management",
    "hdr.sku": "SKU Configuration",
    "hdr.promos": "Promotions",

    // --- Common ---
    "btn.add": "Add",
    "btn.save": "Save",
    "btn.cancel": "Cancel",
    "btn.delete": "Delete",
    "btn.edit": "Edit",
    "btn.close": "Close",
    "btn.preview": "Preview",
    "table.empty": "No data available",

    // --- Order Page ---
    "order.info": "General Info",
    "order.no": "Voucher No",
    "order.date": "Date",
    "order.branch": "Branch",
    "order.staff": "Staff",
    "order.promo": "Promotion",
    "order.note": "Note",
    "order.search.placeholder": "Enter code (ex: AMC545)...",
    "order.col.name": "Product Code",
    "order.col.form": "Form",
    "order.col.price": "Price",
    "order.col.sizegroup": "Size Group",
    "order.total.qty": "Total Qty",
    "order.total.money": "Total Amount",

    // --- Settings ---
    "settings.title": "Appearance & Display Settings",
    "settings.desc": "Personalize your B2B system experience.",
    "settings.font": "Typography",
    "settings.theme": "System Theme",
    "settings.lang": "Language",
    "settings.color": "Primary Color",
    "settings.reset": "Reset to default data"
  },
  zh: {
    // --- Sidebar ---
    "nav.group.business": "业务",
    "nav.order": "下订单",
    "nav.orders": "订单列表",
    "nav.group.catalog": "目录",
    "nav.products": "产品",
    "nav.sizes": "尺码",
    "nav.sku": "SKU配置",
    "nav.promos": "促销",
    "nav.group.system": "系统",
    "nav.settings": "设置",
    "nav.logout": "登出",

    // --- Page Headers ---
    "hdr.order": "创建批发订单",
    "hdr.orders": "订单列表",
    "hdr.products": "产品管理",
    "hdr.sizes": "尺码管理",
    "hdr.sku": "SKU配置",
    "hdr.promos": "促销活动",

    // --- Common ---
    "btn.add": "添加",
    "btn.save": "保存",
    "btn.cancel": "取消",
    "btn.delete": "删除",
    "btn.edit": "编辑",
    "btn.close": "关闭",
    "btn.preview": "预览",
    "table.empty": "暂无数据",

    // --- Order Page ---
    "order.info": "基本信息",
    "order.no": "凭证编号",
    "order.date": "日期",
    "order.branch": "分行",
    "order.staff": "员工",
    "order.promo": "促销",
    "order.note": "备注",
    "order.search.placeholder": "输入代码 (例: AMC545)...",
    "order.col.name": "产品代码",
    "order.col.form": "版型",
    "order.col.price": "单价",
    "order.col.sizegroup": "尺码组",
    "order.total.qty": "总数量",
    "order.total.money": "总金额",

    // --- Settings ---
    "settings.title": "外观和显示设置",
    "settings.desc": "个性化您的 B2B 系统体验。",
    "settings.font": "字体 (Typography)",
    "settings.theme": "系统主题 (Theme)",
    "settings.lang": "语言 (Language)",
    "settings.color": "主题色 (Color)",
    "settings.reset": "重置为默认数据"
  }
};


/* --- db.js --- */
/**
 * DB — localStorage CRUD helper
 * Collections: 'products', 'sizes', 'promotions', 'orders'
 */
const DB = (function () {
  const PREFIX = 'santino_';

  function _key(col) { return PREFIX + col; }
  function getAll(col) {
    try { return JSON.parse(localStorage.getItem(_key(col))) || []; }
    catch { return []; }
  }
  function setAll(col, arr) { localStorage.setItem(_key(col), JSON.stringify(arr)); }

  function add(col, item) {
    const arr = getAll(col);
    item.id = item.id || Date.now() + '_' + Math.random().toString(36).slice(2, 6);
    arr.push(item);
    setAll(col, arr);
    return item;
  }
  function update(col, id, patch) {
    const arr = getAll(col).map(r => r.id === id ? { ...r, ...patch } : r);
    setAll(col, arr);
  }
  function remove(col, id) {
    setAll(col, getAll(col).filter(r => r.id !== id));
  }
  function find(col, id) {
    return getAll(col).find(r => r.id === id);
  }

  // Init seed data (chỉ chạy lần đầu nếu chưa có data)
  function initSeed() {
    if (!localStorage.getItem(_key('products'))) {
      const seeded = productMaster.map((p, i) => ({ ...p, id: 'p' + i }));
      setAll('products', seeded);
    }
    if (!localStorage.getItem(_key('sizes'))) {
      const seeded = [];
      Object.entries(sizeGroups).forEach(([group, sizes]) => {
        sizes.forEach(s => seeded.push({ id: group + '_' + s, size: s, ten_size: String(s), nhom_size: group }));
      });
      setAll('sizes', seeded);
    }
    if (!localStorage.getItem(_key('promotions'))) {
      const seeded = promotionsData.map(p => ({ ...p, id: p.ma_ctbh }));
      setAll('promotions', seeded);
    }
    if (!localStorage.getItem(_key('orders'))) {
      setAll('orders', []);
    }
  }

  return { getAll, setAll, add, update, remove, find, initSeed };
})();


/* --- utils.js --- */
/** Utility functions */
const Utils = (function () {
  function formatMoney(n) {
    return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
  }

  // AMC545S659 + 40 → AMC40545S659
  function buildSKU(ten_hang_2, size) {
    const brand = ten_hang_2.match(/^[A-Z]+/)[0];
    const rest  = ten_hang_2.slice(brand.length);
    return `${brand}${size}${rest}`;
  }

  // DH{MMYY}/{seq:04}
  function genOrderNo() {
    const orders = DB.getAll('orders');
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(2);
    const seq = String(orders.length + 1).padStart(4, '0');
    return `DH${mm}${yy}/${seq}`;
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return { formatMoney, buildSKU, genOrderNo, today, escHtml };
})();


/* --- ConfirmModal.js --- */
/**
 * Confirm Modal Component
 * Hộp thoại hỏi ý kiến (Xóa/Lưu dữ liệu)
 */
var ConfirmModal = (function () {
  var modalOverlay = null;

  function init() {
    if (document.getElementById('confirm-modal-overlay')) return;

    modalOverlay = document.createElement('div');
    modalOverlay.id = 'confirm-modal-overlay';
    modalOverlay.className = 'modal-overlay';
    modalOverlay.style.display = 'none';

    var html = `
      <div class="modal" style="width: 400px; animation: slideUp 0.2s ease;">
        <div class="modal-hdr">
          <h3 id="confirm-modal-title">Xác nhận</h3>
          <button class="btn-icon" id="confirm-modal-btn-close">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div style="padding: 4px 0;">
          <p id="confirm-modal-message" style="margin-bottom: 24px; color: var(--muted);"></p>
        </div>
        <div class="modal-actions">
          <button class="btn btn-ghost" id="confirm-modal-btn-cancel">Hủy bỏ</button>
          <button class="btn btn-primary" id="confirm-modal-btn-confirm">Đồng ý</button>
        </div>
      </div>
    `;

    modalOverlay.innerHTML = html;
    document.body.appendChild(modalOverlay);
  }

  /**
   * Mở hộp thoại xác nhận
   * @param {Object} options - { title, message, confirmText, confirmClass, onConfirm }
   */
  function show(options) {
    if (!modalOverlay) init();

    document.getElementById('confirm-modal-title').innerText = options.title || 'Xác nhận';
    document.getElementById('confirm-modal-message').innerText = options.message || 'Bạn có chắc chắn muốn thực hiện hành động này?';
    
    var btnConfirm = document.getElementById('confirm-modal-btn-confirm');
    btnConfirm.innerText = options.confirmText || 'Đồng ý';
    btnConfirm.className = 'btn ' + (options.confirmClass || 'btn-primary');

    var btnCancel = document.getElementById('confirm-modal-btn-cancel');
    var btnClose = document.getElementById('confirm-modal-btn-close');

    // Remove old listeners using clone node trick
    var newBtnConfirm = btnConfirm.cloneNode(true);
    btnConfirm.parentNode.replaceChild(newBtnConfirm, btnConfirm);

    var newBtnCancel = btnCancel.cloneNode(true);
    btnCancel.parentNode.replaceChild(newBtnCancel, btnCancel);

    var newBtnClose = btnClose.cloneNode(true);
    btnClose.parentNode.replaceChild(newBtnClose, btnClose);

    // Add new listeners
    newBtnConfirm.addEventListener('click', function() {
      hide();
      if (typeof options.onConfirm === 'function') options.onConfirm();
    });

    newBtnCancel.addEventListener('click', hide);
    newBtnClose.addEventListener('click', hide);

    modalOverlay.style.display = 'flex';
  }

  function hide() {
    if (modalOverlay) {
      modalOverlay.style.display = 'none';
    }
  }

  return {
    show: show,
    hide: hide
  };
})();


/* --- Modal.js --- */
/**
 * Generic Modal Builder
 * Mở các Pop-up Window Nhập liệu / Báo cáo không cần code cứng HTML
 */
var UIModal = (function () {

  /**
   * Mở một form Modal bất kỳ
   * @param {Object} config - { id, title, width, content (Node/String), footer (Node), onClose }
   */
  function show(config) {
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.display = 'flex';
    if (config.id) overlay.id = config.id;

    var contentWidth = config.width || '600px';

    var html = `
      <div class="modal" style="width: ${contentWidth};">
        <div class="modal-hdr">
          <h3>${config.title || 'Tiêu đề'}</h3>
          <button class="btn-icon btn-close-modal">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="ui-modal-body"></div>
        <div class="modal-actions"></div>
      </div>
    `;
    overlay.innerHTML = html;

    var bodyWrapper = overlay.querySelector('.ui-modal-body');
    if (typeof config.content === 'string') {
      bodyWrapper.innerHTML = config.content;
    } else if (config.content instanceof Node) {
      bodyWrapper.appendChild(config.content);
    }

    var footerWrapper = overlay.querySelector('.modal-actions');
    if (config.footer instanceof Node) {
      footerWrapper.appendChild(config.footer);
    } else {
      footerWrapper.style.display = 'none';
    }

    document.getElementById('modal-container').appendChild(overlay);

    function close() {
      overlay.remove();
      if (typeof config.onClose === 'function') config.onClose();
    }

    overlay.querySelector('.btn-close-modal').addEventListener('click', close);
    // Optional: close on click outside
    /* overlay.addEventListener('click', function(e) {
      if (e.target === overlay) close();
    }); */

    return {
      close: close,
      node: overlay
    };
  }

  return {
    show: show
  };
})();


/* --- router.js --- */
/**
 * Router — Hash-based SPA cho Santino B2B
 * Pattern: #/order → load src/pages/order/order.js → OrderPage.render($el)
 */
var Router = (function () {

  var ROUTES = [
    { path: '/order',        script: 'src/pages/order/order.js',               pageFn: 'OrderPage',        title: 'Đặt Hàng' },
    { path: '/orders',       script: 'src/pages/orders/orders.js',             pageFn: 'OrdersPage',       title: 'Danh Sách Đơn' },
    { path: '/order-detail', script: 'src/pages/order-detail/order-detail.js', pageFn: 'OrderDetailPage',  title: 'Chi Tiết Đơn' },
    { path: '/products',     script: 'src/pages/products/products.js',         pageFn: 'ProductsPage',     title: 'Sản Phẩm' },
    { path: '/sizes',        script: 'src/pages/sizes/sizes.js',               pageFn: 'SizesPage',        title: 'Quản Lý Size' },
    { path: '/sku',          script: 'src/pages/sku/sku.js',                   pageFn: 'SkuPage',          title: 'Cấu Hình SKU' },
    { path: '/promos',       script: 'src/pages/promos/promos.js',             pageFn: 'PromosPage',       title: 'CTKM' },
    { path: '/settings',     script: 'src/pages/settings/settings.js',        pageFn: 'SettingsPage',     title: 'Cài Đặt' },
  ];

  var _routeMap = {};
  ROUTES.forEach(function (r) { _routeMap[r.path] = r; });

  var _loadedScripts = {};
  var _templateCache = {};
  var _isNavigating = false;

  // ── Dynamic script loader ─────────────────────────────────────────────
  function _loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (_loadedScripts[src]) { resolve(); return; }
      var el = document.createElement('script');
      el.src = src;
      el.onload = function () { _loadedScripts[src] = true; resolve(); };
      el.onerror = function () { reject(new Error('Load failed: ' + src)); };
      document.body.appendChild(el);
    });
  }

  // ── Template fetch with cache ─────────────────────────────────────────
  function fetchTemplate(url) {
    if (_templateCache[url]) return Promise.resolve(_templateCache[url]);
    return fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error('Template not found: ' + url);
        return r.text();
      })
      .then(function (html) { _templateCache[url] = html; return html; });
  }

  // ── Fade helpers ──────────────────────────────────────────────────────
  function _fadeOut($el) {
    return new Promise(function (resolve) {
      $el.style.opacity = '0';
      $el.style.transition = 'opacity 100ms ease';
      setTimeout(resolve, 100);
    });
  }
  function _fadeIn($el) {
    $el.style.opacity = '1';
    $el.style.transition = 'opacity 150ms ease';
  }

  // ── Nav highlight ─────────────────────────────────────────────────────
  function _updateNav(hash) {
    document.querySelectorAll('.nav-item').forEach(function (el) {
      el.classList.remove('active');
      if (el.getAttribute('data-route') === hash) el.classList.add('active');
    });
    var hdr = document.getElementById('hdr-title');
    var route = _routeMap[hash];
    if (hdr && route) hdr.textContent = route.title;
    if (route) document.title = route.title + ' | SANTINO B2B';
  }

  // ── Main handler ──────────────────────────────────────────────────────
  function _handle() {
    if (_isNavigating) return;
    _isNavigating = true;

    var $el = document.getElementById('app-content');
    var hash = window.location.hash.replace('#', '') || '/order';
    var route = _routeMap[hash];

    _updateNav(hash);
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (!route) {
      $el.innerHTML = '<div class="empty-state"><span class="material-symbols-outlined">search_off</span><p>Trang không tồn tại: ' + hash + '</p></div>';
      _isNavigating = false;
      return;
    }

    _fadeOut($el)
      .then(function () { return _loadScript(route.script); })
      .then(function () {
        var mod = window[route.pageFn];
        if (mod && typeof mod.render === 'function') {
          return mod.render($el);
        }
        throw new Error('Module not found: ' + route.pageFn);
      })
      .then(function () { 
        if (typeof applyLanguage === 'function') applyLanguage();
        _fadeIn($el); 
        _isNavigating = false; 
      })
      .catch(function (err) {
        console.error('[Router]', err);
        $el.innerHTML = '<div class="card" style="color:var(--danger)"><span class="material-symbols-outlined" style="vertical-align:middle">error</span> ' + err.message + '</div>';
        _fadeIn($el);
        _isNavigating = false;
      });
  }

  // ── Init ──────────────────────────────────────────────────────────────
  function init() {
    window.addEventListener('hashchange', _handle);
    if (!window.location.hash) window.location.hash = '#/order';
    else _handle();
  }

  // ── Public navigate helper ────────────────────────────────────────────
  function go(path) { window.location.hash = '#' + path; }

  return { init: init, go: go, fetchTemplate: fetchTemplate, ROUTES: ROUTES };
})();


/* --- app.js --- */
/**
 * App Bootstrap — Khởi tạo Santino B2B
 * Chạy sau khi tất cả scripts đã load
 */
document.addEventListener('DOMContentLoaded', function () {
  // 1. Seed data vào localStorage lần đầu
  DB.initSeed();

  // 2. Khôi phục Cài đặt
  var theme = localStorage.getItem('santino_theme') || 'auto';
  if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark-theme');
  } else {
    document.documentElement.classList.remove('dark-theme');
  }

  var font = localStorage.getItem('santino_font');
  if(font) document.documentElement.style.setProperty('--font', '"' + font + '", sans-serif');

  var color = localStorage.getItem('santino_color');
  if(color) document.documentElement.style.setProperty('--accent', color);
  Router.init();

  // Ẩn splash nếu có
  var splash = document.getElementById('app-splash');
  if (splash) splash.style.display = 'none';
});

// ── Global helpers (dùng được từ bất kỳ page nào) ─────────────────────

function toggleTheme() {
  var isDark = document.documentElement.classList.toggle('dark-theme');
  localStorage.setItem('santino_theme', isDark ? 'dark' : 'light');
}

function showToast(msg, ok) {
  if (ok === undefined) ok = true;
  var t = document.getElementById('toast');
  var m = document.getElementById('toast-msg');
  if (!t || !m) return;
  t.querySelector('.material-symbols-outlined').textContent = ok ? 'check_circle' : 'error';
  m.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(function () { t.classList.remove('show'); }, 3000);
}

function openModal(id)  { var el = document.getElementById(id); if (el) el.classList.add('show'); }
function closeModal(id) { var el = document.getElementById(id); if (el) el.classList.remove('show'); }

// Đóng modal khi click overlay
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('show');
});

// Chuyển đổi ngôn ngữ
function applyLanguage() {
  var lang = localStorage.getItem('santino_lang') || 'vi';
  var dict = typeof TRANSLATIONS !== 'undefined' ? TRANSLATIONS[lang] || TRANSLATIONS['vi'] : {};
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    if (dict[key]) {
      // Dùng innerHTML hoặc textContent, tuỳ yêu cầu. Dùng textContent an toàn hơn.
      el.textContent = dict[key];
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
    var key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });
}

// Chạy dịch ngôn ngữ khi tải trang và sau khi render xong Router
document.addEventListener('DOMContentLoaded', applyLanguage);



