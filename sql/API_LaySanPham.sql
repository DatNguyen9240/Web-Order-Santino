CREATE PROCEDURE [dbo].[API_LaySanPham]
    @SearchTerm NVARCHAR(4000) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Nếu bị truyền nguyên cụm JSON {"SearchTerm":"..."} vào biến
    IF @SearchTerm LIKE '{%"SearchTerm"%}'
    BEGIN
        SET @SearchTerm = JSON_VALUE(@SearchTerm, '$.SearchTerm');
    END

    SELECT 
        [ItemName2]    AS [ten_hang_2],
        [TenHangHoa]   AS [ten_hang_hoa],
        [UnitPrice]    AS [don_gia],
        [MauSac]       AS [mau],
        [Form]         AS [form],
        [FormName]     AS [ten_form],    
        [CategoryID]   AS [nhom_hang],   
        [Design]       AS [design],
        [isDisable]    AS [ngung_su_dung]
    FROM 
        [dbo].[CF_TenHang2Tbl]
    WHERE 
        ([isDisable] = 0 OR [isDisable] IS NULL)
        AND (
            @SearchTerm IS NULL OR @SearchTerm = ''
            OR [ItemName2] LIKE '%' + @SearchTerm + '%'
        )
    ORDER BY 
        [ItemName2] ASC;
END
GO
