IF OBJECT_ID('dbo.API_LayKhuyenMai', 'P') IS NOT NULL
    DROP PROCEDURE [dbo].[API_LayKhuyenMai];
GO

CREATE PROCEDURE [dbo].[API_LayKhuyenMai]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM dbo.[CF_CTKMTbl]
    WHERE [IsWeb] = 1;
END;
GO
