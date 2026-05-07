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
    return Http.post(API_CONFIG.ENDPOINTS.ORDERS.CREATE, orderData);
  }

  return { getOrders, createOrder };
})();
