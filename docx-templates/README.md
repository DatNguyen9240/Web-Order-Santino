# In phiếu đặt hàng DOCX

1. Chép `phieu-dat-hang.docx` vào thư mục `backend-app/samples/` của Document Server.
2. Chạy Document Server với `SQL_API_BASE` trỏ đến API Santino nếu server cần lấy thông tin setup.
3. Reverse proxy `https://<web-santino>/docserver` đến Document Server. Frontend gọi:
   - `/docserver/api/documents/generate`
   - `/docserver/uploads/<tên-file>`
4. Vào Phân quyền, bật `isExcelExport` cho menu có `FormName = WEB_OrderDetailFrm`.

Mẫu dùng các biến đầu đơn: `{so_ct}`, `{ngay_ct}`, `{khach_hang}`, `{dia_chi}`, `{nvkd}`, `{ghi_chu}`, `{total_qty}`, `{total_money_display}`.

Bảng chi tiết lặp theo `{#lines}` ... `{/lines}` với: `{STT}`, `{ten_hang_2}`, `{ten_hang}`, `{dvt}`, `{don_gia_display}`, `{so_luong}`, `{thanh_tien_display}`.
