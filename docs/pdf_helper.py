"""Bantuan membuat PDF laporan: Times 12, hitam putih, tabel bergaris tipis."""
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table,
                                TableStyle, Preformatted, KeepTogether, PageBreak)

GROUP = "Kelompok Josjis"
MEMBERS = ["Bobby Eka Angga Kusuma (251111021, ketua)",
           "Tyo Dzaky Kamaludin (251111009)",
           "Geraldy Fauzy Setiabudi (251111010)"]


def _st(name, **kw):
    base = dict(fontName="Times-Roman", fontSize=12, leading=16,
                textColor=colors.black, alignment=TA_JUSTIFY)
    base.update(kw)
    return ParagraphStyle(name, **base)


BODY = _st("body")
LEFT = _st("left", alignment=TA_LEFT)
TITLE = _st("title", fontName="Times-Bold", alignment=TA_CENTER, spaceAfter=2)
SUB = _st("sub", alignment=TA_CENTER)
H = _st("h", fontName="Times-Bold", alignment=TA_LEFT, spaceBefore=12, spaceAfter=4, keepWithNext=1)
H2 = _st("h2", fontName="Times-BoldItalic", alignment=TA_LEFT, spaceBefore=8, spaceAfter=3, keepWithNext=1)
CELL = _st("cell", alignment=TA_LEFT, leading=15)
CELLB = _st("cellb", fontName="Times-Bold", alignment=TA_LEFT, leading=15)
CAP = _st("cap", alignment=TA_CENTER)


def P(text, style=BODY):
    return Paragraph(text, style)


def table(rows, widths, head=True):
    data = []
    for i, r in enumerate(rows):
        st = CELLB if (head and i == 0) else CELL
        data.append([Paragraph(c, st) for c in r])
    t = Table(data, colWidths=widths, repeatRows=1 if head else 0)
    t.setStyle(TableStyle([("GRID", (0, 0), (-1, -1), 0.6, colors.black),
                           ("VALIGN", (0, 0), (-1, -1), "TOP"),
                           ("TOPPADDING", (0, 0), (-1, -1), 4),
                           ("BOTTOMPADDING", (0, 0), (-1, -1), 4)]))
    return t


def code(text, width):
    pre = Preformatted(text.strip("\n"), ParagraphStyle(
        "code", fontName="Courier", fontSize=9.5, leading=12, textColor=colors.black))
    t = Table([[pre]], colWidths=[width])
    t.setStyle(TableStyle([("BOX", (0, 0), (-1, -1), 0.6, colors.black),
                           ("LEFTPADDING", (0, 0), (-1, -1), 6),
                           ("TOPPADDING", (0, 0), (-1, -1), 5),
                           ("BOTTOMPADDING", (0, 0), (-1, -1), 5)]))
    return t


def header(title, assignment_line):
    s = [P(title, TITLE), P("TugasKu: Aplikasi Manajemen Tugas Kuliah", SUB),
         P(assignment_line + " - " + GROUP, SUB), Spacer(1, 10)]
    s += [P(m, LEFT) for m in MEMBERS]
    return s


def build(path, story, landscape_mode=False, title=""):
    size = landscape(A4) if landscape_mode else A4
    doc = SimpleDocTemplate(path, pagesize=size, leftMargin=2.5 * cm, rightMargin=2.5 * cm,
                            topMargin=2.5 * cm, bottomMargin=2.5 * cm,
                            title=title, author=GROUP)
    doc.build(story)
    return path


__all__ = ["P", "table", "code", "header", "build", "H", "H2", "BODY", "LEFT", "CAP",
           "Spacer", "KeepTogether", "PageBreak", "cm"]
