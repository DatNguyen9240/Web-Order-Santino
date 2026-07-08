-- =============================================
-- API_DanhMuc — chỉ hỗ trợ 1 cách gọi:
--   - SSMS/FE: @Loai=... (string), @TimKiem=... (string)
--   -> Đơn giản hóa, không parse JSON
-- =============================================
ALTER PROCEDURE [dbo].[API_DanhMuc]
    @Loai       NVARCHAR(100)  = NULL,
    @TimKiem    NVARCHAR(MAX)  = NULL,
    @chinhanh   NVARCHAR(50)   = NULL,
    @Page           INT            = 1,
    @PageSize       INT            = 50,
    @UserRole       NVARCHAR(50)   = NULL,
    @UserEmployeeID NVARCHAR(50)   = NULL,
    @UserManagerID  NVARCHAR(50)   = NULL,
    @UserObjectID   NVARCHAR(50)   = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SET @TimKiem = LTRIM(RTRIM(ISNULL(@TimKiem, '')));

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
        UNION ALL SELECT 'Location',    N'Tỉnh/Thành phố'
        UNION ALL SELECT 'ObjectGroup',  N'Nhóm khách hàng'
        UNION ALL SELECT 'UserGroup',   N'Nhóm quyền'
        UNION ALL SELECT 'Dealer',      N'Đại lý/NPP'
        ORDER BY [TenLoai];
        RETURN;
    END

    IF @Loai = 'ObjectGroup'
    BEGIN
        SELECT
            [ObjectGroupID]   AS [id],
            [ObjectGroupName] AS [name]
        FROM [dbo].[CF_ObjectGroupTbl]
        WHERE (@TimKiem = '' OR [ObjectGroupName] LIKE N'%' + @TimKiem + N'%'
                             OR [ObjectGroupID]   LIKE N'%' + @TimKiem + N'%')
        ORDER BY [ObjectGroupName];
        RETURN;
    END

    IF @Loai = 'UserGroup'
    BEGIN
        SELECT
            [UserGroupID]   AS [id],
            [UserGroupName] AS [name]
        FROM [dbo].[SY_UserGroup]
        WHERE (@TimKiem = '' OR [UserGroupName] LIKE N'%' + @TimKiem + N'%'
                             OR [UserGroupID]   LIKE N'%' + @TimKiem + N'%')
        ORDER BY [UserGroupName];
        RETURN;
    END

    ELSE IF @Loai = 'Dealer'
    BEGIN
        SELECT
            [ObjectID]     AS [id],
            [ObjectName]   AS [name]
        FROM [dbo].[CF_ObjectTbl]
        WHERE ([isDisable] = 0 OR [isDisable] IS NULL)
          AND [ObjectID] IN (SELECT DISTINCT [ObjectID] FROM [dbo].[SY_User] WHERE [UserGroupID] IN ('DL', 'Ban dai ly'))
          AND (@TimKiem = '' OR [ObjectName] LIKE N'%' + @TimKiem + N'%' OR [ObjectID] LIKE N'%' + @TimKiem + N'%')
        ORDER BY [ObjectName];
        RETURN;
    END

    IF @Loai = 'Location'
    BEGIN
        SELECT
            [LocationID]   AS [id],
            [LocationName] AS [name]
        FROM [dbo].[CF_LocationTbl]
        WHERE (@TimKiem = '' OR [LocationName] LIKE N'%' + @TimKiem + N'%')
        ORDER BY [LocationName];
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

    ELSE IF @Loai = 'UserPermission'
    BEGIN
        SELECT 
            -- Check xem group có quyền admin ở chức năng Đơn hàng không
            CAST(ISNULL((SELECT TOP 1 [isAdmin] FROM [dbo].[WA_UserGroupPermisstion] WHERE [UserGroupID] = @UserRole AND [MenuID] = 'WEB_OrderFrm'), 0) AS BIT) AS [isAdmin],
            -- Check xem group có quyền manager ở chức năng Đơn hàng không
            CAST(ISNULL((SELECT TOP 1 [isManager] FROM [dbo].[WA_UserGroupPermisstion] WHERE [UserGroupID] = @UserRole AND [MenuID] = 'WEB_OrderFrm'), 0) AS BIT) AS [isManager],
            -- Check xem có phải nhóm Đại lý hay không
            CAST(CASE WHEN UPPER(@UserRole) IN ('DL', 'BAN DAI LY') THEN 1 ELSE 0 END AS BIT) AS [isAgent]
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
          -- PHÂN QUYỀN: Kế toán/Admin xem hết, NV KD xem KH của mình, NPP xem KH thuộc quản lý, KH tự xem mình
          AND (
               -- CÚ CHECK TỰ ĐỘNG: Bất kỳ nhóm nào được tick isAdmin hoặc isManager ở trang WEB_OrderFrm thì mặc định nhả hết Khách hàng
                EXISTS (SELECT 1 FROM [dbo].[WA_UserGroupPermisstion] WHERE [UserGroupID] = @UserRole AND [MenuID] = 'WEB_OrderFrm' AND ([isAdmin] = 1 OR [isManager] = 1))
               
                OR (@UserEmployeeID IS NOT NULL AND @UserEmployeeID <> '' AND [EmployeeID] = @UserEmployeeID)
                OR (@UserObjectID IS NOT NULL AND @UserObjectID <> '' AND [NhaPhanPhoi] = @UserObjectID) -- NPP quản lý khách hàng
                OR (@UserObjectID IS NOT NULL AND @UserObjectID <> '' AND [ObjectID] = @UserObjectID)
               -- Fallback: Nếu không truyền phân quyền gì cả, cứ xem như admin để backward-compatibility
               OR (ISNULL(@UserRole, '') = '' AND ISNULL(@UserEmployeeID, '') = '' AND ISNULL(@UserObjectID, '') = '')
          )
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
        FROM [dbo].[WEB_OrderTbl]
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
        DECLARE @FilterCustomerID NVARCHAR(50) = NULL;

        IF LEFT(@TimKiem, 1) = '{' AND ISJSON(@TimKiem) = 1
        BEGIN
            SET @TuKhoa = ISNULL(JSON_VALUE(@TimKiem, '$.q'), '');
            DECLARE @strTuNgay NVARCHAR(20) = JSON_VALUE(@TimKiem, '$.from');
            DECLARE @strDenNgay NVARCHAR(20) = JSON_VALUE(@TimKiem, '$.to');
            SET @chinhanh = ISNULL(JSON_VALUE(@TimKiem, '$.chinhanh'), @chinhanh);
            SET @Page = ISNULL(CAST(JSON_VALUE(@TimKiem, '$.page') AS INT), @Page);
            SET @PageSize = ISNULL(CAST(JSON_VALUE(@TimKiem, '$.limit') AS INT), @PageSize);
            SET @FilterCustomerID = JSON_VALUE(@TimKiem, '$.customer_id');
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
            ISNULL((SELECT SUM(Quantity) FROM [dbo].[WEB_OrderDetailTbl] d WHERE d.DocumentID = o.DocumentID), 0) AS [total_qty],
            COUNT(*) OVER() AS [total_rows]
        FROM [dbo].[WEB_OrderTbl] o
        WHERE (@TuKhoa = '' OR [DocumentID] LIKE N'%' + @TuKhoa + N'%' OR [ObjectName] LIKE N'%' + @TuKhoa + N'%')
          AND (@FilterCustomerID IS NULL OR @FilterCustomerID = '' OR [ObjectID] = @FilterCustomerID)
          AND (@chinhanh IS NULL OR @chinhanh = '' OR [BranchID] = @chinhanh)
          AND (@TuNgay IS NULL OR [DocumentDate] >= @TuNgay)
          AND (@DenNgay IS NULL OR [DocumentDate] <= @DenNgay)
          -- BỨC TƯỜNG LỬA BẢO VỆ ĐƠN HÀNG: Chỉ Sếp mới xem hết, NV xem đơn của mình, KH/Đại lý xem đơn của họ và cấp dưới
          AND (
               EXISTS (SELECT 1 FROM [dbo].[WA_UserGroupPermisstion] WHERE [UserGroupID] = @UserRole AND [MenuID] = 'WEB_OrderFrm' AND ([isAdmin] = 1 OR [isManager] = 1))
               OR (@UserEmployeeID IS NOT NULL AND @UserEmployeeID <> '' AND [EmployeeID] = @UserEmployeeID)
               OR (@UserObjectID IS NOT NULL AND @UserObjectID <> '' AND (
                    [ObjectID] = @UserObjectID 
                    OR ISNULL([MaDaiLy], '') = @UserObjectID
                    -- Khách hàng của đơn thuộc cấp dưới (quản lý bởi NPP/Đại lý này)
                    OR EXISTS (SELECT 1 FROM [dbo].[CF_ObjectTbl] subC WHERE subC.ObjectID = o.ObjectID AND subC.NhaPhanPhoi = @UserObjectID)
                    -- Đại lý của đơn thuộc cấp dưới (quản lý bởi NPP/Đại lý này)
                    OR EXISTS (SELECT 1 FROM [dbo].[CF_ObjectTbl] subD WHERE subD.ObjectID = o.MaDaiLy AND subD.NhaPhanPhoi = @UserObjectID)
                  ))
               OR (ISNULL(@UserRole, '') = '' AND ISNULL(@UserEmployeeID, '') = '' AND ISNULL(@UserObjectID, '') = '')
          )
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
            ISNULL((SELECT SUM(Quantity) FROM [dbo].[WEB_OrderDetailTbl] d WHERE d.DocumentID = @TimKiem), 0) AS [total_qty],
             (
                SELECT 
                    CI.[ItemName2] AS [ten_hang_2],
                    MAX(D.[ItemName]) AS [ten_hang],
                    MAX(CI.[MauSac]) AS [mau],
                    SUM(D.[Quantity]) AS [so_luong],
                    MAX(D.[UnitPrice]) AS [don_gia],
                    SUM(D.[TotalAmount]) AS [thanh_tien],
                    (
                        SELECT 
                            subD.[Size] AS [size], 
                            SUM(subD.[Quantity]) AS [qty]
                        FROM [dbo].[WEB_OrderDetailTbl] subD
                        LEFT JOIN [dbo].[CF_ItemTbl] subCI ON subD.[ItemID] = subCI.[ItemID]
                        WHERE subD.[DocumentID] = h.[DocumentID]
                          AND subCI.[ItemName2] = CI.[ItemName2]
                        GROUP BY subD.[Size]
                        FOR JSON PATH
                    ) AS [chi_tiet_size]
                FROM [dbo].[WEB_OrderDetailTbl] D
                LEFT JOIN [dbo].[CF_ItemTbl] CI ON D.[ItemID] = CI.[ItemID]
                WHERE D.[DocumentID] = h.[DocumentID]
                GROUP BY CI.[ItemName2]
                ORDER BY MIN(D.[STT]) ASC
                FOR JSON PATH
             ) AS [lines]
        FROM [dbo].[WEB_OrderTbl] h
        LEFT JOIN [dbo].[CF_EmployeeTbl] e ON h.[EmployeeID] = e.[EmployeeID]
        WHERE h.DocumentID = @TimKiem
          -- BỨC TƯỜNG LỬA CHẶN XEM LÉN CHI TIẾT ĐƠN HÀNG (Người ngoài biết mã cũng không xem được)
          AND (
               EXISTS (SELECT 1 FROM [dbo].[WA_UserGroupPermisstion] WHERE [UserGroupID] = @UserRole AND [MenuID] = 'WEB_OrderFrm' AND ([isAdmin] = 1 OR [isManager] = 1))
               OR (@UserEmployeeID IS NOT NULL AND @UserEmployeeID <> '' AND h.[EmployeeID] = @UserEmployeeID)
               OR (@UserObjectID IS NOT NULL AND @UserObjectID <> '' AND (
                    h.[ObjectID] = @UserObjectID 
                    OR ISNULL(h.[MaDaiLy], '') = @UserObjectID
                    -- Khách hàng của đơn thuộc cấp dưới (quản lý bởi NPP/Đại lý này)
                    OR EXISTS (SELECT 1 FROM [dbo].[CF_ObjectTbl] subC WHERE subC.ObjectID = h.ObjectID AND subC.NhaPhanPhoi = @UserObjectID)
                    -- Đại lý của đơn thuộc cấp dưới (quản lý bởi NPP/Đại lý này)
                    OR EXISTS (SELECT 1 FROM [dbo].[CF_ObjectTbl] subD WHERE subD.ObjectID = h.MaDaiLy AND subD.NhaPhanPhoi = @UserObjectID)
                  ))
               OR (ISNULL(@UserRole, '') = '' AND ISNULL(@UserEmployeeID, '') = '' AND ISNULL(@UserObjectID, '') = '')
          );
        RETURN;
    END
END
GO

-- ── TEST trực tiếp (SSMS) ─────────────────────────────────────────────
-- Không lọc → ra hết nhân viên
EXEC [dbo].[API_DanhMuc] @Loai = 'Employee';

-- Lọc trực tiếp bằng @TimKiem
EXEC [dbo].[API_DanhMuc] @Loai = 'Employee', @TimKiem = N'ngu';

-- Admin xem chi tiết đơn hàng (thay 'MÃ_ĐƠN_HÀNG_Ở_ĐÂY' bằng mã thực tế)
EXEC [dbo].[API_DanhMuc] 
    @Loai = 'OrderDetail', 
    @TimKiem = 'MÃ_ĐƠN_HÀNG_Ở_ĐÂY', 
    @UserRole = 'Admin';
