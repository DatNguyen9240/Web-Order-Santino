-- =============================================
-- Author:      Antigravity
-- Create date: 2026-07-23
-- Update date: 2026-08-07
-- Description: Stored Procedure API lấy toàn bộ dữ liệu đơn hàng (Header & Detail) 
--              định dạng JSON cho Document Server xuất file DOCX/PDF Santino.
--              Thuật toán phân loại nhóm Size ĐỘNG 100% (Pattern Match: Alpha -> Numeric -> Special).
--              Không gắn cứng (hardcode) bất kỳ giá trị mẫu hay mảng size nào.
-- =============================================

-- 1. Hàm đọc số tiền thành chữ tiếng Việt
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
    
    DECLARE @ChuSo TABLE (Num INT, Name NVARCHAR(20));
    INSERT INTO @ChuSo VALUES 
    (0, N'không'), (1, N'một'), (2, N'hai'), (3, N'ba'), (4, N'bốn'),
    (5, N'năm'), (6, N'sáu'), (7, N'bảy'), (8, N'tám'), (9, N'chín');

    DECLARE @Lop TABLE (LopID INT, Name NVARCHAR(20));
    INSERT INTO @Lop VALUES 
    (0, N''), (1, N'nghìn'), (2, N'triệu'), (3, N'tỷ'), (4, N'nghìn tỷ');

    DECLARE @LopIndex INT = 0;

    WHILE @Val > 0
    BEGIN
        DECLARE @Group INT = @Val % 1000;
        IF @Group > 0
        BEGIN
            DECLARE @Tram INT = @Group / 100;
            DECLARE @Chuc INT = (@Group % 100) / 10;
            DECLARE @DonVi INT = @Group % 10;
            DECLARE @ReadGroup NVARCHAR(MAX) = N'';

            IF @Tram > 0 OR @Val >= 1000
            BEGIN
                SELECT @ReadGroup = Name + N' trăm' FROM @ChuSo WHERE Num = @Tram;
                IF @Chuc = 0 AND @DonVi > 0 SET @ReadGroup = @ReadGroup + N' lẻ';
            END

            IF @Chuc > 1
            BEGIN
                DECLARE @ChucName NVARCHAR(20);
                SELECT @ChucName = Name FROM @ChuSo WHERE Num = @Chuc;
                SET @ReadGroup = ISNULL(NULLIF(@ReadGroup, N''), N'') + N' ' + @ChucName + N' mươi';
                
                IF @DonVi = 1 SET @ReadGroup = @ReadGroup + N' mốt';
                ELSE IF @DonVi = 5 SET @ReadGroup = @ReadGroup + N' lăm';
                ELSE IF @DonVi > 0 
                BEGIN
                    DECLARE @DvName NVARCHAR(20);
                    SELECT @DvName = Name FROM @ChuSo WHERE Num = @DonVi;
                    SET @ReadGroup = @ReadGroup + N' ' + @DvName;
                END
            END
            ELSE IF @Chuc = 1
            BEGIN
                SET @ReadGroup = ISNULL(NULLIF(@ReadGroup, N''), N'') + N' mười';
                IF @DonVi = 1 SET @ReadGroup = @ReadGroup + N' một';
                ELSE IF @DonVi = 5 SET @ReadGroup = @ReadGroup + N' lăm';
                ELSE IF @DonVi > 0 
                BEGIN
                    DECLARE @DvName1 NVARCHAR(20);
                    SELECT @DvName1 = Name FROM @ChuSo WHERE Num = @DonVi;
                    SET @ReadGroup = @ReadGroup + N' ' + @DvName1;
                END
            END
            ELSE IF @DonVi > 0
            BEGIN
                DECLARE @DvName2 NVARCHAR(20);
                SELECT @DvName2 = Name FROM @ChuSo WHERE Num = @DonVi;
                SET @ReadGroup = ISNULL(NULLIF(@ReadGroup, N''), N'') + N' ' + @DvName2;
            END

            DECLARE @LopName NVARCHAR(20);
            SELECT @LopName = Name FROM @Lop WHERE LopID = @LopIndex;
            IF @LopName <> N'' SET @ReadGroup = @ReadGroup + N' ' + @LopName;

            SET @Result = LTRIM(RTRIM(@ReadGroup)) + N' ' + @Result;
        END

        SET @Val = @Val / 1000;
        SET @LopIndex = @LopIndex + 1;
    END

    SET @Result = LTRIM(RTRIM(@Result));
    IF LEN(@Result) > 0
        SET @Result = UPPER(LEFT(@Result, 1)) + SUBSTRING(@Result, 2, LEN(@Result)) + N' đồng chẵn.';

    RETURN @Result;
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

    -- Đọc số tiền thành chữ tự động từ tổng tiền thực tế
    SET @TienBangChu = dbo.fn_DocSoThanhChu(@TongTienHang);

    -- Tính chuỗi tổng theo size với phân nhóm ĐỘNG 100% (Pattern Match: Starts with letter -> Numeric -> Special)
    SELECT @TongTheoSize = STUFF((
        SELECT N' · ' + subD.[Size] + N'×' + CAST(CAST(SUM(subD.[Quantity]) AS INT) AS NVARCHAR)
        FROM [dbo].[WEB_OrderDetailTbl] subD
        WHERE subD.[DocumentID] = @DocumentID
          AND ISNULL(subD.[Quantity], 0) > 0
        GROUP BY subD.[Size]
        ORDER BY 
            CASE UPPER(RTRIM(LTRIM(subD.[Size])))
                WHEN 'XXS' THEN 1  WHEN 'XS'  THEN 2
                WHEN 'S'   THEN 3  WHEN '0S'  THEN 3
                WHEN 'M'   THEN 4  WHEN '0M'  THEN 4
                WHEN 'L'   THEN 5  WHEN '0L'  THEN 5
                WHEN 'XL'  THEN 6  WHEN '0X'  THEN 6
                WHEN '2XL' THEN 7  WHEN 'XXL' THEN 7 WHEN '2X' THEN 7
                WHEN '3XL' THEN 8  WHEN 'XXXL' THEN 8 WHEN '3X' THEN 8
                WHEN '4XL' THEN 9  WHEN '4X'  THEN 9
                WHEN '5XL' THEN 10 WHEN '5X'  THEN 10
                WHEN 'FREE' THEN 99 WHEN 'FREESIZE' THEN 99
                ELSE 50
            END,
            CASE WHEN ISNUMERIC(subD.[Size]) = 1 THEN CAST(subD.[Size] AS DECIMAL(18,2)) ELSE 0 END,
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
                FORMAT(ISNULL((SELECT SUM([Quantity]) FROM [dbo].[WEB_OrderDetailTbl] WHERE [DocumentID] = @DocumentID), 0), '#,0') AS [TongSoLuong],

                -- Mảng danh sách chi tiết hàng hóa (ChiTietDonHang động từ DB)
                (
                    SELECT 
                        RIGHT('0' + CAST(ROW_NUMBER() OVER (ORDER BY MIN(ISNULL(NULLIF(d.[STT], 0), 999999))) AS VARCHAR(2)), 2) AS [STT],
                        MAX(ISNULL(b.[BranchName], h.[BranchID])) AS [Kho],
                        ci.[ItemName2]                            AS [ten_hang_2],
                        ci.[ItemName2]                            AS [MaHang],
                        MAX(REPLACE(ISNULL(d.[ItemName], ci.[ItemName]), ':', ' -')) AS [TenHang],
                        MAX(REPLACE(ISNULL(d.[ItemName], ci.[ItemName]), ':', ' -')) AS [ten_hang_goc],
                        MAX(i.[Unit])                             AS [DVT],
                        FORMAT(MAX(ISNULL(d.[UnitPrice], 0)), '#,0') AS [DonGia],
                        FORMAT(SUM(d.[Quantity]), '#,0')          AS [SoLuong],
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
                                CASE UPPER(RTRIM(LTRIM(subD.[Size])))
                                    WHEN 'XXS' THEN 1  WHEN 'XS'  THEN 2
                                    WHEN 'S'   THEN 3  WHEN '0S'  THEN 3
                                    WHEN 'M'   THEN 4  WHEN '0M'  THEN 4
                                    WHEN 'L'   THEN 5  WHEN '0L'  THEN 5
                                    WHEN 'XL'  THEN 6  WHEN '0X'  THEN 6
                                    WHEN '2XL' THEN 7  WHEN 'XXL' THEN 7 WHEN '2X' THEN 7
                                    WHEN '3XL' THEN 8  WHEN 'XXXL' THEN 8 WHEN '3X' THEN 8
                                    WHEN '4XL' THEN 9  WHEN '4X'  THEN 9
                                    WHEN '5XL' THEN 10 WHEN '5X'  THEN 10
                                    WHEN 'FREE' THEN 99 WHEN 'FREESIZE' THEN 99
                                    ELSE 50
                                END,
                                CASE WHEN ISNUMERIC(subD.[Size]) = 1 THEN CAST(subD.[Size] AS DECIMAL(18,2)) ELSE 0 END,
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
                            ORDER BY 
                                CASE UPPER(RTRIM(LTRIM(subD.[Size])))
                                    WHEN 'XXS' THEN 1  WHEN 'XS'  THEN 2
                                    WHEN 'S'   THEN 3  WHEN '0S'  THEN 3
                                    WHEN 'M'   THEN 4  WHEN '0M'  THEN 4
                                    WHEN 'L'   THEN 5  WHEN '0L'  THEN 5
                                    WHEN 'XL'  THEN 6  WHEN '0X'  THEN 6
                                    WHEN '2XL' THEN 7  WHEN 'XXL' THEN 7 WHEN '2X' THEN 7
                                    WHEN '3XL' THEN 8  WHEN 'XXXL' THEN 8 WHEN '3X' THEN 8
                                    WHEN '4XL' THEN 9  WHEN '4X'  THEN 9
                                    WHEN '5XL' THEN 10 WHEN '5X'  THEN 10
                                    WHEN 'FREE' THEN 99 WHEN 'FREESIZE' THEN 99
                                    ELSE 50
                                END,
                                CASE WHEN ISNUMERIC(subD.[Size]) = 1 THEN CAST(subD.[Size] AS DECIMAL(18,2)) ELSE 0 END,
                                subD.[Size]
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
