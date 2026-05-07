/* --- product_master.js --- */
// Product Master — Tên hàng 2 (nguồn sinh SKU)
// Dữ liệu từ hình 4 requirement
const productMaster = [
  { ten_hang_2:"AMC395M201", nhom_hang:"SKU102", don_gia:395000, design:"M201-Trắng", mau:"M201", form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC395M201", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC525M102", nhom_hang:"SKU102", don_gia:525000, design:"M102", mau:"M102", form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC525M102", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC545S659", nhom_hang:"SKU102", don_gia:545000, design:"S659", mau:"S659", form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC545S659", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC545S660", nhom_hang:"SKU102", don_gia:545000, design:"S660", mau:"S660", form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC545S660", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC545S661", nhom_hang:"SKU102", don_gia:545000, design:"S661", mau:"S661", form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC545S661", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC565S655", nhom_hang:"SKU102", don_gia:565000, design:"S655", mau:"S655", form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC565S655", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC565S656", nhom_hang:"SKU102", don_gia:565000, design:"S656", mau:"S656", form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC565S656", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC565S657", nhom_hang:"SKU102", don_gia:565000, design:"S657", mau:"S657", form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC565S657", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC565S658", nhom_hang:"SKU102", don_gia:565000, design:"S658", mau:"S658", form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC565S658", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC695S810", nhom_hang:"SKU102", don_gia:695000, design:"S810- Kẻ xanh", mau:"S810", form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi: AMC695S810", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC695S811", nhom_hang:"SKU102", don_gia:695000, design:"S811- Kẻ chì", mau:"S811", form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi: AMC695S811", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC695S812", nhom_hang:"SKU102", don_gia:695000, design:"S812-Navy", mau:"S812", form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi: AMC695S812", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC745S750", nhom_hang:"SKU102", don_gia:745000, design:"S750-Kẻ", mau:"S750", form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC745S750", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC745S751", nhom_hang:"SKU102", don_gia:745000, design:"S751-Kẻ", mau:"S751", form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC745S751", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC745S752", nhom_hang:"SKU102", don_gia:745000, design:"S752-Kẻ", mau:"S752", form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC745S752", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC745S753", nhom_hang:"SKU102", don_gia:745000, design:"S753-Kẻ", mau:"S753", form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC745S753", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"AMC745S754", nhom_hang:"SKU102", don_gia:745000, design:"S754-Kẻ", mau:"S754", form:"AMC", ten_form:"Modern Fit", ten_hang_hoa:"Áo sơ mi-AMC745S754", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC355S101", nhom_hang:"SKU102", don_gia:355000, design:"S101", mau:"S101", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơmi: ARC355S101", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC370M101", nhom_hang:"SKU102", don_gia:370000, design:"M101", mau:"M101", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi-ARC370M101", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC380M105", nhom_hang:"SKU102", don_gia:380000, design:"M105", mau:"M105", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi-ARC380M105", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC395M101", nhom_hang:"SKU102", don_gia:395000, design:"M101", mau:"M101", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi -ARC395M101", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC445S537", nhom_hang:"SKU102", don_gia:445000, design:"S537", mau:"S537", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi-ARC445S537", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC445S538", nhom_hang:"SKU102", don_gia:445000, design:"S538", mau:"S538", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi-ARC445S538", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC445S553", nhom_hang:"SKU102", don_gia:445000, design:"S553", mau:"S553", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo Sơ mi-ARC445S553", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC470S391", nhom_hang:"SKU102", don_gia:470000, design:"S391", mau:"S391", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi-ARC470S391", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC470S468", nhom_hang:"SKU102", don_gia:470000, design:"S468", mau:"S468", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi-ARC470S468", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC470S469", nhom_hang:"SKU102", don_gia:470000, design:"S469", mau:"S469", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi-ARC470S469", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC495S560", nhom_hang:"SKU102", don_gia:495000, design:"S560", mau:"S560", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi-ARC495S560", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC495S605", nhom_hang:"SKU102", don_gia:495000, design:"S605", mau:"S605", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi -ARC495S605", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC495S606", nhom_hang:"SKU102", don_gia:495000, design:"S606", mau:"S606", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi -ARC495S606", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC525M102", nhom_hang:"SKU102", don_gia:525000, design:"M102-Trắng", mau:"M102", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi-ARC525M102", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC525S599", nhom_hang:"SKU102", don_gia:525000, design:"S599", mau:"S599", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi -ARC525S599", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC525S600", nhom_hang:"SKU102", don_gia:525000, design:"S600", mau:"S600", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi -ARC525S600", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC545S602", nhom_hang:"SKU102", don_gia:545000, design:"S602", mau:"S602", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi -ARC545S602", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC545S604", nhom_hang:"SKU102", don_gia:545000, design:"S604", mau:"S604", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi -ARC545S604", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC545S845", nhom_hang:"SKU102", don_gia:545000, design:"S845-HT nâu", mau:"S845", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi:ARC545S845", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC545S846", nhom_hang:"SKU102", don_gia:545000, design:"S846-HT xanh", mau:"S846", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi:ARC545S846", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC585S725", nhom_hang:"SKU102", don_gia:585000, design:"S725-Kẻ xanh", mau:"S725", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi -ARC585S725", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC585S726", nhom_hang:"SKU102", don_gia:585000, design:"S726-Kẻ xanh", mau:"S726", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi -ARC585S726", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC585S727", nhom_hang:"SKU102", don_gia:585000, design:"S727-Kẻ ghi", mau:"S727", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi -ARC585S727", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC585S728", nhom_hang:"SKU102", don_gia:585000, design:"S728-Kẻ xanh", mau:"S728", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi -ARC585S728", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC585S729", nhom_hang:"SKU102", don_gia:585000, design:"S729-Kẻ xanh", mau:"S729", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi -ARC585S729", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC585S730", nhom_hang:"SKU102", don_gia:585000, design:"S730-HT xanh", mau:"S730", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi -ARC585S730", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC585S731", nhom_hang:"SKU102", don_gia:585000, design:"S731-Trắng HT nâu", mau:"S731", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi -ARC585S731", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC585S732", nhom_hang:"SKU102", don_gia:585000, design:"S732-Trắng HT xanh", mau:"S732", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi -ARC585S732", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC585S733", nhom_hang:"SKU102", don_gia:585000, design:"S733-Trắng HT xanh", mau:"S733", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi -ARC585S733", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC585S734", nhom_hang:"SKU102", don_gia:585000, design:"S734-Trắng HT đen", mau:"S734", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi -ARC585S734", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC585S735", nhom_hang:"SKU102", don_gia:585000, design:"S735-Trắng HT", mau:"S735", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi -ARC585S735", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC585S736", nhom_hang:"SKU102", don_gia:585000, design:"S736-Trắng HT", mau:"S736", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi -ARC585S736", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC585S737", nhom_hang:"SKU102", don_gia:585000, design:"S737-Trắng HT", mau:"S737", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi -ARC585S737", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC585S738", nhom_hang:"SKU102", don_gia:585000, design:"S738-Trắng HT", mau:"S738", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi -ARC585S738", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC585S739", nhom_hang:"SKU102", don_gia:585000, design:"S739-Trắng HT", mau:"S739", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi -ARC585S739", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC585S740", nhom_hang:"SKU102", don_gia:585000, design:"S740-HT xanh", mau:"S740", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi -ARC585S740", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC595S835", nhom_hang:"SKU102", don_gia:595000, design:"S835-Kẻ xanh", mau:"S835", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi:ARC595S835", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC595S836", nhom_hang:"SKU102", don_gia:595000, design:"S836-Kẻ xanh", mau:"S836", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi:ARC595S836", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC595S837", nhom_hang:"SKU102", don_gia:595000, design:"S837-Xanh nhạt", mau:"S837", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi:ARC595S837", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC595S838", nhom_hang:"SKU102", don_gia:595000, design:"S838-Xanh đậm", mau:"S838", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi:ARC595S838", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ARC595S839", nhom_hang:"SKU102", don_gia:595000, design:"S839-Kẻ ghi", mau:"S839", form:"ARC", ten_form:"Regular", ten_hang_hoa:"Áo sơ mi:ARC595S839", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASC355S101", nhom_hang:"SKU102", don_gia:355000, design:"S101", mau:"S101", form:"ASC", ten_form:"Slim Fit", ten_hang_hoa:"ÁO SƠMI: ASC355S101", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASC370M101", nhom_hang:"SKU102", don_gia:370000, design:"M101", mau:"M101", form:"ASC", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASC370M101", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASC370S014", nhom_hang:"SKU102", don_gia:370000, design:"S014", mau:"S014", form:"ASC", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASC370S014", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASC370S140", nhom_hang:"SKU102", don_gia:370000, design:"S140", mau:"S140", form:"ASC", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASC370S140", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASC380M103", nhom_hang:"SKU102", don_gia:380000, design:"M103", mau:"M103", form:"ASC", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASC380M103", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASC380S001", nhom_hang:"SKU102", don_gia:380000, design:"S001", mau:"S001", form:"ASC", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơmi-ASC380S001", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASC385S360", nhom_hang:"SKU102", don_gia:385000, design:"S360", mau:"S360", form:"ASC", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASC385S360", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASC395M101", nhom_hang:"SKU102", don_gia:395000, design:"M101", mau:"M101", form:"ASC", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi -ASC395M101", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASC435S533", nhom_hang:"SKU102", don_gia:435000, design:"S533", mau:"S533", form:"ASC", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASC435S533", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASC465S539", nhom_hang:"SKU102", don_gia:465000, design:"S539", mau:"S539", form:"ASC", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASC465S539", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASC470S467", nhom_hang:"SKU102", don_gia:470000, design:"S467", mau:"S467", form:"ASC", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASC470S467", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASC480S123", nhom_hang:"SKU102", don_gia:480000, design:"S123", mau:"S123", form:"ASC", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi: ASC480S123", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASC495S514", nhom_hang:"SKU102", don_gia:495000, design:"S514", mau:"S514", form:"ASC", ten_form:"Slim Fit", ten_hang_hoa:"Áo Sơ mi: ASC495S514", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN395M201", nhom_hang:"SKU102", don_gia:395000, design:"M201-Trắng", mau:"M201", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN395M201", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN465S264", nhom_hang:"SKU102", don_gia:465000, design:"S264", mau:"S264", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN465S264", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN465S581", nhom_hang:"SKU102", don_gia:465000, design:"S581", mau:"S581", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo Sơ mi-ASN465S581", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN465S582", nhom_hang:"SKU102", don_gia:465000, design:"S582", mau:"S582", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN465S582", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN485S512", nhom_hang:"SKU102", don_gia:485000, design:"S512", mau:"S512", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN485S512", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN485S513", nhom_hang:"SKU102", don_gia:485000, design:"S513", mau:"S513", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN485S513", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN495M211", nhom_hang:"SKU102", don_gia:495000, design:"M211-Trắng", mau:"M211", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN495M211", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN495M212", nhom_hang:"SKU102", don_gia:495000, design:"M212-Trắng", mau:"M212", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN495M212", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN495M213", nhom_hang:"SKU102", don_gia:495000, design:"M213-Xanh", mau:"M213", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN495M213", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN495M214", nhom_hang:"SKU102", don_gia:495000, design:"M214-Ghi xám", mau:"M214", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN495M214", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN495M215", nhom_hang:"SKU102", don_gia:495000, design:"M215-Navy", mau:"M215", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN495M215", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN495M216", nhom_hang:"SKU102", don_gia:495000, design:"M216-Ghi đậm", mau:"M216", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN495M216", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN495M217", nhom_hang:"SKU102", don_gia:495000, design:"M217-Xanh", mau:"M217", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN495M217", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN495M218", nhom_hang:"SKU102", don_gia:495000, design:"M218-Xanh", mau:"M218", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN495M218", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN495S596", nhom_hang:"SKU102", don_gia:495000, design:"S596", mau:"S596", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi - ASN495S596", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN495S601", nhom_hang:"SKU102", don_gia:495000, design:"S601", mau:"S601", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi - ASN495S601", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN495S607", nhom_hang:"SKU102", don_gia:495000, design:"S607", mau:"S607", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN495S607", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN495S608", nhom_hang:"SKU102", don_gia:495000, design:"S608", mau:"S608", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi -ASN495S608", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN495S609", nhom_hang:"SKU102", don_gia:495000, design:"S609", mau:"S609", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi -ASN495S609", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN525M102", nhom_hang:"SKU102", don_gia:525000, design:"0", mau:"M102", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi: ASN525M102", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN525S547", nhom_hang:"SKU102", don_gia:525000, design:"S547", mau:"S547", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi -ASN525S547", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN525S551", nhom_hang:"SKU102", don_gia:525000, design:"S551", mau:"S551", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi -ASN525S551", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN525S552", nhom_hang:"SKU102", don_gia:525000, design:"S552", mau:"S552", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi -ASN525S552", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN525S598", nhom_hang:"SKU102", don_gia:525000, design:"S598", mau:"S598", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi - ASN525S598", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN525S603", nhom_hang:"SKU102", don_gia:525000, design:"S603", mau:"S603", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi - ASN525S603", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN525S610", nhom_hang:"SKU102", don_gia:525000, design:"S610", mau:"S610", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN525S610", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN525S611", nhom_hang:"SKU102", don_gia:525000, design:"S611", mau:"S611", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN525S611", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN525S612", nhom_hang:"SKU102", don_gia:525000, design:"S612", mau:"S612", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN525S612", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN525S613", nhom_hang:"SKU102", don_gia:525000, design:"S613", mau:"S613", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN525S613", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN525S614", nhom_hang:"SKU102", don_gia:525000, design:"S614", mau:"S614", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN525S614", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN525S615", nhom_hang:"SKU102", don_gia:525000, design:"S615", mau:"S615", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN525S615", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN525S616", nhom_hang:"SKU102", don_gia:525000, design:"S616", mau:"S616", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN525S616", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN525S617", nhom_hang:"SKU102", don_gia:525000, design:"S617", mau:"S617", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN525S617", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN525S618", nhom_hang:"SKU102", don_gia:525000, design:"S618", mau:"S618", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN525S618", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN525S619", nhom_hang:"SKU102", don_gia:525000, design:"S619", mau:"S619", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN525S619", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN525S620", nhom_hang:"SKU102", don_gia:525000, design:"S620", mau:"S620", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN525S620", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN525S621", nhom_hang:"SKU102", don_gia:525000, design:"S621", mau:"S621", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN525S621", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN525S622", nhom_hang:"SKU102", don_gia:525000, design:"S622", mau:"S622", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN525S622", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN545S662", nhom_hang:"SKU102", don_gia:545000, design:"S662", mau:"S662", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN545S662", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN545S663", nhom_hang:"SKU102", don_gia:545000, design:"S663", mau:"S663", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN545S663", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN545S665", nhom_hang:"SKU102", don_gia:545000, design:"S665", mau:"S665", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN545S665", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN545S707", nhom_hang:"SKU102", don_gia:545000, design:"S707-Trắng HT", mau:"S707", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi: ASN545S707", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN545S708", nhom_hang:"SKU102", don_gia:545000, design:"S708-Trắng HT", mau:"S708", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi: ASN545S708", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN545S709", nhom_hang:"SKU102", don_gia:545000, design:"S709-Trắng HT", mau:"S709", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi: ASN545S709", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN545S710", nhom_hang:"SKU102", don_gia:545000, design:"S710-Trắng HT", mau:"S710", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi: ASN545S710", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN545S711", nhom_hang:"SKU102", don_gia:545000, design:"S711-Trắng HT", mau:"S711", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi: ASN545S711", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN545S712", nhom_hang:"SKU102", don_gia:545000, design:"S712-Xanh", mau:"S712", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi: ASN545S712", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN585S702", nhom_hang:"SKU102", don_gia:585000, design:"S702-Kẻ xanh", mau:"S702", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi:ASN585S702", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN585S703", nhom_hang:"SKU102", don_gia:585000, design:"S703-Kẻ lam", mau:"S703", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi:ASN585S703", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN585S704", nhom_hang:"SKU102", don_gia:585000, design:"S704-Ô Xanh", mau:"S704", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi:ASN585S704", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN585S705", nhom_hang:"SKU102", don_gia:585000, design:"S705-Ô ghi sáng", mau:"S705", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi:ASN585S705", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN585S706", nhom_hang:"SKU102", don_gia:585000, design:"S706-Nâu be", mau:"S706", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi:ASN585S706", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN585S782", nhom_hang:"SKU102", don_gia:585000, design:"S782-Xanh", mau:"S782", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi: ASN585S782", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN585S783", nhom_hang:"SKU102", don_gia:585000, design:"S783-HT Xanh", mau:"S783", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi: ASN585S783", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN585S784", nhom_hang:"SKU102", don_gia:585000, design:"S784-HT Ghi", mau:"S784", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi: ASN585S784", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN585S785", nhom_hang:"SKU102", don_gia:585000, design:"S785-Xanh pastel", mau:"S785", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi: ASN585S785", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN585S786", nhom_hang:"SKU102", don_gia:585000, design:"S786-Xanh biển", mau:"S786", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi: ASN585S786", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN585S787", nhom_hang:"SKU102", don_gia:585000, design:"S787-HT Chấm bi", mau:"S787", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi: ASN585S787", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN595S676", nhom_hang:"SKU102", don_gia:595000, design:"S676-Kẻ ô", mau:"S676", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi -ASN595S676", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN595S677", nhom_hang:"SKU102", don_gia:595000, design:"S677-Kẻ ô", mau:"S677", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi -ASN595S677", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN595S678", nhom_hang:"SKU102", don_gia:595000, design:"S678-Họa tiết", mau:"S678", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi -ASN595S678", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN595S679", nhom_hang:"SKU102", don_gia:595000, design:"S679-Ca rô", mau:"S679", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi -ASN595S679", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN595S680", nhom_hang:"SKU102", don_gia:595000, design:"S680- Ô tím than", mau:"S680", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi -ASN595S680", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN595S681", nhom_hang:"SKU102", don_gia:595000, design:"S681- Kẻ ô", mau:"S681", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi -ASN595S681", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN625S623", nhom_hang:"SKU102", don_gia:625000, design:"S623", mau:"S623", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN625S623", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN625S624", nhom_hang:"SKU102", don_gia:625000, design:"S624", mau:"S624", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN625S624", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN625S625", nhom_hang:"SKU102", don_gia:625000, design:"S625", mau:"S625", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN625S625", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN625S626", nhom_hang:"SKU102", don_gia:625000, design:"S626", mau:"S626", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN625S626", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN625S627", nhom_hang:"SKU102", don_gia:625000, design:"S627", mau:"S627", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN625S627", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN625S716", nhom_hang:"SKU102", don_gia:625000, design:"S716-Trắng-HT", mau:"S716", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi: ASN625S716", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN625S717", nhom_hang:"SKU102", don_gia:625000, design:"S717-Trắng-HT", mau:"S717", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi: ASN625S717", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN625S718", nhom_hang:"SKU102", don_gia:625000, design:"S718-Trắng-HT", mau:"S718", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi: ASN625S718", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN625S719", nhom_hang:"SKU102", don_gia:625000, design:"S719-Trắng-HT", mau:"S719", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi: ASN625S719", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN625S720", nhom_hang:"SKU102", don_gia:625000, design:"S720-Trắng-HT", mau:"S720", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi: ASN625S720", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN625S721", nhom_hang:"SKU102", don_gia:625000, design:"S721-Trắng-HT", mau:"S721", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi: ASN625S721", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN625S806", nhom_hang:"SKU102", don_gia:625000, design:"S806-Kẻ xanh", mau:"S806", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi:ASN625S806", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN625S807", nhom_hang:"SKU102", don_gia:625000, design:"S807-Kẻ ghi", mau:"S807", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi:ASN625S807", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN625S808", nhom_hang:"SKU102", don_gia:625000, design:"S808-Kẻ xanh", mau:"S808", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi:ASN625S808", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN625S809", nhom_hang:"SKU102", don_gia:625000, design:"S809-Trắng kẻ", mau:"S809", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi:ASN625S809", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN645S722", nhom_hang:"SKU102", don_gia:645000, design:"S722-Trắng", mau:"S722", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi: ASN645S722", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN645S723", nhom_hang:"SKU102", don_gia:645000, design:"S723-Xanh", mau:"S723", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi: ASN645S723", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN645S724", nhom_hang:"SKU102", don_gia:645000, design:"S724-Xanh", mau:"S724", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi: ASN645S724", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN645S741", nhom_hang:"SKU102", don_gia:645000, design:"S741-Kẻ xanh", mau:"S741", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN645S741", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN645S742", nhom_hang:"SKU102", don_gia:645000, design:"S742-Kẻ ghi", mau:"S742", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN645S742", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN685S699", nhom_hang:"SKU102", don_gia:685000, design:"S699-Kẻ xanh", mau:"S699", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi:ASN685S699", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN685S700", nhom_hang:"SKU102", don_gia:685000, design:"S700-Kẻ đen", mau:"S700", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi:ASN685S700", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN685S701", nhom_hang:"SKU102", don_gia:685000, design:"S701-Kẻ đen", mau:"S701", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi:ASN685S701", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN695S691", nhom_hang:"SKU102", don_gia:695000, design:"S691-Kẻ xanh", mau:"S691", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN695S691", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN695S692", nhom_hang:"SKU102", don_gia:695000, design:"S692-Kẻ xanh", mau:"S692", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN695S692", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN695S693", nhom_hang:"SKU102", don_gia:695000, design:"S693-Kẻ trắng", mau:"S693", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN695S693", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN695S694", nhom_hang:"SKU102", don_gia:695000, design:"S694-Kẻ đen", mau:"S694", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN695S694", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN695S695", nhom_hang:"SKU102", don_gia:695000, design:"S695-Kẻ xanh", mau:"S695", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN695S695", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN695S696", nhom_hang:"SKU102", don_gia:695000, design:"S696-Kẻ xanh", mau:"S696", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN695S696", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN695S697", nhom_hang:"SKU102", don_gia:695000, design:"S697-Kẻ xanh", mau:"S697", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN695S697", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN695S698", nhom_hang:"SKU102", don_gia:695000, design:"S698-Kẻ trắng", mau:"S698", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN695S698", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN695S743", nhom_hang:"SKU102", don_gia:695000, design:"S743-kẻ xám", mau:"S743", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN695S743", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN695S744", nhom_hang:"SKU102", don_gia:695000, design:"S744-Kẻ xanh", mau:"S744", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN695S744", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN728S801", nhom_hang:"SKU102", don_gia:728000, design:"S801-Kẻ xanh", mau:"S801", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi: ASN728S801", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN728S802", nhom_hang:"SKU102", don_gia:728000, design:"S802-Kẻ xanh", mau:"S802", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi:ASN728S802", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN728S803", nhom_hang:"SKU102", don_gia:728000, design:"S803-Kẻ xanh", mau:"S803", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi:ASN728S803", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN728S804", nhom_hang:"SKU102", don_gia:728000, design:"S804-Kẻ xanh", mau:"S804", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi:ASN728S804", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN728S805", nhom_hang:"SKU102", don_gia:728000, design:"S805-Vàng kẻ", mau:"S805", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi:ASN728S805", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN745S713", nhom_hang:"SKU102", don_gia:745000, design:"S713-Kẻ", mau:"S713", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN745S713", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN745S714", nhom_hang:"SKU102", don_gia:745000, design:"S714-Kẻ", mau:"S714", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN745S714", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN745S715", nhom_hang:"SKU102", don_gia:745000, design:"S715-Kẻ", mau:"S715", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN745S715", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN745S745", nhom_hang:"SKU102", don_gia:745000, design:"S745-Kẻ", mau:"S745", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN745S745", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN745S746", nhom_hang:"SKU102", don_gia:745000, design:"S746-Kẻ", mau:"S746", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN745S746", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN745S747", nhom_hang:"SKU102", don_gia:745000, design:"S747-Kẻ", mau:"S747", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN745S747", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN745S748", nhom_hang:"SKU102", don_gia:745000, design:"S748-Kẻ", mau:"S748", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN745S748", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" },
  { ten_hang_2:"ASN745S749", nhom_hang:"SKU102", don_gia:745000, design:"S749-Kẻ", mau:"S749", form:"ASN", ten_form:"Slim Fit", ten_hang_hoa:"Áo sơ mi-ASN745S749", ngung_su_dung:false, ten_nhom_hang:"SƠ MI NGẮN TAY", nhom_size:"Nhóm 3" }
];


/* --- size_groups.js --- */
// Size Groups — Nhóm size (từ hình 2)
const sizeGroups = {
  "Nhóm 3": [38, 39, 40, 41, 42, 43, 44, 46, 48],
  // Thêm nhóm khác ở đây khi cần
};

// Helper: lấy sizes theo tên nhóm
function getSizesByGroup(groupName) {
  return sizeGroups[groupName] || [];
}
// Helper: lấy tất cả tên nhóm
function getAllSizeGroupNames() {
  return Object.keys(sizeGroups);
}


/* --- promotions.js --- */
// Promotions — Chương trình bán hàng (từ hình 5)
const promotionsData = [
  { ma_ctbh: "CKCB", ten_ctbh: "Chiết khấu cơ bản",  mo_ta: "Chiết khấu mặc định cho đại lý", active: true },
  { ma_ctbh: "TLDL", ten_ctbh: "Tích lũy du lịch",    mo_ta: "Tích điểm đổi phần thưởng du lịch", active: true },
];


/* --- translations.js --- */
var TRANSLATIONS = {
  vi: {
    // --- Sidebar ---
    "nav.group.business": "Nghiệp vụ",
    "nav.order": "Đặt Hàng",
    "nav.orders": "Danh Sách Đơn",
    "nav.order_detail": "Chi Tiết Đơn",
    "nav.group.catalog": "Danh mục",
    "nav.products": "Sản Phẩm",
    "nav.sizes": "Size",
    "nav.sku": "Cấu hình SKU",
    "nav.promos": "CTKM",
    "nav.group.system": "Hệ thống",
    "nav.settings": "Cài đặt",
    "nav.logout": "Đăng xuất",

    // --- Page Headers ---
    "hdr.order": "Tạo Đơn Hàng Sỉ",
    "hdr.orders": "Danh Sách Đơn Hàng",
    "hdr.products": "Quản Lý Sản Phẩm",
    "hdr.sizes": "Quản Lý Size",
    "hdr.sku": "Cấu Hình SKU",
    "hdr.promos": "Chương Trình Khuyến Mãi",
    
    // --- Common ---
    "btn.add": "Thêm",
    "btn.save": "Lưu",
    "btn.cancel": "Hủy",
    "btn.delete": "Xóa",
    "btn.edit": "Sửa",
    "btn.close": "Đóng",
    "btn.preview": "Xem trước",
    "table.empty": "Không có dữ liệu",
    
    // --- Order Page ---
    "order.info": "Thông tin chung",
    "order.no": "Số CT",
    "order.date": "Ngày lập",
    "order.branch": "Chi nhánh",
    "order.staff": "Nhân viên",
    "order.promo": "Khuyến mãi",
    "order.note": "Ghi chú",
    "order.search.placeholder": "Nhập mã (VD: AMC545)...",
    "order.col.name": "Tên hàng 2",
    "order.col.form": "Form",
    "order.col.price": "Đơn giá",
    "order.col.sizegroup": "Nhóm size",
    "order.col.qty": "SL",
    "order.col.promo": "CTBH",
    "order.total.label": "Tổng cộng",
    "order.col.sizegroup": "Nhóm size",
    "order.preview.date": "Ngày",
    "order.preview.sp": "SP",
    "order.ac.not_found": "Không tìm thấy",
    "order.total.qty": "Tổng SP",
    "order.total.money": "Thành tiền",
    "order.search.empty": "Tìm và thêm sản phẩm để bắt đầu nhập số lượng",
    "order.preview.title": "👁 Xem Trước Đơn Hàng",
    "order.staff.placeholder": "Tên nhân viên...",
    "order.note.placeholder": "Ghi chú áp dụng toàn đơn...",
    "order.branch.hn": "Trụ sở Hà Nội",
    "order.branch.hcm": "Chi nhánh HCM",

    // --- Extra Pages ---
    "hdr.orders.desc": "Lịch sử và trạng thái đơn",
    "orders.search.placeholder": "Tìm số CT...",
    "orders.search.empty": "Chưa có đơn hàng nào",
    "hdr.products.desc": "CRUD Tên hàng 2 — nguồn sinh SKU",
    "products.search.placeholder": "Tìm tên hàng 2...",
    "hdr.sizes.desc": "CRUD size và nhóm size",
    "hdr.sku.desc": "Xem mapping: Tên hàng 2 -> SKU theo size",
    "sku.search.placeholder": "Tìm tên hàng 2...",
    "hdr.promos.desc": "Chương trình khuyến mãi / bán hàng",
    "table.col.no": "SỐ CT",
    "table.col.date": "NGÀY CT",
    "table.col.branch": "CHI NHÁNH",
    "table.col.promo": "CTKM",
    "table.col.total_qty": "TỔNG SP",
    "table.col.total_money": "TỔNG TIỀN",
    "table.col.note": "GHI CHÚ",
    "table.col.action": "THAO TÁC",
    "table.col.name2": "TÊN HÀNG 2",
    "table.col.product_group": "NHÓM HÀNG",
    "table.col.form": "FORM",
    "table.col.design_color": "DESIGN/MÀU",
    "table.col.size_group": "NHÓM SIZE",
    "table.col.price": "ĐƠN GIÁ",
    "table.col.product_name": "TÊN HÀNG HÓA",
    "table.col.status": "TRẠNG THÁI",
    "table.col.size": "SIZE",
    "table.col.size_name": "TÊN SIZE",
    "table.col.design": "DESIGN",
    "table.col.skus_generated": "SKUS SINH RA",
    "table.col.promo_code": "MÃ CTBH",
    "table.col.promo_name": "TÊN CTBH",
    "table.col.desc": "MÔ TẢ",

    // --- Settings ---
    "settings.title": "Cài đặt Giao diện & Hiển thị",
    "settings.desc": "Cá nhân hóa trải nghiệm sử dụng hệ thống B2B của bạn.",
    "settings.font": "Phông chữ (Typography)",
    "settings.font.desc": "Tùy chỉnh phông chữ hiển thị cho toàn bộ ứng dụng để có trải nghiệm tốt nhất.",
    "settings.theme": "Chủ đề Hệ thống (Theme)",
    "settings.theme.desc": "Chuyển đổi giao diện sáng tối phù hợp với môi trường làm việc.",
    "settings.lang": "Ngôn ngữ (Language)",
    "settings.lang.desc": "Tùy chọn ngôn ngữ hiển thị trên toàn hệ thống.",
    "settings.color": "Màu sắc Chủ đạo (Color)",
    "settings.color.desc": "Thay đổi màu sắc nổi bật chính của ứng dụng.",
    "settings.reset": "Khôi phục mặc định",
    "settings.reset.desc": "Thao tác này sẽ xóa toàn bộ đơn hàng và cài đặt hiện tại của bạn.",
    "settings.reset.btn": "Khôi phục mặc định",
    "settings.theme.auto.title": "Theo hệ thống",
    "settings.theme.auto.desc": "Tự động Sáng/Tối theo thiết bị.",
    "settings.theme.light.title": "Bản Phát triển (Sáng)",
    "settings.theme.light.desc": "Giao diện hiện đại, tươi sáng.",
    "settings.theme.dark.title": "Bản Phát triển (Tối)",
    "settings.theme.dark.desc": "Giao diện hiện đại, nền tối dịu mắt.",
    "settings.font.jakarta.desc": "Sang trọng, sắc nét (Mặc định)",
    "settings.font.inter.desc": "Hiện đại, dễ đọc",
    "settings.font.nunito.desc": "Bo tròn, thân thiện",
    "settings.lang.vi.desc": "Mặc định",
    "settings.lang.en.desc": "Tiếng Anh",
    "settings.lang.zh.desc": "Tiếng Trung",
    
    // --- Toasts & Alerts ---
    "toast.theme_changed": "Đã đổi chế độ",
    "toast.font_changed": "Đã đổi phông chữ",
    "toast.lang_changed": "Đã đổi ngôn ngữ",
    "toast.color_changed": "Đã đổi màu chủ đạo",
    "toast.reset_done": "Đã reset dữ liệu về mặc định. Vui lòng đợi...",
    "toast.empty_qty": "Chưa nhập số lượng!",
    "toast.empty_lines": "Chưa có dòng hàng!",
    "toast.order_saved": "Đã lưu đơn: ",
    "toast.enter_product": "Vui lòng nhập Tên hàng 2",
    "toast.not_found": "Không tìm thấy: ",
    "toast.already_in_order": "Đã có trong đơn!",
    "toast.added": "Đã thêm: ",
    "settings.reset.confirm.title": "Xóa dữ liệu",
    "settings.reset.confirm.msg": "Reset toàn bộ về dữ liệu mặc định? Đơn hàng và cài đặt sẽ bị xóa!",
    "settings.reset.confirm.btn": "Reset",
    "btn.cancel": "Hủy bỏ",
    "order.cancel.title": "Hủy đơn hàng",
    "order.cancel.msg": "Hủy đơn hàng này?",
    "order.cancel.btn": "Hủy đơn",
    "toast.order_deleted": "Đã xóa đơn hàng",
    "order.not_found": "Không tìm thấy đơn hàng",
    "order.delete.title": "Xóa đơn hàng",
    "order.delete.msg": "Xóa đơn này?",
    "btn.detail": "Chi tiết",
    "btn.back": "Quay lại"
  },
  en: {
    // --- Sidebar ---
    "nav.group.business": "Business",
    "nav.order": "New Order",
    "nav.orders": "Order History",
    "nav.order_detail": "Order Detail",
    "nav.group.catalog": "Catalog",
    "nav.products": "Products",
    "nav.sizes": "Sizes",
    "nav.sku": "SKU Config",
    "nav.promos": "Promotions",
    "nav.group.system": "System",
    "nav.settings": "Settings",
    "nav.logout": "Logout",

    // --- Page Headers ---
    "hdr.order": "Create Wholesale Order",
    "hdr.order.desc": "Create wholesale orders using size matrix",
    "hdr.orders": "Order List",
    "hdr.products": "Product Management",
    "hdr.sizes": "Size Management",
    "hdr.sku": "SKU Configuration",
    "hdr.promos": "Promotions",

    // --- Common ---
    "btn.add": "Add",
    "btn.save": "Save",
    "btn.cancel": "Cancel",
    "btn.delete": "Delete",
    "btn.edit": "Edit",
    "btn.close": "Close",
    "btn.preview": "Preview",
    "table.empty": "No data available",

    // --- Order Page ---
    "order.info": "General Info",
    "order.no": "Voucher No",
    "order.date": "Date",
    "order.branch": "Branch",
    "order.staff": "Staff",
    "order.promo": "Promotion",
    "order.note": "Note",
    "order.search.placeholder": "Enter code (ex: AMC545)...",
    "order.search.empty": "Search and add products to start entering quantities",
    "order.col.name": "Product Code",
    "order.col.form": "Form",
    "order.col.price": "Price",
    "order.col.sizegroup": "Size Group",
    "order.col.qty": "Qty",
    "order.col.promo": "Promo",
    "order.total.label": "Total",
    "order.col.sizegroup": "Size Group",
    "order.preview.date": "Date",
    "order.preview.sp": "items",
    "order.ac.not_found": "Not found",
    "order.total.qty": "Total Qty",
    "order.total.money": "Total Amount",
    "order.preview.title": "👁 Order Preview",
    "order.staff.placeholder": "Staff name...",
    "order.note.placeholder": "Apply note to entire order...",
    "order.branch.hn": "Hanoi HQ",
    "order.branch.hcm": "HCM Branch",

    // --- Extra Pages ---
    "hdr.orders.desc": "Order history and status",
    "orders.search.placeholder": "Search Voucher No...",
    "orders.search.empty": "No orders yet",
    "hdr.products.desc": "Product code CRUD — SKU generation source",
    "products.search.placeholder": "Search product code...",
    "hdr.sizes.desc": "Size and size group CRUD",
    "hdr.sku.desc": "View mapping: Product code -> SKU by size",
    "sku.search.placeholder": "Search product code...",
    "hdr.promos.desc": "Sales / promotion programs",
    "table.col.no": "VOUCHER NO",
    "table.col.date": "DATE",
    "table.col.branch": "BRANCH",
    "table.col.promo": "PROMO",
    "table.col.total_qty": "TOTAL QTY",
    "table.col.total_money": "TOTAL AMOUNT",
    "table.col.note": "NOTE",
    "table.col.action": "ACTION",
    "table.col.name2": "PRODUCT CODE",
    "table.col.product_group": "PRODUCT GROUP",
    "table.col.form": "FORM",
    "table.col.design_color": "DESIGN/COLOR",
    "table.col.size_group": "SIZE GROUP",
    "table.col.price": "PRICE",
    "table.col.product_name": "PRODUCT NAME",
    "table.col.status": "STATUS",
    "table.col.size": "SIZE",
    "table.col.size_name": "SIZE NAME",
    "table.col.design": "DESIGN",
    "table.col.skus_generated": "GENERATED SKUS",
    "table.col.promo_code": "PROMO CODE",
    "table.col.promo_name": "PROMO NAME",
    "table.col.desc": "DESCRIPTION",

    // --- Settings ---
    "settings.title": "Appearance & Display Settings",
    "settings.desc": "Personalize your B2B system experience.",
    "settings.font": "Typography",
    "settings.font.desc": "Customize display fonts for the best experience across the app.",
    "settings.theme": "System Theme",
    "settings.theme.desc": "Toggle light/dark mode to suit your environment.",
    "settings.lang": "Language",
    "settings.lang.desc": "Choose the display language for the entire system.",
    "settings.color": "Primary Color",
    "settings.color.desc": "Change the main accent color of the application.",
    "settings.reset": "Reset to default data",
    "settings.reset.desc": "This action will clear all your current orders and settings.",
    "settings.reset.btn": "Reset to default",
    "settings.theme.auto.title": "System Default",
    "settings.theme.auto.desc": "Auto switch Light/Dark mode.",
    "settings.theme.light.title": "Developer (Light)",
    "settings.theme.light.desc": "Modern and bright interface.",
    "settings.theme.dark.title": "Developer (Dark)",
    "settings.theme.dark.desc": "Eye-friendly dark interface.",
    "settings.font.jakarta.desc": "Elegant, sharp (Default)",
    "settings.font.inter.desc": "Modern, readable",
    "settings.font.nunito.desc": "Rounded, friendly",
    "settings.lang.vi.desc": "Default",
    "settings.lang.en.desc": "English",
    "settings.lang.zh.desc": "Chinese",
    
    // --- Toasts & Alerts ---
    "toast.theme_changed": "Theme changed",
    "toast.font_changed": "Font changed",
    "toast.lang_changed": "Language changed",
    "toast.color_changed": "Primary color changed",
    "toast.reset_done": "Data reset to default. Please wait...",
    "toast.empty_qty": "Quantity not entered!",
    "toast.empty_lines": "No items added!",
    "toast.order_saved": "Order saved: ",
    "toast.enter_product": "Please enter Product Name",
    "toast.not_found": "Not found: ",
    "toast.already_in_order": "Already in order!",
    "toast.added": "Added: ",
    "settings.reset.confirm.title": "Clear Data",
    "settings.reset.confirm.msg": "Reset all data to default? Orders and settings will be deleted!",
    "settings.reset.confirm.btn": "Reset",
    "btn.cancel": "Cancel",
    "order.cancel.title": "Cancel Order",
    "order.cancel.msg": "Cancel this order?",
    "order.cancel.btn": "Cancel Order",
    "toast.order_deleted": "Order deleted",
    "order.not_found": "Order not found",
    "order.delete.title": "Delete Order",
    "order.delete.msg": "Delete this order?",
    "btn.detail": "Details",
    "btn.back": "Back"
  },
  zh: {
    // --- Sidebar ---
    "nav.group.business": "业务",
    "nav.order": "下订单",
    "nav.orders": "订单列表",
    "nav.order_detail": "订单详情",
    "nav.group.catalog": "目录",
    "nav.products": "产品",
    "nav.sizes": "尺码",
    "nav.sku": "SKU配置",
    "nav.promos": "促销",
    "nav.group.system": "系统",
    "nav.settings": "设置",
    "nav.logout": "登出",

    // --- Page Headers ---
    "hdr.order": "创建批发订单",
    "hdr.order.desc": "使用尺码矩阵创建批发订单",
    "hdr.orders": "订单列表",
    "hdr.products": "产品管理",
    "hdr.sizes": "尺码管理",
    "hdr.sku": "SKU配置",
    "hdr.promos": "促销活动",

    // --- Common ---
    "btn.add": "添加",
    "btn.save": "保存",
    "btn.cancel": "取消",
    "btn.delete": "删除",
    "btn.edit": "编辑",
    "btn.close": "关闭",
    "btn.preview": "预览",
    "table.empty": "暂无数据",

    // --- Order Page ---
    "order.info": "基本信息",
    "order.no": "凭证编号",
    "order.date": "日期",
    "order.branch": "分行",
    "order.staff": "员工",
    "order.promo": "促销",
    "order.note": "备注",
    "order.search.placeholder": "输入代码 (例: AMC545)...",
    "order.search.empty": "搜索并添加产品以开始输入数量",
    "order.col.name": "产品代码",
    "order.col.form": "版型",
    "order.col.price": "单价",
    "order.col.sizegroup": "尺码组",
    "order.col.qty": "数量",
    "order.col.promo": "促销",
    "order.total.label": "总计",
    "order.col.sizegroup": "尺码组",
    "order.preview.date": "日期",
    "order.preview.sp": "件商品",
    "order.ac.not_found": "未找到",
    "order.total.qty": "总数量",
    "order.total.money": "总金额",
    "order.preview.title": "👁 订单预览",
    "order.staff.placeholder": "员工姓名...",
    "order.note.placeholder": "应用于整个订单...",
    "order.branch.hn": "河内总部",
    "order.branch.hcm": "胡志明分公司",

    // --- Extra Pages ---
    "hdr.orders.desc": "订单历史和状态",
    "orders.search.placeholder": "搜索凭证编号...",
    "orders.search.empty": "暂无订单",
    "hdr.products.desc": "产品代码 CRUD — SKU 生成源",
    "products.search.placeholder": "搜索产品代码...",
    "hdr.sizes.desc": "尺码和尺码组 CRUD",
    "hdr.sku.desc": "查看映射：产品代码 -> 按尺码的 SKU",
    "sku.search.placeholder": "搜索产品代码...",
    "hdr.promos.desc": "销售/促销计划",
    "table.col.no": "凭证编号",
    "table.col.date": "日期",
    "table.col.branch": "分行",
    "table.col.promo": "促销",
    "table.col.total_qty": "总数量",
    "table.col.total_money": "总金额",
    "table.col.note": "备注",
    "table.col.action": "操作",
    "table.col.name2": "产品代码",
    "table.col.product_group": "产品组",
    "table.col.form": "版型",
    "table.col.design_color": "设计/颜色",
    "table.col.size_group": "尺码组",
    "table.col.price": "单价",
    "table.col.product_name": "产品名称",
    "table.col.status": "状态",
    "table.col.size": "尺码",
    "table.col.size_name": "尺码名称",
    "table.col.design": "设计",
    "table.col.skus_generated": "生成的 SKU",
    "table.col.promo_code": "促销代码",
    "table.col.promo_name": "促销名称",
    "table.col.desc": "描述",

    // --- Settings ---
    "settings.title": "外观和显示设置",
    "settings.desc": "个性化您的 B2B 系统体验。",
    "settings.font": "字体 (Typography)",
    "settings.font.desc": "自定义整个应用程序的显示字体以获得最佳体验。",
    "settings.theme": "系统主题 (Theme)",
    "settings.theme.desc": "切换浅色/深色模式以适应您的工作环境。",
    "settings.lang": "语言 (Language)",
    "settings.lang.desc": "选择全系统的显示语言。",
    "settings.color": "主题色 (Color)",
    "settings.color.desc": "更改应用程序的主要强调色。",
    "settings.reset": "重置为默认数据",
    "settings.reset.desc": "此操作将清除您当前的所有订单和设置。",
    "settings.reset.btn": "重置为默认",
    "settings.theme.auto.title": "系统默认",
    "settings.theme.auto.desc": "自动切换明/暗模式。",
    "settings.theme.light.title": "开发者 (浅色)",
    "settings.theme.light.desc": "现代而明亮的界面。",
    "settings.theme.dark.title": "开发者 (深色)",
    "settings.theme.dark.desc": "护眼深色界面。",
    "settings.font.jakarta.desc": "优雅、清晰 (默认)",
    "settings.font.inter.desc": "现代、易读",
    "settings.font.nunito.desc": "圆润、友好",
    "settings.lang.vi.desc": "默认",
    "settings.lang.en.desc": "英语",
    "settings.lang.zh.desc": "中文",

    // --- Toasts & Alerts ---
    "toast.theme_changed": "主题已更改",
    "toast.font_changed": "字体已更改",
    "toast.lang_changed": "语言已更改",
    "toast.color_changed": "主题色已更改",
    "toast.reset_done": "数据已重置为默认。请稍候...",
    "toast.empty_qty": "未输入数量！",
    "toast.empty_lines": "没有添加商品！",
    "toast.order_saved": "已保存订单：",
    "toast.enter_product": "请输入产品名称",
    "toast.not_found": "未找到：",
    "toast.already_in_order": "已在订单中！",
    "toast.added": "已添加：",
    "settings.reset.confirm.title": "清除数据",
    "settings.reset.confirm.msg": "将所有数据重置为默认值？订单和设置将被删除！",
    "settings.reset.confirm.btn": "重置",
    "btn.cancel": "取消",
    "order.cancel.title": "取消订单",
    "order.cancel.msg": "取消此订单？",
    "order.cancel.btn": "取消",
    "toast.order_deleted": "订单已删除",
    "order.not_found": "未找到订单",
    "order.delete.title": "删除订单",
    "order.delete.msg": "删除此订单？",
    "btn.detail": "详情",
    "btn.back": "返回"
  }
};


/* --- db.js --- */
/**
 * DB — localStorage CRUD helper
 * Collections: 'products', 'sizes', 'promotions', 'orders'
 */
const DB = (function () {
  const PREFIX = 'santino_';

  function _key(col) { return PREFIX + col; }
  function getAll(col) {
    try { return JSON.parse(localStorage.getItem(_key(col))) || []; }
    catch { return []; }
  }
  function setAll(col, arr) { localStorage.setItem(_key(col), JSON.stringify(arr)); }

  function add(col, item) {
    const arr = getAll(col);
    item.id = item.id || Date.now() + '_' + Math.random().toString(36).slice(2, 6);
    arr.push(item);
    setAll(col, arr);
    return item;
  }
  function update(col, id, patch) {
    const arr = getAll(col).map(r => r.id === id ? { ...r, ...patch } : r);
    setAll(col, arr);
  }
  function remove(col, id) {
    setAll(col, getAll(col).filter(r => r.id !== id));
  }
  function find(col, id) {
    return getAll(col).find(r => r.id === id);
  }

  // Init seed data (chỉ chạy lần đầu nếu chưa có data)
  function initSeed() {
    // Luôn ghi đè products từ product_master.js (tránh bị kẹt cache cũ thiếu field design)
    const seeded = productMaster.map((p, i) => ({ ...p, id: 'p' + i }));
    setAll('products', seeded);
    if (!localStorage.getItem(_key('sizes'))) {
      const seeded = [];
      Object.entries(sizeGroups).forEach(([group, sizes]) => {
        sizes.forEach(s => seeded.push({ id: group + '_' + s, size: s, ten_size: String(s), nhom_size: group }));
      });
      setAll('sizes', seeded);
    }
    if (!localStorage.getItem(_key('promotions'))) {
      const seeded = promotionsData.map(p => ({ ...p, id: p.ma_ctbh }));
      setAll('promotions', seeded);
    }
    if (!localStorage.getItem(_key('orders'))) {
      setAll('orders', []);
    }
  }

  return { getAll, setAll, add, update, remove, find, initSeed };
})();


/* --- utils.js --- */
/** Utility functions */
const Utils = (function () {
  function formatMoney(n) {
    return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
  }

  // Cập nhật Blueprint v2.0: Validation an toàn
  function buildSKU(ten_hang_2, size) {
    if (!ten_hang_2) return 'INVALID_SKU';
    const clean_ten = ten_hang_2.trim();
    const match = clean_ten.match(/^[A-Z]+/);
    if (!match) return `INVALID_${clean_ten}_${size}`;
    const brand = match[0];
    const rest = clean_ten.slice(brand.length);
    return `${brand}${size}${rest}`;
  }

  // DH{MMYY}/{seq:04}
  function genOrderNo() {
    const orders = DB.getAll('orders');
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(2);
    const seq = String(orders.length + 1).padStart(4, '0');
    return `DH${mm}${yy}/${seq}`;
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return { formatMoney, buildSKU, genOrderNo, today, escHtml };
})();


/* --- ConfirmModal.js --- */
/**
 * Confirm Modal Component
 * Hộp thoại hỏi ý kiến (Xóa/Lưu dữ liệu)
 */
var ConfirmModal = (function () {
  var modalOverlay = null;

  function init() {
    if (document.getElementById('confirm-modal-overlay')) return;

    modalOverlay = document.createElement('div');
    modalOverlay.id = 'confirm-modal-overlay';
    modalOverlay.className = 'modal-overlay';
    modalOverlay.style.display = 'none';

    var html = `
      <div class="modal" style="width: 360px; padding: 24px; animation: slideUp 0.2s ease;">
        <div class="modal-hdr" style="margin-bottom: 16px;">
          <h3 id="confirm-modal-title">Xác nhận</h3>
          <button class="btn-icon" id="confirm-modal-btn-close">
            <span class="material-symbols-outlined" style="font-size: 20px;">close</span>
          </button>
        </div>
        <div>
          <p id="confirm-modal-message" style="margin-bottom: 20px; color: var(--muted); font-size: 14px; line-height: 1.5;"></p>
        </div>
        <div class="modal-actions" style="margin-top: 16px; padding-top: 16px;">
          <button class="btn btn-ghost" id="confirm-modal-btn-cancel">Hủy bỏ</button>
          <button class="btn btn-primary" id="confirm-modal-btn-confirm">Đồng ý</button>
        </div>
      </div>
    `;

    modalOverlay.innerHTML = html;
    document.body.appendChild(modalOverlay);
  }

  /**
   * Mở hộp thoại xác nhận
   * @param {Object} options - { title, message, confirmText, confirmClass, onConfirm }
   */
  function show(options) {
    if (!modalOverlay) init();

    document.getElementById('confirm-modal-title').innerText = options.title || 'Xác nhận';
    document.getElementById('confirm-modal-message').innerText = options.message || 'Bạn có chắc chắn muốn thực hiện hành động này?';
    
    var btnConfirm = document.getElementById('confirm-modal-btn-confirm');
    btnConfirm.innerText = options.confirmText || 'Đồng ý';
    btnConfirm.className = 'btn ' + (options.confirmClass || 'btn-primary');

    var btnCancel = document.getElementById('confirm-modal-btn-cancel');
    var btnClose = document.getElementById('confirm-modal-btn-close');
    
    btnCancel.innerText = options.cancelText || (typeof t === 'function' ? t('btn.cancel') : 'Hủy bỏ');

    // Remove old listeners using clone node trick
    var newBtnConfirm = btnConfirm.cloneNode(true);
    btnConfirm.parentNode.replaceChild(newBtnConfirm, btnConfirm);

    var newBtnCancel = btnCancel.cloneNode(true);
    btnCancel.parentNode.replaceChild(newBtnCancel, btnCancel);

    var newBtnClose = btnClose.cloneNode(true);
    btnClose.parentNode.replaceChild(newBtnClose, btnClose);

    // Add new listeners
    newBtnConfirm.addEventListener('click', function() {
      hide();
      if (typeof options.onConfirm === 'function') options.onConfirm();
    });

    newBtnCancel.addEventListener('click', hide);
    newBtnClose.addEventListener('click', hide);

    modalOverlay.style.display = 'flex';
  }

  function hide() {
    if (modalOverlay) {
      modalOverlay.style.display = 'none';
    }
  }

  return {
    show: show,
    hide: hide
  };
})();


/* --- Modal.js --- */
/**
 * Generic Modal Builder
 * Mở các Pop-up Window Nhập liệu / Báo cáo không cần code cứng HTML
 */
var UIModal = (function () {

  /**
   * Mở một form Modal bất kỳ
   * @param {Object} config - { id, title, width, content (Node/String), footer (Node), onClose }
   */
  function show(config) {
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.display = 'flex';
    if (config.id) overlay.id = config.id;

    var contentWidth = config.width || '600px';

    var html = `
      <div class="modal" style="width: ${contentWidth};">
        <div class="modal-hdr">
          <h3>${config.title || 'Tiêu đề'}</h3>
          <button class="btn-icon btn-close-modal">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="ui-modal-body"></div>
        <div class="modal-actions"></div>
      </div>
    `;
    overlay.innerHTML = html;

    var bodyWrapper = overlay.querySelector('.ui-modal-body');
    if (typeof config.content === 'string') {
      bodyWrapper.innerHTML = config.content;
    } else if (config.content instanceof Node) {
      bodyWrapper.appendChild(config.content);
    }

    var footerWrapper = overlay.querySelector('.modal-actions');
    if (config.footer instanceof Node) {
      footerWrapper.appendChild(config.footer);
    } else {
      footerWrapper.style.display = 'none';
    }

    document.getElementById('modal-container').appendChild(overlay);

    function close() {
      overlay.remove();
      if (typeof config.onClose === 'function') config.onClose();
    }

    overlay.querySelector('.btn-close-modal').addEventListener('click', close);
    // Optional: close on click outside
    /* overlay.addEventListener('click', function(e) {
      if (e.target === overlay) close();
    }); */

    return {
      close: close,
      node: overlay
    };
  }

  return {
    show: show
  };
})();


/* --- router.js --- */
/**
 * Router — Hash-based SPA cho Santino B2B
 * Pattern: #/order → load src/pages/order/order.js → OrderPage.render($el)
 */
var Router = (function () {

  var ROUTES = [
    { path: '/order', script: 'src/pages/order/order.js', pageFn: 'OrderPage', title: 'nav.order' },
    { path: '/orders', script: 'src/pages/orders/orders.js', pageFn: 'OrdersPage', title: 'nav.orders' },
    { path: '/order-detail', script: 'src/pages/order-detail/order-detail.js', pageFn: 'OrderDetailPage', title: 'nav.order_detail' },
    { path: '/products', script: 'src/pages/products/products.js', pageFn: 'ProductsPage', title: 'nav.products' },
    { path: '/sizes', script: 'src/pages/sizes/sizes.js', pageFn: 'SizesPage', title: 'nav.sizes' },
    { path: '/sku', script: 'src/pages/sku/sku.js', pageFn: 'SkuPage', title: 'nav.sku' },
    { path: '/promos', script: 'src/pages/promos/promos.js', pageFn: 'PromosPage', title: 'nav.promos' },
    { path: '/settings', script: 'src/pages/settings/settings.js', pageFn: 'SettingsPage', title: 'nav.settings' },
  ];

  var _routeMap = {};
  ROUTES.forEach(function (r) { _routeMap[r.path] = r; });

  var _loadedScripts = {};
  var _templateCache = {};
  var _isNavigating = false;

  // ── Dynamic script loader ─────────────────────────────────────────────
  function _loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (_loadedScripts[src]) { resolve(); return; }
      var el = document.createElement('script');
      el.src = src;
      el.onload = function () { _loadedScripts[src] = true; resolve(); };
      el.onerror = function () { reject(new Error('Load failed: ' + src)); };
      document.body.appendChild(el);
    });
  }

  // ── Template fetch with cache ─────────────────────────────────────────
  function fetchTemplate(url) {
    if (_templateCache[url]) return Promise.resolve(_templateCache[url]);
    return fetch(url + '?v=' + new Date().getTime(), { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error('Template not found: ' + url);
        return r.text();
      })
      .then(function (html) { _templateCache[url] = html; return html; });
  }

  // ── Fade helpers ──────────────────────────────────────────────────────
  function _fadeOut($el) {
    return new Promise(function (resolve) {
      $el.style.opacity = '0';
      $el.style.transition = 'opacity 100ms ease';
      setTimeout(resolve, 100);
    });
  }
  function _fadeIn($el) {
    $el.style.opacity = '1';
    $el.style.transition = 'opacity 150ms ease';
  }

  // ── Nav highlight ─────────────────────────────────────────────────────
  function _updateNav(hash) {
    document.querySelectorAll('.nav-item, .bn-item').forEach(function (el) {
      el.classList.remove('active');
      if (el.getAttribute('data-route') === hash) el.classList.add('active');
    });
    var hdr = document.getElementById('hdr-title');
    var route = _routeMap[hash];
    if (hdr && route) {
      hdr.setAttribute('data-i18n', route.title);
      hdr.textContent = typeof t === 'function' ? t(route.title) : route.title;
    }
    if (route) document.title = (typeof t === 'function' ? t(route.title) : route.title) + ' | SANTINO B2B';
  }

  // ── Main handler ──────────────────────────────────────────────────────
  function _handle() {
    if (_isNavigating) return;
    _isNavigating = true;

    var $el = document.getElementById('app-content');
    var hash = window.location.hash.replace('#', '') || '/order';
    var route = _routeMap[hash];

    _updateNav(hash);
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (!route) {
      $el.innerHTML = '<div class="empty-state"><span class="material-symbols-outlined">search_off</span><p>Trang không tồn tại: ' + hash + '</p></div>';
      _isNavigating = false;
      return;
    }

    _fadeOut($el)
      .then(function () { return _loadScript(route.script); })
      .then(function () {
        var mod = window[route.pageFn];
        if (mod && typeof mod.render === 'function') {
          return mod.render($el);
        }
        throw new Error('Module not found: ' + route.pageFn);
      })
      .then(function () {
        if (typeof applyLanguage === 'function') applyLanguage();
        _fadeIn($el);
        _isNavigating = false;
      })
      .catch(function (err) {
        console.error('[Router]', err);
        $el.innerHTML = '<div class="card" style="color:var(--danger)"><span class="material-symbols-outlined" style="vertical-align:middle">error</span> ' + err.message + '</div>';
        _fadeIn($el);
        _isNavigating = false;
      });
  }

  // ── Init ──────────────────────────────────────────────────────────────
  function init() {
    window.addEventListener('hashchange', _handle);
    if (!window.location.hash) window.location.hash = '#/order';
    else _handle();
  }

  // ── Public navigate helper ────────────────────────────────────────────
  function go(path) { window.location.hash = '#' + path; }

  return { init: init, go: go, fetchTemplate: fetchTemplate, ROUTES: ROUTES };
})();


/* --- app.js --- */
/**
 * App Bootstrap — Khởi tạo Santino B2B
 * Chạy sau khi tất cả scripts đã load
 */
document.addEventListener('DOMContentLoaded', function () {
  // 1. Seed data vào localStorage lần đầu
  DB.initSeed();

  // 2. Khôi phục Cài đặt
  var theme = localStorage.getItem('santino_theme') || 'auto';
  if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark-theme');
  } else {
    document.documentElement.classList.remove('dark-theme');
  }
  
  var zoom = localStorage.getItem('santino_zoom');
  if (zoom === null) zoom = '115';
  document.documentElement.style.setProperty('--text-scale', (parseInt(zoom)/100).toString());

  var font = localStorage.getItem('santino_font');
  if(font) document.documentElement.style.setProperty('--font', '"' + font + '", sans-serif');

  var color = localStorage.getItem('santino_color');
  if(color) {
    document.documentElement.style.setProperty('--accent', color);
    var colorFg = localStorage.getItem('santino_color_fg');
    if(colorFg) document.documentElement.style.setProperty('--accent-fg', colorFg);
  }
  Router.init();

  // Ẩn splash nếu có
  var splash = document.getElementById('app-splash');
  if (splash) splash.style.display = 'none';
});

// ── Global helpers (dùng được từ bất kỳ page nào) ─────────────────────

function toggleTheme() {
  var isDark = document.documentElement.classList.toggle('dark-theme');
  localStorage.setItem('santino_theme', isDark ? 'dark' : 'light');
}


function showToast(msg, ok) {
  if (ok === undefined) ok = true;
  var t = document.getElementById('toast');
  var m = document.getElementById('toast-msg');
  if (!t || !m) return;
  t.querySelector('.material-symbols-outlined').textContent = ok ? 'check_circle' : 'error';
  m.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(function () { t.classList.remove('show'); }, 3000);
}

function openModal(id)  { var el = document.getElementById(id); if (el) el.classList.add('show'); }
function closeModal(id) { var el = document.getElementById(id); if (el) el.classList.remove('show'); }

// Đóng modal khi click overlay
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('show');
});

// Chuyển đổi ngôn ngữ
function t(key) {
  var lang = localStorage.getItem('santino_lang') || 'vi';
  var dict = typeof TRANSLATIONS !== 'undefined' ? (TRANSLATIONS[lang] || TRANSLATIONS['vi']) : {};
  return dict[key] || key;
}

function applyLanguage() {
  var lang = localStorage.getItem('santino_lang') || 'vi';
  var dict = typeof TRANSLATIONS !== 'undefined' ? TRANSLATIONS[lang] || TRANSLATIONS['vi'] : {};
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    if (dict[key]) {
      // Dùng innerHTML hoặc textContent, tuỳ yêu cầu. Dùng textContent an toàn hơn.
      el.textContent = dict[key];
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
    var key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });
}

// Chạy dịch ngôn ngữ khi tải trang và sau khi render xong Router
document.addEventListener('DOMContentLoaded', applyLanguage);



