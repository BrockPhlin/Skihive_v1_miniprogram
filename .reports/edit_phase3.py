"""
Phase 3 fix: restore the section break (page break) between cover and 目录
that was lost during cover page empty paragraph collapse.
"""
from docx import Document
from docx.oxml.ns import qn
from copy import deepcopy
from lxml import etree

SRC = "/Users/bob/WeChatProjects/skihive_v1/.reports/系统设计报告.modified.docx"
DST = "/Users/bob/WeChatProjects/skihive_v1/.reports/系统设计报告.modified.docx"

doc = Document(SRC)

# Find the existing sectPr in body that comes right before "目录"
# We need to find the empty paragraph with sectPr that comes right after the 目录 paragraph
sectPr_para = None
for p in doc.paragraphs:
    pPr = p._element.find(qn('w:pPr'))
    if pPr is not None:
        sp = pPr.find(qn('w:sectPr'))
        if sp is not None:
            sectPr_para = p
            break

if sectPr_para is None:
    print("[WARN] No sectPr-bearing paragraph found")
else:
    # Find "目录" paragraph - walk back from sectPr_para
    toc_p = None
    sectPr_elem = sectPr_para._element
    cur = sectPr_elem
    while cur is not None:
        cur = cur.getprevious()
        if cur is None: break
        if cur.tag == qn('w:p'):
            ts = cur.findall('.//' + qn('w:t'))
            text = "".join(t.text or "" for t in ts)
            if "目 录" in text:
                toc_p = cur
                break

    if toc_p is None:
        print("[WARN] Could not locate 目录 paragraph")
    else:
        # Insert a new empty paragraph (with sectPr to force a page break) BEFORE 目录
        new_p = etree.SubElement(toc_p.getparent(), qn('w:p'))
        # Add pPr with sectPr copy
        new_pPr = etree.SubElement(new_p, qn('w:pPr'))
        # Copy the sectPr from sectPr_para
        source_pPr = sectPr_para._element.find(qn('w:pPr'))
        source_sectPr = source_pPr.find(qn('w:sectPr'))
        new_pPr.append(deepcopy(source_sectPr))

        # Move new_p to the position right before toc_p
        toc_p.addprevious(new_p)
        print(f"[OK] Restored page break before 目录")

doc.save(DST)
print(f"[SAVED] {DST}")
