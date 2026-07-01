-- =============================================
-- Author:      Antigravity
-- Create date: 2026-07-01
-- Description: Script tạo lại bảng WEB_OrderTbl (Bảng Header Đơn Hàng)
-- =============================================

-- Drop Detail table first if it exists to avoid Foreign Key constraint issues
IF OBJECT_ID('[dbo].[WEB_OrderDetailTbl]', 'U') IS NOT NULL
BEGIN
    DROP TABLE [dbo].[WEB_OrderDetailTbl];
END

-- Drop Header table if it exists
IF OBJECT_ID('[dbo].[WEB_OrderTbl]', 'U') IS NOT NULL
BEGIN
    DROP TABLE [dbo].[WEB_OrderTbl];
END

CREATE TABLE [dbo].[WEB_OrderTbl] (
    [DocumentID]      NVARCHAR(50)    NOT NULL,
    [DocumentDate]    DATETIME        NULL,
    [BranchID]        NVARCHAR(50)    NULL,
    [BaseTotal]       DECIMAL(18, 2)  NULL,
    [KhachDua]        DECIMAL(18, 2)  NULL,
    [TraLai]          DECIMAL(18, 2)  NULL,
    [ObjectID]        NVARCHAR(50)    NULL,
    [ObjectName]      NVARCHAR(255)   NULL,
    [Memo]            NVARCHAR(500)   NULL,
    [Notes]           NVARCHAR(500)   NULL,
    [EmployeeID]      NVARCHAR(50)    NULL,
    [NguoiGiao]       NVARCHAR(255)   NULL,
    [PTGiaoHang]      NVARCHAR(100)   NULL,
    [NguonDon]        NVARCHAR(50)    NULL,
    [MaDaiLy]         NVARCHAR(50)    NULL,
    [CTKM]            NVARCHAR(50)    NULL,
    [PaymentTypeID]   NVARCHAR(50)    NULL,
    [PaymentTermID]   NVARCHAR(50)    NULL,
    [NgayThanhToan]   DATETIME        NULL,
    [UserCreate]      NVARCHAR(50)    NULL,
    [DateCreate]      DATETIME        NULL DEFAULT GETDATE(),
    [isLock]          BIT             NULL DEFAULT 0,
    [isBanSi]         BIT             NULL DEFAULT 1,
    
    CONSTRAINT [PK_WEB_OrderTbl] PRIMARY KEY CLUSTERED ([DocumentID] ASC)
);
GO
