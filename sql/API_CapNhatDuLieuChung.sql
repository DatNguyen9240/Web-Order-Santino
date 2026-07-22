IF OBJECT_ID('dbo.API_CapNhatDuLieuChung', 'P') IS NOT NULL
    DROP PROCEDURE [dbo].[API_CapNhatDuLieuChung];
GO

CREATE PROCEDURE [dbo].[API_CapNhatDuLieuChung]
    @q NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @FormName VARCHAR(100);
    DECLARE @OriginalKeys NVARCHAR(MAX);
    DECLARE @Values NVARCHAR(MAX);
    DECLARE @TableName SYSNAME;
    DECLARE @PrimaryKey NVARCHAR(400);
    DECLARE @ObjectID INT;
    DECLARE @SchemaName SYSNAME;
    DECLARE @ObjectName SYSNAME;
    DECLARE @QualifiedTable NVARCHAR(520);
    DECLARE @Where NVARCHAR(MAX);
    DECLARE @SetClause NVARCHAR(MAX);
    DECLARE @Sql NVARCHAR(MAX);
    DECLARE @MatchedRows BIGINT = 0;
    DECLARE @UpdatedRows INT = 0;
    DECLARE @DryRun BIT = 0;

    IF ISJSON(ISNULL(@q, '')) <> 1
    BEGIN
        SELECT 1 AS [code], N'Dữ liệu cập nhật không phải JSON hợp lệ.' AS [msg];
        RETURN;
    END;

    SET @FormName = JSON_VALUE(@q, '$.FormName');
    SET @OriginalKeys = JSON_QUERY(@q, '$.OriginalKeys');
    SET @Values = JSON_QUERY(@q, '$.Values');
    SET @DryRun = CASE LOWER(ISNULL(JSON_VALUE(@q, '$.DryRun'), 'false'))
        WHEN 'true' THEN 1
        WHEN '1' THEN 1
        ELSE 0
    END;

    IF NULLIF(LTRIM(RTRIM(@FormName)), '') IS NULL
       OR ISJSON(@OriginalKeys) <> 1
       OR ISJSON(@Values) <> 1
    BEGIN
        SELECT 1 AS [code], N'Dữ liệu cập nhật không hợp lệ: thiếu FormName, OriginalKeys hoặc Values.' AS [msg];
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

    IF NOT EXISTS (SELECT 1 FROM OPENJSON(@OriginalKeys))
    BEGIN
        SELECT 1 AS [code], N'Không có dữ liệu gốc để xác định dòng cần sửa.' AS [msg];
        RETURN;
    END;

    IF NOT EXISTS (SELECT 1 FROM OPENJSON(@Values))
    BEGIN
        SELECT 1 AS [code], N'Không có giá trị cần cập nhật.' AS [msg];
        RETURN;
    END;

    -- Dữ liệu khóa gốc chỉ được chứa các cột thật của bảng.
    IF EXISTS (
        SELECT 1
        FROM OPENJSON(@OriginalKeys) k
        LEFT JOIN sys.columns c
            ON c.object_id = @ObjectID
           AND c.name = k.[key] COLLATE DATABASE_DEFAULT
        WHERE c.column_id IS NULL
    )
    BEGIN
        SELECT 1 AS [code], N'Dữ liệu gốc chứa trường không tồn tại trong bảng.' AS [msg];
        RETURN;
    END;

    -- Không cho cập nhật identity, computed, rowversion hoặc cột không tồn tại.
    IF EXISTS (
        SELECT 1
        FROM OPENJSON(@Values) v
        LEFT JOIN sys.columns c
            ON c.object_id = @ObjectID
           AND c.name = v.[key] COLLATE DATABASE_DEFAULT
        LEFT JOIN sys.types t
            ON t.user_type_id = c.user_type_id
        WHERE c.column_id IS NULL
           OR c.is_identity = 1
           OR c.is_computed = 1
           OR t.name IN ('timestamp', 'rowversion')
    )
    BEGIN
        SELECT 1 AS [code], N'Danh sách cập nhật chứa trường không hợp lệ hoặc chỉ đọc.' AS [msg];
        RETURN;
    END;

    -- Bắt buộc dữ liệu gốc có đủ khóa chính được khai báo cho form.
    IF @PrimaryKey IS NOT NULL
       AND EXISTS (
            SELECT 1
            FROM STRING_SPLIT(@PrimaryKey, ';') pk
            WHERE NULLIF(LTRIM(RTRIM(pk.value)), '') IS NOT NULL
              AND NOT EXISTS (
                    SELECT 1
                    FROM OPENJSON(@OriginalKeys) k
                    WHERE k.[key] COLLATE DATABASE_DEFAULT = LTRIM(RTRIM(pk.value))
              )
       )
    BEGIN
        SELECT 1 AS [code], N'Dữ liệu gốc không có đủ khóa chính của dòng cần sửa.' AS [msg];
        RETURN;
    END;

    -- API chung không đổi khóa chính; nghiệp vụ đổi mã phải dùng API riêng.
    IF @PrimaryKey IS NOT NULL
       AND EXISTS (
            SELECT 1
            FROM STRING_SPLIT(@PrimaryKey, ';') pk
            INNER JOIN OPENJSON(@Values) v
                ON v.[key] COLLATE DATABASE_DEFAULT = LTRIM(RTRIM(pk.value))
            WHERE NULLIF(LTRIM(RTRIM(pk.value)), '') IS NOT NULL
       )
    BEGIN
        SELECT 1 AS [code], N'API cập nhật chung không cho phép thay đổi khóa chính.' AS [msg];
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
        FROM OPENJSON(@OriginalKeys) k
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
            N'$.OriginalKeys."' + REPLACE(REPLACE(ColumnName, N'\', N'\\'), N'"', N'\"') + N'"' AS JsonPath
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

    ;WITH ValueColumns AS (
        SELECT
            c.column_id,
            c.name AS ColumnName,
            t.name AS TypeName,
            c.max_length,
            c.[precision],
            c.scale
        FROM OPENJSON(@Values) v
        INNER JOIN sys.columns c
            ON c.object_id = @ObjectID
           AND c.name = v.[key] COLLATE DATABASE_DEFAULT
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
            N'$.Values."' + REPLACE(REPLACE(ColumnName, N'\', N'\\'), N'"', N'\"') + N'"' AS JsonPath
        FROM ValueColumns
    )
    SELECT @SetClause = STRING_AGG(
        QUOTENAME(ColumnName) + N' = TRY_CONVERT(' + SqlType + N', ' +
            CASE WHEN TypeName = 'bit'
                THEN N'CASE LOWER(JSON_VALUE(@Payload, N''' + REPLACE(JsonPath, '''', '''''') + N''')) WHEN N''true'' THEN N''1'' WHEN N''false'' THEN N''0'' ELSE JSON_VALUE(@Payload, N''' + REPLACE(JsonPath, '''', '''''') + N''') END'
                ELSE N'JSON_VALUE(@Payload, N''' + REPLACE(JsonPath, '''', '''''') + N''')'
            END +
        N')',
        N', '
    ) WITHIN GROUP (ORDER BY column_id)
    FROM TypedColumns;

    IF NULLIF(@Where, '') IS NULL OR NULLIF(@SetClause, '') IS NULL
    BEGIN
        SELECT 1 AS [code], N'Không tạo được câu cập nhật an toàn.' AS [msg];
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
            SELECT 1 AS [code], N'Không tìm thấy dữ liệu gốc; dòng có thể đã được người khác thay đổi.' AS [msg];
            RETURN;
        END;

        IF @MatchedRows > 1
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 1 AS [code], N'Dữ liệu gốc khớp nhiều hơn một dòng; hệ thống đã hủy để tránh sửa nhầm.' AS [msg];
            RETURN;
        END;

        IF @DryRun = 1
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT
                0 AS [code],
                N'Kiểm tra hợp lệ: đúng một dòng sẽ được cập nhật.' AS [msg],
                @QualifiedTable AS [TableName],
                @MatchedRows AS [MatchedRows];
            RETURN;
        END;

        SET @Sql = N'UPDATE ' + @QualifiedTable + N' SET ' + @SetClause + N' WHERE ' + @Where + N'; SET @RowsOut = @@ROWCOUNT;';
        EXEC sys.sp_executesql
            @Sql,
            N'@Payload NVARCHAR(MAX), @RowsOut INT OUTPUT',
            @Payload = @q,
            @RowsOut = @UpdatedRows OUTPUT;

        IF @UpdatedRows <> 1
            THROW 50002, N'Không thể xác nhận chính xác một dòng đã được cập nhật.', 1;

        COMMIT TRANSACTION;
        SELECT 0 AS [code], N'Đã cập nhật dữ liệu thành công.' AS [msg];
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        SELECT 1 AS [code], ERROR_MESSAGE() AS [msg];
    END CATCH;
END;
GO
