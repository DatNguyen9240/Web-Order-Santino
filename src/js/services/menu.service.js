/**
 * Menu Service
 * Quản lý các lệnh gọi API liên quan đến Menu
 */
const MenuService = (() => {
  async function getChildren(parentID) {
    if (!API_CONFIG || !API_CONFIG.BASE_URL) return [];
    try {
      const queryObj = { Parent: parentID };
      const params = { q: JSON.stringify(queryObj) };
      const res = await Http.get(API_CONFIG.ENDPOINTS.MENU.CHILDREN, params);
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
