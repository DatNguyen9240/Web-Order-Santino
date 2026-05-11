/** Utility functions */
const Utils = (function () {
  function formatMoney(n) {
    return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
  }

  // Cập nhật Blueprint v2.0: Validation an toàn
  function buildSKU(ten_hang_2, size) {
    if (!ten_hang_2) return 'INVALID_SKU';
    const clean_ten = ten_hang_2.trim();
    const match = clean_ten.match(/^[A-Z]+/);
    if (!match) return `INVALID_${clean_ten}_${size}`;
    const brand = match[0];
    const rest = clean_ten.slice(brand.length);
    return `${brand}${size}${rest}`;
  }

  // {BranchCode}-DH{MMYY}/{seq:04}
  function genOrderNo(branchCode, dateStr, existingSeq) {
    var d = dateStr ? new Date(dateStr) : new Date();
    if (isNaN(d.getTime())) d = new Date();
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var yy = String(d.getFullYear()).slice(2);
    
    // Hiển thị mặc định 0001 nếu không có đuôi số truyền vào (đáp ứng yêu cầu UI)
    var seq = existingSeq || '0001';
    
    var prefix = branchCode ? (branchCode.trim() + '-DH') : 'DH';
    return prefix + mm + yy + '/' + seq;
  }

  function uuid() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return { formatMoney, buildSKU, genOrderNo, today, escHtml, uuid };
})();
