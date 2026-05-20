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
