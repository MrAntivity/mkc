import type {
  GarmentTypeId,
  JacketPlacement,
  LetterOutline,
  Placement,
  StitchStyleId,
} from "./garments";

export const CANVAS_WIDTH = 520;
export const CANVAS_HEIGHT = 640;

const CX = CANVAS_WIDTH / 2;

export type RenderParams = {
  garmentType: GarmentTypeId;
  colorHex: string;
  shadowHex: string;
  view: "front" | "back";
  letters: string;
  letterColorHex: string;
  canvasFont: string;
  placement: Placement;
  outline: LetterOutline;
};

// Matches the real product photos in public/products/line-jacket (640x700)
// so the image is never stretched or cropped.
export const JACKET_CANVAS_WIDTH = 640;
export const JACKET_CANVAS_HEIGHT = 700;

export type LineJacketRenderParams = {
  image: HTMLImageElement | null;
  letters: string;
  foregroundHex: string;
  backgroundHex: string | null;
  canvasFont: string;
  placement: JacketPlacement;
  stitch: StitchStyleId;
};

function bodyPath(sleeve: "short" | "long"): Path2D {
  const p = new Path2D();
  p.moveTo(210, 96);
  p.quadraticCurveTo(CX, 128, 310, 96);
  p.lineTo(360, 108);

  if (sleeve === "short") {
    p.lineTo(430, 200);
    p.quadraticCurveTo(440, 230, 410, 250);
    p.lineTo(345, 230);
  } else {
    p.lineTo(452, 235);
    p.quadraticCurveTo(462, 260, 440, 280);
    p.lineTo(400, 440);
    p.quadraticCurveTo(398, 458, 378, 452);
    p.lineTo(345, 230);
  }

  p.lineTo(365, 560);
  p.quadraticCurveTo(365, 582, 345, 582);
  p.lineTo(175, 582);
  p.quadraticCurveTo(155, 582, 155, 560);
  p.lineTo(175, 230);

  if (sleeve === "short") {
    p.lineTo(110, 250);
    p.quadraticCurveTo(80, 230, 90, 200);
  } else {
    p.lineTo(142, 452);
    p.quadraticCurveTo(122, 458, 120, 440);
    p.lineTo(68, 280);
    p.quadraticCurveTo(58, 260, 68, 235);
  }

  p.lineTo(160, 108);
  p.closePath();
  return p;
}

function drawHood(ctx: CanvasRenderingContext2D, colorHex: string, shadowHex: string) {
  ctx.save();
  ctx.fillStyle = shadowHex;
  ctx.beginPath();
  ctx.moveTo(190, 110);
  ctx.quadraticCurveTo(200, 40, CX, 36);
  ctx.quadraticCurveTo(320, 40, 330, 110);
  ctx.quadraticCurveTo(CX, 138, 190, 110);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = colorHex;
  ctx.beginPath();
  ctx.moveTo(202, 108);
  ctx.quadraticCurveTo(210, 54, CX, 50);
  ctx.quadraticCurveTo(310, 54, 318, 108);
  ctx.quadraticCurveTo(CX, 128, 202, 108);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawDrawstrings(ctx: CanvasRenderingContext2D, shadowHex: string) {
  ctx.save();
  ctx.strokeStyle = shadowHex;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  for (const dx of [-16, 16]) {
    ctx.beginPath();
    ctx.moveTo(CX + dx, 108);
    ctx.lineTo(CX + dx * 1.4, 160);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(CX + dx * 1.4, 168, 5, 0, Math.PI * 2);
    ctx.fillStyle = shadowHex;
    ctx.fill();
  }
  ctx.restore();
}

function drawPocket(ctx: CanvasRenderingContext2D, shadowHex: string) {
  ctx.save();
  ctx.strokeStyle = shadowHex;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(190, 370);
  ctx.quadraticCurveTo(CX, 350, 330, 370);
  ctx.lineTo(330, 430);
  ctx.quadraticCurveTo(CX, 452, 190, 430);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function drawRibKnit(ctx: CanvasRenderingContext2D, shadowHex: string) {
  ctx.save();
  ctx.strokeStyle = shadowHex;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(216, 100);
  ctx.quadraticCurveTo(CX, 122, 304, 100);
  ctx.stroke();
  ctx.restore();
}

function drawZipper(ctx: CanvasRenderingContext2D, shadowHex: string) {
  ctx.save();
  ctx.strokeStyle = shadowHex;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(CX, 108);
  ctx.lineTo(CX, 400);
  ctx.stroke();
  ctx.fillStyle = shadowHex;
  ctx.fillRect(CX - 6, 190, 12, 18);

  ctx.beginPath();
  ctx.moveTo(CX - 30, 96);
  ctx.lineTo(CX, 118);
  ctx.lineTo(CX + 30, 96);
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.restore();
}

function fitFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  startSize: number,
  fontStack: string
) {
  let size = startSize;
  while (size > 12) {
    ctx.font = fontStack.replace("1em", `${size}px`);
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 2;
  }
  return size;
}

function drawLetters(
  ctx: CanvasRenderingContext2D,
  params: RenderParams,
  centerX: number,
  centerY: number,
  maxWidth: number,
  startSize: number
) {
  const text = params.letters.trim() || "ΑΒΓ";
  const size = fitFontSize(ctx, text, maxWidth, startSize, params.canvasFont);
  ctx.font = params.canvasFont.replace("1em", `${size}px`);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if (params.outline === "shadow") {
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillText(text, centerX + 3, centerY + 4);
  }

  if (params.outline === "outline") {
    ctx.lineWidth = Math.max(2, size * 0.06);
    ctx.strokeStyle =
      params.letterColorHex.toLowerCase() === "#ffffff" ? "#1c2a4a" : "#ffffff";
    ctx.strokeText(text, centerX, centerY);
  }

  ctx.fillStyle = params.letterColorHex;
  ctx.fillText(text, centerX, centerY);
}

export function renderGarment(ctx: CanvasRenderingContext2D, params: RenderParams) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // grounding shadow
  ctx.save();
  ctx.fillStyle = "rgba(15,24,48,0.08)";
  ctx.beginPath();
  ctx.ellipse(CX, 600, 150, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const sleeve = params.garmentType === "tee" ? "short" : "long";
  const isHoodie = params.garmentType === "hoodie";
  const isQuarterZip = params.garmentType === "quarterZip";
  const isCrew = params.garmentType === "crewneck";

  if (isHoodie) drawHood(ctx, params.colorHex, params.shadowHex);

  const path = bodyPath(sleeve);

  // shading gradient for fabric depth
  const gradient = ctx.createLinearGradient(0, 90, 0, CANVAS_HEIGHT);
  gradient.addColorStop(0, params.colorHex);
  gradient.addColorStop(1, params.shadowHex);
  ctx.save();
  ctx.fillStyle = gradient;
  ctx.fill(path);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(0,0,0,0.25)";
  ctx.stroke(path);
  ctx.restore();

  if (params.view === "front") {
    if (isCrew) drawRibKnit(ctx, params.shadowHex);
    if (isQuarterZip) drawZipper(ctx, params.shadowHex);
    if (isHoodie) {
      drawDrawstrings(ctx, params.shadowHex);
      drawPocket(ctx, params.shadowHex);
    }
  }

  // letters
  if (params.view === "front" && params.placement === "chest") {
    drawLetters(ctx, params, 200, 230, 130, 64);
  } else if (params.view === "back" && params.placement === "back") {
    drawLetters(ctx, params, CX, 320, 300, 120);
  }
}

// ---------------------------------------------------------------------------
// Line Jacket (coach / snap-front jacket): real product photography with
// letters composited on top, stacked vertically down the left (over heart)
// or right side of the placket.
// ---------------------------------------------------------------------------

function shadeHex(hex: string, amount: number): string {
  const n = hex.replace("#", "");
  const num = parseInt(n.length === 3 ? n.split("").map((c) => c + c).join("") : n, 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp(((num >> 16) & 255) + amount);
  const g = clamp(((num >> 8) & 255) + amount);
  const b = clamp((num & 255) + amount);
  return `rgb(${r}, ${g}, ${b})`;
}

function drawVerticalLetters(
  ctx: CanvasRenderingContext2D,
  params: LineJacketRenderParams,
  centerX: number
) {
  const text = (params.letters.trim() || "ΑΒΓ").split("").slice(0, 4);
  const zoneTop = 180;
  const zoneBottom = 440;
  const zoneHeight = zoneBottom - zoneTop;
  const slot = zoneHeight / text.length;
  const fontSize = Math.max(34, Math.min(114, slot * 1.02));

  ctx.font = params.canvasFont.replace("1em", `${fontSize}px`);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";

  text.forEach((letter, i) => {
    const y = zoneTop + slot * i + slot / 2;

    // Background color renders as a border traced around the letter itself
    // (like an embroidered twill outline), not a patch behind it.
    if (params.backgroundHex) {
      ctx.lineWidth = fontSize * 0.22;
      ctx.strokeStyle = params.backgroundHex;
      ctx.strokeText(letter, centerX, y);
    }

    if (params.stitch === "satin") {
      ctx.lineWidth = fontSize * 0.08;
      ctx.strokeStyle = shadeHex(params.foregroundHex, -40);
      ctx.strokeText(letter, centerX, y);
      ctx.fillStyle = params.foregroundHex;
      ctx.fillText(letter, centerX, y);
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillText(letter, centerX - 1, y - 1);
    } else {
      ctx.setLineDash([fontSize * 0.09, fontSize * 0.07]);
      ctx.lineWidth = Math.max(1.5, fontSize * 0.05);
      ctx.strokeStyle =
        params.backgroundHex ??
        (params.foregroundHex.toLowerCase() === "#ffffff"
          ? "#33322c"
          : "rgba(255,255,255,0.8)");
      ctx.strokeText(letter, centerX, y);
      ctx.setLineDash([]);
      ctx.fillStyle = params.foregroundHex;
      ctx.fillText(letter, centerX, y);
    }
  });
}

export function renderLineJacket(ctx: CanvasRenderingContext2D, params: LineJacketRenderParams) {
  ctx.clearRect(0, 0, JACKET_CANVAS_WIDTH, JACKET_CANVAS_HEIGHT);

  if (params.image && params.image.complete && params.image.naturalWidth > 0) {
    ctx.drawImage(params.image, 0, 0, JACKET_CANVAS_WIDTH, JACKET_CANVAS_HEIGHT);
  }

  // "Left (Over Heart)" is the wearer's left, which appears on the right
  // side of a front-facing photo — mirrored from how it looks on-screen.
  const centerX = params.placement === "left" ? 445 : 265;
  drawVerticalLetters(ctx, params, centerX);
}
