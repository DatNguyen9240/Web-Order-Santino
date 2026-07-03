-- =============================================
-- Author:      Antigravity
-- Create date: 2026-05-20
-- Description: API lấy danh sách Menu con theo Menu cha (Lọc quyền động sạch sẽ)
-- =============================================

IF OBJECT_ID('dbo.API_GetMenuChildren') IS NOT NULL
    DROP PROCEDURE [dbo].[API_GetMenuChildren];
GO

CREATE PROCEDURE [dbo].[API_GetMenuChildren]
    @Parent NVARCHAR(50) = NULL, -- Truyền mã Menu cha (mặc định lấy tất cả)
    @UserRole NVARCHAR(50) = NULL -- Quyền của người đang đăng nhập
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT M.[MenuID]
              ,M.[VN]
              ,M.[EN]
              ,M.[CH]
              ,M.[Parent]
              ,M.[IconClass]
              ,M.[FormKey]
              ,M.[FormName]
              ,M.[URLPara]
              ,M.[isDisable]
              ,M.[isNotCheckPermission]
              ,M.[isImageMenu]
              ,M.[ImageURL]
              ,M.[NotifyIconSQLCmd]
              ,M.[NotifyIconClass]
          FROM [dbo].[WA_Menu] AS M
          WHERE (M.[Parent] = @Parent OR @Parent IS NULL OR @Parent = '')
            AND (
                -- Nếu menu không cần check quyền, cho hiển thị
                M.[isNotCheckPermission] = 1
                -- Hoặc tài khoản là Admin thì hiển thị tất cả
                OR @UserRole = 'Admin'
                -- Hoặc nhóm quyền tương ứng của user được bật 'IsRun = 1'
                OR EXISTS (
                    SELECT 1 FROM [dbo].[WA_UserGroupPermisstion] P
                    WHERE P.[UserGroupID] = @UserRole
                      AND P.[MenuID] = M.[MenuID]
                      AND P.[IsRun] = 1
                )
            )
          ORDER BY M.[Parent], M.[MenuID];

    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS [ErrorMessage];
    END CATCH
END
GO
