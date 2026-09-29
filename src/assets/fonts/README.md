# MKC Reference Greek

`mkc-reference-greek.woff2` contains the 24 Greek letterforms traced from the user-supplied Old English chart in `old-english-greek-reference.png`. The original reference is preserved unchanged. This is a reference-derived preview font, not an identified original manufacturer font or embroidery production file.

Uppercase and lowercase Greek inputs share the chart's uppercase designs; final sigma maps to sigma. Latin letters fall through to the separate UnifrakturMaguntia font. The font contains no garment or thread colors: the live canvas applies selected colors and outlines.

Rebuild with `python scripts/build-reference-font.py` after installing `fonttools pillow opencv-python-headless brotli` in a Python environment. The script also writes a font-rendered specimen to `/tmp/mkc-font-specimen.png`.
