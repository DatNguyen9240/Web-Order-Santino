-- =============================================
-- Author:      Antigravity
-- Create date: 2026-05-08
-- Description: API tạo đơn hàng (Bản tương thích cao)
-- =============================================
CREATE PROCEDURE [dbo].[API_TaoDonHang]
    @OrderJson NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1. Lấy mã chứng từ
        DECLARE @DocumentID NVARCHAR(50) = JSON_VALUE(@OrderJson, '$.so_ct');
        
        IF @DocumentID IS NULL OR @DocumentID = ''
        BEGIN
            SET @DocumentID = 'DH' + FORMAT(GETDATE(), 'MMyy') + '/' + RIGHT('0000' + CAST(ISNULL((SELECT COUNT(*) FROM AP_OrderTbl) + 1, 1) AS VARCHAR), 4);
        END

        -- Kiểm tra trùng
        IF EXISTS (SELECT 1 FROM AP_OrderTbl WHERE DocumentID = @DocumentID)
        BEGIN
            RAISERROR('Số chứng từ đã tồn tại!', 16, 1);
        END

        -- 2. Insert Header
        INSERT INTO [dbo].[AP_OrderTbl] (
            [DocumentID], [DocumentDate], [BranchID], [Memo], [Notes], 
            [BaseTotal], [UserCreate], [DateCreate], [StatusID], [isLock]
        )
        VALUES (
            @DocumentID,
            ISNULL(JSON_VALUE(@OrderJson, '$.ngay_ct'), GETDATE()),
            JSON_VALUE(@OrderJson, '$.chi_nhanh'),
            JSON_VALUE(@OrderJson, '$.dien_giai'),
            JSON_VALUE(@OrderJson, '$.ghi_chu'),
            CAST(ISNULL(JSON_VALUE(@OrderJson, '$.total_money'), 0) AS DECIMAL(18,2)),
            JSON_VALUE(@OrderJson, '$.nguoi_tao'),
            GETDATE(),
            1,
            0
        );

        -- 3. Insert Detail (Dùng JSON_VALUE trực tiếp để tránh lỗi cú pháp)
        INSERT INTO [dbo].[AP_OrderDetailTbl] (
            [DocumentID], [ParentID], [ItemID], [ItemName], [Size], 
            [MauSac], [Quantity], [UnitPrice], [Amount], [TotalAmount], [STT]
        )
        SELECT 
            @DocumentID,
            @DocumentID,
            JSON_VALUE([value], '$.sku'),
            JSON_VALUE([value], '$.ten_hang'),
            JSON_VALUE([value], '$.size'),
            JSON_VALUE([value], '$.mau'),
            CAST(JSON_VALUE([value], '$.so_luong') AS DECIMAL(18,2)),
            CAST(JSON_VALUE([value], '$.don_gia') AS DECIMAL(18,2)),
            CAST(JSON_VALUE([value], '$.thanh_tien') AS DECIMAL(18,2)),
            CAST(JSON_VALUE([value], '$.thanh_tien') AS DECIMAL(18,2)),
            CAST(ISNULL(JSON_VALUE([value], '$.stt'), [key]) AS INT)
        FROM OPENJSON(@OrderJson, '$.lines');

        COMMIT TRANSACTION;

        SELECT 1 AS [Success], N'Lưu đơn hàng thành công' AS [Message], @DocumentID AS [DocumentID];

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        SELECT 0 AS [Success], ERROR_MESSAGE() AS [Message], NULL AS [DocumentID];
    END CATCH
END
