CREATE PROCEDURE [dbo].[API_LaySanPham]
    @SearchTerm NVARCHAR(4000) = NULL
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
         WHERE LTRIM(RTRIM(ci.[ItemName2])) = LTRIM(RTRIM(t2.[ItemName2]))
           AND LTRIM(RTRIM(ci.[MauSac])) = LTRIM(RTRIM(t2.[MauSac]))
         FOR JSON PATH) AS [sizes_json]
    FROM 
        [dbo].[CF_TenHang2Tbl] t2
    WHERE 
        ([isDisable] = 0 OR [isDisable] IS NULL)
        AND (
            @SearchTerm IS NULL OR @SearchTerm = ''
            OR [ItemName2] LIKE '%' + @SearchTerm + '%'
        )
        /* -- TẠM TẮT CHẶN ĐỂ TEST DATA ẢO
        AND EXISTS (
            SELECT 1 
            FROM [dbo].[CF_ItemTbl] ci 
            WHERE LTRIM(RTRIM(ci.[ItemName2])) = LTRIM(RTRIM(t2.[ItemName2]))
              AND LTRIM(RTRIM(ci.[MauSac])) = LTRIM(RTRIM(t2.[MauSac]))
        )
        */
    ORDER BY 
        [ItemName2] ASC;
END
GO
