-- =============================================
-- Hàm dùng chung: đọc số tiền thành chữ tiếng Việt.
-- Dependency bắt buộc của dbo.API_InDonHang — cần chạy file này trước
-- khi tạo/chạy API_InDonHang trên một DB chưa có hàm này.
-- =============================================
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
