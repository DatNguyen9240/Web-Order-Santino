-- Cấu hình CRUD chung cho form Chương trình khuyến mại.
-- Prerequisite: chạy API_ThemDuLieuChung.sql, API_CapNhatDuLieuChung.sql và API_XoaDuLieuChung.sql.
SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    -- UserAutoID là khóa kỹ thuật, phải do CSDL tự sinh thay vì xuất hiện trên form.
    IF COL_LENGTH('dbo.CF_CTKMTbl', 'UserAutoID') IS NULL
    BEGIN
        THROW 50002, N'Không tìm thấy cột UserAutoID trong CF_CTKMTbl.', 1;
    END;

    IF NOT EXISTS
    (
        SELECT 1
        FROM sys.default_constraints defaultData
        INNER JOIN sys.columns columnData
            ON columnData.object_id = defaultData.parent_object_id
           AND columnData.column_id = defaultData.parent_column_id
        WHERE defaultData.parent_object_id = OBJECT_ID('dbo.CF_CTKMTbl')
          AND columnData.name = 'UserAutoID'
    )
    BEGIN
        ALTER TABLE dbo.CF_CTKMTbl
            ADD CONSTRAINT DF_CF_CTKMTbl_UserAutoID
            DEFAULT (CONVERT(VARCHAR(36), NEWID())) FOR UserAutoID;
    END;

    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.SY_FrmLstTbl
        WHERE FormID = 'frmPromotion'
    )
    BEGIN
        THROW 50001, N'Không tìm thấy cấu hình frmPromotion trong SY_FrmLstTbl.', 1;
    END;

    -- Tự lấy mọi cột nghiệp vụ. UserAutoID là mã kỹ thuật nên ẩn ở grid lẫn form.
    -- Khi bảng có cột nghiệp vụ mới, chạy lại migration để metadata tự bổ sung cột đó.
    DECLARE @BusinessColumns VARCHAR(MAX);
    SELECT @BusinessColumns = STRING_AGG(columnData.name, ';') WITHIN GROUP (ORDER BY columnData.column_id)
    FROM sys.columns columnData
    INNER JOIN sys.types typeData
        ON typeData.user_type_id = columnData.user_type_id
    WHERE columnData.object_id = OBJECT_ID('dbo.CF_CTKMTbl')
      AND LOWER(columnData.name) <> 'userautoid'
      AND columnData.is_identity = 0
      AND columnData.is_computed = 0
      AND typeData.name NOT IN ('timestamp', 'rowversion');

    -- Khóa CTKM vẫn read-only khi sửa theo quy tắc metadata chung.
    UPDATE dbo.SY_FrmLstTbl
    SET
        TableName = 'dbo.CF_CTKMTbl',
        PrimaryKey = 'CTKM',
        HideColumnArr = 'UserAutoID',
        AddNewColumnArr = ISNULL(@BusinessColumns, ''),
        EditorColumnArr = ISNULL(@BusinessColumns, ''),
        LockColumnArr = ''
    WHERE FormID = 'frmPromotion';

    -- Format ngày là dữ liệu metadata. Tự gán D cho mọi cột ngày thực tế của form,
    -- không cần liệt kê riêng Ngày bắt đầu/Ngày kết thúc trong code.
    UPDATE fieldConfig
    SET FormatID = 'D'
    FROM dbo.SY_FmtFldTbl fieldConfig
    INNER JOIN sys.columns columnData
        ON LOWER(columnData.name) = LOWER(fieldConfig.FieldName)
    INNER JOIN sys.types typeData
        ON typeData.user_type_id = columnData.user_type_id
    WHERE columnData.object_id = OBJECT_ID('dbo.CF_CTKMTbl')
      AND typeData.name IN ('date', 'datetime', 'datetime2', 'smalldatetime', 'datetimeoffset')
      AND (NULLIF(LTRIM(RTRIM(fieldConfig.FormName)), '') IS NULL OR fieldConfig.FormName = 'frmPromotion');

    DECLARE @Actions TABLE
    (
        [Action] VARCHAR(20) PRIMARY KEY,
        [Source] NVARCHAR(400) NOT NULL,
        Oderby INT NOT NULL
    );
    INSERT INTO @Actions ([Action], [Source], Oderby)
    VALUES
        ('SEARCH', N'/CF_CTKMTbl', 10),
        ('CREATE', N'/API_ThemDuLieuChung', 20),
        ('UPDATE', N'/API_CapNhatDuLieuChung', 30),
        ('DELETE', N'/API_XoaDuLieuChung', 40);

    UPDATE existing
    SET
        existing.[Source] = actionData.[Source],
        existing.ColumnID = '',
        existing.IsDisable = 0,
        existing.Oderby = actionData.Oderby
    FROM dbo.SY_FrmMstActTbl existing
    INNER JOIN @Actions actionData ON actionData.[Action] = existing.[Action]
    WHERE existing.FormID = 'frmPromotion'
      AND existing.MaterAction = 'API';

    INSERT INTO dbo.SY_FrmMstActTbl
    (
        UserAutoID, FormID, MaterAction, [Action],
        [Source], ColumnID, IsDisable, Oderby
    )
    SELECT
        CONVERT(VARCHAR(36), NEWID()),
        'frmPromotion',
        'API',
        actionData.[Action],
        actionData.[Source],
        '',
        0,
        actionData.Oderby
    FROM @Actions actionData
    WHERE NOT EXISTS
    (
        SELECT 1
        FROM dbo.SY_FrmMstActTbl existing
        WHERE existing.FormID = 'frmPromotion'
          AND existing.MaterAction = 'API'
          AND existing.[Action] = actionData.[Action]
    );

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;
GO
