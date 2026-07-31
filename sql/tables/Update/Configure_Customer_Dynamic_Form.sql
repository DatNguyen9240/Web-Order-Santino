-- =========================================================================
-- CẤU HÌNH METADATA ĐỘNG CHUẨN HỆ THỐNG CHO ObjectListFrm (ẨN CỘT DÙNG WEB)
-- =========================================================================
SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    DECLARE @FormID VARCHAR(100) = 'ObjectListFrm';

    -- 1. LOẠI BỎ isWeb KHỎI LƯỚI VÀ MODAL (CHỈ CÒN CÁC TRƯỜNG NGHIỆP VỤ CẦN THIẾT)
    UPDATE dbo.SY_FrmLstTbl
    SET TableName = 'dbo.CF_ObjectTbl',
        PrimaryKey = 'ObjectID',
        AddNewColumnArr = 'ObjectName;Phone;Address;ObjectGroupID;LocationID;EmployeeID;BranchID;PaymentTypeID;PaymentTermID;Notes',
        EditorColumnArr = 'ObjectName;Phone;Address;ObjectGroupID;LocationID;EmployeeID;BranchID;PaymentTypeID;PaymentTermID;Notes',
        DefaultColumnArr = 'ObjectID;ObjectName;Phone;Address;ObjectGroupID;LocationID;EmployeeID;BranchID',
        HideColumnArr = 'isWeb'
    WHERE FormID = @FormID;

    -- 2. CẤU HÌNH CÁC DROPDOWN CHUẨN BẢNG TỪ ĐIỂN
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

    -- 3. CẤU HÌNH TIÊU ĐỀ TIẾNG VIỆT CHO CÁC TRƯỜNG FORM (SY_FmtFldTbl)
    DELETE FROM dbo.SY_FmtFldTbl WHERE FormName = @FormID;

    INSERT INTO dbo.SY_FmtFldTbl (FormatID, FieldName, FormName, CaptionVN, AlignX, MinWidth, MaxWidth)
    VALUES
        ('Z', 'ObjectID',      @FormID, N'Mã KH',               'L', 120, 300),
        ('Z', 'ObjectName',    @FormID, N'Tên khách hàng',     'L', 200, 500),
        ('Z', 'Phone',         @FormID, N'Số điện thoại',      'C', 130, 300),
        ('Z', 'Address',       @FormID, N'Địa chỉ',            'L', 220, 500),
        ('Z', 'ObjectGroupID', @FormID, N'Nhóm KH',            'L', 150, 300),
        ('Z', 'LocationID',    @FormID, N'Tỉnh / Thành',       'L', 150, 300),
        ('Z', 'EmployeeID',    @FormID, N'Nhân viên',          'L', 160, 300),
        ('Z', 'BranchID',      @FormID, N'Chi nhánh',          'L', 140, 300),
        ('Z', 'PaymentTypeID', @FormID, N'Hình thức thanh toán','L', 150, 300),
        ('Z', 'PaymentTermID', @FormID, N'Hạn mức TT',          'L', 150, 300),
        ('Z', 'Notes',         @FormID, N'Ghi chú',            'L', 200, 500);

    COMMIT TRANSACTION;
    PRINT N'=== ĐÃ LOẠI BỎ CỘT isWeb THÀNH CÔNG ===';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;
GO
