import { UnifrakturMaguntia, Inter, Noto_Serif } from "next/font/google";

// Used for the Line Jacket's "Old English" letter style when the letters are
// Latin (e.g. "MKC"). UnifrakturMaguntia has no Greek glyphs at all.
export const oldEnglishFont = UnifrakturMaguntia({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// There is no free "Old English" (blackletter) font with Greek glyph
// coverage, so Greek "Old English" letters fall back to this traditional
// serif instead of silently dropping to a generic system font. Verified
// empirically (measureText + visual check on Θ/Ω) to render real, distinct
// Greek glyphs rather than falling back to a generic sans.
export const oldEnglishGreekFont = Noto_Serif({
  weight: "700",
  subsets: ["latin", "greek"],
  display: "swap",
});

// Bold block font for the "Standard" letter style. Explicitly supports Greek
// (unlike most heavy display faces), so it renders correctly either way.
export const standardLetterFont = Inter({
  weight: "900",
  subsets: ["latin", "greek"],
  display: "swap",
});
