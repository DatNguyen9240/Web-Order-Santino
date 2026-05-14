USE [X23STN_TEST26]
GO
/****** Object:  StoredProcedure [dbo].[API_ChiTietDonHang]    Script Date: 14/05/2026 5:29:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:      Antigravity
-- Create date: 2026-05-08
-- Description: API Lấy chi tiết đơn hàng
-- =============================================
ALTER PROCEDURE [dbo].[API_ChiTietDonHang]
    @DocumentID NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    -- Trả về dữ liệu dưới dạng 1 chuỗi JSON duy nhất để Frontend dễ xử lý
    SELECT (
        SELECT 
            -- === HEADER ===
            H.[DocumentID] AS [so_ct],
            FORMAT(H.[DocumentDate], 'dd/MM/yyyy') AS [ngay_ct],
            H.[BranchID] AS [chi_nhanh],
            H.[EmployeeID] AS [nhan_vien],
            H.[CTKM] AS [ma_ctbh],
            H.[BaseTotal] AS [total_money],
            H.[Notes] AS [ghi_chu],
            
            -- === LINES (Chi tiết) ===
            (
                SELECT 
                    CI.[ItemName2] AS [ten_hang_2],
                    MAX(D.[ItemID]) AS [sku], -- Lấy 1 SKU đại diện
                    MAX(D.[ItemName]) AS [ten_hang],
                    '' AS [size], -- Đã gộp thì bỏ trống size hoặc xử lý ở app
                    SUM(D.[Quantity]) AS [so_luong],
                    MAX(D.[UnitPrice]) AS [don_gia],
                    SUM(D.[TotalAmount]) AS [thanh_tien],
                    '' AS [ma_ctbh], 
                    MAX(D.[Notes]) AS [ghi_chu]
                FROM [dbo].[OrderDetailTbl] D
                LEFT JOIN [dbo].[CF_ItemTbl] CI ON D.[ItemID] = CI.[ItemID]
                WHERE D.[DocumentID] = H.[DocumentID]
                GROUP BY CI.[ItemName2]
                ORDER BY MIN(D.[STT]) ASC
                FOR JSON PATH
            ) AS [lines]
            
        FROM [dbo].[OrderTbl] H
        WHERE H.[DocumentID] = @DocumentID
        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
    ) AS [json_data];
END
