-- =========================================================================
-- SCRIPT CẬP NHẬT PHÂN QUYỀN MẶC ĐỊNH CHO HỆ THỐNG
-- =========================================================================

-- 1. ĐỐI VỚI ADMIN / QUẢN TRỊ: Cấp toàn quyền cho tất cả các menu hệ thống
UPDATE [dbo].[WA_UserGroupPermisstion]
SET [IsRun] = 1, [IsAdd] = 1, [IsUpdate] = 1, [IsDelete] = 1, [isAdmin] = 1
WHERE [UserGroupID] IN ('Admin', 'admin');

-- 2. ĐỐI VỚI CÁC NHÓM CÒN LẠI (NVKD, DL, NPP, v.v.):
-- 2.1. Chặn hoàn toàn quyền truy cập các trang cấu hình và khách hàng
UPDATE [dbo].[WA_UserGroupPermisstion]
SET [IsRun] = 0, [IsAdd] = 0, [IsUpdate] = 0, [IsDelete] = 0, [isManager] = 0, [isAdmin] = 0
WHERE [UserGroupID] NOT IN ('Admin', 'admin')
  AND [MenuID] IN ('WEB_SystemGroup', 'WEB_MenuFrm', 'WEB_PermissionFrm', 'WEB_CustomerFrm');

-- 2.2. Cho phép truy cập và thao tác trên trang Đặt hàng & Lịch sử đơn hàng
UPDATE [dbo].[WA_UserGroupPermisstion]
SET [IsRun] = 1, [IsAdd] = 1, [IsUpdate] = 1, [IsDelete] = 1
WHERE [UserGroupID] NOT IN ('Admin', 'admin')
  AND [MenuID] IN ('02', 'WEB_OrderFrm', 'WEB_OrdersList');
GO

-- 3. Cập nhật phiên bản đồng bộ để ép các trình duyệt tải lại phân quyền mới
IF EXISTS (SELECT 1 FROM [dbo].[SY_Setup] WHERE [CodeID] = 'menu_sync_ver')
    UPDATE [dbo].[SY_Setup]
    SET [CodeValue] = CONVERT(NVARCHAR(50), GETDATE(), 126)
    WHERE [CodeID] = 'menu_sync_ver';
GO

PRINT '=== CẬP NHẬT PHÂN QUYỀN MẶC ĐỊNH THÀNH CÔNG ===';
