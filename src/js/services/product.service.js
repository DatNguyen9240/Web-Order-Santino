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
      // Truyền trực tiếp params, không bọc JSON
      const params = { SearchTerm: searchTerm };
      const res = await Http.get(API_CONFIG.ENDPOINTS.PRODUCTS.LIST, params);

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
