-- =============================================
-- Author:      Antigravity
-- Create date: 2026-05-20
-- Description: API lấy danh sách Menu con theo Menu cha
-- =============================================
CREATE PROCEDURE [dbo].[API_GetMenuChildren]
    @Parent NVARCHAR(50) = NULL -- Truyền mã Menu cha (mặc định lấy tất cả)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT [MenuID]
              ,[VN]
              ,[EN]
              ,[CH]
              ,[Parent]
              ,[IconClass]
              ,[FormKey]
              ,[FormName]
              ,[URLPara]
              ,[isDisable]
              ,[isNotCheckPermission]
              ,[isImageMenu]
              ,[ImageURL]
              ,[NotifyIconSQLCmd]
              ,[NotifyIconClass]
          FROM [dbo].[WA_Menu] -- Hoặc [X23STN_TEST26].[dbo].[WA_Menu] tùy cấu hình Database của bạn
          WHERE [Parent] = @Parent
             OR @Parent IS NULL
             OR @Parent = ''
          ORDER BY [Parent], [MenuID];

    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS [ErrorMessage];
    END CATCH
END
GO

-- ── TEST TRỰC TIẾP TRONG SSMS ───────────────────
/*
EXEC [dbo].[API_GetMenuChildren]; -- Không truyền tham số (mặc định lấy tất cả)
EXEC [dbo].[API_GetMenuChildren] @Parent = ''; -- Truyền rỗng (lấy tất cả)
EXEC [dbo].[API_GetMenuChildren] @Parent = '02'; -- Lấy menu con của '02'
*/
