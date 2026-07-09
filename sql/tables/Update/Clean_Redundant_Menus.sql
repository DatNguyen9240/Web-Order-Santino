-- =========================================================================
-- SCRIPT KHỞI TẠO VÀ CHUYỂN ĐỔI TOÀN BỘ MENUID SANG DẠNG SỐ
-- =========================================================================

BEGIN TRANSACTION;
BEGIN TRY

    -- 1. Chỉ xóa các Menu có trùng ID cũ (nếu có) để tránh lỗi trùng khóa (Primary Key)
    DELETE FROM [dbo].[WA_Menu] WHERE [MenuID] IN ('50', '5010', '5020', '60', '70', '7010', '7040', '80', '8010', '8020');
    PRINT '-> Đã dọn dẹp các Menu trùng mã chuẩn bị chèn.';

    -- 2. Chèn danh sách Menu mới dạng số (Bắt đầu từ mã 50 và cách nhau 10 đơn vị)
    INSERT INTO [dbo].[WA_Menu] 
        ([MenuID], [Parent], [VN], [EN], [IconClass], [FormKey], [FormName], [URLPara], [isDisable])
    VALUES
        ('50',   '',     N'Đặt hàng & Lịch sử', 'Orders & History', 'folder',       '',     '',                     '',             0),
        ('5010', '50',   N'Đặt hàng',            'Order',            'shopping_bag', 'Null', 'WEB_OrderFrm',         '/order',       0),
        ('5020', '50',   N'Lịch sử đơn hàng',    'Order History',    'receipt_long', 'List', 'WEB_OrderDetailFrm',   '/orders',      0),
        
        ('60',   '',     N'Quản lý khách hàng',  'Customer Management','person',      'Null', 'WEB_CustomerFrm',      '/customers',    0),
        
        ('70',   '',     N'Quản lý danh mục',    'Master Data',      'folder_open',  '',     '',                     '',             0),
        ('7010', '70',   N'Sản phẩm',            'Products',         'shopping_bag', 'products', 'frmProduct',       '/products',    0),
        ('7040', '70',   N'CTKM',                'Promotions',       'local_offer',  'promos',   'frmPromotion',     '/promos',      0),
        
        ('80',   '',     N'Cấu hình hệ thống',   'System Configuration','settings',    '',     'WEB_SystemGroup',      '',             0),
        ('8010', '80',   N'Quản lý Menu',        'Menu Management',  'menu',         '',     'WEB_SystemGroupWEB_MenuFrm', '/menus', 0),
        ('8020', '80',   N'Phân quyền nhóm',     'Permission Management','security',  '',     'WEB_SystemGroupWEB_PermissionFrm', '/permissions', 0);
    PRINT '-> Đã chèn thành công các Menu mới từ đầu 50, 60, 70, 80.';

    -- 3. Gọi Store Procedure đồng bộ quyền truy cập cho tất cả các nhóm người dùng hiện có
    IF OBJECT_ID('dbo.API_DongBoQuyenTruyCap') IS NOT NULL
    BEGIN
        EXEC [dbo].[API_DongBoQuyenTruyCap] @NhomNguoiDangThaoTac = 'Admin';
        PRINT '-> Đã đồng bộ phân quyền tự động cho tất cả các nhóm người dùng.';
    END
    ELSE
    BEGIN
        PRINT '-> Cảnh báo: Stored Procedure API_DongBoQuyenTruyCap không tồn tại, vui lòng chạy Migrate_Permissions_And_Menus.sql trước.';
    END;

    -- 4. Cập nhật phiên bản đồng bộ để ép trình duyệt tải lại menu mới
    IF EXISTS (SELECT 1 FROM [dbo].[SY_Setup] WHERE [CodeID] = 'menu_sync_ver')
        UPDATE [dbo].[SY_Setup]
        SET [CodeValue] = CONVERT(NVARCHAR(50), GETDATE(), 126)
        WHERE [CodeID] = 'menu_sync_ver';
    ELSE
        INSERT INTO [dbo].[SY_Setup] (CodeID, CodeName, CodeValue, GroupID)
        VALUES ('menu_sync_ver', N'Phiên bản đồng bộ Menu', CONVERT(NVARCHAR(50), GETDATE(), 126), 'SY');
    PRINT '-> Đã làm mới phiên bản đồng bộ Menu.';

    COMMIT TRANSACTION;
    PRINT '=== KHỞI TẠO VÀ CHUYỂN ĐỔI MENU SANG SỐ THÀNH CÔNG ===';

END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
    RAISERROR(@ErrMsg, 16, 1);
END CATCH
GO
