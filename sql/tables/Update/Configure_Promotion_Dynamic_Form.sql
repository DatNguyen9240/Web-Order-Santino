-- Cấu hình Metadata tiếng Việt & Cột hiển thị cho form Chương trình khuyến mại (frmPromotion).
SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    DECLARE @FormID VARCHAR(100) = 'frmPromotion';

    -- 1. CẤU HÌNH TỔNG QUAN HÌNH THỨC CỘT VÀ MẶC ĐỊNH
    UPDATE dbo.SY_FrmLstTbl
    SET TableName = 'dbo.CF_CTKMTbl',
        PrimaryKey = 'CTKM',
        DefaultColumnArr = 'CTKM;ChietKhau;Memo;TyLeDoi;TyLeDoiTrongVu;NgayBatDau;NgayKetThuc;ChiTieu;NhomCTKM;IsHTLCu',
        HideColumnArr = 'UserAutoID'
    WHERE FormID = @FormID;

    -- 2. THÊM TIÊU ĐỀ TIẾNG VIỆT CHUẨN CHO TRANG CTKM VÀO SY_FmtFldTbl
    DELETE FROM dbo.SY_FmtFldTbl WHERE FormName = @FormID;

    INSERT INTO dbo.SY_FmtFldTbl (FormatID, FieldName, FormName, CaptionVN, AlignX, MinWidth, MaxWidth)
    VALUES
        ('Z', 'CTKM',            @FormID, N'Mã CTKM',                'L', 130, 300),
        ('Z', 'ChietKhau',       @FormID, N'Chiết khấu (%)',         'R', 120, 200),
        ('Z', 'Memo',            @FormID, N'Ghi chú / Diễn giải',    'L', 220, 500),
        ('Z', 'TyLeDoi',         @FormID, N'Tỷ lệ đổi (%)',          'R', 110, 200),
        ('Z', 'TyLeDoiTrongVu',   @FormID, N'Tỷ lệ đổi trong vụ (%)', 'R', 140, 200),
        ('D', 'NgayBatDau',      @FormID, N'Ngày bắt đầu',           'C', 120, 200),
        ('D', 'NgayKetThuc',     @FormID, N'Ngày kết thúc',          'C', 120, 200),
        ('Z', 'ChiTieu',         @FormID, N'Chỉ tiêu doanh số',      'R', 140, 250),
        ('Z', 'NhomCTKM',        @FormID, N'Nhóm CTKM',              'L', 130, 250),
        ('Z', 'IsHTLCu',         @FormID, N'Hỗ trợ mùa cũ',          'C', 110, 200);

    -- 3. BẢO TỒN CÁC ACTION APIS CHO WEB
    DECLARE @Actions TABLE ([Action] VARCHAR(20) PRIMARY KEY, [Source] NVARCHAR(400) NOT NULL, Oderby INT NOT NULL);
    INSERT INTO @Actions ([Action], [Source], Oderby)
    VALUES
        ('SEARCH', N'/API_LayKhuyenMai', 10),
        ('CREATE', N'/API_Promotion_Luu', 20),
        ('UPDATE', N'/API_Promotion_Luu', 30),
        ('DELETE', N'/API_XoaDuLieuChung', 40);

    UPDATE existing
    SET existing.[Source] = a.[Source], existing.IsDisable = 0, existing.Oderby = a.Oderby
    FROM dbo.SY_FrmMstActTbl existing
    INNER JOIN @Actions a ON a.[Action] = existing.[Action]
    WHERE existing.FormID = @FormID AND existing.MaterAction = 'API';

    INSERT INTO dbo.SY_FrmMstActTbl (UserAutoID, FormID, MaterAction, [Action], [Source], ColumnID, IsDisable, Oderby)
    SELECT CONVERT(VARCHAR(36), NEWID()), @FormID, 'API', a.[Action], a.[Source], '', 0, a.Oderby
    FROM @Actions a
    WHERE NOT EXISTS (
        SELECT 1 FROM dbo.SY_FrmMstActTbl WHERE FormID = @FormID AND MaterAction = 'API' AND [Action] = a.[Action]
    );

    COMMIT TRANSACTION;
    PRINT N'=== CẤU HÌNH TIÊU ĐỀ TIẾNG VIỆT CHO FORM CTKM THÀNH CÔNG ===';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;
GO
