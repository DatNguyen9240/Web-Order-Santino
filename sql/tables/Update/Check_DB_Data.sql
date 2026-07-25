-- =========================================================================
-- SCRIPT KIỂM TRA DỮ LIỆU CSDL LIÊN QUAN ĐẾN PHIẾU BÁN HÀNG (POS)
-- Chạy các lệnh này trong SSMS để xem trạng thái hiện tại của CSDL.
-- =========================================================================

-- 1. Kiểm tra cấu hình Menu (WA_Menu)
-- Xem xem Menu "Phiếu bán hàng" (5030) đã tồn tại chưa và các menu cùng cấp
PRINT '=== 1. DANH SÁCH MENU CON CỦA NHÓM 50 (ĐẶT HÀNG & LỊCH SỬ) ===';
SELECT [MenuID], [Parent], [VN], [EN], [IconClass], [FormName], [URLPara], [isDisable]
FROM [dbo].[WA_Menu]
WHERE [Parent] = '50' OR [MenuID] = '5030'
ORDER BY [MenuID] ASC;


-- 2. Kiểm tra cấu hình biểu mẫu tổng quát (SY_FrmLstTbl)
-- Xem định nghĩa bảng chính, khóa chính, và các cột hiển thị/khóa cho biểu mẫu WEB_OrderFrm
PRINT '=== 2. CẤU HÌNH BIỂU MẪU WEB_OrderFrm ===';
SELECT [FormID], [CaptionVN], [TableName], [PrimaryKey], [HideColumnArr], [AddNewColumnArr], [EditorColumnArr], [LockColumnArr]
FROM [dbo].[SY_FrmLstTbl]
WHERE [FormID] = 'WEB_OrderFrm';


-- 3. Kiểm tra danh sách Dropdown từ điển động (SY_FrmDrdwTbl)
-- Xem các dropdown (Khách hàng, Chi nhánh, NV kinh doanh...) liên kết với API nào
PRINT '=== 3. CẤU HÌNH DROPDOWN DỮ LIỆU ĐỘNG CỦA WEB_OrderFrm ===';
SELECT [FormID], [ColumnID], [Caption], [Source], [ValueColumn], [DisplayColumn], [Type]
FROM [dbo].[SY_FrmDrdwTbl]
WHERE [FormID] = 'WEB_OrderFrm'
ORDER BY [ColumnID] ASC;


-- 4. Kiểm tra nhãn và định dạng hiển thị trường (SY_FmtFldTbl)
-- Xem các trường tiền tệ, ngày tháng được cấu hình định dạng thế nào
PRINT '=== 4. CAPTION VÀ FORMAT CỦA CÁC TRƯỜNG LIÊN QUAN ===';
SELECT [FieldName], [CaptionVN], [FormatID]
FROM [dbo].[SY_FmtFldTbl]
WHERE [FieldName] IN (
    'DocumentID', 'DocumentDate', 'BranchID', 'ObjectID', 'ObjectName', 
    'EmployeeID', 'BaseTotal', 'KhachDua', 'TraLai', 'Memo', 'Notes', 'CTKM'
)
ORDER BY [FieldName] ASC;


-- 5. Kiểm tra dữ liệu đơn hàng hiện có (WEB_OrderTbl)
-- Xem số lượng bản ghi đơn hàng đang lưu trữ và 5 bản ghi mới nhất
PRINT '=== 5. THÔNG TIN ĐƠN HÀNG HIỆN CÓ ===';
SELECT COUNT(*) AS [TongSoDonHang] FROM [dbo].[WEB_OrderTbl];

SELECT TOP 5 [DocumentID], [DocumentDate], [BranchID], [BaseTotal], [KhachDua], [TraLai], [ObjectName], [DateCreate]
FROM [dbo].[WEB_OrderTbl]
ORDER BY [DateCreate] DESC;
