# Order Santino

## Dùng thử

[🔗 Mở trang đăng nhập](login.html)

Bạn có thể đăng nhập bằng một trong các tài khoản test sau:

- `TESTKETOAN` — Kế toán
- `ST09` — Nhân viên kinh doanh
- `A8172991` — Đại lý
- `A2142010` — Khách lẻ

Mật khẩu: liên hệ quản trị viên để nhận tài khoản test.

Ứng dụng web B2B hỗ trợ Santino tạo và quản lý đơn đặt hàng sỉ. Hệ thống tập trung vào thao tác đặt hàng theo ma trận size, quản lý danh mục sản phẩm/khách hàng và tra cứu lịch sử đơn hàng.

## Chức năng chính

- Tạo đơn hàng sỉ theo **ma trận size**: nhập số lượng cho từng size của sản phẩm.
- Tìm kiếm sản phẩm, tự tải nhóm size, tính tổng số lượng và thành tiền theo thời gian thực.
- Xem trước, gửi, xem chi tiết, cập nhật và xoá đơn hàng.
- Quản lý sản phẩm, nhóm hàng, form, giá, size và trạng thái hiển thị trên web.
- Quản lý khách hàng, nhóm khách hàng, tài khoản đăng nhập, khoá/mở khoá và đặt lại mật khẩu.
- Áp dụng chương trình bán hàng/khuyến mãi, quản lý menu và phân quyền người dùng.
- Hỗ trợ tiếng Việt, tiếng Anh, tiếng Trung; giao diện sáng/tối và tùy chỉnh hiển thị.
- In hoặc tạo phiếu đặt hàng từ mẫu DOCX thông qua Document Server.

## Công nghệ

- Frontend: HTML5, CSS3, JavaScript (ES6), hash-based SPA.
- UI: AG Grid, Material Symbols, Google Fonts.
- Tích hợp: REST API, Document Server cho mẫu DOCX.
- Dữ liệu: SQL Server; các script khởi tạo và API được đặt trong thư mục `sql/`.

## Cấu trúc thư mục

```text
.
├── index.html                 # Điểm vào ứng dụng
├── login.html                 # Trang đăng nhập
├── env.js                     # Cấu hình API và Document Server
├── src/
│   ├── pages/                 # Các màn hình nghiệp vụ
│   ├── components/            # Thành phần UI tái sử dụng
│   ├── js/                    # Router, services, utilities
│   ├── css/                   # Style nguồn và bundle
│   └── data/                  # Bản dịch giao diện
├── sql/                       # Table, view và stored procedure SQL Server
├── docx-templates/            # Mẫu phiếu đặt hàng
└── build.ps1                  # Gộp CSS/JavaScript thành bundle
```

## Chạy dự án ở môi trường local

1. Cấu hình địa chỉ API và Document Server trong [env.js](env.js).
2. Mở một HTTP server tại thư mục gốc (không mở trực tiếp `index.html` bằng `file://`). Ví dụ với Python:

   ```powershell
   py -m http.server 5500
   ```

3. Truy cập `http://localhost:5500` trên trình duyệt.

Khi chạy ở `localhost`, ứng dụng dùng `API_BASE` trong `env.js`. Khi triển khai trên domain khác, ứng dụng gọi API qua proxy cùng domain tại `/api` và Document Server tại `/docserver`.

## Cập nhật mã nguồn giao diện

Sau khi sửa các file CSS hoặc JavaScript có trong danh sách của `build.ps1`, chạy:

```powershell
.\build.ps1
```

Lệnh này tạo lại hai file bundle:

- `src/css/styles.bundle.css`
- `src/js/app.bundle.js`

## Chuẩn bị cơ sở dữ liệu

Các script SQL Server được tổ chức theo mục đích:

- `sql/tables/`: bảng nền tảng và cấu hình hệ thống.
- `sql/views/`: các view phục vụ dữ liệu sản phẩm.
- `sql/API_*.sql`: stored procedure/API cho sản phẩm, khách hàng, đơn hàng, danh mục và cấu hình giao diện.

Triển khai các script theo đúng môi trường SQL Server của doanh nghiệp, sau đó cấu hình backend/API tương ứng. Không đưa thông tin đăng nhập hoặc địa chỉ máy chủ nội bộ vào repository công khai.

## Luồng đặt hàng

```text
Tìm sản phẩm → thêm vào đơn → nhập số lượng theo size
→ kiểm tra tổng tiền/khuyến mãi → xem trước → gửi đơn
→ tra cứu hoặc cập nhật trong danh sách đơn hàng
```

## Ghi chú

- API đơn hàng được đọc động từ metadata của form `WEB_OrderFrm`.
- Tài liệu endpoint và định dạng request/response tham khảo trong [API.md](API.md).
- Mẫu phiếu đặt hàng mặc định là `docx-templates/phieu-dat-hang.docx`.
