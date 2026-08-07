IF OBJECT_ID('dbo.API_LaySanPham', 'P') IS NOT NULL DROP PROCEDURE dbo.API_LaySanPham;
GO

CREATE PROCEDURE dbo.API_LaySanPham
    @TimKiem NVARCHAR(4000) = NULL,
    @IsWebOnly BIT = 0,
    @Page INT = 1,
    @Limit INT = 20,
    @q NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF ISJSON(@q) = 1
    BEGIN
        SET @TimKiem = JSON_VALUE(@q, '$.TimKiem');
        IF LOWER(ISNULL(COALESCE(JSON_VALUE(@q, '$.isWeb'), JSON_VALUE(@q, '$.IsWebOnly'), JSON_VALUE(@q, '$.is_web')), '0')) IN ('1', 'true')
            SET @IsWebOnly = 1;
    END
    ELSE IF @q IS NOT NULL AND @q <> ''
    BEGIN
        SET @TimKiem = @q;
    END;

    SET @TimKiem = NULLIF(LTRIM(RTRIM(@TimKiem)), '');
    SET @IsWebOnly = ISNULL(@IsWebOnly, 0);

    -- Bảng tạm gom nhóm Size/Barcode
    SELECT 
        ci.ItemName2,
        MAX(ns.NhomSize) nhom_size,
        MAX(ci.Unit) Unit,
        MAX(ci.BarCode) BarCode
    INTO #TempSizes
    FROM dbo.CF_ItemTbl ci WITH (NOLOCK)
    LEFT JOIN dbo.CF_NhomSizeTbl ns WITH (NOLOCK) ON ci.Size = ns.Size
    WHERE ci.isDisable = 0 OR ci.isDisable IS NULL
    GROUP BY ci.ItemName2;

    -- Truy vấn chính
    SELECT 
        t2.*,
        cat.CategoryName,
        ts.nhom_size,
        B.ItemHD, 
        B.ItemNameHD, 
        B.VATPercent, 
        B.ItemBanLeID, 
        B.ItemBanLeName, 
        B.ItemDaiLyID, 
        B.ItemDaiLyName, 
        B.ItemKhacID, 
        B.ItemKhacName,
        (
            SELECT DISTINCT Size FROM dbo.CF_ItemTbl ci WITH (NOLOCK)
            WHERE ci.ItemName2 = t2.ItemName2 AND (ci.isDisable = 0 OR ci.isDisable IS NULL)
            FOR JSON PATH
        ) AS SizesJson
    FROM dbo.CF_TenHang2Tbl t2 WITH (NOLOCK)
    LEFT JOIN #TempSizes ts ON t2.ItemName2 = ts.ItemName2
    LEFT JOIN dbo.CF_CategoryTbl cat WITH (NOLOCK) ON t2.CategoryID = cat.CategoryID
    LEFT JOIN dbo.CF_ItemThueTbl B WITH (NOLOCK) ON t2.ItemName2 = B.ItemName2
    WHERE (ISNULL(t2.isDisable, 0) = 0 AND t2.isWeb = 1)
      AND (@TimKiem IS NULL OR t2.ItemName2 LIKE '%' + @TimKiem + '%' OR t2.TenHangHoa LIKE N'%' + @TimKiem + '%')
    ORDER BY t2.ItemName2 ASC;

    DROP TABLE #TempSizes;
END;
GO
