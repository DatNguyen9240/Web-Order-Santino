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
      // Truyền trực tiếp params, không bọc JSON
      const params = { Loai: loai };
      if (search && search.trim()) {
        params.TimKiem = search.trim();
        params._t = Date.now(); // Tránh cache khi search
      }


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
