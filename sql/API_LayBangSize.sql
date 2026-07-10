IF OBJECT_ID('dbo.API_LayBangSize', 'P') IS NOT NULL
    DROP PROCEDURE [dbo].[API_LayBangSize];
GO

CREATE PROCEDURE [dbo].[API_LayBangSize]
    @Page INT = 1,
    @Limit INT = 100,
    @q NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Đảm bảo phân trang hợp lệ
    IF @Page IS NULL OR @Page <= 0 SET @Page = 1;
    IF @Limit IS NULL OR @Limit <= 0 SET @Limit = 100;

    -- Giải nén từ khóa tìm kiếm từ JSON hoặc chuỗi thông thường
    DECLARE @TimKiem NVARCHAR(255) = '';
    IF @q IS NOT NULL AND @q <> '' AND ISJSON(@q) = 1
    BEGIN
        SET @TimKiem = (SELECT TOP 1 [value] FROM OPENJSON(@q) WHERE [key] LIKE '%$lk');
        IF @TimKiem IS NULL
            SET @TimKiem = (SELECT TOP 1 [value] FROM OPENJSON(@q));
            
        SET @TimKiem = ISNULL(REPLACE(@TimKiem, '%', ''), '');
    END
    ELSE IF @q IS NOT NULL
    BEGIN
        SET @TimKiem = @q;
    END

    SELECT 
        [Size]      AS [size],
        [TenSize]   AS [ten_size],
        [NhomSize]  AS [nhom_size],
        [STT]       AS [stt]
    FROM 
        [dbo].[CF_NhomSizeTbl]
    WHERE 
        (@TimKiem = '' 
         OR [Size]     LIKE N'%' + @TimKiem + N'%'
         OR [TenSize]  LIKE N'%' + @TimKiem + N'%'
         OR [NhomSize] LIKE N'%' + @TimKiem + N'%')
    ORDER BY 
        [NhomSize] ASC,
        [STT] ASC,
        [Size] ASC;
END
GO
