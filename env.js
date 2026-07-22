/**
 * CẤU HÌNH HỆ THỐNG
 * Chỉnh sửa file này khi cần thay đổi URL server (không cần build lại)
 */
// Chỉ môi trường phát triển local mới gọi thẳng backend. Mọi domain triển
// khai (HTTP hoặc HTTPS, kể cả custom domain) đều đi qua proxy cùng origin
// `/api` để trình duyệt không phát sinh request CORS/preflight.
const isLocalDevelopment = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const ENV_VARS = {
    API_BASE: isLocalDevelopment ? 'http://stntest.bms79.com/api' : '/api',
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
