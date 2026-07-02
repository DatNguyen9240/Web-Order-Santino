CREATE PROCEDURE [dbo].[API_KhachHang_Luu]
    @q NVARCHAR(MAX) -- Nhận JSON chứa toàn bộ thông tin khách hàng
AS
BEGIN
    SET NOCOUNT ON;
    
    -- 1. Bóc tách các trường từ JSON
    DECLARE @ObjectID NVARCHAR(50)   = JSON_VALUE(@q, '$.ObjectID');
    DECLARE @ObjectName NVARCHAR(255) = JSON_VALUE(@q, '$.ObjectName');
    DECLARE @BranchID NVARCHAR(50)   = JSON_VALUE(@q, '$.BranchID');
    DECLARE @Address NVARCHAR(500)   = JSON_VALUE(@q, '$.Address');
    DECLARE @Phone NVARCHAR(50)      = JSON_VALUE(@q, '$.Phone');
    DECLARE @Notes NVARCHAR(MAX)     = JSON_VALUE(@q, '$.Notes');
    DECLARE @ObjectGroupID NVARCHAR(50) = JSON_VALUE(@q, '$.ObjectGroupID');
    DECLARE @LocationID NVARCHAR(50) = JSON_VALUE(@q, '$.LocationID');
    DECLARE @QuanHuyen NVARCHAR(100) = JSON_VALUE(@q, '$.QuanHuyen');
    DECLARE @SanPhamChinh NVARCHAR(255) = JSON_VALUE(@q, '$.SanPhamChinh');
    DECLARE @EmployeeID NVARCHAR(100) = JSON_VALUE(@q, '$.EmployeeID');
    DECLARE @isDefault BIT           = ISNULL(CAST(JSON_VALUE(@q, '$.isDefault') AS BIT), 0);
    DECLARE @DinhMucNo DECIMAL(18,2) = CAST(JSON_VALUE(@q, '$.DinhMucNo') AS DECIMAL(18,2));
    DECLARE @ThoiHanThanhToan DECIMAL(18,2) = CAST(JSON_VALUE(@q, '$.ThoiHanThanhToan') AS DECIMAL(18,2));
    DECLARE @PaymentTypeID NVARCHAR(50) = JSON_VALUE(@q, '$.PaymentTypeID');
    DECLARE @PaymentTermID NVARCHAR(50) = JSON_VALUE(@q, '$.PaymentTermID');
    DECLARE @TaxCode NVARCHAR(50)    = JSON_VALUE(@q, '$.TaxCode');
    DECLARE @DonViMuaHang NVARCHAR(255) = JSON_VALUE(@q, '$.DonViMuaHang');
    DECLARE @AddressHD NVARCHAR(500) = JSON_VALUE(@q, '$.AddressHD');
    DECLARE @UserLogin NVARCHAR(50)  = JSON_VALUE(@q, '$.UserLogin');

    -- 2. Tự động sinh mã khách hàng (nếu rỗng)
    IF ISNULL(@ObjectID, '') = ''
    BEGIN
        -- Tự động nhận diện LocationID từ địa chỉ khách hàng (hỗ trợ không dấu, viết tắt HN/HCM)
        IF ISNULL(@Address, '') <> ''
        BEGIN
            DECLARE @CleanAddress NVARCHAR(500) = LTRIM(RTRIM(@Address));
            SET @CleanAddress = REPLACE(REPLACE(REPLACE(@CleanAddress, N'HN', N'Hà Nội'), N'HCM', N'Hồ Chí Minh'), N'TP', N'');

            SELECT TOP 1 @LocationID = LocationID
            FROM [dbo].[CF_LocationTbl]
            WHERE @CleanAddress COLLATE Latin1_General_CI_AI LIKE N'%' + LTRIM(RTRIM(LocationName)) + N'%' COLLATE Latin1_General_CI_AI
               OR @CleanAddress COLLATE Latin1_General_CI_AI LIKE N'%' + LTRIM(RTRIM(REPLACE(REPLACE(LocationName, N'Tỉnh ', ''), N'Thành phố ', ''))) + N'%' COLLATE Latin1_General_CI_AI
            ORDER BY LEN(LocationName) DESC;
        END
        
        -- Nếu không dò được LocationID, báo lỗi
        IF @LocationID IS NULL OR @LocationID = ''
        BEGIN
            RAISERROR (N'Lỗi: Địa chỉ khách hàng bắt buộc phải chứa tên Tỉnh/Thành phố hợp lệ để phân loại vùng!', 16, 1);
            RETURN;
        END
        
        -- Gọi hàm fn_GenerateObjectID để sinh mã
        SET @ObjectID = [dbo].[fn_GenerateObjectID](@LocationID, @ObjectGroupID);
        
        IF @ObjectID IS NULL
        BEGIN
            RAISERROR (N'Lỗi: Không thể sinh mã khách hàng tự động!', 16, 1);
            RETURN;
        END
    END

    IF @ObjectGroupID = '' SET @ObjectGroupID = NULL;
    IF @BranchID = '' SET @BranchID = NULL;
    IF @EmployeeID = '' SET @EmployeeID = NULL;
    IF @LocationID = '' SET @LocationID = NULL;
    IF @PaymentTypeID = '' SET @PaymentTypeID = NULL;
    IF @PaymentTermID = '' SET @PaymentTermID = NULL;

    -- 3. Kiểm tra nếu đã tồn tại thì Update, chưa có thì Insert
    IF EXISTS (SELECT 1 FROM [dbo].[CF_ObjectTbl] WHERE [ObjectID] = @ObjectID)
    BEGIN
        UPDATE [dbo].[CF_ObjectTbl]
        SET [ObjectName] = @ObjectName,
            [BranchID] = @BranchID,
            [Address] = @Address,
            [Phone] = @Phone,
            [Notes] = @Notes,
            [ObjectGroupID] = @ObjectGroupID,
            [LocationID] = @LocationID,
            [QuanHuyen] = @QuanHuyen,
            [SanPhamChinh] = @SanPhamChinh,
            [EmployeeID] = @EmployeeID,
            [isDefault] = @isDefault,
            [DinhMucNo] = @DinhMucNo,
            [ThoiHanThanhToan] = @ThoiHanThanhToan,
            [PaymentTypeID] = @PaymentTypeID,
            [PaymentTermID] = @PaymentTermID,
            [TaxCode] = @TaxCode,
            [DonViMuaHang] = @DonViMuaHang,
            [AddressHD] = @AddressHD,
            [UserUpdate] = @UserLogin,
            [DateUpdate] = GETDATE()
        WHERE [ObjectID] = @ObjectID;
        
        SELECT @ObjectID AS [id], N'Cập nhật khách hàng thành công' AS [message];
    END
    ELSE
    BEGIN
        INSERT INTO [dbo].[CF_ObjectTbl] (
            [ObjectID], [ObjectName], [BranchID], [Address], [Phone], [Notes],
            [ObjectGroupID], [LocationID], [QuanHuyen], [SanPhamChinh],
            [EmployeeID], [isDefault], [DinhMucNo], [ThoiHanThanhToan],
            [PaymentTypeID], [PaymentTermID], [TaxCode], [DonViMuaHang], [AddressHD],
            [UserCreate], [DateCreate], [isDisable]
        )
        VALUES (
            @ObjectID, @ObjectName, @BranchID, @Address, @Phone, @Notes,
            @ObjectGroupID, @LocationID, @QuanHuyen, @SanPhamChinh,
            @EmployeeID, @isDefault, @DinhMucNo, @ThoiHanThanhToan,
            @PaymentTypeID, @PaymentTermID, @TaxCode, @DonViMuaHang, @AddressHD,
            @UserLogin, GETDATE(), 0
        );
        
        SELECT @ObjectID AS [id], N'Tạo mới khách hàng thành công' AS [message];
    END
END
