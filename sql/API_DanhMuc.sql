-- =============================================
-- API_DanhMuc — chỉ hỗ trợ 1 cách gọi:
--   - SSMS/FE: @Loai=... (string), @TimKiem=... (string)
--   -> Đơn giản hóa, không parse JSON
-- =============================================
ALTER PROCEDURE [dbo].[API_DanhMuc]
    @Loai    NVARCHAR(100)  = NULL,
    @TimKiem NVARCHAR(100)  = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SET @TimKiem = LTRIM(RTRIM(ISNULL(@TimKiem, '')));


    IF @Loai IS NULL OR @Loai = ''
    BEGIN
        SELECT 'Branch'      AS [Loai], N'Chi nhánh'            AS [TenLoai]
        UNION ALL SELECT 'Employee',    N'Nhân viên'
        UNION ALL SELECT 'PaymentType', N'Hình thức thanh toán'
        UNION ALL SELECT 'PaymentTerm', N'Điều khoản thanh toán'
        UNION ALL SELECT 'Customer',    N'Khách hàng'
        ORDER BY [TenLoai];
        RETURN;
    END

    IF @Loai = 'Branch'
    BEGIN
        SELECT
            [BranchName] AS [name],
            [BranchID]   AS [id],
            [STT]        AS [stt],
            [isDefault]  AS [is_default]
        FROM [dbo].[CF_BranchTbl]
        WHERE ([isDisable] = 0 OR [isDisable] IS NULL)
          AND (@TimKiem = '' OR [BranchName] LIKE N'%' + @TimKiem + N'%'
                             OR [BranchID]   LIKE N'%' + @TimKiem + N'%')
        ORDER BY [STT], [BranchName];
        RETURN;
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

    ELSE IF @Loai = 'Customer'
    BEGIN
        SELECT
            [ObjectID]     AS [id],
            [ObjectName]   AS [name],
            [Address]      AS [address],
            [EmployeeID]   AS [employee_id],
            [BranchID]     AS [branch_id]
        FROM [dbo].[CF_ObjectTbl]
        WHERE ([isDisable] = 0 OR [isDisable] IS NULL)
          AND (@TimKiem = '' OR [ObjectName] LIKE N'%' + @TimKiem + N'%'
                             OR [ObjectID]   LIKE N'%' + @TimKiem + N'%'
                             OR [Phone]      LIKE N'%' + @TimKiem + N'%')
        ORDER BY [ObjectName];
    END
END
GO

-- ── TEST trực tiếp (SSMS) ─────────────────────────────────────────────
-- Không lọc → ra hết nhân viên
EXEC [dbo].[API_DanhMuc] @Loai = 'Employee';

-- Lọc trực tiếp bằng @TimKiem
EXEC [dbo].[API_DanhMuc] @Loai = 'Employee', @TimKiem = N'ngu';

