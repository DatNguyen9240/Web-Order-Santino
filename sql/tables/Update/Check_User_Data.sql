-- =========================================================================
-- SCRIPT KIỂM TRA DỮ LIỆU TÀI KHOẢN TRONG DATABASE
-- =========================================================================

SELECT 
    [UserName]      AS [Tên đăng nhập],
    [HoTen]         AS [Họ tên],
    [UserGroupID]   AS [Nhóm quyền],
    [EmployeeID]    AS [Mã nhân viên (EmployeeID)],
    [ObjectID]      AS [Mã khách hàng (ObjectID)],
    CASE WHEN [Disable] = 1 THEN N'Bị khóa' ELSE N'Hoạt động' END AS [Trạng thái]
FROM [dbo].[SY_User]
WHERE [UserName] IN ('admin', 'TESTKETOAN', 'ST09', 'A8172991', 'A2142010');
GO
