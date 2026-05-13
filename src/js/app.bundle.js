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
    "order.search.placeholder": "Nhập mã (VD: AMC545)...",
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

  function _getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
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
    }
  }

  async function put(endpoint, body = {}) {
    document.body.style.cursor = 'wait';
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
    }
  }

  async function del(endpoint) {
    document.body.style.cursor = 'wait';
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
      const queryObj = { SearchTerm: searchTerm };
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
      const queryObj = { Loai: loai };
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
      if (words.length === 1) return _removeDiacritics(words[0].substring(0, 2)).toUpperCase();
      const first = words[0][0];
      const last = words[words.length - 1][0];
      return _removeDiacritics(first + last).toUpperCase();
    } catch (e) { return '??'; }
  }

  return { formatMoney, buildSKU, genOrderNo, today, escHtml, uuid, getUserInitials };
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
    if (typeof options.onF2 === 'function') options.onF2();
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
      tableWrapper.innerHTML = '<div style="padding:12px;text-align:center;color:var(--muted,#94a3b8);font-size:13px">Đang tải...</div>';
      Promise.resolve(options.onSearch(q, page)).then(function (result) {
        if (Array.isArray(result)) {
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
      // Server-side: debounce 300ms rồi gọi API
      clearTimeout(_searchDebounce);
      tableWrapper.innerHTML = '<div style="padding:12px;text-align:center;color:var(--muted,#94a3b8);font-size:13px">Đang tìm...</div>';
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

  document.addEventListener('click', function (e) {
    if (!container.contains(e.target) && !dropdown.contains(e.target)) hideDropdown();
  });

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

  // Ẩn splash nếu có
  var splash = document.getElementById('app-splash');
  if (splash) splash.style.display = 'none';
});

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
    m.textContent = msg;
  }
  
  t.classList.add('show');
  clearTimeout(t._timer);
  var hideTime = duration ? duration : (actionHtml ? 7000 : 3000);
  t._timer = setTimeout(function () { t.classList.remove('show'); }, hideTime);
}

function openModal(id)  { var el = document.getElementById(id); if (el) el.classList.add('show'); }
function closeModal(id) { var el = document.getElementById(id); if (el) el.classList.remove('show'); }

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



