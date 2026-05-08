-- =============================================
-- Author:      Antigravity
-- Create date: 2026-05-08
-- Description: API Danh mục vạn năng (Bản chi tiết 100% cột nghiệp vụ)
-- =============================================
CREATE PROCEDURE [dbo].[API_DanhMuc]
    @Loai NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Trả về danh sách các Loại danh mục hỗ trợ
    IF @Loai IS NULL OR @Loai = ''
    BEGIN
        SELECT 'Branch' AS [Loai], N'Chi nhánh' AS [TenLoai]
        UNION ALL SELECT 'Employee', N'Nhân viên'
        UNION ALL SELECT 'PaymentType', N'Hình thức thanh toán'
        UNION ALL SELECT 'PaymentTerm', N'Điều khoản thanh toán'
        ORDER BY [TenLoai];
        RETURN;
    END

    -- 2. Dữ liệu chi tiết theo từng bảng
    
    -- CHI NHÁNH (Lọc hoạt động, lấy thêm thông tin liên hệ)
    IF @Loai = 'Branch'
    BEGIN
        SELECT 
            [BranchID]   AS [id], 
            [BranchName] AS [name],
            [DiaChi]     AS [address],
            [DienThoai]  AS [phone],
            [isDefault]  AS [is_default]
        FROM [dbo].[CF_BranchTbl]
        WHERE [isDisable] = 0 OR [isDisable] IS NULL
        ORDER BY [STT], [BranchName];
    END

    -- NHÂN VIÊN (Lọc người đang làm việc, lấy thêm bộ phận/ĐT)
    ELSE IF @Loai = 'Employee'
    BEGIN
        SELECT 
            [EmployeeID]   AS [id], 
            [EmployeeName] AS [name],
            [BoPhan]       AS [department],
            [DienThoai]    AS [phone]
        FROM [dbo].[CF_EmployeeTbl]
        WHERE ([NgayNghiViec] IS NULL OR [NgayNghiViec] > GETDATE())
        ORDER BY [EmployeeName];
    END

    -- HÌNH THỨC THANH TOÁN
    ELSE IF @Loai = 'PaymentType'
    BEGIN
        SELECT 
            [PaymentTypeID]   AS [id], 
            [PaymentTypeName] AS [name]
        FROM [dbo].[CF_PaymentTypeTbl]
        ORDER BY [PaymentTypeID];
    END

    -- ĐIỀU KHOẢN THANH TOÁN (Lấy thêm số ngày đến hạn thanh toán)
    ELSE IF @Loai = 'PaymentTerm'
    BEGIN
        SELECT 
            [PaymentTermID]      AS [id], 
            [PaymentTermName]    AS [name],
            [BalanceDueDays]     AS [due_days]
        FROM [dbo].[CF_PaymentTermTbl]
        ORDER BY [PaymentTermID];
    END
END
