from pathlib import Path

from docx import Document
from docx.enum.table import WD_ALIGN_VERTICAL, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'docx-templates' / 'phieu-dat-hang.docx'
LOGO = ROOT / 'images' / 'logo.png'


def set_cell_shading(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:fill'), fill)
    tc_pr.append(shd)


def set_cell_margins(cell, top=70, start=90, bottom=70, end=90):
    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    margins = tc_pr.first_child_found_in('w:tcMar')
    if margins is None:
        margins = OxmlElement('w:tcMar')
        tc_pr.append(margins)
    for side, value in [('top', top), ('start', start), ('bottom', bottom), ('end', end)]:
        node = margins.find(qn('w:' + side))
        if node is None:
            node = OxmlElement('w:' + side)
            margins.append(node)
        node.set(qn('w:w'), str(value))
        node.set(qn('w:type'), 'dxa')


def set_table_borders(table, color='000000', size='6'):
    tbl_pr = table._tbl.tblPr
    borders = tbl_pr.first_child_found_in('w:tblBorders')
    if borders is None:
        borders = OxmlElement('w:tblBorders')
        tbl_pr.append(borders)
    for edge in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
        tag = qn('w:' + edge)
        element = borders.find(tag)
        if element is None:
            element = OxmlElement('w:' + edge)
            borders.append(element)
        element.set(qn('w:val'), 'single')
        element.set(qn('w:sz'), size)
        element.set(qn('w:space'), '0')
        element.set(qn('w:color'), color)


def set_table_widths(table, widths_cm):
    table.autofit = False
    for row in table.rows:
        for idx, width in enumerate(widths_cm):
            row.cells[idx].width = Cm(width)
            tc_pr = row.cells[idx]._tc.get_or_add_tcPr()
            tc_w = tc_pr.find(qn('w:tcW'))
            if tc_w is None:
                tc_w = OxmlElement('w:tcW')
                tc_pr.append(tc_w)
            tc_w.set(qn('w:w'), str(int(width / 2.54 * 1440)))
            tc_w.set(qn('w:type'), 'dxa')


def set_font(run, size=10, bold=False, italic=False, color=None):
    run.font.name = 'Times New Roman'
    run._element.rPr.rFonts.set(qn('w:ascii'), 'Times New Roman')
    run._element.rPr.rFonts.set(qn('w:hAnsi'), 'Times New Roman')
    run._element.rPr.rFonts.set(qn('w:eastAsia'), 'Times New Roman')
    run.font.size = Pt(size)
    run.bold = bold
    run.italic = italic
    if color:
        run.font.color.rgb = RGBColor(*color)


def add_text(cell, text='', size=10, bold=False, italic=False, alignment=WD_ALIGN_PARAGRAPH.LEFT):
    paragraph = cell.paragraphs[0]
    paragraph.alignment = alignment
    paragraph.paragraph_format.space_before = Pt(0)
    paragraph.paragraph_format.space_after = Pt(0)
    paragraph.paragraph_format.line_spacing = 1
    run = paragraph.add_run(text)
    set_font(run, size=size, bold=bold, italic=italic)
    return paragraph


def add_line(document, text='', size=10, bold=False, italic=False, align=WD_ALIGN_PARAGRAPH.LEFT, before=0, after=1):
    paragraph = document.add_paragraph()
    paragraph.alignment = align
    paragraph.paragraph_format.space_before = Pt(before)
    paragraph.paragraph_format.space_after = Pt(after)
    paragraph.paragraph_format.line_spacing = 1
    run = paragraph.add_run(text)
    set_font(run, size=size, bold=bold, italic=italic)
    return paragraph


def no_table_borders(table):
    tbl_pr = table._tbl.tblPr
    borders = OxmlElement('w:tblBorders')
    for edge in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
        element = OxmlElement('w:' + edge)
        element.set(qn('w:val'), 'nil')
        borders.append(element)
    tbl_pr.append(borders)


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = Document()
    section = doc.sections[0]
    section.top_margin = Cm(1.1)
    section.bottom_margin = Cm(1.1)
    section.left_margin = Cm(1.1)
    section.right_margin = Cm(1.1)
    section.header_distance = Cm(0.5)
    section.footer_distance = Cm(0.5)

    style = doc.styles['Normal']
    style.font.name = 'Times New Roman'
    style._element.rPr.rFonts.set(qn('w:ascii'), 'Times New Roman')
    style._element.rPr.rFonts.set(qn('w:hAnsi'), 'Times New Roman')
    style._element.rPr.rFonts.set(qn('w:eastAsia'), 'Times New Roman')
    style.font.size = Pt(10)

    header = doc.add_table(rows=1, cols=2)
    header.alignment = WD_TABLE_ALIGNMENT.CENTER
    no_table_borders(header)
    set_table_widths(header, [6.1, 12.2])
    logo_cell, company_cell = header.rows[0].cells
    logo_cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
    company_cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
    if LOGO.exists():
        logo_cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
        logo_cell.paragraphs[0].add_run().add_picture(str(LOGO), width=Cm(3.1))
    else:
        add_text(logo_cell, 'SANTINO', size=19, bold=True, alignment=WD_ALIGN_PARAGRAPH.CENTER)
    add_text(company_cell, 'CÔNG TY CP LSP VIỆT NAM', size=11, bold=True, alignment=WD_ALIGN_PARAGRAPH.CENTER)
    p = company_cell.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(0)
    set_font(p.add_run('Số 48, Phố Lạc Trung, Q. Hai Bà Trưng, Hà Nội'), size=9)
    p = company_cell.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(0)
    set_font(p.add_run('Tel: (024) 3204 9988  |  Email: info@santino.com.vn'), size=9)

    add_line(doc, 'PHIẾU ĐẶT HÀNG', size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, before=5, after=1)
    add_line(doc, 'Ngày: {ngay_ct}', size=10, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, after=4)

    info = doc.add_table(rows=3, cols=2)
    no_table_borders(info)
    set_table_widths(info, [11.0, 7.3])
    info_data = [
        ('Khách hàng:', '{khach_hang}', 'Số chứng từ:', '{so_ct}'),
        ('Địa chỉ:', '{dia_chi}', 'Nhân viên:', '{nvkd}'),
        ('Diễn giải:', '{ghi_chu}', '', ''),
    ]
    for row, data in zip(info.rows, info_data):
        for cell in row.cells:
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            set_cell_margins(cell, top=20, bottom=20)
        p = add_text(row.cells[0], data[0] + ' ', size=9)
        set_font(p.add_run(data[1]), size=9, bold=data[0] != 'Diễn giải:')
        if data[2]:
            p = add_text(row.cells[1], data[2] + ' ', size=9)
            set_font(p.add_run(data[3]), size=9, bold=True)

    doc.add_paragraph().paragraph_format.space_after = Pt(1)
    items = doc.add_table(rows=2, cols=7)
    items.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_widths(items, [0.7, 1.15, 4.0, 1.05, 1.55, 1.15, 2.7])
    set_table_borders(items, size='6')
    headers = ['STT', 'Mã hàng', 'Tên hàng', 'ĐVT', 'Đơn giá', 'Số lượng', 'Thành tiền']
    for idx, text in enumerate(headers):
        cell = items.rows[0].cells[idx]
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        set_cell_shading(cell, 'E7E7E7')
        set_cell_margins(cell)
        add_text(cell, text, size=8.5, bold=True, alignment=WD_ALIGN_PARAGRAPH.CENTER)

    detail = items.rows[1]
    values = ['{#lines}{STT}', '{ten_hang_2}', '{ten_hang}', '{dvt}', '{don_gia_display}', '{so_luong}', '{thanh_tien_display}{/lines}']
    aligns = [WD_ALIGN_PARAGRAPH.CENTER, WD_ALIGN_PARAGRAPH.CENTER, WD_ALIGN_PARAGRAPH.LEFT,
              WD_ALIGN_PARAGRAPH.CENTER, WD_ALIGN_PARAGRAPH.RIGHT, WD_ALIGN_PARAGRAPH.CENTER,
              WD_ALIGN_PARAGRAPH.RIGHT]
    for idx, value in enumerate(values):
        cell = detail.cells[idx]
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        set_cell_margins(cell)
        add_text(cell, value, size=9, alignment=aligns[idx])

    totals = doc.add_table(rows=2, cols=2)
    totals.alignment = WD_TABLE_ALIGNMENT.RIGHT
    no_table_borders(totals)
    set_table_widths(totals, [14.3, 4.0])
    for row in totals.rows:
        for cell in row.cells:
            set_cell_margins(cell, top=30, bottom=30)
    add_text(totals.rows[0].cells[0], 'Tổng số lượng:', size=9, alignment=WD_ALIGN_PARAGRAPH.RIGHT)
    add_text(totals.rows[0].cells[1], '{total_qty}', size=9, bold=True, alignment=WD_ALIGN_PARAGRAPH.RIGHT)
    add_text(totals.rows[1].cells[0], 'Tổng tiền hàng:', size=10, bold=True, alignment=WD_ALIGN_PARAGRAPH.RIGHT)
    add_text(totals.rows[1].cells[1], '{total_money_display}', size=10, bold=True, alignment=WD_ALIGN_PARAGRAPH.RIGHT)

    doc.add_paragraph().paragraph_format.space_after = Pt(5)
    signs = doc.add_table(rows=2, cols=4)
    no_table_borders(signs)
    set_table_widths(signs, [4.575, 4.575, 4.575, 4.575])
    labels = ['Người nhận', 'Người giao', 'Thủ kho', 'Kế toán']
    for idx, label in enumerate(labels):
        cell = signs.rows[0].cells[idx]
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        add_text(cell, label, size=10, bold=True, alignment=WD_ALIGN_PARAGRAPH.CENTER)
        cell = signs.rows[1].cells[idx]
        add_text(cell, '(Ký, họ tên)', size=9, italic=True, alignment=WD_ALIGN_PARAGRAPH.CENTER)

    doc.core_properties.title = 'Phiếu đặt hàng Santino'
    doc.core_properties.subject = 'Mẫu DOCX dùng cho Document Server'
    doc.save(OUTPUT)
    print(OUTPUT)


if __name__ == '__main__':
    main()
