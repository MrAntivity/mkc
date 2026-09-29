"use client";
import { useEffect, useState, type RefObject } from "react";
import {
  buildScene,
  garmentFields,
  inferView,
  type View,
} from "@/lib/live-preview";
import type { ProductOptions, Values } from "@/lib/product-options";
import { withBasePath } from "@/lib/base-path";
import type { CatalogProduct } from "@/lib/catalog";
import {
  oldEnglishFont,
  oldEnglishGreekFont,
  standardLetterFont,
} from "@/lib/fonts";
const photos = new Map<string, Promise<HTMLImageElement>>();
function photo(url: string) {
  let promise = photos.get(url);
  if (!promise) {
    promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new window.Image();
      image.crossOrigin = "anonymous";
      image.onload = () => resolve(image);
      image.onerror = () => {
        photos.delete(url);
        reject(new Error("Image could not load"));
      };
      image.src = url;
    });
    photos.set(url, promise);
  }
  return promise;
}
const pdfPreviews = new WeakMap<File, Promise<string>>();
function pdfPreview(file: File): Promise<string> {
  let pending = pdfPreviews.get(file);
  if (!pending) {
    pending = (async () => {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = withBasePath(
        "/vendor/pdfjs/pdf.worker.min.mjs",
      );
      const task = pdfjs.getDocument({
        data: new Uint8Array(await file.arrayBuffer()),
        isEvalSupported: false,
      });
      try {
        const doc = await task.promise;
        const page = await doc.getPage(1);
        const original = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({
          scale: Math.min(2, 1400 / Math.max(original.width, original.height)),
        });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        await page.render({ canvas, viewport }).promise;
        return canvas.toDataURL("image/png");
      } finally {
        await task.destroy();
      }
    })();
    pdfPreviews.set(file, pending);
    pending.catch(() => pdfPreviews.delete(file));
  }
  return pending;
}
export default function LivePreview({
  product,
  config,
  values,
  artwork,
  view,
  onViewChange,
  activeField,
  canvasRef,
  onReady,
}: {
  product: CatalogProduct;
  config: ProductOptions;
  values: Values;
  artwork: Record<string, File>;
  view: View;
  onViewChange: (v: View) => void;
  activeField: string;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onReady: (ready: boolean, failed?: boolean) => void;
}) {
  const groups = garmentFields(config);
  const availableViews = new Set<View>([
    "front",
    ...config.panels.map((p) => inferView(p.title)),
  ]);
  const [manualGroup, setManualGroup] = useState({ id: "", field: "" });
  const activePanel = config.panels.find((p) =>
    p.fields.some((f) => f.id === activeField),
  );
  const activeGroup = groups.find(
    (g) => activePanel?.title.startsWith(g.group) && g.group,
  )?.field.id;
  const group =
    (manualGroup.field === activeField ? manualGroup.id : "") ||
    activeGroup ||
    groups[0]?.field.id;
  const scene = buildScene(
    config,
    values,
    view,
    product.image,
    product.collection,
    product.title,
    group,
  );
  const [status, setStatus] = useState("Loading preview…");
  const signature = JSON.stringify(scene);
  useEffect(() => {
    let cancelled = false;
    const urls: string[] = [];
    async function draw() {
      await Promise.resolve();
      if (cancelled) return;
      setStatus("Updating preview…");
      onReady(false);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const buffer = document.createElement("canvas");
      buffer.width = 900;
      buffer.height = 900;
      const painter = buffer.getContext("2d");
      if (!painter) return;
      painter.fillStyle = "#fff";
      painter.fillRect(0, 0, 900, 900);
      try {
        const current: ReturnType<typeof buildScene> = JSON.parse(signature);
        const base = await photo(current.base);
        await document.fonts.ready;
        if (cancelled) return;
        const scale = Math.min(900 / base.width, 900 / base.height);
        const photoWidth = base.width * scale,
          photoHeight = base.height * scale;
        const offsetX = (900 - photoWidth) / 2,
          offsetY = (900 - photoHeight) / 2;
        painter.drawImage(base, offsetX, offsetY, photoWidth, photoHeight);
        painter.save();
        painter.translate(offsetX, offsetY);
        painter.scale(photoWidth / 900, photoHeight / 900);
        let unsupported = false;
        for (const mark of current.marks) {
          let src = mark.image;
          if (mark.fileId && artwork[mark.fileId]) {
            const file = artwork[mark.fileId];
            if (file.type.startsWith("image/")) {
              src = URL.createObjectURL(file);
              urls.push(src);
            } else if (
              file.type === "application/pdf" ||
              /\.pdf$/i.test(file.name)
            ) {
              try {
                src = await pdfPreview(file);
              } catch {
                unsupported = true;
              }
            } else {
              unsupported = true;
            }
          }
          painter.save();
          painter.translate(mark.x * 900, mark.y * 900);
          painter.rotate(mark.rotation);
          const w = mark.width * 900,
            h = mark.height * 900;
          if (src) {
            try {
              const img = await photo(src);
              const scale = Math.min(w / img.width, h / img.height);
              painter.drawImage(
                img,
                (-img.width * scale) / 2,
                (-img.height * scale) / 2,
                img.width * scale,
                img.height * scale,
              );
            } catch {
              unsupported = true;
            }
          }
          if (mark.text) {
            const isOld = /old english|gothic/i.test(mark.font);
            const family = isOld
              ? /[Α-ω]/.test(mark.text)
                ? oldEnglishGreekFont.style.fontFamily
                : oldEnglishFont.style.fontFamily
              : /script|brush|cursive/i.test(mark.font)
                ? "cursive"
                : /serif|times|roman/i.test(mark.font)
                  ? "Georgia"
                  : standardLetterFont.style.fontFamily;
            const lines = mark.vertical
              ? Array.from(mark.text)
              : mark.text.split("\n");
            let size = Math.min(
              (h / lines.length) * 0.84,
              mark.vertical ? w * 0.9 : 80,
            );
            const font = () => `${isOld ? "400" : "900"} ${size}px ${family}`;
            painter.font = font();
            const measured = Math.max(
              ...lines.map((t) => painter.measureText(t).width),
            );
            if (measured > w * 0.95) size *= (w * 0.95) / measured;
            painter.font = font();
            painter.textAlign = "center";
            painter.textBaseline = "middle";
            painter.lineJoin = "round";
            if (mark.box) {
              painter.fillStyle =
                mark.background === "transparent" ? "#b72d32" : mark.background;
              painter.fillRect(-w / 2 - 8, -h / 2 - 4, w + 16, h + 8);
            }
            const lineHeight = h / lines.length;
            lines.forEach((text, i) => {
              const y = (i - (lines.length - 1) / 2) * lineHeight;
              if (!mark.box && mark.background !== "transparent") {
                painter.strokeStyle = mark.background;
                painter.lineWidth = Math.max(2, size * 0.1);
                painter.strokeText(text, 0, y);
              }
              painter.fillStyle = mark.color;
              painter.fillText(text, 0, y);
              if (mark.stitch) {
                painter.strokeStyle = /satin/i.test(mark.stitch)
                  ? "#ffffff88"
                  : "#00000066";
                painter.lineWidth = Math.max(0.5, size * 0.015);
                painter.setLineDash(/satin/i.test(mark.stitch) ? [] : [1, 2]);
                painter.strokeText(text, 0, y);
                painter.setLineDash([]);
              }
            });
          }
          painter.restore();
        }
        painter.restore();
        if (cancelled) return;
        ctx.clearRect(0, 0, 900, 900);
        ctx.drawImage(buffer, 0, 0);
        setStatus(
          unsupported
            ? "Live preview · Some artwork could not be rendered. Try another PNG, JPEG, GIF, WebP, SVG, or PDF file."
            : current.hasView
              ? "Live preview · Changes update automatically"
              : "Live preview · Placement guide on front photo (side photo unavailable)",
        );
        onReady(true);
      } catch {
        if (!cancelled) {
          ctx.clearRect(0, 0, 900, 900);
          ctx.fillStyle = "#f0eee7";
          ctx.fillRect(0, 0, 900, 900);
          ctx.fillStyle = "#292d23";
          ctx.font = "20px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(
            "Preview image unavailable. Try another color.",
            450,
            450,
          );
          setStatus(
            "Preview image could not load. Your selections are preserved.",
          );
          onReady(false, true);
        }
      } finally {
        urls.forEach((url) => {
          URL.revokeObjectURL(url);
          photos.delete(url);
        });
      }
    }
    void draw();
    return () => {
      cancelled = true;
    };
  }, [signature, values, artwork, canvasRef, onReady]);
  return (
    <div className="live-preview">
      <div className="live-preview-toolbar">
        <span>
          <i /> LIVE DESIGN PREVIEW
        </span>
        <span>{scene.colorLabel}</span>
      </div>
      {groups.length > 1 && (
        <label className="preview-item-select">
          Preview item
          <select
            value={group}
            onChange={(e) =>
              setManualGroup({ id: e.target.value, field: activeField })
            }
          >
            {groups.map((g) => (
              <option key={g.field.id} value={g.field.id}>
                {g.group || g.panel}
              </option>
            ))}
          </select>
        </label>
      )}
      <canvas
        ref={canvasRef}
        width={900}
        height={900}
        aria-label={`Live ${view} preview of ${product.title}`}
        role="img"
      />
      <div className="preview-views">
        {(["front", "back", "left", "right"] as View[])
          .filter((v) => availableViews.has(v))
          .map((v) => (
            <button
              type="button"
              key={v}
              aria-pressed={view === v}
              onClick={() => onViewChange(v)}
            >
              {v === "left"
                ? "Left sleeve"
                : v === "right"
                  ? "Right sleeve"
                  : v}
            </button>
          ))}
      </div>
      <p className="preview-status" role="status">
        {status}
      </p>
      <p className="reference-caption">
        Live mockup for design guidance. Embroidery textures, specialty
        materials, font substitutions, and final placement are approximate. Size
        and quantity update your details, not the garment’s proportions.
      </p>
    </div>
  );
}
