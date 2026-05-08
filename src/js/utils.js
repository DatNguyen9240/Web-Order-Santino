/** Utility functions */
const Utils = (function () {
  function formatMoney(n) {
    if (!n || n <= 0) return 'Liên hệ báo giá';
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

  // DH{MMYY}/{seq:04}
  function genOrderNo() {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(2);
    const seq = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    return `DH${mm}${yy}/${seq}`;
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
