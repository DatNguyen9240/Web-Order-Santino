-- =============================================
-- Author:      Antigravity
-- Create date: 2026-07-01
-- Description: Script tạo lại bảng WEB_OrderDetailTbl (Bảng Detail Đơn Hàng)
-- =============================================

-- Drop Detail table if it exists
IF OBJECT_ID('[dbo].[WEB_OrderDetailTbl]', 'U') IS NOT NULL
BEGIN
    DROP TABLE [dbo].[WEB_OrderDetailTbl];
END

CREATE TABLE [dbo].[WEB_OrderDetailTbl] (
    [UserAutoID]    UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [DocumentID]    NVARCHAR(50)     NOT NULL,
    [ItemID]        NVARCHAR(50)     NULL,
    [ItemName]      NVARCHAR(255)    NULL,
    [Size]          NVARCHAR(50)     NULL,
    [MauSac]        NVARCHAR(50)     NULL,
    [Quantity]      DECIMAL(18, 2)   NULL,
    [UnitPrice]     DECIMAL(18, 2)   NULL,
    [Amount]        DECIMAL(18, 2)   NULL,
    [TotalAmount]   DECIMAL(18, 2)   NULL,
    [STT]           INT              NULL,
    
    CONSTRAINT [PK_WEB_OrderDetailTbl] PRIMARY KEY CLUSTERED ([UserAutoID] ASC),
    CONSTRAINT [FK_WEB_OrderDetailTbl_WEB_OrderTbl] FOREIGN KEY ([DocumentID]) 
        REFERENCES [dbo].[WEB_OrderTbl] ([DocumentID]) ON DELETE CASCADE
);
GO
