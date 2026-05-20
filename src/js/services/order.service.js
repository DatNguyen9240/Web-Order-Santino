/**
 * Order Service
 * Xử lý gọi API liên quan đến Đơn hàng
 */
const OrderService = (() => {
  /**
   * Lấy danh sách đơn hàng
   */
  async function getOrders(params = {}) {
    if (!API_CONFIG.BASE_URL) {
      return [];
    }
    try {
      const res = await Http.get(API_CONFIG.ENDPOINTS.ORDERS.LIST, params);
      return res.records || res;
    } catch (e) {
      console.warn('[OrderService] Lỗi gọi API lấy đơn hàng:', e);
      return [];
    }
  }

  /**
   * Tạo đơn hàng mới
   */
  async function createOrder(orderData) {
    if (!API_CONFIG.BASE_URL) throw new Error('API_BASE chưa cấu hình');
    const user = JSON.parse(localStorage.getItem('santino_user') || '{}');
    orderData.UserRole = user.role || user.Group || '';
    orderData.UserEmployeeID = user.EmployeeID || '';
    orderData.UserManagerID = user.ManagerID || '';
    orderData.UserObjectID = user.ObjectID || '';
    
    const params = { OrderJson: JSON.stringify(orderData) };
    return Http.post(API_CONFIG.ENDPOINTS.ORDERS.CREATE, params);
  }

  /**
   * Xóa đơn hàng
   */
  async function deleteOrder(documentId) {
    const params = { DocumentID: documentId };
    return Http.post(API_CONFIG.ENDPOINTS.ORDERS.DELETE, params);
  }

  return { getOrders, createOrder, deleteOrder };
})();
