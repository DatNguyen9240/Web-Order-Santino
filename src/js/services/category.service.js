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

      // Search requests không cache — dùng noCache param để URL luôn unique
      const params = { q: JSON.stringify(queryObj) };
      if (search && search.trim()) params._t = Date.now();

      const res = await Http.get(API_CONFIG.ENDPOINTS.CATEGORIES.LIST, params);
      const data = res.records || res;
      if (!Array.isArray(data)) return [];

      return data.map(item => ({
        id:          item.id           || item.Id           || '',
        name:        item.name         || item.Name         || '',
        address:     item.address      || '',
        phone:       item.phone        || '',
        department:  item.department   || '',
        due_days:    item.due_days     != null ? item.due_days : null,
        is_default:  item.is_default   || false
      }));
    } catch (err) {
      console.warn(`[CategoryService] Lỗi lấy danh mục ${loai}:`, err);
      return [];
    }
  }

  return { getCategories };
})();
