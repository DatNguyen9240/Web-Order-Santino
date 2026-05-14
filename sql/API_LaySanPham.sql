CREATE PROCEDURE [dbo].[API_LaySanPham]
    @TimKiem NVARCHAR(4000) = NULL
AS
BEGIN
    SET NOCOUNT ON;


    SELECT 
        [ItemName2]    AS [ten_hang_2],
        [TenHangHoa]   AS [ten_hang_hoa],
        [UnitPrice]    AS [don_gia],
        [MauSac]       AS [mau],
        [Form]         AS [form],
        [FormName]     AS [ten_form],    
        [CategoryID]   AS [nhom_hang],   
        [Design]       AS [design],
        [isDisable]    AS [ngung_su_dung],
        -- Lấy danh sách size thực tế của sản phẩm này
        (SELECT DISTINCT [Size] 
         FROM [dbo].[CF_ItemTbl] ci 
         WHERE ci.[ItemName2] = t2.[ItemName2]
           AND ci.[MauSac] = t2.[MauSac]
           AND (ci.[isDisable] = 0 OR ci.[isDisable] IS NULL)
         FOR JSON PATH) AS [sizes_json]
    FROM 
        [dbo].[CF_TenHang2Tbl] t2
    WHERE 
        ([isDisable] = 0 OR [isDisable] IS NULL)
        AND (
            @TimKiem IS NULL OR @TimKiem = ''
            OR [ItemName2] LIKE '%' + @TimKiem + '%'
            OR [TenHangHoa] COLLATE Latin1_General_CI_AI LIKE N'%' + @TimKiem + '%' COLLATE Latin1_General_CI_AI
        )
        AND EXISTS (
            SELECT 1 
            FROM [dbo].[CF_ItemTbl] ci 
            WHERE ci.[ItemName2] = t2.[ItemName2]
              AND ci.[MauSac] = t2.[MauSac]
              AND (ci.[isDisable] = 0 OR ci.[isDisable] IS NULL)
        )
    ORDER BY 
        [ItemName2] ASC;
END
GO
