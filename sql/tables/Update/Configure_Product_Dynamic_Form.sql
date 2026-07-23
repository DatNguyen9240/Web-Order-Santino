-- Cấu hình metadata cho form sản phẩm động.
-- Prerequisite: chạy sql/views/VW_WebProductDynamic.sql và sql/API_SanPham_Xoa.sql.
SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    DECLARE @Forms TABLE (FormID VARCHAR(100) PRIMARY KEY);
    INSERT INTO @Forms (FormID)
    VALUES ('frmProduct'), ('TenHang2Frm'), ('products');

    DECLARE @Actions TABLE
    (
        [Action] VARCHAR(20) PRIMARY KEY,
        [Source] NVARCHAR(400) NOT NULL,
        Oderby INT NOT NULL
    );
    INSERT INTO @Actions ([Action], [Source], Oderby)
    VALUES
        ('SEARCH', N'/API_LaySanPham', 10),
        ('CREATE', N'/API_SanPham_Luu', 20),
        ('UPDATE', N'/API_SanPham_Luu', 30),
        ('DELETE', N'/API_SanPham_Xoa', 40);

    DECLARE @Dropdowns TABLE
    (
        ColumnID VARCHAR(100) PRIMARY KEY,
        Caption NVARCHAR(255) NOT NULL,
        [Source] NVARCHAR(400) NOT NULL
    );
    INSERT INTO @Dropdowns (ColumnID, Caption, [Source])
    VALUES
        ('CategoryID', N'Nhóm hàng', N'/API_DanhMuc?Loai=nhom_hang'),
        ('Form', N'Form', N'/API_DanhMuc?Loai=form'),
        ('nhom_size', N'Nhóm size', N'/API_DanhMuc?Loai=nhom_size');

    -- View chứa schema read-model có thêm nhom_size; API CRUD lấy từ action metadata ở trên.
    UPDATE formConfig
    SET TableName = 'dbo.VW_WebProductDynamic'
    FROM dbo.SY_FrmLstTbl formConfig
    INNER JOIN @Forms formData ON formData.FormID = formConfig.FormID;

    -- Hiện CategoryID (Nhóm hàng) trên grid, giữ nguyên mọi cột ẩn khác.
    UPDATE formConfig
    SET HideColumnArr = ISNULL(cleaned.HiddenColumns, '')
    FROM dbo.SY_FrmLstTbl formConfig
    INNER JOIN @Forms formData ON formData.FormID = formConfig.FormID
    CROSS APPLY
    (
        SELECT STUFF((
            SELECT ';' + LTRIM(RTRIM(value))
            FROM STRING_SPLIT(ISNULL(formConfig.HideColumnArr, ''), ';')
            WHERE LTRIM(RTRIM(value)) <> ''
              AND LOWER(LTRIM(RTRIM(value))) <> 'categoryid'
            FOR XML PATH(''), TYPE
        ).value('.', 'VARCHAR(MAX)'), 1, 1, '') AS HiddenColumns
    ) cleaned;

    UPDATE existing
    SET
        existing.[Source] = sourceData.[Source],
        existing.ColumnID = '',
        existing.IsDisable = 0,
        existing.Oderby = sourceData.Oderby
    FROM dbo.SY_FrmMstActTbl existing
    INNER JOIN @Forms formData ON formData.FormID = existing.FormID
    INNER JOIN @Actions sourceData ON sourceData.[Action] = existing.[Action]
    WHERE existing.MaterAction = 'API';

    INSERT INTO dbo.SY_FrmMstActTbl
    (
        UserAutoID, FormID, MaterAction, [Action],
        [Source], ColumnID, IsDisable, Oderby
    )
    SELECT
        CONVERT(VARCHAR(36), NEWID()),
        formData.FormID,
        'API',
        actionData.[Action],
        actionData.[Source],
        '',
        0,
        actionData.Oderby
    FROM @Forms formData
    CROSS JOIN @Actions actionData
    WHERE NOT EXISTS
    (
        SELECT 1
        FROM dbo.SY_FrmMstActTbl existing
        WHERE existing.FormID = formData.FormID
          AND existing.MaterAction = 'API'
          AND existing.[Action] = actionData.[Action]
    );

    UPDATE existing
    SET
        existing.ValueColumn = 'id',
        existing.DisplayColumn = 'name',
        existing.[Source] = dropdownData.[Source],
        existing.LinkColumn = '',
        existing.Type = 'Dropdown',
        existing.Caption = dropdownData.Caption,
        existing.isLock = 0,
        existing.isInvisible = 0,
        existing.IsDisable = 0
    FROM dbo.SY_FrmDrdwTbl existing
    INNER JOIN @Forms formData ON formData.FormID = existing.FormID
    INNER JOIN @Dropdowns dropdownData ON dropdownData.ColumnID = existing.ColumnID;

    INSERT INTO dbo.SY_FrmDrdwTbl
    (
        UserAutoID, FormID, GridName, ColumnID,
        ValueColumn, DisplayColumn, [Source], LinkColumn,
        DisableAddNew, Type, KeepValue, IsMultiSelect,
        IsNotInList, IsDisable, IsReload, Caption,
        isLock, isInvisible, isWordWrap, isMultiValue,
        ReloadType, EditType, TriggerOnOpenForm
    )
    SELECT
        CONVERT(VARCHAR(36), NEWID()),
        formData.FormID,
        '',
        dropdownData.ColumnID,
        'id', 'name', dropdownData.[Source], '',
        0, 'Dropdown', 0, 0,
        0, 0, 0, dropdownData.Caption,
        0, 0, 0, 0,
        0, 0, 0
    FROM @Forms formData
    CROSS JOIN @Dropdowns dropdownData
    WHERE NOT EXISTS
    (
        SELECT 1
        FROM dbo.SY_FrmDrdwTbl existing
        WHERE existing.FormID = formData.FormID
          AND existing.ColumnID = dropdownData.ColumnID
    );

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;
GO
