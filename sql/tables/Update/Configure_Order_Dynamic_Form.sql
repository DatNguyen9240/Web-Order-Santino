-- =========================================================================
-- Cấu hình Metadata Chuẩn CSDL cho Form Đơn Hàng (WEB_OrderFrm / WEB_OrderDetailFrm)
-- Prerequisite: Chạy trong SSMS để bổ sung bản ghi vào SY_FrmLstTbl & SY_FrmMstActTbl
-- =========================================================================
SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    -- 1. Thu thập các cột nghiệp vụ cho WEB_OrderTbl
    DECLARE @OrderBusinessColumns VARCHAR(MAX);
    SELECT @OrderBusinessColumns = STRING_AGG(columnData.name, ';') WITHIN GROUP (ORDER BY columnData.column_id)
    FROM sys.columns columnData
    INNER JOIN sys.types typeData ON typeData.user_type_id = columnData.user_type_id
    WHERE columnData.object_id = OBJECT_ID('dbo.WEB_OrderTbl')
      AND LOWER(columnData.name) <> 'userautoid'
      AND columnData.is_identity = 0 AND columnData.is_computed = 0
      AND typeData.name NOT IN ('timestamp', 'rowversion');

    -- Cấu hình SY_FrmLstTbl cho WEB_OrderFrm
    IF EXISTS (SELECT 1 FROM dbo.SY_FrmLstTbl WHERE FormID = 'WEB_OrderFrm')
    BEGIN
        UPDATE dbo.SY_FrmLstTbl
        SET
            CaptionVN = N'Quản lý Đơn Hàng',
            TableName = 'dbo.WEB_OrderTbl',
            PrimaryKey = 'DocumentID',
            HideColumnArr = 'UserAutoID',
            AddNewColumnArr = ISNULL(@OrderBusinessColumns, ''),
            EditorColumnArr = ISNULL(@OrderBusinessColumns, ''),
            LockColumnArr = 'DocumentID'
        WHERE FormID = 'WEB_OrderFrm';
    END
    ELSE
    BEGIN
        INSERT INTO dbo.SY_FrmLstTbl (FormID, CaptionVN, TableName, PrimaryKey, HideColumnArr, AddNewColumnArr, EditorColumnArr, LockColumnArr)
        VALUES ('WEB_OrderFrm', N'Quản lý Đơn Hàng', 'dbo.WEB_OrderTbl', 'DocumentID', 'UserAutoID', ISNULL(@OrderBusinessColumns, ''), ISNULL(@OrderBusinessColumns, ''), 'DocumentID');
    END;

    -- 2. Thu thập các cột nghiệp vụ cho WEB_OrderDetailTbl
    DECLARE @DetailBusinessColumns VARCHAR(MAX);
    SELECT @DetailBusinessColumns = STRING_AGG(columnData.name, ';') WITHIN GROUP (ORDER BY columnData.column_id)
    FROM sys.columns columnData
    INNER JOIN sys.types typeData ON typeData.user_type_id = columnData.user_type_id
    WHERE columnData.object_id = OBJECT_ID('dbo.WEB_OrderDetailTbl')
      AND LOWER(columnData.name) <> 'userautoid'
      AND columnData.is_identity = 0 AND columnData.is_computed = 0
      AND typeData.name NOT IN ('timestamp', 'rowversion');

    -- Cấu hình SY_FrmLstTbl cho WEB_OrderDetailFrm
    IF EXISTS (SELECT 1 FROM dbo.SY_FrmLstTbl WHERE FormID = 'WEB_OrderDetailFrm')
    BEGIN
        UPDATE dbo.SY_FrmLstTbl
        SET
            CaptionVN = N'Chi Tiết Đơn Hàng',
            TableName = 'dbo.WEB_OrderDetailTbl',
            PrimaryKey = 'DocumentID',
            HideColumnArr = 'UserAutoID',
            AddNewColumnArr = ISNULL(@DetailBusinessColumns, ''),
            EditorColumnArr = ISNULL(@DetailBusinessColumns, ''),
            LockColumnArr = ''
        WHERE FormID = 'WEB_OrderDetailFrm';
    END
    ELSE
    BEGIN
        INSERT INTO dbo.SY_FrmLstTbl (FormID, CaptionVN, TableName, PrimaryKey, HideColumnArr, AddNewColumnArr, EditorColumnArr, LockColumnArr)
        VALUES ('WEB_OrderDetailFrm', N'Chi Tiết Đơn Hàng', 'dbo.WEB_OrderDetailTbl', 'DocumentID', 'UserAutoID', ISNULL(@DetailBusinessColumns, ''), ISNULL(@DetailBusinessColumns, ''), '');
    END;

    -- 3. Cấu hình nhãn tiếng Việt & Format cho các trường trong SY_FmtFldTbl
    DECLARE @FldCaptions TABLE (FieldName VARCHAR(100), CaptionVN NVARCHAR(200), FormatID VARCHAR(50));
    INSERT INTO @FldCaptions (FieldName, CaptionVN, FormatID) VALUES
    ('DocumentID', N'Mã số phiếu', ''),
    ('DocumentDate', N'Ngày lập đơn', 'D'),
    ('BranchID', N'Kho / Chi nhánh', ''),
    ('ObjectID', N'Khách hàng', ''),
    ('ObjectName', N'Tên khách hàng', ''),
    ('EmployeeID', N'Nhân viên bán hàng', ''),
    ('Memo', N'Diễn giải', ''),
    ('Notes', N'Ghi chú', ''),
    ('CTKM', N'Chương trình KM', ''),
    ('BaseTotal', N'Tổng tiền hàng', 'B'),
    ('KhachDua', N'Tiền khách đưa', 'B'),
    ('Quantity', N'Số lượng', 'N'),
    ('UnitPrice', N'Đơn giá', 'B'),
    ('Amount', N'Thành tiền', 'B'),
    ('TotalAmount', N'Tổng thanh toán', 'B'),
    ('ItemID', N'Mã hàng hóa', ''),
    ('ItemName', N'Tên hàng hóa', ''),
    ('Size', N'Kích cỡ (Size)', ''),
    ('MauSac', N'Màu sắc', '');

    UPDATE f
    SET f.CaptionVN = c.CaptionVN,
        f.FormatID = CASE WHEN c.FormatID <> '' THEN c.FormatID ELSE f.FormatID END
    FROM dbo.SY_FmtFldTbl f
    INNER JOIN @FldCaptions c ON LOWER(f.FieldName) = LOWER(c.FieldName);

    INSERT INTO dbo.SY_FmtFldTbl (FieldName, CaptionVN, FormatID)
    SELECT c.FieldName, c.CaptionVN, c.FormatID
    FROM @FldCaptions c
    WHERE NOT EXISTS (SELECT 1 FROM dbo.SY_FmtFldTbl f WHERE LOWER(f.FieldName) = LOWER(c.FieldName));

    -- 4. Cấu hình Lookups Dropdown trong SY_FrmDrdwTbl
    DECLARE @Dropdowns TABLE (
        FormID VARCHAR(50), ColumnID VARCHAR(50), Caption NVARCHAR(200),
        [Source] NVARCHAR(400), ValueColumn VARCHAR(50), DisplayColumn VARCHAR(50), [Type] VARCHAR(50)
    );
    INSERT INTO @Dropdowns VALUES
    ('WEB_OrderFrm', 'ObjectID', N'Khách hàng', '/API_DanhMuc?Loai=Customer', 'ObjectID', 'ObjectName', 'dropselect'),
    ('WEB_OrderFrm', 'BranchID', N'Chi nhánh', '/API_DanhMuc?Loai=Branch', 'BranchID', 'BranchName', 'dropselect'),
    ('WEB_OrderFrm', 'EmployeeID', N'Nhân viên kinh doanh', '/API_DanhMuc?Loai=SalesPerson', 'EmployeeID', 'EmployeeName', 'dropselect'),
    ('WEB_OrderFrm', 'CTKM', N'Khuyến mãi', '/API_DanhMuc?Loai=Promotion', 'CTKM', 'TenCTKM', 'dropselect'),
    ('WEB_OrderFrm', 'PaymentTermID', N'Điều khoản TT', '/API_DanhMuc?Loai=PaymentTerm', 'PaymentTermID', 'PaymentTermName', 'dropselect'),
    ('WEB_OrderFrm', 'PaymentTypeID', N'Hình thức TT', '/API_DanhMuc?Loai=PaymentType', 'PaymentTypeID', 'PaymentTypeName', 'dropselect'),
    ('WEB_OrderDetailFrm', 'ItemID', N'Hàng hóa', '/API_LaySanPham', 'ItemID', 'ItemName', 'dropselect');

    UPDATE dd
    SET dd.Caption = d.Caption, dd.[Source] = d.[Source], dd.ValueColumn = d.ValueColumn,
        dd.DisplayColumn = d.DisplayColumn, dd.[Type] = d.[Type]
    FROM dbo.SY_FrmDrdwTbl dd
    INNER JOIN @Dropdowns d ON dd.FormID = d.FormID AND LOWER(dd.ColumnID) = LOWER(d.ColumnID);

    INSERT INTO dbo.SY_FrmDrdwTbl (FormID, ColumnID, Caption, [Source], ValueColumn, DisplayColumn, [Type])
    SELECT d.FormID, d.ColumnID, d.Caption, d.[Source], d.ValueColumn, d.DisplayColumn, d.[Type]
    FROM @Dropdowns d
    WHERE NOT EXISTS (
        SELECT 1 FROM dbo.SY_FrmDrdwTbl dd
        WHERE dd.FormID = d.FormID AND LOWER(dd.ColumnID) = LOWER(d.ColumnID)
    );

    -- 5. Đăng ký các Master Actions trong SY_FrmMstActTbl cho WEB_OrderFrm
    DECLARE @OrderActions TABLE ([Action] VARCHAR(20) PRIMARY KEY, [Source] NVARCHAR(400) NOT NULL, Oderby INT NOT NULL);
    INSERT INTO @OrderActions VALUES
    ('SEARCH', N'/WEB_OrderTbl', 10),
    ('CREATE', N'/API_TaoDonHang', 20),
    ('UPDATE', N'/API_CapNhatDuLieuChung', 30),
    ('DELETE', N'/API_XoaDuLieuChung', 40);

    UPDATE existing
    SET existing.[Source] = actionData.[Source], existing.ColumnID = '', existing.IsDisable = 0, existing.Oderby = actionData.Oderby
    FROM dbo.SY_FrmMstActTbl existing
    INNER JOIN @OrderActions actionData ON actionData.[Action] = existing.[Action]
    WHERE existing.FormID = 'WEB_OrderFrm' AND existing.MaterAction = 'API';

    INSERT INTO dbo.SY_FrmMstActTbl (UserAutoID, FormID, MaterAction, [Action], [Source], ColumnID, IsDisable, Oderby)
    SELECT CONVERT(VARCHAR(36), NEWID()), 'WEB_OrderFrm', 'API', actionData.[Action], actionData.[Source], '', 0, actionData.Oderby
    FROM @OrderActions actionData
    WHERE NOT EXISTS (
        SELECT 1 FROM dbo.SY_FrmMstActTbl existing
        WHERE existing.FormID = 'WEB_OrderFrm' AND existing.MaterAction = 'API' AND existing.[Action] = actionData.[Action]
    );

    COMMIT TRANSACTION;
    PRINT N'=== CẤU HÌNH METADATA CSDL WEB_OrderFrm THÀNH CÔNG ===';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;
GO
