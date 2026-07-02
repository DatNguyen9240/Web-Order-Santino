CREATE FUNCTION [dbo].[fn_GenerateObjectID]
(
    @LocationID NVARCHAR(50),
    @ObjectGroupID NVARCHAR(50)
)
RETURNS NVARCHAR(50)
AS
BEGIN
    IF @LocationID IS NULL OR @LocationID = ''
    BEGIN
        RETURN NULL;
    END

    -- 1. Tính toán LocPrefix (Mã tỉnh 3 số) từ LocationID (2 hoặc 3 số)
    DECLARE @LocPrefix NVARCHAR(50);
    IF LEN(@LocationID) = 2
    BEGIN
        IF LEFT(@LocationID, 1) = '1'
            SET @LocPrefix = '2' + @LocationID;
        ELSE
            SET @LocPrefix = '1' + @LocationID;
    END
    ELSE
    BEGIN
        SET @LocPrefix = @LocationID;
    END

    -- 2. Xác định chữ cái đầu (A: Khách thường, B: VAT, C: Vận chuyển)
    DECLARE @FirstChar NVARCHAR(1) = 'A';
    IF ISNULL(@ObjectGroupID, '') <> ''
    BEGIN
        IF LEFT(@ObjectGroupID, 1) = 'B' SET @FirstChar = 'B';
        ELSE IF @ObjectGroupID = 'VAN CHUYEN' OR @ObjectGroupID LIKE '%VAN%CHUYEN%' SET @FirstChar = 'C';
    END

    -- 3. Tính toán số thứ tự tiếp theo
    DECLARE @Prefix NVARCHAR(10) = @FirstChar + @LocPrefix;
    DECLARE @NewSeq INT = 3391;
    DECLARE @MaxSeq INT = NULL;

    SELECT @MaxSeq = MAX(CAST(RIGHT(ObjectID, 4) AS INT))
    FROM [dbo].[CF_ObjectTbl]
    WHERE LEN(ObjectID) = 8 
      AND ISNUMERIC(RIGHT(ObjectID, 4)) = 1;

    IF @MaxSeq IS NOT NULL
    BEGIN
        SET @NewSeq = @MaxSeq + 1;
    END

    RETURN @Prefix + RIGHT('0000' + CAST(@NewSeq AS NVARCHAR(10)), 4);
END
