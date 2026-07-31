-- Cấu hình Metadata tiếng Việt & Cột hiển thị cho Sản phẩm / Hàng hóa (frmProduct & CF_ItemTbl)
SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    DECLARE @FormID VARCHAR(100) = 'frmProduct';

    -- 1. CẤU HÌNH BAN ĐẦU HOẶC CẬP NHẬT TRONG BẢNG SY_FrmLstTbl
    IF NOT EXISTS (SELECT 1 FROM dbo.SY_FrmLstTbl WHERE FormID = @FormID)
    BEGIN
        INSERT INTO dbo.SY_FrmLstTbl (
            FormID, FormType, CaptionVN, CaptionEN, TableName, PrimaryKey, 
            AddNewColumnArr, EditorColumnArr, DefaultColumnArr, HideColumnArr
        )
        VALUES (
            @FormID, 'LISTEDIT', N'Danh mục sản phẩm', 'Product List', 'dbo.CF_ItemTbl', 'ItemID',
            'ItemName;ItemGroupID;UnitID;Price;CostPrice;Size;MauSac;Barcode;Notes',
            'ItemName;ItemGroupID;UnitID;Price;CostPrice;Size;MauSac;Barcode;Notes',
            'ItemID;ItemName;ItemGroupID;UnitID;Price;CostPrice;Size;MauSac;isDisable',
            'UserAutoID'
        );
    END
    ELSE
    BEGIN
        UPDATE dbo.SY_FrmLstTbl
        SET TableName = 'dbo.CF_ItemTbl',
            PrimaryKey = 'ItemID',
            DefaultColumnArr = 'ItemID;ItemName;ItemGroupID;UnitID;Price;CostPrice;Size;MauSac;isDisable',
            HideColumnArr = 'UserAutoID'
        WHERE FormID = @FormID;
    END;

    -- 2. NẠP TIÊU ĐỀ TIẾNG VIỆT CHO SẢN PHẨM VÀO SY_FmtFldTbl
    DELETE FROM dbo.SY_FmtFldTbl WHERE FormName IN ('frmProduct', 'WEB_ProductFrm');

    INSERT INTO dbo.SY_FmtFldTbl (FormatID, FieldName, FormName, CaptionVN, AlignX, MinWidth, MaxWidth)
    VALUES
        ('Z', 'ItemID',      'frmProduct', N'Mã sản phẩm',    'L', 130, 300),
        ('Z', 'ItemName',    'frmProduct', N'Tên sản phẩm',   'L', 220, 500),
        ('Z', 'ItemGroupID', 'frmProduct', N'Nhóm sản phẩm',  'L', 140, 300),
        ('Z', 'UnitID',      'frmProduct', N'Đơn vị tính',    'C', 100, 200),
        ('Z', 'Price',       'frmProduct', N'Giá bán',        'R', 130, 250),
        ('Z', 'CostPrice',   'frmProduct', N'Giá vốn',        'R', 130, 250),
        ('Z', 'Size',        'frmProduct', N'Size / Kích cỡ', 'C', 100, 200),
        ('Z', 'MauSac',      'frmProduct', N'Màu sắc',        'L', 120, 200),
        ('Z', 'Barcode',     'frmProduct', N'Mã vạch',        'L', 130, 300),
        ('Z', 'Notes',       'frmProduct', N'Ghi chú',        'L', 200, 500),
        ('Z', 'isDisable',   'frmProduct', N'Trạng thái khóa','C', 110, 200);

    COMMIT TRANSACTION;
    PRINT N'=== NẠP TIÊU ĐỀ TIẾNG VIỆT CHO SẢN PHẨM THÀNH CÔNG ===';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;
GO
