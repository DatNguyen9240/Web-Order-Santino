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
    "nav.customers": "Quản lý khách hàng",

    // --- Page Headers ---
    "hdr.order": "Tạo Đơn Hàng Sỉ",
    "hdr.orders": "Danh Sách Đơn Hàng",
    "hdr.products": "Quản Lý Sản Phẩm",
    "hdr.sizes": "Quản Lý Size",
    "hdr.sku": "Cấu Hình SKU",
    "hdr.promos": "Chương Trình Khuyến Mãi",
    "hdr.customers": "Quản Lý Khách Hàng",
    "hdr.customers.desc": "Danh sách khách hàng, thêm mới, chỉnh sửa thông tin, đặt lại mật khẩu và khóa tài khoản",
    
    // --- Common ---
    "btn.add": "Thêm",
    "btn.save": "Lưu",
    "btn.cancel": "Hủy",
    "btn.delete": "Xóa",
    "btn.edit": "Sửa",
    "btn.close": "Đóng",
    "btn.preview": "Xem trước",
    "table.empty": "Không có dữ liệu",
    "pager.info": "Hiển thị {0} - {1} trong số {2} bản ghi",
    "pager.page": "Trang",
    "pager.total_count": "Tổng số: {0} khách hàng",
    
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
    "btn.back": "Quay lại",
    "customers.col.id": "Mã KH",
    "customers.col.name": "Tên khách hàng",
    "customers.col.phone": "Điện thoại",
    "customers.col.address": "Địa chỉ",
    "customers.col.employee": "Nhân viên quản lý",
    "customers.col.group": "Nhóm khách hàng",
    "customers.col.username": "Tài khoản",
    "customers.col.status": "Trạng thái",
    "customers.status.no_account": "Chưa tạo",
    "customers.status.locked_account": "[TK Bị Khóa]",
    "customers.status.active_account": "[TK Mở]",
    "customers.status.locked": "Đã khóa",
    "customers.status.active": "Hoạt động",
    "customers.action.unlock": "Mở khóa tài khoản",
    "customers.action.lock": "Khóa tài khoản",
    "customers.action.reset_pw": "Đặt lại mật khẩu"
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
    "nav.customers": "Customer Management",

    // --- Page Headers ---
    "hdr.order": "Create Wholesale Order",
    "hdr.order.desc": "Create wholesale orders using size matrix",
    "hdr.orders": "Order List",
    "hdr.products": "Product Management",
    "hdr.sizes": "Size Management",
    "hdr.sku": "SKU Configuration",
    "hdr.promos": "Promotions",
    "hdr.customers": "Customer Management",
    "hdr.customers.desc": "List customers, create, edit info, reset password and lock account",

    // --- Common ---
    "btn.add": "Add",
    "btn.save": "Save",
    "btn.cancel": "Cancel",
    "btn.delete": "Delete",
    "btn.edit": "Edit",
    "btn.close": "Close",
    "btn.preview": "Preview",
    "table.empty": "No data available",
    "pager.info": "Showing {0} - {1} of {2} records",
    "pager.page": "Page",
    "pager.total_count": "Total: {0} customers",

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
    "btn.back": "Back",
    "customers.col.id": "Customer ID",
    "customers.col.name": "Customer Name",
    "customers.col.phone": "Phone",
    "customers.col.address": "Address",
    "customers.col.employee": "Managing Staff",
    "customers.col.group": "Customer Group",
    "customers.col.username": "Username",
    "customers.col.status": "Status",
    "customers.status.no_account": "Not created",
    "customers.status.locked_account": "[Disabled]",
    "customers.status.active_account": "[Active]",
    "customers.status.locked": "Locked",
    "customers.status.active": "Active",
    "customers.action.unlock": "Unlock account",
    "customers.action.lock": "Lock account",
    "customers.action.reset_pw": "Reset password"
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
    "nav.customers": "客户管理",

    // --- Page Headers ---
    "hdr.order": "创建批发订单",
    "hdr.order.desc": "使用尺码矩阵创建批发订单",
    "hdr.orders": "订单列表",
    "hdr.products": "产品管理",
    "hdr.sizes": "尺码管理",
    "hdr.sku": "SKU配置",
    "hdr.promos": "促销活动",
    "hdr.customers": "客户管理",
    "hdr.customers.desc": "客户列表，创建、编辑信息，重置密码和锁定账户",

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
    "btn.back": "返回",
    "customers.col.id": "客户ID",
    "customers.col.name": "客户姓名",
    "customers.col.phone": "电话",
    "customers.col.address": "地址",
    "customers.col.employee": "管理员工",
    "customers.col.group": "客户群",
    "customers.col.username": "用户名",
    "customers.col.status": "状态",
    "customers.status.no_account": "未创建",
    "customers.status.locked_account": "[被锁账户]",
    "customers.status.active_account": "[已启用]",
    "customers.status.locked": "已锁定",
    "customers.status.active": "活动",
    "customers.action.unlock": "解锁账户",
    "customers.action.lock": "锁定账户",
    "customers.action.reset_pw": "重置密码"
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
    const separator = endpoint.includes('?') ? '&' : '?';
    const qs = new URLSearchParams(params).toString();
    const url = getApiBaseUrl() + endpoint + (qs ? `${separator}${qs}` : '');

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
  async function getProducts(searchTerm = '', isWebOnly = false) {
    if (!API_CONFIG.BASE_URL) {
      return [];
    }

    try {
      const queryObj = { TimKiem: searchTerm };
      if (isWebOnly) {
        queryObj.IsWebOnly = 1;
      }
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


/* --- customer.service.js --- */
/**
 * Customer Service
 * Quản lý các lệnh gọi API liên quan đến Khách Hàng và Tài Khoản đăng nhập của khách hàng
 */
const CustomerService = (() => {
  /**
   * Lấy danh sách khách hàng đầy đủ kèm tài khoản liên quan
   * @param {string} searchTerm - Từ khóa tìm kiếm (Mã KH, Tên KH, SĐT, Địa chỉ)
   * @param {string} objectGroupId - Bộ lọc Nhóm khách hàng
   */
  async function getAll(searchTerm = '', objectGroupId = '', page = 1, limit = 20) {
    if (!API_CONFIG.BASE_URL) return [];
    try {
      const queryObj = {};
      if (searchTerm && searchTerm.trim()) queryObj.TimKiem = searchTerm.trim();
      if (objectGroupId && objectGroupId.trim()) queryObj.ObjectGroupID = objectGroupId.trim();

      const params = {
        page: page,
        limit: limit,
        q: JSON.stringify(queryObj),
        _t: Date.now()
      };

      const res = await Http.get(API_CONFIG.ENDPOINTS.CUSTOMERS.LIST, params);
      var records = res.records || res || [];
      if (!Array.isArray(records)) {
        if (res && Array.isArray(res.list)) records = res.list;
        else records = [];
      }
      records._recordtotal = res._recordtotal || records.length;
      return records;
    } catch (err) {
      console.error('[CustomerService] Lỗi lấy danh sách khách hàng:', err);
      return [];
    }
  }

  /**
   * Lưu thông tin khách hàng (Tạo mới hoặc Cập nhật)
   * @param {Object} customerData
   */
  async function save(customerData) {
    if (!API_CONFIG.BASE_URL) throw new Error('API_BASE chưa cấu hình');
    try {
      const params = { q: JSON.stringify(customerData) };
      const res = await Http.post(API_CONFIG.ENDPOINTS.CUSTOMERS.SAVE, params);
      return res;
    } catch (err) {
      console.error('[CustomerService] Lỗi lưu thông tin khách hàng:', err);
      throw err;
    }
  }

  /**
   * Xóa khách hàng (Soft/Hard delete tùy thuộc sự tồn tại của đơn hàng)
   * @param {string} objectId
   */
  async function deleteCustomer(objectId) {
    if (!API_CONFIG.BASE_URL) throw new Error('API_BASE chưa cấu hình');
    try {
      const params = { ObjectID: objectId };
      const res = await Http.post(API_CONFIG.ENDPOINTS.CUSTOMERS.DELETE, params);
      return res;
    } catch (err) {
      console.error('[CustomerService] Lỗi xóa khách hàng:', err);
      throw err;
    }
  }

  /**
   * Lưu tài khoản đăng nhập cho khách hàng trong bảng SY_User
   * @param {Object} userData - { UserName, HoTen, UserGroupID, ObjectID, Disable, Password }
   */
  async function saveUserAccount(userData) {
    if (!API_CONFIG.BASE_URL) throw new Error('API_BASE chưa cấu hình');
    try {
      const res = await Http.post(API_CONFIG.ENDPOINTS.USERS.SAVE, userData);
      return res;
    } catch (err) {
      console.error('[CustomerService] Lỗi lưu tài khoản khách hàng:', err);
      throw err;
    }
  }

  /**
   * Reset mật khẩu qua API /changepassword
   * @param {string} username - Tài khoản đăng nhập
   * @param {string} currentPassword - Mật khẩu cũ / Mật khẩu Admin
   * @param {string} newPassword - Mật khẩu mới
   */
  async function resetPassword(username, currentPassword, newPassword) {
    if (!API_CONFIG.BASE_URL) throw new Error('API_BASE chưa cấu hình');
    try {
      const payload = {
        username: username,
        newpassword: newPassword,
        newpassword2: newPassword,
        userkey: 'abcd1234'
      };
      const res = await Http.post(API_CONFIG.ENDPOINTS.USERS.RESET_PW, payload);
      return res;
    } catch (err) {
      console.error('[CustomerService] Lỗi reset mật khẩu:', err);
      throw err;
    }
  }

  return {
    getAll,
    save,
    deleteCustomer,
    saveUserAccount,
    resetPassword
  };
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
      var user = JSON.parse(localStorage.getItem('santino_user') || '{}');
      var role = user.role || user.Group || '';
      var queryObj = { Parent: parentID, UserRole: role };
      var params = { q: JSON.stringify(queryObj) };
      var res = await Http.get(API_CONFIG.ENDPOINTS.MENU.CHILDREN, params);
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


/* --- Button.js --- */
/**
 * Button Component
 * Sinh Nút bấm (Button) bằng DOM manipulation.
 */
var UIButton = (function () {

  /**
   * Tạo Nút bấm mới
   * @param {Object} config - { id, text, icon, type, className, onClick, disabled, tooltip }
   */
  function create(config) {
    var btn = document.createElement('button');
    
    // Base class
    var typeClass = config.type ? 'btn-' + config.type : 'btn-primary';
    if (config.type === 'tool') typeClass = 'btn-tool'; // Special case for toolbar
    
    btn.className = 'btn ' + typeClass + (config.className ? ' ' + config.className : '');
    
    if (config.id) btn.id = config.id;
    if (config.disabled) btn.disabled = true;
    if (config.tooltip) btn.title = config.tooltip;

    // Build nội dung
    var innerHTML = '';
    if (config.icon) {
      innerHTML += '<span class="material-symbols-outlined">' + config.icon + '</span>';
    }
    if (config.text) {
      innerHTML += '<span>' + config.text + '</span>';
    }
    btn.innerHTML = innerHTML;

    // Gắn sự kiện
    if (typeof config.onClick === 'function') {
      btn.addEventListener('click', function(e) {
        if (!btn.disabled) {
          config.onClick(e);
        }
      });
    }

    return btn;
  }

  /**
   * Tạo Bar chứa danh sách các nút
   * @param {Array} buttonsConfig - Mảng config của các nút
   */
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

  /**
   * Sinh HTML chuỗi cho Button
   */
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


/* --- Checkbox.js --- */
/**
 * Custom Checkbox Component
 */
var UIControls = window.UIControls || {};

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


/* --- DataComboBox.js --- */
/**
 * Data ComboBox Component
 */
var UIControls = window.UIControls || {};

function stringToColor(str) {
  if (!str) return '#ccc';
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var h = Math.abs(hash % 360);
  return 'hsl(' + h + ', 70%, 55%)';
}

UIControls.createDataComboBox = function (options) {
  var container = document.createElement('div');
  container.className = 'combo-box-container';

  // Input
  var input = document.createElement('input');
  input.type = 'text';
  input.className = 'ui-input';
  input.placeholder = options.placeholder || '';
  if (options.id) input.id = options.id;

  if (options.readOnly) {
    input.readOnly = true;
    input.style.cursor = 'pointer';
    input.addEventListener('click', function (e) {
      e.stopPropagation();
      dropdown.classList.contains('active') ? hideDropdown() : showDropdown();
    });
  }

  // Swatch màu sắc cho trường Màu sắc
  var swatch = null;
  if (options.id && options.id.includes('MauSac')) {
    swatch = document.createElement('div');
    swatch.className = 'combo-color-swatch';
    swatch.style.cssText = 'position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.15); pointer-events: none; background-color: transparent; display: none; transition: all 0.2s;';
    input.style.paddingLeft = '34px'; // Nhường chỗ cho ô tròn hiển thị màu
    container.style.position = 'relative';
    container.appendChild(swatch);
  }

  function updateSwatchColor(val) {
    if (!swatch) return;
    var cleaned = val ? val.trim() : '';
    if (cleaned && !cleaned.startsWith('-- Chọn')) {
      swatch.style.backgroundColor = stringToColor(cleaned);
      swatch.style.display = 'block';
    } else {
      swatch.style.display = 'none';
    }
  }

  // Ghi đè Property Descriptor của input.value để cập nhật màu sắc lập tức khi gán bằng JS
  if (swatch) {
    var nativeValueDesc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    Object.defineProperty(input, 'value', {
      get: function() {
        return nativeValueDesc.get.call(input);
      },
      set: function(val) {
        nativeValueDesc.set.call(input, val);
        updateSwatchColor(val);
      }
    });
  }

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
        var cellVal = dataRow[options.colFilterIndex || 0];
        
        // Nếu là ô chọn màu sắc, chèn thêm chấm màu bên cạnh chữ
        if (options.id && options.id.includes('MauSac') && cellVal) {
          var firstTd = row.querySelector('td');
          if (firstTd) {
            var colorDot = '<span style="display:inline-block; width:10px; height:10px; border-radius:50%; margin-right:8px; vertical-align:middle; border:1px solid rgba(0,0,0,0.15); background-color:' + stringToColor(cellVal) + ';"></span>';
            firstTd.innerHTML = colorDot + firstTd.innerHTML;
          }
        }

        var rowVal = (cellVal || '').toString().toLowerCase();

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

  // Xóa cache VÀ reload lại ngay nếu dropdown đang mở
  // Dùng khi NPP thay đổi → danh sách đại lý phải làm mới theo NPP mới
  container.reload = function () {
    cachedInitialResults = null;
    if (dropdown.classList.contains('active')) {
      searchInput.value = '';
      loadData('', 1);
    }
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


/* --- Input.js --- */
/**
 * Input Component
 * Sinh ra các ô nhập liệu (Text, Number, Date...) kèm Label bằng DOM Node chuẩn.
 * An toàn XSS, tiện lợi khi build Form hoàn toàn bằng JavaScript.
 */
var UIInput = (function () {

  /**
   * Sinh cấu trúc Label + DOM Input
   */
  function _createBaseWrapper(config, inputType) {
    var wrapper = document.createElement('div');
    wrapper.className = 'form-group ' + (config.className || '');

    if (config.label) {
      var lbl = document.createElement('label');
      lbl.innerText = config.label;
      if (config.required) {
        var req = document.createElement('span');
        req.innerText = ' *';
        req.style.color = 'var(--danger)';
        lbl.appendChild(req);
      }
      wrapper.appendChild(lbl);
    }

    var input = document.createElement('input');
    if (config.isMoney) {
      input.type = 'text';
      input.setAttribute('inputmode', 'numeric');
    } else {
      input.type = inputType;
    }
    input.className = 'ui-input';
    if (config.id) input.id = config.id;
    if (config.name) input.name = config.name;

    var finalPlaceholder = config.placeholder;
    if (!finalPlaceholder && config.label && inputType !== 'checkbox' && inputType !== 'radio' && inputType !== 'date') {
      finalPlaceholder = 'Nhập ' + config.label.toLowerCase() + '...';
    }
    if (finalPlaceholder) input.placeholder = finalPlaceholder;

    if (config.value !== undefined) input.value = config.value;
    if (config.disabled) input.disabled = true;
    if (config.readonly) input.readOnly = true;

    wrapper.appendChild(input);

    if (config.isMoney) {
      var wordEl = document.createElement('div');
      wordEl.className = 'money-words-text';
      wordEl.style.cssText = 'font-size: 11px; color: var(--success); margin-top: 4px; min-height: 16px; font-style: italic;';
      wrapper.appendChild(wordEl);
      setupMoneyInput(input, wordEl);
    }

    return { wrapper: wrapper, input: input };
  }

  /**
   * Ô nhập Text thông thường
   */
  function createText(config) {
    return _createBaseWrapper(config, 'text').wrapper;
  }

  /**
   * Ô nhập Số
   */
  function createNumber(config) {
    var obj = _createBaseWrapper(config, 'number');
    if (config.min !== undefined) obj.input.min = config.min;
    if (config.max !== undefined) obj.input.max = config.max;
    if (config.step !== undefined) obj.input.step = config.step;
    return obj.wrapper;
  }

  /**
   * Ô nhập Tiền tệ (tự động format + đọc số thành chữ)
   */
  function createMoney(config) {
    var conf = Object.assign({}, config, { isMoney: true });
    return _createBaseWrapper(conf, 'text').wrapper;
  }

  /**
   * Ô chọn Giờ
   */
  function createTime(config) {
    var initialVal = config.value || ''; // Expected standard format: HH:mm (e.g. 15:32)
    
    // Parse the initial HH:mm value for display hh:mm A
    var displayVal = '';
    if (initialVal) {
      var parts = initialVal.split(':');
      if (parts.length >= 2) {
        var h = parseInt(parts[0], 10);
        var m = parts[1].substring(0, 2);
        var period = h >= 12 ? 'PM' : 'AM';
        var displayH = h % 12;
        if (displayH === 0) displayH = 12;
        var displayHStr = String(displayH).padStart(2, '0');
        displayVal = displayHStr + ':' + m + ' ' + period;
      }
    }

    var obj = _createBaseWrapper(config, 'text');
    var visibleInput = obj.input;
    
    // Remove name from visible text input to avoid duplicate submission
    visibleInput.removeAttribute('name');
    var elementId = config.id || config.name;
    if (elementId) visibleInput.id = elementId + '_visible';
    visibleInput.readOnly = true;
    visibleInput.style.cursor = 'pointer';
    visibleInput.placeholder = config.placeholder || 'Chọn giờ...';
    visibleInput.value = displayVal;

    // Create the hidden input for form data collection in HH:mm format
    var hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    if (config.name) hiddenInput.name = config.name;
    if (elementId) hiddenInput.id = elementId;
    hiddenInput.value = initialVal;
    obj.wrapper.appendChild(hiddenInput);

    // Sync from hidden input value back to visible input value
    hiddenInput.addEventListener('change', function () {
      var val = hiddenInput.value;
      if (val) {
        var parts = val.split(':');
        if (parts.length >= 2) {
          var h = parseInt(parts[0], 10);
          var m = parts[1].substring(0, 2);
          var period = h >= 12 ? 'PM' : 'AM';
          var displayH = h % 12;
          if (displayH === 0) displayH = 12;
          var displayHStr = String(displayH).padStart(2, '0');
          visibleInput.value = displayHStr + ':' + m + ' ' + period;
        } else {
          visibleInput.value = val;
        }
      } else {
        visibleInput.value = '';
      }
    });

    // Remove the native input direct placement to wrap it nicely
    if (visibleInput.parentNode) {
      visibleInput.parentNode.removeChild(visibleInput);
    }

    // Input Group wrapper
    var inputContainer = document.createElement('div');
    inputContainer.style.position = 'relative';
    inputContainer.style.display = 'flex';
    inputContainer.style.alignItems = 'center';
    inputContainer.appendChild(visibleInput);

    // Icon (schedule = clock icon in Material Symbols)
    var icon = document.createElement('span');
    icon.className = 'material-symbols-outlined';
    icon.innerText = 'schedule';
    icon.style.position = 'absolute';
    icon.style.right = '12px';
    icon.style.color = 'var(--muted)';
    icon.style.pointerEvents = 'none';
    icon.style.fontSize = '20px';
    inputContainer.appendChild(icon);

    obj.wrapper.appendChild(inputContainer);

    var popup = null;
    var _scrollTargets = [];
    var _scrollHandler = null;

    function isElementClipped(el) {
      var rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        return true;
      }
      var node = el.parentElement;
      while (node && node !== document.documentElement) {
        var style = window.getComputedStyle(node);
        var ov = style.overflow + style.overflowY + style.overflowX;
        if (/auto|scroll/.test(ov)) {
          var parentRect = node.getBoundingClientRect();
          if (rect.bottom < parentRect.top || rect.top > parentRect.bottom) {
            return true;
          }
        }
        node = node.parentElement;
      }
      return false;
    }

    function updatePosition() {
      if (!popup) return;
      var rect = visibleInput.getBoundingClientRect();
      var windowWidth = window.innerWidth;
      var windowHeight = window.innerHeight;
      var popupWidth = 240;
      var popupHeight = 270;

      if (isElementClipped(visibleInput)) {
        closePopup();
        return;
      }

      var topPos = rect.bottom + 4;
      if (rect.bottom + popupHeight > windowHeight && rect.top - popupHeight > 0) {
        topPos = rect.top - popupHeight - 4;
      }

      var leftPos = rect.left;
      if (rect.left + popupWidth > windowWidth) {
        leftPos = rect.right - popupWidth;
      }
      leftPos = Math.max(10, leftPos);

      popup.style.top = topPos + 'px';
      popup.style.left = leftPos + 'px';
    }

    function attachScrollListeners() {
      if (_scrollHandler) return;
      _scrollHandler = function () {
        updatePosition();
      };
      _scrollTargets = (UIControls.utils && typeof UIControls.utils.getScrollableAncestors === 'function')
        ? UIControls.utils.getScrollableAncestors(inputContainer)
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

    function openPopup() {
      if (popup) return;
      window.dispatchEvent(new CustomEvent('close-all-pickers'));
      window.addEventListener('close-all-pickers', closePopup);
      popup = document.createElement('div');
      popup.className = 'custom-timepicker-popup';

      var isMobile = (window.innerWidth <= 576);

      if (isMobile) {
        var backdrop = document.createElement('div');
        backdrop.id = 'timepicker-mobile-backdrop';
        backdrop.style.position = 'fixed';
        backdrop.style.inset = '0';
        backdrop.style.background = 'rgba(0, 0, 0, 0.4)';
        backdrop.style.zIndex = '99999998';
        backdrop.addEventListener('click', closePopup);
        document.body.appendChild(backdrop);
        
        popup.style.position = 'fixed';
        popup.style.zIndex = '99999999';
      } else {
        popup.style.position = 'fixed';
        popup.style.zIndex = '99999999';
      }

      // Populate columns: Hour (01-12), Minute (00-59), Period (AM/PM)
      var val = hiddenInput.value || '';
      var activeH = '08', activeM = '00', activeP = 'AM';
      if (val) {
        var parts = val.split(':');
        if (parts.length >= 2) {
          var h = parseInt(parts[0], 10);
          activeM = parts[1].substring(0, 2);
          activeP = h >= 12 ? 'PM' : 'AM';
          var displayH = h % 12;
          if (displayH === 0) displayH = 12;
          activeH = String(displayH).padStart(2, '0');
        }
      }

      var columnsWrap = document.createElement('div');
      columnsWrap.className = 'timepicker-columns';

      // 1. Hour Column (01-12)
      var hrCol = document.createElement('div');
      hrCol.className = 'timepicker-column hours-col';
      for (var i = 1; i <= 12; i++) {
        var itemVal = String(i).padStart(2, '0');
        var item = document.createElement('div');
        item.className = 'timepicker-item' + (itemVal === activeH ? ' active' : '');
        item.innerText = itemVal;
        item.setAttribute('data-value', itemVal);
        item.onclick = function () {
          hrCol.querySelectorAll('.timepicker-item').forEach(function (el) { el.classList.remove('active'); });
          this.classList.add('active');
          scrollToActive(hrCol);
          updateTimeValue();
        };
        hrCol.appendChild(item);
      }

      // 2. Minute Column (00-59)
      var minCol = document.createElement('div');
      minCol.className = 'timepicker-column minutes-col';
      for (var i = 0; i <= 59; i++) {
        var itemVal = String(i).padStart(2, '0');
        var item = document.createElement('div');
        item.className = 'timepicker-item' + (itemVal === activeM ? ' active' : '');
        item.innerText = itemVal;
        item.setAttribute('data-value', itemVal);
        item.onclick = function () {
          minCol.querySelectorAll('.timepicker-item').forEach(function (el) { el.classList.remove('active'); });
          this.classList.add('active');
          scrollToActive(minCol);
          updateTimeValue();
        };
        minCol.appendChild(item);
      }

      // 3. Period Column (AM/PM)
      var pCol = document.createElement('div');
      pCol.className = 'timepicker-column period-col';
      ['AM', 'PM'].forEach(function (itemVal) {
        var item = document.createElement('div');
        item.className = 'timepicker-item' + (itemVal === activeP ? ' active' : '');
        item.innerText = itemVal;
        item.setAttribute('data-value', itemVal);
        item.onclick = function () {
          pCol.querySelectorAll('.timepicker-item').forEach(function (el) { el.classList.remove('active'); });
          this.classList.add('active');
          scrollToActive(pCol);
          updateTimeValue();
        };
        pCol.appendChild(item);
      });

      columnsWrap.appendChild(hrCol);
      columnsWrap.appendChild(minCol);
      columnsWrap.appendChild(pCol);
      popup.appendChild(columnsWrap);

      // Scroll to active items in columns
      setTimeout(function () {
        scrollToActive(hrCol);
        scrollToActive(minCol);
        scrollToActive(pCol);
      }, 0);

      function scrollToActive(columnEl) {
        var activeItem = columnEl.querySelector('.timepicker-item.active');
        if (activeItem) {
          columnEl.scrollTop = activeItem.offsetTop - (columnEl.clientHeight / 2) + (activeItem.clientHeight / 2);
        }
      }

      function updateTimeValue() {
        var hEl = hrCol.querySelector('.timepicker-item.active');
        var mEl = minCol.querySelector('.timepicker-item.active');
        var pEl = pCol.querySelector('.timepicker-item.active');
        if (!hEl || !mEl || !pEl) return;

        var hStr = hEl.getAttribute('data-value');
        var mStr = mEl.getAttribute('data-value');
        var pStr = pEl.getAttribute('data-value');

        var hVal = parseInt(hStr, 10);
        if (pStr === 'PM' && hVal < 12) hVal += 12;
        if (pStr === 'AM' && hVal === 12) hVal = 0;
        
        var standardVal = String(hVal).padStart(2, '0') + ':' + mStr;
        hiddenInput.value = standardVal;
        visibleInput.value = hStr + ':' + mStr + ' ' + pStr;
        hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
        hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
      }

      // Footer
      var footer = document.createElement('div');
      footer.className = 'timepicker-footer';

      var btnClear = document.createElement('button');
      btnClear.className = 'btn-timepicker-clear';
      btnClear.innerText = 'Xóa';
      btnClear.onclick = function () {
        hiddenInput.value = '';
        visibleInput.value = '';
        hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
        hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
        closePopup();
      };

      var btnDone = document.createElement('button');
      btnDone.className = 'btn-timepicker-done';
      btnDone.innerText = 'Xong';
      btnDone.onclick = function () {
        updateTimeValue();
        closePopup();
      };

      footer.appendChild(btnClear);
      footer.appendChild(btnDone);
      popup.appendChild(footer);

      document.body.appendChild(popup);

      if (!isMobile) {
        updatePosition();
        attachScrollListeners();
      }

      setTimeout(function () {
        document.addEventListener('click', outsideClickListener);
      }, 0);
    }

    function closePopup() {
      if (!popup) return;
      window.removeEventListener('close-all-pickers', closePopup);
      document.removeEventListener('click', outsideClickListener);
      detachScrollListeners();
      var backdrop = document.getElementById('timepicker-mobile-backdrop');
      if (backdrop && backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
      if (popup.parentNode) {
        popup.parentNode.removeChild(popup);
      }
      popup = null;
    }

    function outsideClickListener(e) {
      if (!document.body.contains(e.target)) return;
      if (popup && !popup.contains(e.target) && e.target !== visibleInput) {
        closePopup();
      }
    }

    visibleInput.addEventListener('click', function (e) {
      e.stopPropagation();
      if (popup) {
        closePopup();
      } else {
        openPopup();
      }
    });

    return obj.wrapper;
  }

  /**
   * Ô chọn Ngày
   */
  function createDate(config) {
    if (config.value) {
      var rawVal = String(config.value).trim();
      if (rawVal.indexOf('T') !== -1) {
        config.value = rawVal.split('T')[0];
      } else if (rawVal.indexOf('/') !== -1) {
        var parts = rawVal.split(' ')[0].split('/');
        if (parts.length === 3) {
          if (parts[0].length === 4) { // YYYY/MM/DD
            config.value = parts[0] + '-' + parts[1] + '-' + parts[2];
          } else { // DD/MM/YYYY
            config.value = parts[2] + '-' + parts[1] + '-' + parts[0];
          }
        }
      } else if (rawVal.indexOf(' ') !== -1) {
        config.value = rawVal.split(' ')[0];
      }
    }

    var obj = _createBaseWrapper(config, 'text');
    var visibleInput = obj.input;

    // Remove name to prevent duplicate submission of the text representation
    visibleInput.removeAttribute('name');
    var elementId = config.id || config.name;
    if (elementId) visibleInput.id = elementId + '_visible';
    visibleInput.readOnly = true;
    visibleInput.style.cursor = 'pointer';
    visibleInput.placeholder = config.placeholder || 'Chọn ngày...';

    // Format display value
    var initialDate = config.value || '';
    if (initialDate) {
      var p = initialDate.split('-');
      if (p.length === 3) {
        visibleInput.value = p[2] + '/' + p[1] + '/' + p[0];
      }
    }

    // Create the actual hidden input for form value collection
    var hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    if (config.name) hiddenInput.name = config.name;
    if (elementId) hiddenInput.id = elementId;
    hiddenInput.value = initialDate;
    obj.wrapper.appendChild(hiddenInput);

    // Sync from hidden input value back to visible input value
    hiddenInput.addEventListener('change', function () {
      var val = hiddenInput.value;
      if (val) {
        var p = val.split('-');
        if (p.length === 3) {
          visibleInput.value = p[2] + '/' + p[1] + '/' + p[0];
        } else {
          visibleInput.value = val;
        }
      } else {
        visibleInput.value = '';
      }
    });

    // Remove the native input direct placement to wrap it nicely
    if (visibleInput.parentNode) {
      visibleInput.parentNode.removeChild(visibleInput);
    }

    // Input Group wrapper
    var inputContainer = document.createElement('div');
    inputContainer.style.position = 'relative';
    inputContainer.style.display = 'flex';
    inputContainer.style.alignItems = 'center';
    inputContainer.appendChild(visibleInput);

    // Icon
    var icon = document.createElement('span');
    icon.className = 'material-symbols-outlined';
    icon.innerText = 'calendar_today';
    icon.style.position = 'absolute';
    icon.style.right = '12px';
    icon.style.color = 'var(--muted)';
    icon.style.pointerEvents = 'none';
    icon.style.fontSize = '20px';
    inputContainer.appendChild(icon);

    obj.wrapper.appendChild(inputContainer);

    // Custom calendar popup picker
    var popup = null;
    var calendarInstance = null;
    var _scrollTargets = [];
    var _scrollHandler = null;

    function isElementClipped(el) {
      var rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        return true;
      }
      var node = el.parentElement;
      while (node && node !== document.documentElement) {
        var style = window.getComputedStyle(node);
        var ov = style.overflow + style.overflowY + style.overflowX;
        if (/auto|scroll/.test(ov)) {
          var parentRect = node.getBoundingClientRect();
          if (rect.bottom < parentRect.top || rect.top > parentRect.bottom) {
            return true;
          }
        }
        node = node.parentElement;
      }
      return false;
    }

    function updatePosition() {
      if (!popup) return;
      var rect = visibleInput.getBoundingClientRect();
      var windowWidth = window.innerWidth;
      var windowHeight = window.innerHeight;
      var popupWidth = 340;
      var popupHeight = 380;

      // Close if the input is scrolled out of view/container bounds
      if (isElementClipped(visibleInput)) {
        closePopup();
        return;
      }

      // Calculate vertical position (flip if not enough space below)
      var topPos = rect.bottom + 4;
      if (rect.bottom + popupHeight > windowHeight && rect.top - popupHeight > 0) {
        topPos = rect.top - popupHeight - 4;
      }

      // Calculate horizontal position
      var leftPos = rect.left;
      if (rect.left + popupWidth > windowWidth) {
        leftPos = rect.right - popupWidth;
      }
      leftPos = Math.max(10, leftPos);

      popup.style.top = topPos + 'px';
      popup.style.left = leftPos + 'px';
    }

    function attachScrollListeners() {
      if (_scrollHandler) return;
      _scrollHandler = function () {
        updatePosition();
      };
      _scrollTargets = (UIControls.utils && typeof UIControls.utils.getScrollableAncestors === 'function')
        ? UIControls.utils.getScrollableAncestors(inputContainer)
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

    function openPopup() {
      if (popup) return;
      window.dispatchEvent(new CustomEvent('close-all-pickers'));
      window.addEventListener('close-all-pickers', closePopup);
      popup = document.createElement('div');
      popup.className = 'custom-datepicker-popup';

      var isMobile = (window.innerWidth <= 576);

      if (isMobile) {
        // Add a dim backdrop for mobile focus
        var backdrop = document.createElement('div');
        backdrop.id = 'datepicker-mobile-backdrop';
        backdrop.style.position = 'fixed';
        backdrop.style.inset = '0';
        backdrop.style.background = 'rgba(0, 0, 0, 0.4)';
        backdrop.style.zIndex = '99999998';
        backdrop.addEventListener('click', closePopup);
        document.body.appendChild(backdrop);
        
        popup.style.position = 'fixed';
        popup.style.zIndex = '99999999';
      } else {
        // Desktop/Tablet layout: Position relative to input using fixed (non-clipped)
        popup.style.position = 'fixed';
        popup.style.zIndex = '99999999';
      }

      if (typeof UICalendar !== 'undefined') {
        calendarInstance = UICalendar.create({
          selectedDate: hiddenInput.value || null,
          onSelect: function (dateStr) {
            hiddenInput.value = dateStr;
            var p = dateStr.split('-');
            if (p.length === 3) {
              visibleInput.value = p[2] + '/' + p[1] + '/' + p[0];
            }
            hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
            hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
            closePopup();
          }
        });
        popup.appendChild(calendarInstance);
      } else {
        popup.innerText = 'UICalendar not loaded';
      }

      document.body.appendChild(popup);

      if (!isMobile) {
        updatePosition();
        attachScrollListeners();
      }

      if (calendarInstance && calendarInstance.setSelectedDate) {
        calendarInstance.setSelectedDate(hiddenInput.value || null);
      }

      setTimeout(function () {
        document.addEventListener('click', outsideClickListener);
      }, 0);
    }

    function closePopup() {
      if (!popup) return;
      window.removeEventListener('close-all-pickers', closePopup);
      document.removeEventListener('click', outsideClickListener);
      detachScrollListeners();
      var backdrop = document.getElementById('datepicker-mobile-backdrop');
      if (backdrop && backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
      if (popup.parentNode) {
        popup.parentNode.removeChild(popup);
      }
      popup = null;
      calendarInstance = null;
    }

    function outsideClickListener(e) {
      if (!document.body.contains(e.target)) return;
      if (popup && !popup.contains(e.target) && e.target !== visibleInput) {
        closePopup();
      }
    }

    visibleInput.addEventListener('click', function (e) {
      e.stopPropagation();
      if (popup) {
        closePopup();
      } else {
        openPopup();
      }
    });

    return obj.wrapper;
  }

  /**
   * Ô Switch (Công tắc bật/tắt cho boolean)
   */
  function createSwitch(config) {
    var obj = _createBaseWrapper(config, 'checkbox');
    obj.wrapper.classList.remove('form-group');
    obj.wrapper.classList.add('modern-checkbox-wrapper');
    obj.input.className = 'modern-checkbox';
    obj.input.style.cursor = 'pointer';

    // Checkbox uses checked instead of value
    if (config.value === '1' || config.value === 1 || config.value === true || String(config.value).toLowerCase() === 'true') {
      obj.input.checked = true;
    }

    // Thêm giá trị thực vào dataset để tự động serialize thành 1/0
    obj.input.value = obj.input.checked ? 1 : 0;
    obj.input.onchange = function () {
      this.value = this.checked ? 1 : 0;
    };

    // Đảo ngược thứ tự input và label cho đẹp
    var label = obj.wrapper.querySelector('label');
    if (label) {
      // Xóa class cũ
      label.className = '';
      label.style.cursor = 'pointer';
      // Đảo ngược thứ tự: input trước, label sau
      obj.wrapper.insertBefore(obj.input, label);
    }

    return obj.wrapper;
  }

  /**
   * Ô nhập Mật Khẩu (có nút mắt ẩn/hiện)
   */
  function createPassword(config) {
    var obj = _createBaseWrapper(config, 'password');
    var input = obj.input;

    // Wrapper cho input + nút mắt
    var inputWrap = document.createElement('div');
    inputWrap.style.position = 'relative';
    inputWrap.style.display = 'flex';
    inputWrap.style.alignItems = 'center';

    // Thay thế input bằng inputWrap TRƯỚC (input vẫn còn là child của wrapper)
    obj.wrapper.replaceChild(inputWrap, input);

    // Rồi mới chuyển input vào inputWrap
    input.style.paddingRight = '40px';
    inputWrap.appendChild(input);

    // Nút mắt
    var eyeBtn = document.createElement('button');
    eyeBtn.type = 'button';
    eyeBtn.tabIndex = -1;
    eyeBtn.className = 'password-eye-btn';
    eyeBtn.style.cssText = 'position:absolute; right:8px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; padding:4px; display:flex; align-items:center; justify-content:center; color:var(--muted); border-radius:4px; transition: color 0.2s;';
    eyeBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size:20px;">visibility_off</span>';
    eyeBtn.title = 'Hiện mật khẩu';

    var isVisible = false;
    eyeBtn.addEventListener('click', function () {
      isVisible = !isVisible;
      input.type = isVisible ? 'text' : 'password';
      eyeBtn.querySelector('.material-symbols-outlined').textContent = isVisible ? 'visibility' : 'visibility_off';
      eyeBtn.title = isVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu';
      input.focus();
    });

    // Hover effect
    eyeBtn.addEventListener('mouseenter', function () { this.style.color = 'var(--text)'; });
    eyeBtn.addEventListener('mouseleave', function () { this.style.color = 'var(--muted)'; });

    inputWrap.appendChild(eyeBtn);

    return obj.wrapper;
  }

  /**
   * Ô Select (Combobox thả xuống)
   */
  function createSelect(config, options) {
    var wrapper = document.createElement('div');
    wrapper.className = 'form-group ' + (config.className || '');

    if (config.label) {
      var lbl = document.createElement('label');
      lbl.innerText = config.label;
      if (config.required) {
        var req = document.createElement('span');
        req.innerText = ' *';
        req.style.color = 'var(--danger)';
        lbl.appendChild(req);
      }
      wrapper.appendChild(lbl);
    }

    var select = document.createElement('select');
    select.className = 'ui-input'; // Xài chung style với thẻ input
    if (config.id) select.id = config.id;
    if (config.name) select.name = config.name;
    if (config.disabled) select.disabled = true;

    var defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.innerText = '-- Vui lòng chọn --';
    select.appendChild(defaultOpt);

    (options || []).forEach(function (opt) {
      var o = document.createElement('option');
      o.value = opt.value;
      o.innerText = opt.label;
      if (config.value == opt.value) o.selected = true;
      select.appendChild(o);
    });

    wrapper.appendChild(select);
    return wrapper;
  }

  /**
   * Sinh HTML chuỗi cho Bộ chọn số lượng (Quantity Selector)
   * Dùng cho các Grid/Table sử dụng innerHTML thay vì DOM Nodes.
   */
  function createQuantityHTML(config) {
    var value = config.value || 1;
    var onDecrease = config.onDecrease || '';
    var onIncrease = config.onIncrease || '';
    var onChange = config.onChange || '';
    var stopPropagation = config.stopPropagation ? 'event.stopPropagation(); ' : '';

    var h = config.height || 32;
    var w = config.width || 96;
    var btnW = config.btnWidth || 30;
    var inpW = w - (btnW * 2);

    return `
      <div class="d-flex align-items-center justify-content-center mx-auto" style="width: ${w}px; border: 1px solid var(--border); border-radius: 6px; overflow: hidden; background: var(--surface); box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
        <button class="btn btn-light d-flex align-items-center justify-content-center p-0" style="width: ${btnW}px; height: ${h}px; border: none; border-radius: 0; background: #f8f9fa; color: #475569;" onclick="${stopPropagation}${onDecrease}" title="Giảm">
          <span class="material-symbols-outlined" style="font-size: 16px;">remove</span>
        </button>
        <input type="text" class="form-control text-center p-0 border-0" style="width: ${inpW}px; height: ${h}px; font-weight: 600; font-size: 13px; background: transparent; box-shadow: none;" value="${value}" onchange="${stopPropagation}${onChange}" title="Nhập số lượng">
        <button class="btn btn-light d-flex align-items-center justify-content-center p-0" style="width: ${btnW}px; height: ${h}px; border: none; border-radius: 0; background: #f8f9fa; color: #475569;" onclick="${stopPropagation}${onIncrease}" title="Tăng">
          <span class="material-symbols-outlined" style="font-size: 16px;">add</span>
        </button>
      </div>
    `;
  }

  /**
   * Hàm đọc số thành chữ tiếng Việt
   */
  function docSoTienVN(n) {
    if (!n || n === 0) return 'Không đồng';
    var dvDoc = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ', 'tỷ tỷ'];
    var soDoc = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    function docNhom(so) {
      var tram = Math.floor(so / 100);
      var chuc = Math.floor((so % 100) / 10);
      var dv = so % 10;
      var kq = '';
      if (tram > 0) kq += soDoc[tram] + ' trăm ';
      if (chuc === 1) kq += 'mười ';
      else if (chuc > 1) kq += soDoc[chuc] + ' mươi ';
      if (dv === 1 && chuc > 1) kq += 'mốt ';
      else if (dv === 5 && chuc > 0) kq += 'lăm ';
      else if (dv > 0) kq += soDoc[dv] + ' ';
      return kq.trim();
    }
    var str = Math.round(n).toString();
    var groups = [];
    while (str.length > 0) {
      groups.unshift(str.slice(-3));
      str = str.slice(0, -3);
    }
    var result = '';
    groups.forEach(function (g, i) {
      var val = parseInt(g, 10);
      if (val > 0) {
        result += docNhom(val) + ' ' + dvDoc[groups.length - 1 - i] + ' ';
      }
    });
    return result.trim() + ' đồng';
  }

  /**
   * Cài đặt tự động format số tiền + hiển thị text cho một ô input có sẵn
   */
  function setupMoneyInput(inputEl, textEl) {
    if (!inputEl) return;

    function refresh() {
      var raw = parseInt(inputEl.value.replace(/\D/g, ''), 10) || 0;
      inputEl.value = raw === 0 ? '' : raw.toLocaleString('vi-VN');
      if (textEl) textEl.innerText = raw === 0 ? '' : docSoTienVN(raw);
    }

    inputEl.addEventListener('input', function () {
      var pos = this.selectionStart;
      var oldLen = this.value.length;
      var raw = parseInt(this.value.replace(/\D/g, ''), 10) || 0;

      this.value = raw === 0 ? '' : raw.toLocaleString('vi-VN');

      var diff = this.value.length - oldLen;
      if (pos !== null) {
        this.setSelectionRange(pos + diff, pos + diff);
      }

      if (textEl) textEl.innerText = raw === 0 ? '' : docSoTienVN(raw);
    });

    inputEl.addEventListener('change', function () {
      refresh();
    });

    inputEl.addEventListener('blur', function () {
      refresh();
    });

    refresh();
  }

  return {
    createText: createText,
    createNumber: createNumber,
    createMoney: createMoney,
    createDate: createDate,
    createTime: createTime,
    createPassword: createPassword,
    createSwitch: createSwitch,
    createSelect: createSelect,
    createQuantityHTML: createQuantityHTML,
    docSoTienVN: docSoTienVN,
    setupMoneyInput: setupMoneyInput
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
    var infoTemplate = (typeof t !== 'undefined') ? t('pager.info') : 'Hiển thị {0} - {1} trong số {2} bản ghi';
    info.innerText = infoTemplate
      .replace('{0}', startItem)
      .replace('{1}', endItem)
      .replace('{2}', options.totalItems);

    var controls = document.createElement('div');
    controls.className = 'pagination-controls';

    // First Button
    var btnFirst = document.createElement('button');
    btnFirst.className = 'page-btn pager-btn-first';
    btnFirst.innerHTML = '<span class="material-symbols-outlined">first_page</span>';
    btnFirst.disabled = currentPage === 1;
    btnFirst.onclick = function () {
      if (typeof options.onPageChange === 'function') options.onPageChange(1);
    };
    controls.appendChild(btnFirst);

    // Prev Button
    var btnPrev = document.createElement('button');
    btnPrev.className = 'page-btn';
    btnPrev.innerHTML = '<span class="material-symbols-outlined">chevron_left</span>';
    btnPrev.disabled = currentPage === 1;
    btnPrev.onclick = function () {
      if (typeof options.onPageChange === 'function') options.onPageChange(currentPage - 1);
    };
    controls.appendChild(btnPrev);

    // Page numbers logic with ellipsis (...)
    var pageList = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageList.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pageList = [1, 2, 3, 4, 5, '...', totalPages];
      } else if (currentPage >= totalPages - 3) {
        pageList = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pageList = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
      }
    }

    pageList.forEach(function (item) {
      if (item === '...') {
        let span = document.createElement('span');
        span.className = 'page-ellipsis';
        span.innerText = '...';
        span.style.padding = '0 8px';
        span.style.color = 'var(--muted, #6b7280)';
        span.style.display = 'flex';
        span.style.alignItems = 'center';
        span.style.fontSize = '14px';
        controls.appendChild(span);
      } else {
        let pBtn = document.createElement('button');
        pBtn.className = 'page-btn pager-number-btn' + (item === currentPage ? ' active' : '');
        pBtn.innerText = item;
        pBtn.onclick = function () {
          if (typeof options.onPageChange === 'function' && item !== currentPage) {
            options.onPageChange(item);
          }
        };
        controls.appendChild(pBtn);
      }
    });

    // Mobile Page Indicator
    var mobileIndicator = document.createElement('span');
    mobileIndicator.className = 'pager-mobile-indicator';
    var pageLabel = (typeof t !== 'undefined') ? t('pager.page') : 'Trang';
    mobileIndicator.innerText = `${pageLabel} ${currentPage} / ${totalPages}`;
    controls.appendChild(mobileIndicator);

    // Next Button
    var btnNext = document.createElement('button');
    btnNext.className = 'page-btn';
    btnNext.innerHTML = '<span class="material-symbols-outlined">chevron_right</span>';
    btnNext.disabled = currentPage === totalPages || totalPages === 0;
    btnNext.onclick = function () {
      if (typeof options.onPageChange === 'function') options.onPageChange(currentPage + 1);
    };
    controls.appendChild(btnNext);

    // Last Button
    var btnLast = document.createElement('button');
    btnLast.className = 'page-btn pager-btn-last';
    btnLast.innerHTML = '<span class="material-symbols-outlined">last_page</span>';
    btnLast.disabled = currentPage === totalPages || totalPages === 0;
    btnLast.onclick = function () {
      if (typeof options.onPageChange === 'function') options.onPageChange(totalPages);
    };
    controls.appendChild(btnLast);

    // Separator line
    var separator = document.createElement('div');
    separator.className = 'pager-separator';
    separator.style.width = '1px';
    separator.style.height = '16px';
    separator.style.background = 'var(--border, #e2e8f0)';
    separator.style.margin = '0 8px';
    controls.appendChild(separator);

    // Refresh Button
    var btnRefresh = document.createElement('button');
    btnRefresh.className = 'page-btn';
    btnRefresh.innerHTML = '<span class="material-symbols-outlined">refresh</span>';
    btnRefresh.onclick = function () {
      if (typeof options.onRefresh === 'function') options.onRefresh();
      else if (typeof options.onPageChange === 'function') options.onPageChange(currentPage);
    };
    controls.appendChild(btnRefresh);

    // Capture Button
    var btnCapture = document.createElement('button');
    btnCapture.className = 'page-btn pager-btn-capture';
    btnCapture.innerHTML = '<span class="material-symbols-outlined">photo_camera</span>';
    btnCapture.title = (typeof t !== 'undefined') ? t('btn.screenshot_title') : 'Chụp vùng màn hình';
    btnCapture.style.color = "var(--accent, #4F46E5)";
    btnCapture.onclick = function () {
      if (typeof ScreenCapture !== 'undefined') {
        ScreenCapture.start();
      } else {
        if (typeof showToast !== 'undefined') {
          showToast('Công cụ chụp ảnh chưa sẵn sàng!', false);
        }
      }
    };
    controls.appendChild(btnCapture);

    wrapper.appendChild(info);
    wrapper.appendChild(controls);

    return wrapper;
  }

  return {
    create: create
  };
})();


/* --- ScreenCapture.js --- */
/* ═══════════════════════════════════════════
   SCREEN CAPTURE COMPONENT (Canvas-based)
   ═══════════════════════════════════════════ */
var ScreenCapture = (function () {

  var overlayCanvas = null;
  var ctx = null;
  var startX = 0, startY = 0;
  var isDrawing = false;
  var currentRect = null;
  var currentCallback = null;
  var ww = 0, wh = 0;
  
  var mode = 'select'; // 'select' | 'draw'
  var shapes = []; // {left, top, width, height}
  var shapeStartX = 0, shapeStartY = 0;
  var currentShape = null;

  var toolbar = null;
  var isShapeModeActive = false; // Bắt buộc click nút mới được vẽ

  function showMsg(msg, isSuccess) {
    if (typeof showToast !== 'undefined') {
      showToast(msg, isSuccess);
    } else if (typeof UIToast !== 'undefined') {
      UIToast.show(msg, isSuccess ? 'success' : 'error');
    } else {
      console.log(msg);
    }
  }

  function initOverlay() {
    if (overlayCanvas) return;
    
    ww = window.innerWidth;
    wh = window.innerHeight;
    
    mode = 'select';
    shapes = [];
    currentRect = null;
    currentShape = null;
    isDrawing = false;
    isShapeModeActive = false;

    overlayCanvas = document.createElement('canvas');
    overlayCanvas.className = 'screen-capture-canvas';
    overlayCanvas.width = ww;
    overlayCanvas.height = wh;
    
    overlayCanvas.style.position = 'fixed';
    overlayCanvas.style.top = '0';
    overlayCanvas.style.left = '0';
    overlayCanvas.style.zIndex = '999990';
    overlayCanvas.style.cursor = 'crosshair';
    
    ctx = overlayCanvas.getContext('2d');
    
    document.body.appendChild(overlayCanvas);
    
    drawMask(0, 0, 0, 0); 
    
    overlayCanvas.addEventListener('mousedown', onMouseDown);
    overlayCanvas.addEventListener('mousemove', onMouseMove);
    overlayCanvas.addEventListener('mouseup', onMouseUp);
    document.addEventListener('keydown', onKeyDown);
  }

  function destroyOverlay() {
    if (overlayCanvas) {
      overlayCanvas.removeEventListener('mousedown', onMouseDown);
      overlayCanvas.removeEventListener('mousemove', onMouseMove);
      overlayCanvas.removeEventListener('mouseup', onMouseUp);
      if (overlayCanvas.parentNode) {
        document.body.removeChild(overlayCanvas);
      }
      overlayCanvas = null;
      ctx = null;
    }
    if (toolbar) {
      if (toolbar.parentNode) document.body.removeChild(toolbar);
      toolbar = null;
    }
    document.removeEventListener('keydown', onKeyDown);
  }

  function createToolbarBtn(icon, title, onClick) {
    var btn = document.createElement('button');
    btn.innerHTML = '<span class="material-symbols-outlined" style="font-size:20px;">' + icon + '</span>';
    btn.title = title;
    btn.style.background = 'transparent';
    btn.style.border = 'none';
    btn.style.cursor = 'pointer';
    btn.style.padding = '6px';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.color = '#374151';
    btn.style.borderRadius = '4px';
    btn.onmouseover = function() { if(!btn.classList.contains('active')) btn.style.background = '#F3F4F6'; };
    btn.onmouseout = function() { if(!btn.classList.contains('active')) btn.style.background = 'transparent'; };
    btn.onclick = onClick;
    return btn;
  }

  function showToolbar() {
    if (!toolbar) {
      toolbar = document.createElement('div');
      toolbar.style.position = 'fixed';
      toolbar.style.zIndex = '999995';
      toolbar.style.background = '#ffffff';
      toolbar.style.border = '1px solid #E5E7EB';
      toolbar.style.borderRadius = '6px';
      toolbar.style.padding = '4px';
      toolbar.style.display = 'flex';
      toolbar.style.gap = '2px';
      toolbar.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)';
      
      var btnRect = createToolbarBtn('crop_square', 'Vẽ khung đỏ', function() {
        isShapeModeActive = true;
        btnRect.style.background = '#E0E7FF';
        btnRect.style.color = '#4F46E5';
        btnRect.classList.add('active');
        overlayCanvas.style.cursor = 'crosshair';
      });
      
      var btnCopy = createToolbarBtn('content_copy', 'Copy (Ctrl+C)', function() {
        captureAndAction();
      });
      btnCopy.style.color = '#10B981';

      var btnClose = createToolbarBtn('close', 'Hủy (ESC)', function() {
        destroyOverlay();
      });
      btnClose.style.color = '#F43F5E';
      
      toolbar.appendChild(btnRect);
      var divider = document.createElement('div');
      divider.style.width = '1px';
      divider.style.background = '#E5E7EB';
      divider.style.margin = '4px';
      toolbar.appendChild(divider);
      toolbar.appendChild(btnCopy);
      toolbar.appendChild(btnClose);
      
      document.body.appendChild(toolbar);
    }
    
    toolbar.style.display = 'flex';
    
    // Position toolbar at bottom right of the selection
    var tLeft = currentRect.left + currentRect.width - 120;
    var tTop = currentRect.top + currentRect.height + 10;
    if (tLeft < 10) tLeft = 10;
    if (tTop + 50 > wh) tTop = currentRect.top - 50;
    
    toolbar.style.left = tLeft + 'px';
    toolbar.style.top = tTop + 'px';
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      destroyOverlay();
    } else if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      if (mode === 'draw' && currentRect) {
        e.preventDefault();
        captureAndAction();
      }
    }
  }

  function drawMask(x, y, w, h) {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, ww, wh); // Xóa sạch canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, 0, ww, wh);

    if (mode === 'select') {
      if (w > 0 && h > 0) {
        ctx.clearRect(x, y, w, h);
        ctx.strokeStyle = '#4F46E5';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(x, y, w, h);
      }
      
      if (!isDrawing && w === 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(ww/2 - 150, 20, 300, 40);
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Nhấn và kéo chuột để chọn vùng', ww/2, 45);
      }
    } else if (mode === 'draw') {
      ctx.clearRect(currentRect.left, currentRect.top, currentRect.width, currentRect.height);
      ctx.strokeStyle = '#4F46E5';
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.strokeRect(currentRect.left, currentRect.top, currentRect.width, currentRect.height);
      
      ctx.strokeStyle = '#EF4444'; // Red
      ctx.lineWidth = 3;
      
      shapes.forEach(function(s) {
        ctx.strokeRect(s.left, s.top, s.width, s.height);
      });
      
      if (isDrawing && currentShape && isShapeModeActive) {
        ctx.strokeRect(currentShape.left, currentShape.top, currentShape.width, currentShape.height);
      }
    }
  }

  function onMouseDown(e) {
    if (mode === 'select') {
      isDrawing = true;
      startX = e.clientX;
      startY = e.clientY;
      drawMask(startX, startY, 0, 0);
    } else if (mode === 'draw') {
      if (!isShapeModeActive) return; // Không cho vẽ nếu chưa click nút hình
      
      var cx = e.clientX;
      var cy = e.clientY;
      
      // Chỉ cho phép vẽ bên trong vùng đã chọn
      if (cx >= currentRect.left && cx <= currentRect.left + currentRect.width &&
          cy >= currentRect.top && cy <= currentRect.top + currentRect.height) {
        isDrawing = true;
        shapeStartX = cx;
        shapeStartY = cy;
        currentShape = { left: shapeStartX, top: shapeStartY, width: 0, height: 0 };
        if (toolbar) toolbar.style.display = 'none'; // Ẩn toolbar khi đang vẽ cho đỡ vướng
      }
    }
  }

  var rafId = null;
  function onMouseMove(e) {
    if (!isDrawing) return;
    var currentX = e.clientX;
    var currentY = e.clientY;

    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(function() {
      if (mode === 'select') {
        var left = Math.min(startX, currentX);
        var top = Math.min(startY, currentY);
        var width = Math.abs(currentX - startX);
        var height = Math.abs(currentY - startY);
        drawMask(left, top, width, height);
      } else if (mode === 'draw') {
        if (!isShapeModeActive) return;
        
        // Giới hạn trong currentRect
        var limitedX = Math.max(currentRect.left, Math.min(currentX, currentRect.left + currentRect.width));
        var limitedY = Math.max(currentRect.top, Math.min(currentY, currentRect.top + currentRect.height));
        
        var sLeft = Math.min(shapeStartX, limitedX);
        var sTop = Math.min(shapeStartY, limitedY);
        var sWidth = Math.abs(limitedX - shapeStartX);
        var sHeight = Math.abs(limitedY - shapeStartY);
        
        currentShape = { left: sLeft, top: sTop, width: sWidth, height: sHeight };
        drawMask();
      }
    });
  }

  function onMouseUp(e) {
    if (!isDrawing) return;
    isDrawing = false;
    
    if (mode === 'select') {
      var endX = e.clientX;
      var endY = e.clientY;
      var left = Math.min(startX, endX);
      var top = Math.min(startY, endY);
      var width = Math.abs(endX - startX);
      var height = Math.abs(endY - startY);

      if (width > 20 && height > 20) {
        currentRect = { left: left, top: top, width: width, height: height };
        mode = 'draw';
        overlayCanvas.style.cursor = 'default';
        drawMask();
        showToolbar();
      } else {
        destroyOverlay(); 
      }
    } else if (mode === 'draw') {
      if (currentShape && currentShape.width > 5 && currentShape.height > 5) {
        shapes.push(currentShape);
      }
      currentShape = null;
      drawMask();
      if (toolbar) toolbar.style.display = 'flex';
    }
  }

  function captureAndAction() {
    if (typeof html2canvas === 'undefined') {
      showMsg('Thư viện html2canvas chưa load!', false);
      destroyOverlay();
      return;
    }

    // Ẩn UI
    if (toolbar) toolbar.style.display = 'none';

    var shapeContainer = document.createElement('div');
    shapeContainer.style.position = 'absolute';
    shapeContainer.style.left = '0';
    shapeContainer.style.top = '0';
    shapeContainer.style.width = '100%';
    shapeContainer.style.height = '100%';
    shapeContainer.style.pointerEvents = 'none';
    shapeContainer.style.zIndex = '999998';

    shapes.forEach(function(s) {
      var div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.left = (s.left + window.scrollX) + 'px';
      div.style.top = (s.top + window.scrollY) + 'px';
      div.style.width = s.width + 'px';
      div.style.height = s.height + 'px';
      div.style.border = '3px solid #EF4444';
      div.style.boxSizing = 'border-box';
      shapeContainer.appendChild(div);
    });
    document.body.appendChild(shapeContainer);

    destroyOverlay(); // Xóa canvas
    
    showMsg('Đang xử lý ảnh...', true);

    var isDone = false;
    var timeoutId = setTimeout(function() {
      if (!isDone) {
        showMsg('Xử lý ảnh quá lâu!', false);
        if (shapeContainer.parentNode) document.body.removeChild(shapeContainer);
        isDone = true;
      }
    }, 5000);

    try {
      html2canvas(document.body, {
        x: currentRect.left + window.scrollX,
        y: currentRect.top + window.scrollY,
        width: currentRect.width,
        height: currentRect.height,
        useCORS: true,
        allowTaint: true,
        scale: 1,
        logging: false,
        backgroundColor: null
      }).then(function(canvas) {
        if (isDone) return;
        isDone = true;
        clearTimeout(timeoutId);
        
        if (shapeContainer.parentNode) document.body.removeChild(shapeContainer);

        if (currentCallback) {
          currentCallback(canvas);
          return;
        }

        function fallbackDownload() {
          try {
            var imgData = canvas.toDataURL('image/png');
            var a = document.createElement('a');
            a.href = imgData;
            a.download = 'screenshot_' + new Date().getTime() + '.png';
            a.click();
            showMsg('Đã lưu ảnh về máy!', true);
          } catch (e) {
            showMsg('Không thể xuất ảnh: Lỗi bảo mật CORS trình duyệt!', false);
          }
        }

        try {
          canvas.toBlob(function(blob) {
            if (!blob) return fallbackDownload();
            if (navigator.clipboard && window.ClipboardItem) {
              navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]).then(function() {
                showMsg('Đã copy ảnh!', true);
              }).catch(function() { fallbackDownload(); });
            } else {
              fallbackDownload();
            }
          });
        } catch (e) {
          fallbackDownload();
        }
      }).catch(function(err) {
        if (isDone) return;
        isDone = true;
        clearTimeout(timeoutId);
        if (shapeContainer.parentNode) document.body.removeChild(shapeContainer);
        showMsg('Lỗi chụp hình: ' + ((err && err.message) || 'Lỗi bảo mật hoặc CORS'), false);
      });
    } catch(err) {
      if (isDone) return;
      isDone = true;
      clearTimeout(timeoutId);
      if (shapeContainer.parentNode) document.body.removeChild(shapeContainer);
      showMsg('Lỗi chụp hình: ' + ((err && err.message) || 'Lỗi hệ thống'), false);
    }
  }

  function start(onCaptureCallback) {
    currentCallback = onCaptureCallback || null;
    initOverlay();
  }

  return {
    start: start
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


/* --- NestedTabs.js --- */
/**
 * UINestedTabs — Tab phân cấp 2 cấp (Cha → Con) + Kéo thả sắp xếp
 * ──────────────────────────────────────────────────────────────────
 * Nhận vào một mảng flat từ DB (giống WA_Menu):
 *   [{ id, parent, label, [icon], [formName] }]
 *
 * Quy tắc xác định cha/con:
 *   - parent === '' hoặc null/undefined → Tab CHA (root)
 *   - parent !== ''                     → Tab CON (thuộc parent đó)
 *
 * API:
 *   UINestedTabs.create(records, options?) → DOM Element
 *   UINestedTabs.createFromDB(dbRows, options?) → DOM Element
 *
 * Options:
 *   onTabChange(parentId, childId)            - callback khi đổi tab
 *   onReorder(type, orderedIds, parentId?)    - callback khi kéo thả xong
 *                                               type = 'parent' | 'child'
 *   renderContent(item)                       - trả về Node | string cho panel
 *   defaultParentId                           - tab cha active ban đầu
 *   defaultChildId                            - tab con active ban đầu
 *   draggable                                 - true (mặc định) để bật kéo thả
 */
var UINestedTabs = (function () {

  // ════════════════════════════════════════════════════════════
  //  PUBLIC: create
  // ════════════════════════════════════════════════════════════
  function create(records, options) {
    options = options || {};
    var isDraggable = options.draggable !== false; // bật mặc định

    // ── 1. Phân loại cha / con ──────────────────────────────────
    var parents = records.filter(function (r) {
      return !r.parent || r.parent.trim() === '';
    });

    var childrenMap = {}; // { parentId: [child, ...] }
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

    // ── Phân nhánh: Vertical vs Horizontal ──────────────────
    if (options.vertical) {
      return _createVertical(parents, childrenMap, options);
    }

    // ── 2. Active mặc định ──────────────────────────────────────
    var defaultParentId = options.defaultParentId || parents[0].id;
    var activeParent    = parents.find(function (p) { return p.id === defaultParentId; }) || parents[0];

    // ── 3. Wrapper ───────────────────────────────────────────────
    var wrapper = document.createElement('div');
    wrapper.className = 'ui-nested-tabs';

    // ── 4. Parent Tab Bar ────────────────────────────────────────
    var parentBar = document.createElement('div');
    parentBar.className = 'ui-nested-tabs__parent-bar';

    // ── 5. Child Area ────────────────────────────────────────────
    var childArea = document.createElement('div');
    childArea.className = 'ui-nested-tabs__child-area';

    // ── 6. Render mỗi parent ────────────────────────────────────
    parents.forEach(function (parentItem) {
      var isParentActive = (parentItem.id === activeParent.id);
      var children       = childrenMap[parentItem.id] || [];

      // ─ Parent button ─
      var pBtn = _buildParentBtn(parentItem, isParentActive, children.length, isDraggable);
      parentBar.appendChild(pBtn);

      // ─ Child section ─
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

          // Child btn
          var cBtn = _buildChildBtn(childItem, parentItem, isChildActive, isDraggable);
          childBar.appendChild(cBtn);

          // Panel
          var panel = _buildPanel(childItem, parentItem, isChildActive, options);
          panelArea.appendChild(panel);

          // Click: activate child tab
          cBtn.addEventListener('click', function () {
            _activateChildTab(childBar, panelArea, cBtn, panel);
            if (typeof options.onTabChange === 'function') {
              options.onTabChange(parentItem.id, childItem.id);
            }
          });
        });

        // Drag-and-drop cho child bar
        if (isDraggable) {
          _attachDragToBar(childBar, panelArea, 'child', parentItem.id, options);
        }

        childSection.appendChild(childBar);
        childSection.appendChild(panelArea);

      } else {
        // Không có con → panel trực tiếp
        var soloPanel = _buildPanel(parentItem, null, true, options);
        childSection.appendChild(soloPanel);
      }

      childArea.appendChild(childSection);

      // Click: activate parent tab
      pBtn.addEventListener('click', function () {
        _activateParentTab(parentBar, childArea, pBtn, childSection);
        if (typeof options.onTabChange === 'function') {
          var activeChild = childSection.querySelector('.ui-nested-tab-child-btn.active');
          options.onTabChange(parentItem.id, activeChild ? activeChild.dataset.childId : null);
        }
      });
    });

    // Drag-and-drop cho parent bar
    if (isDraggable) {
      _attachDragToBar(parentBar, null, 'parent', null, options);
    }

    wrapper.appendChild(parentBar);
    wrapper.appendChild(childArea);
    return wrapper;
  }

  // ════════════════════════════════════════════════════════════
  //  PUBLIC: createFromDB
  // ════════════════════════════════════════════════════════════
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

  // ════════════════════════════════════════════════════════════
  //  PRIVATE: builders
  // ════════════════════════════════════════════════════════════

  function _buildParentBtn(item, isActive, childCount, isDraggable) {
    var btn = document.createElement('button');
    btn.className = 'ui-nested-tab-parent-btn' + (isActive ? ' active' : '');
    btn.dataset.parentId = item.id;

    // Drag handle icon (chỉ hiện khi hover nhờ CSS)
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

  // ════════════════════════════════════════════════════════════
  //  PRIVATE: activate helpers
  // ════════════════════════════════════════════════════════════

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

  // ════════════════════════════════════════════════════════════
  //  PRIVATE: Drag-and-drop
  // ════════════════════════════════════════════════════════════

  /**
   * Gắn drag-and-drop vào một tab bar (parent hoặc child)
   * @param {Element} bar          - thanh tab chứa các btn có thể kéo
   * @param {Element|null} panelArea - vùng panel tương ứng (dùng để sync thứ tự panel)
   * @param {string}  type         - 'parent' | 'child'
   * @param {string|null} parentId - id của tab cha (chỉ dùng khi type='child')
   * @param {Object}  options      - options của component
   */
  function _attachDragToBar(bar, panelArea, type, parentId, options) {
    var dragging    = null;  // phần tử đang kéo
    var placeholder = null;  // dải chỉ vị trí thả

    // Selector của các btn trong bar
    var btnSelector = (type === 'parent')
      ? '.ui-nested-tab-parent-btn'
      : '.ui-nested-tab-child-btn';

    // ── dragstart ──
    bar.addEventListener('dragstart', function (e) {
      var btn = e.target.closest(btnSelector);
      if (!btn) return;

      dragging = btn;
      dragging.classList.add('ui-nested-dragging');

      // Tạo ghost image sạch
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', btn.dataset.parentId || btn.dataset.childId || '');

      // Tạo placeholder
      placeholder = document.createElement('div');
      placeholder.className = 'ui-nested-drop-placeholder';
      if (type === 'child') placeholder.classList.add('ui-nested-drop-placeholder--child');
    });

    // ── dragover ──
    bar.addEventListener('dragover', function (e) {
      if (!dragging) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';

      var target = e.target.closest(btnSelector);
      if (!target || target === dragging) {
        return;
      }

      // Xác định thả vào trước hay sau
      var rect   = target.getBoundingClientRect();
      var offset = (type === 'parent')
        ? e.clientX - rect.left    // ngang
        : e.clientX - rect.left;   // ngang (child bar cũng ngang)
      var half = (type === 'parent') ? rect.width / 2 : rect.width / 2;

      // Xóa placeholder cũ nếu có
      if (placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);

      if (offset < half) {
        bar.insertBefore(placeholder, target);
      } else {
        var next = target.nextSibling;
        if (next) bar.insertBefore(placeholder, next);
        else bar.appendChild(placeholder);
      }
    });

    // ── dragleave ──
    bar.addEventListener('dragleave', function (e) {
      // Chỉ xóa placeholder khi ra ngoài bar
      if (!bar.contains(e.relatedTarget) && placeholder && placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
      }
    });

    // ── drop ──
    bar.addEventListener('drop', function (e) {
      e.preventDefault();
      if (!dragging || !placeholder || !placeholder.parentNode) return;

      // Đặt btn vào vị trí placeholder
      bar.insertBefore(dragging, placeholder);
      placeholder.parentNode.removeChild(placeholder);

      // Sync thứ tự panel nếu là child bar
      if (panelArea) {
        _syncPanelOrder(bar, panelArea, btnSelector);
      }

      // Gọi onReorder callback
      if (typeof options.onReorder === 'function') {
        var orderedIds = Array.from(bar.querySelectorAll(btnSelector)).map(function (b) {
          return type === 'parent' ? b.dataset.parentId : b.dataset.childId;
        });
        options.onReorder(type, orderedIds, parentId);
      }

      _cleanup();
    });

    // ── dragend ──
    bar.addEventListener('dragend', function () {
      _cleanup();
    });

    // ─ cleanup local state ─
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

  /**
   * Sau khi kéo thả child btn, sắp xếp lại các panel theo thứ tự btn mới
   */
  function _syncPanelOrder(childBar, panelArea, btnSelector) {
    var btns = Array.from(childBar.querySelectorAll(btnSelector));
    btns.forEach(function (btn) {
      var childId = btn.dataset.childId;
      var panel   = panelArea.querySelector('#nested-panel-' + childId);
      if (panel) panelArea.appendChild(panel); // appendChild tự move về cuối → đúng thứ tự
    });
  }

  // ════════════════════════════════════════════════════════════
  //  PRIVATE: default panel content
  // ════════════════════════════════════════════════════════════

  function _defaultPanelHTML(item, parentItem) {
    return [
      '<div class="ui-nested-tab-default-content">',
        UIIcon.renderHtml(item.icon || 'folder_open', 'font-size:40px;opacity:0.2;display:block;margin-bottom:12px'),
        '<div style="font-weight:600;font-size:15px;margin-bottom:6px">', item.label || item.id, '</div>',
        parentItem
          ? '<div style="font-size:12px;opacity:0.5">Thuộc nhóm: ' + parentItem.label + ' (' + parentItem.id + ')</div>'
          : '',
        item.formName
          ? '<code style="font-size:11px;opacity:0.5;display:block;margin-top:8px">' + item.formName + '</code>'
          : '',
      '</div>'
    ].join('');
  }

  // ════════════════════════════════════════════════════════════
  //  PRIVATE: Vertical layout
  // ════════════════════════════════════════════════════════════

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
      if (!isRoot) {
          pBtn.dataset.childId = node.id; 
      }
      
      if (level > 0) {
        pBtn.style.paddingLeft = (16 + level * 20) + 'px';
      }

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
        if (!node.icon || node.icon.indexOf('icon-') === 0) {
          iconEl.style.opacity = '0.3';
        }
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
          if (childList) {
            childList.classList.toggle('open');
          }
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
      // NOTE: attach to sidebar directly
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

  /**
   * Khởi tạo tính năng kéo giãn sidebar
   */
  function _initSidebarResizer(resizer, sidebar) {
    var isResizing = false;

    resizer.addEventListener('mousedown', function (e) {
      isResizing = true;
      resizer.classList.add('is-resizing');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      
      var onMouseMove = function (e) {
        if (!isResizing) return;
        
        // Tính toán độ rộng mới dựa trên vị trí chuột
        var containerRect = sidebar.parentElement.getBoundingClientRect();
        var newWidth = e.clientX - containerRect.left;
        
        // Giới hạn width từ 180px đến 600px
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

  // ── Drag dọc cho child list ──────────────────────────────
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
      
      // Sync panel order for UI (if needed, but panels are all flat in contentArea)
      // Array.from(childList.children).forEach(...) is possible, but contentArea order doesn't break CSS rendering.
      
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

  // ── Drag dọc cho parent groups ───────────────────────────
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

  // ════════════════════════════════════════════════════════════
  //  EXPORTS
  // ════════════════════════════════════════════════════════════
  return {
    create:       create,
    createFromDB: createFromDB
  };

})();


/* --- EmptyState.js --- */
/**
 * EmptyState Component
 * Trạng thái trống (VD: Chưa có khách hàng, chưa có hợp đồng)
 */
var UIEmptyState = (function () {

  /**
   * Tạo màn hình rỗng
   * @param {Object} config - { icon, title, desc, action (DOM Node) }
   */
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

  /**
   * Sinh chuỗi HTML trạng thái trống (Dùng cho innerHTML)
   * @param {Object} config - { icon, title, desc, actionHtml }
   */
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

  /**
   * Sinh chuỗi HTML trạng thái trống cho Table Row
   * @param {Object} config - { colspan, text, actionHtml }
   */
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
 * Bắt sự kiện Click Chuột Phải -> Hiện Menu thả xuống tùy chỉnh (Ví dụ: Tick/Bỏ Tick dòng, Đổi trạng thái)
 */
var UIContextMenu = (function () {
  
  var currentMenu = null;

  /**
   * Khởi tạo Menu 
   * @param {Event} e - Sự kiện chuột phải (Dùng để lấy toạ độ X, Y)
   * @param {Array} items - [{ label, icon, onClick }, '|' ]
   */
  function show(e, items) {
    e.preventDefault();
    hide();

    var menu = document.createElement('div');
    menu.className = 'ui-context-menu';
    
    // Position
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

    // Nghe sự kiện click ngoài -> Đóng menu
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
 * Khác với Alert (Gây gián đoạn), Toast hiện lên lặng lẽ ở góc và tự biến mất sau 3s
 */
var UIToast = (function () {

  // Auto-init container
  var container = null;
  document.addEventListener('DOMContentLoaded', function() {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  });

  /**
   * Gọi thông báo
   * @param {string} msg - Nội dung thông báo
   * @param {string} type - 'success', 'error', 'warning', 'info'
   */
  function show(msg, type) {
    if (!container) return; // Fallback

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

    // Trigger animate in
    requestAnimationFrame(function() {
      toast.classList.add('show');
    });

    // Tự động tắt sau 3 giây
    setTimeout(function() {
      toast.classList.remove('show');
      // Đợi animation chạy xong rồi xóa node
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
 * Hiển thị thông báo trượt góc phải màn hình
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

  /**
   * Hiển thị thông báo
   * @param {string} type - 'success', 'danger', 'warning', 'info'
   * @param {string} title - Tiêu đề
   * @param {string} message - Nội dung
   * @param {number} duration - Thời gian hiển thị (ms)
   */
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

    // Trigger animation
    setTimeout(function() {
      toast.classList.add('show');
    }, 10);

    // Auto remove
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
    }, 400); // Wait for transition
  }

  return {
    success: function(title, message, duration) { show('success', title, message, duration); },
    error: function(title, message, duration) { show('danger', title, message, duration); },
    warning: function(title, message, duration) { show('warning', title, message, duration); },
    info: function(title, message, duration) { show('info', title, message, duration); }
  };
})();


/* --- Calendar.js --- */
/**
 * Calendar Component
 * Sinh Lịch Tiệc cơ bản bằng JS. Không dùng thư viện nặng.
 */
var UICalendar = (function () {

  /**
   * Khởi tạo Lịch
   * @param {Object} config - { year, month, events (danh sách chấm đỏ/xanh) }
   */
  function create(config) {
    config = config || {};
    var today = new Date();
    var currentYear = (config.year !== undefined && !isNaN(config.year)) ? Number(config.year) : today.getFullYear();
    var currentMonth = (config.month !== undefined && !isNaN(config.month)) ? Number(config.month) : today.getMonth();
    var isFirstRender = true;

    var wrapper = document.createElement('div');
    wrapper.className = 'ui-calendar-wrapper';

    function render(year, month) {
      wrapper.innerHTML = '';

      // Header
      var header = document.createElement('div');
      header.className = 'calendar-header';

      var titleContainer = document.createElement('div');
      titleContainer.className = 'calendar-month-picker';

      var titleText = document.createElement('span');
      titleText.innerText = 'Tháng ' + (month + 1) + ', ' + year;
      titleContainer.appendChild(titleText);

      var icon = document.createElement('span');
      icon.className = 'material-symbols-outlined';
      icon.innerText = 'expand_more';
      icon.style.fontSize = '24px';
      icon.style.color = 'var(--color-text-secondary)';
      titleContainer.appendChild(icon);

      titleContainer.onclick = function () {
        if (document.getElementById('custom-month-picker-overlay')) return;

        var overlay = document.createElement('div');
        overlay.id = 'custom-month-picker-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.zIndex = '999999999';

        var dropdown = document.createElement('div');
        dropdown.className = 'calendar-dropdown-picker';
        var rect = titleContainer.getBoundingClientRect();
        dropdown.style.top = (rect.bottom + 8) + 'px';
        dropdown.style.left = rect.left + 'px';
        dropdown.onclick = function (ev) { ev.stopPropagation(); };

        var yearHeader = document.createElement('div');
        yearHeader.className = 'calendar-dropdown-header';

        var btnPrevYear = document.createElement('button');
        btnPrevYear.className = 'btn btn-outline d-flex align-items-center justify-content-center p-0 rounded-circle';
        btnPrevYear.style.width = '32px'; btnPrevYear.style.height = '32px';
        btnPrevYear.innerHTML = '<span class="material-symbols-outlined" style="font-size: 18px;">chevron_left</span>';

        var yearLabel = document.createElement('div');
        yearLabel.className = 'calendar-dropdown-year-label';
        yearLabel.innerText = year;

        var btnNextYear = document.createElement('button');
        btnNextYear.className = 'btn btn-outline d-flex align-items-center justify-content-center p-0 rounded-circle';
        btnNextYear.style.width = '32px'; btnNextYear.style.height = '32px';
        btnNextYear.innerHTML = '<span class="material-symbols-outlined" style="font-size: 18px;">chevron_right</span>';

        var tempYear = year;

        btnPrevYear.onclick = function () { tempYear--; yearLabel.innerText = tempYear; loadSummaryAndRender(); };
        btnNextYear.onclick = function () { tempYear++; yearLabel.innerText = tempYear; loadSummaryAndRender(); };

        yearHeader.appendChild(btnPrevYear);
        yearHeader.appendChild(yearLabel);
        yearHeader.appendChild(btnNextYear);
        dropdown.appendChild(yearHeader);

        var monthsGrid = document.createElement('div');
        monthsGrid.className = 'calendar-dropdown-months-grid';

        function renderMonths() {
          monthsGrid.innerHTML = '';
          var monthNames = ['Thg 1', 'Thg 2', 'Thg 3', 'Thg 4', 'Thg 5', 'Thg 6', 'Thg 7', 'Thg 8', 'Thg 9', 'Thg 10', 'Thg 11', 'Thg 12'];
          var summary = (config.monthSummary && config.monthSummary[tempYear]) ? config.monthSummary[tempYear] : {};
          for (let m = 0; m < 12; m++) {
            var mBtn = document.createElement('button');
            mBtn.className = 'calendar-dropdown-month-btn' + (tempYear === year && m === month ? ' active' : '');
            mBtn.innerText = monthNames[m];
            if (summary[m] && summary[m] > 0) {
              mBtn.classList.add('has-events');
              var dot = document.createElement('span');
              dot.className = 'month-event-dot';
              mBtn.appendChild(dot);
            }
            mBtn.onclick = function () {
              document.body.removeChild(overlay);
              currentYear = tempYear;
              currentMonth = m;
              if (typeof config.onChangeMonth === 'function') config.onChangeMonth(currentYear, currentMonth);
              else render(currentYear, currentMonth);
            };
            monthsGrid.appendChild(mBtn);
          }
        }

        // Load summary for current tempYear when navigating years
        function loadSummaryAndRender() {
          if (config.monthSummary && !config.monthSummary[tempYear] && typeof config.onLoadYearSummary === 'function') {
            config.onLoadYearSummary(tempYear).then(function (s) {
              config.monthSummary[tempYear] = s;
              renderMonths();
            });
          } else {
            renderMonths();
          }
        }

        loadSummaryAndRender();
        dropdown.appendChild(monthsGrid);
        overlay.appendChild(dropdown);
        overlay.onclick = function () { document.body.removeChild(overlay); };
        document.body.appendChild(overlay);
      };

      header.appendChild(titleContainer);

      var controls = document.createElement('div');
      controls.className = 'calendar-controls d-flex align-items-center gap-2';

      var btnPrev = document.createElement('button');
      btnPrev.className = 'btn btn-outline d-flex align-items-center justify-content-center p-0 rounded-circle';
      btnPrev.style.width = '36px';
      btnPrev.style.height = '36px';
      btnPrev.title = 'Tháng trước';
      btnPrev.innerHTML = '<span class="material-symbols-outlined fs-5">chevron_left</span>';
      btnPrev.onclick = function () {
        var m = month - 1;
        var y = year;
        if (m < 0) { m = 11; y--; }
        currentYear = y; currentMonth = m;
        if (typeof config.onChangeMonth === 'function') config.onChangeMonth(y, m);
        else render(y, m);
      };

      var btnToday = document.createElement('button');
      btnToday.className = 'btn btn-outline px-3 fw-bold rounded-pill d-inline-flex align-items-center justify-content-center';
      btnToday.style.height = '36px';
      btnToday.innerText = 'Hôm nay';
      btnToday.onclick = function () {
        var y = today.getFullYear();
        var m = today.getMonth();
        currentYear = y; currentMonth = m;
        if (typeof config.onChangeMonth === 'function') config.onChangeMonth(y, m);
        else render(y, m);
      };

      var btnNext = document.createElement('button');
      btnNext.className = 'btn btn-outline d-flex align-items-center justify-content-center p-0 rounded-circle';
      btnNext.style.width = '36px';
      btnNext.style.height = '36px';
      btnNext.title = 'Tháng sau';
      btnNext.innerHTML = '<span class="material-symbols-outlined fs-5">chevron_right</span>';
      btnNext.onclick = function () {
        var m = month + 1;
        var y = year;
        if (m > 11) { m = 0; y++; }
        currentYear = y; currentMonth = m;
        if (typeof config.onChangeMonth === 'function') config.onChangeMonth(y, m);
        else render(y, m);
      };

      controls.appendChild(btnPrev);
      controls.appendChild(btnToday);
      controls.appendChild(btnNext);

      header.appendChild(controls);
      wrapper.appendChild(header);

      var daysHeader = document.createElement('div');
      daysHeader.className = 'calendar-days-header';

      ['TH 2', 'TH 3', 'TH 4', 'TH 5', 'TH 6', 'TH 7', 'CN'].forEach(function (d) {
        var dDiv = document.createElement('div');
        dDiv.className = 'calendar-day-header';
        if (d === 'CN') dDiv.classList.add('sunday');
        dDiv.innerText = d;
        daysHeader.appendChild(dDiv);
      });
      wrapper.appendChild(daysHeader);

      // Days Header -> Days Grid
      var grid = document.createElement('div');
      grid.className = 'calendar-grid';

      // Date calculations
      var jsFirstDay = new Date(year, month, 1).getDay();
      var firstDay = jsFirstDay === 0 ? 6 : jsFirstDay - 1;
      var daysInMonth = new Date(year, month + 1, 0).getDate();
      var daysInPrevMonth = new Date(year, month, 0).getDate();

      var cellIndex = 0;

      // Helper function to generate Lunar date HTML using native Intl API
      function _getLunarDateHTML(y, m, d) {
        try {
          var formatter = new Intl.DateTimeFormat('vi-VN-u-ca-chinese', { day: 'numeric', month: 'numeric' });
          var parts = formatter.formatToParts(new Date(y, m, d));
          var lDay = '', lMonth = '';
          parts.forEach(function (p) {
            if (p.type === 'day') lDay = p.value;
            if (p.type === 'month') lMonth = p.value;
          });
          var str = formatter.format(new Date(y, m, d));
          var isLeap = str.toLowerCase().indexOf('nhuận') !== -1 || str.toLowerCase().indexOf('bis') !== -1;
          var displayStr = lDay;
          if (lDay === '1' || d === 1) {
            displayStr = lDay + '/' + lMonth + (isLeap ? ' Nhuận' : '');
          }
          var isHighlight = (lDay === '1' || lDay === '15');
          var highlightClass = isHighlight ? ' highlight' : '';
          return '<span class="lunar-date' + highlightClass + '" title="Ngày âm lịch">' + displayStr + '</span>';
        } catch (e) {
          return '';
        }
      }

      // ô trước ngày 1 (ngày tháng trước)
      for (let i = 0; i < firstDay; i++) {
        var empty = document.createElement('div');
        empty.className = 'calendar-day empty-day';
        if (isFirstRender) {
          empty.classList.add('animate-pop');
          empty.style.animationDelay = (cellIndex * 0.015) + 's';
        }

        var dNum = document.createElement('div');
        dNum.className = 'calendar-day-number';
        var prevDateNum = daysInPrevMonth - firstDay + i + 1;
        var prevM = month - 1;
        var prevY = year;
        if (prevM < 0) { prevM = 11; prevY--; }
        dNum.innerHTML = '<span class="solar-date">' + prevDateNum + '</span>' + _getLunarDateHTML(prevY, prevM, prevDateNum);
        empty.appendChild(dNum);

        if (config.selectedDate) {
          var selDateObj = typeof config.selectedDate === 'string' ? new Date(config.selectedDate) : config.selectedDate;
          if (selDateObj && !isNaN(selDateObj.getTime())) {
            if (selDateObj.getFullYear() === prevY && selDateObj.getMonth() === prevM && selDateObj.getDate() === prevDateNum) {
              empty.classList.add('selected');
            }
          }
        }

        empty.onclick = (function (d, pY, pM) {
          return function () {
            if (typeof config.onSelect === 'function') {
              var dateStr = pY + '-' + (pM + 1).toString().padStart(2, '0') + '-' + d.toString().padStart(2, '0');
              config.onSelect(dateStr, null);
            }
          };
        })(prevDateNum, prevY, prevM);

        grid.appendChild(empty);
        cellIndex++;
      }

      // Các ngày trong tháng
      for (let i = 1; i <= daysInMonth; i++) {
        var dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        if (isFirstRender) {
          dayCell.classList.add('animate-pop');
          dayCell.style.animationDelay = (cellIndex * 0.015) + 's';
        }

        if (today.getFullYear() === year && today.getMonth() === month && today.getDate() === i) {
          dayCell.classList.add('today');
        }

        if (config.selectedDate) {
          var selDateObj = typeof config.selectedDate === 'string' ? new Date(config.selectedDate) : config.selectedDate;
          if (selDateObj && !isNaN(selDateObj.getTime())) {
            if (selDateObj.getFullYear() === year && selDateObj.getMonth() === month && selDateObj.getDate() === i) {
              dayCell.classList.add('selected');
            }
          }
        }

        var dayNum = document.createElement('div');
        dayNum.className = 'calendar-day-number';
        dayNum.innerHTML = '<span class="solar-date">' + i + '</span>' + _getLunarDateHTML(year, month, i);
        dayCell.appendChild(dayNum);

        // Thêm events
        var evtDiv = document.createElement('div');
        evtDiv.className = 'calendar-events';

        var dayEvents = config.events ? config.events[i] : null;

        if (dayEvents && dayEvents.length > 0) {
          var cocCount = 0;
          var hdCount = 0;

          dayEvents.forEach(function (e) {
            if (e.rawData) {
              var lp = e.rawData.LoaiPhieu !== undefined ? e.rawData.LoaiPhieu : e.rawData.loaiPhieu;
              if (lp === 1) cocCount++;
              else hdCount++;
            }
          });

          // Render Desktop Summary Labels với chấm tròn chỉ thị
          if (cocCount > 0) {
            var cocLabel = document.createElement('div');
            cocLabel.className = 'calendar-event-label success';
            cocLabel.title = 'Có ' + cocCount + ' Biên nhận cọc chỗ';
            cocLabel.innerHTML = '<span class="dot"></span><span>' + cocCount + ' Cọc Chỗ</span>';
            evtDiv.appendChild(cocLabel);
          }
          if (hdCount > 0) {
            var hdLabel = document.createElement('div');
            hdLabel.className = 'calendar-event-label primary';
            hdLabel.title = 'Có ' + hdCount + ' Hợp đồng';
            hdLabel.innerHTML = '<span class="dot"></span><span>' + hdCount + ' Hợp Đồng</span>';
            evtDiv.appendChild(hdLabel);
          }

          // Render Mobile Dots
          if (cocCount > 0) {
            var dotCoc = document.createElement('div');
            dotCoc.className = 'calendar-event-dot success';
            dayCell.appendChild(dotCoc);
          }
          if (hdCount > 0) {
            var dotHd = document.createElement('div');
            dotHd.className = 'calendar-event-dot primary';
            dayCell.appendChild(dotHd);
          }
        }
        dayCell.appendChild(evtDiv);

        dayCell.onclick = (function (d, evts) {
          return function () {
            if (typeof config.onSelect === 'function') {
              var dateStr = year + '-' + (month + 1).toString().padStart(2, '0') + '-' + d.toString().padStart(2, '0');
              config.onSelect(dateStr, evts);
            }
          };
        })(i, dayEvents);

        grid.appendChild(dayCell);
        cellIndex++;
      }

      // ô sau ngày cuối cùng (ngày tháng sau)
      var totalCells = firstDay + daysInMonth;
      var remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
      for (let i = 0; i < remainingCells; i++) {
        var emptyEnd = document.createElement('div');
        emptyEnd.className = 'calendar-day empty-day';
        if (isFirstRender) {
          emptyEnd.classList.add('animate-pop');
          emptyEnd.style.animationDelay = (cellIndex * 0.015) + 's';
        }

        var dNumEnd = document.createElement('div');
        dNumEnd.className = 'calendar-day-number';
        var nextDateNum = i + 1;
        var nextM = month + 1;
        var nextY = year;
        if (nextM > 11) { nextM = 0; nextY++; }
        dNumEnd.innerHTML = '<span class="solar-date">' + nextDateNum + '</span>' + _getLunarDateHTML(nextY, nextM, nextDateNum);
        emptyEnd.appendChild(dNumEnd);

        if (config.selectedDate) {
          var selDateObj = typeof config.selectedDate === 'string' ? new Date(config.selectedDate) : config.selectedDate;
          if (selDateObj && !isNaN(selDateObj.getTime())) {
            if (selDateObj.getFullYear() === nextY && selDateObj.getMonth() === nextM && selDateObj.getDate() === nextDateNum) {
              emptyEnd.classList.add('selected');
            }
          }
        }

        emptyEnd.onclick = (function (d, nY, nM) {
          return function () {
            if (typeof config.onSelect === 'function') {
              var dateStr = nY + '-' + (nM + 1).toString().padStart(2, '0') + '-' + d.toString().padStart(2, '0');
              config.onSelect(dateStr, null);
            }
          };
        })(nextDateNum, nextY, nextM);

        grid.appendChild(emptyEnd);
        cellIndex++;
      }

      wrapper.appendChild(grid);
      isFirstRender = false;
    }

    render(currentYear, currentMonth);

    wrapper.updateEvents = function (newEvents) {
      config.events = newEvents;
      render(currentYear, currentMonth);
    };

    wrapper.setSelectedDate = function (newDate) {
      config.selectedDate = newDate;
      if (newDate) {
        var d = typeof newDate === 'string' ? new Date(newDate) : newDate;
        if (d && !isNaN(d.getTime())) {
          currentYear = d.getFullYear();
          currentMonth = d.getMonth();
        }
      }
      render(currentYear, currentMonth);
    };

    return wrapper;
  }

  return {
    create: create
  };
})();


/* --- AppGrid.js --- */
/**
 * AppGrid.js - AG Grid Helper for Web-Order-Santino
 */
var AppGrid = {
  getThemeClass: function () {
    var isDark = document.documentElement.classList.contains('dark-theme') ||
      localStorage.getItem('santino_theme') === 'dark';
    return isDark ? 'ag-theme-quartz-dark' : 'ag-theme-quartz';
  },

  create: function (container, customOptions) {
    var self = this;

    // Set class ban dau cho container
    container.className = self.getThemeClass();

    // Chen style de hien thi duong ngan cach cot (vertical borders)
    if (!document.getElementById('ag-grid-borders-style')) {
      var style = document.createElement('style');
      style.id = 'ag-grid-borders-style';
      style.innerHTML = 
        '.ag-theme-quartz .ag-cell, .ag-theme-quartz-dark .ag-cell, ' +
        '.ag-theme-quartz .ag-header-cell, .ag-theme-quartz-dark .ag-header-cell { ' +
        '  border-right: 1px solid var(--ag-border-color, var(--color-border, #e2e8f0)) !important; ' +
        '}';
      document.head.appendChild(style);
    }

    var defaultOptions = {
      pagination: true,
      rowSelection: 'single',
      rowMultiSelectWithClick: true,
      enableCellTextSelection: true,
      ensureDomOrder: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20, 50, 100],
      defaultColDef: {
        sortable: true,
        filter: true,
        resizable: true,
        floatingFilter: true,
        minWidth: 100
      },
      autoSizeStrategy: {
        type: 'fitCellContents'
      },
      localeText: {
        page: 'Trang',
        more: 'Thêm',
        to: 'đến',
        of: 'trong số',
        next: 'Tiếp',
        last: 'Cuối',
        first: 'Đầu',
        previous: 'Trước',
        loadingOoo: 'Đang tải...',
        noRowsToShow: 'Không có dữ liệu',
        filterOoo: 'Lọc...',
        applyFilter: 'Áp dụng...',
        equals: 'Bằng',
        notEqual: 'Khác',
        lessThan: 'Nhỏ hơn',
        lessThanOrEqual: 'Nhỏ hơn hoặc bằng',
        greaterThan: 'Lớn hơn',
        greaterThanOrEqual: 'Lớn hơn hoặc bằng',
        inRange: 'Trong khoảng',
        contains: 'Chứa',
        notContains: 'Không chứa',
        startsWith: 'Bắt đầu bằng',
        endsWith: 'Kết thúc bằng',
        blank: 'Trống',
        notBlank: 'Không trống',
        searchOoo: 'Tìm kiếm...',
        selectAll: 'Chọn tất cả',
        searchAndSelectAll: 'Tìm và chọn tất cả',
      }
    };

    // Tron option mac dinh voi option custom
    var mergedOptions = Object.assign({}, defaultOptions, customOptions);

    // Ghi de defaultColDef sau khi tron de dam bao an toan
    if (customOptions && customOptions.defaultColDef) {
      mergedOptions.defaultColDef = Object.assign({}, defaultOptions.defaultColDef, customOptions.defaultColDef);
    }

    // Load saved hidden columns state from localStorage
    var storageKey = 'grid_cols_hide_' + (container.id || 'default');
    var savedHidden = [];
    try {
      savedHidden = JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch (e) { }

    if (savedHidden && savedHidden.length > 0 && mergedOptions.columnDefs) {
      mergedOptions.columnDefs.forEach(function (col) {
        var colId = col.field || col.colId;
        if (colId && savedHidden.includes(colId)) {
          col.hide = true;
        }
      });
    }

    // Load saved filter state from localStorage
    var filterStorageKey = 'grid_filter_' + (container.id || 'default');
    var isFilterVisible = localStorage.getItem(filterStorageKey) === 'true'; // default to false

    if (!isFilterVisible) {
      if (mergedOptions.defaultColDef) {
        mergedOptions.defaultColDef.floatingFilter = false;
      }
      if (mergedOptions.columnDefs) {
        mergedOptions.columnDefs.forEach(function (col) {
          col.floatingFilter = false;
        });
      }
    }

    // Toggle row selection on click (click again to deselect) + custom double-tap for mobile
    var lastSelectedNode = null;
    var lastTapTime = 0;
    var lastTapNode = null;
    var originalOnRowClicked = mergedOptions.onRowClicked;

    mergedOptions.onRowClicked = function (event) {
      var node = event.node;
      var currentTime = Date.now();
      var tapGap = currentTime - lastTapTime;

      // Kich hoat double tap (duoi 300ms tren cung mot dong) de ho tro man hinh dien thoai/tablet
      if (lastTapNode === node && tapGap < 300) {
        if (typeof mergedOptions.onRowDoubleClicked === 'function') {
          mergedOptions.onRowDoubleClicked(event);
        }
        lastTapTime = 0;
        lastTapNode = null;
        return;
      }

      lastTapTime = currentTime;
      lastTapNode = node;

      if (lastSelectedNode === node) {
        node.setSelected(false);
        lastSelectedNode = null;
      } else {
        lastSelectedNode = node.isSelected() ? node : null;
      }
      if (typeof originalOnRowClicked === 'function') {
        originalOnRowClicked(event);
      }
    };

    // Responsive auto-sizing columns strategy
    function adjustColumnWidths(api) {
      if (!api) return;
      api.autoSizeAllColumns(false);

      var isMobile = window.innerWidth < 768;
      if (isMobile) {
        var cols = api.getColumnState();
        var totalColWidth = 0;
        cols.forEach(function (colState) {
          if (!colState.hide) {
            var col = api.getColumn(colState.colId);
            if (col) {
              totalColWidth += col.getActualWidth();
            }
          }
        });

        var containerWidth = container.offsetWidth;
        if (totalColWidth > 0 && containerWidth > 0 && totalColWidth < containerWidth) {
          api.sizeColumnsToFit();
        }
      }
    }

    var originalOnGridSizeChanged = mergedOptions.onGridSizeChanged;
    mergedOptions.onGridSizeChanged = function (event) {
      adjustColumnWidths(event.api);
      if (typeof originalOnGridSizeChanged === 'function') {
        originalOnGridSizeChanged(event);
      }
    };

    var originalOnFirstDataRendered = mergedOptions.onFirstDataRendered;
    mergedOptions.onFirstDataRendered = function (event) {
      adjustColumnWidths(event.api);
      if (typeof originalOnFirstDataRendered === 'function') {
        originalOnFirstDataRendered(event);
      }
    };

    var originalOnModelUpdated = mergedOptions.onModelUpdated;
    mergedOptions.onModelUpdated = function (event) {
      adjustColumnWidths(event.api);
      if (typeof originalOnModelUpdated === 'function') {
        originalOnModelUpdated(event);
      }
    };

    var gridApi = agGrid.createGrid(container, mergedOptions);

    // Create column selector floating button if it doesn't exist
    if (!container.querySelector('.grid-col-settings-btn')) {
      var origPos = window.getComputedStyle(container).position;
      if (origPos === 'static') {
        container.style.position = 'relative';
      }

      var btn = document.createElement('button');
      btn.className = 'grid-col-settings-btn';
      btn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 16px; display: block;">view_column</span>';
      btn.title = 'Cấu hình cột & Bộ lọc';
      btn.style.position = 'absolute';
      btn.style.right = '6px';
      btn.style.top = '6px';
      btn.style.zIndex = '5';
      btn.style.width = '26px';
      btn.style.height = '26px';
      btn.style.borderRadius = '4px';
      btn.style.border = '1px solid var(--border, var(--color-border, #cbd5e1))';
      btn.style.background = 'var(--surface, var(--color-surface, #ffffff))';
      btn.style.color = 'var(--text-secondary, var(--color-text-secondary, #475569))';
      btn.style.cursor = 'pointer';
      btn.style.display = 'flex';
      btn.style.alignItems = 'center';
      btn.style.justifyContent = 'center';
      btn.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
      btn.style.transition = 'all 0.15s ease';

      btn.onmouseover = function () {
        btn.style.background = 'var(--bg, var(--color-background, #f1f5f9))';
      };
      btn.onmouseout = function () {
        btn.style.background = 'var(--surface, var(--color-surface, #ffffff))';
      };

      var popover = document.createElement('div');
      popover.className = 'grid-col-popover';
      popover.style.position = 'absolute';
      popover.style.right = '6px';
      popover.style.top = '36px';
      popover.style.zIndex = '1000';
      popover.style.background = 'var(--surface, var(--color-surface, #ffffff))';
      popover.style.border = '1px solid var(--border, var(--color-border, #cbd5e1))';
      popover.style.borderRadius = '6px';
      popover.style.padding = '10px';
      popover.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)';
      popover.style.maxHeight = '240px';
      popover.style.overflowY = 'auto';
      popover.style.display = 'none';
      popover.style.flexDirection = 'column';
      popover.style.gap = '6px';
      popover.style.minWidth = '180px';

      container.appendChild(btn);
      container.appendChild(popover);

      function updatePopover() {
        popover.innerHTML = '';

        // Toggle Filter row at top of popover
        var filterLabel = document.createElement('label');
        filterLabel.style.display = 'flex';
        filterLabel.style.alignItems = 'center';
        filterLabel.style.gap = '8px';
        filterLabel.style.cursor = 'pointer';
        filterLabel.style.fontSize = '12px';
        filterLabel.style.fontWeight = '700';
        filterLabel.style.color = 'var(--text, var(--color-text, #1e293b))';
        filterLabel.style.borderBottom = '1px solid var(--border, var(--color-border, #cbd5e1))';
        filterLabel.style.paddingBottom = '6px';
        filterLabel.style.marginBottom = '6px';
        filterLabel.style.userSelect = 'none';

        var filterCheckbox = document.createElement('input');
        filterCheckbox.type = 'checkbox';
        filterCheckbox.style.cursor = 'pointer';
        filterCheckbox.checked = isFilterVisible;

        filterCheckbox.onchange = function () {
          var showFilter = filterCheckbox.checked;
          localStorage.setItem(filterStorageKey, showFilter ? 'true' : 'false');
          isFilterVisible = showFilter;

          var currentDefs = gridApi.getColumnDefs();
          var updatedDefs = currentDefs.map(function (col) {
            col.floatingFilter = showFilter;
            return col;
          });
          gridApi.setGridOption('columnDefs', updatedDefs);
        };

        filterLabel.appendChild(filterCheckbox);
        var filterSpan = document.createElement('span');
        filterSpan.innerText = 'Hiện ô tìm kiếm (Filter)';
        filterLabel.appendChild(filterSpan);
        popover.appendChild(filterLabel);

        // Column selection title
        var title = document.createElement('div');
        title.innerText = 'Ẩn/Hiện cột';
        title.style.fontWeight = '700';
        title.style.marginBottom = '6px';
        title.style.fontSize = '11px';
        title.style.textTransform = 'uppercase';
        title.style.color = 'var(--text-secondary, var(--color-text-secondary, #64748b))';
        popover.appendChild(title);

        var colDefs = mergedOptions.columnDefs || [];
        colDefs.forEach(function (col) {
          var colId = col.field || col.colId;
          var header = col.headerName;
          if (!colId || !header) return;

          var label = document.createElement('label');
          label.style.display = 'flex';
          label.style.alignItems = 'center';
          label.style.gap = '8px';
          label.style.cursor = 'pointer';
          label.style.fontSize = '12px';
          label.style.color = 'var(--text, var(--color-text, #1e293b))';
          label.style.userSelect = 'none';

          var checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.style.cursor = 'pointer';

          var isVisible = true;
          var colState = gridApi.getColumnState().find(function (s) { return s.colId === colId; });
          if (colState) {
            isVisible = !colState.hide;
          }
          checkbox.checked = isVisible;

          checkbox.onchange = function () {
            var visible = checkbox.checked;
            gridApi.setColumnVisible(colId, visible);

            var currentHidden = [];
            var states = gridApi.getColumnState();
            states.forEach(function (s) {
              if (s.hide) {
                var foundDef = colDefs.find(function (d) { return (d.field || d.colId) === s.colId; });
                if (foundDef && foundDef.headerName) {
                  currentHidden.push(s.colId);
                }
              }
            });
            localStorage.setItem(storageKey, JSON.stringify(currentHidden));
          };

          label.appendChild(checkbox);
          var txtSpan = document.createElement('span');
          txtSpan.innerText = header;
          label.appendChild(txtSpan);
          popover.appendChild(label);
        });
      }

      btn.onclick = function (e) {
        e.stopPropagation();
        var isHidden = popover.style.display === 'none';
        if (isHidden) {
          updatePopover();
          popover.style.display = 'flex';
        } else {
          popover.style.display = 'none';
        }
      };

      document.addEventListener('click', function (e) {
        if (!popover.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
          popover.style.display = 'none';
        }
      });
    }

    // Lang nghe thay doi class cua html de doi theme
    var observer = new MutationObserver(function () {
      var newTheme = self.getThemeClass();
      if (container.className !== newTheme) {
        container.className = newTheme;
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Luu lai ref de destroy neu can
    gridApi._observer = observer;

    return gridApi;
  }
};


/* --- ProductWebSync.js --- */
/**
 * Product Web Sync Component
 */
var UIProductWebSync = (function () {
  /**
   * Tạo component thanh đồng bộ sản phẩm qua Web đặt hàng
   * @param {Object} options - { onSync, onUnsync }
   */
  function create(options) {
    options = options || {};

    var container = document.createElement('div');
    container.className = 'product-web-sync-toolbar';
    container.style.display = 'flex';
    container.style.gap = '12px';
    container.style.alignItems = 'center';

    var btnSync = document.createElement('button');
    btnSync.className = 'btn';
    btnSync.style.cssText = 'white-space: nowrap; height: 42px; background: #059669; color: white; display: flex; align-items: center; gap: 4px; border: none; cursor: pointer;';
    btnSync.innerHTML = '<span class="material-symbols-outlined" style="font-size: calc(16px * var(--text-scale, 1)); vertical-align: middle;">public</span><span>Lấy sang Web</span>';
    btnSync.addEventListener('click', function () {
      if (typeof options.onSync === 'function') {
        options.onSync();
      }
    });

    var btnUnsync = document.createElement('button');
    btnUnsync.className = 'btn';
    btnUnsync.style.cssText = 'white-space: nowrap; height: 42px; background: #dc2626; color: white; display: flex; align-items: center; gap: 4px; border: none; cursor: pointer;';
    btnUnsync.innerHTML = '<span class="material-symbols-outlined" style="font-size: calc(16px * var(--text-scale, 1)); vertical-align: middle;">public_off</span><span>Hủy lấy sang Web</span>';
    btnUnsync.addEventListener('click', function () {
      if (typeof options.onUnsync === 'function') {
        options.onUnsync();
      }
    });

    container.appendChild(btnSync);
    container.appendChild(btnUnsync);

    return container;
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
    { path: '/order', script: 'src/pages/order/order.js', pageFn: 'OrderPage', title: 'nav.order' },
    { path: '/orders', script: 'src/pages/orders/orders.js', pageFn: 'OrdersPage', title: 'nav.orders' },
    { path: '/order-detail', script: 'src/pages/order-detail/order-detail.js', pageFn: 'OrderDetailPage', title: 'nav.order_detail' },
    { path: '/settings', script: 'src/pages/settings/settings.js', pageFn: 'SettingsPage', title: 'nav.settings' },
    { path: '/permissions', script: 'src/pages/permissions/permissions.js', pageFn: 'PermissionsPage', title: 'nav.permissions' },
    { path: '/menus', script: 'src/pages/menus/menus.js', pageFn: 'MenusPage', title: 'nav.menus' },
    { path: '/customers', script: 'src/pages/customers/customers.js', pageFn: 'CustomersPage', title: 'nav.customers' },
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
      el.src = src + '?v=' + Date.now();
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
          return mod.render($el, route);
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

  function addDynamicRoutes(menus) {
    if (!menus || !Array.isArray(menus)) return;

    var currentHash = window.location.hash.replace('#', '').split('?')[0] || '/order';
    var needsReload = false;

    menus.forEach(function (m) {
      if (String(m.isDisable) === '1' || m.isDisable === true) return;

      var rawUrl = m.URLPara || m.urlPara || '';
      if (!rawUrl) {
        if (m.FormKey && m.FormKey !== 'List' && m.FormKey !== 'Null') {
          rawUrl = '/' + m.FormKey.toLowerCase();
        }
      }
      if (!rawUrl) return;

      var url = rawUrl.trim().replace(/^#\/?/, '').replace(/^\//, '');
      if (url === '') return;

      var path = '/' + url;

      var existingRoute = ROUTES.find(function (r) { return r.path === path; });
      if (existingRoute) {
        return;
      }

      var route = {
        path: path,
        script: 'src/pages/dynamic/dynamic.js',
        pageFn: 'DynamicPage',
        title: m.VN || m.MenuName || m.FormName || '',
        formName: m.FormName || m.formName || ''
      };

      ROUTES.push(route);
      _routeMap[path] = route;

      if (path === currentHash) {
        needsReload = true;
      }
    });

    if (needsReload) {
      setTimeout(function () {
        _handle();
      }, 50);
    }
  }

  // ── Init ──────────────────────────────────────────────────────────────
  function init() {
    window.addEventListener('hashchange', _handle);
    if (!window.location.hash) window.location.hash = '#/order';
    else _handle();
  }

  // ── Public navigate helper ────────────────────────────────────────────
  function go(path) { window.location.hash = '#' + path; }

  return { init: init, go: go, fetchTemplate: fetchTemplate, ROUTES: ROUTES, addDynamicRoutes: addDynamicRoutes };
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
  document.documentElement.style.setProperty('--text-scale', (parseInt(zoom) / 100).toString());

  var font = localStorage.getItem('santino_font');
  if (font) document.documentElement.style.setProperty('--font', '"' + font + '", sans-serif');

  var color = localStorage.getItem('santino_color');
  if (color) {
    document.documentElement.style.setProperty('--accent', color);
    var colorFg = localStorage.getItem('santino_color_fg');
    if (colorFg) document.documentElement.style.setProperty('--accent-fg', colorFg);
  }
  Router.init();

  // 3. Khởi tạo Load Menu động
  if (typeof MenuService !== 'undefined') {
    MenuService.getChildren('').then(function (items) {
      if (Array.isArray(items) && items.length > 0) {
        if (window.Router && typeof Router.addDynamicRoutes === 'function') {
          Router.addDynamicRoutes(items);
        }
        var html = '';
        items.forEach(function (item) {
          // Bỏ qua các menu bị ẩn (isDisable = 1)
          if (String(item.isDisable) === '1' || item.isDisable === true) return;

          // Map URLPara hoặc FormKey sang route
          var route = item.URLPara ? item.URLPara : '';
          if (!route) {
            if (item.FormName === 'WEB_OrderDetailFrm' || item.FormKey === 'List') route = '/orders';
            else if (item.FormName === 'WEB_OrderFrm' || item.FormKey === 'Null') route = '/order';
            else if (item.FormKey && item.FormKey !== '') route = '/' + item.FormKey.toLowerCase();
          }
          if (!route || route === '/' || route === '/null') return;
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
          sidebarLinks.querySelectorAll('.nav-item').forEach(function (el) {
            el.addEventListener('click', function () {
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
  var t = document.getElementById('toast');
  var m = document.getElementById('toast-msg');
  if (!t || !m) return;

  if (!msg) {
    t.classList.remove('show');
    clearTimeout(t._timer);
    return;
  }

  if (ok === undefined) ok = true;
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
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    if (dict[key]) {
      // Dùng innerHTML hoặc textContent, tuỳ yêu cầu. Dùng textContent an toàn hơn.
      el.textContent = dict[key];
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
    var key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });
}

// Chạy dịch ngôn ngữ khi tải trang và sau khi render xong Router
document.addEventListener('DOMContentLoaded', applyLanguage);



