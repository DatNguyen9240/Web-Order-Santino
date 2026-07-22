/**
 * Order Service
 * Các route Order được đọc từ metadata WEB_OrderFrm trong DB.
 */
const OrderService = (() => {
  var _metadataPromise = null;

  function _isTrue(value) {
    return value === true || value === 1 || value === '1' || String(value).toLowerCase() === 'true';
  }

  async function getMetadata() {
    if (_metadataPromise) return _metadataPromise;
    _metadataPromise = (async function () {
      var response = await Http.post('/API_LayCacTruongGiaoDien', { FormName: 'WEB_OrderFrm' });
      var fields = response && (response.records || response.list || response);
      if (!Array.isArray(fields) || !fields.length) {
        throw new Error('DB chưa cấu hình metadata WEB_OrderFrm.');
      }
      var config = fields[0];
      if (!_isTrue(config.apiConfigured)) {
        throw new Error('WEB_OrderFrm chưa cấu hình API trong SY_FrmMstActTbl.');
      }
      var endpoints = {
        LIST: config.apiSearch,
        DETAIL: config.apiDetail,
        CREATE: config.apiCreate,
        UPDATE: config.apiUpdate,
        DELETE: config.apiDelete
      };
      Object.keys(endpoints).forEach(function (action) {
        if (!endpoints[action]) throw new Error('WEB_OrderFrm thiếu API action ' + action + '.');
      });
      return { fields: fields, endpoints: endpoints };
    })();
    return _metadataPromise;
  }

  function _userContext() {
    const user = JSON.parse(localStorage.getItem('santino_user') || '{}');
    const objectId = user.ObjectID || '';
    return {
      UserRole: user.role || user.Group || user.GroupUser || user.GroupID || '',
      UserEmployeeID: objectId ? '' : (user.EmployeeID || ''),
      UserManagerID: user.ManagerID || '',
      UserObjectID: objectId
    };
  }

  function _attachUserContext(data) {
    return Object.assign(data, _userContext());
  }

  async function getOrders(params = {}) {
    var metadata = await getMetadata();
    var query = Object.assign({
      Loai: 'Order',
      TimKiem: JSON.stringify(params),
      chinhanh: '',
      Page: params.page || 1
    }, _userContext());
    return Http.get(metadata.endpoints.LIST, {
      q: JSON.stringify(query),
      page: params.page || 1,
      limit: params.limit || 20,
      _t: Date.now()
    });
  }

  async function getOrderDetail(documentId) {
    var metadata = await getMetadata();
    var query = Object.assign({ Loai: 'OrderDetail', TimKiem: documentId, chinhanh: '', Page: 1 }, _userContext());
    var response = await Http.get(metadata.endpoints.DETAIL, { q: JSON.stringify(query), _t: Date.now() });
    var records = response && response.records ? response.records : response;
    return Array.isArray(records) && records.length ? records[0] : null;
  }

  async function createOrder(orderData) {
    var metadata = await getMetadata();
    return Http.post(metadata.endpoints.CREATE, { OrderJson: JSON.stringify(_attachUserContext(orderData)) });
  }

  async function updateOrder(orderData) {
    var metadata = await getMetadata();
    return Http.post(metadata.endpoints.UPDATE, { OrderJson: JSON.stringify(_attachUserContext(orderData)) });
  }

  async function deleteOrder(documentId) {
    var metadata = await getMetadata();
    return Http.post(metadata.endpoints.DELETE, { DocumentID: documentId });
  }

  return { getMetadata, getOrders, getOrderDetail, createOrder, updateOrder, deleteOrder };
})();
