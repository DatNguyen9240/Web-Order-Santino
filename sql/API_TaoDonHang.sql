-- =============================================
-- Author:      Antigravity
-- Create date: 2026-05-08
-- Description: API tạo đơn hàng (Bản chuẩn công nghiệp)
-- =============================================
ALTER PROCEDURE [dbo].[API_TaoDonHang]
    @OrderJson NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1. Lấy mã chứng từ từ Client
        DECLARE @DocumentID NVARCHAR(50) = JSON_VALUE(@OrderJson, '$.so_ct');
        DECLARE @BranchID NVARCHAR(50) = JSON_VALUE(@OrderJson, '$.chi_nhanh');
        DECLARE @MaKH NVARCHAR(50) = JSON_VALUE(@OrderJson, '$.ma_kh');
        
        -- Ràng buộc bắt buộc (Mandatory fields)
        IF ISNULL(@BranchID, '') = '' THROW 50000, N'Lỗi: Vui lòng chọn Chi nhánh tạo đơn!', 1;
        IF ISNULL(@MaKH, '') = '' THROW 50000, N'Lỗi: Vui lòng chọn Khách hàng!', 1;
        
        -- Nếu Client không gửi mã, HOẶC mã Client gửi đã bị trùng, tự động sinh mã mới!
        IF @DocumentID IS NULL OR @DocumentID = '' OR EXISTS (SELECT 1 FROM [dbo].[OrderTbl] WHERE DocumentID = @DocumentID)
        BEGIN
            DECLARE @Prefix NVARCHAR(50) = CASE WHEN ISNULL(@BranchID, '') = '' THEN 'DH' ELSE @BranchID + '-DH' END + FORMAT(GETDATE(), 'MMyy') + '/';
            DECLARE @MaxSeq INT;
            
            SELECT @MaxSeq = ISNULL(MAX(CAST(RIGHT(DocumentID, 4) AS INT)), 0)
            FROM [dbo].[OrderTbl] WITH (UPDLOCK, HOLDLOCK)
            WHERE DocumentID LIKE @Prefix + '%';
            
            SET @DocumentID = @Prefix + RIGHT('0000' + CAST(@MaxSeq + 1 AS VARCHAR), 4);
        END

        /* -- TẠM TẮT CHẶN ĐỂ TEST DATA ẢO
        -- Kiểm tra tồn kho/danh mục: Cấm lưu sản phẩm rác (fake items)
        IF EXISTS (
            SELECT 1 FROM OPENJSON(@OrderJson, '$.lines') l
            WHERE NOT EXISTS (
                SELECT 1 FROM [dbo].[CF_ItemTbl] ci
                WHERE ci.ItemName2 = JSON_VALUE(l.[value], '$.ten_hang_2')
                  AND ci.Size     = JSON_VALUE(l.[value], '$.size')
                  AND ci.MauSac   = JSON_VALUE(l.[value], '$.mau')
            )
        )
        BEGIN
            THROW 50000, N'Lỗi: Đơn hàng chứa sản phẩm ảo (không tồn tại trong danh mục CF_ItemTbl)!', 1;
        END
        */

        DECLARE @KhachDua DECIMAL(18,2) = CAST(ISNULL(NULLIF(JSON_VALUE(@OrderJson, '$.khach_dua'), ''), '0') AS DECIMAL(18,2));
        DECLARE @BaseTotal DECIMAL(18,2) = CAST(ISNULL(NULLIF(JSON_VALUE(@OrderJson, '$.total_money'), ''), '0') AS DECIMAL(18,2));
        DECLARE @TraLai DECIMAL(18,2) = CASE WHEN @KhachDua > 0 THEN @KhachDua - @BaseTotal ELSE 0 END;
        IF @TraLai < 0 SET @TraLai = 0;

        DECLARE @NgayTT NVARCHAR(50) = JSON_VALUE(@OrderJson, '$.ngay_tt');
        DECLARE @NgayCT NVARCHAR(50) = JSON_VALUE(@OrderJson, '$.ngay_ct');

        -- 2. Insert Header vào OrderTbl
        INSERT INTO [dbo].[OrderTbl] (
            [DocumentID], [DocumentDate], [BranchID], [BaseTotal], [KhachDua], [TraLai],
            [ObjectID], [ObjectName], [Memo], [Notes], [EmployeeID], 
            [NguoiGiao], [PTGiaoHang], [NguonDon], [MaDaiLy], [CTKM],
            [PaymentTypeID], [PaymentTermID], [NgayThanhToan],
            [UserCreate], [DateCreate], [isLock], [isBanSi]
        )
        VALUES (
            @DocumentID,
            ISNULL(TRY_CAST(NULLIF(@NgayCT, '') AS DATETIME), GETDATE()),
            JSON_VALUE(@OrderJson, '$.chi_nhanh'),
            @BaseTotal,
            @KhachDua,
            @TraLai,
            JSON_VALUE(@OrderJson, '$.ma_kh'),
            JSON_VALUE(@OrderJson, '$.kh_ten'),
            JSON_VALUE(@OrderJson, '$.dien_giai'),
            JSON_VALUE(@OrderJson, '$.ghi_chu'),
            JSON_VALUE(@OrderJson, '$.nvkd'),
            JSON_VALUE(@OrderJson, '$.nguoi_giao'),
            JSON_VALUE(@OrderJson, '$.pt_giao'),
            JSON_VALUE(@OrderJson, '$.nguon_don'),
            JSON_VALUE(@OrderJson, '$.ma_dl'),
            JSON_VALUE(@OrderJson, '$.ma_ctbh'),
            JSON_VALUE(@OrderJson, '$.ht_thanh_toan'),
            JSON_VALUE(@OrderJson, '$.dieu_khoan'),
            TRY_CAST(NULLIF(@NgayTT, '') AS DATETIME),
            JSON_VALUE(@OrderJson, '$.nguoi_tao'),
            GETDATE(),
            0, -- isLock
            1  -- isBanSi (Order sỉ ma trận)
        );

        -- 3. Insert Detail vào OrderDetailTbl
        INSERT INTO [dbo].[OrderDetailTbl] (
            [UserAutoID], [DocumentID], [ItemID], [ItemName], [Size], 
            [MauSac], [Quantity], [UnitPrice], [Amount], [TotalAmount], [STT]
        )
        SELECT 
            NEWID(),
            @DocumentID,
            (SELECT TOP 1 ci.ItemID FROM [dbo].[CF_ItemTbl] ci
             WHERE ci.ItemName2 = JSON_VALUE(l.[value], '$.ten_hang_2')
               AND ci.Size     = JSON_VALUE(l.[value], '$.size')
               AND ci.MauSac   = JSON_VALUE(l.[value], '$.mau')
             ORDER BY ci.ItemID), -- Chấp nhận NULL để né Khóa Ngoại
            JSON_VALUE(l.[value], '$.ten_hang'),
            JSON_VALUE(l.[value], '$.size'),
            JSON_VALUE(l.[value], '$.mau'),
            CAST(ISNULL(NULLIF(JSON_VALUE(l.[value], '$.so_luong'), ''), '0') AS DECIMAL(18,2)),
            CAST(ISNULL(NULLIF(JSON_VALUE(l.[value], '$.don_gia'), ''), '0') AS DECIMAL(18,2)),
            CAST(ISNULL(NULLIF(JSON_VALUE(l.[value], '$.thanh_tien'), ''), '0') AS DECIMAL(18,2)),
            CAST(ISNULL(NULLIF(JSON_VALUE(l.[value], '$.thanh_tien'), ''), '0') AS DECIMAL(18,2)),
            CAST(ISNULL(NULLIF(JSON_VALUE(l.[value], '$.stt'), ''), l.[key]) AS INT)
        FROM OPENJSON(@OrderJson, '$.lines') l;

        COMMIT TRANSACTION;

        SELECT 1 AS [Success], N'Lưu đơn hàng thành công' AS [Message], @DocumentID AS [DocumentID];

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        SELECT 0 AS [Success], ERROR_MESSAGE() AS [Message], NULL AS [DocumentID];
    END CATCH
END
GO

-- ── TEST TRỰC TIẾP TRONG SSMS (Bôi đen đoạn dưới rồi ấn F5) ───────────────────
/*
DECLARE @testJson NVARCHAR(MAX) = N'{
    "so_ct": "",
    "ngay_ct": "2026-05-11",
    "chi_nhanh": "1.VINH",
    "ma_kh": "KH001",
    "kh_ten": "Nguyễn Văn A",
    "dien_giai": "Đơn hàng test từ SSMS",
    "nvkd": "NV01",
    "ht_thanh_toan": "TM",
    "total_money": "",
    "khach_dua": "",
    "lines": [
        {
            "sku": "AMC38545S660",
            "ten_hang": "Áo Polo Santino",
            "size": "L",
            "mau": "Trắng",
            "so_luong": 2,
            "don_gia": 250000,
            "thanh_tien": 500000,
            "stt": ""
        }
    ]
}';

EXEC [dbo].[API_TaoDonHang] @OrderJson = @testJson;
*/
