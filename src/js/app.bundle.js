/* --- translations.js --- */
var TRANSLATIONS = {
  vi: {
    // --- Sidebar ---
    "nav.group.business": "Nghiệp vụ",
    "nav.order": "Đặt Hàng",
    "nav.orders": "Danh Sách Đơn",
    "nav.order_detail": "Chi Tiết Đơn",
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
    "order.search.placeholder": "Tìm mã, tên (VD: AMC, Áo)...",
    "order.col.name": "Tên hàng 2",
    "order.col.form": "Form",
    "order.col.price": "Đơn giá",
    "order.col.sizegroup": "Nhóm size",
    "order.col.qty": "SL",
    "order.col.promo": "CTBH",
    "order.total.label": "Tổng cộng",
    "order.col.sizegroup": "Nhóm size",
    "order.preview.date": "Ngày",
    "order.preview.sp": "SP",
    "order.ac.not_found": "Không tìm thấy",
    "order.total.qty": "Tổng SP",
    "order.total.money": "Thành tiền",
    "order.search.empty": "Tìm và thêm sản phẩm để bắt đầu nhập số lượng",
    "order.preview.title": "👁 Xem Trước Đơn Hàng",
    "order.staff.placeholder": "Tên nhân viên...",
    "order.note.placeholder": "Ghi chú áp dụng toàn đơn...",
    "order.branch.hn": "Trụ sở Hà Nội",
    "order.branch.hcm": "Chi nhánh HCM",

    // --- Extra Pages ---
    "hdr.orders.desc": "Lịch sử và trạng thái đơn",
    "orders.search.placeholder": "Tìm số CT...",
    "orders.search.empty": "Chưa có đơn hàng nào",
    "hdr.products.desc": "CRUD Tên hàng 2 — nguồn sinh SKU",
    "products.search.placeholder": "Tìm tên hàng 2...",
    "hdr.sizes.desc": "CRUD size và nhóm size",
    "hdr.sku.desc": "Xem mapping: Tên hàng 2 -> SKU theo size",
    "sku.search.placeholder": "Tìm tên hàng 2...",
    "hdr.promos.desc": "Chương trình khuyến mãi / bán hàng",
    "table.col.no": "SỐ CT",
    "table.col.date": "NGÀY CT",
    "table.col.branch": "CHI NHÁNH",
    "table.col.promo": "CTKM",
    "table.col.total_qty": "TỔNG SP",
    "table.col.total_money": "TỔNG TIỀN",
    "table.col.note": "GHI CHÚ",
    "table.col.action": "THAO TÁC",
    "table.col.name2": "TÊN HÀNG 2",
    "table.col.product_group": "NHÓM HÀNG",
    "table.col.form": "FORM",
    "table.col.design_color": "DESIGN/MÀU",
    "table.col.size_group": "NHÓM SIZE",
    "table.col.price": "ĐƠN GIÁ",
    "table.col.product_name": "TÊN HÀNG HÓA",
    "table.col.status": "TRẠNG THÁI",
    "table.col.size": "SIZE",
    "table.col.size_name": "TÊN SIZE",
    "table.col.design": "DESIGN",
    "table.col.skus_generated": "SKUS SINH RA",
    "table.col.promo_code": "MÃ CTBH",
    "table.col.promo_name": "TÊN CTBH",
    "table.col.desc": "MÔ TẢ",

    // --- Settings ---
    "settings.title": "Cài đặt Giao diện & Hiển thị",
    "settings.desc": "Cá nhân hóa trải nghiệm sử dụng hệ thống B2B của bạn.",
    "settings.font": "Phông chữ (Typography)",
    "settings.font.desc": "Tùy chỉnh phông chữ hiển thị cho toàn bộ ứng dụng để có trải nghiệm tốt nhất.",
    "settings.theme": "Chủ đề Hệ thống (Theme)",
    "settings.theme.desc": "Chuyển đổi giao diện sáng tối phù hợp với môi trường làm việc.",
    "settings.lang": "Ngôn ngữ (Language)",
    "settings.lang.desc": "Tùy chọn ngôn ngữ hiển thị trên toàn hệ thống.",
    "settings.color": "Màu sắc Chủ đạo (Color)",
    "settings.color.desc": "Thay đổi màu sắc nổi bật chính của ứng dụng.",
    "settings.reset": "Khôi phục mặc định",
    "settings.reset.desc": "Thao tác này sẽ xóa toàn bộ đơn hàng và cài đặt hiện tại của bạn.",
    "settings.reset.btn": "Khôi phục mặc định",
    "settings.theme.auto.title": "Theo hệ thống",
    "settings.theme.auto.desc": "Tự động Sáng/Tối theo thiết bị.",
    "settings.theme.light.title": "Bản Phát triển (Sáng)",
    "settings.theme.light.desc": "Giao diện hiện đại, tươi sáng.",
    "settings.theme.dark.title": "Bản Phát triển (Tối)",
    "settings.theme.dark.desc": "Giao diện hiện đại, nền tối dịu mắt.",
    "settings.font.jakarta.desc": "Sang trọng, sắc nét (Mặc định)",
    "settings.font.inter.desc": "Hiện đại, dễ đọc",
    "settings.font.nunito.desc": "Bo tròn, thân thiện",
    "settings.lang.vi.desc": "Mặc định",
    "settings.lang.en.desc": "Tiếng Anh",
    "settings.lang.zh.desc": "Tiếng Trung",
    
    // --- Toasts & Alerts ---
    "toast.theme_changed": "Đã đổi chế độ",
    "toast.font_changed": "Đã đổi phông chữ",
    "toast.lang_changed": "Đã đổi ngôn ngữ",
    "toast.color_changed": "Đã đổi màu chủ đạo",
    "toast.reset_done": "Đã reset dữ liệu về mặc định. Vui lòng đợi...",
    "toast.empty_qty": "Chưa nhập số lượng!",
    "toast.empty_lines": "Chưa có dòng hàng!",
    "toast.order_saved": "Đã lưu đơn: ",
    "toast.enter_product": "Vui lòng nhập Tên hàng 2",
    "toast.not_found": "Không tìm thấy: ",
    "toast.already_in_order": "Đã có trong đơn!",
    "toast.added": "Đã thêm: ",
    "settings.reset.confirm.title": "Xóa dữ liệu",
    "settings.reset.confirm.msg": "Reset toàn bộ về dữ liệu mặc định? Đơn hàng và cài đặt sẽ bị xóa!",
    "settings.reset.confirm.btn": "Reset",
    "btn.cancel": "Hủy bỏ",
    "order.cancel.title": "Hủy đơn hàng",
    "order.cancel.msg": "Hủy đơn hàng này?",
    "order.cancel.btn": "Hủy đơn",
    "toast.order_deleted": "Đã xóa đơn hàng",
    "order.not_found": "Không tìm thấy đơn hàng",
    "order.delete.title": "Xóa đơn hàng",
    "order.delete.msg": "Xóa đơn này?",
    "btn.detail": "Chi tiết",
    "btn.back": "Quay lại"
  },
  en: {
    // --- Sidebar ---
    "nav.group.business": "Business",
    "nav.order": "New Order",
    "nav.orders": "Order History",
    "nav.order_detail": "Order Detail",
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
    "hdr.order.desc": "Create wholesale orders using size matrix",
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
    "order.search.empty": "Search and add products to start entering quantities",
    "order.col.name": "Product Code",
    "order.col.form": "Form",
    "order.col.price": "Price",
    "order.col.sizegroup": "Size Group",
    "order.col.qty": "Qty",
    "order.col.promo": "Promo",
    "order.total.label": "Total",
    "order.col.sizegroup": "Size Group",
    "order.preview.date": "Date",
    "order.preview.sp": "items",
    "order.ac.not_found": "Not found",
    "order.total.qty": "Total Qty",
    "order.total.money": "Total Amount",
    "order.preview.title": "👁 Order Preview",
    "order.staff.placeholder": "Staff name...",
    "order.note.placeholder": "Apply note to entire order...",
    "order.branch.hn": "Hanoi HQ",
    "order.branch.hcm": "HCM Branch",

    // --- Extra Pages ---
    "hdr.orders.desc": "Order history and status",
    "orders.search.placeholder": "Search Voucher No...",
    "orders.search.empty": "No orders yet",
    "hdr.products.desc": "Product code CRUD — SKU generation source",
    "products.search.placeholder": "Search product code...",
    "hdr.sizes.desc": "Size and size group CRUD",
    "hdr.sku.desc": "View mapping: Product code -> SKU by size",
    "sku.search.placeholder": "Search product code...",
    "hdr.promos.desc": "Sales / promotion programs",
    "table.col.no": "VOUCHER NO",
    "table.col.date": "DATE",
    "table.col.branch": "BRANCH",
    "table.col.promo": "PROMO",
    "table.col.total_qty": "TOTAL QTY",
    "table.col.total_money": "TOTAL AMOUNT",
    "table.col.note": "NOTE",
    "table.col.action": "ACTION",
    "table.col.name2": "PRODUCT CODE",
    "table.col.product_group": "PRODUCT GROUP",
    "table.col.form": "FORM",
    "table.col.design_color": "DESIGN/COLOR",
    "table.col.size_group": "SIZE GROUP",
    "table.col.price": "PRICE",
    "table.col.product_name": "PRODUCT NAME",
    "table.col.status": "STATUS",
    "table.col.size": "SIZE",
    "table.col.size_name": "SIZE NAME",
    "table.col.design": "DESIGN",
    "table.col.skus_generated": "GENERATED SKUS",
    "table.col.promo_code": "PROMO CODE",
    "table.col.promo_name": "PROMO NAME",
    "table.col.desc": "DESCRIPTION",

    // --- Settings ---
    "settings.title": "Appearance & Display Settings",
    "settings.desc": "Personalize your B2B system experience.",
    "settings.font": "Typography",
    "settings.font.desc": "Customize display fonts for the best experience across the app.",
    "settings.theme": "System Theme",
    "settings.theme.desc": "Toggle light/dark mode to suit your environment.",
    "settings.lang": "Language",
    "settings.lang.desc": "Choose the display language for the entire system.",
    "settings.color": "Primary Color",
    "settings.color.desc": "Change the main accent color of the application.",
    "settings.reset": "Reset to default data",
    "settings.reset.desc": "This action will clear all your current orders and settings.",
    "settings.reset.btn": "Reset to default",
    "settings.theme.auto.title": "System Default",
    "settings.theme.auto.desc": "Auto switch Light/Dark mode.",
    "settings.theme.light.title": "Developer (Light)",
    "settings.theme.light.desc": "Modern and bright interface.",
    "settings.theme.dark.title": "Developer (Dark)",
    "settings.theme.dark.desc": "Eye-friendly dark interface.",
    "settings.font.jakarta.desc": "Elegant, sharp (Default)",
    "settings.font.inter.desc": "Modern, readable",
    "settings.font.nunito.desc": "Rounded, friendly",
    "settings.lang.vi.desc": "Default",
    "settings.lang.en.desc": "English",
    "settings.lang.zh.desc": "Chinese",
    
    // --- Toasts & Alerts ---
    "toast.theme_changed": "Theme changed",
    "toast.font_changed": "Font changed",
    "toast.lang_changed": "Language changed",
    "toast.color_changed": "Primary color changed",
    "toast.reset_done": "Data reset to default. Please wait...",
    "toast.empty_qty": "Quantity not entered!",
    "toast.empty_lines": "No items added!",
    "toast.order_saved": "Order saved: ",
    "toast.enter_product": "Please enter Product Name",
    "toast.not_found": "Not found: ",
    "toast.already_in_order": "Already in order!",
    "toast.added": "Added: ",
    "settings.reset.confirm.title": "Clear Data",
    "settings.reset.confirm.msg": "Reset all data to default? Orders and settings will be deleted!",
    "settings.reset.confirm.btn": "Reset",
    "btn.cancel": "Cancel",
    "order.cancel.title": "Cancel Order",
    "order.cancel.msg": "Cancel this order?",
    "order.cancel.btn": "Cancel Order",
    "toast.order_deleted": "Order deleted",
    "order.not_found": "Order not found",
    "order.delete.title": "Delete Order",
    "order.delete.msg": "Delete this order?",
    "btn.detail": "Details",
    "btn.back": "Back"
  },
  zh: {
    // --- Sidebar ---
    "nav.group.business": "业务",
    "nav.order": "下订单",
    "nav.orders": "订单列表",
    "nav.order_detail": "订单详情",
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
    "hdr.order.desc": "使用尺码矩阵创建批发订单",
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
    "order.search.empty": "搜索并添加产品以开始输入数量",
    "order.col.name": "产品代码",
    "order.col.form": "版型",
    "order.col.price": "单价",
    "order.col.sizegroup": "尺码组",
    "order.col.qty": "数量",
    "order.col.promo": "促销",
    "order.total.label": "总计",
    "order.col.sizegroup": "尺码组",
    "order.preview.date": "日期",
    "order.preview.sp": "件商品",
    "order.ac.not_found": "未找到",
    "order.total.qty": "总数量",
    "order.total.money": "总金额",
    "order.preview.title": "👁 订单预览",
    "order.staff.placeholder": "员工姓名...",
    "order.note.placeholder": "应用于整个订单...",
    "order.branch.hn": "河内总部",
    "order.branch.hcm": "胡志明分公司",

    // --- Extra Pages ---
    "hdr.orders.desc": "订单历史和状态",
    "orders.search.placeholder": "搜索凭证编号...",
    "orders.search.empty": "暂无订单",
    "hdr.products.desc": "产品代码 CRUD — SKU 生成源",
    "products.search.placeholder": "搜索产品代码...",
    "hdr.sizes.desc": "尺码和尺码组 CRUD",
    "hdr.sku.desc": "查看映射：产品代码 -> 按尺码的 SKU",
    "sku.search.placeholder": "搜索产品代码...",
    "hdr.promos.desc": "销售/促销计划",
    "table.col.no": "凭证编号",
    "table.col.date": "日期",
    "table.col.branch": "分行",
    "table.col.promo": "促销",
    "table.col.total_qty": "总数量",
    "table.col.total_money": "总金额",
    "table.col.note": "备注",
    "table.col.action": "操作",
    "table.col.name2": "产品代码",
    "table.col.product_group": "产品组",
    "table.col.form": "版型",
    "table.col.design_color": "设计/颜色",
    "table.col.size_group": "尺码组",
    "table.col.price": "单价",
    "table.col.product_name": "产品名称",
    "table.col.status": "状态",
    "table.col.size": "尺码",
    "table.col.size_name": "尺码名称",
    "table.col.design": "设计",
    "table.col.skus_generated": "生成的 SKU",
    "table.col.promo_code": "促销代码",
    "table.col.promo_name": "促销名称",
    "table.col.desc": "描述",

    // --- Settings ---
    "settings.title": "外观和显示设置",
    "settings.desc": "个性化您的 B2B 系统体验。",
    "settings.font": "字体 (Typography)",
    "settings.font.desc": "自定义整个应用程序的显示字体以获得最佳体验。",
    "settings.theme": "系统主题 (Theme)",
    "settings.theme.desc": "切换浅色/深色模式以适应您的工作环境。",
    "settings.lang": "语言 (Language)",
    "settings.lang.desc": "选择全系统的显示语言。",
    "settings.color": "主题色 (Color)",
    "settings.color.desc": "更改应用程序的主要强调色。",
    "settings.reset": "重置为默认数据",
    "settings.reset.desc": "此操作将清除您当前的所有订单和设置。",
    "settings.reset.btn": "重置为默认",
    "settings.theme.auto.title": "系统默认",
    "settings.theme.auto.desc": "自动切换明/暗模式。",
    "settings.theme.light.title": "开发者 (浅色)",
    "settings.theme.light.desc": "现代而明亮的界面。",
    "settings.theme.dark.title": "开发者 (深色)",
    "settings.theme.dark.desc": "护眼深色界面。",
    "settings.font.jakarta.desc": "优雅、清晰 (默认)",
    "settings.font.inter.desc": "现代、易读",
    "settings.font.nunito.desc": "圆润、友好",
    "settings.lang.vi.desc": "默认",
    "settings.lang.en.desc": "英语",
    "settings.lang.zh.desc": "中文",

    // --- Toasts & Alerts ---
    "toast.theme_changed": "主题已更改",
    "toast.font_changed": "字体已更改",
    "toast.lang_changed": "语言已更改",
    "toast.color_changed": "主题色已更改",
    "toast.reset_done": "数据已重置为默认。请稍候...",
    "toast.empty_qty": "未输入数量！",
    "toast.empty_lines": "没有添加商品！",
    "toast.order_saved": "已保存订单：",
    "toast.enter_product": "请输入产品名称",
    "toast.not_found": "未找到：",
    "toast.already_in_order": "已在订单中！",
    "toast.added": "已添加：",
    "settings.reset.confirm.title": "清除数据",
    "settings.reset.confirm.msg": "将所有数据重置为默认值？订单和设置将被删除！",
    "settings.reset.confirm.btn": "重置",
    "btn.cancel": "取消",
    "order.cancel.title": "取消订单",
    "order.cancel.msg": "取消此订单？",
    "order.cancel.btn": "取消",
    "toast.order_deleted": "订单已删除",
    "order.not_found": "未找到订单",
    "order.delete.title": "删除订单",
    "order.delete.msg": "删除此订单？",
    "btn.detail": "详情",
    "btn.back": "返回"
  }
};


/* --- http.js --- */
/**
 * HTTP Client - Wrapper gọi API dùng chung cho Santino Web Order
 * Kế thừa từ Medstand: Tự động gắn Authorization token, xử lý lỗi, caching, timeout
 */
const Http = (() => {
  const TIMEOUT_MS = 15000; // 15s
  const CACHE_TTL_MS = 3 * 60 * 1000; // 3 phút
  const CACHE_PREFIX = '_api_';

  // Base URL của Backend (lấy từ env.js)
  const getApiBaseUrl = () => typeof API_CONFIG !== 'undefined' ? API_CONFIG.BASE_URL : ''; 

  // --- Cache layer (sessionStorage) ---
  function _cacheKey(url) { return CACHE_PREFIX + url; }
  
  function _getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
  }

  function _getFromCache(key) {
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) return null;
      const entry = JSON.parse(raw);
      if (Date.now() - entry.t > CACHE_TTL_MS) {
        sessionStorage.removeItem(key);
        return null;
      }
      return entry.d;
    } catch (e) { return null; }
  }

  function _setCache(key, data) {
    try {
      sessionStorage.setItem(key, JSON.stringify({ d: data, t: Date.now() }));
    } catch (e) {}
  }

  function clearCache() {
    const keysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      if (k && k.startsWith(CACHE_PREFIX)) keysToRemove.push(k);
    }
    keysToRemove.forEach(k => sessionStorage.removeItem(k));
  }

  // --- Auth & Headers ---
  function _getToken() {
    return _getCookie('auth_token');
  }

  function _headers(extra = {}) {
    const token = _getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...extra,
    };
  }

  // --- Helpers ---
  function _alert(msg, isSuccess = false) {
    if (typeof showToast !== 'undefined') {
      showToast(msg, isSuccess);
    } else {
      console.warn('API:', msg);
    }
  }

  // --- Response Handler ---
  async function _handleResponse(res) {
    // 1. Check Auth
    if (res.status === 401) {
      _alert('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.', false);
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      localStorage.removeItem('santino_user');
      window.location.href = 'login.html';
      return;
    }

    // 2. Parse JSON
    const raw = await res.text().catch(() => '');
    let data = null;
    try {
      data = JSON.parse(raw);
    } catch {
      try {
        var fixed = raw.replace(/"code"\s*:\s*([A-Za-z0-9]+)(?=[,\s}])/g, '"code":"$1"');
        data = JSON.parse(fixed);
      } catch {}
    }

    // 3. HTTP Error code
    if (!res.ok) {
      const msg = data?.msg || data?.message || `Lỗi từ máy chủ (${res.status})`;
      _alert(msg, false);
      throw new Error(msg);
    }

    // 4. Empty Response
    if (!data) {
      _alert('Không nhận được dữ liệu từ máy chủ.', false);
      throw new Error('Empty response');
    }

    // 5. Business Logic Code (quy ước code = 2 là hết phiên)
    if (data.code === 2) {
      _alert(data.msg || 'Phiên đăng nhập đã hết hạn.', false);
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      localStorage.removeItem('santino_user');
      window.location.href = 'login.html';
      return;
    }

    // 6. Business Logic Error (quy ước code != 0 là lỗi)
    if (data.code !== undefined && typeof data.code === 'number' && data.code !== 0) {
      const msg = data.msg || data.message || 'Lỗi xử lý từ máy chủ.';
      _alert(msg, false);
      throw new Error(msg);
    }

    return data;
  }

  // --- Fetch with Timeout & Retry ---
  async function _fetchWithTimeout(url, options, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), TIMEOUT_MS);
        const res = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(tid);
        return res;
      } catch (err) {
        if (attempt === retries) {
          const isTimeout = err.name === 'AbortError';
          const msg = isTimeout ? 'Kết nối quá thời gian chờ.' : 'Không thể kết nối đến máy chủ.';
          _alert(msg, false);
          throw new Error(msg);
        }
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt - 1)));
      }
    }
  }

  // --- Public API ---
  async function get(endpoint, params = {}) {
    const qs = new URLSearchParams(params).toString();
    const url = getApiBaseUrl() + endpoint + (qs ? `?${qs}` : '');

    const cached = _getFromCache(_cacheKey(url));
    if (cached) return cached;

    document.body.style.cursor = 'wait';
    try {
      const res = await _fetchWithTimeout(url, { method: 'GET', headers: _headers() });
      const data = await _handleResponse(res);
      
      const hasData = !Array.isArray(data?.records) || data.records.length > 0;
      if (data && (data.code === 0 || data.code === undefined) && hasData) {
        _setCache(_cacheKey(url), data);
      }
      return data;
    } finally {
      document.body.style.cursor = '';
    }
  }

  async function post(endpoint, body = {}) {
    document.body.style.cursor = 'wait';
    if (window.LoadingSpinner) LoadingSpinner.show();
    try {
      clearCache();
      const url = getApiBaseUrl() + endpoint;
      const res = await _fetchWithTimeout(url, {
        method: 'POST',
        headers: _headers(),
        body: JSON.stringify(body),
      });
      return _handleResponse(res);
    } finally {
      document.body.style.cursor = '';
      if (window.LoadingSpinner) LoadingSpinner.hide();
    }
  }

  async function put(endpoint, body = {}) {
    document.body.style.cursor = 'wait';
    if (window.LoadingSpinner) LoadingSpinner.show();
    try {
      clearCache();
      const url = getApiBaseUrl() + endpoint;
      const res = await _fetchWithTimeout(url, {
        method: 'PUT',
        headers: _headers(),
        body: JSON.stringify(body),
      });
      return _handleResponse(res);
    } finally {
      document.body.style.cursor = '';
      if (window.LoadingSpinner) LoadingSpinner.hide();
    }
  }

  async function del(endpoint, body = {}) {
    document.body.style.cursor = 'wait';
    if (window.LoadingSpinner) LoadingSpinner.show();
    try {
      clearCache();
      const url = getApiBaseUrl() + endpoint;
      const res = await _fetchWithTimeout(url, {
        method: 'DELETE',
        headers: _headers(),
      });
      return _handleResponse(res);
    } finally {
      document.body.style.cursor = '';
      if (window.LoadingSpinner) LoadingSpinner.hide();
    }
  }
  return { get, post, put, del, clearCache };
})();


/* --- product.service.js --- */
/**
 * Product Service
 * Xử lý gọi API liên quan đến Sản phẩm
 */
const ProductService = (() => {
  /**
   * Lấy danh sách sản phẩm (có hỗ trợ tìm kiếm)
   * @param {string} searchTerm - Từ khóa tìm kiếm (mã hoặc tên)
   */
  async function getProducts(searchTerm = '') {
    if (!API_CONFIG.BASE_URL) {
      return [];
    }

    try {
      const queryObj = { TimKiem: searchTerm };
      const res = await Http.get(API_CONFIG.ENDPOINTS.PRODUCTS.LIST, { q: JSON.stringify(queryObj) });

      // Giả sử API trả về mảng trực tiếp hoặc nằm trong { records: [] }
      return res.records || res;
    } catch (error) {
      console.warn('[ProductService] Lỗi gọi API lấy sản phẩm:', error);
      return [];
    }
  }
  async function getSizes() {
    try {
      const res = await Http.get(API_CONFIG.ENDPOINTS.SIZES.LIST);
      return res.records || res;
    } catch (error) {
      console.warn('[ProductService] Lỗi gọi API lấy bảng Size:', error);
      return [];
    }
  }

  return { getProducts, getSizes };
})();


/* --- category.service.js --- */
/**
 * Category Service
 * Xử lý gọi API Danh mục vạn năng (API_DanhMuc)
 */
const CategoryService = (() => {
  /**
   * Lấy dữ liệu danh mục theo loại, có hỗ trợ tìm kiếm server-side
   * @param {string} loai   - Loại: Branch | Employee | PaymentType | PaymentTerm
   * @param {string} search - Từ khoá tìm kiếm (server-side LIKE filter)
   */
  async function getCategories(loai = '', search = '') {
    if (!API_CONFIG.BASE_URL) return [];

    try {
      const user = JSON.parse(localStorage.getItem('santino_user') || '{}');
      const queryObj = {
        Loai: loai,
        UserRole: user.role || user.Group || '',
        UserEmployeeID: user.EmployeeID || '',
        UserManagerID: user.ManagerID || '',
        UserObjectID: user.ObjectID || ''
      };
      if (search && search.trim()) queryObj.TimKiem = search.trim();

      const params = { q: JSON.stringify(queryObj) };
      if (search && search.trim()) params._t = Date.now();


      const res = await Http.get(API_CONFIG.ENDPOINTS.CATEGORIES.LIST, params);
      const data = res.records || res;
      if (!Array.isArray(data)) return [];

      return data.map(item => ({
        id: item.id || item.Id || '',
        name: item.name || item.Name || '',
        address: item.address || '',
        phone: item.phone || '',
        department: item.department || '',
        stt: item.stt || item.STT || 0,
        memo: item.memo || item.GhiChu || '',
        due_days: item.due_days != null ? item.due_days : null,
        is_default: item.is_default || false,
        employee_id: item.employee_id || item.EmployeeID || '',
        branch_id: item.branch_id || item.BranchID || '',
        group_id: item.group_id || item.ObjectGroupID || ''
      }));
    } catch (err) {
      console.warn(`[CategoryService] Lỗi lấy danh mục ${loai}:`, err);
      return [];
    }
  }

  /**
   * Lưu thông tin khách hàng (Tạo mới hoặc Cập nhật)
   * @param {Object} customerData - Dữ liệu đầy đủ 30+ trường
   */
  async function saveCustomer(customerData) {
    if (!API_CONFIG.BASE_URL) throw new Error('API_BASE chưa cấu hình');

    try {
      const params = { q: JSON.stringify(customerData) };
      const res = await Http.post(API_CONFIG.ENDPOINTS.CUSTOMERS.SAVE, params);
      return res;
    } catch (err) {
      console.error('[CategoryService] Lỗi lưu khách hàng:', err);
      throw err;
    }
  }

  return { getCategories, saveCustomer };
})();


/* --- order.service.js --- */
/**
 * Order Service
 * Xử lý gọi API liên quan đến Đơn hàng
 */
const OrderService = (() => {
  /**
   * Lấy danh sách đơn hàng
   */
  async function getOrders(params = {}) {
    if (!API_CONFIG.BASE_URL) {
      return [];
    }
    try {
      const res = await Http.get(API_CONFIG.ENDPOINTS.ORDERS.LIST, params);
      return res.records || res;
    } catch (e) {
      console.warn('[OrderService] Lỗi gọi API lấy đơn hàng:', e);
      return [];
    }
  }

  /**
   * Tạo đơn hàng mới
   */
  async function createOrder(orderData) {
    if (!API_CONFIG.BASE_URL) throw new Error('API_BASE chưa cấu hình');
    const user = JSON.parse(localStorage.getItem('santino_user') || '{}');
    orderData.UserRole = user.role || user.Group || '';
    orderData.UserEmployeeID = user.EmployeeID || '';
    orderData.UserManagerID = user.ManagerID || '';
    orderData.UserObjectID = user.ObjectID || '';
    
    const params = { OrderJson: JSON.stringify(orderData) };
    return Http.post(API_CONFIG.ENDPOINTS.ORDERS.CREATE, params);
  }

  /**
   * Xóa đơn hàng
   */
  async function deleteOrder(documentId) {
    const params = { DocumentID: documentId };
    return Http.post(API_CONFIG.ENDPOINTS.ORDERS.DELETE, params);
  }

  return { getOrders, createOrder, deleteOrder };
})();


/* --- menu.service.js --- */
/**
 * Menu Service
 * Quản lý các lệnh gọi API liên quan đến Menu
 */
const MenuService = (() => {
  async function getChildren(parentID) {
    if (!API_CONFIG || !API_CONFIG.BASE_URL) return [];
    try {
      const queryObj = { Parent: parentID };
      const params = { q: JSON.stringify(queryObj) };
      const res = await Http.get(API_CONFIG.ENDPOINTS.MENU.CHILDREN, params);
      return res.data || res.records || res || [];
    } catch (err) {
      console.error('Lỗi tải danh sách menu con:', err);
      return [];
    }
  }

  return {
    getChildren
  };
})();


/* --- permission.js --- */
/**
 * Permission Utility
 * Quản lý phân quyền hiển thị UI
 */
var Permission = (function () {
  function _get(module) {
    var legacyPerms = JSON.parse(localStorage.getItem('app_permissions') || '{}');
    var newPerms = JSON.parse(localStorage.getItem('santino_permissions') || '{}');
    var perms = Object.keys(newPerms).length > 0 ? newPerms : legacyPerms;
    
    if (Object.keys(perms).length === 0) {
      return { xem: true, them: true, sua: true, xoa: true };
    }
    
    var p = perms[module];
    if (!p) {
      var target = (module || '').toLowerCase();
      for (var key in perms) {
        if (key.toLowerCase() === target) {
          p = perms[key];
          break;
        }
      }
    }
    p = p || {};
    
    return {
        xem: p.CanView == 1 || p.CanView === '1' || p.CanView === true || p.CanView === 'true' || p.xem == 1 || p.xem === '1' || p.xem === true || p.xem === 'true',
        them: p.CanAdd == 1 || p.CanAdd === '1' || p.CanAdd === true || p.CanAdd === 'true' || p.them == 1 || p.them === '1' || p.them === true || p.them === 'true',
        sua: p.CanEdit == 1 || p.CanEdit === '1' || p.CanEdit === true || p.CanEdit === 'true' || p.sua == 1 || p.sua === '1' || p.sua === true || p.sua === 'true',
        xoa: p.CanDelete == 1 || p.CanDelete === '1' || p.CanDelete === true || p.CanDelete === 'true' || p.xoa == 1 || p.xoa === '1' || p.xoa === true || p.xoa === 'true'
    };
  }

  return {
    canView:   function (module) { return _get(module).xem; },
    canAdd:    function (module) { return _get(module).them; },
    canEdit:   function (module) { return _get(module).sua; },
    canDelete: function (module) { return _get(module).xoa; }
  };
})();


/* --- permissions.service.js --- */
/**
 * PermissionsService
 * Quản lý toàn bộ API call liên quan đến Phân Quyền Người Dùng.
 */
var PermissionsService = (function () {

  function _ep(key) {
    return (window.API_CONFIG && window.API_CONFIG.ENDPOINTS && window.API_CONFIG.ENDPOINTS.PERMISSIONS)
      ? window.API_CONFIG.ENDPOINTS.PERMISSIONS[key]
      : null;
  }

  function _currentGroupId() {
    var u = JSON.parse(localStorage.getItem('santino_user') || '{}');
    return u.role || u.Group || u.GroupUser || u.GroupID || 'Admin';
  }

  /**
   * Lấy danh sách nhóm quyền
   * @returns {Promise<Array>}
   */
  function getGroups() {
    var endpoint = _ep('GET_GROUP_LIST');
    return Http.get(endpoint).then(function (res) {
      if (res && res.code === 0 && res.records) {
        return res.records;
      }
      return Array.isArray(res) ? res : (res && res.records ? res.records : []);
    }).catch(function (err) {
      console.error('[PermissionsService] Lỗi getGroups:', err);
      return [];
    });
  }

  /**
   * Lấy TẤT CẢ menu + quyền của nhóm
   * @param {string} groupId
   * @returns {Promise<Array>}
   */
  function getFullMenusByGroup(groupId) {
    var endpoint = _ep('GET_ALL_MENUS_FOR_GROUP');
    return Http.post(endpoint, {
      NhomNguoiDangThaoTac: _currentGroupId(),
      UserGroupID: groupId
    }).then(function (res) {
      return (res && res.records) ? res.records : (Array.isArray(res) ? res : []);
    }).catch(function (err) {
      console.error('[PermissionsService] Lỗi getFullMenusByGroup:', err);
      return [];
    });
  }

  /**
   * Lưu quyền cho một menu thuộc nhóm
   * @param {Object} payload
   * @returns {Promise}
   */
  function savePermission(payload) {
    var endpoint = _ep('SAVE_GROUP_PERMISSIONS');
    return Http.post(endpoint, payload).catch(function (err) {
      console.error('[PermissionsService] Lỗi savePermission:', err);
      throw err;
    });
  }

  /**
   * Đồng bộ quyền truy cập toàn hệ thống
   * @returns {Promise}
   */
  function sync() {
    var endpoint = _ep('SYNC');
    return Http.post(endpoint, { NhomNguoiDangThaoTac: _currentGroupId() }).catch(function (err) {
      console.error('[PermissionsService] Lỗi sync:', err);
      throw err;
    });
  }

  return {
    getGroups: getGroups,
    getFullMenusByGroup: getFullMenusByGroup,
    savePermission: savePermission,
    sync: sync
  };
})();


/* --- menus.service.js --- */
/**
 * MenusService
 * Quản lý toàn bộ API call liên quan đến Quản lý Menu Hệ thống.
 */
var MenusService = (function () {

  function _ep(key) {
    return (window.API_CONFIG && window.API_CONFIG.ENDPOINTS && window.API_CONFIG.ENDPOINTS.MENUS)
      ? window.API_CONFIG.ENDPOINTS.MENUS[key]
      : null;
  }

  function _currentGroupId() {
    var u = JSON.parse(localStorage.getItem('santino_user') || '{}');
    return u.role || u.Group || u.GroupUser || u.GroupID || 'Admin';
  }

  /**
   * Lấy toàn bộ danh sách menu
   * @returns {Promise<Array>}
   */
  function getAll() {
    var endpoint = _ep('GET_ALL');
    return Http.post(endpoint, { NhomNguoiDangThaoTac: _currentGroupId() })
      .then(function (res) {
        if (res && res.code === 0) {
          return res.records || [];
        } else {
          console.warn('[MenusService] getAll — code != 0:', res && res.msg);
          return Array.isArray(res) ? res : (res && res.records ? res.records : []);
        }
      })
      .catch(function (err) {
        console.error('[MenusService] Lỗi getAll:', err);
        return [];
      });
  }

  /**
   * Lưu menu (thêm mới hoặc cập nhật)
   * @param {Object} payload
   * @returns {Promise}
   */
  function save(payload) {
    var endpoint = _ep('SAVE');
    return Http.post(endpoint, payload).catch(function (err) {
      console.error('[MenusService] Lỗi save:', err);
      throw err;
    });
  }

  /**
   * Xóa menu
   * @param {string} menuId
   * @returns {Promise}
   */
  function deleteMenu(menuId) {
    var endpoint = _ep('DELETE');
    return Http.post(endpoint, { NhomNguoiDangThaoTac: _currentGroupId(), MenuID: menuId }).catch(function (err) {
      console.error('[MenusService] Lỗi deleteMenu:', err);
      throw err;
    });
  }

  /**
   * Cập nhật thứ tự hiển thị các menu
   * @param {Object} params - { type, orderedIds, parentId }
   * @returns {Promise}
   */
  function updateOrder(params) {
    var endpoint = _ep('UPDATE_ORDER');
    return Http.post(endpoint, {
      NhomNguoiDangThaoTac: _currentGroupId(),
      Type: params.type,
      OrderedIDs: params.orderedIds.join(','),
      ParentID: params.parentId
    }).catch(function (err) {
      console.error('[MenusService] Lỗi updateOrder:', err);
      throw err;
    });
  }

  return {
    getAll: getAll,
    save: save,
    deleteMenu: deleteMenu,
    updateOrder: updateOrder,
    currentGroupId: _currentGroupId
  };
})();


/* --- utils.js --- */
/** Utility functions */
const Utils = (function () {
  function formatMoney(n) {
    return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
  }

  // Cập nhật Blueprint v2.0: Validation an toàn
  function buildSKU(ten_hang_2, size) {
    if (!ten_hang_2) return 'INVALID_SKU';
    const clean_ten = ten_hang_2.trim();
    const match = clean_ten.match(/^[A-Z]+/);
    if (!match) return `INVALID_${clean_ten}_${size}`;
    const brand = match[0];
    const rest = clean_ten.slice(brand.length);
    return `${brand}${size}${rest}`;
  }

  // {BranchCode}-DH{MMYY}/{seq:04}
  function genOrderNo(branchCode, dateStr, existingSeq) {
    var d = dateStr ? new Date(dateStr) : new Date();
    if (isNaN(d.getTime())) d = new Date();
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var yy = String(d.getFullYear()).slice(2);
    
    // Hiển thị mặc định 0001 nếu không có đuôi số truyền vào (đáp ứng yêu cầu UI)
    var seq = existingSeq || '0001';
    
    var prefix = branchCode ? (branchCode.trim() + '-DH') : 'DH';
    return prefix + mm + yy + '/' + seq;
  }

  function uuid() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function _removeDiacritics(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
  }

  function getUserInitials() {
    try {
      const userRaw = localStorage.getItem('santino_user');
      if (!userRaw) return '??';
      const user = JSON.parse(userRaw);
      const name = user.name || user.DisplayName || 'User';
      
      const words = name.trim().split(/\s+/);
      if (words.length === 1) {
        return _removeDiacritics(words[0].substring(0, 2)).toUpperCase();
      }
      
      const first = words[0][0];
      const last = words[words.length - 1][0];
      return _removeDiacritics(first + last).toUpperCase();
    } catch (e) {
      return '??';
    }
  }

  function toggleRow(el) {
    if (!el || !el.parentElement) return;
    const isSelected = el.classList.contains('row-selected');
    const rows = el.parentElement.querySelectorAll('tr');
    rows.forEach(r => r.classList.remove('row-selected'));
    if (!isSelected) {
      el.classList.add('row-selected');
    }
  }

  return { formatMoney, buildSKU, genOrderNo, today, escHtml, uuid, getUserInitials, toggleRow };
})();


/* --- UIUtils.js --- */
/**
 * Shared UI Utilities for Components
 */
var UIControls = window.UIControls || {};

UIControls.utils = (function () {
  /**
   * Tính toán vị trí Dropdown thông minh (Tránh tràn màn hình, tránh navbar)
   */
  function computeDropdownPosition(inputElement, dropdownElement) {
    var rect = inputElement.getBoundingClientRect();

    // Navbar/header: giới hạn top khi mở lên trên
    var navbarBottom = 0;
    var navbar = document.querySelector('.app-navbar, .navbar, header, .top-bar');
    if (navbar) navbarBottom = navbar.getBoundingClientRect().bottom;

    // position:fixed — tọa độ viewport, không bị ảnh hưởng bởi overflow:hidden
    dropdownElement.style.position = 'fixed';
    dropdownElement.style.zIndex = '18000';
    dropdownElement.style.transition = 'opacity 0.15s ease, visibility 0.15s ease';
    dropdownElement.style.minWidth = rect.width + 'px';
    dropdownElement.style.maxWidth = Math.max(rect.width, window.innerWidth > 600 ? 600 : window.innerWidth - 20) + 'px';

    var isActive = dropdownElement.classList.contains('active');
    if (!isActive) {
      dropdownElement.style.maxHeight = '300px';
      dropdownElement.style.visibility = 'hidden';
      dropdownElement.classList.add('active');
    }

    var dropWidth = dropdownElement.offsetWidth;
    var dropHeight = dropdownElement.offsetHeight;

    // --- Tính toán Left ---
    var leftPos = rect.left;
    if (leftPos + dropWidth > window.innerWidth - 10) {
      // Nếu tràn phải -> Căn lề phải với input
      leftPos = rect.right - dropWidth;
    }
    // Đảm bảo không tràn trái
    leftPos = Math.max(10, leftPos);
    dropdownElement.style.left = leftPos + 'px';

    // --- Tính toán Top ---
    var spaceBelow = window.innerHeight - rect.bottom;
    var spaceAbove = rect.top - navbarBottom;

    if (spaceBelow < dropHeight && spaceAbove > spaceBelow) {
      if (spaceAbove < dropHeight) {
        dropdownElement.style.maxHeight = (spaceAbove - 4) + 'px';
        dropHeight = dropdownElement.offsetHeight;
      }
      var topPos = Math.max(rect.top - dropHeight, navbarBottom + 4);
      dropdownElement.style.top = topPos + 'px';
    } else {
      if (spaceBelow < dropHeight) {
        dropdownElement.style.maxHeight = (spaceBelow - 4) + 'px';
      }
      dropdownElement.style.top = rect.bottom + 'px';
    }

    if (!isActive) {
      dropdownElement.classList.remove('active');
      dropdownElement.style.visibility = '';
    }
  }

  /**
   * Tìm tất cả scrollable ancestors từ một element
   */
  function getScrollableAncestors(el) {
    var ancestors = [];
    var node = el.parentElement;
    while (node && node !== document.documentElement) {
      var style = window.getComputedStyle(node);
      var ov = style.overflow + style.overflowY + style.overflowX;
      if (/auto|scroll/.test(ov)) {
        ancestors.push(node);
      }
      node = node.parentElement;
    }
    ancestors.push(window);
    return ancestors;
  }

  /**
   * Sinh HTML cho Dropdown Table List
   */
  function createDropdownTableHTML(headers, data, colHighlightIndex, colGroupIndex) {
    var theadHTML = headers.map(function(h) { return '<th>' + h + '</th>'; }).join('');
    var tbodyHTML = '';

    if (colGroupIndex !== undefined && colGroupIndex >= 0) {
      var groups = {};
      data.forEach(function(row, rIdx) {
        var g = row[colGroupIndex] || 'Khác';
        if (!groups[g]) groups[g] = [];
        groups[g].push({ row: row, index: rIdx });
      });
      
      var colSpan = headers.length;
      Object.keys(groups).sort().forEach(function(g) {
         var items = groups[g];
         tbodyHTML += '<tr class="group-header" style="font-weight:700; cursor:default; border-top:1px solid var(--border); border-bottom:1px solid var(--border);"><td colspan="' + colSpan + '" style="padding: 8px 12px; background:var(--surface); color:var(--text);">' + g + ' (' + items.length + ')</td></tr>';
         items.forEach(function(item) {
            var row = item.row;
            var rIdx = item.index;
            var cells = headers.map(function(_, cIdx) {
              var cell = row[cIdx];
              var cls = (cIdx === colHighlightIndex) ? 'highlight-col' : '';
              return '<td class="' + cls + '">' + (cell != null ? cell : '') + '</td>';
            }).join('');
            tbodyHTML += '<tr data-index="' + rIdx + '" class="data-row">' + cells + '</tr>';
         });
      });
    } else {
      tbodyHTML = data.map(function(row, rIdx) {
        var cells = headers.map(function(_, cIdx) {
          var cell = row[cIdx];
          var cls = (cIdx === colHighlightIndex) ? 'highlight-col' : '';
          return '<td class="' + cls + '">' + (cell != null ? cell : '') + '</td>';
        }).join('');
        return '<tr data-index="' + rIdx + '" class="data-row">' + cells + '</tr>';
      }).join('');
    }

    return '<table class="dropdown-table"><thead><tr>' + theadHTML + '</tr></thead><tbody>' + tbodyHTML + '</tbody></table>';
  }

  return {
    computeDropdownPosition: computeDropdownPosition,
    getScrollableAncestors: getScrollableAncestors,
    createDropdownTableHTML: createDropdownTableHTML,
    setupTableSelection: function (tableBody, onSelect) {
      if (!tableBody) return;
      tableBody.addEventListener('click', function (e) {
        var tr = e.target.closest('tr');
        if (!tr) return;
        var isAlreadyActive = tr.classList.contains('active');
        Array.from(tableBody.querySelectorAll('tr')).forEach(function (r) { r.classList.remove('active'); });
        if (!isAlreadyActive) {
          tr.classList.add('active');
          if (typeof onSelect === 'function') onSelect(tr);
        } else {
          if (typeof onSelect === 'function') onSelect(null);
        }
      });
    }
  };
})();


/* --- DataComboBox.js --- */
/**
 * Data ComboBox Component
 */
var UIControls = window.UIControls || {};

UIControls.createDataComboBox = function (options) {
  var container = document.createElement('div');
  container.className = 'combo-box-container';

  // Input
  var input = document.createElement('input');
  input.type = 'text';
  input.className = 'ui-input';
  input.placeholder = options.placeholder || '';
  if (options.id) input.id = options.id;

  // Actions block – chỉ giữ nút mũi tên
  var actions = document.createElement('div');
  actions.className = 'combo-box-actions';

  var btnArrow = document.createElement('button');
  btnArrow.className = 'combo-action-btn';
  btnArrow.innerHTML = '<span class="material-symbols-outlined">arrow_drop_down</span>';
  btnArrow.title = 'Mở danh sách (F4)';
  btnArrow.type = 'button';

  actions.appendChild(btnArrow);

  // ── Dropdown Panel ──────────────────────────────────────────────
  var dropdown = document.createElement('div');
  dropdown.className = 'data-dropdown-menu';

  // Search bar bên trong dropdown
  var searchWrapper = document.createElement('div');
  searchWrapper.className = 'dd-search-wrapper';

  var searchIcon = document.createElement('span');
  searchIcon.className = 'material-symbols-outlined dd-search-icon';
  searchIcon.textContent = 'search';

  var searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'dd-search-input';
  searchInput.placeholder = 'Tìm kiếm...';

  searchWrapper.appendChild(searchIcon);
  searchWrapper.appendChild(searchInput);

  // Table wrapper (scrollable)
  var tableWrapper = document.createElement('div');
  tableWrapper.className = 'dd-table-wrapper';

  // Footer "+ Thêm mới" & Phân trang
  var footer = document.createElement('div');
  footer.className = 'dd-footer';
  footer.style.display = 'flex';
  footer.style.justifyContent = 'space-between';
  footer.style.alignItems = 'center';
  footer.style.width = '100%';

  var btnAddNew = document.createElement('button');
  btnAddNew.type = 'button';
  btnAddNew.className = 'dd-footer-add-btn';
  btnAddNew.innerHTML = '<span class="material-symbols-outlined">add</span> Thêm mới';
  
  // Mặc định là ẩn, chỉ hiện khi có yêu cầu từ options
  btnAddNew.style.display = options.showAddNew ? 'flex' : 'none';

  btnAddNew.addEventListener('click', function (e) {
    e.stopPropagation();
    hideDropdown();
    if (typeof options.onF2 === 'function') {
      options.onF2();
    }
  });

  var leftFooter = document.createElement('div');
  leftFooter.appendChild(btnAddNew);

  // Pagination Elements
  var currentPage = 1;
  var currentQuery = '';
  
  var paginationWrapper = document.createElement('div');
  paginationWrapper.className = 'dd-pagination';
  paginationWrapper.style.display = 'none';
  paginationWrapper.style.gap = '12px';
  paginationWrapper.style.alignItems = 'center';
  paginationWrapper.style.padding = '2px 8px';

  var btnPrev = document.createElement('button');
  btnPrev.type = 'button';
  btnPrev.className = 'btn-icon-sm';
  btnPrev.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px;">chevron_left</span>';
  btnPrev.style.cssText = 'border:1px solid var(--border); background:var(--surface); cursor:pointer; border-radius:6px; display:flex; align-items:center; justify-content:center; width:28px; height:28px; color:var(--muted); transition:all 0.2s;';

  var lblPage = document.createElement('span');
  lblPage.textContent = 'Trang 1';
  lblPage.style.cssText = 'font-size:13px; font-weight:600; color:var(--text); min-width:60px; text-align:center;';

  var btnNext = document.createElement('button');
  btnNext.type = 'button';
  btnNext.className = 'btn-icon-sm';
  btnNext.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px;">chevron_right</span>';
  btnNext.style.cssText = 'border:1px solid var(--border); background:var(--surface); cursor:pointer; border-radius:6px; display:flex; align-items:center; justify-content:center; width:28px; height:28px; color:var(--muted); transition:all 0.2s;';

  // Hover effects
  [btnPrev, btnNext].forEach(function(btn) {
    btn.onmouseover = function() { this.style.borderColor = 'var(--primary)'; this.style.color = 'var(--primary)'; this.style.background = 'rgba(251, 191, 36, 0.05)'; };
    btn.onmouseout = function() { this.style.borderColor = 'var(--border)'; this.style.color = 'var(--muted)'; this.style.background = 'var(--surface)'; };
  });

  btnPrev.addEventListener('click', function(e) {
    e.stopPropagation();
    if (currentPage > 1) {
      currentPage--;
      loadData(currentQuery, currentPage);
    }
  });

  btnNext.addEventListener('click', function(e) {
    e.stopPropagation();
    currentPage++;
    loadData(currentQuery, currentPage);
  });

  paginationWrapper.appendChild(btnPrev);
  paginationWrapper.appendChild(lblPage);
  paginationWrapper.appendChild(btnNext);

  footer.appendChild(leftFooter);
  footer.appendChild(paginationWrapper);

  dropdown.appendChild(searchWrapper);
  dropdown.appendChild(tableWrapper);
  dropdown.appendChild(footer);

  // ── Data & Render ───────────────────────────────────────────────
  var fullData = options.data || [];
  var cachedInitialResults = null;

  function renderTable(displayData) {
    if (UIControls.utils) {
      tableWrapper.innerHTML = UIControls.utils.createDropdownTableHTML(
        options.headers || [], displayData, options.colHighlightIndex || 0, options.colGroupIndex
      );
      var rows = tableWrapper.querySelectorAll('tbody tr.data-row');
      var currentInputVal = input.value.trim().toLowerCase();

      rows.forEach(function (row) {
        var dataRow = displayData[row.getAttribute('data-index')];
        var rowVal = (dataRow[options.colFilterIndex || 0] || '').toString().toLowerCase();

        if (currentInputVal && rowVal === currentInputVal) {
          row.classList.add('active');
        }

        row.addEventListener('click', function () {
          input.value = dataRow[options.colFilterIndex || 0];
          hideDropdown();
          if (typeof options.onSelect === 'function') {
            options.onSelect(dataRow);
          }
        });
      });
    }
  }

  // ── Scroll listeners trên đúng container đang scroll ───────────
  var _scrollTargets = [];
  var _scrollHandler = null;

  function attachScrollListeners() {
    if (_scrollHandler) return;
    _scrollHandler = function () {
      if (UIControls.utils) {
        UIControls.utils.computeDropdownPosition(container, dropdown);
      }
    };
    _scrollTargets = UIControls.utils
      ? UIControls.utils.getScrollableAncestors(container)
      : [window];
    _scrollTargets.forEach(function (target) {
      target.addEventListener('scroll', _scrollHandler, { passive: true, capture: false });
    });
    window.addEventListener('resize', _scrollHandler, { passive: true });
  }

  function detachScrollListeners() {
    if (!_scrollHandler) return;
    _scrollTargets.forEach(function (target) {
      target.removeEventListener('scroll', _scrollHandler, { capture: false });
    });
    window.removeEventListener('resize', _scrollHandler);
    _scrollHandler = null;
    _scrollTargets = [];
  }

  function loadData(q, page) {
    currentQuery = q;
    currentPage = page;
    if (typeof options.onSearch === 'function') {
      if (q === '' && page === 1 && cachedInitialResults) {
        fullData = cachedInitialResults;
        renderTable(fullData);
        if (options.enablePagination) {
          paginationWrapper.style.display = 'flex';
          lblPage.textContent = 'Trang 1 (' + fullData.length + ')';
          btnPrev.disabled = true;
          btnPrev.style.opacity = '0.5';
          btnNext.disabled = (fullData.length < 200);
          btnNext.style.opacity = (fullData.length < 200) ? '0.5' : '1';
        }
        if (UIControls.utils) {
          UIControls.utils.computeDropdownPosition(container, dropdown);
        }
        return;
      }

      var hasTable = tableWrapper.querySelector('table');
      if (hasTable) {
        var overlay = tableWrapper.querySelector('.dd-loading-overlay');
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.className = 'dd-loading-overlay';
          overlay.innerHTML = '<span class="material-symbols-outlined spinner-icon">sync</span><span>Đang tải...</span>';
          tableWrapper.style.position = 'relative';
          tableWrapper.appendChild(overlay);
        } else {
          overlay.querySelector('span:not(.spinner-icon)').textContent = 'Đang tải...';
        }
      } else {
        tableWrapper.style.minHeight = '180px';
        tableWrapper.innerHTML = '<div style="padding:12px;text-align:center;color:var(--muted,#94a3b8);font-size:13px">Đang tải...</div>';
      }

      Promise.resolve(options.onSearch(q, page)).then(function (result) {
        var overlay = tableWrapper.querySelector('.dd-loading-overlay');
        if (overlay) overlay.remove();
        tableWrapper.style.minHeight = '';

        if (Array.isArray(result)) {
          if (q === '' && page === 1) {
            cachedInitialResults = result;
          }
          fullData = result;
          renderTable(fullData);
          if (options.enablePagination) {
            paginationWrapper.style.display = 'flex';
            lblPage.textContent = 'Trang ' + page + ' (' + result.length + ')';
            btnPrev.disabled = (page <= 1);
            btnPrev.style.opacity = (page <= 1) ? '0.5' : '1';
            btnNext.disabled = (result.length < 200);
            btnNext.style.opacity = (result.length < 200) ? '0.5' : '1';
          }
          if (UIControls.utils) {
            UIControls.utils.computeDropdownPosition(container, dropdown);
          }
        }
      }).catch(function () {
        var overlay = tableWrapper.querySelector('.dd-loading-overlay');
        if (overlay) overlay.remove();
        tableWrapper.style.minHeight = '';
        tableWrapper.innerHTML = '<div style="padding:12px;text-align:center;color:#ef4444;font-size:13px">Lỗi tải dữ liệu</div>';
      });
    } else {
      var lval = q.toLowerCase();
      var filtered = lval ? fullData.filter(function (row) {
        return (row[options.colFilterIndex || 0] || '').toString().toLowerCase().includes(lval);
      }) : fullData;
      renderTable(filtered);
      if (UIControls.utils) {
        UIControls.utils.computeDropdownPosition(container, dropdown);
      }
    }
  }

  function showDropdown() {
    // Đóng các dropdown khác trước khi mở
    document.dispatchEvent(new CustomEvent('close-other-comboboxes', { detail: dropdown }));

    if (dropdown.parentNode !== document.body) {
      document.body.appendChild(dropdown);
    }
    searchInput.value = '';

    loadData('', 1);

    if (UIControls.utils) {
      UIControls.utils.computeDropdownPosition(container, dropdown);
    }
    dropdown.classList.add('active');
    attachScrollListeners();
    setTimeout(function () { 
      if (document.activeElement !== input) {
        searchInput.focus(); 
      }
    }, 50);
  }

  function hideDropdown() {
    detachScrollListeners();
    dropdown.classList.remove('active');
    if (dropdown.parentNode) dropdown.parentNode.removeChild(dropdown);
  }

  // ── Search bên trong dropdown ───────────────────────────────────
  var _searchDebounce = null;

  searchInput.addEventListener('input', function () {
    var val = searchInput.value;

    if (typeof options.onSearch === 'function') {
      clearTimeout(_searchDebounce);
      
      var hasTable = tableWrapper.querySelector('table');
      if (hasTable) {
        var overlay = tableWrapper.querySelector('.dd-loading-overlay');
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.className = 'dd-loading-overlay';
          overlay.innerHTML = '<span class="material-symbols-outlined spinner-icon">sync</span><span>Đang tìm...</span>';
          tableWrapper.style.position = 'relative';
          tableWrapper.appendChild(overlay);
        } else {
          overlay.querySelector('span:not(.spinner-icon)').textContent = 'Đang tìm...';
        }
      } else {
        tableWrapper.style.minHeight = '180px';
        tableWrapper.innerHTML = '<div style="padding:12px;text-align:center;color:var(--muted,#94a3b8);font-size:13px">Đang tìm...</div>';
      }

      _searchDebounce = setTimeout(function () {
        loadData(val, 1);
      }, 300);
    } else {
      // Client-side: filter local fullData
      var lval = val.toLowerCase();
      if (!lval) { renderTable(fullData); return; }
      var filtered = fullData.filter(function (row) {
        return (row[options.colFilterIndex || 0] || '').toString().toLowerCase().includes(lval);
      });
      renderTable(filtered);
    }
  });

  searchInput.addEventListener('click', function (e) { e.stopPropagation(); });

  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'F2') {
      e.preventDefault();
      hideDropdown();
      if (typeof options.onF2 === 'function') {
        options.onF2();
      }
    }
  });

  // ── Events ──────────────────────────────────────────────────────
  btnArrow.addEventListener('click', function (e) {
    e.preventDefault();
    dropdown.classList.contains('active') ? hideDropdown() : showDropdown();
  });

  input.addEventListener('input', function (e) {
    var val = e.target.value;
    if (typeof options.onChange === 'function') {
      options.onChange(val);
    }

    if (!options.hideDropdownOnInput && !dropdown.classList.contains('active')) {
      showDropdown();
    }
    // Ghi chú: Đã bỏ logic filter và onSearch ở đây theo yêu cầu của user. 
    // Chỉ ô tìm kiếm bên trong dropdown (searchInput) mới thực hiện filter.
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'F2') {
      e.preventDefault();
      hideDropdown();
      if (typeof options.onF2 === 'function') {
        options.onF2();
      }
    }
  });

  function _onDocClick(e) {
    if (!document.body.contains(container)) {
      _cleanupListeners();
      return;
    }
    if (!container.contains(e.target) && !dropdown.contains(e.target)) hideDropdown();
  }

  function _onCloseOthers(e) {
    if (!document.body.contains(container)) {
      _cleanupListeners();
      return;
    }
    if (e.detail !== dropdown) hideDropdown();
  }

  function _cleanupListeners() {
    document.removeEventListener('click', _onDocClick);
    document.removeEventListener('close-other-comboboxes', _onCloseOthers);
    hideDropdown();
  }

  document.addEventListener('click', _onDocClick);
  document.addEventListener('close-other-comboboxes', _onCloseOthers);


  input.addEventListener('blur', function () {
    var val = input.value.trim().toLowerCase();
    if (val && fullData.length > 0) {
      var exactMatch = fullData.find(function (row) {
        return (row[options.colFilterIndex || 0] || '').toString().toLowerCase() === val;
      });
      if (exactMatch) {
        input.value = exactMatch[options.colFilterIndex || 0];
        if (typeof options.onSelect === 'function') {
          options.onSelect(exactMatch);
        }
      }
    }
  });

  input.addEventListener('kb:open', function () { dropdown.classList.contains('active') ? hideDropdown() : showDropdown(); });
  input.addEventListener('kb:new', function () { if (options.onF2) options.onF2(); });
  input.addEventListener('kb:close', function () { hideDropdown(); });

  container.appendChild(input);
  container.appendChild(actions);

  container.clearCache = function () {
    cachedInitialResults = null;
  };

  return container;
};


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
      <div class="modal" style="width: 360px; padding: 24px; animation: slideUp 0.2s ease;">
        <div class="modal-hdr" style="margin-bottom: 16px;">
          <h3 id="confirm-modal-title">Xác nhận</h3>
          <button class="btn-icon" id="confirm-modal-btn-close">
            <span class="material-symbols-outlined" style="font-size: 20px;">close</span>
          </button>
        </div>
        <div>
          <p id="confirm-modal-message" style="margin-bottom: 20px; color: var(--muted); font-size: 14px; line-height: 1.5;"></p>
        </div>
        <div class="modal-actions" style="margin-top: 16px; padding-top: 16px;">
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
    document.getElementById('confirm-modal-message').innerHTML = options.message || 'Bạn có chắc chắn muốn thực hiện hành động này?';
    
    var btnConfirm = document.getElementById('confirm-modal-btn-confirm');
    btnConfirm.innerText = options.confirmText || 'Đồng ý';
    btnConfirm.className = 'btn ' + (options.confirmClass || 'btn-primary');

    var btnCancel = document.getElementById('confirm-modal-btn-cancel');
    var btnClose = document.getElementById('confirm-modal-btn-close');
    
    btnCancel.innerText = options.cancelText || (typeof t === 'function' ? t('btn.cancel') : 'Hủy bỏ');

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

    var container = document.getElementById('modal-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'modal-container';
      document.body.appendChild(container);
    }
    container.appendChild(overlay);

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


/* --- Pagination.js --- */
/**
 * Pagination Component
 * Trình phân trang cho DataGrid
 */
var Pagination = (function () {
  /**
   * Tạo component phân trang
   * @param {Object} options - { totalItems, itemsPerPage, currentPage, onPageChange }
   * @returns {HTMLElement} wrapper
   */
  function create(options) {
    var wrapper = document.createElement('div');
    wrapper.className = 'pagination-wrapper';

    var totalPages = Math.ceil(options.totalItems / (options.itemsPerPage || 10));
    var currentPage = options.currentPage || 1;

    var startItem = (currentPage - 1) * options.itemsPerPage + 1;
    var endItem = Math.min(currentPage * options.itemsPerPage, options.totalItems);
    if (options.totalItems === 0) { startItem = 0; endItem = 0; }

    var info = document.createElement('div');
    info.className = 'pagination-info';
    info.innerText = `Hiển thị ${startItem}-${endItem} trong số ${options.totalItems} bản ghi`;

    var controls = document.createElement('div');
    controls.className = 'pagination-controls';

    // Prev Button
    var btnPrev = document.createElement('button');
    btnPrev.className = 'page-btn';
    btnPrev.innerHTML = '<span class="material-symbols-outlined">chevron_left</span>';
    btnPrev.disabled = currentPage === 1;
    btnPrev.onclick = function() {
      if (typeof options.onPageChange === 'function') options.onPageChange(currentPage - 1);
    };
    controls.appendChild(btnPrev);

    // Page numbers logic (simplified for Max 5 pages shown)
    var startP = Math.max(1, currentPage - 2);
    var endP = Math.min(totalPages, startP + 4);
    if (endP - startP < 4) startP = Math.max(1, endP - 4);

    for (let i = startP; i <= endP; i++) {
      let pBtn = document.createElement('button');
      pBtn.className = 'page-btn' + (i === currentPage ? ' active' : '');
      pBtn.innerText = i;
      pBtn.onclick = function() {
        if (typeof options.onPageChange === 'function' && i !== currentPage) options.onPageChange(i);
      };
      controls.appendChild(pBtn);
    }

    // Next Button
    var btnNext = document.createElement('button');
    btnNext.className = 'page-btn';
    btnNext.innerHTML = '<span class="material-symbols-outlined">chevron_right</span>';
    btnNext.disabled = currentPage === totalPages || totalPages === 0;
    btnNext.onclick = function() {
      if (typeof options.onPageChange === 'function') options.onPageChange(currentPage + 1);
    };
    controls.appendChild(btnNext);

    wrapper.appendChild(info);
    wrapper.appendChild(controls);

    return wrapper;
  }

  return {
    create: create
  };
})();


/* --- Icon.js --- */
/**
 * Icon Component
 * Quản lý và render Icon (Hỗ trợ cả Material Symbols và Icon font riêng biệt)
 */
var UIIcon = (function () {
  
  /**
   * Sinh ra mã HTML của Icon
   * @param {string} iconName - Tên icon (VD: 'home', 'bar_chart', 'icon-grid')
   * @param {string} style - (Tùy chọn) Style inline bổ sung (VD: 'font-size: 18px;')
   * @param {string} className - (Tùy chọn) Class name bổ sung (VD: 'nav-icon')
   */
  function renderHtml(iconName, style, className) {
    if (!iconName) return '';
    var styleAttr = style ? ' style="' + style + '"' : '';
    var extraClass = className ? ' ' + className : '';
    
    // Nếu có chứa "icon-" hoặc dấu cách, hoặc dấu gạch ngang -> Dùng thẻ <i> cho Icon font
    if (iconName.indexOf('icon-') >= 0 || iconName.indexOf(' ') >= 0 || iconName.indexOf('-') > 0) {
      return '<i class="' + iconName + extraClass + '"' + styleAttr + '></i>';
    } else {
      // Mặc định: Google Material Symbols Outlined
      return '<span class="material-symbols-outlined' + extraClass + '"' + styleAttr + '>' + iconName + '</span>';
    }
  }

  /**
   * Tạo DOM Element của Icon
   * @param {string} iconName 
   * @param {string} className 
   */
  function create(iconName, className) {
    if (!iconName) return null;
    var el;
    if (iconName.indexOf('icon-') >= 0 || iconName.indexOf(' ') >= 0 || iconName.indexOf('-') > 0) {
      el = document.createElement('i');
      el.className = iconName + (className ? ' ' + className : '');
    } else {
      el = document.createElement('span');
      el.className = 'material-symbols-outlined' + (className ? ' ' + className : '');
      el.innerText = iconName;
    }
    return el;
  }

  return {
    renderHtml: renderHtml,
    create: create
  };
})();


/* --- UIUtils.js --- */
var UIControls = window.UIControls || {};

UIControls.utils = (function () {
  function computeDropdownPosition(inputElement, dropdownElement) {
    var rect = inputElement.getBoundingClientRect();
    var navbarBottom = 0;
    var navbar = document.querySelector('.app-navbar, .navbar, header, .top-bar');
    if (navbar) navbarBottom = navbar.getBoundingClientRect().bottom;
    dropdownElement.style.position = 'fixed';
    dropdownElement.style.zIndex = '18000';
    dropdownElement.style.transition = 'opacity 0.15s ease, visibility 0.15s ease';
    dropdownElement.style.minWidth = rect.width + 'px';
    dropdownElement.style.maxWidth = Math.max(rect.width, window.innerWidth > 600 ? 600 : window.innerWidth - 20) + 'px';
    var isActive = dropdownElement.classList.contains('active');
    if (!isActive) {
      dropdownElement.style.maxHeight = '300px';
      dropdownElement.style.visibility = 'hidden';
      dropdownElement.classList.add('active');
    }
    var dropWidth = dropdownElement.offsetWidth;
    var dropHeight = dropdownElement.offsetHeight;
    var leftPos = rect.left;
    if (leftPos + dropWidth > window.innerWidth - 10) {
      leftPos = rect.right - dropWidth;
    }
    leftPos = Math.max(10, leftPos);
    dropdownElement.style.left = leftPos + 'px';
    var spaceBelow = window.innerHeight - rect.bottom;
    var spaceAbove = rect.top - navbarBottom;
    if (spaceBelow < dropHeight && spaceAbove > spaceBelow) {
      if (spaceAbove < dropHeight) {
        dropdownElement.style.maxHeight = (spaceAbove - 4) + 'px';
        dropHeight = dropdownElement.offsetHeight;
      }
      var topPos = Math.max(rect.top - dropHeight, navbarBottom + 4);
      dropdownElement.style.top = topPos + 'px';
    } else {
      if (spaceBelow < dropHeight) {
        dropdownElement.style.maxHeight = (spaceBelow - 4) + 'px';
      }
      dropdownElement.style.top = rect.bottom + 'px';
    }
    if (!isActive) {
      dropdownElement.classList.remove('active');
      dropdownElement.style.visibility = '';
    }
  }
  function getScrollableAncestors(el) {
    var ancestors = [];
    var node = el.parentElement;
    while (node && node !== document.documentElement) {
      var style = window.getComputedStyle(node);
      var ov = style.overflow + style.overflowY + style.overflowX;
      if (/auto|scroll/.test(ov)) {
        ancestors.push(node);
      }
      node = node.parentElement;
    }
    ancestors.push(window);
    return ancestors;
  }
  function createDropdownTableHTML(headers, data, colHighlightIndex, colGroupIndex) {
    var theadHTML = headers.map(function(h) { return '<th>' + h + '</th>'; }).join('');
    var tbodyHTML = '';
    if (colGroupIndex !== undefined && colGroupIndex >= 0) {
      var groups = {};
      data.forEach(function(row, rIdx) {
        var g = row[colGroupIndex] || 'Khác';
        if (!groups[g]) groups[g] = [];
        groups[g].push({ row: row, index: rIdx });
      });
      var colSpan = headers.length;
      Object.keys(groups).sort().forEach(function(g) {
         var items = groups[g];
         tbodyHTML += '<tr class="group-header" style="font-weight:700; cursor:default; border-top:1px solid var(--border); border-bottom:1px solid var(--border);"><td colspan="' + colSpan + '" style="padding: 8px 12px; background:var(--surface); color:var(--text);">' + g + ' (' + items.length + ')</td></tr>';
         items.forEach(function(item) {
            var row = item.row;
            var rIdx = item.index;
            var cells = headers.map(function(_, cIdx) {
              var cell = row[cIdx];
              var cls = (cIdx === colHighlightIndex) ? 'highlight-col' : '';
              return '<td class="' + cls + '">' + (cell != null ? cell : '') + '</td>';
            }).join('');
            tbodyHTML += '<tr data-index="' + rIdx + '" class="data-row">' + cells + '</tr>';
         });
      });
    } else {
      tbodyHTML = data.map(function(row, rIdx) {
        var cells = headers.map(function(_, cIdx) {
          var cell = row[cIdx];
          var cls = (cIdx === colHighlightIndex) ? 'highlight-col' : '';
          return '<td class="' + cls + '">' + (cell != null ? cell : '') + '</td>';
        }).join('');
        return '<tr data-index="' + rIdx + '" class="data-row">' + cells + '</tr>';
      }).join('');
    }
    return '<table class="dropdown-table"><thead><tr>' + theadHTML + '</tr></thead><tbody>' + tbodyHTML + '</tbody></table>';
  }
  return {
    computeDropdownPosition: computeDropdownPosition,
    getScrollableAncestors: getScrollableAncestors,
    createDropdownTableHTML: createDropdownTableHTML,
    setupTableSelection: function (tableBody, onSelect) {
      if (!tableBody) return;
      tableBody.addEventListener('click', function (e) {
        var tr = e.target.closest('tr');
        if (!tr) return;
        var isAlreadyActive = tr.classList.contains('active');
        Array.from(tableBody.querySelectorAll('tr')).forEach(function (r) { r.classList.remove('active'); });
        if (!isAlreadyActive) {
          tr.classList.add('active');
          if (typeof onSelect === 'function') onSelect(tr);
        } else {
          if (typeof onSelect === 'function') onSelect(null);
        }
      });
    }
  };
})();

/* --- Checkbox.js --- */
UIControls.createCheckbox = function(options) {
  var wrapper = document.createElement('label');
  wrapper.className = 'modern-checkbox-wrapper';
  var input = document.createElement('input');
  input.type = 'checkbox';
  input.className = 'modern-checkbox';
  if (options.checked) input.checked = true;
  input.addEventListener('change', function(e) {
    if (typeof options.onChange === 'function') {
      options.onChange(e.target.checked);
    }
  });
  wrapper.appendChild(input);
  if (options.label) {
    var span = document.createElement('span');
    span.innerText = options.label;
    wrapper.appendChild(span);
  } else {
    wrapper.style.gap = '0';
  }
  return wrapper;
};


/* --- Button.js --- */
/**
 * Button Component
 * Sinh Nút bấm (Button) bằng DOM manipulation.
 */
var UIButton = (function () {
  function create(config) {
    var btn = document.createElement('button');
    var typeClass = config.type ? 'btn-' + config.type : 'btn-primary';
    if (config.type === 'tool') typeClass = 'btn-tool';
    btn.className = 'btn ' + typeClass + (config.className ? ' ' + config.className : '');
    if (config.id) btn.id = config.id;
    if (config.disabled) btn.disabled = true;
    if (config.tooltip) btn.title = config.tooltip;
    var innerHTML = '';
    if (config.icon) {
      innerHTML += '<span class="material-symbols-outlined">' + config.icon + '</span>';
    }
    if (config.text) {
      innerHTML += '<span>' + config.text + '</span>';
    }
    btn.innerHTML = innerHTML;
    if (typeof config.onClick === 'function') {
      btn.addEventListener('click', function(e) {
        if (!btn.disabled) {
          config.onClick(e);
        }
      });
    }
    return btn;
  }
  function createBar(buttonsConfig) {
    var bar = document.createElement('div');
    bar.className = 'button-bar';
    buttonsConfig.forEach(function(cfg) {
      if (cfg === '|') {
        var div = document.createElement('div');
        div.className = 'divider';
        bar.appendChild(div);
      } else {
        bar.appendChild(create(cfg));
      }
    });
    return bar;
  }
  function createHTML(config) {
    var typeClass = config.type ? 'btn-' + config.type : 'btn-primary';
    if (config.type === 'tool') typeClass = 'btn-tool';
    var className = 'btn ' + typeClass + (config.className ? ' ' + config.className : '');
    var idAttr = config.id ? ` id="${config.id}"` : '';
    var disabledAttr = config.disabled ? ' disabled' : '';
    var titleAttr = config.tooltip ? ` title="${config.tooltip}"` : '';
    var onClickAttr = config.onClick ? ` onclick="${config.onClick}"` : '';
    var styleAttr = config.style ? ` style="${config.style}"` : '';
    var dataAttrs = '';
    if (config.data) {
      for (var key in config.data) {
        dataAttrs += ` data-${key}="${config.data[key]}"`;
      }
    }
    var innerHTML = '';
    if (config.icon) {
      var iconStyle = config.iconStyle ? ` style="${config.iconStyle}"` : '';
      innerHTML += `<span class="material-symbols-outlined"${iconStyle}>${config.icon}</span>`;
    }
    if (config.text) {
      var textStyle = config.textStyle ? ` style="${config.textStyle}"` : '';
      innerHTML += config.icon ? ` <span${textStyle}>${config.text}</span>` : `<span${textStyle}>${config.text}</span>`;
    }
    return `<button class="${className}"${idAttr}${disabledAttr}${titleAttr}${onClickAttr}${styleAttr}${dataAttrs}>${innerHTML}</button>`;
  }
  return {
    create: create,
    createBar: createBar,
    createHTML: createHTML
  };
})();


/* --- NestedTabs.js --- */
/**
 * UINestedTabs — Tab phân cấp 2 cấp (Cha → Con) + Kéo thả sắp xếp
 */
var UINestedTabs = (function () {
  function create(records, options) {
    options = options || {};
    var isDraggable = options.draggable !== false;
    var parents = records.filter(function (r) {
      return !r.parent || r.parent.trim() === '';
    });
    var childrenMap = {};
    records.forEach(function (r) {
      if (r.parent && r.parent.trim() !== '') {
        if (!childrenMap[r.parent]) childrenMap[r.parent] = [];
        childrenMap[r.parent].push(r);
      }
    });
    if (parents.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'ui-nested-tabs-empty';
      empty.textContent = 'Không có dữ liệu Tab';
      return empty;
    }
    if (options.vertical) {
      return _createVertical(parents, childrenMap, options);
    }
    var defaultParentId = options.defaultParentId || parents[0].id;
    var activeParent    = parents.find(function (p) { return p.id === defaultParentId; }) || parents[0];
    var wrapper = document.createElement('div');
    wrapper.className = 'ui-nested-tabs';
    var parentBar = document.createElement('div');
    parentBar.className = 'ui-nested-tabs__parent-bar';
    var childArea = document.createElement('div');
    childArea.className = 'ui-nested-tabs__child-area';
    parents.forEach(function (parentItem) {
      var isParentActive = (parentItem.id === activeParent.id);
      var children       = childrenMap[parentItem.id] || [];
      var pBtn = _buildParentBtn(parentItem, isParentActive, children.length, isDraggable);
      parentBar.appendChild(pBtn);
      var childSection = document.createElement('div');
      childSection.className = 'ui-nested-tabs__section' + (isParentActive ? ' active' : '');
      childSection.dataset.sectionId = parentItem.id;
      if (children.length > 0) {
        var defaultChildId  = isParentActive ? (options.defaultChildId || children[0].id) : children[0].id;
        var childBar        = document.createElement('div');
        childBar.className  = 'ui-nested-tabs__child-bar';
        var panelArea       = document.createElement('div');
        panelArea.className = 'ui-nested-tabs__panel-area';
        children.forEach(function (childItem) {
          var isChildActive = (childItem.id === defaultChildId);
          var cBtn = _buildChildBtn(childItem, parentItem, isChildActive, isDraggable);
          childBar.appendChild(cBtn);
          var panel = _buildPanel(childItem, parentItem, isChildActive, options);
          panelArea.appendChild(panel);
          cBtn.addEventListener('click', function () {
            _activateChildTab(childBar, panelArea, cBtn, panel);
            if (typeof options.onTabChange === 'function') {
              options.onTabChange(parentItem.id, childItem.id);
            }
          });
        });
        if (isDraggable) {
          _attachDragToBar(childBar, panelArea, 'child', parentItem.id, options);
        }
        childSection.appendChild(childBar);
        childSection.appendChild(panelArea);
      } else {
        var soloPanel = _buildPanel(parentItem, null, true, options);
        childSection.appendChild(soloPanel);
      }
      childArea.appendChild(childSection);
      pBtn.addEventListener('click', function () {
        _activateParentTab(parentBar, childArea, pBtn, childSection);
        if (typeof options.onTabChange === 'function') {
          var activeChild = childSection.querySelector('.ui-nested-tab-child-btn.active');
          options.onTabChange(parentItem.id, activeChild ? activeChild.dataset.childId : null);
        }
      });
    });
    if (isDraggable) {
      _attachDragToBar(parentBar, null, 'parent', null, options);
    }
    wrapper.appendChild(parentBar);
    wrapper.appendChild(childArea);
    return wrapper;
  }
  function createFromDB(dbRows, options) {
    var records = (dbRows || []).map(function (row) {
      return {
        id:       row.MenuID   || row.id       || row.menuId,
        parent:   row.Parent   || row.parent   || row.parentId || '',
        label:    row.VN       || row.label    || row.name || row.Label || '(Không tên)',
        labelEN:  row.EN       || row.en       || '',
        icon:     row.IconClass || row.icon    || '',
        formName: row.FormName  || row.formName || ''
      };
    });
    return create(records, options);
  }
  function _buildParentBtn(item, isActive, childCount, isDraggable) {
    var btn = document.createElement('button');
    btn.className = 'ui-nested-tab-parent-btn' + (isActive ? ' active' : '');
    btn.dataset.parentId = item.id;
    if (isDraggable) {
      var handle = UIIcon.create('drag_indicator', 'ui-nested-drag-handle');
      btn.appendChild(handle);
      btn.draggable = true;
      btn.dataset.dragType = 'parent';
    }
    if (item.icon) {
      var iconEl = UIIcon.create(item.icon);
      if (iconEl) { iconEl.style.fontSize = '18px'; btn.appendChild(iconEl); }
    }
    var labelSpan = document.createElement('span');
    labelSpan.textContent = item.label || item.id;
    btn.appendChild(labelSpan);
    if (childCount > 0) {
      var badge = document.createElement('span');
      badge.className = 'ui-nested-tab-badge';
      badge.textContent = childCount;
      btn.appendChild(badge);
    }
    return btn;
  }
  function _buildChildBtn(childItem, parentItem, isActive, isDraggable) {
    var btn = document.createElement('button');
    btn.className = 'ui-nested-tab-child-btn' + (isActive ? ' active' : '');
    btn.dataset.childId  = childItem.id;
    btn.dataset.parentId = parentItem.id;
    if (isDraggable) {
      var handle = UIIcon.create('drag_indicator', 'ui-nested-drag-handle ui-nested-drag-handle--child');
      btn.appendChild(handle);
      btn.draggable = true;
      btn.dataset.dragType = 'child';
    }
    var labelSpan = document.createElement('span');
    labelSpan.textContent = childItem.label || childItem.id;
    btn.appendChild(labelSpan);
    return btn;
  }
  function _buildPanel(item, parentItem, isActive, options) {
    var panel = document.createElement('div');
    panel.className = 'ui-nested-tab-panel' + (isActive ? ' active' : '');
    panel.id = 'nested-panel-' + item.id;
    if (typeof options.renderContent === 'function') {
      var content = options.renderContent(item);
      if (typeof content === 'string') {
        panel.innerHTML = content;
      } else if (content instanceof Node) {
        panel.appendChild(content);
      }
    } else {
      panel.innerHTML = _defaultPanelHTML(item, parentItem);
    }
    return panel;
  }
  function _activateParentTab(parentBar, childArea, activeBtn, activeSection) {
    parentBar.querySelectorAll('.ui-nested-tab-parent-btn').forEach(function (b) {
      b.classList.remove('active');
    });
    childArea.querySelectorAll('.ui-nested-tabs__section').forEach(function (s) {
      s.classList.remove('active');
    });
    activeBtn.classList.add('active');
    activeSection.classList.add('active');
  }
  function _activateChildTab(childBar, panelArea, activeBtn, activePanel) {
    childBar.querySelectorAll('.ui-nested-tab-child-btn').forEach(function (b) {
      b.classList.remove('active');
    });
    panelArea.querySelectorAll('.ui-nested-tab-panel').forEach(function (p) {
      p.classList.remove('active');
    });
    activeBtn.classList.add('active');
    activePanel.classList.add('active');
  }
  function _attachDragToBar(bar, panelArea, type, parentId, options) {
    var dragging    = null;
    var placeholder = null;
    var btnSelector = (type === 'parent') ? '.ui-nested-tab-parent-btn' : '.ui-nested-tab-child-btn';
    bar.addEventListener('dragstart', function (e) {
      var btn = e.target.closest(btnSelector);
      if (!btn) return;
      dragging = btn;
      dragging.classList.add('ui-nested-dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', btn.dataset.parentId || btn.dataset.childId || '');
      placeholder = document.createElement('div');
      placeholder.className = 'ui-nested-drop-placeholder';
      if (type === 'child') placeholder.classList.add('ui-nested-drop-placeholder--child');
    });
    bar.addEventListener('dragover', function (e) {
      if (!dragging) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      var target = e.target.closest(btnSelector);
      if (!target || target === dragging) return;
      var rect   = target.getBoundingClientRect();
      var offset = e.clientX - rect.left;
      var half = rect.width / 2;
      if (placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);
      if (offset < half) {
        bar.insertBefore(placeholder, target);
      } else {
        var next = target.nextSibling;
        if (next) bar.insertBefore(placeholder, next);
        else bar.appendChild(placeholder);
      }
    });
    bar.addEventListener('dragleave', function (e) {
      if (!bar.contains(e.relatedTarget) && placeholder && placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
      }
    });
    bar.addEventListener('drop', function (e) {
      e.preventDefault();
      if (!dragging || !placeholder || !placeholder.parentNode) return;
      bar.insertBefore(dragging, placeholder);
      placeholder.parentNode.removeChild(placeholder);
      if (panelArea) {
        _syncPanelOrder(bar, panelArea, btnSelector);
      }
      if (typeof options.onReorder === 'function') {
        var orderedIds = Array.from(bar.querySelectorAll(btnSelector)).map(function (b) {
          return type === 'parent' ? b.dataset.parentId : b.dataset.childId;
        });
        options.onReorder(type, orderedIds, parentId);
      }
      _cleanup();
    });
    bar.addEventListener('dragend', function () {
      _cleanup();
    });
    function _cleanup() {
      if (dragging) {
        dragging.classList.remove('ui-nested-dragging');
        dragging = null;
      }
      if (placeholder && placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
      }
      placeholder = null;
    }
  }
  function _syncPanelOrder(childBar, panelArea, btnSelector) {
    var btns = Array.from(childBar.querySelectorAll(btnSelector));
    btns.forEach(function (btn) {
      var childId = btn.dataset.childId;
      var panel   = panelArea.querySelector('#nested-panel-' + childId);
      if (panel) panelArea.appendChild(panel);
    });
  }
  function _defaultPanelHTML(item, parentItem) {
    return [
      '<div class="ui-nested-tab-default-content">',
        UIIcon.renderHtml(item.icon || 'folder_open', 'font-size:40px;opacity:0.2;display:block;margin-bottom:12px'),
        '<div style="font-weight:600;font-size:15px;margin-bottom:6px">', item.label || item.id, '</div>',
        parentItem ? '<div style="font-size:12px;opacity:0.5">Thuộc nhóm: ' + parentItem.label + ' (' + parentItem.id + ')</div>' : '',
        item.formName ? '<code style="font-size:11px;opacity:0.5;display:block;margin-top:8px">' + item.formName + '</code>' : '',
      '</div>'
    ].join('');
  }
  function _createVertical(parents, childrenMap, options) {
    var isDraggable = options.draggable !== false;
    var defaultParentId = options.defaultParentId || parents[0].id;
    var activeParent    = parents.find(function (p) { return p.id === defaultParentId; }) || parents[0];
    var defaultChildId  = options.defaultChildId  || null;
    var initChildren = childrenMap[activeParent.id] || [];
    var activeChildId = defaultChildId || (initChildren.length > 0 ? initChildren[0].id : null);
    var allContentPanels = [];
    var allSidebarBtns = [];
    var wrapper = document.createElement('div');
    wrapper.className = 'ui-nested-tabs ui-nested-tabs--vertical';
    var sidebar = document.createElement('div');
    sidebar.className = 'ui-nested-tabs__sidebar';
    var contentArea = document.createElement('div');
    contentArea.className = 'ui-nested-tabs__vertical-content';
    function _buildSidebarNode(node, level, isNodeActive, shouldOpen) {
      var children = childrenMap[node.id] || [];
      var isRoot = level === 0;
      var parentGroup = document.createElement('div');
      parentGroup.className = 'ui-nested-tabs__sidebar-parent level-' + level;
      if (isDraggable) {
        parentGroup.draggable = true;
        parentGroup.dataset.dragParentId = node.id;
      }
      var pBtn = document.createElement('button');
      pBtn.className = (isRoot ? 'ui-nested-tab-parent-btn--v' : 'ui-nested-tab-child-btn--v') + (isNodeActive ? ' active' : '');
      pBtn.dataset.nodeId = node.id;
      pBtn.dataset.parentId = node.parent || '';
      if (!isRoot) pBtn.dataset.childId = node.id;
      if (level > 0) pBtn.style.paddingLeft = (16 + level * 20) + 'px';
      if (isDraggable) {
        var handle = UIIcon.create('drag_indicator', 'ui-nested-drag-handle' + (isRoot ? '' : ' ui-nested-drag-handle--child'));
        pBtn.appendChild(handle);
        if (!isRoot) {
            pBtn.draggable = true;
            pBtn.dataset.dragType = 'child';
        }
      }
      var iconWrap = document.createElement('div');
      iconWrap.style.cssText = 'width: 20px; display: flex; justify-content: center; align-items: center; flex-shrink: 0;';
      if (!isRoot) iconWrap.style.marginRight = '8px';
      var actualIcon = node.icon;
      if (!actualIcon || actualIcon.indexOf('icon-') === 0) actualIcon = (isRoot ? 'folder_open' : 'horizontal_rule');
      var iconEl = UIIcon.create(actualIcon);
      if (iconEl) {
        iconEl.style.fontSize = isRoot ? '18px' : '16px';
        if (!node.icon || node.icon.indexOf('icon-') === 0) iconEl.style.opacity = '0.3';
        iconWrap.appendChild(iconEl);
      }
      pBtn.appendChild(iconWrap);
      var lbl = document.createElement('span');
      lbl.style.cssText = 'flex:1;overflow:hidden;text-overflow:ellipsis;';
      lbl.textContent = node.label || node.id;
      pBtn.appendChild(lbl);
      if (children.length > 0) {
        var badge = document.createElement('span');
        badge.className = 'ui-nested-tab-badge';
        badge.style.cssText = 'min-width:18px;height:18px;font-size:10px; margin-right: 4px;';
        badge.textContent = children.length;
        pBtn.appendChild(badge);
        var chevron = UIIcon.create('expand_more', 'ui-nested-parent-chevron');
        pBtn.appendChild(chevron);
      }
      parentGroup.appendChild(pBtn);
      allSidebarBtns.push(pBtn);
      var childList = null;
      if (children.length > 0) {
        childList = document.createElement('div');
        childList.className = 'ui-nested-tabs__child-list' + (shouldOpen ? ' open' : '');
        children.forEach(function (childItem) {
           var childIsActive = isNodeActive && (childItem.id === activeChildId);
           var childShouldOpen = childIsActive;
           var cRes = _buildSidebarNode(childItem, level + 1, childIsActive, childShouldOpen);
           childList.appendChild(cRes.group);
        });
        parentGroup.appendChild(childList);
        if (isDraggable) {
          _attachVerticalDrag(childList, contentArea, node.id, options);
        }
      }
      var parentPanel = document.createElement('div');
      parentPanel.className = 'ui-nested-tab-panel--v' + (isNodeActive && (!activeChildId || activeChildId === '') ? ' active' : '');
      parentPanel.id = 'nested-panel-' + node.id;
      if (typeof options.renderContent === 'function') {
        var sc = options.renderContent(node);
        if (typeof sc === 'string') { parentPanel.innerHTML = sc; }
        else if (sc instanceof Node) { parentPanel.appendChild(sc); }
      } else { parentPanel.innerHTML = _defaultPanelHTML(node, null); }
      contentArea.appendChild(parentPanel);
      allContentPanels.push(parentPanel);
      pBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var isPanelActive = parentPanel.classList.contains('active');
        allSidebarBtns.forEach(function(b) { b.classList.remove('active'); });
        allContentPanels.forEach(function(p) { p.classList.remove('active'); });
        pBtn.classList.add('active');
        if (!isPanelActive) {
          parentPanel.classList.add('active');
          if (childList) childList.classList.add('open');
          var curr = parentGroup.parentElement;
          while(curr && curr.classList.contains('ui-nested-tabs__child-list')) {
            curr.classList.add('open');
            curr = curr.parentElement.parentElement;
          }
          if (typeof options.onTabChange === 'function') {
            options.onTabChange(node.id, null);
          }
        } else {
          parentPanel.classList.add('active');
          if (childList) childList.classList.toggle('open');
        }
      });
      return { group: parentGroup };
    }
    parents.forEach(function (parentItem) {
      var isParentActive = (parentItem.id === activeParent.id);
      var res = _buildSidebarNode(parentItem, 0, isParentActive, isParentActive);
      sidebar.appendChild(res.group);
    });
    if (isDraggable) {
      _attachVerticalDragParent(sidebar, options);
    }
    var resizer = document.createElement('div');
    resizer.className = 'ui-nested-resizer';
    sidebar.appendChild(resizer);
    _initSidebarResizer(resizer, sidebar);
    wrapper.appendChild(sidebar);
    wrapper.appendChild(contentArea);
    return wrapper;
  }
  function _initSidebarResizer(resizer, sidebar) {
    var isResizing = false;
    resizer.addEventListener('mousedown', function (e) {
      isResizing = true;
      resizer.classList.add('is-resizing');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      var onMouseMove = function (e) {
        if (!isResizing) return;
        var containerRect = sidebar.parentElement.getBoundingClientRect();
        var newWidth = e.clientX - containerRect.left;
        if (newWidth < 180) newWidth = 180;
        if (newWidth > 600) newWidth = 600;
        sidebar.style.width = newWidth + 'px';
      };
      var onMouseUp = function () {
        isResizing = false;
        resizer.classList.remove('is-resizing');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });
  }
  function _attachVerticalDrag(childList, contentArea, parentId, options) {
    var dragging    = null;
    var placeholder = null;
    childList.addEventListener('dragstart', function (e) {
      var grp = e.target.closest('.ui-nested-tabs__sidebar-parent');
      if (!grp || grp.parentElement !== childList) return;
      dragging = grp;
      dragging.classList.add('ui-nested-dragging');
      e.dataTransfer.effectAllowed = 'move';
      placeholder = document.createElement('div');
      placeholder.className = 'ui-nested-drop-placeholder--v';
      e.stopPropagation();
    });
    childList.addEventListener('dragover', function (e) {
      if (!dragging) return;
      e.preventDefault();
      var target = e.target.closest('.ui-nested-tabs__sidebar-parent');
      if (!target || target === dragging || target.parentElement !== childList) return;
      if (placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);
      var rect   = target.getBoundingClientRect();
      var isUpper = (e.clientY - rect.top) < rect.height / 2;
      if (isUpper) childList.insertBefore(placeholder, target);
      else { var nx = target.nextSibling; if (nx) childList.insertBefore(placeholder, nx); else childList.appendChild(placeholder); }
    });
    childList.addEventListener('dragleave', function (e) {
      if (!childList.contains(e.relatedTarget) && placeholder && placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
      }
    });
    childList.addEventListener('drop', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (!dragging || !placeholder || !placeholder.parentNode) return;
      childList.insertBefore(dragging, placeholder);
      placeholder.parentNode.removeChild(placeholder);
      if (typeof options.onReorder === 'function') {
        var ids = Array.from(childList.querySelectorAll(':scope > .ui-nested-tabs__sidebar-parent > .ui-nested-tab-child-btn--v')).map(function (b) { return b.dataset.childId || b.dataset.nodeId; });
        options.onReorder('child', ids, parentId);
      }
      _vCleanup();
    });
    childList.addEventListener('dragend', function(e) { e.stopPropagation(); _vCleanup(); });
    function _vCleanup() {
      if (dragging) { dragging.classList.remove('ui-nested-dragging'); dragging = null; }
      if (placeholder && placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);
      placeholder = null;
    }
  }
  function _attachVerticalDragParent(sidebar, options) {
    var dragging    = null;
    var placeholder = null;
    sidebar.addEventListener('dragstart', function (e) {
      var grp = e.target.closest('.ui-nested-tabs__sidebar-parent');
      if (!grp || grp.parentElement !== sidebar) return;
      dragging = grp;
      dragging.classList.add('ui-nested-dragging');
      e.dataTransfer.effectAllowed = 'move';
      placeholder = document.createElement('div');
      placeholder.className = 'ui-nested-drop-placeholder--v';
      placeholder.style.margin = '2px 0';
      e.stopPropagation();
    });
    sidebar.addEventListener('dragover', function (e) {
      if (!dragging) return;
      e.preventDefault();
      var target = e.target.closest('.ui-nested-tabs__sidebar-parent');
      if (!target || target === dragging || target.parentElement !== sidebar) return;
      if (placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);
      var rect   = target.getBoundingClientRect();
      var isUpper = (e.clientY - rect.top) < rect.height / 2;
      if (isUpper) sidebar.insertBefore(placeholder, target);
      else { var nx = target.nextSibling; if (nx) sidebar.insertBefore(placeholder, nx); else sidebar.appendChild(placeholder); }
    });
    sidebar.addEventListener('dragleave', function (e) {
      if (!sidebar.contains(e.relatedTarget) && placeholder && placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
      }
    });
    sidebar.addEventListener('drop', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (!dragging || !placeholder || !placeholder.parentNode) return;
      sidebar.insertBefore(dragging, placeholder);
      placeholder.parentNode.removeChild(placeholder);
      if (typeof options.onReorder === 'function') {
        var ids = Array.from(sidebar.querySelectorAll(':scope > .ui-nested-tabs__sidebar-parent > .ui-nested-tab-parent-btn--v')).map(function (b) {
          return b.dataset.parentId || b.dataset.nodeId;
        });
        options.onReorder('parent', ids, null);
      }
      _vpCleanup();
    });
    sidebar.addEventListener('dragend', function(e) { e.stopPropagation(); _vpCleanup(); });
    function _vpCleanup() {
      if (dragging) { dragging.classList.remove('ui-nested-dragging'); dragging = null; }
      if (placeholder && placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);
      placeholder = null;
    }
  }
  return {
    create:       create,
    createFromDB: createFromDB
  };
})();

/* --- EmptyState.js --- */
/**
 * EmptyState Component
 */
var UIEmptyState = (function () {
  function create(config) {
    var wrapper = document.createElement('div');
    wrapper.className = 'ui-empty-state';
    var iconSpan = document.createElement('span');
    iconSpan.className = 'material-symbols-outlined ui-empty-icon';
    iconSpan.innerText = config.icon || 'inbox';
    wrapper.appendChild(iconSpan);
    var titleDiv = document.createElement('div');
    titleDiv.className = 'ui-empty-title';
    titleDiv.innerText = config.title || 'Không có dữ liệu';
    wrapper.appendChild(titleDiv);
    if (config.desc) {
      var descDiv = document.createElement('div');
      descDiv.className = 'ui-empty-desc';
      descDiv.innerText = config.desc;
      wrapper.appendChild(descDiv);
    }
    if (config.action instanceof Node) {
      wrapper.appendChild(config.action);
    }
    return wrapper;
  }
  function createHTML(config) {
    var icon = config.icon || 'inbox';
    var title = config.title || 'Không có dữ liệu';
    var descHtml = config.desc ? `<div class="ui-empty-desc">${config.desc}</div>` : '';
    var actionHtml = config.actionHtml ? config.actionHtml : '';
    return `
      <div class="ui-empty-state">
        <span class="material-symbols-outlined ui-empty-icon">${icon}</span>
        <div class="ui-empty-title">${title}</div>
        ${descHtml}
        ${actionHtml}
      </div>
    `;
  }
  function createTableRowHTML(config) {
    var colspan = config.colspan || 1;
    var text = config.text || 'Chưa có dữ liệu';
    var actionHtml = config.actionHtml ? ` <span class="ms-1">${config.actionHtml}</span>` : '';
    return `
      <tr>
        <td colspan="${colspan}" class="text-center py-4 text-muted">
          ${text}${actionHtml}
        </td>
      </tr>
    `;
  }
  return {
    create: create,
    createHTML: createHTML,
    createTableRowHTML: createTableRowHTML
  };
})();

/* --- ContextMenu.js --- */
/**
 * Context Menu Component
 */
var UIContextMenu = (function () {
  var currentMenu = null;
  function show(e, items) {
    e.preventDefault();
    hide();
    var menu = document.createElement('div');
    menu.className = 'ui-context-menu';
    menu.style.top = e.pageY + 'px';
    menu.style.left = e.pageX + 'px';
    items.forEach(function(item) {
      if (item === '|') {
        var div = document.createElement('div');
        div.className = 'context-menu-divider';
        menu.appendChild(div);
      } else {
        var btn = document.createElement('div');
        btn.className = 'context-menu-item';
        var iconHtml = item.icon ? '<span class="material-symbols-outlined">' + item.icon + '</span>' : '';
        btn.innerHTML = iconHtml + '<span>' + item.label + '</span>';
        btn.onclick = function() {
          hide();
          if (typeof item.onClick === 'function') item.onClick();
        };
        menu.appendChild(btn);
      }
    });
    document.body.appendChild(menu);
    currentMenu = menu;
    document.addEventListener('click', hideOnOutsideClick);
  }
  function hide() {
    if (currentMenu) {
      currentMenu.remove();
      currentMenu = null;
    }
  }
  function hideOnOutsideClick(e) {
    if (currentMenu && !currentMenu.contains(e.target)) {
      hide();
      document.removeEventListener('click', hideOnOutsideClick);
    }
  }
  return {
    show: show,
    hide: hide
  };
})();

/* --- Toast.js --- */
/**
 * Toast Component
 */
var UIToast = (function () {
  var container = null;
  document.addEventListener('DOMContentLoaded', function() {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  });
  function show(msg, type) {
    if (!container) {
      container = document.getElementById('toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
      }
    }
    var toast = document.createElement('div');
    toast.className = 'ui-toast ' + (type || 'success');
    var iconMap = {
      'success': 'check_circle',
      'error': 'error',
      'warning': 'warning',
      'info': 'info'
    };
    var icon = document.createElement('span');
    icon.className = 'material-symbols-outlined ui-toast-icon';
    icon.innerText = iconMap[type || 'success'] || 'info';
    var txt = document.createElement('div');
    txt.className = 'ui-toast-content';
    txt.innerHTML = msg;
    toast.appendChild(icon);
    toast.appendChild(txt);
    container.appendChild(toast);
    requestAnimationFrame(function() {
      toast.classList.add('show');
    });
    setTimeout(function() {
      toast.classList.remove('show');
      setTimeout(function() {
        if (toast.parentNode) toast.remove();
      }, 300);
    }, 3000);
  }
  return {
    show: show
  };
})();

/* --- Alert.js --- */
/**
 * Alert (Toast) Component
 */
var Alert = (function () {
  var container = null;
  function init() {
    if (!document.getElementById('toast-container')) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    } else {
      container = document.getElementById('toast-container');
    }
  }
  function show(type, title, message, duration) {
    if (!container) init();
    duration = duration || 3000;
    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    var iconMap = {
      'success': 'check_circle',
      'danger': 'error',
      'warning': 'warning',
      'info': 'info'
    };
    var html = `
      <div class="toast-icon">
        <span class="material-symbols-outlined">${iconMap[type] || 'info'}</span>
      </div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close">
        <span class="material-symbols-outlined" style="font-size:18px;">close</span>
      </button>
    `;
    toast.innerHTML = html;
    container.appendChild(toast);
    toast.querySelector('.toast-close').addEventListener('click', function() {
      removeToast(toast);
    });
    setTimeout(function() {
      toast.classList.add('show');
    }, 10);
    setTimeout(function() {
      removeToast(toast);
    }, duration);
  }
  function removeToast(toast) {
    toast.classList.remove('show');
    setTimeout(function() {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 400);
  }
  return {
    success: function(title, message, duration) { show('success', title, message, duration); },
    error: function(title, message, duration) { show('danger', title, message, duration); },
    warning: function(title, message, duration) { show('warning', title, message, duration); },
    info: function(title, message, duration) { show('info', title, message, duration); }
  };
})();


/* --- router.js --- */
/**
 * Router — Hash-based SPA
 * Pattern: #/order → load src/pages/order/order.js → OrderPage.render($el)
 */
var Router = (function () {

  var ROUTES = [
    { path: '/order',        script: 'src/pages/order/order.js',               pageFn: 'OrderPage',        title: 'nav.order' },
    { path: '/orders',       script: 'src/pages/orders/orders.js',             pageFn: 'OrdersPage',       title: 'nav.orders' },
    { path: '/order-detail', script: 'src/pages/order-detail/order-detail.js', pageFn: 'OrderDetailPage',  title: 'nav.order_detail' },
    { path: '/products',     script: 'src/pages/products/products.js',         pageFn: 'ProductsPage',     title: 'nav.products' },
    { path: '/sizes',        script: 'src/pages/sizes/sizes.js',               pageFn: 'SizesPage',        title: 'nav.sizes' },
    { path: '/sku',          script: 'src/pages/sku/sku.js',                   pageFn: 'SkuPage',          title: 'nav.sku' },
    { path: '/promos',       script: 'src/pages/promos/promos.js',             pageFn: 'PromosPage',       title: 'nav.promos' },
    { path: '/settings',     script: 'src/pages/settings/settings.js',        pageFn: 'SettingsPage',     title: 'nav.settings' },
    { path: '/permissions',  script: 'src/pages/permissions/permissions.js',   pageFn: 'PermissionsPage',  title: 'nav.permissions' },
    { path: '/menus',        script: 'src/pages/menus/menus.js',               pageFn: 'MenusPage',        title: 'nav.menus' },
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
    return fetch(url + '?v=' + new Date().getTime(), { cache: "no-store" })
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
    if (hdr && route) {
      hdr.setAttribute('data-i18n', route.title);
      hdr.textContent = typeof t === 'function' ? t(route.title) : route.title;
    }
    if (route) document.title = (typeof t === 'function' ? t(route.title) : route.title);
  }

  // ── Main handler ──────────────────────────────────────────────────────
  function _handle() {
    if (_isNavigating) return;
    _isNavigating = true;

    var $el = document.getElementById('app-content');
    var fullHash = window.location.hash.replace('#', '') || '/order';
    var pathParts = fullHash.split('?');
    var hash = pathParts[0];
    var qs = pathParts[1] || '';
    var route = _routeMap[hash];

    // Cập nhật params vào biến toàn cục để các page tự lấy
    window._queryParams = new URLSearchParams(qs);
    if (window._queryParams.has('id')) {
      window._viewOrderId = window._queryParams.get('id');
    }

    _updateNav(hash);
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (!route) {
      $el.innerHTML = '<div class="empty-state"><span class="material-symbols-outlined">search_off</span><p>Trang không tồn tại: ' + hash + '</p></div>';
      _isNavigating = false;
      return;
    }

    _fadeOut($el)
      .then(function () { 
        if (window.LoadingSpinner) LoadingSpinner.show('Đang tải trang...');
        return _loadScript(route.script); 
      })

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
        if (window.LoadingSpinner) LoadingSpinner.hide();
      })

      .catch(function (err) {
        if (window.LoadingSpinner) LoadingSpinner.hide();
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


/* --- sound.js --- */
/**
 * SoundUtils — Quản lý hiệu ứng âm thanh (Web Audio API & MP3)
 * Chơi file âm thanh được tải về từ bên ngoài để dễ dàng tùy biến.
 */
var SoundUtils = (function () {
  // Sửa lại đường dẫn thêm src/ vì index.html nằm ở thư mục gốc
  var clickAudio = new Audio('src/assets/sounds/click.mp3');
  // Thêm file âm thanh cho Sidebar (Mở hòm/Inventory)
  var sidebarAudio = new Audio('src/assets/sounds/chest-opens-minecraft-sound-fx.wav');

  function playThemeToggle(isDark) {
    if (!clickAudio) return;

    // Reset lại thời gian về 0 để có thể click liên tục nhiều lần không bị độ trễ
    clickAudio.currentTime = 0;
    
    // Phát âm thanh, dùng catch để bỏ qua lỗi nếu trình duyệt chặn tự động phát
    clickAudio.play().catch(function(error) {
      console.warn('Trình duyệt chưa cho phép phát âm thanh, hoặc không tìm thấy file click.mp3:', error);
    });
  }

  // Âm thanh khi mở Sidebar (Mở hòm/Inventory)
  function playSidebarOpen() {
    // Tạm tắt tiếng theo yêu cầu
    /*
    if (!sidebarAudio) return;
    
    sidebarAudio.currentTime = 0;
    sidebarAudio.play().catch(function(error) {
      console.warn('Không thể phát âm thanh sidebar, hoặc không tìm thấy file chest-opens-minecraft-sound-fx.wav:', error);
    });
    */
  }

  return {
    playThemeToggle: playThemeToggle,
    playSidebarOpen: playSidebarOpen
  };
})();

/* --- app.js --- */
/**
 * App Bootstrap — Khởi tạo hệ thống
 * Chạy sau khi tất cả scripts đã load
 */
document.addEventListener('DOMContentLoaded', function () {
  // 1. Khởi tạo User Menu Component
  if (typeof UserMenu !== 'undefined') {
    UserMenu.render('user-menu-navbar');
    UserMenu.render('user-menu-sidebar-header');
  }


  // 2. Khôi phục Cài đặt
  var theme = localStorage.getItem('santino_theme') || 'auto';
  if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark-theme');
  } else {
    document.documentElement.classList.remove('dark-theme');
  }
  
  var zoom = localStorage.getItem('santino_zoom');
  if (zoom === null) zoom = '115';
  document.documentElement.style.setProperty('--text-scale', (parseInt(zoom)/100).toString());

  var font = localStorage.getItem('santino_font');
  if(font) document.documentElement.style.setProperty('--font', '"' + font + '", sans-serif');

  var color = localStorage.getItem('santino_color');
  if(color) {
    document.documentElement.style.setProperty('--accent', color);
    var colorFg = localStorage.getItem('santino_color_fg');
    if(colorFg) document.documentElement.style.setProperty('--accent-fg', colorFg);
  }
  Router.init();

  // 3. Khởi tạo Load Menu động
  if (typeof MenuService !== 'undefined') {
    MenuService.getChildren('02').then(function(items) {
      if (Array.isArray(items) && items.length > 0) {
        var html = '';
        items.forEach(function(item) {
          // Map URLPara hoặc FormKey sang route
          var route = item.URLPara ? item.URLPara : '';
          if (!route) {
            if (item.FormName === 'WEB_OrderDetailFrm' || item.FormKey === 'List') route = '/orders';
            else if (item.FormName === 'WEB_OrderFrm' || item.FormKey === 'Null') route = '/order';
            else route = '/' + (item.FormKey || '').toLowerCase();
          }
          if (!route.startsWith('/')) route = '/' + route;
          
          // Map IconClass
          var icon = item.IconClass;
          // Fallback mapping in case DB uses 'icon-grid' for both but we want specific icons
          if (icon === 'icon-grid' || !icon) {
            if (route === '/orders') icon = 'receipt_long';
            if (route === '/order') icon = 'shopping_bag';
          }
          if (!icon) icon = 'label';
          
          var title = item.VN || item.FormName;
          
          html += '<a class="nav-item" href="#' + route + '" data-route="' + route + '">';
          html += '<span class="material-symbols-outlined icon">' + icon + '</span>';
          html += '<span>' + title + '</span></a>';
        });
        
        // Cập nhật Navbar links
        var navLinks = document.getElementById('navbar-dynamic-links');
        if (navLinks) {
          navLinks.innerHTML = html;
        }
        
        // Cập nhật Sidebar links
        var sidebarLinks = document.getElementById('sidebar-dynamic-links');
        if (sidebarLinks) {
          sidebarLinks.innerHTML = html;
          
          // Gắn sự kiện auto-close cho mobile
          sidebarLinks.querySelectorAll('.nav-item').forEach(function(el) {
            el.addEventListener('click', function() {
              if (window.innerWidth <= 1024) {
                var sidebar = document.querySelector('.sidebar');
                var overlay = document.querySelector('.sidebar-overlay');
                if (sidebar) sidebar.classList.remove('show');
                if (overlay) overlay.classList.remove('show');
                document.body.style.overflow = '';
              }
            });
          });
        }
        
        // Re-apply language if needed
        applyLanguage();
        // Cập nhật trạng thái active
        if (typeof Router !== 'undefined' && Router._highlightActive) {
           Router._highlightActive();
        } else {
           _highlightActiveNav();
        }
      }
    });
  }

  // Ẩn splash nếu có
  var splash = document.getElementById('app-splash');
  if (splash) splash.style.display = 'none';
});

// Helper highlight active nav sau khi load động
function _highlightActiveNav() {
  var hash = window.location.hash || '#/dashboard';
  var route = hash.replace('#', '').split('?')[0];
  document.querySelectorAll('.nav-item').forEach(function (el) {
    el.classList.toggle('active', el.getAttribute('data-route') === route);
  });
}

// ── Global helpers (dùng được từ bất kỳ page nào) ─────────────────────

function toggleTheme() {
  var isDark = document.documentElement.classList.toggle('dark-theme');
  localStorage.setItem('santino_theme', isDark ? 'dark' : 'light');
  if (typeof SoundUtils !== 'undefined') {
    SoundUtils.playThemeToggle(isDark);
  }
}


function showToast(msg, ok, actionHtml, duration) {
  if (ok === undefined) ok = true;
  var t = document.getElementById('toast');
  var m = document.getElementById('toast-msg');
  if (!t || !m) return;
  t.querySelector('.material-symbols-outlined').textContent = ok ? 'check_circle' : 'error';
  
  if (actionHtml) {
    m.innerHTML = msg + '&nbsp;&nbsp;' + actionHtml;
  } else {
    m.innerHTML = msg;
  }
  
  t.classList.add('show');
  clearTimeout(t._timer);
  var hideTime = duration ? duration : (actionHtml ? 7000 : 3000);
  t._timer = setTimeout(function () { t.classList.remove('show'); }, hideTime);
}

function openModal(id) {
  var el = document.getElementById(id);
  if (el) {
    el.classList.add('show');
    // Đẩy trạng thái mới vào history để nút Back có thể đóng modal
    history.pushState({ modalId: id }, null, "");
  }
}

function closeModal(id) {
  var el = document.getElementById(id);
  if (el && el.classList.contains('show')) {
    el.classList.remove('show');
    // Nếu đóng thủ công, ta quay lại history 1 bước để xóa state của modal
    if (history.state && history.state.modalId === id) {
      history.back();
    }
  }
}

// Xử lý nút Back của trình duyệt/điện thoại
window.addEventListener('popstate', function (e) {
  // Tìm tất cả các modal đang mở và đóng chúng
  var openModals = document.querySelectorAll('.modal-overlay.show, .modal.show');
  if (openModals.length > 0) {
    openModals.forEach(function (m) {
      m.classList.remove('show');
    });
  }
  // Đóng các dropdown combobox
  document.dispatchEvent(new CustomEvent('close-other-comboboxes'));
});

// Đóng modal khi click overlay
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('show');
});

// Chuyển đổi ngôn ngữ
function t(key) {
  var lang = localStorage.getItem('santino_lang') || 'vi';
  var dict = typeof TRANSLATIONS !== 'undefined' ? (TRANSLATIONS[lang] || TRANSLATIONS['vi']) : {};
  return dict[key] || key;
}

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



