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

  function _removeDiacritics(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
  }

  function getUserInitials() {
    try {
      const userRaw = localStorage.getItem('santino_user');
      if (!userRaw) return '??';
      const user = JSON.parse(userRaw);
      const name = user.name || user.DisplayName || 'User';
      
      const words = name.trim().split(/\s+/);
      if (words.length === 1) {
        return _removeDiacritics(words[0].substring(0, 2)).toUpperCase();
      }
      
      const first = words[0][0];
      const last = words[words.length - 1][0];
      return _removeDiacritics(first + last).toUpperCase();
    } catch (e) {
      return '??';
    }
  }

  function toggleRow(el) {
    if (!el || !el.parentElement) return;
    const isSelected = el.classList.contains('row-selected');
    const rows = el.parentElement.querySelectorAll('tr');
    rows.forEach(r => r.classList.remove('row-selected'));
    if (!isSelected) {
      el.classList.add('row-selected');
    }
  }

  function numberToVietnameseWords(num) {
    if (!num || isNaN(num) || num <= 0) return '';
    var dv = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    var ty = Math.floor(num / 1000000000);
    var trieu = Math.floor((num % 1000000000) / 1000000);
    var ngan = Math.floor((num % 1000000) / 1000);
    var dong = Math.floor(num % 1000);

    function readBlock3(n, hasHigher) {
      if (n === 0) return '';
      var tram = Math.floor(n / 100);
      var chuc = Math.floor((n % 100) / 10);
      var donvi = n % 10;
      var str = '';

      if (tram > 0 || hasHigher) {
        str += dv[tram] + ' trăm ';
      }
      if (chuc > 1) {
        str += dv[chuc] + ' mươi ';
        if (donvi === 1) str += 'mốt';
        else if (donvi === 5) str += 'lăm';
        else if (donvi > 0) str += dv[donvi];
      } else if (chuc === 1) {
        str += 'mười ';
        if (donvi === 5) str += 'lăm';
        else if (donvi > 0) str += dv[donvi];
      } else if (chuc === 0 && donvi > 0) {
        if (tram > 0 || hasHigher) str += 'lẻ ';
        str += dv[donvi];
      }
      return str.trim();
    }

    var res = '';
    if (ty > 0) res += readBlock3(ty, false) + ' tỷ ';
    if (trieu > 0) res += readBlock3(trieu, ty > 0) + ' triệu ';
    if (ngan > 0) res += readBlock3(ngan, ty > 0 || trieu > 0) + ' nghìn ';
    if (dong > 0) res += readBlock3(dong, ty > 0 || trieu > 0 || ngan > 0);

    res = res.trim() + ' đồng';
    return res.charAt(0).toUpperCase() + res.slice(1);
  }

  return { formatMoney, buildSKU, genOrderNo, today, escHtml, uuid, getUserInitials, toggleRow, numberToVietnameseWords };
})();
