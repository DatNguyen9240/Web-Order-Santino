/**
 * Menu Service
 * Quản lý các lệnh gọi API liên quan đến Menu
 */
const MenuService = (() => {
  async function getChildren(parentID) {
    if (!API_CONFIG || !API_CONFIG.BASE_URL) return [];
    try {
      var user = JSON.parse(localStorage.getItem('santino_user') || '{}');
      var role = user.role || user.Group || '';
      var queryObj = { Parent: parentID, UserRole: role };
      var params = { q: JSON.stringify(queryObj) };
      var res = await Http.get(API_CONFIG.ENDPOINTS.MENU.CHILDREN, params);
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
