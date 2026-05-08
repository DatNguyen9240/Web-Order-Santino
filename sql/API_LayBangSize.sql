CREATE PROCEDURE [dbo].[API_LayBangSize]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        [Size]      AS [size],
        [TenSize]   AS [ten_size],
        [NhomSize]  AS [nhom_size],
        [STT]       AS [stt]
    FROM 
        [dbo].[CF_NhomSizeTbl]
    ORDER BY 
        [NhomSize] ASC,
        [STT] ASC,
        [Size] ASC;
END
GO
