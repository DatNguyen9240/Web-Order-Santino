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
    @UserGroupID NVARCHAR(50),
    @ObjectID NVARCHAR(50),
    @Disable BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @Disable IS NULL SET @Disable = 0;
    
    IF EXISTS (SELECT 1 FROM [dbo].[SY_User] WHERE [UserName] = @UserName)
    BEGIN
        UPDATE [dbo].[SY_User]
        SET [HoTen] = @HoTen,
            [UserGroupID] = @UserGroupID,
            [ObjectID] = @ObjectID,
            [Disable] = @Disable
        WHERE [UserName] = @UserName;
        
        SELECT @UserName AS [id], N'Cập nhật tài khoản người dùng thành công' AS [message];
    END
    ELSE
    BEGIN
        INSERT INTO [dbo].[SY_User] ([UserName], [HoTen], [UserGroupID], [ObjectID], [Disable])
        VALUES (@UserName, @HoTen, @UserGroupID, @ObjectID, @Disable);
        
        SELECT @UserName AS [id], N'Tạo mới tài khoản người dùng thành công' AS [message];
    END
END;
GO


-- 2. API_LayDanhSachKhachHang
-- Lấy danh sách khách hàng đầy đủ và tài khoản đăng nhập đi kèm
IF OBJECT_ID('dbo.API_LayDanhSachKhachHang') IS NOT NULL
    DROP PROCEDURE [dbo].[API_LayDanhSachKhachHang];
GO

CREATE PROCEDURE [dbo].[API_LayDanhSachKhachHang]
    @q NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @TimKiem NVARCHAR(255) = NULL;
    DECLARE @ObjectGroupID NVARCHAR(50) = NULL;
    
    IF @q IS NOT NULL AND ISJSON(@q) = 1
    BEGIN
        SET @TimKiem = JSON_VALUE(@q, '$.TimKiem');
        SET @ObjectGroupID = JSON_VALUE(@q, '$.ObjectGroupID');
    END
    
    SELECT 
        c.[ObjectID] AS [id],
        c.[ObjectID] AS [customer_id],
        c.[ObjectName] AS [name],
        c.[Phone] AS [phone],
        c.[Address] AS [address],
        c.[LocationID] AS [location_id],
        l.[LocationName] AS [location_name],
        c.[ObjectGroupID] AS [group_id],
        g.[ObjectGroupName] AS [group_name],
        c.[EmployeeID] AS [employee_id],
        e.[EmployeeName] AS [employee_name],
        c.[BranchID] AS [branch_id],
        b.[BranchName] AS [branch_name],
        c.[Notes] AS [notes],
        c.[QuanHuyen] AS [quan_huyen],
        c.[SanPhamChinh] AS [san_pham_chinh],
        COALESCE(c.[isDefault], 0) AS [is_default],
        c.[DinhMucNo] AS [dinh_muc_no],
        c.[ThoiHanThanhToan] AS [thoi_han_thanh_toan],
        c.[PaymentTypeID] AS [payment_type_id],
        c.[PaymentTermID] AS [payment_term_id],
        c.[TaxCode] AS [tax_code],
        c.[DonViMuaHang] AS [don_vi_mua_hang],
        c.[AddressHD] AS [address_hd],
        COALESCE(c.[isDisable], 0) AS [is_disable],
        u.[UserName] AS [username],
        COALESCE(u.[Disable], 0) AS [user_disable],
        u.[UserGroupID] AS [usergroup_id]
    FROM [dbo].[CF_ObjectTbl] c
    LEFT JOIN [dbo].[CF_LocationTbl] l ON c.[LocationID] = l.[LocationID]
    LEFT JOIN [dbo].[CF_ObjectGroupTbl] g ON c.[ObjectGroupID] = g.[ObjectGroupID]
    LEFT JOIN [dbo].[CF_EmployeeTbl] e ON c.[EmployeeID] = e.[EmployeeID]
    LEFT JOIN [dbo].[CF_BranchTbl] b ON c.[BranchID] = b.[BranchID]
    LEFT JOIN [dbo].[SY_User] u ON c.[ObjectID] = u.[ObjectID]
    WHERE (@TimKiem IS NULL OR @TimKiem = ''
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
