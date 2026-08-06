-- =========================================================================
-- SCRIPT TẠO STORED PROCEDURE LẤY CẤU HÌNH GIAO DIỆN ĐỘNG (DYNAMIC ENGINE)
-- HỆ THỐNG METADATA CHUẨN: SY_FrmLstTbl, SY_FmtFldTbl, SY_FrmDrdwTbl, SY_FmatTbl
-- CHỐNG NGUYÊN NHÂN TRẢ VỀ 0 RESULT-SET GÂY LỖI 'Store Info2 error' Ở BACKEND C#
-- =========================================================================

IF OBJECT_ID('dbo.API_LayCacTruongGiaoDien', 'P') IS NOT NULL
    DROP PROCEDURE [dbo].[API_LayCacTruongGiaoDien];
GO

CREATE PROCEDURE [dbo].[API_LayCacTruongGiaoDien]
    @FormName NVARCHAR(MAX) = NULL,
    @FormID NVARCHAR(MAX) = NULL,
    @Form NVARCHAR(MAX) = NULL,
    @q NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- 1. Ưu tiên lấy tên Form từ các tên tham số khác nhau mà Backend C# có thể truyền
    SET @FormName = COALESCE(
        NULLIF(LTRIM(RTRIM(@FormName)), ''),
        NULLIF(LTRIM(RTRIM(@FormID)), ''),
        NULLIF(LTRIM(RTRIM(@Form)), '')
    );

    -- 2. Bóc tách FormName nếu @FormName là chuỗi JSON
    IF @FormName LIKE '%{%'
    BEGIN
        DECLARE @p1 INT = CHARINDEX('"FormName"', @FormName);
        IF @p1 = 0 SET @p1 = CHARINDEX('"formName"', @FormName);
        IF @p1 = 0 SET @p1 = CHARINDEX('"FormID"', @FormName);
        IF @p1 = 0 SET @p1 = CHARINDEX('"formId"', @FormName);
        
        IF @p1 > 0
        BEGIN
            DECLARE @p2 INT = CHARINDEX(':', @FormName, @p1);
            IF @p2 > 0
            BEGIN
                DECLARE @vStart INT = CHARINDEX('"', @FormName, @p2) + 1;
                DECLARE @vEnd INT = CHARINDEX('"', @FormName, @vStart);
                IF @vStart > 1 AND @vEnd > @vStart
                BEGIN
                    SET @FormName = SUBSTRING(@FormName, @vStart, @vEnd - @vStart);
                END;
            END;
        END;
    END;

    -- 3. Bóc tách FormName từ @q nếu là chuỗi JSON payload
    IF @q LIKE '%{%' AND (@FormName IS NULL OR @FormName = '' OR @FormName LIKE '%{%')
    BEGIN
        DECLARE @qp1 INT = CHARINDEX('"FormName"', @q);
        IF @qp1 = 0 SET @qp1 = CHARINDEX('"formName"', @q);
        IF @qp1 = 0 SET @qp1 = CHARINDEX('"FormID"', @q);
        IF @qp1 = 0 SET @qp1 = CHARINDEX('"formId"', @q);
        
        IF @qp1 > 0
        BEGIN
            DECLARE @qp2 INT = CHARINDEX(':', @q, @qp1);
            IF @qp2 > 0
            BEGIN
                DECLARE @qvStart INT = CHARINDEX('"', @q, @qp2) + 1;
                DECLARE @qvEnd INT = CHARINDEX('"', @q, @qvStart);
                IF @qvStart > 1 AND @qvEnd > @qvStart
                BEGIN
                    SET @FormName = SUBSTRING(@q, @qvStart, @qvEnd - @qvStart);
                END;
            END;
        END;
    END;

    SET @FormName = LTRIM(RTRIM(ISNULL(@FormName, '')));

    -- Lấy thông tin cấu hình từ SY_FrmLstTbl
    DECLARE @MatchedFormID VARCHAR(100) = '';
    DECLARE @TableName VARCHAR(100) = '';
    DECLARE @PrimaryKey VARCHAR(100) = '';
    DECLARE @HideColumnArr VARCHAR(MAX) = '';
    DECLARE @DefaultColumnArr VARCHAR(MAX) = '';
    DECLARE @AddNewColumnArr VARCHAR(MAX) = '';
    DECLARE @EditorColumnArr VARCHAR(MAX) = '';
    DECLARE @LockColumnArr VARCHAR(MAX) = '';

    SELECT TOP (1)
        @MatchedFormID = ISNULL(formConfig.FormID, @FormName),
        @TableName = ISNULL(formConfig.TableName, formConfig.FormID),
        @PrimaryKey = NULLIF(LTRIM(RTRIM(formConfig.PrimaryKey)), ''),
        @HideColumnArr = ISNULL(formConfig.HideColumnArr, ''),
        @DefaultColumnArr = ISNULL(formConfig.DefaultColumnArr, ''),
        @AddNewColumnArr = ISNULL(formConfig.AddNewColumnArr, ''),
        @EditorColumnArr = ISNULL(formConfig.EditorColumnArr, ''),
        @LockColumnArr = ISNULL(formConfig.LockColumnArr, '')
    FROM dbo.SY_FrmLstTbl formConfig
    WHERE formConfig.FormID = @FormName OR formConfig.TableName = @FormName
    ORDER BY CASE WHEN formConfig.FormID = @FormName THEN 1 ELSE 2 END ASC;

    -- NẾU KHÔNG TÌM THẤY TÊN BẢNG TRONG BẢNG CẤU HÌNH, THỬ TÌM TRỰC TIẾP TRONG SYS.TABLES
    IF OBJECT_ID(@TableName) IS NULL
    BEGIN
        SELECT TOP 1 @TableName = sysTbl.name
        FROM sys.tables sysTbl
        WHERE sysTbl.name = @FormName 
           OR sysTbl.name = 'CF_' + @FormName + 'Tbl'
           OR sysTbl.name = 'WEB_' + @FormName + 'Tbl'
           OR sysTbl.name = 'WA_' + @FormName + 'Tbl';
    END;

    IF @TableName = '' SET @TableName = @FormName;
    IF @MatchedFormID = '' SET @MatchedFormID = @FormName;

    DECLARE @ObjectId INT = OBJECT_ID(@TableName);

    DECLARE @ApiSearch NVARCHAR(400) = '/' + @TableName;
    DECLARE @ApiDetail NVARCHAR(400) = '/' + @TableName;
    DECLARE @ApiCreate NVARCHAR(400) = '/' + @TableName;
    DECLARE @ApiUpdate NVARCHAR(400) = '/API_CapNhatDuLieuChung';
    DECLARE @ApiDelete NVARCHAR(400) = '/API_XoaDuLieuChung';
    DECLARE @ApiConfigured BIT = 0;

    IF EXISTS (
        SELECT 1 FROM dbo.SY_FrmMstActTbl
        WHERE FormID = @MatchedFormID AND UPPER(ISNULL(MaterAction, '')) = 'API' AND ISNULL(IsDisable, 0) = 0 AND NULLIF(LTRIM(RTRIM(Source)), '') IS NOT NULL
    )
    BEGIN
        SET @ApiConfigured = 1;
        SELECT
            @ApiSearch = COALESCE(MAX(CASE WHEN UPPER(Action) IN ('SEARCH', 'LIST') THEN NULLIF(LTRIM(RTRIM(Source)), '') END), @ApiSearch),
            @ApiDetail = COALESCE(MAX(CASE WHEN UPPER(Action) = 'DETAIL' THEN NULLIF(LTRIM(RTRIM(Source)), '') END), @ApiDetail),
            @ApiCreate = COALESCE(MAX(CASE WHEN UPPER(Action) IN ('CREATE', 'ADD') THEN NULLIF(LTRIM(RTRIM(Source)), '') END), @ApiCreate),
            @ApiUpdate = COALESCE(MAX(CASE WHEN UPPER(Action) IN ('UPDATE', 'EDIT') THEN NULLIF(LTRIM(RTRIM(Source)), '') END), @ApiUpdate),
            @ApiDelete = COALESCE(MAX(CASE WHEN UPPER(Action) = 'DELETE' THEN NULLIF(LTRIM(RTRIM(Source)), '') END), @ApiDelete)
        FROM dbo.SY_FrmMstActTbl
        WHERE FormID = @MatchedFormID AND UPPER(ISNULL(MaterAction, '')) = 'API' AND ISNULL(IsDisable, 0) = 0;
    END;

    -- TRUY VẤN CHÍNH: LUÔN TRẢ VỀ ÍT NHẤT 1 RESULT-SET ĐỂ BACKEND C# KHÔNG BAO GIỜ BỊ LỖI 'Store Info2 error'
    SELECT 
        c.name AS [name], 
        COALESCE(NULLIF(f.CaptionVN, ''), NULLIF(dd.Caption, ''), c.name) AS [label],
        
        CASE 
            WHEN c.is_nullable = 0 AND c.is_identity = 0 AND c.is_computed = 0 AND c.default_object_id = 0
             AND NOT EXISTS (SELECT 1 FROM STRING_SPLIT(@LockColumnArr, ';') s WHERE LOWER(LTRIM(RTRIM(s.value))) = LOWER(c.name)) THEN 1
            ELSE 0 
        END AS [required], 
        
        ISNULL(@PrimaryKey, '') AS [primaryKey],
        ISNULL(@ApiSearch, '')  AS [apiSearch],
        ISNULL(@ApiDetail, '')  AS [apiDetail],
        ISNULL(@ApiCreate, '')  AS [apiCreate],
        ISNULL(@ApiUpdate, '')  AS [apiUpdate],
        ISNULL(@ApiCreate, '')  AS [apiSave],
        ISNULL(@ApiDelete, '')  AS [apiDelete],
        @ApiConfigured          AS [apiConfigured],
        ISNULL(@MatchedFormID, '') AS [formId],
        ISNULL(@TableName, '') AS [tableName],
        ISNULL(@HideColumnArr, '') AS [hideColumnArr],
        ISNULL(@DefaultColumnArr, '') AS [defaultColumnArr],
        
        CASE 
            WHEN c.is_identity = 1 OR c.is_computed = 1 THEN 0
            WHEN ISNULL(dd.isInvisible, 0) = 1 THEN 0
            WHEN EXISTS (SELECT 1 FROM STRING_SPLIT(@HideColumnArr, ';') s WHERE LOWER(LTRIM(RTRIM(s.value))) = LOWER(c.name)) THEN 0
            WHEN NULLIF(LTRIM(RTRIM(@AddNewColumnArr)), '') IS NOT NULL 
                 AND NOT EXISTS (SELECT 1 FROM STRING_SPLIT(@AddNewColumnArr, ';') s WHERE LOWER(LTRIM(RTRIM(s.value))) = LOWER(c.name)) THEN 0
            ELSE 1
        END AS [showInAdd],
        
        CASE 
            WHEN c.is_identity = 1 OR c.is_computed = 1 THEN 0
            WHEN ISNULL(dd.isInvisible, 0) = 1 THEN 0
            WHEN EXISTS (SELECT 1 FROM STRING_SPLIT(@HideColumnArr, ';') s WHERE LOWER(LTRIM(RTRIM(s.value))) = LOWER(c.name)) THEN 0
            WHEN NULLIF(LTRIM(RTRIM(@EditorColumnArr)), '') IS NOT NULL 
                 AND NOT EXISTS (SELECT 1 FROM STRING_SPLIT(@EditorColumnArr, ';') s WHERE LOWER(LTRIM(RTRIM(s.value))) = LOWER(c.name)) THEN 0
            ELSE 1
        END AS [showInEdit],
        
        CASE 
            WHEN LOWER(c.name) = LOWER(@PrimaryKey) OR c.is_identity = 1 OR c.is_computed = 1 THEN 1
            WHEN EXISTS (SELECT 1 FROM STRING_SPLIT(@LockColumnArr, ';') s WHERE LOWER(LTRIM(RTRIM(s.value))) = LOWER(c.name)) THEN 1
            WHEN ISNULL(dd.isLock, 0) = 1 THEN 1
            ELSE 0
        END AS [isReadOnlyEdit],
        
        CASE 
            WHEN c.is_identity = 1 OR c.is_computed = 1 THEN 1
            WHEN EXISTS (SELECT 1 FROM STRING_SPLIT(@LockColumnArr, ';') s WHERE LOWER(LTRIM(RTRIM(s.value))) = LOWER(c.name)) THEN 1
            WHEN ISNULL(dd.isLock, 0) = 1 THEN 1
            ELSE 0
        END AS [isReadOnlyAdd],
        
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM STRING_SPLIT(@HideColumnArr, ';') s 
                WHERE LOWER(LTRIM(RTRIM(s.value))) = LOWER(c.name)
            ) THEN 0
            WHEN NULLIF(LTRIM(RTRIM(@DefaultColumnArr)), '') IS NOT NULL 
                 AND NOT EXISTS (
                     SELECT 1 FROM STRING_SPLIT(@DefaultColumnArr, ';') s 
                     WHERE LOWER(LTRIM(RTRIM(s.value))) = LOWER(c.name)
                 ) THEN 0
            ELSE 1
        END AS [showInGrid],

        f.FormatID AS [renderRule],
        ISNULL(dd.Source, '') AS [dataSource],
        ISNULL(dd.ValueColumn, '') AS [dropdownValueColumn],
        ISNULL(dd.DisplayColumn, '') AS [dropdownDisplayColumn],
        ISNULL(dd.Type, '') AS [dropdownType],
        t.name AS [dataType],
        ISNULL(dd.LinkColumn, '') AS [LinkColumn],
        ISNULL(fm.Type, '') AS [formatType],
        fm.NumberDecimal AS [numberDecimal],
        ISNULL(fm.FormatString, '') AS [formatString],
        
        CASE 
            WHEN NULLIF(LTRIM(RTRIM(@EditorColumnArr)), '') IS NULL THEN c.column_id
            ELSE COALESCE(NULLIF(CHARINDEX(';' + c.name + ';', ';' + @EditorColumnArr + ';'), 0), 10000 + c.column_id)
        END AS [orderNo]
    FROM sys.columns c
    INNER JOIN sys.types t ON t.user_type_id = c.user_type_id
    
    OUTER APPLY (
        SELECT TOP (1) fmt.FormatID, fmt.CaptionVN
        FROM dbo.SY_FmtFldTbl fmt
        WHERE LOWER(fmt.FieldName) = LOWER(c.name)
          AND (fmt.FormName = @MatchedFormID OR ISNULL(fmt.FormName, '') = '')
        ORDER BY CASE WHEN fmt.FormName = @MatchedFormID THEN 1 ELSE 2 END ASC
    ) f
    
    LEFT JOIN dbo.SY_FmatTbl fm ON LOWER(fm.FormatID) = LOWER(f.FormatID)
    
    OUTER APPLY (
        SELECT TOP (1) dd1.*
        FROM dbo.SY_FrmDrdwTbl dd1
        WHERE LOWER(dd1.ColumnID) = LOWER(c.name)
          AND (dd1.FormID = @MatchedFormID OR ISNULL(dd1.FormID, '') = '')
        ORDER BY CASE WHEN dd1.FormID = @MatchedFormID THEN 1 ELSE 2 END ASC
    ) dd

    WHERE c.object_id = @ObjectId

    ORDER BY 
        CASE 
            WHEN NULLIF(LTRIM(RTRIM(@EditorColumnArr)), '') IS NULL THEN c.column_id
            ELSE COALESCE(NULLIF(CHARINDEX(';' + c.name + ';', ';' + @EditorColumnArr + ';'), 0), 10000 + c.column_id)
        END ASC, 
        c.column_id ASC;
END
GO
