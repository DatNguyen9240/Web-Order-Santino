CREATE PROCEDURE [dbo].[API_LaySanPham]
    @SearchTerm NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        [ItemName2]    AS [ten_hang_2],
        [TenHangHoa]   AS [ten_hang_hoa],
        [UnitPrice]    AS [don_gia],
        [MauSac]       AS [mau],
        [Form]         AS [form],
        [FormName]     AS [ten_form],    -- Đổi thành ten_form cho chuẩn với web
        [CategoryID]   AS [nhom_hang],   -- Web anh dùng nhom_hang hoặc nhom_size
        [Design]       AS [design],
        [isDisable]    AS [ngung_su_dung] -- Đồng bộ trạng thái khóa
    FROM 
        [dbo].[CF_TenHang2Tbl]
    WHERE 
        ([isDisable] = 0 OR [isDisable] IS NULL)
        AND (
            @SearchTerm IS NULL 
            OR [ItemName2] LIKE '%' + @SearchTerm + '%'
            OR [TenHangHoa] LIKE N'%' + @SearchTerm + '%'
        )
    ORDER BY 
        [ItemName2] ASC;
END
GO
