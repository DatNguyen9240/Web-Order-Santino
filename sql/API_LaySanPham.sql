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
    IF @q IS NOT NULL AND @q <> '' AND ISJSON(@q) = 1
        SET @JsonStr = @q;
    ELSE IF @TimKiem IS NOT NULL AND @TimKiem <> '' AND LEFT(LTRIM(@TimKiem), 1) = '{' AND ISJSON(@TimKiem) = 1
        SET @JsonStr = @TimKiem;

    IF @JsonStr IS NOT NULL
    BEGIN
        SET @TimKiem = (SELECT TOP 1 [value] FROM OPENJSON(@JsonStr) WHERE [key] LIKE '%$lk');
        IF @TimKiem IS NULL
            SET @TimKiem = (SELECT TOP 1 [value] FROM OPENJSON(@JsonStr));
        SET @TimKiem = ISNULL(REPLACE(@TimKiem, '%', ''), '');
    END

    -- 1. Tạo bảng tạm gom nhóm thông tin size từ CF_ItemTbl (Chỉ quét bảng đúng 1 lần duy nhất)
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

    -- Đánh chỉ mục trên bảng tạm để JOIN siêu tốc
    CREATE CLUSTERED INDEX IX_TempSizes ON #TempSizes (ItemName2, MauSac);

    -- 2. Truy vấn kết quả chính (JOIN với bảng tạm để đạt hiệu năng tối đa)
    SELECT 
        t2.[ItemName2]    AS [ItemName2],
        t2.[ItemName2]    AS [ten_hang_2],
        t2.[TenHangHoa]   AS [TenHangHoa],
        t2.[TenHangHoa]   AS [ten_hang_hoa],
        t2.[UnitPrice]    AS [UnitPrice],
        t2.[UnitPrice]    AS [don_gia],
        t2.[MauSac]       AS [MauSac],
        t2.[MauSac]       AS [mau],
        t2.[Form]         AS [Form],
        t2.[Form]         AS [form],
        t2.[FormName]     AS [ten_form],    
        t2.[CategoryID]   AS [CategoryID],   
        t2.[CategoryID]   AS [nhom_hang],   
        t2.[Design]       AS [Design],
        t2.[Design]       AS [design],
        t2.[isDisable]    AS [isDisable],
        t2.[isDisable]    AS [ngung_su_dung],
        ISNULL(t2.[isWeb], 0) AS [isWeb],
        ISNULL(t2.[isWeb], 0) AS [is_web],
        
        ts.[nhom_size]    AS [nhom_size],
        cat.[CategoryName] AS [ten_nhom_hang],

        -- Chỉ sinh JSON khi thực sự cần thiết (lấy danh sách bán trên Web) để tối ưu CPU
        CASE WHEN @IsWebOnly = 1 THEN
            (SELECT DISTINCT [Size] 
             FROM [dbo].[CF_ItemTbl] ci 
             WHERE ci.[ItemName2] = t2.[ItemName2]
               AND ci.[MauSac] = t2.[MauSac]
               AND (ci.[isDisable] = 0 OR ci.[isDisable] IS NULL)
             FOR JSON PATH)
        ELSE NULL END AS [sizes_json]
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
