# 📋 PLAN — Web Order Santino B2B
> Phân tích 5 hình ảnh requirement · Ngày: 05/05/2026

---

## 1. PHÂN TÍCH 5 HÌNH ẢNH

### 🖼️ Hình 1 — Master Data Sản Phẩm (bảng tính lớn)

Đây là **bảng nguồn dữ liệu chính** từ ERP. Các cột quan trọng:

| Cột | Ý nghĩa | Ghi chú |
|-----|---------|---------|
| `Mã hàng` | SKU đầy đủ (VD: `AMC38565S659`) | = Mã size + Mã hàng 2 + Màu |
| `Tên hàng / dịch vụ` | Tên hiển thị đầy đủ | VD: `Áo sơ mi-AMC565S659` |
| `Mã hàng 2` | **Tên hàng 2** — mã nhóm sản phẩm theo design+màu | VD: `AMC565S659` |
| `EVT` | Loại chứng từ | `Chức` |
| `Nhóm hàng` | Nhóm kho | `SHU101`, `SHU102` |
| `Tên nhóm hàng` | VD: `SỔ MI DÀI TAY`, `SỔ MI NGẮN TAY` | |
| `Đơn giá` | Giá bán | 395k → 745k |
| `Màu` | Mã màu/design | S659, M201... |
| `Ngừng sử dụng` | FALSE = đang bán, TRUE = ngừng | |
| `YẾU TỐ`, `YẾU TỐ s` | **Nhóm thương hiệu**: `AMC`, `ARC`, `AMD`... | |

> **⚠️ Key Insight:** Mỗi SKU đầy đủ = 1 dòng = 1 size cụ thể. Sản phẩm cha (Tên hàng 2) có nhiều size con.

---

### 🖼️ Hình 2 — Bảng Size (Nhóm Size)

| Size | Tên size | Nhóm size |
|------|---------|-----------|
| 38 | 38 | Nhóm 3 |
| 39 | 39 | Nhóm 3 |
| 40 | 40 | Nhóm 3 |
| 41 | 41 | Nhóm 3 |
| 42 | 42 | Nhóm 3 |
| 43 | 43 | Nhóm 3 |
| 44 | 44 | Nhóm 3 |
| 46 | 46 | Nhóm 3 |
| 48 | 48 | Nhóm 3 |

> **Key Insight:** Hiện tại có **Nhóm 3** gồm 9 size (38→48, bỏ 45/47). Tương lai có thể có thêm nhóm khác cho quần âu...

---

### 🖼️ Hình 3 — Form Đơn Đặt Hàng (UI ERP gốc) + Business Rules

#### 3a. Header Form
| Field | Loại | Ghi chú |
|-------|------|---------|
| Số CT | Input (readonly) | Auto-gen: `DH0426/0001` |
| Ngày CT | Date picker | Mặc định hôm nay |
| Chi nhánh | Dropdown | |
| Nhân viên KD | Dropdown | |
| Người tạo | Auto-fill | `Admin` |
| Mã khách hàng | Dropdown + search | |
| Mã đại lý | Dropdown | |
| Tên CTKM | Dropdown | **CKCB / TLDL** |
| Tên kh/hàng | Text | Auto-fill từ mã KH |
| Ghi chú | Textarea | Ghi chú toàn đơn — nhập 1 lần |
| Tổng tiền | Readonly | Tính tự động |
| PT Giao hàng | Dropdown | |
| Hình thức TT | Dropdown | |

#### 3b. Bảng Chi Tiết Đơn (Detail Lines)
| Cột | Ý nghĩa |
|-----|---------|
| Tên hàng 2 | **Input chính của user** — gõ mã (VD: `AMC545S659`) |
| MÃ CTBH | Auto-fill từ CTKM đã chọn ở header |
| TÊN CTBH | Auto-fill |
| Nhóm size | Auto-lookup từ Tên hàng 2 |
| SỐ LƯỢNG | **Ma trận size** — scroll list hiện các size của nhóm |
| SIZE DDH | Size cụ thể |
| SL DDH | Số lượng từng size (user nhập) |
| Ghi chú | Auto-fill từ header |
| YẾU TỐ | Thương hiệu (AMC, ARC...) |
| Mã hàng | Auto-gen SKU đầy đủ |
| Tên hàng / dịch vụ | Auto-fill |

#### 3c. ⭐ Business Rules (ghi chú cuối form)

```
1. Khách hàng chỉ cần thao tác: gõ Tên hàng 2, chọn CTKM và Ghi chú (nhập 1 lần)
2. Tên hàng 2 thuộc nhóm Size nào → cột số lượng chỉ tra roll list các size thuộc nhóm đó
3. Khách nhập số lượng cần đặt cho từng size
4. Với số lượng > 0: Tên hàng 2, mã CTBH, ghi chú tự load vào dòng đó
5. Lọc cột Tên hàng 2, remove null (ẩn dòng SL = 0)
```

---

### 🖼️ Hình 4 — Danh Mục Sản Phẩm (Product Master)

Dữ liệu mẫu thực tế:

| Tên hàng 2 | Đơn giá | Form | Tên Form | Tên nhóm hàng | Nhóm size |
|-----------|---------|------|---------|------------|-----------|
| AMC395M201 | 395,000 | AMC | Modern Fit | SỔ MI NGẮN TAY | Nhóm 3 |
| AMC525M102 | 525,000 | AMC | Modern Fit | SỔ MI NGẮN TAY | Nhóm 3 |
| AMC545S659 | 545,000 | AMC | Modern Fit | SỔ MI NGẮN TAY | Nhóm 3 |
| AMC565S655 | 565,000 | AMC | Modern Fit | SỔ MI NGẮN TAY | Nhóm 3 |
| AMC695S810 | 695,000 | AMC | Modern Fit | SỔ MI NGẮN TAY | Nhóm 3 |
| ARC355S101 | 355,000 | ARC | Regular | SỔ MI NGẮN TAY | Nhóm 3 |
| ARC370M101 | 370,000 | ARC | Regular | SỔ MI NGẮN TAY | Nhóm 3 |
| ARC380M105 | 380,000 | ARC | Regular | SỔ MI NGẮN TAY | Nhóm 3 |
| ARC445S537 | 445,000 | ARC | Regular | SỔ MI NGẮN TAY | Nhóm 3 |
| ARC470S391 | 470,000 | ARC | Regular | SỔ MI NGẮN TAY | Nhóm 3 |

> **Key Insight:** Form có 2 loại: `AMC` (Modern Fit) và `ARC` (Regular). Price range: 355k → 745k.

---

### 🖼️ Hình 5 — Bảng Mã Chương Trình Bán Hàng (CTBH)

| MÃ CTBH | TÊN CTBH |
|---------|---------|
| **CKCB** | Chiết khấu cơ bản |
| **TLDL** | Tích lũy du lịch |

> Khi user chọn CTKM ở header → tất cả dòng trong bảng chi tiết tự điền `MÃ CTBH` + `TÊN CTBH`.

---

## 2. DATA MODEL (JavaScript)

### 2a. Product Master
```js
const productMaster = [
  {
    ten_hang_2: "AMC545S659",       // KEY chính — user nhập
    nhom_hang: "SKU102",
    don_gia: 545000,
    design: "S659",
    mau: "S659",
    form: "AMC",                    // → YẾU TỐ (thương hiệu)
    ten_form: "Modern Fit",
    ten_hang_hoa: "Áo sơ mi-AMC545S659",
    ngung_su_dung: false,
    ten_nhom_hang: "SỔ MI NGẮN TAY",
    nhom_size: "Nhóm 3"            // → tra bảng size
  },
  // ...
];
```

### 2b. Size Groups
```js
const sizeGroups = {
  "Nhóm 3": [38, 39, 40, 41, 42, 43, 44, 46, 48],
  // "Nhóm 1": [...],
};
```

### 2c. SKU Builder
```js
// Pattern: {BRAND}{SIZE}{REST_OF_CODE}
// VD: AMC545S659 + size 40 → AMC40545S659
function buildSKU(ten_hang_2, size) {
  const brand = ten_hang_2.match(/^[A-Z]+/)[0]; // "AMC"
  return `${brand}${size}${ten_hang_2.slice(brand.length)}`;
}
```

### 2d. Order Structure
```js
const order = {
  // Header
  so_ct: "DH0526/0001",
  ngay_ct: "2026-05-05",
  chi_nhanh: "",
  ma_ctbh: "CKCB",             // Chọn 1 lần → áp xuống tất cả dòng
  ten_ctbh: "Chiết khấu cơ bản",
  ghi_chu: "",                   // Nhập 1 lần → copy xuống tất cả dòng
  hinh_thuc_tt: "",

  // Detail lines (chỉ các dòng SL > 0)
  lines: [
    {
      ten_hang_2: "AMC545S659",
      ma_ctbh: "CKCB",           // Auto-fill từ header
      ten_ctbh: "Chiết khấu cơ bản",
      nhom_size: "Nhóm 3",
      size: 40,
      so_luong: 2,               // User nhập
      ghi_chu: "abc",            // Auto-fill từ header
      yeu_to: "AMC",             // = form từ productMaster
      ma_hang: "AMC40545S659",   // buildSKU()
      ten_hang: "Áo sơ mi-AMC545S659",
      don_gia: 545000,
      thanh_tien: 1090000        // so_luong × don_gia
    }
  ]
};
```

---

## 3. BUSINESS LOGIC CHI TIẾT

### Luồng nhập đơn (Quick Order / Ma trận Size)

```
[User gõ Tên hàng 2 → autocomplete]
        ↓
[Lookup productMaster → lấy: nhom_size, don_gia, ten_hang_hoa, form]
        ↓
[Lookup sizeGroups[nhom_size] → danh sách size]
        ↓
[Render hàng trong bảng: cột SIZE là header, ô input per size]
        ↓
[User nhập SL vào ô size bất kỳ]
        ↓
[Real-time: tính tổng SP, tổng tiền]
        ↓
[Khi Submit: filter SL > 0 → generate order.lines]
  - ma_ctbh, ten_ctbh ← từ header dropdown
  - ghi_chu ← từ header input
  - yeu_to ← product.form (AMC / ARC)
  - ma_hang ← buildSKU(ten_hang_2, size)
        ↓
[Preview modal → Lưu → Gửi ERP]
```

### Quy tắc auto-fill
| Field | Nguồn | Trigger |
|-------|-------|---------|
| MÃ CTBH | Header dropdown CTKM | Chọn CTKM |
| TÊN CTBH | Bảng promotions | Chọn CTKM |
| Ghi chú dòng | Header input Ghi chú | Mỗi khi thêm sản phẩm |
| YẾU TỐ | `productMaster[ten_hang_2].form` | Nhập Tên hàng 2 |
| Nhóm size | `productMaster[ten_hang_2].nhom_size` | Nhập Tên hàng 2 |
| Mã hàng SKU | `buildSKU(ten_hang_2, size)` | Khi SL > 0 |
| Tên hàng | `productMaster[ten_hang_2].ten_hang_hoa` | Nhập Tên hàng 2 |

---

## 4. TODO LIST THEO PRIORITY

### 🔴 Sprint 1 — Data Foundation (1-2 ngày)
- [ ] Tạo `src/data/product_master.js` — import toàn bộ từ Hình 4 (~30+ sản phẩm)
- [ ] Tạo `src/data/size_groups.js` — Nhóm 3: [38,39,40,41,42,43,44,46,48]
- [ ] Tạo `src/data/promotions.js` — CKCB, TLDL
- [ ] Viết `buildSKU(ten_hang_2, size)` utility function

### 🔴 Sprint 2 — Order Matrix Component (2-3 ngày)
- [ ] Tạo `src/components/order-matrix/OrderMatrix.js`
- [ ] Render bảng NGANG: hàng = sản phẩm, cột = size
- [ ] Ô input số lượng per (sản phẩm × size)
- [ ] Auto-fill CTBH + Ghi chú từ header khi thêm dòng
- [ ] Real-time tính tổng SP + tổng tiền
- [ ] Filter/ẩn dòng SL = 0

### 🟡 Sprint 3 — UX & Header Form (1-2 ngày)
- [ ] Autocomplete Tên hàng 2 (fuzzy search productMaster, filter `ngung_su_dung=false`)
- [ ] Dropdown CTKM liên kết với bảng chi tiết
- [ ] Thêm/xóa dòng sản phẩm (nút X per hàng)
- [ ] Số CT auto-generate: `DH{MMYY}/{seq:04}`

### 🟡 Sprint 4 — Preview & Lưu (1-2 ngày)
- [ ] Modal preview đơn (chỉ hiện dòng SL > 0)
- [ ] Lưu vào `localStorage`
- [ ] Trang Lịch sử đơn hiển thị từ localStorage
- [ ] Export CSV/Excel cơ bản

### 🟢 Sprint 5 — Tính năng nâng cao
- [ ] Chi tiết đơn — click xem lại đơn cũ
- [ ] Tính chiết khấu theo CKCB %
- [ ] Điểm TLDL tích lũy
- [ ] ERP API sync

---

## 5. CẤU TRÚC FILE ĐỀ XUẤT

```
Web-Order-Santino/
├── index.html                    ✅ (cần update loadSizes logic)
├── login.html                    ✅
├── PLAN.md                       📄 (file này)
└── src/
    ├── data/
    │   ├── product_master.js      🔴 Cần tạo mới (thay products_data.js)
    │   ├── size_groups.js         🔴 Cần tạo mới
    │   ├── promotions.js          🔴 Cần tạo mới
    │   └── translations.js        ✅
    ├── components/
    │   ├── product-card/          ✅
    │   ├── filter-bar/            ✅
    │   └── order-matrix/          🔴 Cần tạo mới
    │       ├── OrderMatrix.js
    │       └── order-matrix.css
    └── css/
        └── pages/
            └── b2b-portal.css     ✅
```

---

## 6. UI MA TRẬN SIZE — Mockup

```
┌──────────────────────────────────────────────────────────────────────┐
│ [Tìm Tên hàng 2: AMC545S659___________] [+ Thêm vào đơn]           │
├──────────────────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬─────┤
│ Tên hàng 2       │ 38 │ 39 │ 40 │ 41 │ 42 │ 43 │ 44 │ 46 │ 48 │  X │
├──────────────────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼─────┤
│ AMC545S659       │    │    │ 2  │    │ 2  │    │    │    │    │ 🗑 │
│ 545,000đ · AMC   │    │    │    │    │    │    │    │    │    │    │
├──────────────────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼─────┤
│ ARC370M101       │    │ 1  │ 3  │    │    │ 2  │    │    │    │ 🗑 │
│ 370,000đ · ARC   │    │    │    │    │    │    │    │    │    │    │
├──────────────────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴─────┤
│ CTKM: [CKCB - Chiết khấu cơ bản ▼]  Ghi chú: [__________________] │
│                          Tổng: 8 SP · 4,340,000đ   [👁 Preview] [✓]│
└──────────────────────────────────────────────────────────────────────┘
```

---

> [!IMPORTANT]
> **Ma trận size** là core feature chưa có. `loadSizes()` hiện tại chỉ là placeholder — phải viết lại hoàn toàn theo đúng business rule từ Hình 3.

> [!NOTE]
> **SKU pattern cần verify**: `AMC` + `40` + `545S659` = `AMC40545S659`. Xác nhận lại với vài SKU từ Hình 1 trước khi code cứng.

> [!WARNING]
> Luôn filter `ngung_su_dung = false` trước khi hiển thị sản phẩm trong autocomplete.

---

## 7. KIẾN TRÚC TỐI ƯU UI/UX & DATA PIPELINE (TECHNICAL BLUEPRINT v2.0)
> *Cập nhật dựa trên phiên phản biện giữa Architect và User (Mr. Đăng).*

### 7.1. Visual Cue cho Auto-fill (UX)
- **Vấn đề:** Ẩn dữ liệu auto-fill (CTKM, Ghi chú) khỏi từng dòng để nhẹ DOM, nhưng user sẽ hoang mang.
- **Giải pháp:** Khi Header có dữ liệu, hiển thị một `badge` nhỏ ở góc Card sản phẩm: `<span class="badge badge-success"><span class="icon">check</span> Đã áp dụng CTKM</span>`.

### 7.2. Incremental Update cho Preview Data (Performance)
- **Vấn đề:** Duyệt `reduce` toàn bộ hàng trăm ô input khi bấm Preview sẽ gây treo (freeze) điện thoại.
- **Giải pháp:** Quản lý state `OrderState.previewData` dạng Object Map. Update ngay lập tức (real-time) tại sự kiện `oninput` của ô số lượng. Bấm Preview chỉ việc render thẳng Data có sẵn ra Table.

### 7.3. Strict Validation cho SKU Builder
- **Vấn đề:** Các mã hàng dị (hàng mẫu, hàng km) không bắt đầu bằng AMC/ARC sẽ bị lỗi cắt chuỗi.
- **Giải pháp:** 
  ```javascript
  function buildSKU(ten_hang_2, size) {
      const match = ten_hang_2.match(/^[A-Z]+/);
      if (!match) return `INVALID_${ten_hang_2}_${size}`; // Tránh crash
      const brand = match[0];
      return `${brand}${size}${ten_hang_2.slice(brand.length)}`;
  }
  ```

### 7.4. Data Integrity Check trước khi gửi ERP
- **Logic:** So sánh `Tổng số lượng hiển thị trên UI` === `Tổng số lượng các dòng SKU đã sinh ra trong Array gửi đi`.
- **Hành động:** Nếu lệch (sai khác dù chỉ 1 đơn vị), block submit và báo lỗi. Tránh đền tiền cho công ty!

### 7.5. Chạm khắc UX tinh tế (Micro-interactions)
- **Nút "Quick Clear":** Thêm một icon X nhỏ cạnh tên sản phẩm. Khi click, reset toàn bộ số lượng các ô size của mã hàng đó về 0 ngay lập tức.
- **Tooltip Giải thích SKU:** Tại bảng Preview, bôi đậm mã SKU sinh ra (VD: **AMC40545S659**). Hover vào sẽ hiện tooltip giải thích công thức: `[Brand: AMC] + [Size: 40] + [Code: 545S659]`.

---
> 🚀 **KẾT LUẬN TỪ ARCHITECT & USER:** Bản Blueprint v2.0 đã đạt mức độ hoàn hảo ("Không tì vết"). Sẵn sàng chuyển giao cho Developer thi công!
