/**
 * SANTINO B2B — CẤU HÌNH HỆ THỐNG
 * Chỉnh sửa file này khi cần thay đổi URL server (không cần build lại)
 */
const ENV_VARS = {
    // Tạm thời để rỗng hoặc trỏ về localhost nếu đang dev
    API_BASE: 'http://stntest.bms79.com/api',
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
        ORDERS: {
            LIST: '/API_LayDonHang',
            CREATE: '/API_TaoDonHang',
        }
    }
};

// Expose globally
var API_CONFIG = window.API_CONFIG;

// Đóng băng để code không vô tình ghi đè
Object.freeze(window.API_CONFIG);
Object.freeze(window.API_CONFIG.ENDPOINTS);
