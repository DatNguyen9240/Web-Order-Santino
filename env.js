/**
 * CẤU HÌNH HỆ THỐNG
 * Chỉnh sửa file này khi cần thay đổi URL server (không cần build lại)
 */
const isVercel = window.location.hostname.includes('vercel.app');
const ENV_VARS = {
    // Nếu chạy trên Vercel, dùng Proxy (rewrites) để tránh lỗi HTTPS gọi HTTP (Mixed Content).
    // Nếu chạy ở localhost, dùng trực tiếp IP/Domain HTTP.
    API_BASE: isVercel ? '/api' : 'http://stnt.bms79.com/api',
};

window.API_CONFIG = {
    BASE_URL: ENV_VARS.API_BASE,

    ENDPOINTS: {
        AUTH: {
            LOGIN: '/login',
            USER_INFO: '/API_UserInfo',
        },
        PRODUCTS: {
            // Khớp với Stored Procedure: API_LaySanPham
            LIST: '/API_LaySanPham',
        },
        SIZES: {
            LIST: '/API_LayBangSize',
        },
        CATEGORIES: {
            LIST: '/API_DanhMuc',
        },
        ORDERS: {
            LIST: '/API_LayDonHang',
            CREATE: '/API_TaoDonHang',
            DELETE: '/API_XoaDonHang'
        },
        CUSTOMERS: {
            SAVE: '/API_KhachHang_Luu',
            LIST: '/API_LayDanhSachKhachHang',
            DELETE: '/API_KhachHang_Xoa'
        },
        USERS: {
            SAVE: '/API_NguoiDung_Luu',
            CHANGE_PW: '/changepassword',
            RESET_PW: '/resetpassword'
        },
        MENU: {
            CHILDREN: '/API_GetMenuChildren'
        },
        PERMISSIONS: {
            SYNC: '/API_DongBoQuyenTruyCap',
            GET_ALL_MENUS_FOR_GROUP: '/API_LayQuyenNhomDayDu',
            SAVE_GROUP_PERMISSIONS: '/API_LuuQuyenCuaNhom',
            GET_GROUP_LIST: '/API_LayDanhSachNhom'
        },
        MENUS: {
            GET_ALL: '/API_LayDanhSachMenuTatCa',
            SAVE: '/API_LuuMenu',
            DELETE: '/API_XoaMenu',
            UPDATE_ORDER: '/API_LuuThuTuMenu'
        }
    }
};

// Expose globally
var API_CONFIG = window.API_CONFIG;

// Đóng băng để code không vô tình ghi đè
Object.freeze(window.API_CONFIG);
Object.freeze(window.API_CONFIG.ENDPOINTS);
