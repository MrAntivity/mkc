import localFont from "next/font/local";
import { UnifrakturMaguntia, Inter } from "next/font/google";

// Used for the Line Jacket's "Old English" letter style when the letters are
// Latin (e.g. "MKC"). UnifrakturMaguntia has no Greek glyphs at all.
export const oldEnglishFont = UnifrakturMaguntia({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// Greek display glyphs traced from the supplied MKC Old English chart.
// Latin text uses UnifrakturMaguntia as the next font in the canvas stack.
export const oldEnglishGreekFont = localFont({
  src: "../assets/fonts/mkc-reference-greek.woff2",
  weight: "400",
  display: "swap",
  adjustFontFallback: false,
});

// Bold block font for the "Standard" letter style. Explicitly supports Greek
// (unlike most heavy display faces), so it renders correctly either way.
export const standardLetterFont = Inter({
  weight: "900",
  subsets: ["latin", "greek"],
  display: "swap",
});
