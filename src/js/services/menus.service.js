/**
 * MenusService
 * Quản lý toàn bộ API call liên quan đến Quản lý Menu Hệ thống.
 */
var MenusService = (function () {

  function _ep(key) {
    return (window.API_CONFIG && window.API_CONFIG.ENDPOINTS && window.API_CONFIG.ENDPOINTS.MENUS)
      ? window.API_CONFIG.ENDPOINTS.MENUS[key]
      : null;
  }

  function _currentGroupId() {
    var u = JSON.parse(localStorage.getItem('santino_user') || '{}');
    return u.role || u.Group || u.GroupUser || u.GroupID || 'Admin';
  }

  /**
   * Lấy toàn bộ danh sách menu
   * @returns {Promise<Array>}
   */
  function getAll() {
    var endpoint = _ep('GET_ALL');
    return Http.post(endpoint, { NhomNguoiDangThaoTac: _currentGroupId() })
      .then(function (res) {
        if (res && res.code === 0) {
          return res.records || [];
        } else {
          console.warn('[MenusService] getAll — code != 0:', res && res.msg);
          return Array.isArray(res) ? res : (res && res.records ? res.records : []);
        }
      })
      .catch(function (err) {
        console.error('[MenusService] Lỗi getAll:', err);
        return [];
      });
  }

  /**
   * Lưu menu (thêm mới hoặc cập nhật)
   * @param {Object} payload
   * @returns {Promise}
   */
  function save(payload) {
    var endpoint = _ep('SAVE');
    return Http.post(endpoint, payload).catch(function (err) {
      console.error('[MenusService] Lỗi save:', err);
      throw err;
    });
  }

  /**
   * Xóa menu
   * @param {string} menuId
   * @returns {Promise}
   */
  function deleteMenu(menuId) {
    var endpoint = _ep('DELETE');
    return Http.post(endpoint, { NhomNguoiDangThaoTac: _currentGroupId(), MenuID: menuId }).catch(function (err) {
      console.error('[MenusService] Lỗi deleteMenu:', err);
      throw err;
    });
  }

  /**
   * Cập nhật thứ tự hiển thị các menu
   * @param {Object} params - { type, orderedIds, parentId }
   * @returns {Promise}
   */
  function updateOrder(params) {
    var endpoint = _ep('UPDATE_ORDER');
    return Http.post(endpoint, {
      NhomNguoiDangThaoTac: _currentGroupId(),
      Type: params.type,
      OrderedIDs: params.orderedIds.join(','),
      ParentID: params.parentId
    }).catch(function (err) {
      console.error('[MenusService] Lỗi updateOrder:', err);
      throw err;
    });
  }

  return {
    getAll: getAll,
    save: save,
    deleteMenu: deleteMenu,
    updateOrder: updateOrder,
    currentGroupId: _currentGroupId
  };
})();
