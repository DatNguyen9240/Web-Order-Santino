IF OBJECT_ID('dbo.API_CapNhatWebSanPham', 'P') IS NOT NULL
    DROP PROCEDURE [dbo].[API_CapNhatWebSanPham];
GO

CREATE PROCEDURE [dbo].[API_CapNhatWebSanPham]
    @q NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Bóc tách các trường từ JSON q
    DECLARE @Items NVARCHAR(MAX) = JSON_VALUE(@q, '$.Items');
    DECLARE @IsWeb BIT           = CAST(JSON_VALUE(@q, '$.IsWeb') AS BIT);

    -- 2. Cập nhật trạng thái isWeb cho các sản phẩm khớp với danh sách truyền lên
    UPDATE t2
    SET t2.[isWeb] = @IsWeb
    FROM [dbo].[CF_TenHang2Tbl] t2
    INNER JOIN OPENJSON(@Items)
    WITH (
        ten_hang_2 VARCHAR(50) '$.ten_hang_2',
        mau NVARCHAR(50) '$.mau'
    ) json_items ON t2.[ItemName2] = json_items.ten_hang_2 AND t2.[MauSac] = json_items.mau;

    SELECT 0 AS [code], N'Cập nhật thành công' AS [msg];
END
GO
