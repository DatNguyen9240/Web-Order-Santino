-- =============================================
-- Author:      Antigravity
-- Create date: 2026-05-11
-- Description: API Xóa đơn hàng (Header & Detail)
-- =============================================
CREATE PROCEDURE [dbo].[API_XoaDonHang]
    @DocumentID NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1. Kiểm tra xem đơn hàng có tồn tại không
        IF NOT EXISTS (SELECT 1 FROM [dbo].[WEB_OrderTbl] WHERE DocumentID = @DocumentID)
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 0 AS [Success], N'Không tìm thấy đơn hàng ' + @DocumentID AS [Message];
            RETURN;
        END

        -- 2. Kiểm tra điều kiện (Ví dụ: Đơn hàng đã bị khóa thì không cho xóa)
        IF EXISTS (SELECT 1 FROM [dbo].[WEB_OrderTbl] WHERE DocumentID = @DocumentID AND ISNULL(isLock, 0) = 1)
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 0 AS [Success], N'Đơn hàng ' + @DocumentID + N' đã bị khóa, không thể xóa' AS [Message];
            RETURN;
        END

        -- 3. Xóa chi tiết đơn hàng (Detail)
        DELETE FROM [dbo].[WEB_OrderDetailTbl] WHERE DocumentID = @DocumentID;

        -- 4. Xóa thông tin chung đơn hàng (Header)
        DELETE FROM [dbo].[WEB_OrderTbl] WHERE DocumentID = @DocumentID;

        COMMIT TRANSACTION;

        -- 5. Trả về kết quả thành công
        SELECT 1 AS [Success], N'Xóa đơn hàng thành công' AS [Message];

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        SELECT -1 AS [Success], ERROR_MESSAGE() AS [Message];
    END CATCH
END
GO
