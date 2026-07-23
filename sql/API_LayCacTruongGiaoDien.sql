-- =========================================================================
-- SCRIPT TẠO STORED PROCEDURE LẤY CẤU HÌNH GIAO DIỆN ĐỘNG (DYNAMIC ENGINE)
-- HỆ THỐNG METADATA CHUẨN: SY_FrmLstTbl, SY_FmtFldTbl, SY_FrmDrdwTbl, SY_FmatTbl
-- =========================================================================

IF OBJECT_ID('dbo.API_LayCacTruongGiaoDien', 'P') IS NOT NULL
    DROP PROCEDURE [dbo].[API_LayCacTruongGiaoDien];
GO

CREATE PROCEDURE [dbo].[API_LayCacTruongGiaoDien]
    @FormName VARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @FormName IS NULL RETURN;

    -- Lấy thông tin cấu hình từ SY_FrmLstTbl
    DECLARE @TableName VARCHAR(100) = '';
    DECLARE @PrimaryKey VARCHAR(100) = '';
    DECLARE @HideColumnArr VARCHAR(MAX) = '';
    DECLARE @AddNewColumnArr VARCHAR(MAX) = '';
    DECLARE @EditorColumnArr VARCHAR(MAX) = '';
    DECLARE @LockColumnArr VARCHAR(MAX) = '';

    SELECT TOP (1)
        @TableName = ISNULL(formConfig.TableName, formConfig.FormID),
        @PrimaryKey = NULLIF(LTRIM(RTRIM(formConfig.PrimaryKey)), ''),
        @HideColumnArr = ISNULL(formConfig.HideColumnArr, ''),
        @AddNewColumnArr = ISNULL(formConfig.AddNewColumnArr, ''),
        @EditorColumnArr = ISNULL(formConfig.EditorColumnArr, ''),
        @LockColumnArr = ISNULL(formConfig.LockColumnArr, '')
    FROM dbo.SY_FrmLstTbl formConfig
    WHERE formConfig.FormID = @FormName OR formConfig.TableName = @FormName;

    IF @TableName = '' SET @TableName = @FormName;

    DECLARE @ObjectId INT = OBJECT_ID(@TableName);

    -- Route mặc định dùng API CRUD theo tên bảng. Form có nghiệp vụ riêng có thể
    -- override trong SY_FrmMstActTbl với MaterAction = 'API'.
    DECLARE @ApiSearch NVARCHAR(400) = '/' + @TableName;
    DECLARE @ApiDetail NVARCHAR(400) = '/' + @TableName;
    DECLARE @ApiCreate NVARCHAR(400) = '/' + @TableName;
    DECLARE @ApiUpdate NVARCHAR(400) = '/API_CapNhatDuLieuChung';
    -- Backend triển khai chỉ cho phép GET/POST. Trang động dùng một POST API
    -- chung để xóa an toàn theo FormName, không gọi HTTP DELETE vào route bảng.
    DECLARE @ApiDelete NVARCHAR(400) = '/API_XoaDuLieuChung';
    DECLARE @ApiConfigured BIT = 0;

    IF EXISTS (
        SELECT 1
        FROM dbo.SY_FrmMstActTbl
        WHERE FormID = @FormName
          AND UPPER(ISNULL(MaterAction, '')) = 'API'
          AND ISNULL(IsDisable, 0) = 0
          AND NULLIF(LTRIM(RTRIM(Source)), '') IS NOT NULL
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
        WHERE FormID = @FormName
          AND UPPER(ISNULL(MaterAction, '')) = 'API'
          AND ISNULL(IsDisable, 0) = 0;
    END;

    -- Lấy cấu hình các trường từ sys.columns kết hợp với các bảng từ điển chuẩn (hỗ trợ không phân biệt chữ hoa/thường)
    SELECT 
        c.name AS [name], 
        COALESCE(NULLIF(f.CaptionVN, ''), NULLIF(dd.Caption, ''), c.name) AS [label],
        
        -- Cột bắt buộc nếu là NOT NULL, không tự sinh và không có DEFAULT.
        CASE 
            WHEN c.is_nullable = 0
             AND c.is_identity = 0
             AND c.is_computed = 0
             AND c.default_object_id = 0
             AND NOT EXISTS (
                 SELECT 1 FROM STRING_SPLIT(@LockColumnArr, ';') s
                 WHERE LOWER(LTRIM(RTRIM(s.value))) = LOWER(c.name)
             ) THEN 1
            ELSE 0 
        END AS [required], 
        
        ISNULL(@PrimaryKey, '') AS [primaryKey],
        ISNULL(@ApiSearch, '')  AS [apiSearch],
        ISNULL(@ApiDetail, '')  AS [apiDetail],
        ISNULL(@ApiCreate, '')  AS [apiCreate],
        ISNULL(@ApiUpdate, '')  AS [apiUpdate],
        -- Giữ apiSave cho DynamicPage cũ; form mới nên dùng apiCreate/apiUpdate.
        ISNULL(@ApiCreate, '')  AS [apiSave],
        ISNULL(@ApiDelete, '')  AS [apiDelete],
        @ApiConfigured          AS [apiConfigured],
        
        -- showInAdd
        CASE 
            WHEN c.is_identity = 1 OR c.is_computed = 1 THEN 0
            WHEN ISNULL(dd.isInvisible, 0) = 1 THEN 0
            WHEN NULLIF(LTRIM(RTRIM(@AddNewColumnArr)), '') IS NOT NULL 
                 AND NOT EXISTS (
                     SELECT 1 FROM STRING_SPLIT(@AddNewColumnArr, ';') s 
                     WHERE LOWER(LTRIM(RTRIM(s.value))) = LOWER(c.name)
                 ) THEN 0
            ELSE 1
        END AS [showInAdd],
        
        -- showInEdit
        CASE 
            -- Khóa chính vẫn hiện khi sửa nhưng bị khóa ở isReadOnlyEdit.
            WHEN c.is_identity = 1 OR c.is_computed = 1 THEN 0
            WHEN ISNULL(dd.isInvisible, 0) = 1 THEN 0
            WHEN NULLIF(LTRIM(RTRIM(@EditorColumnArr)), '') IS NOT NULL 
                 AND NOT EXISTS (
                     SELECT 1 FROM STRING_SPLIT(@EditorColumnArr, ';') s 
                     WHERE LOWER(LTRIM(RTRIM(s.value))) = LOWER(c.name)
                 ) THEN 0
            ELSE 1
        END AS [showInEdit],
        
        -- isReadOnlyEdit
        CASE 
            WHEN LOWER(c.name) = LOWER(@PrimaryKey) OR c.is_identity = 1 OR c.is_computed = 1 THEN 1
            WHEN EXISTS (
                SELECT 1 FROM STRING_SPLIT(@LockColumnArr, ';') s
                WHERE LOWER(LTRIM(RTRIM(s.value))) = LOWER(c.name)
            ) THEN 1
            WHEN ISNULL(dd.isLock, 0) = 1 THEN 1
            ELSE 0
        END AS [isReadOnlyEdit],
        
        -- isReadOnlyAdd
        CASE 
            WHEN c.is_identity = 1 OR c.is_computed = 1 THEN 1
            WHEN EXISTS (
                SELECT 1 FROM STRING_SPLIT(@LockColumnArr, ';') s
                WHERE LOWER(LTRIM(RTRIM(s.value))) = LOWER(c.name)
            ) THEN 1
            WHEN ISNULL(dd.isLock, 0) = 1 THEN 1
            ELSE 0
        END AS [isReadOnlyAdd],
        
        -- showInGrid
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM STRING_SPLIT(@HideColumnArr, ';') s 
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
        
        -- orderNo
        CASE 
            WHEN NULLIF(LTRIM(RTRIM(@EditorColumnArr)), '') IS NULL THEN c.column_id
            ELSE COALESCE(NULLIF(CHARINDEX(';' + c.name + ';', ';' + @EditorColumnArr + ';'), 0), 10000 + c.column_id)
        END AS [orderNo]
    FROM sys.columns c
    INNER JOIN sys.types t ON t.user_type_id = c.user_type_id
    LEFT JOIN dbo.SY_FmtFldTbl f ON LOWER(f.FieldName) = LOWER(c.name)
    LEFT JOIN dbo.SY_FmatTbl fm ON LOWER(fm.FormatID) = LOWER(f.FormatID)
    LEFT JOIN dbo.SY_FrmDrdwTbl dd ON dd.FormID = @FormName AND LOWER(dd.ColumnID) = LOWER(c.name)
    WHERE c.object_id = @ObjectId

    ORDER BY 
        CASE 
            WHEN NULLIF(LTRIM(RTRIM(@EditorColumnArr)), '') IS NULL THEN c.column_id
            ELSE COALESCE(NULLIF(CHARINDEX(';' + c.name + ';', ';' + @EditorColumnArr + ';'), 0), 10000 + c.column_id)
        END ASC, 
        c.column_id ASC;
END
GO
