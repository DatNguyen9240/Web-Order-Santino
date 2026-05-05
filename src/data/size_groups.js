// Size Groups — Nhóm size (từ hình 2)
const sizeGroups = {
  "Nhóm 3": [38, 39, 40, 41, 42, 43, 44, 46, 48],
  // Thêm nhóm khác ở đây khi cần
};

// Helper: lấy sizes theo tên nhóm
function getSizesByGroup(groupName) {
  return sizeGroups[groupName] || [];
}
// Helper: lấy tất cả tên nhóm
function getAllSizeGroupNames() {
  return Object.keys(sizeGroups);
}
