/**
 * order-excel.service.js
 * Dịch vụ xuất Excel dùng chung cho toàn bộ ứng dụng Web-Order-Santino
 * Cấu trúc Ma trận Size y như mẫu Phiếu Đặt Hàng.
 */
var OrderExcelService = (function () {

  function _getBlackLogoUint8Array() {
    return new Promise(function (resolve) {
      var img = new Image();
      img.src = 'images/logo.png';
      img.crossOrigin = 'anonymous';
      img.onload = function () {
        try {
          var canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || 300;
          canvas.height = img.naturalHeight || 90;
          var ctx = canvas.getContext('2d');
          
          ctx.filter = 'brightness(0)';
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          var dataUrl = canvas.toDataURL('image/png');
          var raw = window.atob(dataUrl.replace(/^data:image\/\w+;base64,/, ''));
          var len = raw.length;
          var bytes = new Uint8Array(len);
          for (var i = 0; i < len; i++) {
            bytes[i] = raw.charCodeAt(i);
          }
          resolve(bytes);
        } catch (e) {
          console.warn('Lỗi chuyển logo qua canvas:', e);
          resolve(null);
        }
      };
      img.onerror = function () {
        resolve(null);
      };
    });
  }

  async function _getCompanyInfoSetup() {
    try {
      if (typeof Http !== 'undefined') {
        var res = await Http.get('/API_LayThongTinCongTy', { _t: Date.now() });
        var record = Array.isArray(res) ? res[0] : (res && res.records ? res.records[0] : res);
        if (record) {
          return {
            TenCongTy: record.TenCongTy || 'CÔNG TY CP LSP VIỆT NAM',
            DiaChi: record.DiaChi || 'Tầng 3, Helios Tower, 75 Tam Trinh, Hoàng Mai, Hà Nội',
            DienThoaiFax: record.DienThoaiFax || 'Tel: (024) 3204 9988, Fax: (024) 3215 1142',
            EmailWeb: record.EmailWeb || 'Email: info@santino.com.vn | Web: www.santino.com.vn'
          };
        }
      }
    } catch (e) {}
    return {
      TenCongTy: 'CÔNG TY CP LSP VIỆT NAM',
      DiaChi: 'Tầng 3, Helios Tower, 75 Tam Trinh, Hoàng Mai, Hà Nội',
      DienThoaiFax: 'Tel: (024) 3204 9988, Fax: (024) 3215 1142',
      EmailWeb: 'Email: info@santino.com.vn | Web: www.santino.com.vn'
    };
  }

  function _colToLetter(colIndex) {
    var temp, letter = '';
    while (colIndex > 0) {
      temp = (colIndex - 1) % 26;
      letter = String.fromCharCode(65 + temp) + letter;
      colIndex = (colIndex - temp - 1) / 26;
    }
    return letter;
  }

  function _parseLineSizeDetails(line) {
    var val = line.chi_tiet_size || line.rawSize || line.Size || line.size || line.sizes || line.chi_tiet_size_list;
    var arr = val;
    if (typeof val === 'string') {
      try { arr = JSON.parse(val); } catch (e) { arr = []; }
    }
    var sizeMap = {};
    if (Array.isArray(arr) && arr.length > 0) {
      arr.forEach(function (s) {
        if (!s) return;
        var sz = s.Size !== undefined ? s.Size : (s.size !== undefined ? s.size : s.ten_size);
        var q = Number(s.Quantity !== undefined ? s.Quantity : (s.Qty !== undefined ? s.Qty : (s.qty !== undefined ? s.qty : s.so_luong)));
        if (sz) {
          var szName = String(sz).trim();
          if (szName && !isNaN(q) && q > 0) {
            sizeMap[szName] = (sizeMap[szName] || 0) + q;
          }
        }
      });
    }

    if (Object.keys(sizeMap).length === 0 && typeof line.sizeText === 'string' && line.sizeText.trim()) {
      var parts = line.sizeText.split(/[·,;\n]/);
      parts.forEach(function (part) {
        var match = part.trim().match(/^([^\×\x\*\(]+)[\×\x\*\()]([0-9]+)\)?$/);
        if (match) {
          var szName = match[1].trim();
          var q = Number(match[2]);
          if (szName && !isNaN(q) && q > 0) {
            sizeMap[szName] = (sizeMap[szName] || 0) + q;
          }
        }
      });
    }
    return sizeMap;
  }

  function _sortSizes(sizeList) {
    var predefinedOrder = [
      '0XS', 'XS', '0S', 'S', '0M', 'M', '0L', 'L', 'XL', '1X', '2X', '2XL', '3X', '3XL', '4X', '4XL', '5X', '5XL', '6X', 'F', 'FREE'
    ];
    return sizeList.slice().sort(function (a, b) {
      var indexA = predefinedOrder.indexOf(String(a).toUpperCase());
      var indexB = predefinedOrder.indexOf(String(b).toUpperCase());

      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      var numA = parseFloat(a);
      var numB = parseFloat(b);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;

      return String(a).localeCompare(String(b));
    });
  }

  /**
   * Xuất file Excel chuẩn hóa theo dạng Ma trận Size (PHIẾU ĐẶT HÀNG)
   * @param {Object} options 
   */
  async function exportOrder(options) {
    options = options || {};

    if (typeof ExcelJS === 'undefined') {
      if (typeof showToast === 'function') showToast('Thư viện ExcelJS chưa sẵn sàng!', false);
      return;
    }

    var docId = options.docId || 'DonHang';
    var fileName = 'Phieu_dat_hang_' + String(docId).replace(/[^a-zA-Z0-9_-]+/g, '_') + '.xlsx';

    var dateFormattedText = options.dateFormattedText || 'Ngày ... tháng ... năm ...';
    var custName = options.custName || '—';
    var custCode = options.custCode || '—';
    var custAddr = options.custAddr || '—';
    var custPhone = options.custPhone || '—';
    var remarks = options.remarks || '—';
    var lines = options.lines || options.rawLines || [];

    var companyInfo = options.companyInfo || await _getCompanyInfoSetup();

    // 1. Collect all size headers across all lines
    var allSizesSet = [];
    lines.forEach(function (line) {
      var sizeMap = _parseLineSizeDetails(line);
      Object.keys(sizeMap).forEach(function (sz) {
        if (allSizesSet.indexOf(sz) === -1) {
          allSizesSet.push(sz);
        }
      });
    });
    var sortedSizeHeaders = _sortSizes(allSizesSet);

    // Dynamic Columns definition
    var totalCols = 4 + sortedSizeHeaders.length;
    var totalColLetter = _colToLetter(totalCols);

    var workbook = new ExcelJS.Workbook();
    var worksheet = workbook.addWorksheet('Phiếu Đặt Hàng', {
      views: [{ showGridLines: true }]
    });

    // Column widths setup
    var columnsSetup = [
      { key: 'colA', width: 24 }, // SẢN PHẨM
      { key: 'colB', width: 18 }  // MÀU
    ];
    sortedSizeHeaders.forEach(function () {
      columnsSetup.push({ width: 5.5 }); // Dynamic size cols
    });
    columnsSetup.push({ width: 9 });  // TỔNG
    columnsSetup.push({ width: 18 }); // THÀNH TIỀN

    worksheet.columns = columnsSetup;

    // Add Black Logo Image anchored at A1
    var logoBytes = await _getBlackLogoUint8Array();
    if (logoBytes) {
      try {
        var imageId = workbook.addImage({
          buffer: logoBytes,
          extension: 'png',
        });
        worksheet.addImage(imageId, {
          tl: { col: 0, row: 0 },
          ext: { width: 150, height: 45 }
        });
      } catch (e) {
        console.warn('Lỗi chèn ảnh logo ExcelJS:', e);
      }
    }

    // Company Info Header (Right Aligned)
    var compStartCol = _colToLetter(Math.max(3, totalCols - 7));
    var compMergeRange = function (row) {
      return compStartCol + row + ':' + totalColLetter + row;
    };

    worksheet.mergeCells(compMergeRange(1));
    worksheet.getCell(compStartCol + '1').value = companyInfo.TenCongTy || 'CÔNG TY CP LSP VIỆT NAM';
    worksheet.getCell(compStartCol + '1').font = { name: 'Times New Roman', size: 11, bold: true };
    worksheet.getCell(compStartCol + '1').alignment = { horizontal: 'right' };

    worksheet.mergeCells(compMergeRange(2));
    worksheet.getCell(compStartCol + '2').value = companyInfo.DiaChi || 'Tầng 3, Helios Tower, 75 Tam Trinh, Hoàng Mai, Hà Nội';
    worksheet.getCell(compStartCol + '2').font = { name: 'Times New Roman', size: 10 };
    worksheet.getCell(compStartCol + '2').alignment = { horizontal: 'right' };

    worksheet.mergeCells(compMergeRange(3));
    worksheet.getCell(compStartCol + '3').value = companyInfo.DienThoaiFax || 'Tel: (024) 3204 9988, Fax: (024) 3215 1142';
    worksheet.getCell(compStartCol + '3').font = { name: 'Times New Roman', size: 10 };
    worksheet.getCell(compStartCol + '3').alignment = { horizontal: 'right' };

    worksheet.mergeCells(compMergeRange(4));
    worksheet.getCell(compStartCol + '4').value = companyInfo.EmailWeb || 'Email: info@santino.com.vn | Web: www.santino.com.vn';
    worksheet.getCell(compStartCol + '4').font = { name: 'Times New Roman', size: 10 };
    worksheet.getCell(compStartCol + '4').alignment = { horizontal: 'right' };

    // Line under company header (Row 4 bottom border)
    for (var c = 1; c <= totalCols; c++) {
      worksheet.getCell(_colToLetter(c) + '4').border = {
        bottom: { style: 'thin', color: { argb: '000000' } }
      };
    }

    // Title Row 6
    worksheet.mergeCells('A6:' + totalColLetter + '6');
    worksheet.getCell('A6').value = 'PHIẾU ĐẶT HÀNG';
    worksheet.getCell('A6').font = { name: 'Times New Roman', size: 18, bold: true };
    worksheet.getCell('A6').alignment = { horizontal: 'center', vertical: 'middle' };

    // Date & Order Code Row 7
    worksheet.mergeCells('A7:' + totalColLetter + '7');
    worksheet.getCell('A7').value = dateFormattedText;
    worksheet.getCell('A7').font = { name: 'Times New Roman', size: 11, italic: true };
    worksheet.getCell('A7').alignment = { horizontal: 'center', vertical: 'middle' };

    // Doc ID on right side of Row 7
    worksheet.getCell(totalColLetter + '7').value = docId;
    worksheet.getCell(totalColLetter + '7').font = { name: 'Times New Roman', size: 11, bold: true };
    worksheet.getCell(totalColLetter + '7').alignment = { horizontal: 'right', vertical: 'middle' };

    // Customer Info Section (Rows 9 - 11)
    var mkhStartColIdx = Math.max(3, totalCols - 4);
    var mkhStartColLetter = _colToLetter(mkhStartColIdx);
    var mkhPrevColLetter = _colToLetter(mkhStartColIdx - 1);

    // Row 9: Khách hàng + MKH
    worksheet.mergeCells('A9:' + mkhPrevColLetter + '9');
    worksheet.getCell('A9').value = {
      richText: [
        { font: { name: 'Times New Roman', size: 11, bold: true }, text: 'Khách hàng :  ' },
        { font: { name: 'Times New Roman', size: 11, bold: true }, text: custName }
      ]
    };
    worksheet.mergeCells(mkhStartColLetter + '9:' + totalColLetter + '9');
    worksheet.getCell(mkhStartColLetter + '9').value = {
      richText: [
        { font: { name: 'Times New Roman', size: 11, bold: true }, text: 'MKH :  ' },
        { font: { name: 'Times New Roman', size: 11, bold: true }, text: custCode }
      ]
    };

    // Row 10: Địa chỉ + SĐT
    worksheet.mergeCells('A10:' + mkhPrevColLetter + '10');
    worksheet.getCell('A10').value = {
      richText: [
        { font: { name: 'Times New Roman', size: 11, bold: true }, text: 'Địa chỉ :  ' },
        { font: { name: 'Times New Roman', size: 11 }, text: custAddr }
      ]
    };
    worksheet.mergeCells(mkhStartColLetter + '10:' + totalColLetter + '10');
    worksheet.getCell(mkhStartColLetter + '10').value = {
      richText: [
        { font: { name: 'Times New Roman', size: 11, bold: true }, text: 'SĐT :  ' },
        { font: { name: 'Times New Roman', size: 11 }, text: custPhone }
      ]
    };

    // Row 11: Diễn giải
    worksheet.mergeCells('A11:' + totalColLetter + '11');
    worksheet.getCell('A11').value = {
      richText: [
        { font: { name: 'Times New Roman', size: 11, bold: true }, text: 'Diễn giải :  ' },
        { font: { name: 'Times New Roman', size: 11 }, text: remarks }
      ]
    };

    // Bottom border under customer info (Row 11)
    for (var c = 1; c <= totalCols; c++) {
      worksheet.getCell(_colToLetter(c) + '11').border = {
        bottom: { style: 'thin', color: { argb: '000000' } }
      };
    }

    // Product Table Header Row 13
    var thinBorder = {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } }
    };

    var headerRow = worksheet.getRow(13);

    // Col 1: SẢN PHẨM
    var c1 = headerRow.getCell(1);
    c1.value = 'SẢN PHẨM';
    c1.font = { name: 'Times New Roman', size: 10, bold: true };
    c1.alignment = { horizontal: 'center', vertical: 'middle' };
    c1.border = thinBorder;

    // Col 2: MÀU
    var c2 = headerRow.getCell(2);
    c2.value = 'MÀU';
    c2.font = { name: 'Times New Roman', size: 10, bold: true };
    c2.alignment = { horizontal: 'center', vertical: 'middle' };
    c2.border = thinBorder;

    // Dynamic Size Cols
    sortedSizeHeaders.forEach(function (sz, sIdx) {
      var cell = headerRow.getCell(3 + sIdx);
      cell.value = sz;
      cell.font = { name: 'Times New Roman', size: 10, bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = thinBorder;
    });

    // Col TỔNG
    var cTong = headerRow.getCell(3 + sortedSizeHeaders.length);
    cTong.value = 'TỔNG';
    cTong.font = { name: 'Times New Roman', size: 10, bold: true };
    cTong.alignment = { horizontal: 'center', vertical: 'middle' };
    cTong.border = thinBorder;

    // Col THÀNH TIỀN
    var cTien = headerRow.getCell(4 + sortedSizeHeaders.length);
    cTien.value = 'THÀNH TIỀN';
    cTien.font = { name: 'Times New Roman', size: 10, bold: true };
    cTien.alignment = { horizontal: 'center', vertical: 'middle' };
    cTien.border = thinBorder;

    // Data Rows starting at Row 14
    var currentRowIndex = 14;
    var totalQtySum = 0;
    var totalAmountSum = 0;
    var sizeTotalSums = {};

    lines.forEach(function (line) {
      var itemCode = line.itemCode || line.MaHang || line.ItemID || line.ma_hang || '';
      var itemName = line.itemName || line.TenHang || line.ItemName || line.ten_hang || '';
      var color = line.color || line.MauSac || line.mau_sac || line.Mau || line.mau || '';

      var sizeMap = _parseLineSizeDetails(line);

      var rowQty = 0;
      Object.keys(sizeMap).forEach(function (sz) { rowQty += sizeMap[sz]; });
      if (rowQty === 0) rowQty = Number(line.qty || line.Quantity || line.SoLuong || 0);

      var price = Number(line.price || line.UnitPrice || line.DonGia || 0);
      var amount = Number(line.amount || line.Amount || line.ThanhTien || (rowQty * price));

      totalQtySum += rowQty;
      totalAmountSum += amount;

      var row = worksheet.getRow(currentRowIndex);

      // Col 1: SẢN PHẨM (Code in orange bold + description/name underneath)
      var subText = itemName;
      row.getCell(1).value = {
        richText: [
          { font: { name: 'Times New Roman', size: 10, bold: true, color: { argb: 'C05621' } }, text: itemCode },
          ...(subText ? [{ font: { name: 'Times New Roman', size: 9, color: { argb: '444444' } }, text: '\n' + subText }] : [])
        ]
      };
      row.getCell(1).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
      row.getCell(1).border = thinBorder;

      // Col 2: MÀU
      row.getCell(2).value = color;
      row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      row.getCell(2).font = { name: 'Times New Roman', size: 10 };
      row.getCell(2).border = thinBorder;

      // Dynamic Sizes
      sortedSizeHeaders.forEach(function (sz, sIdx) {
        var cellCol = 3 + sIdx;
        var q = sizeMap[sz];
        if (q > 0) {
          row.getCell(cellCol).value = q;
          sizeTotalSums[sz] = (sizeTotalSums[sz] || 0) + q;
        } else {
          row.getCell(cellCol).value = '-';
        }
        row.getCell(cellCol).alignment = { horizontal: 'center', vertical: 'middle' };
        row.getCell(cellCol).font = { name: 'Times New Roman', size: 10 };
        row.getCell(cellCol).border = thinBorder;
      });

      // Col TỔNG
      var totalColIdx = 3 + sortedSizeHeaders.length;
      row.getCell(totalColIdx).value = rowQty;
      row.getCell(totalColIdx).numFmt = '#,##0';
      row.getCell(totalColIdx).alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell(totalColIdx).font = { name: 'Times New Roman', size: 10, bold: true };
      row.getCell(totalColIdx).border = thinBorder;

      // Col THÀNH TIỀN
      var amountColIdx = 4 + sortedSizeHeaders.length;
      row.getCell(amountColIdx).value = amount;
      row.getCell(amountColIdx).numFmt = '#,##0"đ"';
      row.getCell(amountColIdx).alignment = { horizontal: 'right', vertical: 'middle' };
      row.getCell(amountColIdx).font = { name: 'Times New Roman', size: 10, bold: true };
      row.getCell(amountColIdx).border = thinBorder;

      currentRowIndex++;
    });

    // Summary / Total Row at the bottom of the table
    var sumRow = worksheet.getRow(currentRowIndex);

    sumRow.getCell(1).value = 'TỔNG';
    sumRow.getCell(1).font = { name: 'Times New Roman', size: 10, bold: true };
    sumRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    sumRow.getCell(1).border = thinBorder;

    sumRow.getCell(2).value = '';
    sumRow.getCell(2).border = thinBorder;

    sortedSizeHeaders.forEach(function (sz, sIdx) {
      var cellCol = 3 + sIdx;
      var qSum = sizeTotalSums[sz] || 0;
      sumRow.getCell(cellCol).value = qSum > 0 ? qSum : '-';
      sumRow.getCell(cellCol).font = { name: 'Times New Roman', size: 10, bold: true };
      sumRow.getCell(cellCol).alignment = { horizontal: 'center', vertical: 'middle' };
      sumRow.getCell(cellCol).border = thinBorder;
    });

    var sumTotalColIdx = 3 + sortedSizeHeaders.length;
    sumRow.getCell(sumTotalColIdx).value = totalQtySum;
    sumRow.getCell(sumTotalColIdx).numFmt = '#,##0';
    sumRow.getCell(sumTotalColIdx).font = { name: 'Times New Roman', size: 10, bold: true };
    sumRow.getCell(sumTotalColIdx).alignment = { horizontal: 'center', vertical: 'middle' };
    sumRow.getCell(sumTotalColIdx).border = thinBorder;

    var sumAmountColIdx = 4 + sortedSizeHeaders.length;
    sumRow.getCell(sumAmountColIdx).value = totalAmountSum;
    sumRow.getCell(sumAmountColIdx).numFmt = '#,##0"đ"';
    sumRow.getCell(sumAmountColIdx).font = { name: 'Times New Roman', size: 10, bold: true };
    sumRow.getCell(sumAmountColIdx).alignment = { horizontal: 'right', vertical: 'middle' };
    sumRow.getCell(sumAmountColIdx).border = thinBorder;

    currentRowIndex += 2;

    // Money Summary & In Words
    var formattedTotalAmount = typeof Utils !== 'undefined' && Utils.formatMoney ? Utils.formatMoney(totalAmountSum) : totalAmountSum.toLocaleString('vi-VN') + ' đ';
    var moneyInWords = (typeof Utils !== 'undefined' && Utils.numberToVietnameseWords) ? Utils.numberToVietnameseWords(totalAmountSum) : (options.moneyInWords || '');

    var halfColLetter = _colToLetter(Math.max(2, Math.floor(totalCols / 2)));
    var halfNextColLetter = _colToLetter(Math.max(3, Math.floor(totalCols / 2) + 1));

    worksheet.mergeCells('A' + currentRowIndex + ':' + halfColLetter + currentRowIndex);
    worksheet.getCell('A' + currentRowIndex).value = 'Tổng số lượng: ' + totalQtySum + ' sản phẩm';
    worksheet.getCell('A' + currentRowIndex).font = { name: 'Times New Roman', size: 11, bold: true };

    worksheet.mergeCells(halfNextColLetter + currentRowIndex + ':' + totalColLetter + currentRowIndex);
    worksheet.getCell(halfNextColLetter + currentRowIndex).value = 'Tổng tiền hàng: ' + formattedTotalAmount;
    worksheet.getCell(halfNextColLetter + currentRowIndex).font = { name: 'Times New Roman', size: 11, bold: true };
    worksheet.getCell(halfNextColLetter + currentRowIndex).alignment = { horizontal: 'right' };

    currentRowIndex++;

    worksheet.mergeCells('A' + currentRowIndex + ':' + totalColLetter + currentRowIndex);
    worksheet.getCell('A' + currentRowIndex).value = 'Bằng chữ: ' + (moneyInWords || '—');
    worksheet.getCell('A' + currentRowIndex).font = { name: 'Times New Roman', size: 11, italic: true };

    currentRowIndex += 2;

    // Signature: Kế toán
    var sigColLetter = _colToLetter(totalCols - 1);
    worksheet.mergeCells(sigColLetter + currentRowIndex + ':' + totalColLetter + currentRowIndex);
    worksheet.getCell(sigColLetter + currentRowIndex).value = 'Kế toán';
    worksheet.getCell(sigColLetter + currentRowIndex).font = { name: 'Times New Roman', size: 11, bold: true };
    worksheet.getCell(sigColLetter + currentRowIndex).alignment = { horizontal: 'center' };

    currentRowIndex++;

    worksheet.mergeCells(sigColLetter + currentRowIndex + ':' + totalColLetter + currentRowIndex);
    worksheet.getCell(sigColLetter + currentRowIndex).value = '(Ký / họ tên)';
    worksheet.getCell(sigColLetter + currentRowIndex).font = { name: 'Times New Roman', size: 10, italic: true, color: { argb: '64748B' } };
    worksheet.getCell(sigColLetter + currentRowIndex).alignment = { horizontal: 'center' };

    var buffer = await workbook.xlsx.writeBuffer();
    var blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (typeof showToast === 'function') {
      showToast('Đã xuất file Excel .xlsx thành công: ' + fileName);
    }
  }

  return {
    exportOrder: exportOrder,
    getCompanyInfoSetup: _getCompanyInfoSetup
  };
})();
