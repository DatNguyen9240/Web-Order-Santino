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
                    MAX(D.[ItemName]) AS [ten_hang],
                    MAX(CI.[MauSac]) AS [mau],
                    SUM(D.[Quantity]) AS [so_luong],
                    MAX(D.[UnitPrice]) AS [don_gia],
                    SUM(D.[TotalAmount]) AS [thanh_tien],
                    (
                        SELECT 
                            subD.[Size] AS [size], 
                            SUM(subD.[Quantity]) AS [qty]
                        FROM [dbo].[OrderDetailTbl] subD
                        LEFT JOIN [dbo].[CF_ItemTbl] subCI ON subD.[ItemID] = subCI.[ItemID]
                        WHERE subD.[DocumentID] = H.[DocumentID]
                          AND subCI.[ItemName2] = CI.[ItemName2]
                        GROUP BY subD.[Size]
                        FOR JSON PATH
                    ) AS [chi_tiet_size]
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
