IF OBJECT_ID('dbo.API_LayThongTinCongTy', 'P') IS NOT NULL
    DROP PROCEDURE [dbo].[API_LayThongTinCongTy];
GO

-- =============================================
-- Author:      Antigravity
-- Create date: 2026-08-10
-- Description: API Lấy thông tin cấu hình công ty từ SY_Setup
-- =============================================
CREATE PROCEDURE [dbo].[API_LayThongTinCongTy]
    @q NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Trả về 1 dòng chứa đầy đủ các thông tin công ty
    SELECT 
        MAX(CASE WHEN [CodeID] = 'Com1' THEN [CodeValue] END) AS [TenCongTy],
        MAX(CASE WHEN [CodeID] = 'Com2' THEN [CodeValue] END) AS [DiaChi],
        MAX(CASE WHEN [CodeID] = 'Com3' THEN [CodeValue] END) AS [DienThoaiFax],
        MAX(CASE WHEN [CodeID] = 'ComWeb' THEN [CodeValue] END) AS [TenBrandWeb]
    FROM [dbo].[SY_Setup]
    WHERE [CodeID] IN ('Com1', 'Com2', 'Com3', 'ComWeb');
END;
GO
