"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GARMENT_TYPES,
  LETTER_COLORS,
  LETTER_BACKGROUNDS,
  LETTER_FONTS,
  LETTER_OUTLINE_OPTIONS,
  LETTER_STYLES,
  STITCH_STYLES,
  PLACEMENTS,
  JACKET_PLACEMENTS,
  JACKET_COLORS,
  TEE_COLORS,
  SIZES,
  GREEK_LETTERS,
  garmentColorChoices,
  calculatePrice,
  calculateJacketPrice,
  resolveLetterStyleCanvasFont,
  resolveLetterStylePreviewFont,
  type GarmentTypeId,
  type LetterOutline,
  type Placement,
  type JacketPlacement,
  type LetterStyleId,
  type StitchStyleId,
  type Size,
  type PhotoColor,
} from "@/lib/garments";
import {
  renderGarment,
  renderLineJacket,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  JACKET_CANVAS_WIDTH,
  JACKET_CANVAS_HEIGHT,
} from "@/lib/garment-render";
import { useCart } from "@/lib/cart-context";

const EXAMPLE_COMBOS = ["ΑΒΓ", "ΔΕΖ", "ΘΙΚ", "ΞΟΠ", "ΣΤΥ"];

// Shared across component instances so each product photo is only fetched
// once. Rebinding onload per-call lets the latest draw() always fire.
const photoImageCache = new Map<string, HTMLImageElement>();
function getPhotoImage(src: string, onLoad: () => void): HTMLImageElement {
  let img = photoImageCache.get(src);
  if (!img) {
    img = new window.Image();
    img.src = src;
    photoImageCache.set(src, img);
  }
  img.onload = onLoad;
  return img;
}

function PhotoColorSwatches({
  colors,
  selectedId,
  onSelect,
}: {
  colors: PhotoColor[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {colors.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          title={c.label}
          className="flex w-16 flex-col items-center gap-1"
        >
          <span
            aria-label={c.label}
            className={`h-12 w-12 rounded-full border-2 bg-cover bg-center transition ${
              selectedId === c.id ? "border-gold scale-110" : "border-line"
            }`}
            style={{
              backgroundImage: `url(${c.image})`,
              backgroundColor: c.swatchHex,
              backgroundPosition: "center 15%",
              backgroundSize: "250%",
            }}
          />
          <span className="text-center text-[11px] leading-tight text-foreground/60">
            {c.label}
          </span>
        </button>
      ))}
    </div>
  );
}

export default function Customizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addLine } = useCart();

  const [garmentTypeId, setGarmentTypeId] = useState<GarmentTypeId>("hoodie");
  const [colorId, setColorId] = useState("navy");
  const [jacketColorId, setJacketColorId] = useState(JACKET_COLORS[0].id);
  const [teeColorId, setTeeColorId] = useState(TEE_COLORS[0].id);
  const [letters, setLetters] = useState("ΑΒΓ");
  const [letterColorId, setLetterColorId] = useState(LETTER_COLORS[0].id);
  const [backgroundColorId, setBackgroundColorId] = useState("none");
  const [fontId, setFontId] = useState(LETTER_FONTS[0].id);
  const [placement, setPlacement] = useState<Placement>("chest");
  const [jacketPlacement, setJacketPlacement] = useState<JacketPlacement>("left");
  const [outline, setOutline] = useState<LetterOutline>("outline");
  const [letterStyleId, setLetterStyleId] = useState<LetterStyleId>("standard");
  const [stitchStyleId, setStitchStyleId] = useState<StitchStyleId>("cross");
  const [size, setSize] = useState<Size>("M");
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const garment = useMemo(
    () => GARMENT_TYPES.find((g) => g.id === garmentTypeId)!,
    [garmentTypeId]
  );
  const isLineJacket = garment.customization === "lineJacket";
  const isPhotoStandard = garment.colorMode === "photo" && !isLineJacket;

  const colorChoices = useMemo(() => garmentColorChoices(garment), [garment]);
  const color = useMemo(
    () => colorChoices.find((c) => c.id === colorId) ?? colorChoices[0],
    [colorChoices, colorId]
  );

  // Keep the selected color valid when switching to a garment with a
  // restricted palette (e.g. the Line Jacket doesn't offer Cream).
  useEffect(() => {
    if (!colorChoices.some((c) => c.id === colorId)) {
      setColorId(colorChoices[0].id);
    }
  }, [colorChoices, colorId]);

  const jacketColor = useMemo(
    () => JACKET_COLORS.find((c) => c.id === jacketColorId) ?? JACKET_COLORS[0],
    [jacketColorId]
  );
  const teeColor = useMemo(
    () => TEE_COLORS.find((c) => c.id === teeColorId) ?? TEE_COLORS[0],
    [teeColorId]
  );

  const letterColor = useMemo(
    () => LETTER_COLORS.find((c) => c.id === letterColorId)!,
    [letterColorId]
  );
  const background = useMemo(
    () => LETTER_BACKGROUNDS.find((c) => c.id === backgroundColorId)!,
    [backgroundColorId]
  );
  const font = useMemo(
    () => LETTER_FONTS.find((f) => f.id === fontId)!,
    [fontId]
  );
  const letterStyle = useMemo(
    () => LETTER_STYLES.find((s) => s.id === letterStyleId)!,
    [letterStyleId]
  );
  const stitchStyle = useMemo(
    () => STITCH_STYLES.find((s) => s.id === stitchStyleId)!,
    [stitchStyleId]
  );

  const view = placement === "chest" ? "front" : "back";
  const price = isLineJacket
    ? calculateJacketPrice(garment, size, letterStyleId, stitchStyleId)
    : calculatePrice(garment, size);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (isLineJacket) {
      const image = getPhotoImage(jacketColor.image, draw);
      renderLineJacket(ctx, {
        image,
        letters,
        foregroundHex: letterColor.hex,
        backgroundHex: background.hex,
        canvasFont: resolveLetterStyleCanvasFont(letterStyleId, letters),
        placement: jacketPlacement,
        stitch: stitchStyleId,
      });
    } else if (isPhotoStandard) {
      const image = getPhotoImage(teeColor.image, draw);
      renderGarment(ctx, {
        garmentType: garmentTypeId,
        colorHex: teeColor.swatchHex,
        shadowHex: teeColor.swatchHex,
        view,
        letters,
        letterColorHex: letterColor.hex,
        canvasFont: font.canvasFont,
        placement,
        outline,
        image,
      });
    } else {
      renderGarment(ctx, {
        garmentType: garmentTypeId,
        colorHex: color.hex,
        shadowHex: color.shadowHex,
        view,
        letters,
        letterColorHex: letterColor.hex,
        canvasFont: font.canvasFont,
        placement,
        outline,
      });
    }
  }, [
    isLineJacket,
    isPhotoStandard,
    garmentTypeId,
    color,
    jacketColor,
    teeColor,
    letters,
    letterColor,
    background,
    font,
    letterStyle,
    placement,
    jacketPlacement,
    outline,
    stitchStyleId,
    view,
  ]);

  useEffect(() => {
    draw();
  }, [draw]);

  // The Old English font loads asynchronously; redraw once it's ready so the
  // canvas doesn't get stuck showing the fallback font.
  const drawRef = useRef(draw);
  drawRef.current = draw;
  useEffect(() => {
    document.fonts?.ready?.then(() => drawRef.current());
  }, []);

  const handleAddToBag = () => {
    const canvas = canvasRef.current;
    addLine({
      garmentName: garment.label,
      garmentColorName: isLineJacket
        ? jacketColor.label
        : isPhotoStandard
          ? teeColor.label
          : color.label,
      letters: letters.trim() || "ΑΒΓ",
      letterColorName: letterColor.label,
      fontLabel: isLineJacket ? letterStyle.label : font.label,
      placement: isLineJacket
        ? JACKET_PLACEMENTS.find((p) => p.id === jacketPlacement)!.label
        : PLACEMENTS.find((p) => p.id === placement)!.label,
      size,
      quantity,
      price,
      previewDataUrl: canvas?.toDataURL("image/png"),
      stitchLabel: isLineJacket ? stitchStyle.label : undefined,
      backgroundColorName: isLineJacket ? background.label : undefined,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const insertLetter = (letter: string) => {
    const max = isLineJacket ? 4 : 6;
    setLetters((prev) => (prev.length >= max ? prev : prev + letter));
  };

  let step = 0;
  const stepNum = () => ++step;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
      {/* Live preview */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <canvas
            ref={canvasRef}
            width={isLineJacket ? JACKET_CANVAS_WIDTH : CANVAS_WIDTH}
            height={isLineJacket ? JACKET_CANVAS_HEIGHT : CANVAS_HEIGHT}
            className="mx-auto h-auto w-full max-w-md"
            aria-label="Live preview of your custom apparel"
          />
          <p className="mt-3 text-center text-xs uppercase tracking-wide text-foreground/50">
            {isLineJacket ? "Front View" : view === "front" ? "Front View" : "Back View"} · Updates live as you customize
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground/60">Garment</span>
            <span className="font-medium">{garment.label}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-foreground/60">Size</span>
            <span className="font-medium">{size}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-foreground/60">Quantity</span>
            <span className="font-medium">{quantity}</span>
          </div>
          {isLineJacket && (
            <>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-foreground/60">Letter Style</span>
                <span className="font-medium">
                  {letterStyle.label}
                  {letterStyle.price > 0 ? ` (+$${letterStyle.price})` : ""}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-foreground/60">Stitch</span>
                <span className="font-medium">
                  {stitchStyle.label}
                  {stitchStyle.price > 0 ? ` (+$${stitchStyle.price})` : ""}
                </span>
              </div>
            </>
          )}
          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <span className="font-display text-lg">Total</span>
            <span className="font-display text-lg text-gold">
              ${(price * quantity).toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleAddToBag}
            className="mt-4 w-full rounded-full bg-navy py-3 text-sm font-semibold uppercase tracking-wide text-cream transition hover:bg-navy-light"
          >
            {justAdded ? "Added to Bag ✓" : "Add to Bag"}
          </button>
          <p className="mt-3 text-center text-xs text-foreground/40">
            Checkout connects to Shopify once your store is linked.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-8">
        <section>
          <h2 className="font-display text-lg mb-3">{stepNum()}. Choose Garment</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {GARMENT_TYPES.map((g) => (
              <button
                key={g.id}
                onClick={() => setGarmentTypeId(g.id)}
                className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                  garmentTypeId === g.id
                    ? "border-navy bg-navy text-cream"
                    : "border-line bg-white hover:border-navy/40"
                }`}
              >
                {g.label}
                <div className="text-xs opacity-70">${g.basePrice}</div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg mb-3">{stepNum()}. Garment Color</h2>
          {isLineJacket ? (
            <PhotoColorSwatches
              colors={JACKET_COLORS}
              selectedId={jacketColorId}
              onSelect={setJacketColorId}
            />
          ) : isPhotoStandard ? (
            <PhotoColorSwatches
              colors={TEE_COLORS}
              selectedId={teeColorId}
              onSelect={setTeeColorId}
            />
          ) : (
            <div className="flex flex-wrap gap-3">
              {colorChoices.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColorId(c.id)}
                  title={c.label}
                  aria-label={c.label}
                  className={`h-10 w-10 rounded-full border-2 transition ${
                    colorId === c.id ? "border-gold scale-110" : "border-line"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="font-display text-lg mb-3">{stepNum()}. Placement</h2>
          <div className="flex gap-3">
            {isLineJacket
              ? JACKET_PLACEMENTS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setJacketPlacement(p.id)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      jacketPlacement === p.id
                        ? "border-navy bg-navy text-cream"
                        : "border-line bg-white hover:border-navy/40"
                    }`}
                  >
                    {p.label}
                  </button>
                ))
              : PLACEMENTS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlacement(p.id)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      placement === p.id
                        ? "border-navy bg-navy text-cream"
                        : "border-line bg-white hover:border-navy/40"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg mb-3">{stepNum()}. Your Letters</h2>
          <input
            value={letters}
            onChange={(e) =>
              setLetters(e.target.value.slice(0, isLineJacket ? 4 : 6))
            }
            placeholder="Type or tap Greek letters"
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-lg tracking-widest"
            maxLength={isLineJacket ? 4 : 6}
          />
          {isLineJacket && (
            <p className="mt-1 text-xs text-foreground/40">
              Up to 4 letters, stacked vertically.
            </p>
          )}
          <div className="mt-3 grid grid-cols-8 gap-1.5 sm:grid-cols-12">
            {GREEK_LETTERS.map((l) => (
              <button
                key={l}
                onClick={() => insertLetter(l)}
                className="rounded-lg border border-line bg-white py-1.5 text-sm font-medium hover:border-navy/40"
              >
                {l}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-foreground/50">
            <span>Try:</span>
            {EXAMPLE_COMBOS.map((combo) => (
              <button
                key={combo}
                onClick={() => setLetters(isLineJacket ? combo.slice(0, 4) : combo)}
                className="rounded-full border border-line px-3 py-1 hover:border-navy/40"
              >
                {combo}
              </button>
            ))}
            <button
              onClick={() => setLetters("")}
              className="rounded-full border border-line px-3 py-1 hover:border-navy/40"
            >
              Clear
            </button>
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg mb-3">
            {stepNum()}. Letter {isLineJacket ? "Foreground " : ""}Color
          </h2>
          <div className="flex flex-wrap gap-3">
            {LETTER_COLORS.map((c) => (
              <button
                key={c.id}
                onClick={() => setLetterColorId(c.id)}
                title={c.label}
                aria-label={c.label}
                className={`h-9 w-9 rounded-full border-2 transition ${
                  letterColorId === c.id ? "border-gold scale-110" : "border-line"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </section>

        {isLineJacket && (
          <section>
            <h2 className="font-display text-lg mb-3">{stepNum()}. Letter Background Color</h2>
            <div className="flex flex-wrap gap-3">
              {LETTER_BACKGROUNDS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setBackgroundColorId(c.id)}
                  title={c.label}
                  aria-label={c.label}
                  className={`h-9 w-9 rounded-full border-2 transition ${
                    backgroundColorId === c.id ? "border-gold scale-110" : "border-line"
                  } ${c.hex === null ? "bg-[repeating-conic-gradient(#ddd_0%_25%,white_0%_50%)] bg-[length:8px_8px]" : ""}`}
                  style={c.hex ? { backgroundColor: c.hex } : undefined}
                />
              ))}
            </div>
          </section>
        )}

        {isLineJacket ? (
          <>
            <section>
              <h2 className="font-display text-lg mb-3">{stepNum()}. Letter Style</h2>
              <div className="grid grid-cols-2 gap-3">
                {LETTER_STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setLetterStyleId(s.id)}
                    className={`rounded-xl border px-3 py-3 text-left transition ${
                      letterStyleId === s.id
                        ? "border-navy bg-navy text-cream"
                        : "border-line bg-white hover:border-navy/40"
                    }`}
                  >
                    <span
                      className="block text-2xl leading-tight"
                      style={{ fontFamily: resolveLetterStylePreviewFont(s.id, letters) }}
                    >
                      {letters.trim() || "ΑΒΓ"}
                    </span>
                    <span className="mt-1 block text-xs opacity-80">
                      {s.label}
                      {s.price > 0 ? ` (+$${s.price})` : ""}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-display text-lg mb-3">{stepNum()}. Stitch Style</h2>
              <div className="grid grid-cols-2 gap-3">
                {STITCH_STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStitchStyleId(s.id)}
                    className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                      stitchStyleId === s.id
                        ? "border-navy bg-navy text-cream"
                        : "border-line bg-white hover:border-navy/40"
                    }`}
                  >
                    {s.label}
                    {s.price > 0 ? ` (+$${s.price})` : ""}
                  </button>
                ))}
              </div>
            </section>
          </>
        ) : (
          <section>
            <h2 className="font-display text-lg mb-3">{stepNum()}. Font & Finish</h2>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={fontId}
                onChange={(e) => setFontId(e.target.value)}
                className="rounded-xl border border-line bg-white px-3 py-2 text-sm"
              >
                {LETTER_FONTS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
              <select
                value={outline}
                onChange={(e) => setOutline(e.target.value as LetterOutline)}
                className="rounded-xl border border-line bg-white px-3 py-2 text-sm"
              >
                {LETTER_OUTLINE_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </section>
        )}

        <section>
          <h2 className="font-display text-lg mb-3">{stepNum()}. Size & Quantity</h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              {SIZES.map((s) => {
                const upcharge = garment.sizeUpcharges?.[s] ?? 0;
                return (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`flex h-12 w-12 flex-col items-center justify-center rounded-lg border text-sm font-semibold transition ${
                      size === s
                        ? "border-navy bg-navy text-cream"
                        : "border-line bg-white hover:border-navy/40"
                    }`}
                  >
                    {s}
                    {upcharge > 0 && (
                      <span className="text-[10px] font-normal opacity-70">
                        +${upcharge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-9 w-9 rounded-lg border border-line bg-white text-lg"
              >
                −
              </button>
              <span className="w-6 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(24, q + 1))}
                className="h-9 w-9 rounded-lg border border-line bg-white text-lg"
              >
                +
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
