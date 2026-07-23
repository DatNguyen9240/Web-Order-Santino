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

  /**
   * Kiểm tra trực tiếp quyền xuất/in của form. Không cache localStorage để
   * thay đổi quyền trên ERP có hiệu lực ngay ở lần mở trang hoặc bấm nút sau.
   */
  function canExportExcel(formName) {
    var groupId = _currentGroupId();
    var endpoint = _ep('GET_ALL_MENUS_FOR_GROUP');
    if (!endpoint || !groupId || !formName) return Promise.resolve(false);

    return Http.post(endpoint, {
      NhomNguoiDangThaoTac: groupId,
      UserGroupID: groupId
    }).then(function (res) {
      var records = (res && res.records) ? res.records : (Array.isArray(res) ? res : []);
      var target = String(formName).toLowerCase();
      var permission = records.find(function (item) {
        var key = item.formName || item.FormName || item.FormKey || item.formKey || '';
        return String(key).toLowerCase() === target;
      });
      return !!(permission && (permission.isExportExcel == 1 || permission.isExportExcel === '1' || permission.isExportExcel === true));
    }).catch(function (err) {
      console.warn('[PermissionsService] Không thể kiểm tra quyền xuất:', err);
      return false;
    });
  }

  return {
    getGroups: getGroups,
    getFullMenusByGroup: getFullMenusByGroup,
    savePermission: savePermission,
    sync: sync,
    canExportExcel: canExportExcel
  };
})();
