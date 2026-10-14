"""
Generate talk.pptx from the team neusta master template.
Slide layouts used (following usage guidelines):
  1  - 2_Titelfolie-Violett        (title slides)
  2  - 3_Titelfolie-Futuregreen    (closing title)
  5  - Inhalt_einspaltig           (single-column content)
  6  - Inhalt zweispaltig          (two-column content)
 12  - 1_Abschnittsfolie           (section break, dark navy)
 13  - 2_Abschnittsfolie           (section break, variant 2)
 14  - 3_Abschnittsfolie           (section break, variant 3)
 15  - 4_Abschnittsfolie           (section break, variant 4)
 16  - 5_Abschnittsfolie           (section break, variant 5)
 20  - Fazit/Kundennutzen          (conclusion/takeaway)
 21  - 1_Zitat                     (quote)
 25  - 1_Zahlen                    (big number)
"""

import copy, zipfile, shutil, os
from pptx import Presentation
from pptx.util import Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

# ── Brand colours ────────────────────────────────────────────
NAVY    = RGBColor(0x00, 0x00, 0x50)
PURPLE  = RGBColor(0x8C, 0x19, 0xF5)
MAGENTA = RGBColor(0xFF, 0x00, 0xFF)
LIME    = RGBColor(0xAA, 0xFF, 0x00)
CYAN    = RGBColor(0x00, 0xAA, 0xFF)
WHITE   = RGBColor(0xFF, 0xFF, 0xFF)
ORANGE  = RGBColor(0xFF, 0x87, 0x00)   # TYPO3

CMS_COLORS = {
    'TYPO3':     RGBColor(0xFF, 0x87, 0x00),
    'Strapi':    RGBColor(0x49, 0x45, 0xFF),
    'Pimcore':   RGBColor(0x00, 0x9C, 0x3E),
    'Storyblok': RGBColor(0x00, 0xB9, 0x78),
    'Payload':   RGBColor(0x8B, 0x6F, 0xFF),
}

TEMPLATE = os.path.join(os.path.dirname(__file__), 'teamneusta_Masterpraese-20260312.potx')
FIXED    = '/tmp/claude-502/template_fixed.pptx'
OUTPUT   = os.path.join(os.path.dirname(__file__), 'talk.pptx')

# ── Fix POTX content type so python-pptx can open it ────────
with zipfile.ZipFile(TEMPLATE, 'r') as zin:
    with zipfile.ZipFile(FIXED, 'w', zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename == '[Content_Types].xml':
                data = data.replace(
                    b'presentationml.template.main',
                    b'presentationml.presentation.main'
                )
            zout.writestr(item, data)

prs = Presentation(FIXED)

# ── Remove all existing template slides ──────────────────────
sldIdLst = prs.slides._sldIdLst
NS = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
for sId in list(sldIdLst):
    rId = sId.get('{%s}id' % NS)
    try:
        prs.part.drop_rel(rId)
    except Exception:
        pass
    sldIdLst.remove(sId)

# ── Helpers ──────────────────────────────────────────────────
def slide(layout_idx):
    return prs.slides.add_slide(prs.slide_layouts[layout_idx])

def ph(sl, idx):
    """Return placeholder by idx, or None."""
    for p in sl.placeholders:
        if p.placeholder_format.idx == idx:
            return p
    return None

def set_title(sl, text, size=None, color=NAVY, uppercase=False):
    p = ph(sl, 0)
    if p is None:
        return
    tf = p.text_frame
    tf.clear()
    para = tf.paragraphs[0]
    run = para.add_run()
    run.text = text.upper() if uppercase else text
    run.font.color.rgb = color
    if size:
        run.font.size = Pt(size)

def set_content(sl, ph_idx, lines, size=None, color=NAVY, bold_first=False):
    """Set content placeholder. lines = list of (text, color, bold) or plain strings."""
    p = ph(sl, ph_idx)
    if p is None:
        return
    tf = p.text_frame
    tf.clear()
    tf.word_wrap = True
    for i, line in enumerate(lines):
        if isinstance(line, str):
            text, clr, bold = line, color, (bold_first and i == 0)
        else:
            text, clr, bold = line
        para = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        run = para.add_run()
        run.text = text
        run.font.color.rgb = clr
        run.font.bold = bold
        if size:
            run.font.size = Pt(size)

# ════════════════════════════════════════════════════════════
# SLIDE 1 — Title (layout 1: Violett)
# ════════════════════════════════════════════════════════════
sl = slide(1)
set_title(sl, 'Same Content, Different CMS')
p = ph(sl, 1)  # subtitle
if p:
    tf = p.text_frame; tf.clear()
    para = tf.paragraphs[0]
    run = para.add_run(); run.text = 'Who Does It Better?'
    run.font.color.rgb = WHITE
p = ph(sl, 10)  # date
if p:
    tf = p.text_frame; tf.clear()
    para = tf.paragraphs[0]
    run = para.add_run(); run.text = 'TYPO3 Developer Days 2026  ·  Susi Moog'
    run.font.color.rgb = WHITE; run.font.size = Pt(14)

# ════════════════════════════════════════════════════════════
# SLIDE 2 — Quote: Hybris (layout 21: 1_Zitat)
# ════════════════════════════════════════════════════════════
sl = slide(21)
set_title(sl, '— A colleague, Hybris (now SAP Commerce), ~2015', size=14)
p = ph(sl, 10)  # quote text
if p:
    tf = p.text_frame; tf.clear(); tf.word_wrap = True
    para = tf.paragraphs[0]
    run = para.add_run()
    run.text = '“CMS? That’s a trivial problem.\nEven Hybris has one built in.”'
    run.font.bold = True

# ════════════════════════════════════════════════════════════
# SLIDE 3 — 880+ (layout 25: 1_Zahlen — big number)
# ════════════════════════════════════════════════════════════
sl = slide(25)
set_title(sl, 'How many CMS exist today?')
p = ph(sl, 10)  # big number slot 1
if p:
    tf = p.text_frame; tf.clear()
    para = tf.paragraphs[0]; para.alignment = PP_ALIGN.CENTER
    run = para.add_run(); run.text = '880+'
    run.font.color.rgb = PURPLE; run.font.size = Pt(80); run.font.bold = True
p = ph(sl, 16)  # label slot 1
if p:
    tf = p.text_frame; tf.clear()
    para = tf.paragraphs[0]; para.alignment = PP_ALIGN.CENTER
    run = para.add_run(); run.text = 'content management systems'
    run.font.size = Pt(18)
# Slot 2: the punchline (shown after pause in live talk)
p = ph(sl, 11)
if p:
    tf = p.text_frame; tf.clear()
    para = tf.paragraphs[0]; para.alignment = PP_ALIGN.CENTER
    run = para.add_run(); run.text = 'Most of us have used maybe three.'
    run.font.size = Pt(24)
p = ph(sl, 17)
if p:
    tf = p.text_frame; tf.clear()
    para = tf.paragraphs[0]; para.alignment = PP_ALIGN.CENTER
    run = para.add_run(); run.text = 'I used five.'
    run.font.bold = True; run.font.size = Pt(20)

# ════════════════════════════════════════════════════════════
# SLIDE 4 — The setup (layout 6: Inhalt zweispaltig)
# ════════════════════════════════════════════════════════════
sl = slide(6)
set_title(sl, 'The setup')
set_content(sl, 1, [
    'ACME OUTDOOR',
    'One demo website — built in all five systems',
    'Two languages: EN + DE',
    'Thirteen content element types',
    'Live — no polished demo',
], bold_first=True)
set_content(sl, 13, [
    'Same 5 tasks per system',
    '1  Create a new page & place it in the navigation',
    '2  Add a hero section — headline, image, CTA button',
    '3  Upload an image & add alt text',
    '4  Add a German translation of the page headline',
    '5  Find a published page, change a headline, republish',
], bold_first=True)

# ════════════════════════════════════════════════════════════
# SLIDES 5–9 — System intros (layout 5: Inhalt_einspaltig)
# Use different Abschnittsfolie variants for variety
# ════════════════════════════════════════════════════════════
systems = [
    ('TYPO3',     'Enterprise CMS',              CMS_COLORS['TYPO3'],
     'You know this one. Or you think you do.',
     ['Open source PHP — 25+ years, still going strong',
      'Structured content via pages, content elements & TypoScript',
      'Multi-language, access rights, workflow — built in from the start',
      'The dominant CMS in German-speaking enterprise markets']),

    ('Strapi',    'Headless CMS',                CMS_COLORS['Strapi'],
     'API-first. The frontend is your problem.',
     ['Node.js — open source, self-hosted or cloud',
      'Define content types visually in the admin panel or in code',
      'REST & GraphQL out of the box — no rendering, no templates',
      'Editors work entirely in the admin panel — no preview without a frontend']),

    ('Pimcore',   'DXP',                         CMS_COLORS['Pimcore'],
     'Not just a CMS — a data platform.',
     ['PHP (Symfony-based) — Austrian company (Salzburg)',
      'CMS + PIM + DAM + e-commerce — one product',
      'Extremely powerful data modeling',
      'No longer open source — commercial licensing since ~2023']),

    ('Storyblok', 'Headless CMS + Visual Editor', CMS_COLORS['Storyblok'],
     'The one where editors actually enjoy the UI.',
     ['SaaS — cloud hosted, no infrastructure to manage',
      'Component-based content architecture ("Bloks")',
      'Live visual editor — see changes in real-time preview as you edit',
      'Strong with marketing teams; less control over hosting and data']),

    ('Payload',   'Code-first CMS',              CMS_COLORS['Payload'],
     'Define everything in TypeScript. The admin panel comes free.',
     ['TypeScript / Node.js — open source, self-hosted or cloud',
      'Schema defined entirely in code — no UI for content modeling',
      'Admin panel is auto-generated from your config — always in sync',
      'Developer-first: maximum control, no magic, no surprises']),
]

for i, (name, badge, color, tagline, bullets) in enumerate(systems):
    sl = slide(5)
    set_title(sl, name)
    lines = [('[%s]' % badge, PURPLE, False), (tagline, NAVY, True)] + \
            [(b, NAVY, False) for b in bullets]
    set_content(sl, 1, lines)

# ════════════════════════════════════════════════════════════
# SLIDE 10 — Let's find out (layout 13: 2_Abschnittsfolie)
# ════════════════════════════════════════════════════════════
sl = slide(13)
set_title(sl, "Let’s find out.")

# ════════════════════════════════════════════════════════════
# SLIDE 11 — Who does it better? (layout 5: Inhalt_einspaltig)
# ════════════════════════════════════════════════════════════
sl = slide(5)
set_title(sl, 'So — who does it better?')
set_content(sl, 1, [
    ('TYPO3     Structure, multi-language & access rights — solid and predictable',     CMS_COLORS['TYPO3'],     False),
    ('Strapi    Clean content type definition, developer-first admin experience',        CMS_COLORS['Strapi'],    False),
    ('Pimcore   Data modeling depth — if you can find your way around',                 CMS_COLORS['Pimcore'],   False),
    ('Storyblok Visual editing — editors see exactly what they’re building',       CMS_COLORS['Storyblok'], False),
    ('Payload   Developer control — TypeScript all the way down',                       CMS_COLORS['Payload'],   False),
    ('',                                                                                NAVY, False),
    ('Each one was best at something. None of them won everything.',                    PURPLE, True),
])

# ════════════════════════════════════════════════════════════
# SLIDE 12 — Core message (layout 20: Fazit/Kundennutzen)
# ════════════════════════════════════════════════════════════
sl = slide(20)
set_title(sl, 'Every CMS solved at least one problem brilliantly.')
p = ph(sl, 10)
if p:
    tf = p.text_frame; tf.clear(); tf.word_wrap = True
    para = tf.paragraphs[0]
    run = para.add_run()
    run.text = ('The question is whether you’re learning from it — or ignoring it.\n\n'
                'Even a text field per page taught someone something.')
    run.font.size = Pt(22)

# ════════════════════════════════════════════════════════════
# SLIDE 13 — Bring it back (layout 5: Inhalt_einspaltig)
# ════════════════════════════════════════════════════════════
sl = slide(5)
set_title(sl, 'Now what?')
set_content(sl, 1, [
    ("You’re going to keep using TYPO3. And that’s exactly the point.", NAVY, True),
    ('You just saw what’s possible elsewhere — now bring it back.', NAVY, False),
    ('',                                                                         NAVY, False),
    ('Loved the visual editing in Storyblok? Make it happen in TYPO3.',          NAVY, False),
    ('Impressed by Payload’s clean admin? Raise the bar for backend UX.',   NAVY, False),
    ('Noticed where TYPO3 makes editors work too hard? Open an issue. Build an extension. Start a discussion.', NAVY, False),
    ('TYPO3 is open source — good ideas don’t have to stay in other systems.', PURPLE, True),
], bold_first=True)

# ════════════════════════════════════════════════════════════
# SLIDE 14 — The editor (layout 20: Fazit/Kundennutzen)
# ════════════════════════════════════════════════════════════
sl = slide(20)
set_title(sl, 'The person you’re building for')
p = ph(sl, 10)
if p:
    tf = p.text_frame; tf.clear(); tf.word_wrap = True
    lines = [
        "Your editor spends hours every day in the system you built.",
        "",
        "They don’t know what TypoScript is.",
        "They don’t care about the content model.",
        "They just want to publish a page without calling you.",
        "",
        "Sit with them for five minutes before you call it done.\nDon’t explain. Don’t help. Just watch.",
    ]
    for i, line in enumerate(lines):
        para = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        run = para.add_run()
        run.text = line
        run.font.size = Pt(20)
        if 'just want' in line or 'Just watch' in line:
            run.font.bold = True

# ════════════════════════════════════════════════════════════
# SLIDE 15 — Thank you (layout 2: Futuregreen)
# ════════════════════════════════════════════════════════════
sl = slide(2)
set_title(sl, 'Thank you.')
p = ph(sl, 1)  # subtitle
if p:
    tf = p.text_frame; tf.clear()
    para = tf.paragraphs[0]
    run = para.add_run()
    run.text = 'Susi Moog  ·  s.moog@neusta.de  ·  team neusta'
p = ph(sl, 10)  # date
if p:
    tf = p.text_frame; tf.clear()
    para = tf.paragraphs[0]
    run = para.add_run(); run.text = 'TYPO3 Developer Days 2026'
    run.font.size = Pt(14)

# ════════════════════════════════════════════════════════════
# Save
# ════════════════════════════════════════════════════════════
prs.save(OUTPUT)
print('Saved: %s  (%d slides)' % (OUTPUT, len(prs.slides)))
