-- =========================================================================
-- SCRIPT THÊM MENU "PHIẾU BÁN HÀNG" (MÃ 5030) VÀO DATABASE WA_Menu
-- =========================================================================

SET XACT_ABORT ON;
BEGIN TRANSACTION;
BEGIN TRY

    -- 1. Thêm mới hoặc cập nhật bản ghi Menu 5030
    IF NOT EXISTS (SELECT 1 FROM [dbo].[WA_Menu] WHERE [MenuID] = '5030')
    BEGIN
        INSERT INTO [dbo].[WA_Menu] 
            ([MenuID], [Parent], [VN], [EN], [IconClass], [FormKey], [FormName], [URLPara], [isDisable])
        VALUES
            ('5030', '50', N'Phiếu bán hàng', 'Sales Voucher', 'receipt', 'Null', 'WEB_OrderFrm', '/sales-voucher', 0);
        PRINT '-> Da them Menu Phieu ban hang (5030) thanh cong.';
    END
    ELSE
    BEGIN
        UPDATE [dbo].[WA_Menu]
        SET [Parent] = '50',
            [VN] = N'Phiếu bán hàng',
            [EN] = 'Sales Voucher',
            [IconClass] = 'receipt',
            [FormKey] = 'Null',
            [FormName] = 'WEB_OrderFrm',
            [URLPara] = '/sales-voucher',
            [isDisable] = 0
        WHERE [MenuID] = '5030';
        PRINT '-> Da cap nhat Menu Phieu ban hang (5030) thanh cong.';
    END;

    -- 2. Tu dong dong bo phan quyen truy cap cho cac nhom nguoi dung
    IF OBJECT_ID('dbo.API_DongBoQuyenTruyCap') IS NOT NULL
    BEGIN
        EXEC [dbo].[API_DongBoQuyenTruyCap] @NhomNguoiDangThaoTac = 'Admin';
        PRINT '-> Da dong bo phan quyen truy cap cho tat ca cac nhom nguoi dung.';
    END
    ELSE
    BEGIN
        PRINT '-> Canh bao: Stored Procedure API_DongBoQuyenTruyCap khong ton tai. Hay dam bao phan quyen duoc dong bo thu cong.';
    END;

    -- 3. Cap nhat phien ban dong bo Menu de ep client reset cache va tai lai menu moi
    IF EXISTS (SELECT 1 FROM [dbo].[SY_Setup] WHERE [CodeID] = 'menu_sync_ver')
        UPDATE [dbo].[SY_Setup]
        SET [CodeValue] = CONVERT(NVARCHAR(50), GETDATE(), 126)
        WHERE [CodeID] = 'menu_sync_ver';
    ELSE
        INSERT INTO [dbo].[SY_Setup] (CodeID, CodeName, CodeValue, GroupID)
        VALUES ('menu_sync_ver', N'Phiên bản đồng bộ Menu', CONVERT(NVARCHAR(50), GETDATE(), 126), 'SY');
    PRINT '-> Da lam moi phien ban dong bo Menu.';

    COMMIT TRANSACTION;
    PRINT '=== THEM MENU PHIEU BAN HANG DONG VAO CSDL THANH CONG ===';

END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
    RAISERROR(@ErrMsg, 16, 1);
END CATCH;
GO
