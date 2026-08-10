-- Cấu hình Metadata tiếng Việt & Cột hiển thị cho Đơn hàng (WEB_OrderFrm & WEB_OrderDetailFrm)
SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    DECLARE @FormID VARCHAR(100) = 'WEB_OrderFrm';

    -- 1. CẤU HÌNH BAN ĐẦU HOẶC CẬP NHẬT TRONG BẢNG SY_FrmLstTbl
    IF NOT EXISTS (SELECT 1 FROM dbo.SY_FrmLstTbl WHERE FormID = @FormID)
    BEGIN
        INSERT INTO dbo.SY_FrmLstTbl (
            FormID, FormType, CaptionVN, CaptionEN, TableName, PrimaryKey, 
            AddNewColumnArr, EditorColumnArr, DefaultColumnArr, HideColumnArr
        )
        VALUES (
            @FormID, 'LISTEDIT', N'Danh sách đơn hàng', 'Order List', 'dbo.WEB_OrderTbl', 'DocumentID',
            'DocumentDate;BranchID;ObjectID;ObjectName;EmployeeID;CTKM;BaseTotal;TotalAmount;Notes',
            'DocumentDate;BranchID;ObjectID;ObjectName;EmployeeID;CTKM;BaseTotal;TotalAmount;Notes',
            'DocumentID;DocumentDate;BranchID;ObjectID;ObjectName;EmployeeID;CTKM;BaseTotal;TotalAmount;Status',
            'UserAutoID'
        );
    END
    ELSE
    BEGIN
        UPDATE dbo.SY_FrmLstTbl
        SET TableName = 'dbo.WEB_OrderTbl',
            PrimaryKey = 'DocumentID',
            DefaultColumnArr = 'DocumentID;DocumentDate;BranchID;ObjectID;ObjectName;EmployeeID;CTKM;BaseTotal;TotalAmount;Status',
            HideColumnArr = 'UserAutoID'
        WHERE FormID = @FormID;
    END;

    -- 2. NẠP ĐẦY ĐỦ TIÊU ĐỀ TIẾNG VIỆT CHO BẢNG ĐƠN HÀNG VÀO SY_FmtFldTbl
    DELETE FROM dbo.SY_FmtFldTbl WHERE FormName IN ('WEB_OrderFrm', 'WEB_OrderDetailFrm');

    INSERT INTO dbo.SY_FmtFldTbl (FormatID, FieldName, FormName, CaptionVN, AlignX, MinWidth, MaxWidth)
    VALUES
        ('Z', 'DocumentID',     'WEB_OrderFrm', N'Mã đơn hàng',         'L', 140, 300),
        ('D', 'DocumentDate',   'WEB_OrderFrm', N'Ngày lập đơn',        'C', 120, 200),
        ('Z', 'BranchID',       'WEB_OrderFrm', N'Kho / Chi nhánh',     'L', 140, 300),
        ('Z', 'ObjectID',       'WEB_OrderFrm', N'Mã khách hàng',      'L', 130, 300),
        ('Z', 'ObjectName',     'WEB_OrderFrm', N'Tên khách hàng',      'L', 200, 500),
        ('Z', 'EmployeeID',     'WEB_OrderFrm', N'Nhân viên bán hàng',  'L', 160, 300),
        ('Z', 'CTKM',           'WEB_OrderFrm', N'Chương trình KM',     'L', 150, 300),
        ('B', 'BaseTotal',      'WEB_OrderFrm', N'Tổng tiền hàng',      'R', 140, 250),
        ('B', 'TotalAmount',    'WEB_OrderFrm', N'Tổng thanh toán',     'R', 150, 250),
        ('B', 'KhachDua',       'WEB_OrderFrm', N'Tiền khách đưa',      'R', 140, 250),
        ('B', 'TraLai',         'WEB_OrderFrm', N'Tiền trả lại',       'R', 140, 250),
        ('Z', 'Memo',           'WEB_OrderFrm', N'Diễn giải',           'L', 200, 500),
        ('Z', 'Notes',          'WEB_OrderFrm', N'Ghi chú',             'L', 200, 500),
        ('Z', 'Status',         'WEB_OrderFrm', N'Trạng thái đơn',      'C', 120, 200),
        
        -- Cột chi tiết đơn hàng
        ('Z', 'ItemID',         'WEB_OrderDetailFrm', N'Mã hàng hóa',   'L', 130, 300),
        ('Z', 'ItemName',       'WEB_OrderDetailFrm', N'Tên hàng hóa',  'L', 200, 500),
        ('Z', 'Size',           'WEB_OrderDetailFrm', N'Size / Kích cỡ','C', 100, 200),
        ('Z', 'Quantity',       'WEB_OrderDetailFrm', N'Số lượng',      'R', 100, 200),
        ('B', 'UnitPrice',      'WEB_OrderDetailFrm', N'Đơn giá',       'R', 130, 250),
        ('B', 'Amount',         'WEB_OrderDetailFrm', N'Thành tiền',    'R', 140, 250);

    COMMIT TRANSACTION;
    PRINT N'=== NẠP TIÊU ĐỀ TIẾNG VIỆT CHO ĐƠN HÀNG THÀNH CÔNG ===';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;
GO
