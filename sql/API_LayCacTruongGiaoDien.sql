-- =========================================================================
-- SCRIPT TẠO BẢNG CẤU HÌNH VÀ STORED PROCEDURE CHO ENGINE GIAO DIỆN ĐỘNG (DYNAMIC ENGINE)
-- =========================================================================

-- 1. Tạo bảng Danh sách Form (WA_FrmLstTbl)
IF OBJECT_ID('dbo.WA_FrmLstTbl', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[WA_FrmLstTbl] (
        [FormID]      VARCHAR(50)   NOT NULL PRIMARY KEY,
        [PrimaryKey]  VARCHAR(50)   NOT NULL,
        [ApiSearch]   VARCHAR(255)  NULL,
        [ApiSave]     VARCHAR(255)  NULL,
        [ApiDelete]   VARCHAR(255)  NULL
    );
END
GO

-- 2. Tạo bảng Cấu hình trường Form (WA_FormatFields)
IF OBJECT_ID('dbo.WA_FormatFields', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[WA_FormatFields] (
        [FormName]       VARCHAR(50)    NOT NULL,
        [FieldName]      VARCHAR(50)    NOT NULL,
        [CaptionVN]      NVARCHAR(255)  NULL,
        [IsRequired]     BIT            NULL DEFAULT 0,
        [FormPosition]   VARCHAR(20)    NULL DEFAULT '6',
        [ShowInAdd]      BIT            NULL DEFAULT 1,
        [ShowInEdit]     BIT            NULL DEFAULT 1,
        [IsReadOnlyEdit] BIT            NULL DEFAULT 0,
        [IsReadOnlyAdd]  BIT            NULL DEFAULT 0,
        [ShowInGrid]     BIT            NULL DEFAULT 1,
        [FormatID]       VARCHAR(50)    NULL DEFAULT '', -- renderRule
        [DataSource]     NVARCHAR(500)  NULL DEFAULT '',
        [OrderNo]        INT            NULL DEFAULT 0,
        [ValidateRule]   VARCHAR(500)   NULL DEFAULT '',
        [DependsOn]      VARCHAR(255)   NULL DEFAULT '',
        [VisibleRule]    VARCHAR(500)   NULL DEFAULT '',
        [ShowInFilter]   BIT            NULL DEFAULT 0,
        CONSTRAINT [PK_WA_FormatFields] PRIMARY KEY CLUSTERED ([FormName] ASC, [FieldName] ASC)
    );
END
GO

-- 3. Stored Procedure lấy cấu hình giao diện: API_LayCacTruongGiaoDien
IF OBJECT_ID('dbo.API_LayCacTruongGiaoDien', 'P') IS NOT NULL
    DROP PROCEDURE [dbo].[API_LayCacTruongGiaoDien];
GO

CREATE PROCEDURE [dbo].[API_LayCacTruongGiaoDien]
    @FormName VARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ff.[FieldName]      AS [name], 
        ff.[CaptionVN]      AS [label],
        ISNULL(ff.[IsRequired], 0) AS [required], 
        ISNULL(ff.[FormPosition], '6') AS [position],
        
        ISNULL(l.[PrimaryKey], '') AS [primaryKey],
        ISNULL(l.[ApiSearch], '')  AS [apiSearch],
        ISNULL(l.[ApiSave], '')    AS [apiSave],
        ISNULL(l.[ApiDelete], '')  AS [apiDelete],
        
        ISNULL(ff.[ShowInAdd],      1) AS [showInAdd],
        ISNULL(ff.[ShowInEdit],     1) AS [showInEdit],
        ISNULL(ff.[IsReadOnlyEdit], 0) AS [isReadOnlyEdit],
        ISNULL(ff.[IsReadOnlyAdd],  0) AS [isReadOnlyAdd],
        ISNULL(ff.[ShowInGrid],     1) AS [showInGrid],

        ISNULL(ff.[FormatID], '')      AS [renderRule],
        ISNULL(ff.[DataSource], '')    AS [dataSource],
        ISNULL(ff.[OrderNo], 0)        AS [orderNo],
        ISNULL(ff.[ValidateRule], '')  AS [validateRule],
        ISNULL(ff.[DependsOn], '')     AS [dependsOn],
        ISNULL(ff.[VisibleRule], '')    AS [visibleRule],
        ISNULL(ff.[ShowInFilter], 0)   AS [showInFilter]
    FROM [dbo].[WA_FormatFields] ff
    LEFT JOIN [dbo].[WA_FrmLstTbl] l ON ff.[FormName] = l.[FormID]
    WHERE (@FormName IS NULL OR ff.[FormName] = @FormName)
    ORDER BY ISNULL(ff.[OrderNo], 0) ASC, ff.[FieldName] ASC;
END
GO

-- 4. BƠM DỮ LIỆU CẤU HÌNH MẪU CHO CÁC FORM

-- Dọn dẹp trước khi chèn
DELETE FROM [dbo].[WA_FrmLstTbl] WHERE [FormID] IN ('frmProduct', 'frmSize', 'frmSKU', 'frmPromotion');
DELETE FROM [dbo].[WA_FormatFields] WHERE [FormName] IN ('frmProduct', 'frmSize', 'frmSKU', 'frmPromotion');

-- Thêm danh sách Form
INSERT INTO [dbo].[WA_FrmLstTbl] ([FormID], [PrimaryKey], [ApiSearch], [ApiSave], [ApiDelete])
VALUES 
('frmProduct', 'ItemName2', '/API_LaySanPham', '/API_SanPham_Luu', '/CF_TenHang2Tbl'),
('frmSize', 'Size', '/API_LayBangSize', '/CF_NhomSizeTbl', '/CF_NhomSizeTbl'),
('frmSKU', 'id', '/API_DanhMuc?Loai=SKU', '/API_DanhMuc_Luu?Loai=SKU', '/CF_ItemTbl'),
('frmPromotion', 'id', '/API_DanhMuc?Loai=Promotion', '/API_Promotion_Luu', '/CF_CTKMTbl');

-- Thêm cấu hình trường cho Sản phẩm (frmProduct)
INSERT INTO [dbo].[WA_FormatFields] 
([FormName], [FieldName], [CaptionVN], [IsRequired], [FormPosition], [ShowInAdd], [ShowInEdit], [ShowInGrid], [FormatID], [DataSource], [OrderNo], [ShowInFilter])
VALUES
('frmProduct', 'ItemName2', N'Tên hàng 2', 1, '6', 1, 1, 1, 'text', '', 10, 1),
('frmProduct', 'CategoryID', N'Nhóm hàng', 0, '6', 1, 1, 0, 'select', '/API_DanhMuc?Loai=nhom_hang', 20, 0),
('frmProduct', 'Form', N'Form', 0, '6', 1, 1, 1, 'select', '/API_DanhMuc?Loai=form', 30, 0),
('frmProduct', 'MauSac', N'Màu sắc', 0, '6', 1, 1, 1, 'select', '/API_DanhMuc?Loai=mau', 50, 0),
('frmProduct', 'nhom_size', N'Nhóm size', 0, '6', 1, 1, 1, 'select', '/API_DanhMuc?Loai=nhom_size', 60, 0),
('frmProduct', 'UnitPrice', N'Đơn giá', 0, '6', 1, 1, 1, 'mn', '', 70, 0),
('frmProduct', 'TenHangHoa', N'Tên hàng hóa', 0, '6', 1, 1, 1, 'text', '', 80, 0),
('frmProduct', 'ten_nhom_hang', N'Tên nhóm hàng', 0, '6', 0, 0, 1, 'select', '/API_DanhMuc?Loai=ten_nhom_hang', 90, 0),
('frmProduct', 'isDisable', N'Trạng thái', 0, '6', 1, 1, 1, 'sw', N'STATIC:false|Đang bán,true|Ngừng bán', 100, 0),
('frmProduct', 'isWeb', N'Lấy sang web đặt hàng', 0, '6', 1, 1, 1, 'sw', N'STATIC:true|Có,false|Không', 110, 0);

-- Thêm cấu hình trường cho Bảng Size (frmSize)
INSERT INTO [dbo].[WA_FormatFields] 
([FormName], [FieldName], [CaptionVN], [IsRequired], [FormPosition], [ShowInAdd], [ShowInEdit], [ShowInGrid], [FormatID], [DataSource], [OrderNo], [ShowInFilter])
VALUES
('frmSize', 'Size', N'Mã Size', 1, '6', 1, 1, 1, 'text', '', 10, 1),
('frmSize', 'TenSize', N'Tên Size', 0, '6', 1, 1, 1, 'text', '', 20, 0),
('frmSize', 'NhomSize', N'Nhóm Size', 0, '6', 1, 1, 1, 'text', '', 30, 0),
('frmSize', 'STT', N'Số thứ tự', 0, '6', 1, 1, 1, 'number', '', 40, 0);

-- Thêm cấu hình trường cho SKU (frmSKU)
INSERT INTO [dbo].[WA_FormatFields] 
([FormName], [FieldName], [CaptionVN], [IsRequired], [FormPosition], [ShowInAdd], [ShowInEdit], [ShowInGrid], [FormatID], [DataSource], [OrderNo], [ShowInFilter])
VALUES
('frmSKU', 'id', N'Mã SKU', 1, '6', 1, 1, 1, 'text', '', 10, 1),
('frmSKU', 'name', N'Tên SKU', 0, '6', 1, 1, 1, 'text', '', 20, 0),
('frmSKU', 'price', N'Giá bán', 0, '6', 1, 1, 1, 'mn', '', 30, 0);

-- Thêm cấu hình trường cho CTKM (frmPromotion)
INSERT INTO [dbo].[WA_FormatFields] 
([FormName], [FieldName], [CaptionVN], [IsRequired], [FormPosition], [ShowInAdd], [ShowInEdit], [ShowInGrid], [FormatID], [DataSource], [OrderNo], [ShowInFilter])
VALUES
('frmPromotion', 'id', N'Mã CTKM', 1, '6', 1, 1, 1, 'text', '', 10, 1),
('frmPromotion', 'name', N'Tên CTKM', 1, '6', 1, 1, 1, 'text', '', 20, 0);
GO

-- 5. BƠM MENU ĐỘNG VÀO HỆ THỐNG MENU (WA_Menu)
DELETE FROM [dbo].[WA_Menu] WHERE [MenuID] IN ('04', '0410', '0420', '0430', '0440') OR [URLPara] IN ('/products', '/sizes', '/sku', '/promos');

INSERT INTO [dbo].[WA_Menu] 
    ([MenuID], [Parent], [VN], [EN], [IconClass], [FormKey], [FormName], [URLPara], [isDisable])
VALUES
    ('04',   '',     N'Quản lý danh mục', 'Master Data', 'folder_open', '', '', '', 0),
    ('0410', '04',   N'Sản phẩm',        'Products',    'shopping_bag', 'products', 'frmProduct', '/products', 0),
    ('0420', '04',   N'Bảng Size',       'Sizes',       'straighten',   'sizes',    'frmSize',    '/sizes', 0),
    ('0430', '04',   N'Mã SKU',          'SKU',         'qr_code',      'sku',      'frmSKU',     '/sku', 0),
    ('0440', '04',   N'CTKM',            'Promotions',  'local_offer',  'promos',   'frmPromotion', '/promos', 0);
GO

-- 6. Đồng bộ phân quyền cho các Menu mới vào WA_UserGroupPermisstion
IF OBJECT_ID('dbo.API_DongBoQuyenTruyCap') IS NOT NULL
BEGIN
    EXEC [dbo].[API_DongBoQuyenTruyCap] @NhomNguoiDangThaoTac = 'Admin';
END;
GO

-- =========================================================================
-- CÁC CÂU LỆNH KIỂM TRA DỮ LIỆU SAU KHI CHẠY SCRIPT (COPY VÀ CHẠY THỬ)
-- =========================================================================

-- 1. Xem danh sách Form cấu hình đã đăng ký
SELECT * FROM [dbo].[WA_FrmLstTbl];

-- 2. Xem danh sách trường của các Form
SELECT * FROM [dbo].[WA_FormatFields] ORDER BY [FormName], [OrderNo];

-- 3. Xem danh sách Menu đã chèn (Nhóm 04)
SELECT * FROM [dbo].[WA_Menu] WHERE [MenuID] LIKE '04%' OR [Parent] = '04';

-- 4. Chạy thử Stored Procedure lấy danh sách các trường của Form Sản phẩm (frmProduct)
EXEC [dbo].[API_LayCacTruongGiaoDien] @FormName = 'frmProduct';

-- 5. Chạy thử Stored Procedure lấy danh sách các trường của Form Bảng Size (frmSize)
EXEC [dbo].[API_LayCacTruongGiaoDien] @FormName = 'frmSize';

