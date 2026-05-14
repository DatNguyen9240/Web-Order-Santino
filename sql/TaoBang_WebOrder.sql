-- ========================================================
-- KỊCH BẢN TẠO BẢNG RIÊNG CHO WEB ORDER (Đơn sỉ Ma Trận)
-- Tránh đụng chạm đến bảng OrderTbl cũ của hệ thống.
-- ========================================================

-- 1. TẠO BẢNG HEADER (WEB_OrderTbl)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[WEB_OrderTbl]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[WEB_OrderTbl](
        [DocumentID] [nvarchar](50) NOT NULL PRIMARY KEY,
        [DocumentDate] [datetime] NULL,
        [BranchID] [nvarchar](50) NULL,
        [BaseTotal] [decimal](18, 2) NULL,
        [KhachDua] [decimal](18, 2) NULL,
        [TraLai] [decimal](18, 2) NULL,
        [ObjectID] [nvarchar](50) NULL,
        [ObjectName] [nvarchar](255) NULL,
        [Memo] [nvarchar](max) NULL,
        [Notes] [nvarchar](max) NULL,
        [EmployeeID] [nvarchar](50) NULL,
        [NguoiGiao] [nvarchar](255) NULL,
        [PTGiaoHang] [nvarchar](255) NULL,
        [NguonDon] [nvarchar](255) NULL,
        [MaDaiLy] [nvarchar](50) NULL,
        [CTKM] [nvarchar](255) NULL,
        [PaymentTypeID] [nvarchar](50) NULL,
        [PaymentTermID] [nvarchar](50) NULL,
        [NgayThanhToan] [datetime] NULL,
        [UserCreate] [nvarchar](50) NULL,
        [DateCreate] [datetime] NULL,
        [isLock] [bit] NULL CONSTRAINT [DF_WEB_Order_isLock] DEFAULT ((0)),
        [isBanSi] [bit] NULL CONSTRAINT [DF_WEB_Order_isBanSi] DEFAULT ((1))
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO

-- 2. TẠO BẢNG CHI TIẾT (WEB_OrderDetailTbl)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[WEB_OrderDetailTbl]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[WEB_OrderDetailTbl](
        [UserAutoID] [uniqueidentifier] NOT NULL PRIMARY KEY,
        [DocumentID] [nvarchar](50) NULL,
        [ItemID] [nvarchar](50) NULL,
        [ItemName] [nvarchar](255) NULL,
        [Size] [nvarchar](50) NULL,
        [MauSac] [nvarchar](50) NULL,
        [Quantity] [decimal](18, 2) NULL,
        [UnitPrice] [decimal](18, 2) NULL,
        [Amount] [decimal](18, 2) NULL,
        [TotalAmount] [decimal](18, 2) NULL,
        [STT] [int] NULL
    ) ON [PRIMARY]
END
GO

-- Tạo index cho cột DocumentID trong bảng Chi tiết để tìm kiếm siêu tốc
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_WEB_OrderDetailTbl_DocumentID' AND object_id = OBJECT_ID('dbo.WEB_OrderDetailTbl'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_WEB_OrderDetailTbl_DocumentID] ON [dbo].[WEB_OrderDetailTbl] ([DocumentID] ASC)
END
GO
