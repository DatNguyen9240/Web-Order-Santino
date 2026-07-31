-- =========================================================================
-- SCRIPT CẤU HÌNH ĐỒNG BỘ TOÀN BỘ METADATA VÀ API ACTION (SEARCH & DETAIL)
-- (Khách hàng, Sản phẩm, Đơn hàng, Chương trình khuyến mãi)
-- =========================================================================
SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    -- 1. CẤU HÌNH CÁC FORM TRONG SY_FrmLstTbl
    DELETE FROM dbo.SY_FrmLstTbl WHERE FormID IN ('ObjectListFrm', 'WEB_CustomerFrm', 'frmProduct', 'WEB_ProductFrm', 'WEB_OrderFrm', 'OrderListFrm', 'frmPromotion', 'CTKMFrm');

    INSERT INTO dbo.SY_FrmLstTbl (FormID, FormType, CaptionVN, CaptionEN, TableName, PrimaryKey, AddNewColumnArr, EditorColumnArr, DefaultColumnArr, HideColumnArr)
    VALUES 
    ('ObjectListFrm',   'LISTEDIT', N'Danh mục khách hàng', 'Customer List', 'dbo.CF_ObjectTbl', 'ObjectID', 'ObjectName;Phone;Address;ObjectGroupID;LocationID;EmployeeID;BranchID;PaymentTypeID;PaymentTermID;Notes', 'ObjectName;Phone;Address;ObjectGroupID;LocationID;EmployeeID;BranchID;PaymentTypeID;PaymentTermID;Notes', 'ObjectID;ObjectName;Phone;Address;ObjectGroupID;LocationID;EmployeeID;BranchID', 'isWeb'),
    ('WEB_CustomerFrm', 'LISTEDIT', N'Danh mục khách hàng', 'Customer List', 'dbo.CF_ObjectTbl', 'ObjectID', 'ObjectName;Phone;Address;ObjectGroupID;LocationID;EmployeeID;BranchID;PaymentTypeID;PaymentTermID;Notes', 'ObjectName;Phone;Address;ObjectGroupID;LocationID;EmployeeID;BranchID;PaymentTypeID;PaymentTermID;Notes', 'ObjectID;ObjectName;Phone;Address;ObjectGroupID;LocationID;EmployeeID;BranchID', 'isWeb'),

    ('frmProduct',      'LISTEDIT', N'Danh mục sản phẩm', 'Product List', 'dbo.CF_ItemTbl', 'ItemID', 'ItemName;ItemGroupID;UnitID;Price;CostPrice;Size;MauSac;Barcode;Notes', 'ItemName;ItemGroupID;UnitID;Price;CostPrice;Size;MauSac;Barcode;Notes', 'ItemID;ItemName;ItemGroupID;UnitID;Price;CostPrice;Size;MauSac;isDisable', 'UserAutoID'),
    ('WEB_ProductFrm',  'LISTEDIT', N'Danh mục sản phẩm', 'Product List', 'dbo.CF_ItemTbl', 'ItemID', 'ItemName;ItemGroupID;UnitID;Price;CostPrice;Size;MauSac;Barcode;Notes', 'ItemName;ItemGroupID;UnitID;Price;CostPrice;Size;MauSac;Barcode;Notes', 'ItemID;ItemName;ItemGroupID;UnitID;Price;CostPrice;Size;MauSac;isDisable', 'UserAutoID'),

    ('WEB_OrderFrm',  'LISTEDIT', N'Danh sách đơn hàng', 'Order List', 'dbo.WEB_OrderTbl', 'DocumentID', 'DocumentDate;BranchID;ObjectID;ObjectName;EmployeeID;CTKM;BaseTotal;TotalAmount;Notes', 'DocumentDate;BranchID;ObjectID;ObjectName;EmployeeID;CTKM;BaseTotal;TotalAmount;Notes', 'DocumentID;DocumentDate;BranchID;ObjectID;ObjectName;EmployeeID;CTKM;BaseTotal;TotalAmount;Status', 'UserAutoID'),
    ('OrderListFrm',  'LISTEDIT', N'Danh sách đơn hàng', 'Order List', 'dbo.WEB_OrderTbl', 'DocumentID', 'DocumentDate;BranchID;ObjectID;ObjectName;EmployeeID;CTKM;BaseTotal;TotalAmount;Notes', 'DocumentDate;BranchID;ObjectID;ObjectName;EmployeeID;CTKM;BaseTotal;TotalAmount;Notes', 'DocumentID;DocumentDate;BranchID;ObjectID;ObjectName;EmployeeID;CTKM;BaseTotal;TotalAmount;Status', 'UserAutoID'),

    ('frmPromotion', 'LISTEDIT', N'Chương trình khuyến mãi', 'Promotion List', 'dbo.CF_CTKMTbl', 'CTKM', 'ChietKhau;Memo;TyLeDoi;TyLeDoiTrongVu;NgayBatDau;NgayKetThuc;ChiTieu;NhomCTKM;IsHTLCu', 'ChietKhau;Memo;TyLeDoi;TyLeDoiTrongVu;NgayBatDau;NgayKetThuc;ChiTieu;NhomCTKM;IsHTLCu', 'CTKM;ChietKhau;Memo;TyLeDoi;TyLeDoiTrongVu;NgayBatDau;NgayKetThuc;ChiTieu;NhomCTKM;IsHTLCu', 'UserAutoID'),
    ('CTKMFrm',      'LISTEDIT', N'Chương trình khuyến mãi', 'Promotion List', 'dbo.CF_CTKMTbl', 'CTKM', 'ChietKhau;Memo;TyLeDoi;TyLeDoiTrongVu;NgayBatDau;NgayKetThuc;ChiTieu;NhomCTKM;IsHTLCu', 'ChietKhau;Memo;TyLeDoi;TyLeDoiTrongVu;NgayBatDau;NgayKetThuc;ChiTieu;NhomCTKM;IsHTLCu', 'CTKM;ChietKhau;Memo;TyLeDoi;TyLeDoiTrongVu;NgayBatDau;NgayKetThuc;ChiTieu;NhomCTKM;IsHTLCu', 'UserAutoID');

    -- 2. CẤU HÌNH API ACTION ROUTING CHUẨN (BAO GỒM CẢ SEARCH VÀ DETAIL)
    DELETE FROM dbo.SY_FrmMstActTbl WHERE FormID IN ('ObjectListFrm', 'WEB_CustomerFrm', 'frmProduct', 'WEB_ProductFrm', 'WEB_OrderFrm', 'OrderListFrm', 'frmPromotion', 'CTKMFrm');

    INSERT INTO dbo.SY_FrmMstActTbl (UserAutoID, FormID, MaterAction, [Action], [Source], ColumnID, IsDisable, Oderby)
    VALUES
        -- Khách hàng -> SEARCH & DETAIL
        (CONVERT(VARCHAR(36), NEWID()), 'ObjectListFrm',   'API', 'SEARCH', '/API_LayDanhSachKhachHang', '', 0, 1),
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_CustomerFrm', 'API', 'SEARCH', '/API_LayDanhSachKhachHang', '', 0, 1),
        (CONVERT(VARCHAR(36), NEWID()), 'ObjectListFrm',   'API', 'DETAIL', '/API_LayDanhSachKhachHang', '', 0, 2),
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_CustomerFrm', 'API', 'DETAIL', '/API_LayDanhSachKhachHang', '', 0, 2),
        (CONVERT(VARCHAR(36), NEWID()), 'ObjectListFrm',   'API', 'CREATE', '/API_ThemCapNhatKhachHang', '', 0, 3),
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_CustomerFrm', 'API', 'CREATE', '/API_ThemCapNhatKhachHang', '', 0, 3),
        (CONVERT(VARCHAR(36), NEWID()), 'ObjectListFrm',   'API', 'UPDATE', '/API_ThemCapNhatKhachHang', '', 0, 4),
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_CustomerFrm', 'API', 'UPDATE', '/API_ThemCapNhatKhachHang', '', 0, 4),

        -- Sản phẩm -> SEARCH & DETAIL
        (CONVERT(VARCHAR(36), NEWID()), 'frmProduct',     'API', 'SEARCH', '/API_LaySanPham', '', 0, 1),
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_ProductFrm', 'API', 'SEARCH', '/API_LaySanPham', '', 0, 1),
        (CONVERT(VARCHAR(36), NEWID()), 'frmProduct',     'API', 'DETAIL', '/API_LaySanPham', '', 0, 2),
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_ProductFrm', 'API', 'DETAIL', '/API_LaySanPham', '', 0, 2),
        (CONVERT(VARCHAR(36), NEWID()), 'frmProduct',     'API', 'CREATE', '/API_SanPham_Luu', '', 0, 3),
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_ProductFrm', 'API', 'CREATE', '/API_SanPham_Luu', '', 0, 3),

        -- Đơn hàng -> SEARCH & DETAIL (/API_DanhMuc?Loai=OrderDetail)
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_OrderFrm', 'API', 'SEARCH', '/API_DanhMuc?Loai=Order', '', 0, 1),
        (CONVERT(VARCHAR(36), NEWID()), 'OrderListFrm', 'API', 'SEARCH', '/API_DanhMuc?Loai=Order', '', 0, 1),
        (CONVERT(VARCHAR(36), NEWID()), 'WEB_OrderFrm', 'API', 'DETAIL', '/API_DanhMuc?Loai=OrderDetail', '', 0, 2),
        (CONVERT(VARCHAR(36), NEWID()), 'OrderListFrm', 'API', 'DETAIL', '/API_DanhMuc?Loai=OrderDetail', '', 0, 2),

        -- CTKM -> SEARCH dùng SP API_LayKhuyenMai (theo cấu hình gốc)
        (CONVERT(VARCHAR(36), NEWID()), 'frmPromotion', 'API', 'SEARCH', '/API_LayKhuyenMai', '', 0, 1),
        (CONVERT(VARCHAR(36), NEWID()), 'CTKMFrm',      'API', 'SEARCH', '/API_LayKhuyenMai', '', 0, 1),
        (CONVERT(VARCHAR(36), NEWID()), 'frmPromotion', 'API', 'CREATE', '/API_Promotion_Luu', '', 0, 2),
        (CONVERT(VARCHAR(36), NEWID()), 'CTKMFrm',      'API', 'CREATE', '/API_Promotion_Luu', '', 0, 2),
        (CONVERT(VARCHAR(36), NEWID()), 'frmPromotion', 'API', 'UPDATE', '/API_Promotion_Luu', '', 0, 3),
        (CONVERT(VARCHAR(36), NEWID()), 'CTKMFrm',      'API', 'UPDATE', '/API_Promotion_Luu', '', 0, 3);

    COMMIT TRANSACTION;
    PRINT N'=== ĐÃ ĐỒNG BỘ TOÀN BỘ DETAIL API ROUTING THÀNH CÔNG ===';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;
GO
