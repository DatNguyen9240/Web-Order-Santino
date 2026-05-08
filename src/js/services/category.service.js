/**
 * Category Service
 * Xử lý gọi API Danh mục vạn năng (API_DanhMuc)
 */
const CategoryService = (() => {
  /**
   * Lấy dữ liệu danh mục theo loại
   * @param {string} loai - Loại danh mục (Branch, Employee, PaymentType, PaymentTerm)
   */
  async function getCategories(loai = '') {
    if (!API_CONFIG.BASE_URL) {
      return [];
    }

    try {
      // Đổi sang pattern ?q={"Loai":"..."} giống ProductService
      const queryObj = { Loai: loai };
      const res = await Http.get(API_CONFIG.ENDPOINTS.CATEGORIES.LIST, { q: JSON.stringify(queryObj) });
      
      const data = res.records || res;
      if (!Array.isArray(data)) return [];

      // Chuẩn hóa dữ liệu trả về để luôn có 'id' và 'name'
      return data.map(item => ({
        id: item.id || item.Id || item.Loai || '',
        name: item.name || item.Name || item.TenLoai || item.BranchName || item.EmployeeName || item.PaymentTypeName || item.PaymentTermName || ''
      }));
    } catch (error) {
      console.warn(`[CategoryService] Lỗi gọi API lấy danh mục ${loai}:`, error);
      return [];
    }
  }

  return { getCategories };
})();
