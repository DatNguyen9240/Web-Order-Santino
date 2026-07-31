IF OBJECT_ID('dbo.API_LaySanPham', 'P') IS NOT NULL
    DROP PROCEDURE [dbo].[API_LaySanPham];
GO

CREATE PROCEDURE [dbo].[API_LaySanPham]
    @TimKiem NVARCHAR(4000) = NULL,
    @IsWebOnly BIT = 0,
    @Page INT = 1,
    @Limit INT = 20,
    @q NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Đảm bảo phân trang hợp lệ
    IF @Page IS NULL OR @Page <= 0 SET @Page = 1;
    IF @Limit IS NULL OR @Limit <= 0 SET @Limit = 20;

    -- Xử lý giá trị NULL của IsWebOnly
    SET @IsWebOnly = ISNULL(@IsWebOnly, 0);

    -- Nếu có truyền q dạng JSON (từ ô tìm kiếm nhanh), ta parse từ khóa tìm kiếm ra
    DECLARE @JsonStr NVARCHAR(MAX) = NULL;
    IF @q IS NOT NULL AND @q <> '' AND @q LIKE '%{%'
        SET @JsonStr = @q;
    ELSE IF @TimKiem IS NOT NULL AND @TimKiem <> '' AND LEFT(LTRIM(@TimKiem), 1) = '{'
        SET @JsonStr = @TimKiem;

    IF @JsonStr IS NOT NULL AND ISJSON(@JsonStr) = 1
    BEGIN
        SET @TimKiem = (SELECT TOP 1 [value] FROM OPENJSON(@JsonStr) WHERE [key] LIKE '%$lk');
        IF @TimKiem IS NULL
            SET @TimKiem = (SELECT TOP 1 [value] FROM OPENJSON(@JsonStr));
        SET @TimKiem = ISNULL(REPLACE(@TimKiem, '%', ''), '');
    END

    -- 1. Tạo bảng tạm gom nhóm thông tin size từ CF_ItemTbl
    IF OBJECT_ID('tempdb..#TempSizes') IS NOT NULL DROP TABLE #TempSizes;
    
    SELECT 
        ci.[ItemName2],
        ci.[MauSac],
        MAX(ns.[NhomSize]) AS [nhom_size]
    INTO #TempSizes
    FROM [dbo].[CF_ItemTbl] ci
    LEFT JOIN [dbo].[CF_NhomSizeTbl] ns ON ci.[Size] = ns.[Size]
    WHERE (ci.[isDisable] = 0 OR ci.[isDisable] IS NULL)
    GROUP BY ci.[ItemName2], ci.[MauSac];

    -- Đánh chỉ mục trên bảng tạm
    CREATE CLUSTERED INDEX IX_TempSizes ON #TempSizes (ItemName2, MauSac);

    -- 2. Truy vấn kết quả chính (SELECT ĐẦY ĐỦ ALIAS TRÙNG VỚI METADATA LƯỚI GRID)
    SELECT 
        t2.[ItemName2]        AS [ItemID],
        t2.[ItemName2]        AS [ItemName2],
        t2.[TenHangHoa]       AS [ItemName],
        t2.[TenHangHoa]       AS [TenHangHoa],
        t2.[UnitPrice]        AS [Price],
        t2.[UnitPrice]        AS [UnitPrice],
        t2.[MauSac]           AS [MauSac],
        t2.[Form]             AS [Form],
        t2.[FormName]         AS [FormName],
        ISNULL(cat.[CategoryName], t2.[CategoryID]) AS [ItemGroupID],
        ISNULL(cat.[CategoryName], t2.[CategoryID]) AS [CategoryName],
        t2.[CategoryID]       AS [CategoryID],   
        t2.[Design]           AS [Design],
        ISNULL(t2.[isDisable], 0) AS [isDisable],
        ISNULL(t2.[isWeb], 0) AS [isWeb],
        
        ISNULL(ts.[nhom_size], '') AS [Size],
        ISNULL(ts.[nhom_size], '') AS [nhom_size],

        CASE WHEN @IsWebOnly = 1 THEN
            (SELECT DISTINCT [Size] 
             FROM [dbo].[CF_ItemTbl] ci 
             WHERE ci.[ItemName2] = t2.[ItemName2]
               AND ci.[MauSac] = t2.[MauSac]
               AND (ci.[isDisable] = 0 OR ci.[isDisable] IS NULL)
             FOR JSON PATH)
        ELSE NULL END AS [SizesJson]
    FROM 
        [dbo].[CF_TenHang2Tbl] t2
    LEFT JOIN #TempSizes ts ON t2.[ItemName2] = ts.[ItemName2] AND t2.[MauSac] = ts.[MauSac]
    LEFT JOIN [dbo].[CF_CategoryTbl] cat ON t2.[CategoryID] = cat.[CategoryID]
    WHERE 
        (@IsWebOnly = 0 OR (t2.[isDisable] = 0 OR t2.[isDisable] IS NULL))
        AND (@IsWebOnly = 0 OR t2.[isWeb] = 1)
        AND (
            @TimKiem IS NULL OR @TimKiem = ''
            OR t2.[ItemName2] LIKE '%' + @TimKiem + '%'
            OR t2.[TenHangHoa] COLLATE Latin1_General_CI_AI LIKE N'%' + @TimKiem + '%' COLLATE Latin1_General_CI_AI
            OR t2.[MauSac] LIKE '%' + @TimKiem + '%'
            OR t2.[Design] LIKE '%' + @TimKiem + '%'
        )
    ORDER BY 
        t2.[ItemName2] ASC;

    -- Dọn dẹp bảng tạm
    IF OBJECT_ID('tempdb..#TempSizes') IS NOT NULL DROP TABLE #TempSizes;
END
GO
