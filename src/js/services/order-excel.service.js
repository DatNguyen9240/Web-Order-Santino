/**
 * order-excel.service.js
 * Dịch vụ xuất Excel dùng chung cho toàn bộ ứng dụng Web-Order-Santino
 * Đảm bảo 1 cấu trúc chuẩn duy nhất cho cả Trang Chi Tiết Đơn Hàng và Trang Đặt Hàng.
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
            DienThoaiFax: record.DienThoaiFax || 'Tel: (024) 3204 9988 | Fax: (024) 3215 1142',
            TenBrandWeb: record.TenBrandWeb || 'SHOP SANTINO'
          };
        }
      }
    } catch (e) {}
    return {
      TenCongTy: 'CÔNG TY CP LSP VIỆT NAM',
      DiaChi: 'Tầng 3, Helios Tower, 75 Tam Trinh, Hoàng Mai, Hà Nội',
      DienThoaiFax: 'Tel: (024) 3204 9988 | Fax: (024) 3215 1142',
      TenBrandWeb: 'SHOP SANTINO'
    };
  }

  /**
   * Xuất file Excel chuẩn hóa
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
    var custName = options.custName || '';
    var custCode = options.custCode || '';
    var custAddr = options.custAddr || '—';
    var custPhone = options.custPhone || '—';
    var remarks = options.remarks || '—';
    var lines = options.lines || [];
    var overallSizeText = options.overallSizeText || '';

    var companyInfo = options.companyInfo || await _getCompanyInfoSetup();

    var workbook = new ExcelJS.Workbook();
    var worksheet = workbook.addWorksheet('Phiếu Đặt Hàng', {
      views: [{ showGridLines: true }]
    });

    worksheet.columns = [
      { key: 'colA', width: 8 },
      { key: 'colB', width: 30 },
      { key: 'colC', width: 45 },
      { key: 'colD', width: 12 },
      { key: 'colE', width: 22 }
    ];

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
          ext: { width: 160, height: 48 }
        });
      } catch (e) {
        console.warn('Lỗi chèn ảnh logo ExcelJS:', e);
      }
    }

    // Header Company info (Right aligned merged across C:E)
    worksheet.mergeCells('C1:E1');
    worksheet.getCell('C1').value = companyInfo.TenCongTy || 'CÔNG TY CP LSP VIỆT NAM';
    worksheet.getCell('C1').font = { name: 'Times New Roman', size: 11, bold: true };
    worksheet.getCell('C1').alignment = { horizontal: 'right' };

    worksheet.mergeCells('C2:E2');
    worksheet.getCell('C2').value = companyInfo.DiaChi || 'Tầng 3, Helios Tower, 75 Tam Trinh, Hoàng Mai, Hà Nội';
    worksheet.getCell('C2').font = { name: 'Times New Roman', size: 10 };
    worksheet.getCell('C2').alignment = { horizontal: 'right' };

    worksheet.mergeCells('C3:E3');
    worksheet.getCell('C3').value = companyInfo.DienThoaiFax || 'Tel: (024) 3204 9988, Fax: (024) 3215 1142';
    worksheet.getCell('C3').font = { name: 'Times New Roman', size: 10 };
    worksheet.getCell('C3').alignment = { horizontal: 'right' };

    worksheet.mergeCells('C4:E4');
    worksheet.getCell('C4').value = companyInfo.EmailWeb || 'Email: info@santino.com.vn | Web: www.santino.com.vn';
    worksheet.getCell('C4').font = { name: 'Times New Roman', size: 10 };
    worksheet.getCell('C4').alignment = { horizontal: 'right' };

    // Title Row 6
    worksheet.mergeCells('A6:E6');
    worksheet.getCell('A6').value = 'PHIẾU ĐẶT HÀNG';
    worksheet.getCell('A6').font = { name: 'Times New Roman', size: 18, bold: true };
    worksheet.getCell('A6').alignment = { horizontal: 'center', vertical: 'middle' };

    // Date & Order No Row 7
    worksheet.mergeCells('A7:C7');
    worksheet.getCell('A7').value = dateFormattedText;
    worksheet.getCell('A7').font = { name: 'Times New Roman', size: 11, italic: true };

    worksheet.mergeCells('D7:E7');
    worksheet.getCell('D7').value = 'Số: ' + docId;
    worksheet.getCell('D7').font = { name: 'Times New Roman', size: 11, bold: true };
    worksheet.getCell('D7').alignment = { horizontal: 'right' };

    // Customer Box Table (Rows 9 to 11)
    var thinBorder = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    worksheet.mergeCells('A9:C9');
    worksheet.getCell('A9').value = 'KHÁCH HÀNG: ' + custName;
    worksheet.getCell('A9').font = { name: 'Times New Roman', size: 11, bold: true };

    worksheet.mergeCells('D9:E9');
    worksheet.getCell('D9').value = 'MÃ KHÁCH HÀNG: ' + custCode;
    worksheet.getCell('D9').font = { name: 'Times New Roman', size: 11, bold: true };

    worksheet.mergeCells('A10:C10');
    worksheet.getCell('A10').value = 'ĐỊA CHỈ: ' + custAddr;
    worksheet.getCell('A10').font = { name: 'Times New Roman', size: 11 };

    worksheet.mergeCells('D10:E10');
    worksheet.getCell('D10').value = 'SỐ ĐIỆN THOẠI: ' + custPhone;
    worksheet.getCell('D10').font = { name: 'Times New Roman', size: 11 };

    worksheet.mergeCells('A11:E11');
    worksheet.getCell('A11').value = 'DIỄN GIẢI: ' + remarks;
    worksheet.getCell('A11').font = { name: 'Times New Roman', size: 11 };

    ['A9','B9','C9','D9','E9','A10','B10','C10','D10','E10','A11','B11','C11','D11','E11'].forEach(function(cellRef) {
      worksheet.getCell(cellRef).border = thinBorder;
    });

    // Product Table Header Row 13
    var headers = ['STT', 'SẢN PHẨM', 'SIZE × SỐ LƯỢNG', 'TỔNG', 'THÀNH TIỀN'];
    var headerRow = worksheet.getRow(13);
    headers.forEach(function(h, idx) {
      var cell = headerRow.getCell(idx + 1);
      cell.value = h;
      cell.font = { name: 'Times New Roman', size: 11, bold: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F8FAFC' } };
      cell.alignment = { horizontal: idx === 0 || idx === 3 ? 'center' : (idx === 4 ? 'right' : 'left'), vertical: 'middle' };
      cell.border = thinBorder;
    });

    var currentRowIndex = 14;
    var totalQty = 0;
    var totalAmount = 0;

    lines.forEach(function (line, index) {
      var sttNum = index + 1;
      var stt = String(sttNum).padStart(2, '0');
      var itemCode = line.itemCode || line.MaHang || line.ItemID || line.ma_hang || '';
      var itemName = line.itemName || line.TenHang || line.ItemName || line.ten_hang || '';
      var color = line.color || line.MauSac || line.mau_sac || line.Mau || line.mau || '';
      var sizeText = line.sizeText || '';

      var qty = Number(line.qty || line.Quantity || line.SoLuong || line.so_luong || 0);
      var price = Number(line.price || line.UnitPrice || line.DonGia || line.don_gia || 0);
      var amount = Number(line.amount || line.Amount || line.ThanhTien || line.thanh_tien || (qty * price));

      totalQty += qty;
      totalAmount += amount;

      var row = worksheet.getRow(currentRowIndex);
      
      row.getCell(1).value = stt;
      row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell(1).font = { name: 'Times New Roman', size: 11, bold: true };

      row.getCell(2).value = itemCode + '\n' + itemName + (color ? ('\nMàu: ' + color) : '');
      row.getCell(2).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
      row.getCell(2).font = { name: 'Times New Roman', size: 11 };

      row.getCell(3).value = sizeText;
      row.getCell(3).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
      row.getCell(3).font = { name: 'Times New Roman', size: 11 };

      row.getCell(4).value = qty;
      row.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell(4).font = { name: 'Times New Roman', size: 11, bold: true };

      row.getCell(5).value = amount;
      row.getCell(5).numFmt = '#,##0" đ"';
      row.getCell(5).alignment = { horizontal: 'right', vertical: 'middle' };
      row.getCell(5).font = { name: 'Times New Roman', size: 11, bold: true };

      [1, 2, 3, 4, 5].forEach(function(c) {
        row.getCell(c).border = thinBorder;
      });

      currentRowIndex++;
    });

    // Overall Size Summary Row if provided
    if (overallSizeText) {
      worksheet.mergeCells('A' + currentRowIndex + ':E' + currentRowIndex);
      var sizeSummaryCell = worksheet.getCell('A' + currentRowIndex);
      sizeSummaryCell.value = 'Tổng theo size: ' + overallSizeText;
      sizeSummaryCell.font = { name: 'Times New Roman', size: 11, bold: true };
      ['A','B','C','D','E'].forEach(function(col) {
        worksheet.getCell(col + currentRowIndex).border = thinBorder;
      });
      currentRowIndex++;
    }

    currentRowIndex += 1;

    // Money Summary Breakdown
    var formattedTotalAmount = typeof Utils !== 'undefined' && Utils.formatMoney ? Utils.formatMoney(totalAmount) : totalAmount.toLocaleString('vi-VN') + ' đ';
    var moneyInWords = (typeof Utils !== 'undefined' && Utils.numberToVietnameseWords) ? Utils.numberToVietnameseWords(totalAmount) : (options.moneyInWords || '');

    worksheet.mergeCells('A' + currentRowIndex + ':C' + currentRowIndex);
    worksheet.getCell('A' + currentRowIndex).value = 'Tổng số lượng: ' + totalQty + ' sản phẩm';
    worksheet.getCell('A' + currentRowIndex).font = { name: 'Times New Roman', size: 11, bold: true };

    worksheet.mergeCells('D' + currentRowIndex + ':E' + currentRowIndex);
    worksheet.getCell('D' + currentRowIndex).value = 'Tổng tiền hàng: ' + formattedTotalAmount;
    worksheet.getCell('D' + currentRowIndex).font = { name: 'Times New Roman', size: 11, bold: true };
    worksheet.getCell('D' + currentRowIndex).alignment = { horizontal: 'right' };

    currentRowIndex++;

    worksheet.mergeCells('A' + currentRowIndex + ':C' + currentRowIndex);
    worksheet.getCell('A' + currentRowIndex).value = 'Bằng chữ: ' + (moneyInWords || '—');
    worksheet.getCell('A' + currentRowIndex).font = { name: 'Times New Roman', size: 11, italic: true };

    worksheet.mergeCells('D' + currentRowIndex + ':E' + currentRowIndex);
    worksheet.getCell('D' + currentRowIndex).value = 'Chiết khấu: 0 đ';
    worksheet.getCell('D' + currentRowIndex).font = { name: 'Times New Roman', size: 11 };
    worksheet.getCell('D' + currentRowIndex).alignment = { horizontal: 'right' };

    currentRowIndex++;

    worksheet.mergeCells('D' + currentRowIndex + ':E' + currentRowIndex);
    worksheet.getCell('D' + currentRowIndex).value = 'Chiết khấu khác: 0 đ';
    worksheet.getCell('D' + currentRowIndex).font = { name: 'Times New Roman', size: 11 };
    worksheet.getCell('D' + currentRowIndex).alignment = { horizontal: 'right' };

    currentRowIndex++;

    worksheet.mergeCells('D' + currentRowIndex + ':E' + currentRowIndex);
    worksheet.getCell('D' + currentRowIndex).value = 'TỔNG THANH TOÁN: ' + formattedTotalAmount;
    worksheet.getCell('D' + currentRowIndex).font = { name: 'Times New Roman', size: 13, bold: true };
    worksheet.getCell('D' + currentRowIndex).alignment = { horizontal: 'right' };

    currentRowIndex += 2;

    // Signature: Only Kế toán at column E
    var sigTitleRow = worksheet.getRow(currentRowIndex);
    var cellTitle = sigTitleRow.getCell(5);
    cellTitle.value = 'Kế toán';
    cellTitle.font = { name: 'Times New Roman', size: 11, bold: true };
    cellTitle.alignment = { horizontal: 'center' };

    currentRowIndex++;

    var sigSubRow = worksheet.getRow(currentRowIndex);
    var cellSub = sigSubRow.getCell(5);
    cellSub.value = '(Ký / họ tên)';
    cellSub.font = { name: 'Times New Roman', size: 10, italic: true, color: { argb: '64748B' } };
    cellSub.alignment = { horizontal: 'center' };

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
