-- =========================================================================
-- MIGRATION SCRIPT FOR PERMISSIONS AND MENUS MANAGEMENT STORED PROCEDURES
-- =========================================================================

-- 1. API_LayDanhSachNhom
IF OBJECT_ID('dbo.API_LayDanhSachNhom') IS NOT NULL
    DROP PROCEDURE [dbo].[API_LayDanhSachNhom];
GO

CREATE PROCEDURE [dbo].[API_LayDanhSachNhom]
AS
BEGIN
    SET NOCOUNT ON;

    -- Chọn lọc và đổi Tên cột (Alias) cho khớp với JSON Frontend (id, name)
    SELECT 
        [UserGroupID] AS [id],
        [UserGroupName] AS [name]
    FROM [SY_UserGroup]
    WHERE COALESCE([IsDisable], 0) = 0 -- Bỏ qua các nhóm đã bị khóa (IsDisable = 1)
    ORDER BY [UserGroupID];
END;
GO

-- 2. API_LayQuyenNhomDayDu
IF OBJECT_ID('dbo.API_LayQuyenNhomDayDu') IS NOT NULL
    DROP PROCEDURE [dbo].[API_LayQuyenNhomDayDu];
GO

CREATE PROCEDURE [dbo].[API_LayQuyenNhomDayDu]
    @NhomNguoiDangThaoTac NVARCHAR(50),
    @UserGroupID           NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    -- Chỉ cho phép: tự soi chính mình HOẶC Admin soi người khác
    IF (@NhomNguoiDangThaoTac != @UserGroupID) AND (@NhomNguoiDangThaoTac != 'Admin')
    BEGIN
        RAISERROR (N'Lỗi: Bạn không có thẩm quyền xem phân quyền của nhóm này!', 16, 1);
        RETURN;
    END

    -- VẾ 1: Chỉ lấy menu lá ĐÃ ĐƯỢC ĐỒNG BỘ vào bảng Permission (INNER JOIN)
    SELECT
        M.MenuID        AS [id],
        M.Parent        AS [parent],
        M.VN            AS [label],
        M.IconClass     AS [icon],
        M.FormName      AS [formName],
        M.URLPara       AS [urlPara],
        ISNULL(P.IsRun,        0) AS IsRun,
        ISNULL(P.IsAdd,        0) AS IsAdd,
        ISNULL(P.IsUpdate,     0) AS IsUpdate,
        ISNULL(P.IsDelete,     0) AS IsDelete,
        ISNULL(P.isManager,    0) AS isManager,
        ISNULL(P.isAdmin,      0) AS isAdmin,
        ISNULL(P.isAutoLock,   0) AS isAutoLock,
        ISNULL(P.isHideAmount, 0) AS isHideAmount,
        ISNULL(P.isLockDoc,    0) AS isLockDoc,
        ISNULL(P.isUnLockDoc,  0) AS isUnLockDoc,
        ISNULL(P.isExportExcel,0) AS isExportExcel
    FROM WA_Menu M
    INNER JOIN WA_UserGroupPermisstion P
        ON M.MenuID = P.MenuID AND P.UserGroupID = @UserGroupID
    WHERE COALESCE(M.isDisable, 0) = 0
      AND COALESCE(M.URLPara, '') <> ''

    UNION ALL

    -- VẾ 2: Chỉ lấy thư mục cha của những menu ĐÃ CÓ TRONG PERMISSION
    SELECT
        M.MenuID    AS [id],
        M.Parent    AS [parent],
        M.VN        AS [label],
        M.IconClass AS [icon],
        M.FormName  AS [formName],
        M.URLPara   AS [urlPara],
        1 AS IsRun, 0 AS IsAdd, 0 AS IsUpdate, 0 AS IsDelete,
        0 AS isManager, 0 AS isAdmin, 0 AS isAutoLock, 0 AS isHideAmount,
        0 AS isLockDoc, 0 AS isUnLockDoc, 0 AS isExportExcel
    FROM WA_Menu M
    WHERE COALESCE(M.isDisable, 0) = 0
      AND COALESCE(M.URLPara, '') = ''
      AND M.MenuID IN (
          -- Chỉ lấy folder cha của menu con ĐÃ CÓ TRONG bảng Permission
          SELECT DISTINCT Parent FROM WA_Menu
          WHERE COALESCE(isDisable, 0) = 0
            AND COALESCE(URLPara, '') <> ''
            AND Parent IS NOT NULL AND Parent <> ''
            AND MenuID IN (
                SELECT MenuID FROM WA_UserGroupPermisstion
                WHERE UserGroupID = @UserGroupID
            )
      )

    ORDER BY [id];
END;
GO

-- 3. API_LuuQuyenCuaNhom
IF OBJECT_ID('dbo.API_LuuQuyenCuaNhom') IS NOT NULL
    DROP PROCEDURE [dbo].[API_LuuQuyenCuaNhom];
GO

CREATE PROCEDURE [dbo].[API_LuuQuyenCuaNhom]
    @NhomNguoiDangThaoTac NVARCHAR(50), -- BẮT BUỘC THÊM: Truyền Session Nhóm của người ĐANG BẤM NÚT LƯU
    @UserGroupID NVARCHAR(50),          -- Nhóm BỊ gán quyền
    @MenuID NVARCHAR(50),               -- Form BỊ gán quyền
    @IsRun BIT,                         
    @IsAdd BIT,                         
    @IsUpdate BIT,                      
    @IsDelete BIT,
    @isManager BIT,
    @isAdmin BIT,
    @isAutoLock BIT,
    @isHideAmount BIT,
    @isLockDoc BIT,
    @isUnLockDoc BIT,
    @isExportExcel BIT
AS
BEGIN
    SET NOCOUNT ON;

    -- =======================================================
    -- BƯỚC 1: CẢNH VỆ HỆ THỐNG - CHỈ SUPER ADMIN MỚI ĐƯỢC CHẠY
    -- Khoá cứng điều kiện: Mã nhóm thao tác bắt buộc phải là 'Admin'
    -- =======================================================
    IF (@NhomNguoiDangThaoTac != 'Admin')
    BEGIN
        RAISERROR (N'Lỗi Bảo Mật: Bạn không phải Giám đốc Server, cấm sửa Phân Quyền!', 16, 1);
        RETURN; 
    END;

    -- =======================================================
    -- BƯỚC 2: CẬP NHẬT DATABASE
    -- =======================================================
    UPDATE WA_UserGroupPermisstion
    SET 
        IsRun = @IsRun,
        IsAdd = @IsAdd,
        IsUpdate = @IsUpdate,
        IsDelete = @IsDelete,
        isManager = @isManager,
        isAdmin = @isAdmin,
        isAutoLock = @isAutoLock,
        isHideAmount = @isHideAmount,
        isLockDoc = @isLockDoc,
        isUnLockDoc = @isUnLockDoc,
        isExportExcel = @isExportExcel
    WHERE UserGroupID = @UserGroupID 
      AND MenuID = @MenuID;

    -- =======================================================
    -- BƯỚC 3: KÍCH HOẠT CÒI BÁO ĐỘNG CHO CÁC TRANG WEB KHÁC TỰ F5 QUYỀN
    -- =======================================================
    IF EXISTS (SELECT 1 FROM SY_Setup WHERE CodeID = 'menu_sync_ver')
        UPDATE SY_Setup SET CodeValue = CONVERT(NVARCHAR(50), GETDATE(), 126) WHERE CodeID = 'menu_sync_ver';
    ELSE
        INSERT INTO SY_Setup (CodeID, CodeName, CodeValue, GroupID) VALUES ('menu_sync_ver', N'Phiên bản đồng bộ Menu', CONVERT(NVARCHAR(50), GETDATE(), 126), 'SY');

END;
GO

-- 4. API_DongBoQuyenTruyCap
IF OBJECT_ID('dbo.API_DongBoQuyenTruyCap') IS NOT NULL
    DROP PROCEDURE [dbo].[API_DongBoQuyenTruyCap];
GO

CREATE PROCEDURE [dbo].[API_DongBoQuyenTruyCap]
    @NhomNguoiDangThaoTac NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        -- Xóa rác: MenuID rỗng
        DELETE FROM WA_UserGroupPermisstion
        WHERE COALESCE(MenuID, '') = '';

        -- Xóa rác: nhóm không còn tồn tại
        DELETE FROM WA_UserGroupPermisstion
        WHERE UserGroupID NOT IN (SELECT UserGroupID FROM SY_UserGroup);

        -- Xóa rác: menu không còn tồn tại
        DELETE FROM WA_UserGroupPermisstion
        WHERE MenuID NOT IN (SELECT MenuID FROM WA_Menu);

        -- Bơm quyền còn thiếu
        INSERT INTO WA_UserGroupPermisstion
            (ID, UserGroupID, MenuID, IsRun, IsAdd, IsUpdate, IsDelete,
             isManager, isAdmin, isAutoLock, isHideAmount, isLockDoc, isUnLockDoc, isExportExcel)
        SELECT
            G.UserGroupID + '_' + M.MenuID,
            G.UserGroupID,
            M.MenuID,
            CASE WHEN G.UserGroupID = 'Admin' THEN 1 ELSE 0 END,
            CASE WHEN G.UserGroupID = 'Admin' THEN 1 ELSE 0 END,
            CASE WHEN G.UserGroupID = 'Admin' THEN 1 ELSE 0 END,
            CASE WHEN G.UserGroupID = 'Admin' THEN 1 ELSE 0 END,
            CASE WHEN G.UserGroupID = 'Admin' THEN 1 ELSE 0 END,
            CASE WHEN G.UserGroupID = 'Admin' THEN 1 ELSE 0 END,
            0, 0, 0,
            CASE WHEN G.UserGroupID = 'Admin' THEN 1 ELSE 0 END,
            CASE WHEN G.UserGroupID = 'Admin' THEN 1 ELSE 0 END
        FROM SY_UserGroup G
        CROSS JOIN WA_Menu M
        WHERE NOT EXISTS (
            SELECT 1 FROM WA_UserGroupPermisstion P
            WHERE P.UserGroupID = G.UserGroupID
              AND P.MenuID = M.MenuID
        );

        -- Ghi version đồng bộ vào SY_Setup để các client tự biết cache cũ
        IF EXISTS (SELECT 1 FROM SY_Setup WHERE CodeID = 'menu_sync_ver')
            UPDATE SY_Setup
            SET CodeValue = CONVERT(NVARCHAR(50), GETDATE(), 126)
            WHERE CodeID = 'menu_sync_ver';
        ELSE
            INSERT INTO SY_Setup (CodeID, CodeName, CodeValue, GroupID)
            VALUES ('menu_sync_ver', N'Phiên bản đồng bộ Menu', CONVERT(NVARCHAR(50), GETDATE(), 126), 'SY');

        SELECT 0 AS [code], N'Đồng bộ quyền thành công' AS [msg];

    END TRY
    BEGIN CATCH
        SELECT 1 AS [code], ERROR_MESSAGE() AS [msg];
    END CATCH

END;
GO

-- 5. API_LayDanhSachMenuTatCa
IF OBJECT_ID('dbo.API_LayDanhSachMenuTatCa') IS NOT NULL
    DROP PROCEDURE [dbo].[API_LayDanhSachMenuTatCa];
GO

CREATE PROCEDURE [dbo].[API_LayDanhSachMenuTatCa]
    @NhomNguoiDangThaoTac NVARCHAR(50) = ''
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        MenuID AS [id],
        COALESCE(Parent, '') AS [parent],
        COALESCE(VN, '') AS [label],
        '' AS [subTitle],
        COALESCE(EN, '') AS [en],
        COALESCE(FormName, '') AS [formName],
        COALESCE(FormKey, '') AS [formKey],
        COALESCE(URLPara, '') AS [urlPara],
        COALESCE(IconClass, '') AS [icon],
        COALESCE(isDisable, 0) AS [isDisable]
    FROM WA_Menu
    ORDER BY MenuID ASC;
END;
GO

-- 6. API_LuuMenu
IF OBJECT_ID('dbo.API_LuuMenu') IS NOT NULL
    DROP PROCEDURE [dbo].[API_LuuMenu];
GO

CREATE PROCEDURE [dbo].[API_LuuMenu]
    @NhomNguoiDangThaoTac NVARCHAR(50) = '',
    @MenuID NVARCHAR(50),
    @OldMenuID NVARCHAR(50) = '',
    @ParentID NVARCHAR(50) = '',
    @Label NVARCHAR(250),
    @EN NVARCHAR(250) = '',
    @SubTitle NVARCHAR(250) = '',
    @FormName NVARCHAR(250) = '',
    @FormKey NVARCHAR(250) = '',
    @URLPara NVARCHAR(250) = '',
    @Icon NVARCHAR(100) = '',
    @IsDisable BIT = 0,
    @IsEdit BIT = 0
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra Nhóm Cha (ParentID) có hợp lệ không
    IF (@ParentID <> '')
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM WA_Menu WHERE MenuID = @ParentID)
        BEGIN
            -- Tự động tạo một Menu Cha (Root) mới thay vì báo lỗi
            INSERT INTO WA_Menu (MenuID, Parent, VN, EN, FormName, FormKey, URLPara, IconClass, isDisable)
            VALUES (@ParentID, '', N'Nhóm Menu ' + @ParentID, '', '', '', '', 'folder', 0);
        END;

        IF (@IsEdit = 1 AND @ParentID = @OldMenuID)
        BEGIN
            RAISERROR (N'Lỗi: Một Menu không thể tự chọn chính nó làm Nhóm Cha!', 16, 1);
            RETURN;
        END;
    END;

    -- Tự động bóc tách và gán tiền tố ID Nhóm Cha vào Menu ID
    IF (@IsEdit = 1)
    BEGIN
        DECLARE @OldParentID NVARCHAR(50);
        SELECT @OldParentID = ISNULL(Parent, '') FROM WA_Menu WHERE MenuID = @OldMenuID;
        
        -- Nếu ID hiện tại đang dính Parent cũ, cắt bỏ Parent cũ ra khỏi ID
        IF (@OldParentID <> '' AND @MenuID LIKE @OldParentID + '%')
        BEGIN
            SET @MenuID = RIGHT(@MenuID, LEN(@MenuID) - LEN(@OldParentID));
        END;
    END;

    -- Gắn Parent mới vào ID nếu có chọn Nhóm Cha và ID chưa chứa Nhóm Cha
    IF (@ParentID <> '' AND @MenuID NOT LIKE @ParentID + '%')
    BEGIN
        SET @MenuID = @ParentID + @MenuID;
    END;

    IF (@IsEdit = 1)
    BEGIN
        -- Đổi ID nếu cần thiết
        IF (@OldMenuID <> '' AND @OldMenuID <> @MenuID)
        BEGIN
            UPDATE WA_Menu SET MenuID = @MenuID WHERE MenuID = @OldMenuID;
            UPDATE WA_UserGroupPermisstion SET MenuID = @MenuID WHERE MenuID = @OldMenuID;
            UPDATE WA_UserPermisstion SET MenuID = @MenuID WHERE MenuID = @OldMenuID;
            -- Đồng bộ cập nhật cột Parent cho các menu con nếu đổi ID của Group cha
            UPDATE WA_Menu SET Parent = @MenuID WHERE Parent = @OldMenuID;
        END;

        UPDATE WA_Menu 
        SET 
            Parent = @ParentID,
            VN = @Label,
            EN = @EN,
            FormName = @FormName,
            FormKey = @FormKey,
            URLPara = @URLPara,
            IconClass = @Icon,
            isDisable = @IsDisable
        WHERE MenuID = @MenuID;
    END;
    ELSE
    BEGIN
        IF EXISTS (SELECT 1 FROM WA_Menu WHERE MenuID = @MenuID)
        BEGIN
            RAISERROR (N'Lỗi: Menu ID này đã tồn tại trong hệ thống!', 16, 1);
            RETURN;
        END;

        INSERT INTO WA_Menu (MenuID, Parent, VN, EN, FormName, FormKey, URLPara, IconClass, isDisable)
        VALUES (@MenuID, @ParentID, @Label, @EN, @FormName, @FormKey, @URLPara, @Icon, @IsDisable);
    END;
END;
GO

-- 7. API_XoaMenu
IF OBJECT_ID('dbo.API_XoaMenu') IS NOT NULL
    DROP PROCEDURE [dbo].[API_XoaMenu];
GO

CREATE PROCEDURE [dbo].[API_XoaMenu]
    @NhomNguoiDangThaoTac NVARCHAR(50) = '',
    @MenuID NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Xóa phân quyền của các menu con
    DELETE FROM WA_UserGroupPermisstion WHERE MenuID IN (SELECT MenuID FROM WA_Menu WHERE Parent = @MenuID);
    DELETE FROM WA_UserPermisstion WHERE MenuID IN (SELECT MenuID FROM WA_Menu WHERE Parent = @MenuID);

    -- 2. Xóa phân quyền của menu hiện tại
    DELETE FROM WA_UserGroupPermisstion WHERE MenuID = @MenuID;
    DELETE FROM WA_UserPermisstion WHERE MenuID = @MenuID;

    -- 3. Xóa các menu con
    DELETE FROM WA_Menu WHERE Parent = @MenuID;

    -- 4. Xóa menu hiện tại
    DELETE FROM WA_Menu WHERE MenuID = @MenuID;

END;
GO

-- 8. API_LuuThuTuMenu
IF OBJECT_ID('dbo.API_LuuThuTuMenu') IS NOT NULL
    DROP PROCEDURE [dbo].[API_LuuThuTuMenu];
GO

CREATE PROCEDURE [dbo].[API_LuuThuTuMenu]
    @NhomNguoiDangThaoTac NVARCHAR(50) = '',
    @Type NVARCHAR(20) = 'parent',   
    @OrderedIDs NVARCHAR(MAX) = '',  
    @ParentID NVARCHAR(50) = ''      
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1. Tách chuỗi ID do Giao diện gửi xuống (chuẩn thứ tự bằng XML)
        DECLARE @Tbl TABLE (Idx INT IDENTITY(1,1), OldID NVARCHAR(50));
        DECLARE @xml XML = CAST('<x>' + REPLACE(@OrderedIDs, ',', '</x><x>') + '</x>' AS XML);

        INSERT INTO @Tbl (OldID)
        SELECT n.value('.', 'NVARCHAR(50)') AS ID
        FROM @xml.nodes('/x') AS p(n);

        -- 2. Lấy danh sách ID HỆ THỐNG HIỆN TẠI đang có (sắp xếp tăng dần theo Alphabet/Số)
        -- Mục đích: Lấy lại chính xác các mã Menu đang dùng để xào bài lại, không sinh mã mới
        DECLARE @TblExisting TABLE (Idx INT IDENTITY(1,1), AvailableID NVARCHAR(50));
        
        IF (@Type = 'parent')
        BEGIN
            INSERT INTO @TblExisting (AvailableID)
            SELECT MenuID FROM WA_Menu 
            WHERE Parent = '' OR Parent IS NULL
            ORDER BY MenuID ASC;
        END;
        ELSE
        BEGIN
            INSERT INTO @TblExisting (AvailableID)
            SELECT MenuID FROM WA_Menu 
            WHERE Parent = @ParentID
            ORDER BY MenuID ASC;
        END;

        -- 3. Đổi toàn bộ ID gốc sang một mã TẠM THỜI (để tránh lỗi Trùng Khóa Chính - Duplicate Key)
        -- VD: Đổi '0304' thành 'TMP_0304'
        UPDATE M
        SET M.MenuID = 'TMP_' + T.OldID
        FROM WA_Menu M
        JOIN @Tbl T ON M.MenuID = T.OldID;

        UPDATE P
        SET P.MenuID = 'TMP_' + T.OldID
        FROM WA_UserGroupPermisstion P
        JOIN @Tbl T ON P.MenuID = T.OldID;

        UPDATE U
        SET U.MenuID = 'TMP_' + T.OldID
        FROM WA_UserPermisstion U
        JOIN @Tbl T ON U.MenuID = T.OldID;

        -- Nếu đổi Nhóm Cha, phải đổi Parent của menu con trỏ theo mã Tạm
        IF (@Type = 'parent')
        BEGIN
            UPDATE M
            SET M.Parent = 'TMP_' + T.OldID
            FROM WA_Menu M
            JOIN @Tbl T ON M.Parent = T.OldID;
        END;

        -- 4. Ghép nối: Vị trí được KÉO (Tbl) sẽ nhận Mã ID SẮP XẾP (TblExisting)
        -- VD: Kéo 0312 lên đầu (Idx=1), sẽ nhận ID nhỏ nhất của hệ thống (Idx=1 là 0304)
        UPDATE M
        SET M.MenuID = E.AvailableID
        FROM WA_Menu M
        JOIN @Tbl T ON M.MenuID = 'TMP_' + T.OldID
        JOIN @TblExisting E ON T.Idx = E.Idx;

        UPDATE P
        SET P.MenuID = E.AvailableID
        FROM WA_UserGroupPermisstion P
        JOIN @Tbl T ON P.MenuID = 'TMP_' + T.OldID
        JOIN @TblExisting E ON T.Idx = E.Idx;

        UPDATE U
        SET U.MenuID = E.AvailableID
        FROM WA_UserPermisstion U
        JOIN @Tbl T ON U.MenuID = 'TMP_' + T.OldID
        JOIN @TblExisting E ON T.Idx = E.Idx;

        -- Đổi Parent cho menu con về mã mới (nếu là nhóm cha)
        IF (@Type = 'parent')
        BEGIN
            UPDATE M
            SET M.Parent = E.AvailableID
            FROM WA_Menu M
            JOIN @Tbl T ON M.Parent = 'TMP_' + T.OldID
            JOIN @TblExisting E ON T.Idx = E.Idx;
        END;

        -- 5. Xóa bỏ cột ThuTu nếu muốn vì giờ đã swap hẳn MenuID
        COMMIT TRANSACTION;
        SELECT 0 AS [code], N'Đã hoàn tất Hoán đổi Mã MenuID thành công' AS [msg];

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        SELECT 1 AS [code], ERROR_MESSAGE() AS [msg];
    END CATCH
END;
GO
