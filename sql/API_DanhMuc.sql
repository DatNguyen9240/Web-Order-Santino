-- =============================================
-- API_DanhMuc — hỗ trợ cả 2 cách gọi:
--   1. FE gọi: @Loai nhận toàn bộ JSON (giống API_LaySanPham)
--   2. SSMS:   EXEC @Loai='Employee', @TimKiem='ngu'
-- =============================================
ALTER PROCEDURE [dbo].[API_DanhMuc]
    @Loai    NVARCHAR(4000) = NULL,
    @TimKiem NVARCHAR(100)  = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Nếu backend truyền nguyên JSON {"Loai":"...","TimKiem":"..."} vào @Loai
    IF @Loai LIKE '{%"Loai"%}'
    BEGIN
        -- Ưu tiên @TimKiem param nếu có, không thì lấy từ JSON
        IF @TimKiem IS NULL
            SET @TimKiem = JSON_VALUE(@Loai, '$.TimKiem');
        SET @Loai = JSON_VALUE(@Loai, '$.Loai');
    END

    SET @TimKiem = LTRIM(RTRIM(ISNULL(@TimKiem, '')));

    IF @Loai IS NULL OR @Loai = ''
    BEGIN
        SELECT 'Branch'      AS [Loai], N'Chi nhánh'            AS [TenLoai]
        UNION ALL SELECT 'Employee',    N'Nhân viên'
        UNION ALL SELECT 'PaymentType', N'Hình thức thanh toán'
        UNION ALL SELECT 'PaymentTerm', N'Điều khoản thanh toán'
        ORDER BY [TenLoai];
        RETURN;
    END

    IF @Loai = 'Branch'
    BEGIN
        SELECT
            [BranchID]   AS [id],
            [BranchName] AS [name],
            [DiaChi]     AS [address],
            [DienThoai]  AS [phone],
            [isDefault]  AS [is_default]
        FROM [dbo].[CF_BranchTbl]
        WHERE ([isDisable] = 0 OR [isDisable] IS NULL)
          AND (@TimKiem = '' OR [BranchName] LIKE N'%' + @TimKiem + N'%'
                             OR [DiaChi]     LIKE N'%' + @TimKiem + N'%')
        ORDER BY [STT], [BranchName];
    END

    ELSE IF @Loai = 'Employee'
    BEGIN
        SELECT
            [EmployeeID]   AS [id],
            [EmployeeName] AS [name],
            [BoPhan]       AS [department],
            [DienThoai]    AS [phone]
        FROM [dbo].[CF_EmployeeTbl]
        WHERE ([NgayNghiViec] IS NULL OR [NgayNghiViec] > GETDATE())
          AND (@TimKiem = '' OR [EmployeeName] LIKE N'%' + @TimKiem + N'%'
                             OR [BoPhan]       LIKE N'%' + @TimKiem + N'%'
                             OR [DienThoai]    LIKE N'%' + @TimKiem + N'%')
        ORDER BY [EmployeeName];
    END

    ELSE IF @Loai = 'PaymentType'
    BEGIN
        SELECT
            [PaymentTypeID]   AS [id],
            [PaymentTypeName] AS [name]
        FROM [dbo].[CF_PaymentTypeTbl]
        WHERE (@TimKiem = '' OR [PaymentTypeName] LIKE N'%' + @TimKiem + N'%')
        ORDER BY [PaymentTypeID];
    END

    ELSE IF @Loai = 'PaymentTerm'
    BEGIN
        SELECT
            [PaymentTermID]   AS [id],
            [PaymentTermName] AS [name],
            [BalanceDueDays]  AS [due_days]
        FROM [dbo].[CF_PaymentTermTbl]
        WHERE (@TimKiem = '' OR [PaymentTermName] LIKE N'%' + @TimKiem + N'%')
        ORDER BY [PaymentTermID];
    END
END
GO

-- ── TEST trực tiếp (SSMS) ─────────────────────────────────────────────
-- Không lọc → ra hết nhân viên
EXEC [dbo].[API_DanhMuc] @Loai = 'Employee';

-- Lọc trực tiếp bằng @TimKiem
EXEC [dbo].[API_DanhMuc] @Loai = 'Employee', @TimKiem = N'ngu';

-- ── TEST qua JSON (giống FE gọi) ──────────────────────────────────────
EXEC [dbo].[API_DanhMuc] @Loai = N'{"Loai":"Employee","TimKiem":"ngu"}';
