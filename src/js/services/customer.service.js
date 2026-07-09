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
