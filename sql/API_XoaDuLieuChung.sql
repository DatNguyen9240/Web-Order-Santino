IF OBJECT_ID('dbo.API_XoaDuLieuChung', 'P') IS NOT NULL
    DROP PROCEDURE [dbo].[API_XoaDuLieuChung];
GO

CREATE PROCEDURE [dbo].[API_XoaDuLieuChung]
    @q NVARCHAR(MAX) = NULL,
    @DocumentID NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    -- 1. Tự động bóc tách mã chứng từ (DocumentID) từ mọi định dạng JSON client gửi lên
    IF @DocumentID IS NULL AND ISJSON(ISNULL(@q, '')) = 1
    BEGIN
        SET @DocumentID = COALESCE(
            JSON_VALUE(@q, '$.Keys.DocumentID'),
            JSON_VALUE(@q, '$.DocumentID'),
            JSON_VALUE(@q, '$.Keys.id'),
            JSON_VALUE(@q, '$.id')
        );
    END;

    -- 2. Nếu có DocumentID -> Tiến hành xóa Đơn hàng / Chứng từ (Chi tiết trước, Đầu đơn sau)
    IF NULLIF(LTRIM(RTRIM(@DocumentID)), '') IS NOT NULL
    BEGIN
        BEGIN TRY
            BEGIN TRANSACTION;

            -- Kiểm tra nếu đơn bị khóa
            IF EXISTS (SELECT 1 FROM dbo.WEB_OrderTbl WHERE DocumentID = @DocumentID AND ISNULL(isLock, 0) = 1)
            BEGIN
                ROLLBACK TRANSACTION;
                SELECT 0 AS [Success], 1 AS [code], N'Đơn hàng ' + @DocumentID + N' đã bị khóa, không thể xóa' AS [Message], N'Đơn hàng đã bị khóa' AS [msg];
                RETURN;
            END;

            -- Xóa chi tiết đơn hàng (nếu có)
            IF OBJECT_ID('dbo.WEB_OrderDetailTbl', 'U') IS NOT NULL
            BEGIN
                DELETE FROM dbo.WEB_OrderDetailTbl WHERE DocumentID = @DocumentID;
            END;

            -- Xóa thông tin chung đơn hàng
            IF OBJECT_ID('dbo.WEB_OrderTbl', 'U') IS NOT NULL
            BEGIN
                DELETE FROM dbo.WEB_OrderTbl WHERE DocumentID = @DocumentID;
            END;

            COMMIT TRANSACTION;
            SELECT 1 AS [Success], 0 AS [code], N'Đã xóa đơn hàng ' + @DocumentID + N' thành công.' AS [Message], N'Đã xóa thành công' AS [msg];
            RETURN;
        END TRY
        BEGIN CATCH
            IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
            SELECT 0 AS [Success], 1 AS [code], ERROR_MESSAGE() AS [Message], ERROR_MESSAGE() AS [msg];
            RETURN;
        END CATCH;
    END;

    -- 3. Nếu là Form động danh mục thông thường -> Xóa theo Metadata SY_FrmLstTbl
    DECLARE @FormName VARCHAR(100) = JSON_VALUE(@q, '$.FormName');
    DECLARE @Keys NVARCHAR(MAX) = JSON_QUERY(@q, '$.Keys');
    DECLARE @TableName SYSNAME;
    DECLARE @PrimaryKey NVARCHAR(400);
    DECLARE @Sql NVARCHAR(MAX);

    SELECT TOP (1)
        @TableName = NULLIF(LTRIM(RTRIM(ISNULL(TableName, FormID))), ''),
        @PrimaryKey = NULLIF(LTRIM(RTRIM(PrimaryKey)), '')
    FROM dbo.SY_FrmLstTbl WHERE FormID = @FormName;

    IF @TableName IS NOT NULL AND @PrimaryKey IS NOT NULL AND ISJSON(@Keys) = 1
    BEGIN
        BEGIN TRY
            BEGIN TRANSACTION;
            
            DECLARE @KeyVal NVARCHAR(200) = JSON_VALUE(@Keys, '$.' + @PrimaryKey);
            IF @KeyVal IS NOT NULL
            BEGIN
                SET @Sql = N'DELETE FROM ' + QUOTENAME(@TableName) + N' WHERE ' + QUOTENAME(@PrimaryKey) + N' = @Val';
                EXEC sp_executesql @Sql, N'@Val NVARCHAR(200)', @Val = @KeyVal;
            END;

            COMMIT TRANSACTION;
            SELECT 1 AS [Success], 0 AS [code], N'Đã xóa dữ liệu thành công.' AS [Message], N'Đã xóa thành công' AS [msg];
            RETURN;
        END TRY
        BEGIN CATCH
            IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
            SELECT 0 AS [Success], 1 AS [code], ERROR_MESSAGE() AS [msg];
            RETURN;
        END CATCH;
    END;

    SELECT 0 AS [Success], 1 AS [code], N'Không thể xác định dữ liệu cần xóa.' AS [msg];
END;
GO
