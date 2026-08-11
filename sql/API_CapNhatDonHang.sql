-- =============================================
-- Author:      Antigravity
-- Create date: 2026-08-10
-- Description: API Cập nhật Đơn hàng có phân quyền động theo DB (Khớp chuẩn schema WEB_OrderDetailTbl & WA_UserPermisstion)
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[API_CapNhatDonHang]
    @OrderJson NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1. Lấy thông tin chứng từ & User Context từ JSON payload
        DECLARE @DocumentID NVARCHAR(50)     = ISNULL(JSON_VALUE(@OrderJson, '$.so_ct'), JSON_VALUE(@OrderJson, '$.DocumentID'));
        DECLARE @UserRole NVARCHAR(50)       = JSON_VALUE(@OrderJson, '$.UserRole');
        DECLARE @UserEmployeeID NVARCHAR(50) = JSON_VALUE(@OrderJson, '$.UserEmployeeID');
        DECLARE @UserManagerID NVARCHAR(50)  = JSON_VALUE(@OrderJson, '$.UserManagerID');
        DECLARE @UserObjectID NVARCHAR(50)   = JSON_VALUE(@OrderJson, '$.UserObjectID');

        -- Kiểm tra mã chứng từ
        IF ISNULL(@DocumentID, '') = '' 
        BEGIN
            IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
            SELECT -1 AS [Success], N'Lỗi: Thiếu mã chứng từ đơn hàng!' AS [Message], NULL AS [DocumentID];
            RETURN;
        END

        -- 2. Lấy đơn hàng hiện tại từ Database
        DECLARE @ExistUserCreate NVARCHAR(50);
        DECLARE @ExistEmployeeID NVARCHAR(50);
        DECLARE @ExistObjectID NVARCHAR(50);
        DECLARE @isLock BIT;

        SELECT 
            @ExistUserCreate = [UserCreate],
            @ExistEmployeeID = [EmployeeID],
            @ExistObjectID   = [ObjectID],
            @isLock          = ISNULL([isLock], 0)
        FROM [dbo].[WEB_OrderTbl] WITH (NOLOCK)
        WHERE [DocumentID] = @DocumentID;

        IF @ExistUserCreate IS NULL AND @ExistEmployeeID IS NULL AND @ExistObjectID IS NULL
        BEGIN
            IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
            SELECT -1 AS [Success], N'Lỗi: Đơn hàng không tồn tại trong hệ thống!' AS [Message], @DocumentID AS [DocumentID];
            RETURN;
        END

        -- 3. KIỂM TRA TRẠNG THÁI KHÓA (isLock = 1)
        IF @isLock = 1
        BEGIN
            IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
            SELECT -1 AS [Success], N'Lỗi: Đơn hàng đã bị khóa/đã duyệt, không thể chỉnh sửa!' AS [Message], @DocumentID AS [DocumentID];
            RETURN;
        END

        -- 4. KIỂM TRA QUYỀN SỬA ĐƠN ĐỘNG TỪ BẢNG PHÂN QUYỀN (Không hardcode chuỗi Admin/Manager)
        DECLARE @IsAdminOrManager BIT = 0;

        -- Check cờ isAdmin/isManager từ nhóm quyền UserGroupPermisstion
        IF ISNULL(@UserRole, '') <> '' AND EXISTS (
            SELECT 1 
            FROM [dbo].[WA_UserGroupPermisstion] p 
            LEFT JOIN [dbo].[WA_Menu] m ON p.[MenuID] = m.[MenuID] 
            WHERE p.[UserGroupID] = @UserRole 
              AND (m.[FormName] = 'WEB_OrderFrm' OR m.[FormName] IS NULL)
              AND (p.[isAdmin] = 1 OR p.[isManager] = 1)
        )
        BEGIN
            SET @IsAdminOrManager = 1;
        END

        -- Check cờ isAdmin/isManager từ phân quyền người dùng cụ thể UserPermisstion (Dùng cột UserName)
        IF @IsAdminOrManager = 0 AND (ISNULL(@UserObjectID, '') <> '' OR ISNULL(@UserEmployeeID, '') <> '') AND EXISTS (
            SELECT 1 
            FROM [dbo].[WA_UserPermisstion] p
            LEFT JOIN [dbo].[WA_Menu] m ON p.[MenuID] = m.[MenuID]
            WHERE (p.[UserName] = @UserObjectID OR p.[UserName] = @UserEmployeeID)
              AND (m.[FormName] = 'WEB_OrderFrm' OR m.[FormName] IS NULL)
              AND (p.[isAdmin] = 1 OR p.[isManager] = 1)
        )
        BEGIN
            SET @IsAdminOrManager = 1;
        END

        -- Nếu không phải Admin/Manager theo cấu hình DB -> Tiến hành kiểm tra chính chủ
        IF @IsAdminOrManager = 0
        BEGIN
            DECLARE @CanEdit BIT = 0;

            -- a) Là người tạo đơn
            IF @UserObjectID IS NOT NULL AND @UserObjectID <> '' AND @ExistUserCreate = @UserObjectID
                SET @CanEdit = 1;
            ELSE IF @UserEmployeeID IS NOT NULL AND @UserEmployeeID <> '' AND (@ExistUserCreate = @UserEmployeeID OR @ExistEmployeeID = @UserEmployeeID)
                SET @CanEdit = 1;
            -- b) Là khách hàng/đại lý tạo đơn cho chính mình
            ELSE IF @UserObjectID IS NOT NULL AND @UserObjectID <> '' AND @ExistObjectID = @UserObjectID
                SET @CanEdit = 1;

            IF @CanEdit = 0
            BEGIN
                IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
                SELECT -1 AS [Success], N'Lỗi: Bạn không có quyền chỉnh sửa đơn hàng của người khác!' AS [Message], @DocumentID AS [DocumentID];
                RETURN;
            END
        END

        -- 5. THỰC HIỆN CẬP NHẬT HEADER ĐƠN HÀNG
        DECLARE @MaKH NVARCHAR(50)        = JSON_VALUE(@OrderJson, '$.ma_kh');
        DECLARE @TenKH NVARCHAR(255)      = COALESCE(JSON_VALUE(@OrderJson, '$.kh_ten'), JSON_VALUE(@OrderJson, '$.ten_kh'));
        DECLARE @GhiChu NVARCHAR(500)     = JSON_VALUE(@OrderJson, '$.ghi_chu');
        DECLARE @TongTien DECIMAL(18,2)   = CAST(ISNULL(COALESCE(JSON_VALUE(@OrderJson, '$.total_money'), JSON_VALUE(@OrderJson, '$.tong_tien')), 0) AS DECIMAL(18,2));
        DECLARE @PTThanhToan NVARCHAR(50) = COALESCE(JSON_VALUE(@OrderJson, '$.ht_thanh_toan'), JSON_VALUE(@OrderJson, '$.payment_type'));

        UPDATE [dbo].[WEB_OrderTbl]
        SET 
            [ObjectID]      = ISNULL(@MaKH, [ObjectID]),
            [ObjectName]    = ISNULL(@TenKH, [ObjectName]),
            [Memo]          = ISNULL(@GhiChu, [Memo]),
            [BaseTotal]     = CASE WHEN @TongTien > 0 THEN @TongTien ELSE [BaseTotal] END,
            [PaymentTypeID] = ISNULL(@PTThanhToan, [PaymentTypeID])
        WHERE [DocumentID] = @DocumentID;

        -- 6. THỰC HIỆN CẬP NHẬT DETAIL LINES
        DECLARE @LinesJson NVARCHAR(MAX) = COALESCE(JSON_QUERY(@OrderJson, '$.lines'), JSON_QUERY(@OrderJson, '$.Lines'));
        IF @LinesJson IS NOT NULL AND LEN(@LinesJson) > 2
        BEGIN
            DELETE FROM [dbo].[WEB_OrderDetailTbl] WHERE [DocumentID] = @DocumentID;

            -- Kiểm tra xem payload là kiểu ma trận size (chi_tiet_size) hay kiểu dẳng phẳng (flat lines)
            IF EXISTS (SELECT 1 FROM OPENJSON(@LinesJson) l WHERE JSON_QUERY(l.[value], '$.chi_tiet_size') IS NOT NULL)
            BEGIN
                INSERT INTO [dbo].[WEB_OrderDetailTbl] (
                    [UserAutoID], [DocumentID], [ItemID], [ItemName], [Size], 
                    [MauSac], [Quantity], [UnitPrice], [Amount], [TotalAmount], [STT]
                )
                SELECT 
                    NEWID(),
                    @DocumentID,
                    (SELECT TOP 1 ci.ItemID FROM [dbo].[CF_ItemTbl] ci
                     WHERE ci.ItemName2 = COALESCE(JSON_VALUE(l.[value], '$.ten_hang_2'), JSON_VALUE(l.[value], '$.ItemID'))
                       AND ci.Size     = LTRIM(RTRIM(JSON_VALUE(sz.[value], '$.size')))
                     ORDER BY ci.ItemID),
                    COALESCE(JSON_VALUE(l.[value], '$.ten_hang'), JSON_VALUE(l.[value], '$.ItemName')),
                    LTRIM(RTRIM(JSON_VALUE(sz.[value], '$.size'))),
                    COALESCE(JSON_VALUE(l.[value], '$.mau'), JSON_VALUE(l.[value], '$.MauSac')),
                    CAST(JSON_VALUE(sz.[value], '$.qty') AS DECIMAL(18,2)),
                    CAST(COALESCE(JSON_VALUE(l.[value], '$.don_gia'), JSON_VALUE(l.[value], '$.UnitPrice'), '0') AS DECIMAL(18,2)),
                    CAST(JSON_VALUE(sz.[value], '$.qty') AS DECIMAL(18,2)) * CAST(COALESCE(JSON_VALUE(l.[value], '$.don_gia'), JSON_VALUE(l.[value], '$.UnitPrice'), '0') AS DECIMAL(18,2)),
                    CAST(JSON_VALUE(sz.[value], '$.qty') AS DECIMAL(18,2)) * CAST(COALESCE(JSON_VALUE(l.[value], '$.don_gia'), JSON_VALUE(l.[value], '$.UnitPrice'), '0') AS DECIMAL(18,2)),
                    DENSE_RANK() OVER (ORDER BY COALESCE(JSON_VALUE(l.[value], '$.ten_hang_2'), JSON_VALUE(l.[value], '$.ItemID')))
                FROM OPENJSON(@LinesJson) l
                CROSS APPLY OPENJSON(l.[value], '$.chi_tiet_size') sz
                WHERE ISNULL(TRY_CAST(JSON_VALUE(sz.[value], '$.qty') AS DECIMAL(18,2)), 0) > 0;
            END
            ELSE
            BEGIN
                INSERT INTO [dbo].[WEB_OrderDetailTbl] (
                    [UserAutoID], [DocumentID], [ItemID], [ItemName], 
                    [Quantity], [UnitPrice], [Amount], [TotalAmount], [Size], [MauSac]
                )
                SELECT 
                    NEWID(),
                    @DocumentID,
                    COALESCE(JSON_VALUE(value, '$.ItemID'), JSON_VALUE(value, '$.ItemCode'), JSON_VALUE(value, '$.ten_hang_2')),
                    COALESCE(JSON_VALUE(value, '$.ItemName'), JSON_VALUE(value, '$.ten_hang')),
                    CAST(ISNULL(COALESCE(JSON_VALUE(value, '$.Quantity'), JSON_VALUE(value, '$.so_luong')), 1) AS DECIMAL(18,2)),
                    CAST(ISNULL(COALESCE(JSON_VALUE(value, '$.UnitPrice'), JSON_VALUE(value, '$.Price'), JSON_VALUE(value, '$.don_gia')), 0) AS DECIMAL(18,2)),
                    CAST(ISNULL(COALESCE(JSON_VALUE(value, '$.Amount'), JSON_VALUE(value, '$.thanh_tien')), 0) AS DECIMAL(18,2)),
                    CAST(ISNULL(COALESCE(JSON_VALUE(value, '$.TotalAmount'), JSON_VALUE(value, '$.Amount'), JSON_VALUE(value, '$.thanh_tien')), 0) AS DECIMAL(18,2)),
                    COALESCE(JSON_VALUE(value, '$.Size'), JSON_VALUE(value, '$.size')),
                    COALESCE(JSON_VALUE(value, '$.MauSac'), JSON_VALUE(value, '$.Color'), JSON_VALUE(value, '$.mau'))
                FROM OPENJSON(@LinesJson);
            END

            -- Tự động cập nhật lại BaseTotal trong WEB_OrderTbl theo tổng số tiền thực tế của các dòng chi tiết
            UPDATE [dbo].[WEB_OrderTbl]
            SET [BaseTotal] = ISNULL((SELECT SUM([Amount]) FROM [dbo].[WEB_OrderDetailTbl] WHERE [DocumentID] = @DocumentID), [BaseTotal])
            WHERE [DocumentID] = @DocumentID;
        END

        COMMIT TRANSACTION;

        SELECT 1 AS [Success], N'Cập nhật đơn hàng thành công!' AS [Message], @DocumentID AS [DocumentID];
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        SELECT -1 AS [Success], N'Lỗi SQL: ' + ERROR_MESSAGE() AS [Message], NULL AS [DocumentID];
    END CATCH
END;
GO
