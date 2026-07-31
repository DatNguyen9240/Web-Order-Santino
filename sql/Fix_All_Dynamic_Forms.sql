-- =========================================================================
-- SCRIPT CẤU HÌNH ĐỒNG BỘ TOÀN BỘ METADATA VÀ API ACTION (SEARCH & DETAIL & DELETE)
-- (Khách hàng, Sản phẩm, Đơn hàng, Chương trình khuyến mãi)
-- =========================================================================
SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    -- 1. CẤU HÌNH CÁC FORM TRONG SY_FrmLstTbl (ĐỔI TABLE CỦA PRODUCT THÀNH CF_TENHANG2TBL VÀ KHÓA CHÍNH THÀNH ITEMNAME2)
    DELETE FROM dbo.SY_FrmLstTbl WHERE FormID IN (
        'ObjectListFrm', 'WEB_CustomerFrm', 
        'frmProduct', 'WEB_ProductFrm', 'ProductListFrm', 'ItemListFrm', 
        'WEB_OrderFrm', 'OrderListFrm', 
        'frmPromotion', 'CTKMFrm'
    );

    INSERT INTO dbo.SY_FrmLstTbl (FormID, FormType, CaptionVN, CaptionEN, TableName, PrimaryKey, AddNewColumnArr, EditorColumnArr, DefaultColumnArr, HideColumnArr)
    VALUES 
    ('ObjectListFrm',   'LISTEDIT', N'Danh mục khách hàng', 'Customer List', 'dbo.CF_ObjectTbl', 'ObjectID', 'ObjectName;Phone;Address;ObjectGroupID;LocationID;EmployeeID;Notes', 'ObjectName;Phone;Address;ObjectGroupID;LocationID;EmployeeID;Notes', 'ObjectID;ObjectName;Phone;Address;ObjectGroupID;EmployeeID;Notes', 'isWeb;LocationID;BranchID;PaymentTypeID;PaymentTermID'),
    ('WEB_CustomerFrm', 'LISTEDIT', N'Danh mục khách hàng', 'Customer List', 'dbo.CF_ObjectTbl', 'ObjectID', 'ObjectName;Phone;Address;ObjectGroupID;LocationID;EmployeeID;Notes', 'ObjectName;Phone;Address;ObjectGroupID;LocationID;EmployeeID;Notes', 'ObjectID;ObjectName;Phone;Address;ObjectGroupID;EmployeeID;Notes', 'isWeb;LocationID;BranchID;PaymentTypeID;PaymentTermID'),

    -- Cấu hình hiển thị đầy đủ tất cả cột của Sản phẩm (Bao gồm Form dáng, Thiết kế, Hiện Web, Ngưng hoạt động)
    ('frmProduct',      'LISTEDIT', N'Danh mục sản phẩm', 'Product List', 'dbo.CF_TenHang2Tbl', 'ItemName2', 'TenHangHoa;CategoryID;Unit;UnitPrice;Size;MauSac;Form;Design;isWeb;isDisable', 'TenHangHoa;CategoryID;Unit;UnitPrice;Size;MauSac;Form;Design;isWeb;isDisable', 'ItemName2;TenHangHoa;CategoryID;Unit;UnitPrice;Size;MauSac;Form;Design;isWeb;isDisable', 'UserAutoID;GiaMua;UnitCost;BarCode'),
    ('WEB_ProductFrm',  'LISTEDIT', N'Danh mục sản phẩm', 'Product List', 'dbo.CF_TenHang2Tbl', 'ItemName2', 'TenHangHoa;CategoryID;Unit;UnitPrice;Size;MauSac;Form;Design;isWeb;isDisable', 'TenHangHoa;CategoryID;Unit;UnitPrice;Size;MauSac;Form;Design;isWeb;isDisable', 'ItemName2;TenHangHoa;CategoryID;Unit;UnitPrice;Size;MauSac;Form;Design;isWeb;isDisable', 'UserAutoID;GiaMua;UnitCost;BarCode'),
    ('ProductListFrm',  'LISTEDIT', N'Danh mục sản phẩm', 'Product List', 'dbo.CF_TenHang2Tbl', 'ItemName2', 'TenHangHoa;CategoryID;Unit;UnitPrice;Size;MauSac;Form;Design;isWeb;isDisable', 'TenHangHoa;CategoryID;Unit;UnitPrice;Size;MauSac;Form;Design;isWeb;isDisable', 'ItemName2;TenHangHoa;CategoryID;Unit;UnitPrice;Size;MauSac;Form;Design;isWeb;isDisable', 'UserAutoID;GiaMua;UnitCost;BarCode'),
    ('ItemListFrm',     'LISTEDIT', N'Danh mục sản phẩm', 'Product List', 'dbo.CF_TenHang2Tbl', 'ItemName2', 'TenHangHoa;CategoryID;Unit;UnitPrice;Size;MauSac;Form;Design;isWeb;isDisable', 'TenHangHoa;CategoryID;Unit;UnitPrice;Size;MauSac;Form;Design;isWeb;isDisable', 'ItemName2;TenHangHoa;CategoryID;Unit;UnitPrice;Size;MauSac;Form;Design;isWeb;isDisable', 'UserAutoID;GiaMua;UnitCost;BarCode'),

    ('WEB_OrderFrm',  'LISTEDIT', N'Danh sách đơn hàng', 'Order List', 'dbo.WEB_OrderTbl', 'DocumentID', 'DocumentDate;BranchID;ObjectID;ObjectName;EmployeeID;CTKM;BaseTotal;TotalAmount;Notes', 'DocumentDate;BranchID;ObjectID;ObjectName;EmployeeID;CTKM;BaseTotal;TotalAmount;Notes', 'DocumentID;DocumentDate;BranchID;ObjectID;ObjectName;EmployeeID;CTKM;BaseTotal;TotalAmount;Status', 'UserAutoID'),
    ('OrderListFrm',  'LISTEDIT', N'Danh sách đơn hàng', 'Order List', 'dbo.WEB_OrderTbl', 'DocumentID', 'DocumentDate;BranchID;ObjectID;ObjectName;EmployeeID;CTKM;BaseTotal;TotalAmount;Notes', 'DocumentDate;BranchID;ObjectID;ObjectName;EmployeeID;CTKM;BaseTotal;TotalAmount;Notes', 'DocumentID;DocumentDate;BranchID;ObjectID;ObjectName;EmployeeID;CTKM;BaseTotal;TotalAmount;Status', 'UserAutoID'),

    ('frmPromotion', 'LISTEDIT', N'Chương trình khuyến mãi', 'Promotion List', 'dbo.CF_CTKMTbl', 'CTKM', 'ChietKhau;Memo;TyLeDoi;TyLeDoiTrongVu;NgayBatDau;NgayKetThuc;ChiTieu;NhomCTKM;IsHTLCu', 'ChietKhau;Memo;TyLeDoi;TyLeDoiTrongVu;NgayBatDau;NgayKetThuc;ChiTieu;NhomCTKM;IsHTLCu', 'CTKM;ChietKhau;Memo;TyLeDoi;TyLeDoiTrongVu;NgayBatDau;NgayKetThuc;ChiTieu;NhomCTKM;IsHTLCu', 'UserAutoID'),
    ('CTKMFrm',      'LISTEDIT', N'Chương trình khuyến mãi', 'Promotion List', 'dbo.CF_CTKMTbl', 'CTKM', 'ChietKhau;Memo;TyLeDoi;TyLeDoiTrongVu;NgayBatDau;NgayKetThuc;ChiTieu;NhomCTKM;IsHTLCu', 'ChietKhau;Memo;TyLeDoi;TyLeDoiTrongVu;NgayBatDau;NgayKetThuc;ChiTieu;NhomCTKM;IsHTLCu', 'CTKM;ChietKhau;Memo;TyLeDoi;TyLeDoiTrongVu;NgayBatDau;NgayKetThuc;ChiTieu;NhomCTKM;IsHTLCu', 'UserAutoID');

    -- 2. CẤU HÌNH API ACTION ROUTING CHUẨN (SEARCH & DETAIL & SAVE & DELETE)
    DELETE FROM dbo.SY_FrmMstActTbl WHERE FormID IN (
        'ObjectListFrm', 'WEB_CustomerFrm', 
        'frmProduct', 'WEB_ProductFrm', 'ProductListFrm', 'ItemListFrm', 
        'WEB_OrderFrm', 'OrderListFrm', 
        'frmPromotion', 'CTKMFrm'
    );

    INSERT INTO dbo.SY_FrmMstActTbl (UserAutoID, FormID, MaterAction, [Action], [Source], ColumnID, IsDisable, Oderby)
    VALUES
        -- Khách hàng -> SEARCH & DETAIL & SAVE & DELETE
        (CONVERT(VARCHAR(36), NEWID()), 'ObjectListFrm',   'API', 'SEARCH', '/API_LayDanhSachKhachHang', '', 0, 1),
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_CustomerFrm', 'API', 'SEARCH', '/API_LayDanhSachKhachHang', '', 0, 1),
        (CONVERT(VARCHAR(36), NEWID()), 'ObjectListFrm',   'API', 'DETAIL', '/API_LayDanhSachKhachHang', '', 0, 2),
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_CustomerFrm', 'API', 'DETAIL', '/API_LayDanhSachKhachHang', '', 0, 2),
        (CONVERT(VARCHAR(36), NEWID()), 'ObjectListFrm',   'API', 'CREATE', '/API_KhachHang_Luu', '', 0, 3),
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_CustomerFrm', 'API', 'CREATE', '/API_KhachHang_Luu', '', 0, 3),
        (CONVERT(VARCHAR(36), NEWID()), 'ObjectListFrm',   'API', 'UPDATE', '/API_KhachHang_Luu', '', 0, 4),
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_CustomerFrm', 'API', 'UPDATE', '/API_KhachHang_Luu', '', 0, 4),
        (CONVERT(VARCHAR(36), NEWID()), 'ObjectListFrm',   'API', 'DELETE', '/API_KhachHang_Xoa', '', 0, 5),
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_CustomerFrm', 'API', 'DELETE', '/API_KhachHang_Xoa', '', 0, 5),

        -- Sản phẩm (frmProduct) -> SEARCH & DETAIL & SAVE & DELETE
        (CONVERT(VARCHAR(36), NEWID()), 'frmProduct',     'API', 'SEARCH', '/API_LaySanPham', '', 0, 1),
        (CONVERT(VARCHAR(36), NEWID()), 'frmProduct',     'API', 'DETAIL', '/API_LaySanPham', '', 0, 2),
        (CONVERT(VARCHAR(36), NEWID()), 'frmProduct',     'API', 'CREATE', '/API_SanPham_Luu', '', 0, 3),
        (CONVERT(VARCHAR(36), NEWID()), 'frmProduct',     'API', 'UPDATE', '/API_SanPham_Luu', '', 0, 4),
        (CONVERT(VARCHAR(36), NEWID()), 'frmProduct',     'API', 'DELETE', '/API_SanPham_Xoa', '', 0, 5),

        -- Sản phẩm (WEB_ProductFrm) -> SEARCH & DETAIL & SAVE & DELETE
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_ProductFrm', 'API', 'SEARCH', '/API_LaySanPham', '', 0, 1),
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_ProductFrm', 'API', 'DETAIL', '/API_LaySanPham', '', 0, 2),
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_ProductFrm', 'API', 'CREATE', '/API_SanPham_Luu', '', 0, 3),
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_ProductFrm', 'API', 'UPDATE', '/API_SanPham_Luu', '', 0, 4),
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_ProductFrm', 'API', 'DELETE', '/API_SanPham_Xoa', '', 0, 5),

        -- Sản phẩm (ProductListFrm) -> SEARCH & DETAIL & SAVE & DELETE
        (CONVERT(VARCHAR(36), NEWID()), 'ProductListFrm', 'API', 'SEARCH', '/API_LaySanPham', '', 0, 1),
        (CONVERT(VARCHAR(36), NEWID()), 'ProductListFrm', 'API', 'DETAIL', '/API_LaySanPham', '', 0, 2),
        (CONVERT(VARCHAR(36), NEWID()), 'ProductListFrm', 'API', 'CREATE', '/API_SanPham_Luu', '', 0, 3),
        (CONVERT(VARCHAR(36), NEWID()), 'ProductListFrm', 'API', 'UPDATE', '/API_SanPham_Luu', '', 0, 4),
        (CONVERT(VARCHAR(36), NEWID()), 'ProductListFrm', 'API', 'DELETE', '/API_SanPham_Xoa', '', 0, 5),

        -- Sản phẩm (ItemListFrm) -> SEARCH & DETAIL & SAVE & DELETE
        (CONVERT(VARCHAR(36), NEWID()), 'ItemListFrm',    'API', 'SEARCH', '/API_LaySanPham', '', 0, 1),
        (CONVERT(VARCHAR(36), NEWID()), 'ItemListFrm',    'API', 'DETAIL', '/API_LaySanPham', '', 0, 2),
        (CONVERT(VARCHAR(36), NEWID()), 'ItemListFrm',    'API', 'CREATE', '/API_SanPham_Luu', '', 0, 3),
        (CONVERT(VARCHAR(36), NEWID()), 'ItemListFrm',    'API', 'UPDATE', '/API_SanPham_Luu', '', 0, 4),
        (CONVERT(VARCHAR(36), NEWID()), 'ItemListFrm',    'API', 'DELETE', '/API_SanPham_Xoa', '', 0, 5),

        -- Đơn hàng -> SEARCH & DETAIL
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_OrderFrm', 'API', 'SEARCH', '/API_DanhMuc?Loai=Order', '', 0, 1),
        (CONVERT(VARCHAR(36), NEWID()), 'OrderListFrm', 'API', 'SEARCH', '/API_DanhMuc?Loai=Order', '', 0, 1),
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_OrderFrm', 'API', 'DETAIL', '/API_DanhMuc?Loai=OrderDetail', '', 0, 2),
        (CONVERT(VARCHAR(36), NEWID()), 'OrderListFrm', 'API', 'DETAIL', '/API_DanhMuc?Loai=OrderDetail', '', 0, 2),

        -- CTKM -> SEARCH & DETAIL
        (CONVERT(VARCHAR(36), NEWID()), 'frmPromotion', 'API', 'SEARCH', '/API_LayKhuyenMai', '', 0, 1),
        (CONVERT(VARCHAR(36), NEWID()), 'CTKMFrm',      'API', 'SEARCH', '/API_LayKhuyenMai', '', 0, 1),
        (CONVERT(VARCHAR(36), NEWID()), 'frmPromotion', 'API', 'CREATE', '/API_Promotion_Luu', '', 0, 2),
        (CONVERT(VARCHAR(36), NEWID()), 'CTKMFrm',      'API', 'CREATE', '/API_Promotion_Luu', '', 0, 2),
        (CONVERT(VARCHAR(36), NEWID()), 'frmPromotion', 'API', 'UPDATE', '/API_Promotion_Luu', '', 0, 3),
        (CONVERT(VARCHAR(36), NEWID()), 'CTKMFrm',      'API', 'UPDATE', '/API_Promotion_Luu', '', 0, 3);

    -- 3. CẤU HÌNH DROPDOWN CHUẨN IN SY_FrmDrdwTbl
    DELETE FROM dbo.SY_FrmDrdwTbl WHERE FormID IN ('ObjectListFrm', 'WEB_CustomerFrm', 'frmProduct', 'WEB_ProductFrm', 'ProductListFrm', 'ItemListFrm');

    INSERT INTO dbo.SY_FrmDrdwTbl (UserAutoID, FormID, GridName, ColumnID, ValueColumn, DisplayColumn, [Source], DisableAddNew, Type, KeepValue, IsMultiSelect, IsNotInList, IsDisable, IsReload, Caption)
    VALUES
        -- Dropdowns cho Khách hàng
        (CONVERT(VARCHAR(36), NEWID()), 'ObjectListFrm', '', 'ObjectGroupID', 'ObjectGroupID', 'ObjectGroupName', 'Select * from CF_ObjectGroupTbl', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Nhóm KH'),
        (CONVERT(VARCHAR(36), NEWID()), 'ObjectListFrm', '', 'LocationID',    'LocationID',    'LocationName',    'Select * from CF_LocationTbl',    0, 'Dropdown', 0, 0, 0, 0, 0, N'Tỉnh / Thành'),
        (CONVERT(VARCHAR(36), NEWID()), 'ObjectListFrm', '', 'EmployeeID',    'EmployeeID',    'EmployeeName',    'Select EmployeeID, EmployeeName From CF_EmployeeTbl', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Nhân viên'),
        (CONVERT(VARCHAR(36), NEWID()), 'ObjectListFrm', '', 'BranchID',      'BranchID',      'BranchName',      'Select * from CF_BranchTbl where isDisable = 0', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Chi nhánh'),
        (CONVERT(VARCHAR(36), NEWID()), 'ObjectListFrm', '', 'PaymentTypeID', 'PaymentTypeID', 'PaymentTypeName', 'Select * from CF_PaymentTypeTbl', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Hình thức thanh toán'),
        (CONVERT(VARCHAR(36), NEWID()), 'ObjectListFrm', '', 'PaymentTermID', 'PaymentTermID', 'PaymentTermName', 'Select * from CF_PaymentTermTbl', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Hạn mức TT'),

        (CONVERT(VARCHAR(36), NEWID()), 'WEB_CustomerFrm', '', 'ObjectGroupID', 'ObjectGroupID', 'ObjectGroupName', 'Select * from CF_ObjectGroupTbl', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Nhóm KH'),
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_CustomerFrm', '', 'LocationID',    'LocationID',    'LocationName',    'Select * from CF_LocationTbl',    0, 'Dropdown', 0, 0, 0, 0, 0, N'Tỉnh / Thành'),
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_CustomerFrm', '', 'EmployeeID',    'EmployeeID',    'EmployeeName',    'Select EmployeeID, EmployeeName From CF_EmployeeTbl', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Nhân viên'),
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_CustomerFrm', '', 'BranchID',      'BranchID',      'BranchName',      'Select * from CF_BranchTbl where isDisable = 0', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Chi nhánh'),
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_CustomerFrm', '', 'PaymentTypeID', 'PaymentTypeID', 'PaymentTypeName', 'Select * from CF_PaymentTypeTbl', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Hình thức thanh toán'),
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_CustomerFrm', '', 'PaymentTermID', 'PaymentTermID', 'PaymentTermName', 'Select * from CF_PaymentTermTbl', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Hạn mức TT'),

        -- Dropdowns cho Sản phẩm (đăng ký đầy đủ cho cả 4 FormID, hỗ trợ đầy đủ các trường mới)
        (CONVERT(VARCHAR(36), NEWID()), 'frmProduct', '', 'CategoryID',  'CategoryID', 'CategoryName', 'Select CategoryID, CategoryName From CF_CategoryTbl', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Nhóm sản phẩm'),
        (CONVERT(VARCHAR(36), NEWID()), 'frmProduct', '', 'MauSac',      'MauSac',     'MauSacName',   'Select Distinct MauSac, MauSac AS MauSacName From CF_ItemTbl', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Màu sắc'),
        (CONVERT(VARCHAR(36), NEWID()), 'frmProduct', '', 'Size',        'NhomSize',   'NhomSizeName', 'Select Distinct NhomSize, NhomSize AS NhomSizeName From CF_NhomSizeTbl', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Size / Kích cỡ'),
        (CONVERT(VARCHAR(36), NEWID()), 'frmProduct', '', 'Unit',        'Unit',       'Unit',         N'Chiếc;Bộ;Cái;Hộp;Lô;Đôi', 0, 'ValueList', 0, 0, 0, 0, 0, N'ĐVT'),
        (CONVERT(VARCHAR(36), NEWID()), 'frmProduct', '', 'Form',        'id',         'name',         'Select Distinct Form AS id, Form AS name From CF_TenHang2Tbl Where Form IS NOT NULL AND Form <> N''''', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Form dáng'),
        (CONVERT(VARCHAR(36), NEWID()), 'frmProduct', '', 'Design',      'id',         'name',         'Select Distinct Design AS id, Design AS name From CF_TenHang2Tbl Where Design IS NOT NULL AND Design <> N''''', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Thiết kế'),

        (CONVERT(VARCHAR(36), NEWID()), 'WEB_ProductFrm', '', 'CategoryID',  'CategoryID', 'CategoryName', 'Select CategoryID, CategoryName From CF_CategoryTbl', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Nhóm sản phẩm'),
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_ProductFrm', '', 'MauSac',      'MauSac',     'MauSacName',   'Select Distinct MauSac, MauSac AS MauSacName From CF_ItemTbl', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Màu sắc'),
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_ProductFrm', '', 'Size',        'NhomSize',   'NhomSizeName', 'Select Distinct NhomSize, NhomSize AS NhomSizeName From CF_NhomSizeTbl', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Size / Kích cỡ'),
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_ProductFrm', '', 'Unit',        'Unit',       'Unit',         N'Chiếc;Bộ;Cái;Hộp;Lô;Đôi', 0, 'ValueList', 0, 0, 0, 0, 0, N'ĐVT'),
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_ProductFrm', '', 'Form',        'id',         'name',         'Select Distinct Form AS id, Form AS name From CF_TenHang2Tbl Where Form IS NOT NULL AND Form <> N''''', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Form dáng'),
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_ProductFrm', '', 'Design',      'id',         'name',         'Select Distinct Design AS id, Design AS name From CF_TenHang2Tbl Where Design IS NOT NULL AND Design <> N''''', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Thiết kế'),

        (CONVERT(VARCHAR(36), NEWID()), 'ProductListFrm', '', 'CategoryID',  'CategoryID', 'CategoryName', 'Select CategoryID, CategoryName From CF_CategoryTbl', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Nhóm sản phẩm'),
        (CONVERT(VARCHAR(36), NEWID()), 'ProductListFrm', '', 'MauSac',      'MauSac',     'MauSacName',   'Select Distinct MauSac, MauSac AS MauSacName From CF_ItemTbl', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Màu sắc'),
        (CONVERT(VARCHAR(36), NEWID()), 'ProductListFrm', '', 'Size',        'NhomSize',   'NhomSizeName', 'Select Distinct NhomSize, NhomSize AS NhomSizeName From CF_NhomSizeTbl', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Size / Kích cỡ'),
        (CONVERT(VARCHAR(36), NEWID()), 'ProductListFrm', '', 'Unit',        'Unit',       'Unit',         N'Chiếc;Bộ;Cái;Hộp;Lô;Đôi', 0, 'ValueList', 0, 0, 0, 0, 0, N'ĐVT'),
        (CONVERT(VARCHAR(36), NEWID()), 'ProductListFrm', '', 'Form',        'id',         'name',         'Select Distinct Form AS id, Form AS name From CF_TenHang2Tbl Where Form IS NOT NULL AND Form <> N''''', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Form dáng'),
        (CONVERT(VARCHAR(36), NEWID()), 'ProductListFrm', '', 'Design',      'id',         'name',         'Select Distinct Design AS id, Design AS name From CF_TenHang2Tbl Where Design IS NOT NULL AND Design <> N''''', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Thiết kế'),

        (CONVERT(VARCHAR(36), NEWID()), 'ItemListFrm', '', 'CategoryID',  'CategoryID', 'CategoryName', 'Select CategoryID, CategoryName From CF_CategoryTbl', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Nhóm sản phẩm'),
        (CONVERT(VARCHAR(36), NEWID()), 'ItemListFrm', '', 'MauSac',      'MauSac',     'MauSacName',   'Select Distinct MauSac, MauSac AS MauSacName From CF_ItemTbl', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Màu sắc'),
        (CONVERT(VARCHAR(36), NEWID()), 'ItemListFrm', '', 'Size',        'NhomSize',   'NhomSizeName', 'Select Distinct NhomSize, NhomSize AS NhomSizeName From CF_NhomSizeTbl', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Size / Kích cỡ'),
        (CONVERT(VARCHAR(36), NEWID()), 'ItemListFrm', '', 'Unit',        'Unit',       'Unit',         N'Chiếc;Bộ;Cái;Hộp;Lô;Đôi', 0, 'ValueList', 0, 0, 0, 0, 0, N'ĐVT'),
        (CONVERT(VARCHAR(36), NEWID()), 'ItemListFrm', '', 'Form',        'id',         'name',         'Select Distinct Form AS id, Form AS name From CF_TenHang2Tbl Where Form IS NOT NULL AND Form <> N''''', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Form dáng'),
        (CONVERT(VARCHAR(36), NEWID()), 'ItemListFrm', '', 'Design',      'id',         'name',         'Select Distinct Design AS id, Design AS name From CF_TenHang2Tbl Where Design IS NOT NULL AND Design <> N''''', 0, 'Dropdown', 0, 0, 0, 0, 0, N'Thiết kế');

    COMMIT TRANSACTION;
    PRINT N'=== ĐÃ ĐỒNG BỘ TOÀN DIỆN CẤU HÌNH SẢN PHẨM THÀNH CÔNG ===';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;
GO
