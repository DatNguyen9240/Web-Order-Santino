-- =========================================================================
-- CẤU HÌNH METADATA ĐỘNG DÀNH RIÊNG CHO WEB APP (WA_CustomerFrm)
-- KHÔNG ẢNH HƯỞNG TỚI FORM CỦA ERP (ObjectListFrm)
-- =========================================================================
SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    DECLARE @FormID VARCHAR(100) = 'WA_CustomerFrm';
    DECLARE @FormName VARCHAR(100) = 'WA_CustomerFrm';

    -- 0. CẬP NHẬT TÊN FORM TRONG BẢNG MENU WA_Menu CHO KHÁCH HÀNG
    IF OBJECT_ID('dbo.WA_Menu', 'U') IS NOT NULL
    BEGIN
        UPDATE dbo.WA_Menu
        SET FormName = @FormID
        WHERE URLPara = '/customers' OR MenuID = '60' OR FormName = 'WEB_CustomerFrm';
    END;

    -- 1. CẤU HÌNH CHO FORM WEB APP (WA_CustomerFrm) TRONG SY_FrmLstTbl
    -- Cột isWeb được ẩn (HideColumnArr = 'isWeb')
    DELETE FROM dbo.SY_FrmLstTbl WHERE FormID = @FormID;

    INSERT INTO dbo.SY_FrmLstTbl (
        FormID, FormType, CaptionVN, CaptionEN, TableName, PrimaryKey, 
        AddNewColumnArr, EditorColumnArr, DefaultColumnArr, HideColumnArr
    )
    VALUES (
        @FormID, 'LISTEDIT', N'Danh mục khách hàng', 'Customer List', 'dbo.CF_ObjectTbl', 'ObjectID',
        'ObjectName;Phone;Address;ObjectGroupID;LocationID;EmployeeID;BranchID;PaymentTypeID;PaymentTermID;Notes',
        'ObjectName;Phone;Address;ObjectGroupID;LocationID;EmployeeID;BranchID;PaymentTypeID;PaymentTermID;Notes',
        'ObjectID;ObjectName;Phone;Address;ObjectGroupID;LocationID;EmployeeID;BranchID',
        'isWeb'
    );

    -- 2. CẤU HÌNH API ACTION ROUTING CHO WEB APP (SY_FrmMstActTbl)
    DELETE FROM dbo.SY_FrmMstActTbl WHERE FormID = @FormID;

    INSERT INTO dbo.SY_FrmMstActTbl (UserAutoID, FormID, MaterAction, [Action], [Source], ColumnID, IsDisable, Oderby)
    VALUES
        (CONVERT(VARCHAR(36), NEWID()), @FormID, 'API', 'SEARCH', '/API_LayDanhSachKhachHang', '', 0, 1),
        (CONVERT(VARCHAR(36), NEWID()), @FormID, 'API', 'DETAIL', '/API_LayDanhSachKhachHang', '', 0, 2),
        (CONVERT(VARCHAR(36), NEWID()), @FormID, 'API', 'CREATE', '/API_KhachHang_Luu', '', 0, 3),
        (CONVERT(VARCHAR(36), NEWID()), @FormID, 'API', 'UPDATE', '/API_KhachHang_Luu', '', 0, 4),
        (CONVERT(VARCHAR(36), NEWID()), @FormID, 'API', 'DELETE', '/API_KhachHang_Xoa', '', 0, 5);

    -- 3. CẤU HÌNH CÁC DROPDOWN CHUẨN BẢNG TỪ ĐIỂN (SY_FrmDrdwTbl)
    DELETE FROM dbo.SY_FrmDrdwTbl WHERE FormID = @FormID;

    INSERT INTO dbo.SY_FrmDrdwTbl (
        UserAutoID, FormID, GridName, ColumnID, ValueColumn, DisplayColumn, [Source], 
        DisableAddNew, Type, KeepValue, IsMultiSelect, IsNotInList, IsDisable, IsReload, Caption
    )
    VALUES
        (CONVERT(VARCHAR(36), NEWID()), @FormID, '', 'ObjectGroupID', 'ObjectGroupID', 'ObjectGroupName', 'Select * from CF_ObjectGroupTbl', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Nhóm KH'),
        (CONVERT(VARCHAR(36), NEWID()), @FormID, '', 'LocationID',    'LocationID',    'LocationName',    'Select * from CF_LocationTbl',    0, 'Dropdown', 0, 0, 0, 0, 0, N'Tỉnh / Thành'),
        (CONVERT(VARCHAR(36), NEWID()), @FormID, '', 'EmployeeID',    'EmployeeID',    'EmployeeName',    'Select EmployeeID, EmployeeName From CF_EmployeeTbl', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Nhân viên'),
        (CONVERT(VARCHAR(36), NEWID()), @FormID, '', 'BranchID',      'BranchID',      'BranchName',      'Select * from CF_BranchTbl where isDisable = 0', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Chi nhánh'),
        (CONVERT(VARCHAR(36), NEWID()), @FormID, '', 'PaymentTypeID', 'PaymentTypeID', 'PaymentTypeName', 'Select * from CF_PaymentTypeTbl', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Hình thức thanh toán'),
        (CONVERT(VARCHAR(36), NEWID()), @FormID, '', 'PaymentTermID', 'PaymentTermID', 'PaymentTermName', 'Select * from CF_PaymentTermTbl', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Hạn mức TT');

    -- 4. CẤU HÌNH TIÊU ĐỀ TIẾNG VIỆT CHO CÁC TRƯỜNG FORM (SY_FmtFldTbl)
    DELETE FROM dbo.SY_FmtFldTbl WHERE FormName = @FormName;

    INSERT INTO dbo.SY_FmtFldTbl (FormatID, FieldName, FormName, CaptionVN, AlignX, MinWidth, MaxWidth)
    VALUES
        ('Z', 'ObjectID',      @FormName, N'Mã KH',               'L', 120, 300),
        ('Z', 'ObjectName',    @FormName, N'Tên khách hàng',     'L', 200, 500),
        ('Z', 'Phone',         @FormName, N'Số điện thoại',      'C', 130, 300),
        ('Z', 'Address',       @FormName, N'Địa chỉ',            'L', 220, 500),
        ('Z', 'ObjectGroupID', @FormName, N'Nhóm KH',            'L', 150, 300),
        ('Z', 'LocationID',    @FormName, N'Tỉnh / Thành',       'L', 150, 300),
        ('Z', 'EmployeeID',    @FormName, N'Nhân viên',          'L', 160, 300),
        ('Z', 'BranchID',      @FormName, N'Chi nhánh',          'L', 140, 300),
        ('Z', 'PaymentTypeID', @FormName, N'Hình thức thanh toán','L', 150, 300),
        ('Z', 'PaymentTermID', @FormName, N'Hạn mức TT',          'L', 150, 300),
        ('Z', 'Notes',         @FormName, N'Ghi chú',            'L', 200, 500);

    COMMIT TRANSACTION;
    PRINT N'=== CẬP NHẬT METADATA DÀNH RIÊNG CHO WEB APP (WA_CustomerFrm) THÀNH CÔNG ===';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;
GO
