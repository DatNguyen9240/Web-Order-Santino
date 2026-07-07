-- =========================================================================
-- SCRIPT KHỞI TẠO VÀ CHUYỂN ĐỔI TOÀN BỘ MENUID SANG DẠNG SỐ
-- =========================================================================

BEGIN TRANSACTION;
BEGIN TRY

    -- 1. Xóa sạch dữ liệu cũ trong 2 bảng WA_UserGroupPermisstion và WA_Menu
    DELETE FROM [dbo].[WA_UserGroupPermisstion];
    DELETE FROM [dbo].[WA_Menu];
    PRINT '-> Đã xóa sạch dữ liệu cũ trong WA_UserGroupPermisstion và WA_Menu.';

    -- 2. Chèn danh sách Menu mới dạng số
    INSERT INTO [dbo].[WA_Menu] 
        ([MenuID], [Parent], [VN], [EN], [IconClass], [FormKey], [FormName], [URLPara], [isDisable])
    VALUES
        ('02',   '',     N'Đặt hàng & Lịch sử', 'Orders & History', 'folder',       '',     '',                     '',             0),
        ('0210', '02',   N'Đặt hàng',            'Order',            'shopping_bag', 'Null', 'WEB_OrderFrm',         '/order',       0),
        ('0220', '02',   N'Lịch sử đơn hàng',    'Order History',    'receipt_long', 'List', 'WEB_OrderDetailFrm',   '/orders',      0),
        ('03',   '',     N'Quản lý khách hàng',  'Customer Management','person',      'Null', 'WEB_CustomerFrm',      '/customers',    0),
        ('09',   '',     N'Cấu hình hệ thống',   'System Configuration','settings',    '',     'WEB_SystemGroup',      '',             0),
        ('0910', '09',   N'Quản lý Menu',        'Menu Management',  'menu',         '',     'WEB_SystemGroupWEB_MenuFrm', '/menus', 0),
        ('0920', '09',   N'Phân quyền nhóm',     'Permission Management','security',  '',     'WEB_SystemGroupWEB_PermissionFrm', '/permissions', 0);
    PRINT '-> Đã chèn thành công các Menu mới dạng số.';

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
