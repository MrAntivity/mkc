"""Build Greek display glyphs from the supplied MKC lettering chart.
Requires fonttools, pillow, opencv-python-headless, brotli.
"""
from pathlib import Path
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen

root = Path(__file__).resolve().parents[1]
out = root / 'src/assets/fonts'
im = np.array(Image.open(out / 'old-english-greek-reference.png').convert('RGB'))
# Cell boundaries in the original chart. Preserve each glyph's proportions.
xs = [0, 62, 117, 169, 221, 270, 336]
ys = [0, 67, 146, 224, 286]
alphabet = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ'
glyphs = {'.notdef': TTGlyphPen(None).glyph(), 'space': TTGlyphPen(None).glyph()}
metrics = {'.notdef': (500, 0), 'space': (300, 0)}
cmap = {32: 'space'}
for i, letter in enumerate(alphabet):
    r, c = divmod(i, 6)
    cell = im[ys[r]:ys[r+1], xs[c]:xs[c+1]]
    # Purple ink against white; trace at 4x to retain antialiased edges.
    ink = (255 - cell[:, :, 1]).astype(np.uint8)
    ink = cv2.resize(ink, None, fx=4, fy=4, interpolation=cv2.INTER_CUBIC)
    mask = (ink > 128).astype(np.uint8) * 255
    contours, _ = cv2.findContours(mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    points = np.concatenate(contours).reshape(-1, 2)
    lo, hi = points.min(axis=0), points.max(axis=0)
    scale = 700 / (hi[1] - lo[1])
    pen = TTGlyphPen(None)
    for contour in contours:
        if abs(cv2.contourArea(contour)) < 4:
            continue
        contour = cv2.approxPolyDP(contour, 0.75, True).reshape(-1, 2)
        coords = [(round(50+(x-lo[0])*scale), round((hi[1]-y)*scale)) for x,y in contour]
        pen.moveTo(coords[0])
        for p in coords[1:]: pen.lineTo(p)
        pen.closePath()
    name = f'uni{ord(letter):04X}'
    glyphs[name] = pen.glyph()
    metrics[name] = (round((hi[0]-lo[0])*scale)+100, 50)
    cmap[ord(letter)] = name
    cmap[ord(letter.lower())] = name
cmap[ord('ς')] = cmap[ord('Σ')]
fb = FontBuilder(1000, isTTF=True)
fb.setupGlyphOrder(list(glyphs))
fb.setupCharacterMap(cmap)
fb.setupGlyf(glyphs)
fb.setupHorizontalMetrics(metrics)
fb.setupHorizontalHeader(ascent=850, descent=-150)
fb.setupNameTable({'familyName':'MKC Reference Greek','styleName':'Regular','uniqueFontIdentifier':'MKCReferenceGreek-Regular-1','fullName':'MKC Reference Greek Regular','psName':'MKCReferenceGreek-Regular'})
fb.setupOS2(sTypoAscender=850, sTypoDescender=-150, usWinAscent=850, usWinDescent=150, sCapHeight=700)
fb.setupPost()
fb.setupMaxp()
fb.font.flavor = 'woff2'
fb.save(out / 'mkc-reference-greek.woff2')
# A font-rendered specimen, separate from the source chart.
fb.font.flavor = None
fb.save('/tmp/mkc-reference-greek.ttf')
font = ImageFont.truetype('/tmp/mkc-reference-greek.ttf', 76)
preview = Image.new('RGB', (600, 400), 'white')
draw = ImageDraw.Draw(preview)
for i, char in enumerate(alphabet):
    row, col = divmod(i, 6)
    draw.text((col*100+50, row*100+80), char, font=font, fill='#9400ed', anchor='ms')
preview.save('/tmp/mkc-font-specimen.png')
assert all(ord(c) in fb.font.getBestCmap() for c in alphabet)
print('Built and checked all 24 Greek glyphs')
