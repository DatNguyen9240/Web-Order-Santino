-- =========================================================================
-- SCRIPT KIỂM TRA ĐỒNG BỘ CƠ SỞ DỮ LIỆU (DATABASE SYNC CHECKLIST)
-- Áp dụng cho: Santino Web Order System
-- Hướng dẫn: Kết nối vào Database cần kiểm tra (DB Test hoặc DB Chính), bấm F5 (Execute)
-- =========================================================================

SET NOCOUNT ON;

PRINT '=========================================================================';
PRINT '  BÁO CÁO KIỂM TRA TÍNH ĐỒNG BỘ DỮ LIỆU - WEB ORDER SANTINO';
PRINT '  Thời gian kiểm tra: ' + CONVERT(VARCHAR, GETDATE(), 120);
PRINT '  Database hiện tại:  ' + DB_NAME();
PRINT '=========================================================================';
PRINT '';

-- Bảng tạm lưu kết quả kiểm tra
IF OBJECT_ID('tempdb..#SyncCheckResult') IS NOT NULL DROP TABLE #SyncCheckResult;
CREATE TABLE #SyncCheckResult (
    [STT] INT IDENTITY(1,1),
    [Nhom] NVARCHAR(50),
    [DoiTuong] NVARCHAR(100),
    [Loai] NVARCHAR(50),
    [TrangThai] NVARCHAR(20),
    [GhiChu] NVARCHAR(255)
);

-- =========================================================================
-- 1. KIỂM TRA CÁC BẢNG DỮ LIỆU CHÍNH & CỘT QUAN TRỌNG
-- =========================================================================
-- Bảng WEB_OrderTbl
IF OBJECT_ID('dbo.WEB_OrderTbl', 'U') IS NOT NULL
    INSERT INTO #SyncCheckResult VALUES (N'1. Bảng dữ liệu', 'WEB_OrderTbl', 'TABLE', N'✅ ĐÃ CÓ', N'Bảng chính lưu đơn hàng');
ELSE
    INSERT INTO #SyncCheckResult VALUES (N'1. Bảng dữ liệu', 'WEB_OrderTbl', 'TABLE', N'❌ THIẾU', N'Cần chạy: sql/tables/WEB_OrderTbl.sql');

-- Bảng WEB_OrderDetailTbl
IF OBJECT_ID('dbo.WEB_OrderDetailTbl', 'U') IS NOT NULL
BEGIN
    INSERT INTO #SyncCheckResult VALUES (N'1. Bảng dữ liệu', 'WEB_OrderDetailTbl', 'TABLE', N'✅ ĐÃ CÓ', N'Bảng chi tiết đơn hàng');
    
    -- Kiểm tra cột STT trong WEB_OrderDetailTbl (Cực kỳ quan trọng để sắp xếp in)
    IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'WEB_OrderDetailTbl' AND COLUMN_NAME = 'STT')
        INSERT INTO #SyncCheckResult VALUES (N'1. Cột dữ liệu', 'WEB_OrderDetailTbl.STT', 'COLUMN', N'✅ ĐÃ CÓ', N'Cột STT chuẩn để giữ thứ tự in');
    ELSE
        INSERT INTO #SyncCheckResult VALUES (N'1. Cột dữ liệu', 'WEB_OrderDetailTbl.STT', 'COLUMN', N'❌ THIẾU', N'Cần chạy: ALTER TABLE WEB_OrderDetailTbl ADD STT INT NULL');
END
ELSE
    INSERT INTO #SyncCheckResult VALUES (N'1. Bảng dữ liệu', 'WEB_OrderDetailTbl', 'TABLE', N'❌ THIẾU', N'Cần chạy: sql/tables/WEB_OrderDetailTbl.sql');

-- Kiểm tra cột ObjectID trong SY_User (Phục vụ phân quyền cấp NPP/Đại lý)
IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'SY_User' AND COLUMN_NAME = 'ObjectID')
    INSERT INTO #SyncCheckResult VALUES (N'1. Cột dữ liệu', 'SY_User.ObjectID', 'COLUMN', N'✅ ĐÃ CÓ', N'Cột gán mã khách cho User');
ELSE
    INSERT INTO #SyncCheckResult VALUES (N'1. Cột dữ liệu', 'SY_User.ObjectID', 'COLUMN', N'⚠️ CHƯA CÓ', N'Nên chạy: ALTER TABLE SY_User ADD ObjectID VARCHAR(50) NULL');


-- =========================================================================
-- 2. KIỂM TRA STORED PROCEDURES (API LOGIC)
-- =========================================================================
DECLARE @ProcList TABLE (ProcName NVARCHAR(100), FileSource NVARCHAR(100));
INSERT INTO @ProcList VALUES
    ('API_TaoDonHang', 'sql/API_TaoDonHang.sql'),
    ('API_CapNhatDonHang', 'sql/API_CapNhatDonHang.sql'),
    ('API_InDonHang', 'sql/API_InDonHang.sql'),
    ('API_DanhMuc', 'sql/API_DanhMuc.sql'),
    ('API_LayCacTruongGiaoDien', 'sql/API_LayCacTruongGiaoDien.sql'),
    ('API_LaySanPham', 'sql/API_LaySanPham.sql'),
    ('API_LayBangSize', 'sql/API_LayBangSize.sql'),
    ('API_LayThongTinCongTy', 'sql/API_LayThongTinCongTy.sql'),
    ('API_XoaDonHang', 'sql/API_XoaDonHang.sql'),
    ('API_LayDanhSachKhachHang', 'sql/API_Customer_Management.sql'),
    ('API_KhachHang_Luu', 'sql/API_KhachHang_Luu.sql'),
    ('API_LayDanhSachNhom', 'sql/tables/Update/Migrate_Permissions_And_Menus.sql'),
    ('API_LayQuyenNhomDayDu', 'sql/tables/Update/Migrate_Permissions_And_Menus.sql'),
    ('API_LuuQuyenCuaNhom', 'sql/tables/Update/Migrate_Permissions_And_Menus.sql'),
    ('API_DongBoQuyenTruyCap', 'sql/tables/Update/Migrate_Permissions_And_Menus.sql'),
    ('API_LayDanhSachMenuTatCa', 'sql/tables/Update/Migrate_Permissions_And_Menus.sql'),
    ('API_LuuMenu', 'sql/tables/Update/Migrate_Permissions_And_Menus.sql'),
    ('API_LuuThuTuMenu', 'sql/tables/Update/Migrate_Permissions_And_Menus.sql');

DECLARE @pName NVARCHAR(100), @pFile NVARCHAR(100);
DECLARE proc_cursor CURSOR FOR SELECT ProcName, FileSource FROM @ProcList;
OPEN proc_cursor;
FETCH NEXT FROM proc_cursor INTO @pName, @pFile;
WHILE @@FETCH_STATUS = 0
BEGIN
    IF OBJECT_ID('dbo.' + @pName, 'P') IS NOT NULL
        INSERT INTO #SyncCheckResult VALUES (N'2. Stored Procedure', @pName, 'PROCEDURE', N'✅ ĐÃ CÓ', N'Đã sẵn sàng');
    ELSE
        INSERT INTO #SyncCheckResult VALUES (N'2. Stored Procedure', @pName, 'PROCEDURE', N'❌ THIẾU', N'Cần chạy file: ' + @pFile);
    FETCH NEXT FROM proc_cursor INTO @pName, @pFile;
END
CLOSE proc_cursor;
DEALLOCATE proc_cursor;

-- =========================================================================
-- 3. KIỂM TRA HÀM NGHIỆP VỤ (FUNCTIONS)
-- =========================================================================
IF OBJECT_ID('dbo.fn_DocSoThanhChu', 'FN') IS NOT NULL
    INSERT INTO #SyncCheckResult VALUES (N'3. Hàm Function', 'fn_DocSoThanhChu', 'FUNCTION', N'✅ ĐÃ CÓ', N'Đọc tiền thành chữ khi in đơn');
ELSE
    INSERT INTO #SyncCheckResult VALUES (N'3. Hàm Function', 'fn_DocSoThanhChu', 'FUNCTION', N'❌ THIẾU', N'Cần chạy: sql/fn_DocSoThanhChu.sql');

-- =========================================================================
-- 4. KIỂM TRA METADATA BIỂU MẪU ĐỘNG (FORM BUILDER)
-- =========================================================================
-- Kiểm tra Form WEB_OrderFrm trong SY_FrmLstTbl
IF EXISTS (SELECT 1 FROM dbo.SY_FrmLstTbl WHERE FormID = 'WEB_OrderFrm')
    INSERT INTO #SyncCheckResult VALUES (N'4. Cấu hình Form', 'SY_FrmLstTbl (WEB_OrderFrm)', 'METADATA', N'✅ ĐÃ CÓ', N'Biểu mẫu Đơn hàng');
ELSE
    INSERT INTO #SyncCheckResult VALUES (N'4. Cấu hình Form', 'SY_FrmLstTbl (WEB_OrderFrm)', 'METADATA', N'❌ THIẾU', N'Cần chạy: sql/Fix_All_Dynamic_Forms.sql');

-- Kiểm tra API actions trong SY_FrmMstActTbl cho WEB_OrderFrm
IF EXISTS (SELECT 1 FROM dbo.SY_FrmMstActTbl WHERE FormID = 'WEB_OrderFrm' AND UPPER(MaterAction) = 'API' AND UPPER(Action) = 'CREATE')
    INSERT INTO #SyncCheckResult VALUES (N'4. Cấu hình Form', 'SY_FrmMstActTbl (API CREATE)', 'METADATA', N'✅ ĐÃ CÓ', N'API lưu đơn hàng');
ELSE
    INSERT INTO #SyncCheckResult VALUES (N'4. Cấu hình Form', 'SY_FrmMstActTbl (API CREATE)', 'METADATA', N'❌ THIẾU', N'Cần chạy: sql/Fix_All_Dynamic_Forms.sql');

-- Kiểm tra Form WEB_OrderDetailFrm
IF EXISTS (SELECT 1 FROM dbo.SY_FrmLstTbl WHERE FormID = 'WEB_OrderDetailFrm')
    INSERT INTO #SyncCheckResult VALUES (N'4. Cấu hình Form', 'SY_FrmLstTbl (WEB_OrderDetailFrm)', 'METADATA', N'✅ ĐÃ CÓ', N'Biểu mẫu Chi tiết đơn hàng');
ELSE
    INSERT INTO #SyncCheckResult VALUES (N'4. Cấu hình Form', 'SY_FrmLstTbl (WEB_OrderDetailFrm)', 'METADATA', N'❌ THIẾU', N'Cần chạy: sql/Fix_All_Dynamic_Forms.sql');

-- =========================================================================
-- 5. KIỂM TRA MENU VÀ ĐIỀU HƯỚNG
-- =========================================================================
IF OBJECT_ID('dbo.WA_Menu', 'U') IS NOT NULL
BEGIN
    IF EXISTS (
        SELECT 1 FROM dbo.WA_Menu 
        WHERE FormName = 'WEB_OrderFrm' 
           OR (COL_LENGTH('dbo.WA_Menu', 'URLPara') IS NOT NULL AND URLPara = '/order')
    )
        INSERT INTO #SyncCheckResult VALUES (N'5. Menu', 'WA_Menu (/order)', 'MENU', N'✅ ĐÃ CÓ', N'Menu Đặt hàng');
    ELSE
        INSERT INTO #SyncCheckResult VALUES (N'5. Menu', 'WA_Menu (/order)', 'MENU', N'⚠️ CHƯA CÓ', N'Cần chạy: sql/tables/Update/Clean_Redundant_Menus.sql');
END
ELSE
    INSERT INTO #SyncCheckResult VALUES (N'5. Menu', 'WA_Menu', 'TABLE', N'❌ THIẾU', N'Bảng WA_Menu chưa tồn tại trong CSDL');


-- =========================================================================
-- HIỂN THỊ KẾT QUẢ TỔNG QUAN
-- =========================================================================
SELECT 
    [STT],
    [Nhom],
    [DoiTuong],
    [Loai],
    [TrangThai],
    [GhiChu]
FROM #SyncCheckResult
ORDER BY [STT];

-- Thống kê số lượng
DECLARE @Total INT = (SELECT COUNT(1) FROM #SyncCheckResult);
DECLARE @Passed INT = (SELECT COUNT(1) FROM #SyncCheckResult WHERE [TrangThai] LIKE N'%ĐÃ CÓ%');
DECLARE @Failed INT = (SELECT COUNT(1) FROM #SyncCheckResult WHERE [TrangThai] LIKE N'%THIẾU%');
DECLARE @Warn INT = (SELECT COUNT(1) FROM #SyncCheckResult WHERE [TrangThai] LIKE N'%CHƯA CÓ%');

PRINT '-------------------------------------------------------------------------';
PRINT '  TỔNG KẾT:';
PRINT '  - Tổng số hạng mục kiểm tra: ' + CAST(@Total AS VARCHAR);
PRINT '  - Hạng mục đã đồng bộ:       ' + CAST(@Passed AS VARCHAR) + ' ✅';
PRINT '  - Hạng mục còn THIẾU:        ' + CAST(@Failed AS VARCHAR) + ' ❌';
PRINT '  - Hạng mục cảnh báo/nên có:  ' + CAST(@Warn AS VARCHAR) + ' ⚠️';
PRINT '-------------------------------------------------------------------------';

IF @Failed = 0
    PRINT '===> TUYỆT VỜI: DATABASE NÀY ĐÃ ĐỒNG BỘ ĐẦY ĐỦ CÁC THÀNH PHẦN CỐT LÕI!';
ELSE
    PRINT '===> CẢNH BÁO: CÒN ' + CAST(@Failed AS VARCHAR) + ' HẠNG MỤC THIẾU. Vui lòng xem cột GhiChu ở trên để chạy file bù!';
PRINT '=========================================================================';
