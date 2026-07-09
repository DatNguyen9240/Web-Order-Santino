IF OBJECT_ID('dbo.API_Promotion_Luu', 'P') IS NOT NULL
    DROP PROCEDURE [dbo].[API_Promotion_Luu];
GO

CREATE PROCEDURE [dbo].[API_Promotion_Luu]
    @q NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @CTKM NVARCHAR(50)       = JSON_VALUE(@q, '$.id');
    DECLARE @ChietKhau NVARCHAR(255) = JSON_VALUE(@q, '$.name');

    IF EXISTS (SELECT 1 FROM [dbo].[CF_CTKMTbl] WHERE [CTKM] = @CTKM)
    BEGIN
        UPDATE [dbo].[CF_CTKMTbl]
        SET [ChietKhau] = @ChietKhau
        WHERE [CTKM] = @CTKM;
    END
    ELSE
    BEGIN
        INSERT INTO [dbo].[CF_CTKMTbl] ([CTKM], [ChietKhau])
        VALUES (@CTKM, @ChietKhau);
    END

    SELECT 0 AS [code], N'Lưu chiết khấu thành công' AS [msg];
END
GO
