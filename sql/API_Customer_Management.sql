-- =========================================================================
-- STORED PROCEDURES FOR CUSTOMER & USER ACCOUNT MANAGEMENT
-- =========================================================================

-- 1. API_NguoiDung_Luu
-- Lưu thông tin tài khoản (Tạo mới hoặc Cập nhật) - Không chứa logic mật khẩu trực tiếp
IF OBJECT_ID('dbo.API_NguoiDung_Luu') IS NOT NULL
    DROP PROCEDURE [dbo].[API_NguoiDung_Luu];
GO

CREATE PROCEDURE [dbo].[API_NguoiDung_Luu]
    @UserName NVARCHAR(50),
    @HoTen NVARCHAR(250),
    @UserGroupID NVARCHAR(50) = NULL,
    @ObjectID NVARCHAR(50),
    @Disable BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @Disable IS NULL SET @Disable = 0;
    IF @UserGroupID IS NULL OR @UserGroupID = '' SET @UserGroupID = 'KHACH';
    
    IF EXISTS (SELECT 1 FROM [dbo].[SY_User] WHERE [UserName] = @UserName)
    BEGIN
        UPDATE [dbo].[SY_User]
        SET [HoTen] = @HoTen,
            [TenNgan] = @HoTen,
            [UserGroupID] = @UserGroupID,
            [ObjectID] = @ObjectID,
            [Disable] = @Disable
        WHERE [UserName] = @UserName;
        
        SELECT @UserName AS [id], N'Cập nhật tài khoản người dùng thành công' AS [message];
    END
    ELSE
    BEGIN
        INSERT INTO [dbo].[SY_User] ([UserName], [HoTen], [TenNgan], [UserGroupID], [ObjectID], [Disable])
        VALUES (@UserName, @HoTen, @HoTen, @UserGroupID, @ObjectID, @Disable);
        
        SELECT @UserName AS [id], N'Tạo mới tài khoản người dùng thành công' AS [message];
    END
END;
GO


-- 2. API_LayDanhSachKhachHang
-- Lấy danh sách khách hàng đầy đủ và tài khoản đăng nhập đi kèm (CHỈ LẤY CÁC KHÁCH HÀNG ĐƯỢC TICK isWeb = 1 BÊN ERP)
IF OBJECT_ID('dbo.API_LayDanhSachKhachHang') IS NOT NULL
    DROP PROCEDURE [dbo].[API_LayDanhSachKhachHang];
GO

CREATE PROCEDURE [dbo].[API_LayDanhSachKhachHang]
    @q NVARCHAR(MAX) = NULL,
    @TimKiem NVARCHAR(255) = NULL,
    @ObjectGroupID NVARCHAR(50) = NULL,
    @Page INT = NULL,
    @Limit INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @q IS NOT NULL AND ISJSON(@q) = 1
    BEGIN
        SET @TimKiem = ISNULL(@TimKiem, JSON_VALUE(@q, '$.TimKiem'));
        SET @ObjectGroupID = ISNULL(@ObjectGroupID, JSON_VALUE(@q, '$.ObjectGroupID'));
        SET @Page = TRY_CAST(JSON_VALUE(@q, '$.page') AS INT);
        SET @Limit = TRY_CAST(JSON_VALUE(@q, '$.limit') AS INT);
    END
    
    IF @Page IS NULL OR @Page <= 0 SET @Page = 1;
    IF @Limit IS NULL OR @Limit <= 0 SET @Limit = 20;
    
    SELECT 
        c.[ObjectID],
        c.[ObjectName],
        c.[Phone],
        c.[Address],
        c.[LocationID],
        l.[LocationName],
        c.[ObjectGroupID],
        g.[ObjectGroupName],
        c.[EmployeeID],
        e.[EmployeeName],
        c.[BranchID],
        b.[BranchName],
        c.[Notes],
        c.[QuanHuyen],
        c.[SanPhamChinh],
        COALESCE(c.[isDefault], 0) AS [isDefault],
        c.[DinhMucNo],
        c.[ThoiHanThanhToan],
        c.[PaymentTypeID],
        c.[PaymentTermID],
        c.[TaxCode],
        c.[DonViMuaHang],
        c.[AddressHD],
        COALESCE(c.[isDisable], 0) AS [isDisable],
        c.[NhaPhanPhoi],
        COALESCE(c.[isWeb], 1) AS [isWeb],
        u.[UserName],
        COALESCE(u.[Disable], 0) AS [userDisable],
        u.[UserGroupID]
    FROM [dbo].[CF_ObjectTbl] c
    LEFT JOIN [dbo].[CF_LocationTbl] l ON c.[LocationID] = l.[LocationID]
    LEFT JOIN [dbo].[CF_ObjectGroupTbl] g ON c.[ObjectGroupID] = g.[ObjectGroupID]
    LEFT JOIN [dbo].[CF_EmployeeTbl] e ON c.[EmployeeID] = e.[EmployeeID]
    LEFT JOIN [dbo].[CF_BranchTbl] b ON c.[BranchID] = b.[BranchID]
    LEFT JOIN [dbo].[SY_User] u ON c.[ObjectID] = u.[ObjectID]
    WHERE ISNULL(c.[isWeb], 0) = 1 AND c.[ObjectGroupID] <> 'CC'
      AND (@TimKiem IS NULL OR @TimKiem = ''
           OR c.[ObjectID] LIKE '%' + @TimKiem + '%'
           OR c.[ObjectName] LIKE N'%' + @TimKiem + '%'
           OR c.[Phone] LIKE '%' + @TimKiem + '%'
           OR c.[Address] LIKE N'%' + @TimKiem + '%')
      AND (@ObjectGroupID IS NULL OR @ObjectGroupID = '' OR c.[ObjectGroupID] = @ObjectGroupID)
    ORDER BY c.[DateCreate] DESC, c.[ObjectID] DESC;
END;
GO


-- 3. API_KhachHang_Xoa
-- Xóa khách hàng (Kiểm tra an toàn Soft/Hard Delete)
IF OBJECT_ID('dbo.API_KhachHang_Xoa') IS NOT NULL
    DROP PROCEDURE [dbo].[API_KhachHang_Xoa];
GO

CREATE PROCEDURE [dbo].[API_KhachHang_Xoa]
    @ObjectID NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Kiểm tra nếu khách hàng đã phát sinh đơn hàng
    IF EXISTS (SELECT 1 FROM [dbo].[WEB_OrderTbl] WHERE [ObjectID] = @ObjectID)
    BEGIN
        -- Soft Delete: Cập nhật trạng thái không hoạt động
        UPDATE [dbo].[CF_ObjectTbl]
        SET [isDisable] = 1
        WHERE [ObjectID] = @ObjectID;
        
        -- Khóa tài khoản đăng nhập tương ứng
        UPDATE [dbo].[SY_User]
        SET [Disable] = 1
        WHERE [ObjectID] = @ObjectID;
        
        SELECT 0 AS [code], N'Khách hàng đã phát sinh đơn hàng. Hệ thống chuyển sang trạng thái KHÓA để bảo toàn lịch sử đơn hàng.' AS [msg];
    END
    ELSE
    BEGIN
        -- Hard Delete: Xóa hoàn toàn
        DELETE FROM [dbo].[SY_User] WHERE [ObjectID] = @ObjectID;
        DELETE FROM [dbo].[CF_ObjectTbl] WHERE [ObjectID] = @ObjectID;
        
        SELECT 0 AS [code], N'Đã xóa khách hàng và tài khoản đăng nhập thành công.' AS [msg];
    END
END;
GO
