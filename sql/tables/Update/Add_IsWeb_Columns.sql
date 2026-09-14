-- =============================================
-- Bổ sung cột isWeb/BarCode còn thiếu trên 1 số DB (vd DB test) so với code hiện tại.
-- Cần thiết cho: API_DanhMuc (Customer/CTKM), API_LaySanPham.
-- Idempotent: chạy lại nhiều lần không lỗi.
-- =============================================

-- CF_ObjectTbl.isWeb: NULL = ẩn khỏi web (ISNULL(isWeb,0)=1 trong API_DanhMuc)
IF COL_LENGTH('[dbo].[CF_ObjectTbl]', 'isWeb') IS NULL
    ALTER TABLE [dbo].[CF_ObjectTbl] ADD [isWeb] BIT NULL DEFAULT 0;

-- CF_CTKMTbl.IsWeb: NULL = ẩn khỏi web (ISNULL(IsWeb,0)=1 trong API_DanhMuc)
IF COL_LENGTH('[dbo].[CF_CTKMTbl]', 'IsWeb') IS NULL
    ALTER TABLE [dbo].[CF_CTKMTbl] ADD [IsWeb] BIT NULL DEFAULT 0;

-- CF_ItemTbl.isWeb: NULL = vẫn hiển thị (ISNULL(isWeb,1)=1 trong API_LaySanPham) — ngược chiều mặc định với 2 bảng trên
IF COL_LENGTH('[dbo].[CF_ItemTbl]', 'isWeb') IS NULL
    ALTER TABLE [dbo].[CF_ItemTbl] ADD [isWeb] BIT NULL;

-- CF_ItemTbl.BarCode: dùng trong API_LaySanPham
IF COL_LENGTH('[dbo].[CF_ItemTbl]', 'BarCode') IS NULL
    ALTER TABLE [dbo].[CF_ItemTbl] ADD [BarCode] NVARCHAR(50) NULL;
