-- =============================================
-- API_DanhMuc — chỉ hỗ trợ 1 cách gọi:
--   - SSMS/FE: @Loai=... (string), @TimKiem=... (string)
--   -> Đơn giản hóa, không parse JSON
-- =============================================
ALTER PROCEDURE [dbo].[API_DanhMuc]
    @Loai       NVARCHAR(100)  = NULL,
    @TimKiem    NVARCHAR(MAX)  = NULL,
    @chinhanh   NVARCHAR(50)   = NULL,
    @Page       INT            = 1,
    @PageSize   INT            = 50
AS
BEGIN
    SET NOCOUNT ON;

    SET @TimKiem = LTRIM(RTRIM(ISNULL(@TimKiem, '')));
    IF CHARINDEX('|PAGE:', ISNULL(@chinhanh, '')) > 0
    BEGIN
        SET @Page = CAST(SUBSTRING(@chinhanh, CHARINDEX('|PAGE:', @chinhanh) + 6, LEN(@chinhanh)) AS INT);
        SET @chinhanh = SUBSTRING(@chinhanh, 1, CHARINDEX('|PAGE:', @chinhanh) - 1);
    END

    SET @Page = ISNULL(@Page, 1);
    SET @PageSize = ISNULL(@PageSize, 50);
    IF @Page < 1 SET @Page = 1;
    IF @PageSize < 1 SET @PageSize = 50;

    IF @Loai IS NULL OR @Loai = ''
    BEGIN
        SELECT 'Branch'      AS [Loai], N'Chi nhánh'            AS [TenLoai]
        UNION ALL SELECT 'Employee',    N'Nhân viên'
        UNION ALL SELECT 'PaymentType', N'Hình thức thanh toán'
        UNION ALL SELECT 'PaymentTerm', N'Điều khoản thanh toán'
        UNION ALL SELECT 'Customer',    N'Khách hàng'
        UNION ALL SELECT 'Promotion',   N'Chương trình khuyến mại'
        UNION ALL SELECT 'PTGiaoHang',  N'Phương tiện giao hàng'
        UNION ALL SELECT 'Remark',      N'Diễn giải (Mẫu)'
        UNION ALL SELECT 'Note',        N'Ghi chú (Mẫu)'
        UNION ALL SELECT 'DeliveryPerson', N'Người giao hàng'
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
            [BranchID]     AS [branch_id],
            [ObjectGroupID] AS [group_id]
        FROM [dbo].[CF_ObjectTbl]
        WHERE ([isDisable] = 0 OR [isDisable] IS NULL)
          AND (@TimKiem = '' OR [ObjectName] LIKE N'%' + @TimKiem + N'%'
                             OR [ObjectID]   LIKE N'%' + @TimKiem + N'%'
                             OR [Phone]      LIKE N'%' + @TimKiem + N'%')
          AND (@chinhanh IS NULL OR @chinhanh = '' 
               OR ISNULL([BranchID], '') = ''
               OR CHARINDEX(',' + @chinhanh + ',', ',' + REPLACE(ISNULL([BranchID], ''), ' ', '') + ',') > 0)
        ORDER BY [ObjectName]
        OFFSET (@Page - 1) * 200 ROWS
        FETCH NEXT 200 ROWS ONLY;
        RETURN;
    END

    ELSE IF @Loai = 'Promotion'
    BEGIN
        SELECT
            [ChietKhau] AS [id],
            [CTKM]      AS [name]
        FROM [dbo].[CF_CTKMTbl]
        WHERE (@TimKiem = '' OR [CTKM] LIKE N'%' + @TimKiem + N'%')
          AND ([NgayKetThuc] IS NULL OR [NgayKetThuc] >= CAST(GETDATE() AS DATE))
        ORDER BY [CTKM];
        RETURN;
    END

    ELSE IF @Loai = 'PTGiaoHang'
    BEGIN
        SELECT
            [PTGiaoHang]    AS [id],
            [TenPTGiaoHang] AS [name],
            [GhiChu]        AS [memo]
        FROM [dbo].[CF_PTGiaoHangTbl]
        WHERE (@TimKiem = '' OR [TenPTGiaoHang] LIKE N'%' + @TimKiem + N'%'
                             OR [PTGiaoHang]    LIKE N'%' + @TimKiem + N'%')
        ORDER BY [PTGiaoHang];
        RETURN;
    END

    ELSE IF @Loai = 'Remark'
    BEGIN
        SELECT DISTINCT
            [Memo] AS [id],
            [Memo] AS [name]
        FROM [dbo].[InvoiceRequestTbl]
        WHERE [Memo] IS NOT NULL AND [Memo] <> ''
          AND (@TimKiem = '' OR [Memo] LIKE N'%' + @TimKiem + N'%')
        ORDER BY [Memo];
        RETURN;
    END

    ELSE IF @Loai = 'Note'
    BEGIN
        SELECT DISTINCT
            [Notes] AS [id],
            [Notes] AS [name]
        FROM [dbo].[OrderTbl]
        WHERE [Notes] IS NOT NULL AND [Notes] <> ''
          AND (@TimKiem = '' OR [Notes] LIKE N'%' + @TimKiem + N'%')
        ORDER BY [Notes];
        RETURN;
    END

    ELSE IF @Loai = 'DeliveryPerson'
    BEGIN
        SELECT
            [NguoiGiao] AS [id],
            [NguoiGiao] AS [name],
            [GhiChu]    AS [memo]
        FROM [dbo].[CF_NguoiGiaoTbl]
        WHERE (@TimKiem = '' OR [NguoiGiao] LIKE N'%' + @TimKiem + N'%'
                             OR [GhiChu]    LIKE N'%' + @TimKiem + N'%')
        ORDER BY [NguoiGiao];
        RETURN;
    END

    ELSE IF @Loai = 'OrderSource'
    BEGIN
        SELECT
            [NguonDon] AS [id],
            [NguonDon] AS [name],
            [GhiChu]   AS [memo]
        FROM [dbo].[CF_NguonDonTbl]
        WHERE (@TimKiem = '' OR [NguonDon] LIKE N'%' + @TimKiem + N'%'
                             OR [GhiChu]   LIKE N'%' + @TimKiem + N'%')
        ORDER BY [NguonDon];
        RETURN;
    END

    ELSE IF @Loai = 'Order'
    BEGIN
        DECLARE @TuKhoa NVARCHAR(100) = @TimKiem;
        DECLARE @TuNgay DATETIME = NULL;
        DECLARE @DenNgay DATETIME = NULL;

        IF LEFT(@TimKiem, 1) = '{' AND ISJSON(@TimKiem) = 1
        BEGIN
            SET @TuKhoa = ISNULL(JSON_VALUE(@TimKiem, '$.q'), '');
            DECLARE @strTuNgay NVARCHAR(20) = JSON_VALUE(@TimKiem, '$.from');
            DECLARE @strDenNgay NVARCHAR(20) = JSON_VALUE(@TimKiem, '$.to');
            SET @chinhanh = JSON_VALUE(@TimKiem, '$.chinhanh');
            SET @Page = ISNULL(CAST(JSON_VALUE(@TimKiem, '$.page') AS INT), @Page);
            SET @PageSize = ISNULL(CAST(JSON_VALUE(@TimKiem, '$.limit') AS INT), @PageSize);
            IF @strTuNgay IS NOT NULL AND @strTuNgay <> '' SET @TuNgay = TRY_CAST(@strTuNgay AS DATETIME);
            IF @strDenNgay IS NOT NULL AND @strDenNgay <> '' SET @DenNgay = TRY_CAST(@strDenNgay AS DATETIME);
        END

        SET @Page = ISNULL(@Page, 1);
        SET @PageSize = ISNULL(@PageSize, 50);
        IF @Page < 1 SET @Page = 1;
        IF @PageSize < 1 SET @PageSize = 50;

        SELECT
            [DocumentID]   AS [id],
            [DocumentID]   AS [so_ct],
            [DocumentDate] AS [ngay_ct],
            [BranchID]     AS [chi_nhanh],
            [ObjectID]     AS [ma_kh],
            [ObjectName]   AS [kh_ten],
            [BaseTotal]    AS [total_money],
            [Memo]         AS [dien_giai],
            [Notes]        AS [ghi_chu],
            [CTKM]         AS [ma_ctbh],
            [EmployeeID]   AS [nvkd],
            [isLock]       AS [is_lock],
            ISNULL((SELECT SUM(Quantity) FROM [dbo].[OrderDetailTbl] d WHERE d.DocumentID = o.DocumentID), 0) AS [total_qty]
        FROM [dbo].[OrderTbl] o
        WHERE (@TuKhoa = '' OR [DocumentID] LIKE N'%' + @TuKhoa + N'%' OR [ObjectName] LIKE N'%' + @TuKhoa + N'%')
          AND (@chinhanh IS NULL OR @chinhanh = '' OR [BranchID] = @chinhanh)
          AND (@TuNgay IS NULL OR [DocumentDate] >= @TuNgay)
          AND (@DenNgay IS NULL OR [DocumentDate] <= @DenNgay)
        ORDER BY [DateCreate] DESC
        OFFSET (@Page - 1) * @PageSize ROWS
        FETCH NEXT @PageSize ROWS ONLY;
        RETURN;
    END

    ELSE IF @Loai = 'OrderDetail'
    BEGIN
        SELECT TOP 1
            h.[DocumentID] AS [id],
            h.[DocumentID] AS [so_ct],
            h.[DocumentDate] AS [ngay_ct],
            h.[BranchID] AS [chi_nhanh],
            h.[ObjectID] AS [ma_kh],
            h.[ObjectName] AS [kh_ten],
            ISNULL(e.[EmployeeName], h.[EmployeeID]) AS [nvkd],
            h.[Memo] AS [dien_giai],
            h.[Notes] AS [ghi_chu],
            h.[CTKM] AS [ma_ctbh],
            h.[NguoiGiao] AS [nguoi_giao],
            h.[PTGiaoHang] AS [pt_giao],
            h.[NguonDon] AS [nguon_don],
            h.[MaDaiLy] AS [ma_dl],
            h.[PaymentTermID] AS [dieu_khoan],
            h.[PaymentTypeID] AS [ht_thanh_toan],
            h.[NgayThanhToan] AS [ngay_tt],
            h.[BaseTotal] AS [total_money],
            h.[KhachDua] AS [khach_dua],
            h.[isLock] AS [is_lock],
            ISNULL((SELECT SUM(Quantity) FROM [dbo].[OrderDetailTbl] d WHERE d.DocumentID = @TimKiem), 0) AS [total_qty],
             (SELECT 
                CASE 
                    WHEN d.[ItemID] IS NULL AND CHARINDEX('|', d.[ItemName]) > 0 
                    THEN SUBSTRING(d.[ItemName], CHARINDEX('|', d.[ItemName]) + 1, CHARINDEX('|', d.[ItemName], CHARINDEX('|', d.[ItemName]) + 1) - CHARINDEX('|', d.[ItemName]) - 1)
                    ELSE ISNULL(d.[ItemID], '') 
                END AS [sku],
                ISNULL(i.[ItemName2], 
                    CASE 
                        WHEN d.[ItemID] IS NULL AND CHARINDEX('|', d.[ItemName]) > 0 
                        THEN SUBSTRING(d.[ItemName], 1, CHARINDEX('|', d.[ItemName]) - 1)
                        ELSE ISNULL(d.[ItemID], '') 
                    END
                ) AS [ten_hang_2],
                CASE 
                    WHEN d.[ItemID] IS NULL AND CHARINDEX('|', d.[ItemName]) > 0 
                    THEN SUBSTRING(d.[ItemName], CHARINDEX('|', d.[ItemName], CHARINDEX('|', d.[ItemName]) + 1) + 1, LEN(d.[ItemName]))
                    ELSE d.[ItemName] 
                END AS [ten_hang],
                d.[Size] AS [size],
                d.[MauSac] AS [mau],
                d.[Quantity] AS [so_luong],
                d.[UnitPrice] AS [don_gia],
                d.[TotalAmount] AS [thanh_tien]
             FROM [dbo].[OrderDetailTbl] d 
             LEFT JOIN [dbo].[CF_ItemTbl] i ON d.[ItemID] = i.[ItemID]
             WHERE d.DocumentID = @TimKiem 
             FOR JSON PATH, INCLUDE_NULL_VALUES) AS [lines]
        FROM [dbo].[OrderTbl] h
        LEFT JOIN [dbo].[CF_EmployeeTbl] e ON h.[EmployeeID] = e.[EmployeeID]
        WHERE h.DocumentID = @TimKiem;
        RETURN;
    END
END
GO

-- ── TEST trực tiếp (SSMS) ─────────────────────────────────────────────
-- Không lọc → ra hết nhân viên
EXEC [dbo].[API_DanhMuc] @Loai = 'Employee';

-- Lọc trực tiếp bằng @TimKiem
EXEC [dbo].[API_DanhMuc] @Loai = 'Employee', @TimKiem = N'ngu';
