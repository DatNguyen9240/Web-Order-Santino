# Generic Document Generation Engine Service

Dịch vụ backend phục vụ việc nạp mẫu in Word (`.docx`), làm sạch XML và xuất tài liệu (`.docx`, `.pdf`) từ dữ liệu JSON cho các dự án Web.

## 🚀 Cách chạy dịch vụ

### 1. Cài đặt thư viện:
```bash
npm install
# hoặc
bun install
```

### 2. Khởi chạy Server:
```bash
npm start
# hoặc
bun run dev
```

Server sẽ lắng nghe tại port: `http://localhost:8081`

---

## 📡 Danh sách API Endpoint

### 1. Lấy danh sách mẫu in có sẵn
- **URL:** `GET /api/documents/templates`
- **Mô tả:** Trả về danh sách các file mẫu `.docx` trong thư mục `samples/` phục vụ cho Dropdown chọn mẫu in trên Web Frontend.

### 2. Sinh tài liệu từ dữ liệu JSON
- **URL:** `POST /api/documents/generate`
- **Header:** `Content-Type: application/json`
- **Payload:**
```json
{
  "templateType": "Phieu_Dat_Hang.docx",
  "outputFileName": "Phieu_Dat_Hang_001",
  "rowData": {
    "SoPhieu": "DH001",
    "TenKhachHang": "Anh Chị Trang Dương",
    "ChiTietDonHang": [
      { "MaHang": "SP01", "TenHang": "Quần sooc", "DonGia": 385000, "SoLuong": 2 }
    ]
  }
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Tạo tài liệu thành công!",
  "data": {
    "fileName": "Phieu_Dat_Hang_001_1721700000.docx",
    "fileUrl": "http://localhost:8081/uploads/Phieu_Dat_Hang_001_1721700000.docx"
  }
}
```

### 3. Xóa tài liệu đã sinh ra
- **URL:** `DELETE /api/documents/:fileName`

---

## 📁 Cấu trúc thư mục

- `server.js`: Server Express chính xử lý sinh file & XML cleaning.
- `samples/`: Thư mục chứa các file Word mẫu (`.docx`).
- `uploads/`: Thư mục chứa các file tài liệu đã được sinh ra.
- `list_names.js`: Script hỗ trợ kiểm tra nhanh danh sách mẫu in trong `samples/`.
