IF OBJECT_ID('dbo.API_SanPham_Luu', 'P') IS NOT NULL
    DROP PROCEDURE [dbo].[API_SanPham_Luu];
GO

CREATE PROCEDURE [dbo].[API_SanPham_Luu]
    @q NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Bóc tách các trường từ JSON (hỗ trợ cả tên cột Tiếng Việt & ERP)
    DECLARE @ItemName2 NVARCHAR(50)   = COALESCE(JSON_VALUE(@q, '$.ItemName2'), JSON_VALUE(@q, '$.ten_hang_2'));
    DECLARE @MauSac NVARCHAR(50)      = ISNULL(COALESCE(JSON_VALUE(@q, '$.MauSac'), JSON_VALUE(@q, '$.mau')), '');
    DECLARE @TenHangHoa NVARCHAR(255) = COALESCE(JSON_VALUE(@q, '$.TenHangHoa'), JSON_VALUE(@q, '$.ten_hang_hoa'));
    DECLARE @UnitPrice DECIMAL(18,2)  = CAST(COALESCE(JSON_VALUE(@q, '$.UnitPrice'), JSON_VALUE(@q, '$.don_gia'), '0') AS DECIMAL(18,2));
    DECLARE @Form NVARCHAR(100)       = COALESCE(JSON_VALUE(@q, '$.Form'), JSON_VALUE(@q, '$.form'));
    DECLARE @CategoryID NVARCHAR(50)  = COALESCE(JSON_VALUE(@q, '$.CategoryID'), JSON_VALUE(@q, '$.nhom_hang'));
    DECLARE @Design NVARCHAR(50)      = COALESCE(JSON_VALUE(@q, '$.Design'), JSON_VALUE(@q, '$.design'));
    DECLARE @isDisable BIT            = ISNULL(CAST(COALESCE(JSON_VALUE(@q, '$.isDisable'), JSON_VALUE(@q, '$.ngung_su_dung')) AS BIT), 0);
    DECLARE @isWeb BIT                = ISNULL(CAST(COALESCE(JSON_VALUE(@q, '$.isWeb'), JSON_VALUE(@q, '$.is_web')) AS BIT), 0);
    DECLARE @nhom_size NVARCHAR(50)   = JSON_VALUE(@q, '$.nhom_size');

    IF NULLIF(LTRIM(RTRIM(@ItemName2)), '') IS NULL
    BEGIN
        SELECT 1 AS [code], N'Không tìm thấy mã sản phẩm (ItemName2).' AS [msg];
        RETURN;
    END;

    -- 2. Cập nhật hoặc Thêm mới vào bảng CF_TenHang2Tbl dựa trên khóa chính kép (ItemName2 + MauSac)
    IF EXISTS (SELECT 1 FROM [dbo].[CF_TenHang2Tbl] WHERE [ItemName2] = @ItemName2 AND [MauSac] = @MauSac)
    BEGIN
        UPDATE [dbo].[CF_TenHang2Tbl]
        SET [TenHangHoa] = ISNULL(@TenHangHoa, [TenHangHoa]),
            [UnitPrice] = ISNULL(@UnitPrice, [UnitPrice]),
            [Form] = ISNULL(@Form, [Form]),
            [CategoryID] = ISNULL(@CategoryID, [CategoryID]),
            [Design] = ISNULL(@Design, [Design]),
            [isDisable] = ISNULL(@isDisable, [isDisable]),
            [isWeb] = ISNULL(@isWeb, [isWeb])
        WHERE [ItemName2] = @ItemName2 AND [MauSac] = @MauSac;
    END
    ELSE
    BEGIN
        INSERT INTO [dbo].[CF_TenHang2Tbl] (
            [ItemName2], [MauSac], [TenHangHoa], [UnitPrice], [Form], [CategoryID], [Design], [isDisable], [isWeb]
        )
        VALUES (
            @ItemName2, @MauSac, @TenHangHoa, @UnitPrice, @Form, @CategoryID, @Design, @isDisable, @isWeb
        );
    END;

    -- Luôn đồng bộ thông tin chung sang bảng CF_ItemTbl
    UPDATE [dbo].[CF_ItemTbl]
    SET [ItemName] = @TenHangHoa + ' ' + @MauSac + ' ' + [Size],
        [UnitPrice] = @UnitPrice,
        [CategoryID] = @CategoryID,
        [isDisable] = @isDisable
    WHERE [ItemName2] = @ItemName2 AND [MauSac] = @MauSac;

    -- 3. Cập nhật danh sách size tương ứng trong CF_ItemTbl an toàn
    IF @nhom_size IS NOT NULL AND @nhom_size <> ''
    BEGIN
        DECLARE @CurrentNhomSize NVARCHAR(50) = NULL;
        
        SELECT TOP 1 @CurrentNhomSize = ns.[NhomSize]
        FROM [dbo].[CF_ItemTbl] ci
        INNER JOIN [dbo].[CF_NhomSizeTbl] ns ON ci.[Size] = ns.[Size]
        WHERE ci.[ItemName2] = @ItemName2 AND ci.[MauSac] = @MauSac;

        IF @CurrentNhomSize IS NULL OR @CurrentNhomSize <> @nhom_size
        BEGIN
            -- An toàn: Chỉ xóa những ItemID chưa từng xuất hiện trong phiếu kiểm kê KiemKeDetailTbl.
            -- Với những ItemID đã từng phát sinh kiểm kê -> ẩn đi (isDisable = 1) để không vi phạm FK.
            IF OBJECT_ID('dbo.KiemKeDetailTbl', 'U') IS NOT NULL
            BEGIN
                DELETE FROM [dbo].[CF_ItemTbl] 
                WHERE [ItemName2] = @ItemName2 AND [MauSac] = @MauSac
                  AND [ItemID] NOT IN (SELECT DISTINCT [ItemID] FROM [dbo].[KiemKeDetailTbl] WHERE [ItemID] IS NOT NULL);

                UPDATE [dbo].[CF_ItemTbl] 
                SET [isDisable] = 1
                WHERE [ItemName2] = @ItemName2 AND [MauSac] = @MauSac;
            END
            ELSE
            BEGIN
                DELETE FROM [dbo].[CF_ItemTbl] 
                WHERE [ItemName2] = @ItemName2 AND [MauSac] = @MauSac;
            END;

            -- Upsert danh sách size mới thuộc NhomSize đã chọn
            MERGE [dbo].[CF_ItemTbl] AS target
            USING (
                SELECT 
                    @ItemName2 + @MauSac + [Size] AS [ItemID],
                    @TenHangHoa + ' ' + @MauSac + ' ' + [Size] AS [ItemName],
                    @ItemName2 AS [ItemName2],
                    [Size],
                    @MauSac AS [MauSac],
                    @UnitPrice AS [UnitPrice],
                    0 AS [isDisable],
                    N'Chiếc' AS [Unit],
                    @CategoryID AS [CategoryID]
                FROM [dbo].[CF_NhomSizeTbl]
                WHERE [NhomSize] = @nhom_size
            ) AS source
            ON target.[ItemID] = source.[ItemID]
            WHEN MATCHED THEN
                UPDATE SET 
                    target.[ItemName] = source.[ItemName],
                    target.[UnitPrice] = source.[UnitPrice],
                    target.[CategoryID] = source.[CategoryID],
                    target.[isDisable] = 0
            WHEN NOT MATCHED THEN
                INSERT ([ItemID], [ItemName], [ItemName2], [Size], [MauSac], [UnitPrice], [isDisable], [Unit], [CategoryID])
                VALUES (source.[ItemID], source.[ItemName], source.[ItemName2], source.[Size], source.[MauSac], source.[UnitPrice], 0, source.[Unit], source.[CategoryID]);
        END;
    END;

    -- Trả về phản hồi thành công
    SELECT 0 AS [code], N'Lưu sản phẩm thành công' AS [msg];
END;
GO
