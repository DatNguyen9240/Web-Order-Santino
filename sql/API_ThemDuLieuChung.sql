IF OBJECT_ID('dbo.API_ThemDuLieuChung', 'P') IS NOT NULL
    DROP PROCEDURE [dbo].[API_ThemDuLieuChung];
GO

CREATE PROCEDURE [dbo].[API_ThemDuLieuChung]
    @q NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @FormName VARCHAR(100);
    DECLARE @Values NVARCHAR(MAX);
    DECLARE @TableName SYSNAME;
    DECLARE @PrimaryKey NVARCHAR(400);
    DECLARE @ObjectID INT;
    DECLARE @QualifiedTable NVARCHAR(520);
    DECLARE @InsertColumns NVARCHAR(MAX);
    DECLARE @InsertValues NVARCHAR(MAX);
    DECLARE @KeyWhere NVARCHAR(MAX);
    DECLARE @Sql NVARCHAR(MAX);
    DECLARE @MatchedRows BIGINT = 0;
    DECLARE @InsertedRows INT = 0;
    DECLARE @MissingRequiredColumns NVARCHAR(MAX);

    IF ISJSON(ISNULL(@q, '')) <> 1
    BEGIN
        SELECT 1 AS [code], N'Dữ liệu thêm mới không phải JSON hợp lệ.' AS [msg];
        RETURN;
    END;

    SET @FormName = JSON_VALUE(@q, '$.FormName');
    SET @Values = JSON_QUERY(@q, '$.Values');

    IF NULLIF(LTRIM(RTRIM(@FormName)), '') IS NULL OR ISJSON(@Values) <> 1
    BEGIN
        SELECT 1 AS [code], N'Dữ liệu thêm mới không hợp lệ: thiếu FormName hoặc Values.' AS [msg];
        RETURN;
    END;

    SELECT TOP (1)
        @TableName = NULLIF(LTRIM(RTRIM(ISNULL(TableName, FormID))), ''),
        @PrimaryKey = NULLIF(LTRIM(RTRIM(PrimaryKey)), '')
    FROM dbo.SY_FrmLstTbl
    WHERE FormID = @FormName;

    SET @ObjectID = OBJECT_ID(@TableName);
    IF @ObjectID IS NULL
    BEGIN
        SELECT 1 AS [code], N'Form không được cấu hình bảng dữ liệu hợp lệ.' AS [msg];
        RETURN;
    END;

    SET @QualifiedTable = QUOTENAME(OBJECT_SCHEMA_NAME(@ObjectID)) + N'.' + QUOTENAME(OBJECT_NAME(@ObjectID));

    IF NOT EXISTS (SELECT 1 FROM OPENJSON(@Values))
    BEGIN
        SELECT 1 AS [code], N'Không có giá trị để thêm mới.' AS [msg];
        RETURN;
    END;

    -- Chỉ cho phép ghi cột thật, có thể ghi và không phải rowversion.
    IF EXISTS
    (
        SELECT 1
        FROM OPENJSON(@Values) valueData
        LEFT JOIN sys.columns columnData
            ON columnData.object_id = @ObjectID
           AND columnData.name = valueData.[key] COLLATE DATABASE_DEFAULT
        LEFT JOIN sys.types typeData
            ON typeData.user_type_id = columnData.user_type_id
        WHERE columnData.column_id IS NULL
           OR columnData.is_identity = 1
           OR columnData.is_computed = 1
           OR typeData.name IN ('timestamp', 'rowversion')
    )
    BEGIN
        SELECT 1 AS [code], N'Dữ liệu thêm mới chứa trường không hợp lệ hoặc chỉ đọc.' AS [msg];
        RETURN;
    END;

    -- Form phải công khai khóa chính để API tạo điều kiện kiểm tra trùng an toàn.
    IF @PrimaryKey IS NULL
       OR EXISTS
       (
           SELECT 1
           FROM STRING_SPLIT(@PrimaryKey, ';') primaryKeyData
           WHERE NULLIF(LTRIM(RTRIM(primaryKeyData.value)), '') IS NOT NULL
             AND NOT EXISTS
             (
                 SELECT 1
                 FROM OPENJSON(@Values) valueData
                 WHERE valueData.[key] COLLATE DATABASE_DEFAULT = LTRIM(RTRIM(primaryKeyData.value))
             )
       )
    BEGIN
        SELECT 1 AS [code], N'Dữ liệu thêm mới không có đủ khóa chính của form.' AS [msg];
        RETURN;
    END;

    -- Mọi cột NOT NULL không có DEFAULT phải được cung cấp, trừ cột identity/computed.
    SELECT @MissingRequiredColumns = STRING_AGG(QUOTENAME(columnData.name), N', ')
    FROM sys.columns columnData
    WHERE columnData.object_id = @ObjectID
      AND columnData.is_nullable = 0
      AND columnData.is_identity = 0
      AND columnData.is_computed = 0
      AND columnData.default_object_id = 0
      AND NOT EXISTS
      (
          SELECT 1
          FROM OPENJSON(@Values) valueData
          WHERE valueData.[key] COLLATE DATABASE_DEFAULT = columnData.name COLLATE DATABASE_DEFAULT
      );

    IF @MissingRequiredColumns IS NOT NULL
    BEGIN
        SELECT
            1 AS [code],
            N'Vui lòng nhập đủ các trường bắt buộc: ' + @MissingRequiredColumns AS [msg],
            @MissingRequiredColumns AS [MissingColumns];
        RETURN;
    END;

    IF EXISTS
    (
        SELECT 1
        FROM OPENJSON(@Values) valueData
        INNER JOIN sys.columns columnData
            ON columnData.object_id = @ObjectID
           AND columnData.name = valueData.[key] COLLATE DATABASE_DEFAULT
        WHERE columnData.is_nullable = 0
          AND valueData.[type] = 0 -- JSON null
    )
    BEGIN
        SELECT 1 AS [code], N'Trường bắt buộc không được để trống.' AS [msg];
        RETURN;
    END;

    ;WITH ValueColumns AS
    (
        SELECT
            columnData.column_id,
            columnData.name AS ColumnName,
            typeData.name AS TypeName,
            columnData.max_length,
            columnData.[precision],
            columnData.scale
        FROM OPENJSON(@Values) valueData
        INNER JOIN sys.columns columnData
            ON columnData.object_id = @ObjectID
           AND columnData.name = valueData.[key] COLLATE DATABASE_DEFAULT
        INNER JOIN sys.types typeData
            ON typeData.user_type_id = columnData.user_type_id
        WHERE NOT (
            columnData.default_object_id <> 0
            AND (valueData.[type] = 0 OR NULLIF(LTRIM(RTRIM(valueData.[value])), '') IS NULL)
        )
    ), TypedColumns AS
    (
        SELECT *,
            CASE
                WHEN TypeName IN ('nvarchar', 'nchar') THEN TypeName + N'(' + CASE WHEN max_length = -1 THEN N'MAX' ELSE CONVERT(NVARCHAR(10), max_length / 2) END + N')'
                WHEN TypeName IN ('varchar', 'char', 'varbinary', 'binary') THEN TypeName + N'(' + CASE WHEN max_length = -1 THEN N'MAX' ELSE CONVERT(NVARCHAR(10), max_length) END + N')'
                WHEN TypeName IN ('decimal', 'numeric') THEN TypeName + N'(' + CONVERT(NVARCHAR(10), [precision]) + N',' + CONVERT(NVARCHAR(10), scale) + N')'
                WHEN TypeName IN ('datetime2', 'datetimeoffset', 'time') THEN TypeName + N'(' + CONVERT(NVARCHAR(10), scale) + N')'
                ELSE TypeName
            END AS SqlType,
            N'$.Values."' + REPLACE(REPLACE(ColumnName, N'\', N'\\'), N'"', N'\"') + N'"' AS JsonPath
        FROM ValueColumns
    )
    SELECT
        @InsertColumns = STRING_AGG(QUOTENAME(ColumnName), N', ') WITHIN GROUP (ORDER BY column_id),
        @InsertValues = STRING_AGG
        (
            N'TRY_CONVERT(' + SqlType + N', ' +
            CASE WHEN TypeName = 'bit'
                THEN N'CASE LOWER(JSON_VALUE(@Payload, N''' + REPLACE(JsonPath, '''', '''''') + N''')) WHEN N''true'' THEN N''1'' WHEN N''false'' THEN N''0'' ELSE JSON_VALUE(@Payload, N''' + REPLACE(JsonPath, '''', '''''') + N''') END'
                ELSE N'JSON_VALUE(@Payload, N''' + REPLACE(JsonPath, '''', '''''') + N''')'
            END +
            N')',
            N', '
        ) WITHIN GROUP (ORDER BY column_id)
    FROM TypedColumns;

    ;WITH KeyColumns AS
    (
        SELECT
            columnData.column_id,
            columnData.name AS ColumnName,
            typeData.name AS TypeName,
            columnData.max_length,
            columnData.[precision],
            columnData.scale
        FROM STRING_SPLIT(@PrimaryKey, ';') primaryKeyData
        INNER JOIN sys.columns columnData
            ON columnData.object_id = @ObjectID
           AND columnData.name = LTRIM(RTRIM(primaryKeyData.value)) COLLATE DATABASE_DEFAULT
        INNER JOIN sys.types typeData
            ON typeData.user_type_id = columnData.user_type_id
        WHERE NULLIF(LTRIM(RTRIM(primaryKeyData.value)), '') IS NOT NULL
    ), TypedColumns AS
    (
        SELECT *,
            CASE
                WHEN TypeName IN ('nvarchar', 'nchar') THEN TypeName + N'(' + CASE WHEN max_length = -1 THEN N'MAX' ELSE CONVERT(NVARCHAR(10), max_length / 2) END + N')'
                WHEN TypeName IN ('varchar', 'char', 'varbinary', 'binary') THEN TypeName + N'(' + CASE WHEN max_length = -1 THEN N'MAX' ELSE CONVERT(NVARCHAR(10), max_length) END + N')'
                WHEN TypeName IN ('decimal', 'numeric') THEN TypeName + N'(' + CONVERT(NVARCHAR(10), [precision]) + N',' + CONVERT(NVARCHAR(10), scale) + N')'
                WHEN TypeName IN ('datetime2', 'datetimeoffset', 'time') THEN TypeName + N'(' + CONVERT(NVARCHAR(10), scale) + N')'
                ELSE TypeName
            END AS SqlType,
            N'$.Values."' + REPLACE(REPLACE(ColumnName, N'\', N'\\'), N'"', N'\"') + N'"' AS JsonPath
        FROM KeyColumns
    )
    SELECT @KeyWhere = STRING_AGG
    (
        QUOTENAME(ColumnName) + N' = TRY_CONVERT(' + SqlType + N', ' +
        CASE WHEN TypeName = 'bit'
            THEN N'CASE LOWER(JSON_VALUE(@Payload, N''' + REPLACE(JsonPath, '''', '''''') + N''')) WHEN N''true'' THEN N''1'' WHEN N''false'' THEN N''0'' ELSE JSON_VALUE(@Payload, N''' + REPLACE(JsonPath, '''', '''''') + N''') END'
            ELSE N'JSON_VALUE(@Payload, N''' + REPLACE(JsonPath, '''', '''''') + N''')'
        END +
        N')',
        N' AND '
    ) WITHIN GROUP (ORDER BY column_id)
    FROM TypedColumns;

    IF NULLIF(@InsertColumns, '') IS NULL OR NULLIF(@KeyWhere, '') IS NULL
    BEGIN
        SELECT 1 AS [code], N'Không tạo được câu thêm mới an toàn.' AS [msg];
        RETURN;
    END;

    BEGIN TRY
        BEGIN TRANSACTION;

        SET @Sql = N'SELECT @CountOut = COUNT_BIG(1) FROM ' + @QualifiedTable + N' WHERE ' + @KeyWhere + N';';
        EXEC sys.sp_executesql
            @Sql,
            N'@Payload NVARCHAR(MAX), @CountOut BIGINT OUTPUT',
            @Payload = @q,
            @CountOut = @MatchedRows OUTPUT;

        IF @MatchedRows > 0
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 1 AS [code], N'Dữ liệu có khóa chính này đã tồn tại.' AS [msg];
            RETURN;
        END;

        SET @Sql = N'INSERT INTO ' + @QualifiedTable + N' (' + @InsertColumns + N') VALUES (' + @InsertValues + N'); SET @RowsOut = @@ROWCOUNT;';
        EXEC sys.sp_executesql
            @Sql,
            N'@Payload NVARCHAR(MAX), @RowsOut INT OUTPUT',
            @Payload = @q,
            @RowsOut = @InsertedRows OUTPUT;

        IF @InsertedRows <> 1
            THROW 50001, N'Không thể xác nhận chính xác một dòng đã được thêm mới.', 1;

        COMMIT TRANSACTION;
        SELECT 0 AS [code], N'Đã thêm mới dữ liệu thành công.' AS [msg];
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        SELECT 1 AS [code], ERROR_MESSAGE() AS [msg];
    END CATCH;
END;
GO
