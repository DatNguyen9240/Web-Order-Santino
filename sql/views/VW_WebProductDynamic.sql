IF OBJECT_ID('dbo.VW_WebProductDynamic', 'V') IS NOT NULL
    DROP VIEW dbo.VW_WebProductDynamic;
GO

-- Read model cho màn hình sản phẩm động.
-- Giữ toàn bộ cột của bảng gốc và thêm nhóm size được suy ra từ SKU hiện hành.
CREATE VIEW dbo.VW_WebProductDynamic
AS
SELECT
    product.*,
    sizeGroup.nhom_size
FROM dbo.CF_TenHang2Tbl product
OUTER APPLY
(
    SELECT MAX(sizeConfig.NhomSize) AS nhom_size
    FROM dbo.CF_ItemTbl sku
    INNER JOIN dbo.CF_NhomSizeTbl sizeConfig
        ON sizeConfig.Size = sku.Size
    WHERE sku.ItemName2 = product.ItemName2
      AND ((sku.MauSac IS NULL AND product.MauSac IS NULL) OR sku.MauSac = product.MauSac)
      AND (sku.isDisable = 0 OR sku.isDisable IS NULL)
) sizeGroup;
GO
