-- =============================================
-- Author:      Antigravity
-- Create date: 2026-07-23
-- Update date: 2026-08-07
-- Description: Stored Procedure API lấy toàn bộ dữ liệu đơn hàng (Header & Detail) 
--              định dạng JSON sẵn sàng đẩy vào Document Server để in mẫu DOCX/PDF Santino.
--              Bổ sung [tong_theo_size] (tổng size toàn đơn) và [size_qty_text] (size x số lượng từng dòng).
-- =============================================
IF OBJECT_ID('[dbo].[API_InDonHang]', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE [dbo].[API_InDonHang];
END
GO

CREATE PROCEDURE [dbo].[API_InDonHang]
    @DocumentID NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Kiểm tra đơn hàng có tồn tại không
    IF NOT EXISTS (SELECT 1 FROM [dbo].[WEB_OrderTbl] WHERE [DocumentID] = @DocumentID)
    BEGIN
        SELECT 
            -1 AS [Success], 
            N'Lỗi: Không tìm thấy mã đơn hàng ' + ISNULL(@DocumentID, '') AS [Message], 
            NULL AS [Data];
        RETURN;
    END

    -- 2. Khai báo các biến thông tin Header
    DECLARE @SoPhieu NVARCHAR(50);
    DECLARE @NgayLap NVARCHAR(50);
    DECLARE @MaKH NVARCHAR(50);
    DECLARE @TenKhachHang NVARCHAR(255);
    DECLARE @DiaChi NVARCHAR(500);
    DECLARE @SDT NVARCHAR(100);
    DECLARE @DienGiai NVARCHAR(500);
    DECLARE @TongTienHang DECIMAL(18,2);
    DECLARE @TongTheoSize NVARCHAR(MAX);

    SELECT TOP 1
        @SoPhieu       = h.[DocumentID],
        @NgayLap       = N'Ngày ' + FORMAT(ISNULL(h.[DocumentDate], GETDATE()), 'dd') 
                         + N' tháng ' + FORMAT(ISNULL(h.[DocumentDate], GETDATE()), 'MM') 
                         + N' năm ' + FORMAT(ISNULL(h.[DocumentDate], GETDATE()), 'yyyy'),
        @MaKH          = h.[ObjectID],
        @TenKhachHang  = ISNULL(h.[ObjectName], c.[ObjectName]),
        @DiaChi        = ISNULL(c.[Address], N''),
        @SDT           = ISNULL(c.[Phone], N''),
        @DienGiai      = ISNULL(h.[Memo], N''),
        @TongTienHang   = ISNULL(h.[BaseTotal], 0)
    FROM [dbo].[WEB_OrderTbl] h
    LEFT JOIN [dbo].[CF_ObjectTbl] c ON h.[ObjectID] = c.[ObjectID]
    WHERE h.[DocumentID] = @DocumentID;

    -- Tính chuỗi tổng theo size cho toàn đơn hàng
    SELECT @TongTheoSize = STUFF((
        SELECT N' · ' + subD.[Size] + N'×' + CAST(SUM(subD.[Quantity]) AS NVARCHAR)
        FROM [dbo].[WEB_OrderDetailTbl] subD
        WHERE subD.[DocumentID] = @DocumentID
          AND ISNULL(subD.[Quantity], 0) > 0
        GROUP BY subD.[Size]
        ORDER BY subD.[Size]
        FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 3, N'');

    -- 3. Tạo JSON trả về hoàn chỉnh cho Backend Document Engine
    SELECT 
        1 AS [Success],
        N'Lấy dữ liệu đơn hàng thành công' AS [Message],
        (
            SELECT 
                @SoPhieu                                     AS [SoPhieu],
                @SoPhieu                                     AS [so_ct],
                @NgayLap                                     AS [NgayLap],
                @NgayLap                                     AS [ngay_ct],
                @TenKhachHang                                AS [TenKhachHang],
                @TenKhachHang                                AS [khach_hang],
                @MaKH                                        AS [MaKH],
                @MaKH                                        AS [ma_kh],
                @DiaChi                                      AS [DiaChi],
                @DiaChi                                      AS [dia_chi],
                @SDT                                         AS [SDT],
                @SDT                                         AS [sdt],
                @DienGiai                                    AS [DienGiai],
                @DienGiai                                    AS [ghi_chu],
                ISNULL(@TongTheoSize, N'')                   AS [tong_theo_size],
                ISNULL(@TongTheoSize, N'')                   AS [tong_size_text],
                FORMAT(ISNULL(@TongTienHang, 0), '#,0')      AS [TongTienHang],
                N'0'                                         AS [TienChietKhau],
                FORMAT(ISNULL(@TongTienHang, 0), '#,0')      AS [TienSauChietKhau],
                N'0'                                         AS [ChietKhauKhac],
                FORMAT(ISNULL(@TongTienHang, 0), '#,0')      AS [TongThanhToan],
                
                -- Tính tổng số lượng
                (SELECT ISNULL(SUM([Quantity]), 0) FROM [dbo].[WEB_OrderDetailTbl] WHERE [DocumentID] = @DocumentID) AS [TongSoLuong],

                -- Mảng danh sách chi tiết hàng hóa (ChiTietDonHang)
                (
                    SELECT 
                        ROW_NUMBER() OVER (ORDER BY MIN(ISNULL(NULLIF(d.[STT], 0), 999999))) AS [STT],
                        MAX(ISNULL(b.[BranchName], h.[BranchID])) AS [Kho],
                        ci.[ItemName2]                            AS [ten_hang_2],
                        ci.[ItemName2]                            AS [MaHang],
                        MAX(d.[ItemName])                         AS [TenHang],
                        MAX(d.[ItemName])                         AS [ten_hang_goc],
                        MAX(i.[Unit])                             AS [DVT],
                        FORMAT(MAX(ISNULL(d.[UnitPrice], 0)), '#,0') AS [DonGia],
                        SUM(d.[Quantity])                         AS [SoLuong],
                        MAX(ci.[MauSac])                          AS [mau],
                        0                                         AS [ChietKhau],
                        FORMAT(SUM(ISNULL(d.[Amount], 0)), '#,0') AS [ThanhTien],
                        STUFF((
                            SELECT N' · ' + subD.[Size] + N'×' + CAST(SUM(subD.[Quantity]) AS NVARCHAR)
                            FROM [dbo].[WEB_OrderDetailTbl] subD
                            LEFT JOIN [dbo].[CF_ItemTbl] subCI ON subD.[ItemID] = subCI.[ItemID]
                            WHERE subD.[DocumentID] = @DocumentID
                              AND subCI.[ItemName2] = ci.[ItemName2]
                              AND ISNULL(subD.[Quantity], 0) > 0
                            GROUP BY subD.[Size]
                            ORDER BY subD.[Size]
                            FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 3, N'') AS [size_qty_text],
                        (
                            SELECT 
                                subD.[Size] AS [size], 
                                SUM(subD.[Quantity]) AS [qty]
                            FROM [dbo].[WEB_OrderDetailTbl] subD
                            LEFT JOIN [dbo].[CF_ItemTbl] subCI ON subD.[ItemID] = subCI.[ItemID]
                            WHERE subD.[DocumentID] = @DocumentID
                              AND subCI.[ItemName2] = ci.[ItemName2]
                            GROUP BY subD.[Size]
                            FOR JSON PATH
                        ) AS [chi_tiet_size]
                    FROM [dbo].[WEB_OrderDetailTbl] d
                    INNER JOIN [dbo].[WEB_OrderTbl]  h ON d.[DocumentID] = h.[DocumentID]
                    LEFT JOIN  [dbo].[CF_BranchTbl]  b ON h.[BranchID]   = b.[BranchID]
                    LEFT JOIN  [dbo].[CF_ItemTbl]    ci ON d.[ItemID]    = ci.[ItemID]
                    LEFT JOIN  [dbo].[CF_ItemTbl]    i ON d.[ItemID]     = i.[ItemID]
                    WHERE d.[DocumentID] = @DocumentID
                    GROUP BY ci.[ItemName2]
                    FOR JSON PATH
                ) AS [ChiTietDonHang]
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        ) AS [JsonPayload];
END
GO

-- ── TEST CHẠY TRỰC TIẾP TRONG SSMS ──────────────────────────────────────────
/*
EXEC [dbo].[API_InDonHang] @DocumentID = 'DH0526/0001';
*/
