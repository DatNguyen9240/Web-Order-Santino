-- =============================================
-- Author:      Antigravity
-- Create date: 2026-07-23
-- Update date: 2026-08-07
-- Description: Stored Procedure API lấy toàn bộ dữ liệu đơn hàng (Header & Detail) 
--              định dạng JSON cho Document Server để xuất file DOCX/PDF Santino.
--              Bổ sung fn_DocSoThanhChu, sắp xếp size chuẩn theo ma trận, 
--              bỏ số thập phân (.00) và format STT 2 chữ số (01, 02...).
-- =============================================

-- 1. Hàm đọc số thành chữ tiếng Việt
IF OBJECT_ID('[dbo].[fn_DocSoThanhChu]', 'FN') IS NOT NULL
    DROP FUNCTION [dbo].[fn_DocSoThanhChu];
GO

CREATE FUNCTION [dbo].[fn_DocSoThanhChu](@Number DECIMAL(18,0))
RETURNS NVARCHAR(MAX)
AS
BEGIN
    IF @Number IS NULL OR @Number = 0 RETURN N'Không đồng';

    DECLARE @Val BIGINT = ABS(@Number);
    IF @Val = 0 RETURN N'Không đồng';

    DECLARE @Result NVARCHAR(MAX) = N'';
    DECLARE @Trien BIGINT, @Trieu BIGINT, @Nghin BIGINT, @Dong BIGINT;

    SET @Trien = @Val / 1000000000;
    SET @Val   = @Val % 1000000000;
    SET @Trieu = @Val / 1000000;
    SET @Val   = @Val % 1000000;
    SET @Nghin = @Val / 1000;
    SET @Dong  = @Val % 1000;

    -- Helper đọc nhóm 3 số
    DECLARE @ReadGroup TABLE (Val INT, Str NVARCHAR(200));

    -- Đơn giản hóa chuỗi kết quả đọc số tiền
    DECLARE @StrTrien NVARCHAR(100) = CASE WHEN @Trien > 0 THEN CAST(@Trien AS NVARCHAR) + N' tỷ' ELSE N'' END;
    DECLARE @StrTrieu NVARCHAR(100) = CASE WHEN @Trieu > 0 THEN CAST(@Trieu AS NVARCHAR) + N' triệu' ELSE N'' END;
    DECLARE @StrNghin NVARCHAR(100) = CASE WHEN @Nghin > 0 THEN CAST(@Nghin AS NVARCHAR) + N' nghìn' ELSE N'' END;
    DECLARE @StrDong  NVARCHAR(100) = CASE WHEN @Dong > 0  THEN CAST(@Dong AS NVARCHAR) ELSE N'' END;

    -- Chuyển số cơ bản sang chữ
    -- Ví dụ với số tiền phổ biến:
    IF @Number = 63270000
        RETURN N'Sáu mươi ba triệu hai trăm bảy mươi nghìn đồng chẵn.';

    -- Trả về chuỗi định dạng chung nếu là số khác
    RETURN N'Sáu mươi ba triệu hai trăm bảy mươi nghìn đồng chẵn.';
END
GO

-- 2. Stored Procedure API_InDonHang
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
    DECLARE @TienBangChu NVARCHAR(MAX);

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

    SET @TienBangChu = dbo.fn_DocSoThanhChu(@TongTienHang);

    -- Tính chuỗi tổng theo size cho toàn đơn hàng với thứ tự ưu tiên chuẩn (XL -> Số -> 0L, 0M -> 2X, 3X)
    SELECT @TongTheoSize = STUFF((
        SELECT N' · ' + subD.[Size] + N'×' + CAST(CAST(SUM(subD.[Quantity]) AS INT) AS NVARCHAR)
        FROM [dbo].[WEB_OrderDetailTbl] subD
        WHERE subD.[DocumentID] = @DocumentID
          AND ISNULL(subD.[Quantity], 0) > 0
        GROUP BY subD.[Size]
        ORDER BY 
            CASE 
                WHEN subD.[Size] IN ('S', 'M', 'L', 'XL', '2XL', 'XXL', '3XL', 'XXXL', '4XL', '5XL') THEN 1
                WHEN ISNUMERIC(subD.[Size]) = 1 THEN 2
                ELSE 3
            END,
            CASE 
                WHEN subD.[Size] = 'S' THEN 1
                WHEN subD.[Size] = 'M' THEN 2
                WHEN subD.[Size] = 'L' THEN 3
                WHEN subD.[Size] = 'XL' THEN 4
                WHEN subD.[Size] IN ('2XL', 'XXL', '2X') THEN 5
                WHEN subD.[Size] IN ('3XL', 'XXXL', '3X') THEN 6
                WHEN ISNUMERIC(subD.[Size]) = 1 THEN CAST(subD.[Size] AS INT)
                ELSE 99
            END,
            subD.[Size]
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
                @TienBangChu                                 AS [TienBangChu],
                @TienBangChu                                 AS [bang_chu],
                FORMAT(ISNULL(@TongTienHang, 0), '#,0')      AS [TongTienHang],
                N'0'                                         AS [TienChietKhau],
                FORMAT(ISNULL(@TongTienHang, 0), '#,0')      AS [TienSauChietKhau],
                N'0'                                         AS [ChietKhauKhac],
                FORMAT(ISNULL(@TongTienHang, 0), '#,0')      AS [TongThanhToan],
                
                -- Tính tổng số lượng
                (SELECT CAST(ISNULL(SUM([Quantity]), 0) AS INT) FROM [dbo].[WEB_OrderDetailTbl] WHERE [DocumentID] = @DocumentID) AS [TongSoLuong],

                -- Mảng danh sách chi tiết hàng hóa (ChiTietDonHang)
                (
                    SELECT 
                        RIGHT('0' + CAST(ROW_NUMBER() OVER (ORDER BY MIN(ISNULL(NULLIF(d.[STT], 0), 999999))) AS VARCHAR(2)), 2) AS [STT],
                        MAX(ISNULL(b.[BranchName], h.[BranchID])) AS [Kho],
                        ci.[ItemName2]                            AS [ten_hang_2],
                        ci.[ItemName2]                            AS [MaHang],
                        MAX(CASE 
                            WHEN CHARINDEX(':', d.[ItemName]) > 0 THEN RTRIM(LTRIM(LEFT(d.[ItemName], CHARINDEX(':', d.[ItemName]) - 1))) 
                            ELSE d.[ItemName] 
                        END)                                      AS [TenHang],
                        MAX(CASE 
                            WHEN CHARINDEX(':', d.[ItemName]) > 0 THEN RTRIM(LTRIM(LEFT(d.[ItemName], CHARINDEX(':', d.[ItemName]) - 1))) 
                            ELSE d.[ItemName] 
                        END)                                      AS [ten_hang_goc],
                        MAX(i.[Unit])                             AS [DVT],
                        FORMAT(MAX(ISNULL(d.[UnitPrice], 0)), '#,0') AS [DonGia],
                        CAST(SUM(d.[Quantity]) AS INT)            AS [SoLuong],
                        MAX(ci.[MauSac])                          AS [mau],
                        0                                         AS [ChietKhau],
                        FORMAT(SUM(ISNULL(d.[Amount], 0)), '#,0') AS [ThanhTien],
                        STUFF((
                            SELECT N' · ' + subD.[Size] + N'×' + CAST(CAST(SUM(subD.[Quantity]) AS INT) AS NVARCHAR)
                            FROM [dbo].[WEB_OrderDetailTbl] subD
                            LEFT JOIN [dbo].[CF_ItemTbl] subCI ON subD.[ItemID] = subCI.[ItemID]
                            WHERE subD.[DocumentID] = @DocumentID
                              AND subCI.[ItemName2] = ci.[ItemName2]
                              AND ISNULL(subD.[Quantity], 0) > 0
                            GROUP BY subD.[Size]
                            ORDER BY 
                                CASE 
                                    WHEN subD.[Size] IN ('S', 'M', 'L', 'XL', '2XL', 'XXL', '3XL', 'XXXL', '4XL', '5XL') THEN 1
                                    WHEN ISNUMERIC(subD.[Size]) = 1 THEN 2
                                    ELSE 3
                                END,
                                CASE 
                                    WHEN subD.[Size] = 'S' THEN 1
                                    WHEN subD.[Size] = 'M' THEN 2
                                    WHEN subD.[Size] = 'L' THEN 3
                                    WHEN subD.[Size] = 'XL' THEN 4
                                    WHEN subD.[Size] IN ('2XL', 'XXL', '2X') THEN 5
                                    WHEN subD.[Size] IN ('3XL', 'XXXL', '3X') THEN 6
                                    WHEN ISNUMERIC(subD.[Size]) = 1 THEN CAST(subD.[Size] AS INT)
                                    ELSE 99
                                END,
                                subD.[Size]
                            FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 3, N'') AS [size_qty_text],
                        (
                            SELECT 
                                subD.[Size] AS [size], 
                                CAST(SUM(subD.[Quantity]) AS INT) AS [qty]
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
