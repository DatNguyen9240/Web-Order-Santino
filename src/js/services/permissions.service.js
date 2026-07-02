/**
 * PermissionsService
 * Quản lý toàn bộ API call liên quan đến Phân Quyền Người Dùng.
 */
var PermissionsService = (function () {

  function _ep(key) {
    return (window.API_CONFIG && window.API_CONFIG.ENDPOINTS && window.API_CONFIG.ENDPOINTS.PERMISSIONS)
      ? window.API_CONFIG.ENDPOINTS.PERMISSIONS[key]
      : null;
  }

  function _currentGroupId() {
    var u = JSON.parse(localStorage.getItem('santino_user') || '{}');
    return u.role || u.Group || u.GroupUser || u.GroupID || 'Admin';
  }

  /**
   * Lấy danh sách nhóm quyền
   * @returns {Promise<Array>}
   */
  function getGroups() {
    var endpoint = _ep('GET_GROUP_LIST');
    return Http.get(endpoint).then(function (res) {
      if (res && res.code === 0 && res.records) {
        return res.records;
      }
      return Array.isArray(res) ? res : (res && res.records ? res.records : []);
    }).catch(function (err) {
      console.error('[PermissionsService] Lỗi getGroups:', err);
      return [];
    });
  }

  /**
   * Lấy TẤT CẢ menu + quyền của nhóm
   * @param {string} groupId
   * @returns {Promise<Array>}
   */
  function getFullMenusByGroup(groupId) {
    var endpoint = _ep('GET_ALL_MENUS_FOR_GROUP');
    return Http.post(endpoint, {
      NhomNguoiDangThaoTac: _currentGroupId(),
      UserGroupID: groupId
    }).then(function (res) {
      return (res && res.records) ? res.records : (Array.isArray(res) ? res : []);
    }).catch(function (err) {
      console.error('[PermissionsService] Lỗi getFullMenusByGroup:', err);
      return [];
    });
  }

  /**
   * Lưu quyền cho một menu thuộc nhóm
   * @param {Object} payload
   * @returns {Promise}
   */
  function savePermission(payload) {
    var endpoint = _ep('SAVE_GROUP_PERMISSIONS');
    return Http.post(endpoint, payload).catch(function (err) {
      console.error('[PermissionsService] Lỗi savePermission:', err);
      throw err;
    });
  }

  /**
   * Đồng bộ quyền truy cập toàn hệ thống
   * @returns {Promise}
   */
  function sync() {
    var endpoint = _ep('SYNC');
    return Http.post(endpoint, { NhomNguoiDangThaoTac: _currentGroupId() }).catch(function (err) {
      console.error('[PermissionsService] Lỗi sync:', err);
      throw err;
    });
  }

  return {
    getGroups: getGroups,
    getFullMenusByGroup: getFullMenusByGroup,
    savePermission: savePermission,
    sync: sync
  };
})();
