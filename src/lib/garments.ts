import { oldEnglishFont, oldEnglishGreekFont, standardLetterFont } from "./fonts";
import { withBasePath } from "./base-path";

export type GarmentTypeId = "tee" | "hoodie" | "crewneck" | "quarterZip" | "lineJacket";

export type CustomizationMode = "standard" | "lineJacket";

export type GarmentType = {
  id: GarmentTypeId;
  label: string;
  basePrice: number;
  // Maps to a real Shopify product handle once the store is connected.
  shopifyProductHandle: string;
  // Which customizer UI + canvas renderer this garment uses.
  customization: CustomizationMode;
  // Restricts the color swatches shown for this garment. Omit for "all colors".
  colorIds?: string[];
  // Per-size upcharge, added to basePrice. Sizes not listed cost +$0.
  sizeUpcharges?: Partial<Record<Size, number>>;
};

export const GARMENT_TYPES: GarmentType[] = [
  {
    id: "tee",
    label: "Classic Tee",
    basePrice: 24,
    shopifyProductHandle: "custom-greek-tee",
    customization: "standard",
    sizeUpcharges: { XL: 3, "2XL": 5, "3XL": 7 },
  },
  {
    id: "hoodie",
    label: "Hoodie",
    basePrice: 48,
    shopifyProductHandle: "custom-greek-hoodie",
    customization: "standard",
    sizeUpcharges: { XL: 3, "2XL": 5, "3XL": 7 },
  },
  {
    id: "crewneck",
    label: "Crewneck",
    basePrice: 42,
    shopifyProductHandle: "custom-greek-crewneck",
    customization: "standard",
    sizeUpcharges: { XL: 3, "2XL": 5, "3XL": 7 },
  },
  {
    id: "quarterZip",
    label: "Quarter-Zip",
    basePrice: 52,
    shopifyProductHandle: "custom-greek-quarter-zip",
    customization: "standard",
    sizeUpcharges: { XL: 3, "2XL": 5, "3XL": 7 },
  },
  {
    id: "lineJacket",
    label: "Line Jacket",
    basePrice: 45,
    shopifyProductHandle: "custom-greek-line-jacket",
    customization: "lineJacket",
    sizeUpcharges: { "2XL": 2, "3XL": 2 },
  },
];

export type JacketColor = {
  id: string;
  label: string;
  // Small hex used for the color-swatch button; the real photo is used for
  // the actual live preview.
  swatchHex: string;
  image: string;
};

// Real product photography, one per color (public/products/line-jacket).
export const JACKET_COLORS: JacketColor[] = [
  { id: "black", label: "Black", swatchHex: "#1c1c1c", image: "/products/line-jacket/black.jpg" },
  { id: "navy", label: "Navy", swatchHex: "#1c2a4a", image: "/products/line-jacket/navy.jpg" },
  { id: "royalBlue", label: "Royal Blue", swatchHex: "#1e3fae", image: "/products/line-jacket/royal-blue.jpg" },
  { id: "columbiaBlue", label: "Columbia Blue", swatchHex: "#9fc6e0", image: "/products/line-jacket/columbia-blue.jpg" },
  { id: "maroon", label: "Maroon", swatchHex: "#6c1f2c", image: "/products/line-jacket/maroon.jpg" },
  { id: "red", label: "Red", swatchHex: "#b31f24", image: "/products/line-jacket/red.jpg" },
  { id: "purple", label: "Purple", swatchHex: "#4b2e83", image: "/products/line-jacket/purple.jpg" },
  { id: "darkGreen", label: "Dark Green", swatchHex: "#1f3d2b", image: "/products/line-jacket/dark-green.jpg" },
  { id: "gold", label: "Gold", swatchHex: "#c9a227", image: "/products/line-jacket/gold.jpg" },
  { id: "khaki", label: "Khaki", swatchHex: "#c3b091", image: "/products/line-jacket/khaki.jpg" },
  { id: "graphite", label: "Graphite", swatchHex: "#4b4b4d", image: "/products/line-jacket/graphite.jpg" },
  { id: "brown", label: "Brown", swatchHex: "#4b3621", image: "/products/line-jacket/brown.jpg" },
  { id: "lightPink", label: "Light Pink", swatchHex: "#f0b8c8", image: "/products/line-jacket/light-pink.jpg" },
  { id: "white", label: "White", swatchHex: "#f5f5f0", image: "/products/line-jacket/white.jpg" },
].map((c) => ({ ...c, image: withBasePath(c.image) }));

export type GarmentColor = {
  id: string;
  label: string;
  hex: string;
  // Shading used to fake fabric depth on the canvas mockup.
  shadowHex: string;
};

export const GARMENT_COLORS: GarmentColor[] = [
  { id: "navy", label: "Navy", hex: "#1c2a4a", shadowHex: "#111a30" },
  { id: "royal", label: "Royal Blue", hex: "#1e3fae", shadowHex: "#13277c" },
  { id: "black", label: "Black", hex: "#1a1a1a", shadowHex: "#000000" },
  { id: "white", label: "White", hex: "#f7f5ef", shadowHex: "#d9d5c8" },
  { id: "cream", label: "Cream", hex: "#efe6d0", shadowHex: "#d3c7a4" },
  { id: "maroon", label: "Maroon", hex: "#6c1f2c", shadowHex: "#4a1420" },
  { id: "forest", label: "Forest Green", hex: "#1f4230", shadowHex: "#122a1e" },
  { id: "gold", label: "Gold", hex: "#c9a227", shadowHex: "#9c7d1c" },
  { id: "heatherGray", label: "Heather Gray", hex: "#9a9a9c", shadowHex: "#767678" },
];

export function garmentColorChoices(garment: GarmentType): GarmentColor[] {
  if (!garment.colorIds) return GARMENT_COLORS;
  return GARMENT_COLORS.filter((c) => garment.colorIds!.includes(c.id));
}

export type LetterColor = {
  id: string;
  label: string;
  hex: string;
};

export const LETTER_COLORS: LetterColor[] = [
  { id: "gold", label: "Gold", hex: "#c9a227" },
  { id: "white", label: "White", hex: "#ffffff" },
  { id: "black", label: "Black", hex: "#111111" },
  { id: "navy", label: "Navy", hex: "#1c2a4a" },
  { id: "royal", label: "Royal Blue", hex: "#1e3fae" },
  { id: "maroon", label: "Maroon", hex: "#6c1f2c" },
  { id: "silver", label: "Silver", hex: "#c7c9cc" },
];

// "None" backing means the letters sit directly on the jacket with no patch.
export const LETTER_BACKGROUNDS: { id: string; label: string; hex: string | null }[] = [
  { id: "none", label: "None", hex: null },
  ...LETTER_COLORS.map((c) => ({ id: c.id, label: c.label, hex: c.hex })),
];

export type LetterFont = {
  id: string;
  label: string;
  // System-safe stack so the live preview never waits on a network font.
  canvasFont: string;
};

export const LETTER_FONTS: LetterFont[] = [
  { id: "collegiate", label: "Collegiate Block", canvasFont: '700 1em Impact, "Arial Black", sans-serif' },
  { id: "serif", label: "Classic Serif", canvasFont: '700 1em Georgia, "Times New Roman", serif' },
  { id: "script", label: "Script", canvasFont: 'italic 600 1em "Segoe Script", "Brush Script MT", cursive' },
  { id: "sans", label: "Modern Sans", canvasFont: '700 1em "Arial", sans-serif' },
];

export type Placement = "chest" | "back";

export const PLACEMENTS: { id: Placement; label: string }[] = [
  { id: "chest", label: "Left Chest" },
  { id: "back", label: "Full Back" },
];

// Line Jacket letters are stacked vertically down the left or right side of
// the placket, not laid out across the chest or back.
export type JacketPlacement = "left" | "right";

export const JACKET_PLACEMENTS: { id: JacketPlacement; label: string }[] = [
  { id: "left", label: "Left (Over Heart)" },
  { id: "right", label: "Right" },
];

export type LetterStyleId = "standard" | "oldEnglish";

export type LetterStyleOption = {
  id: LetterStyleId;
  label: string;
  price: number;
};

export const LETTER_STYLES: LetterStyleOption[] = [
  { id: "standard", label: "Standard English", price: 0 },
  { id: "oldEnglish", label: "Old English", price: 15 },
];

function containsGreek(text: string): boolean {
  return /[Ͱ-Ͽἀ-῿]/.test(text);
}

// UnifrakturMaguntia (true blackletter) has no Greek glyphs, so "Old
// English" falls back to an ornate high-contrast serif when the letters are
// Greek. Standard uses one bold, Greek-safe font either way.
export function resolveLetterStylePreviewFont(styleId: LetterStyleId, sampleText: string): string {
  if (styleId === "oldEnglish") {
    return containsGreek(sampleText)
      ? oldEnglishGreekFont.style.fontFamily
      : oldEnglishFont.style.fontFamily;
  }
  return standardLetterFont.style.fontFamily;
}

export function resolveLetterStyleCanvasFont(styleId: LetterStyleId, sampleText: string): string {
  if (styleId === "oldEnglish") {
    return containsGreek(sampleText)
      ? `900 1em ${oldEnglishGreekFont.style.fontFamily}`
      : `400 1em ${oldEnglishFont.style.fontFamily}`;
  }
  return `900 1em ${standardLetterFont.style.fontFamily}`;
}

export type StitchStyleId = "cross" | "satin";

export const STITCH_STYLES: { id: StitchStyleId; label: string; price: number }[] = [
  { id: "cross", label: "Cross Stitch", price: 0 },
  { id: "satin", label: "Satin Stitch", price: 10 },
];

export const SIZES = ["S", "M", "L", "XL", "2XL", "3XL"] as const;
export type Size = (typeof SIZES)[number];

export const GREEK_LETTERS = [
  "Α", "Β", "Γ", "Δ", "Ε", "Ζ", "Η", "Θ", "Ι", "Κ", "Λ", "Μ",
  "Ν", "Ξ", "Ο", "Π", "Ρ", "Σ", "Τ", "Υ", "Φ", "Χ", "Ψ", "Ω",
] as const;

export const LETTER_OUTLINE_OPTIONS = [
  { id: "none", label: "None" },
  { id: "outline", label: "Stitched Outline" },
  { id: "shadow", label: "Drop Shadow" },
] as const;
export type LetterOutline = (typeof LETTER_OUTLINE_OPTIONS)[number]["id"];

export function calculatePrice(garment: GarmentType, size: Size) {
  const sizeUpcharge = garment.sizeUpcharges?.[size] ?? 0;
  return garment.basePrice + sizeUpcharge;
}

export function calculateJacketPrice(
  garment: GarmentType,
  size: Size,
  letterStyleId: LetterStyleId,
  stitchStyleId: StitchStyleId
) {
  const sizeUpcharge = garment.sizeUpcharges?.[size] ?? 0;
  const letterStyle = LETTER_STYLES.find((s) => s.id === letterStyleId)!;
  const stitchStyle = STITCH_STYLES.find((s) => s.id === stitchStyleId)!;
  return garment.basePrice + sizeUpcharge + letterStyle.price + stitchStyle.price;
}
