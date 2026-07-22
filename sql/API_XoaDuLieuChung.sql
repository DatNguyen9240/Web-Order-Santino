IF OBJECT_ID('dbo.API_XoaDuLieuChung', 'P') IS NOT NULL
    DROP PROCEDURE [dbo].[API_XoaDuLieuChung];
GO

CREATE PROCEDURE [dbo].[API_XoaDuLieuChung]
    @q NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @FormName VARCHAR(100);
    DECLARE @Keys NVARCHAR(MAX);
    DECLARE @TableName SYSNAME;
    DECLARE @PrimaryKey NVARCHAR(400);
    DECLARE @ObjectID INT;
    DECLARE @SchemaName SYSNAME;
    DECLARE @ObjectName SYSNAME;
    DECLARE @QualifiedTable NVARCHAR(520);
    DECLARE @Where NVARCHAR(MAX);
    DECLARE @Sql NVARCHAR(MAX);
    DECLARE @MatchedRows BIGINT = 0;
    DECLARE @DeletedRows INT = 0;
    DECLARE @DryRun BIT = 0;

    IF ISJSON(ISNULL(@q, '')) <> 1
    BEGIN
        SELECT 1 AS [code], N'Dữ liệu xóa không phải JSON hợp lệ.' AS [msg];
        RETURN;
    END;

    SET @FormName = JSON_VALUE(@q, '$.FormName');
    SET @Keys = JSON_QUERY(@q, '$.Keys');
    SET @DryRun = CASE LOWER(ISNULL(JSON_VALUE(@q, '$.DryRun'), 'false'))
        WHEN 'true' THEN 1
        WHEN '1' THEN 1
        ELSE 0
    END;

    IF NULLIF(LTRIM(RTRIM(@FormName)), '') IS NULL OR ISJSON(@Keys) <> 1
    BEGIN
        SELECT 1 AS [code], N'Dữ liệu xóa không hợp lệ: thiếu FormName hoặc Keys.' AS [msg];
        RETURN;
    END;

    SELECT TOP (1)
        @TableName = NULLIF(LTRIM(RTRIM(ISNULL(TableName, FormID))), ''),
        @PrimaryKey = NULLIF(LTRIM(RTRIM(PrimaryKey)), '')
    FROM dbo.SY_FrmLstTbl
    WHERE FormID = @FormName;

    SET @ObjectID = OBJECT_ID(@TableName, 'U');

    IF @ObjectID IS NULL
    BEGIN
        SELECT 1 AS [code], N'Form không được cấu hình bảng dữ liệu hợp lệ.' AS [msg];
        RETURN;
    END;

    SELECT
        @SchemaName = OBJECT_SCHEMA_NAME(@ObjectID),
        @ObjectName = OBJECT_NAME(@ObjectID);

    SET @QualifiedTable = QUOTENAME(@SchemaName) + N'.' + QUOTENAME(@ObjectName);

    IF NOT EXISTS (SELECT 1 FROM OPENJSON(@Keys))
    BEGIN
        SELECT 1 AS [code], N'Không có trường khóa để xác định dòng cần xóa.' AS [msg];
        RETURN;
    END;

    -- Chỉ nhận các trường thực sự tồn tại trong bảng đã được cấu hình cho FormName.
    IF EXISTS (
        SELECT 1
        FROM OPENJSON(@Keys) k
        LEFT JOIN sys.columns c
            ON c.object_id = @ObjectID
           AND c.name = k.[key] COLLATE DATABASE_DEFAULT
        WHERE c.column_id IS NULL
    )
    BEGIN
        SELECT 1 AS [code], N'Danh sách khóa chứa trường không tồn tại trong bảng.' AS [msg];
        RETURN;
    END;

    -- Bắt buộc payload phải chứa khóa chính đã khai báo trong SY_FrmLstTbl.
    IF @PrimaryKey IS NOT NULL
       AND EXISTS (
            SELECT 1
            FROM STRING_SPLIT(@PrimaryKey, ';') pk
            WHERE NULLIF(LTRIM(RTRIM(pk.value)), '') IS NOT NULL
              AND NOT EXISTS (
                    SELECT 1
                    FROM OPENJSON(@Keys) k
                    WHERE k.[key] COLLATE DATABASE_DEFAULT = LTRIM(RTRIM(pk.value))
              )
       )
    BEGIN
        SELECT 1 AS [code], N'Payload không có đủ khóa chính của dòng cần xóa.' AS [msg];
        RETURN;
    END;

    ;WITH KeyColumns AS (
        SELECT
            c.column_id,
            c.name AS ColumnName,
            t.name AS TypeName,
            c.max_length,
            c.[precision],
            c.scale
        FROM OPENJSON(@Keys) k
        INNER JOIN sys.columns c
            ON c.object_id = @ObjectID
           AND c.name = k.[key] COLLATE DATABASE_DEFAULT
        INNER JOIN sys.types t
            ON t.user_type_id = c.user_type_id
    ), TypedColumns AS (
        SELECT *,
            CASE
                WHEN TypeName IN ('nvarchar', 'nchar') THEN
                    TypeName + N'(' + CASE WHEN max_length = -1 THEN N'MAX' ELSE CONVERT(NVARCHAR(10), max_length / 2) END + N')'
                WHEN TypeName IN ('varchar', 'char', 'varbinary', 'binary') THEN
                    TypeName + N'(' + CASE WHEN max_length = -1 THEN N'MAX' ELSE CONVERT(NVARCHAR(10), max_length) END + N')'
                WHEN TypeName IN ('decimal', 'numeric') THEN
                    TypeName + N'(' + CONVERT(NVARCHAR(10), [precision]) + N',' + CONVERT(NVARCHAR(10), scale) + N')'
                WHEN TypeName IN ('datetime2', 'datetimeoffset', 'time') THEN
                    TypeName + N'(' + CONVERT(NVARCHAR(10), scale) + N')'
                ELSE TypeName
            END AS SqlType,
            N'$.Keys."' + REPLACE(REPLACE(ColumnName, N'\', N'\\'), N'"', N'\"') + N'"' AS JsonPath
        FROM KeyColumns
    )
    SELECT @Where = STRING_AGG(
        N'(' +
        N'(JSON_VALUE(@Payload, N''' + REPLACE(JsonPath, '''', '''''') + N''') IS NULL AND ' + QUOTENAME(ColumnName) + N' IS NULL)' +
        N' OR ' + QUOTENAME(ColumnName) + N' = TRY_CONVERT(' + SqlType + N', ' +
            CASE WHEN TypeName = 'bit'
                THEN N'CASE LOWER(JSON_VALUE(@Payload, N''' + REPLACE(JsonPath, '''', '''''') + N''')) WHEN N''true'' THEN N''1'' WHEN N''false'' THEN N''0'' ELSE JSON_VALUE(@Payload, N''' + REPLACE(JsonPath, '''', '''''') + N''') END'
                ELSE N'JSON_VALUE(@Payload, N''' + REPLACE(JsonPath, '''', '''''') + N''')'
            END +
        N'))',
        N' AND '
    ) WITHIN GROUP (ORDER BY column_id)
    FROM TypedColumns;

    IF NULLIF(@Where, '') IS NULL
    BEGIN
        SELECT 1 AS [code], N'Không tạo được điều kiện xóa an toàn.' AS [msg];
        RETURN;
    END;

    BEGIN TRY
        BEGIN TRANSACTION;

        SET @Sql = N'SELECT @CountOut = COUNT_BIG(1) FROM ' + @QualifiedTable + N' WHERE ' + @Where + N';';
        EXEC sys.sp_executesql
            @Sql,
            N'@Payload NVARCHAR(MAX), @CountOut BIGINT OUTPUT',
            @Payload = @q,
            @CountOut = @MatchedRows OUTPUT;

        IF @MatchedRows = 0
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 1 AS [code], N'Không tìm thấy dòng dữ liệu cần xóa.' AS [msg];
            RETURN;
        END;

        IF @MatchedRows > 1
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 1 AS [code], N'Điều kiện khóa khớp nhiều hơn một dòng; hệ thống đã hủy để tránh xóa nhầm.' AS [msg];
            RETURN;
        END;

        IF @DryRun = 1
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT
                0 AS [code],
                N'Kiểm tra hợp lệ: đúng một dòng sẽ được xóa.' AS [msg],
                @QualifiedTable AS [TableName],
                @MatchedRows AS [MatchedRows];
            RETURN;
        END;

        -- Quan hệ ItemName2 + MauSac là quan hệ nghiệp vụ, CSDL hiện không có FK cascade.
        -- Xóa danh sách size/SKU con trước khi xóa tên hàng 2.
        IF @SchemaName = 'dbo' AND @ObjectName = 'CF_TenHang2Tbl'
        BEGIN
            DECLARE @ItemName2 NVARCHAR(50) = COALESCE(
                JSON_VALUE(@q, '$.Keys.ItemName2'),
                JSON_VALUE(@q, '$.Keys.ten_hang_2')
            );
            DECLARE @MauSac NVARCHAR(50) = COALESCE(
                JSON_VALUE(@q, '$.Keys.MauSac'),
                JSON_VALUE(@q, '$.Keys.mau')
            );

            DELETE FROM dbo.CF_ItemTbl
            WHERE ItemName2 = @ItemName2
              AND (
                    (MauSac IS NULL AND @MauSac IS NULL)
                    OR MauSac = @MauSac
              );
        END;

        SET @Sql = N'DELETE FROM ' + @QualifiedTable + N' WHERE ' + @Where + N'; SET @RowsOut = @@ROWCOUNT;';
        EXEC sys.sp_executesql
            @Sql,
            N'@Payload NVARCHAR(MAX), @RowsOut INT OUTPUT',
            @Payload = @q,
            @RowsOut = @DeletedRows OUTPUT;

        IF @DeletedRows <> 1
            THROW 50001, N'Không thể xác nhận chính xác một dòng đã được xóa.', 1;

        COMMIT TRANSACTION;
        SELECT 0 AS [code], N'Đã xóa dữ liệu thành công.' AS [msg];
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        SELECT 1 AS [code], ERROR_MESSAGE() AS [msg];
    END CATCH;
END;
GO
