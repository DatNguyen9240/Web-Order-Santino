IF OBJECT_ID('dbo.API_SanPham_Luu', 'P') IS NOT NULL
    DROP PROCEDURE [dbo].[API_SanPham_Luu];
GO

CREATE PROCEDURE [dbo].[API_SanPham_Luu]
    @q NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Bóc tách các trường từ JSON
    DECLARE @ItemName2 NVARCHAR(50)   = JSON_VALUE(@q, '$.ItemName2');
    DECLARE @MauSac NVARCHAR(50)      = JSON_VALUE(@q, '$.MauSac');
    DECLARE @TenHangHoa NVARCHAR(255) = JSON_VALUE(@q, '$.TenHangHoa');
    DECLARE @UnitPrice DECIMAL(18,2)  = CAST(JSON_VALUE(@q, '$.UnitPrice') AS DECIMAL(18,2));
    DECLARE @Form NVARCHAR(100)       = JSON_VALUE(@q, '$.Form');
    DECLARE @CategoryID NVARCHAR(50)  = JSON_VALUE(@q, '$.CategoryID');
    DECLARE @Design NVARCHAR(50)      = JSON_VALUE(@q, '$.Design');
    DECLARE @isDisable BIT            = ISNULL(CAST(JSON_VALUE(@q, '$.isDisable') AS BIT), 0);
    DECLARE @isWeb BIT                = ISNULL(CAST(JSON_VALUE(@q, '$.isWeb') AS BIT), 0);
    DECLARE @nhom_size NVARCHAR(50)   = JSON_VALUE(@q, '$.nhom_size');

    -- 2. Cập nhật hoặc Thêm mới vào bảng CF_TenHang2Tbl dựa trên khóa chính kép (ItemName2 + MauSac)
    IF EXISTS (SELECT 1 FROM [dbo].[CF_TenHang2Tbl] WHERE [ItemName2] = @ItemName2 AND [MauSac] = @MauSac)
    BEGIN
        UPDATE [dbo].[CF_TenHang2Tbl]
        SET [TenHangHoa] = ISNULL(@TenHangHoa, [TenHangHoa]),
            [UnitPrice] = ISNULL(@UnitPrice, [UnitPrice]),
            [Form] = ISNULL(@Form, [Form]),
            [CategoryID] = ISNULL(@CategoryID, [CategoryID]),
            [Design] = ISNULL(@Design, [Design]),
            [isDisable] = ISNULL(@isDisable, [isDisable]),
            [isWeb] = ISNULL(@isWeb, [isWeb])
        WHERE [ItemName2] = @ItemName2 AND [MauSac] = @MauSac;
    END
    ELSE
    BEGIN
        INSERT INTO [dbo].[CF_TenHang2Tbl] (
            [ItemName2], [MauSac], [TenHangHoa], [UnitPrice], [Form], [CategoryID], [Design], [isDisable], [isWeb]
        )
        VALUES (
            @ItemName2, @MauSac, @TenHangHoa, @UnitPrice, @Form, @CategoryID, @Design, @isDisable, @isWeb
        );
    END

    -- 3. Tự động sinh danh sách size tương ứng trong bảng CF_ItemTbl nếu chưa tồn tại
    IF @nhom_size IS NOT NULL AND @nhom_size <> ''
       AND NOT EXISTS (SELECT 1 FROM [dbo].[CF_ItemTbl] WHERE [ItemName2] = @ItemName2 AND [MauSac] = @MauSac)
    BEGIN
        INSERT INTO [dbo].[CF_ItemTbl] (
            [ItemID], [ItemName], [ItemName2], [Size], [MauSac], [UnitPrice], [isDisable], [Unit], [CategoryID]
        )
        SELECT 
            @ItemName2 + @MauSac + [Size] AS [ItemID],
            @TenHangHoa + ' ' + @MauSac + ' ' + [Size] AS [ItemName],
            @ItemName2 AS [ItemName2],
            [Size],
            @MauSac AS [MauSac],
            @UnitPrice AS [UnitPrice],
            0 AS [isDisable],
            N'Chiếc' AS [Unit],
            @CategoryID AS [CategoryID]
        FROM [dbo].[CF_NhomSizeTbl]
        WHERE [NhomSize] = @nhom_size;
    END

    -- Trả về phản hồi thành công
    SELECT 0 AS [code], N'Lưu sản phẩm thành công' AS [msg];
END
GO
