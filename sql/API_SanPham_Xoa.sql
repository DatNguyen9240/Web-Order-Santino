IF OBJECT_ID('dbo.API_SanPham_Xoa', 'P') IS NOT NULL
    DROP PROCEDURE [dbo].[API_SanPham_Xoa];
GO

CREATE PROCEDURE [dbo].[API_SanPham_Xoa]
    @q NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @ItemName2 NVARCHAR(50);
    DECLARE @MauSac NVARCHAR(50);
    DECLARE @Found BIT = 0;
    DECLARE @DeletedRows INT = 0;

    IF ISJSON(ISNULL(@q, '')) <> 1
    BEGIN
        SELECT 1 AS [code], N'Dữ liệu xóa không phải JSON hợp lệ.' AS [msg];
        RETURN;
    END;

    SET @ItemName2 = JSON_VALUE(@q, '$.Keys.ItemName2');

    IF NULLIF(LTRIM(RTRIM(@ItemName2)), '') IS NULL
    BEGIN
        SELECT 1 AS [code], N'Không có ItemName2 để xác định sản phẩm cần xóa.' AS [msg];
        RETURN;
    END;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Khóa dòng cha để màu và danh sách SKU không đổi trong lúc xóa.
        SELECT
            @MauSac = MauSac,
            @Found = 1
        FROM dbo.CF_TenHang2Tbl WITH (UPDLOCK, HOLDLOCK)
        WHERE ItemName2 = @ItemName2;

        IF @Found = 0
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 1 AS [code], N'Không tìm thấy sản phẩm cần xóa.' AS [msg];
            RETURN;
        END;

        -- Bảng phân nhóm có FK NO_ACTION tới sản phẩm, phải xóa trước bảng cha.
        DELETE FROM dbo.CF_PhanNhomHHTH2Tbl
        WHERE ItemName2 = @ItemName2;

        -- SKU/size là dữ liệu nghiệp vụ phát sinh từ sản phẩm này.
        DELETE FROM dbo.CF_ItemTbl
        WHERE ItemName2 = @ItemName2
          AND ((MauSac IS NULL AND @MauSac IS NULL) OR MauSac = @MauSac);

        DELETE FROM dbo.CF_TenHang2Tbl
        WHERE ItemName2 = @ItemName2;

        SET @DeletedRows = @@ROWCOUNT;
        IF @DeletedRows <> 1
            THROW 50001, N'Không thể xác nhận chính xác một sản phẩm đã được xóa.', 1;

        COMMIT TRANSACTION;
        SELECT 0 AS [code], N'Đã xóa sản phẩm và dữ liệu liên quan.' AS [msg];
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        SELECT 1 AS [code], ERROR_MESSAGE() AS [msg];
    END CATCH;
END;
GO
