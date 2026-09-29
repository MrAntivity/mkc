import {
  isVisible,
  visiblePanels,
  type ProductOptions,
  type Values,
  type Field,
  type Logic,
} from "./product-options";
export type View = "front" | "back" | "left" | "right";
export type RenderLayer = {
  id: string;
  title: string;
  view: string;
  url?: string;
  logic: Logic;
  points: { x: number | string; y: number | string }[];
};
export type RenderData = {
  base: Record<string, string>;
  images: RenderLayer[];
  regions: RenderLayer[];
};
export type PreviewMark = {
  id: string;
  text?: string;
  image?: string;
  fileId?: string;
  color: string;
  background: string;
  font: string;
  stitch: string;
  box: boolean;
  vertical: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};
export function imageUrl(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^https:\/\/(cdn\.thecustomproductbuilder\.com|storage\.googleapis\.com|cdn\.shopify\.com)\//.test(
      value,
    )
  );
}
export function chosen(field: Field, values: Values) {
  return field.options.find((o) => o.id === values[field.id]);
}
export function garmentFields(config: ProductOptions) {
  return config.panels.flatMap((p) =>
    p.fields
      .filter(
        (f) =>
          /color|colour|country/i.test(f.title) &&
          !/foreground|background|embroidery|thread|text|twill|font|number|letter|box logo/i.test(
            f.title,
          ),
      )
      .map((f) => ({
        field: f,
        panel: p.title,
        group: p.title.replace(/\s*base\s*/i, "").trim(),
      })),
  );
}
export function inferView(title: string): View {
  const s = title.toLowerCase();
  return /back|hood/.test(s)
    ? "back"
    : /sleeve.*left|left.*sleeve/.test(s)
      ? "left"
      : /sleeve.*right|right.*sleeve/.test(s)
        ? "right"
        : "front";
}
const greek: Record<string, string> = {
  alpha: "Α",
  beta: "Β",
  gamma: "Γ",
  delta: "Δ",
  epsilon: "Ε",
  zeta: "Ζ",
  eta: "Η",
  theta: "Θ",
  iota: "Ι",
  kappa: "Κ",
  lambda: "Λ",
  mu: "Μ",
  nu: "Ν",
  xi: "Ξ",
  omicron: "Ο",
  pi: "Π",
  rho: "Ρ",
  sigma: "Σ",
  tau: "Τ",
  upsilon: "Υ",
  phi: "Φ",
  chi: "Χ",
  psi: "Ψ",
  omega: "Ω",
};
export function greekText(text: string) {
  const words = text
    .toLowerCase()
    .trim()
    .split(/[\s-]+/);
  return words.length && words.every((w) => greek[w])
    ? words.map((w) => greek[w]).join("")
    : text;
}
export function colorValue(label: string): string {
  const s = label
    .toLowerCase()
    .replace(/\s*\(.*$/, "")
    .trim();
  if (/none|no background/.test(s)) return "transparent";
  const colors: Record<string, string> = {
    black: "#161616",
    white: "#faf8ee",
    navy: "#192b49",
    royal: "#234fac",
    red: "#c32b37",
    maroon: "#702c3c",
    burgundy: "#702c3c",
    gold: "#d6af3e",
    yellow: "#ead856",
    orange: "#e3772f",
    purple: "#683f86",
    pink: "#e591ba",
    "light pink": "#efbdcf",
    green: "#286045",
    "dark green": "#194632",
    "forest green": "#194632",
    "kelly green": "#2c904e",
    silver: "#bbbfc2",
    grey: "#8d9197",
    gray: "#8d9197",
    brown: "#795440",
    cream: "#e9dfbc",
    ivory: "#e9dfbc",
    khaki: "#bdb18b",
    "light blue": "#8db9d9",
    "columbia blue": "#8db9d9",
    "carolina blue": "#8db9d9",
    teal: "#298e8d",
    turquoise: "#40b4b6",
    "old gold": "#b6a34a",
    "neon pink": "#f752b5",
    lavender: "#b8a4d1",
  };
  if (colors[s]) return colors[s];
  const key = Object.keys(colors)
    .sort((a, b) => b.length - a.length)
    .find((k) => s.includes(k));
  return key ? colors[key] : "#ede6cd";
}
export function buildScene(
  config: ProductOptions,
  values: Values,
  view: View,
  fallback: string,
  collection: string,
  productTitle: string,
  groupId?: string,
) {
  const groups = garmentFields(config),
    group = groups.find((g) => g.field.id === groupId) ?? groups[0];
  const selected =
    group &&
    (chosen(group.field, values) ??
      group.field.options.find((o) => o.inStock && imageUrl(o.value)));
  const render = config.render;
  const sceneValues =
    group && selected ? { ...values, [group.field.id]: selected.id } : values;
  let base = render?.base[view] || render?.base.front || fallback;
  let hasView = Boolean(render?.base[view]);
  // Front color values are full, product-specific blank garment photographs.
  if (view === "front" && selected && imageUrl(selected.value)) {
    base = selected.value;
    hasView = true;
  }
  if (view !== "front" && selected) {
    const layer = render?.images.find(
      (l) =>
        l.view === view &&
        l.url &&
        l.title.toLowerCase().startsWith(selected.label.toLowerCase()) &&
        isVisible(l.logic, sceneValues),
    );
    if (layer?.url) {
      base = layer.url;
      hasView = true;
    } else {
      base = imageUrl(selected.value) ? selected.value : base;
      hasView = false;
    }
  }
  const panels = visiblePanels(config, values).filter(
    (p) =>
      !group?.group ||
      groups.length < 2 ||
      p.title.startsWith(group.group) ||
      (/hood/i.test(p.title) && /hood/i.test(group.group)),
  );
  const marks: PreviewMark[] = [];
  for (const panel of panels) {
    const fields = panel.fields;
    const get = (pattern: RegExp, index: number) =>
      fields
        .map((f, i) => ({ f, i }))
        .filter(({ f }) => pattern.test(f.title) && values[f.id])
        .sort((a, b) => Math.abs(a.i - index) - Math.abs(b.i - index))
        .map(({ f }) => chosen(f, values)?.label ?? values[f.id])[0] ?? "";
    for (let index = 0; index < fields.length; index++) {
      const field = fields[index],
        value = values[field.id];
      if (!value) continue;
      const option = chosen(field, values);
      const isText =
        field.type === "input" &&
        !/specialty fabric|instructions|notes|email/i.test(field.title);
      const isArtwork = field.type === "fileUpload";
      const isGraphic =
        !isText &&
        !isArtwork &&
        /crest|clip.?art|design|flag/i.test(field.title) &&
        option &&
        imageUrl(option.value);
      if (!isText && !isArtwork && !isGraphic) continue;
      const context = `${panel.title} ${field.title}`;
      if (inferView(context) !== view) continue;
      const placement = get(/placement|orientation/i, index);
      const text = isText
        ? /greek|organization/i.test(field.title) &&
          !/minimalistic|collegiate|box logo/i.test(collection)
          ? greekText(value)
          : value
        : undefined;
      const box = /box logo/i.test(collection) || /box logo/i.test(field.title);
      const vertical =
        /line jacket|jersey|full.zip/i.test(productTitle) &&
        /organization|greek letters/i.test(field.title);
      let x = 0.5,
        y = 0.38,
        width = 0.36,
        height = 0.09,
        rotation = 0;
      if (view === "back") {
        y = /bottom/i.test(context)
          ? 0.71
          : /middle|number/i.test(context)
            ? 0.49
            : /hood/i.test(context)
              ? 0.17
              : 0.29;
        width = 0.42;
        height = /middle|number/i.test(context) ? 0.23 : 0.08;
      }
      if (view === "left" || view === "right") {
        x = 0.5;
        y = /line 2/i.test(context) ? 0.5 : 0.35;
        width = 0.22;
        height = 0.07;
      }
      if (/left|over heart/i.test(placement)) {
        x = 0.65;
        width = 0.2;
      } else if (/right/i.test(placement)) {
        x = 0.35;
        width = 0.2;
      }
      if (vertical) {
        x = /right/i.test(placement) ? 0.35 : 0.65;
        y = 0.42;
        width = 0.1;
        height = 0.32;
      }
      if (/headwear|cap|hat|beanie/i.test(productTitle)) {
        x = 0.5;
        y = 0.55;
        width = 0.32;
        height = 0.12;
      }
      if (/key.?chain|necklace|luggage|tote|blanket/i.test(productTitle)) {
        x = 0.5;
        y = 0.48;
        width = 0.35;
        height = 0.2;
      }
      if (/vertical/i.test(placement) && !vertical) rotation = -Math.PI / 2;
      if (isArtwork || isGraphic) {
        height = 0.2;
        width = 0.22;
      }
      // Prefer the source product's placement geometry when it has a matching region.
      const tokens = context
        .toLowerCase()
        .replace(/line\s+(\d+)/g, "l$1")
        .split(/[^a-z0-9]+/)
        .filter((w) =>
          [
            "back",
            "top",
            "middle",
            "bottom",
            "chest",
            "sleeve",
            "embroidery",
            "twill",
            "crest",
            "greek",
            "flag",
            "l1",
            "l2",
          ].includes(w),
        );
      const regions = (render?.regions ?? [])
        .filter(
          (r) =>
            r.view === view &&
            r.points.length >= 3 &&
            isVisible(r.logic, values),
        )
        .map((r) => ({
          r,
          score: tokens.filter((t) => r.title.toLowerCase().includes(t)).length,
        }))
        .sort((a, b) => b.score - a.score);
      const best = regions[0];
      if (best && best.score >= 2 && !vertical && !box) {
        const xs = best.r.points.map((p) => Number(p.x)),
          ys = best.r.points.map((p) => Number(p.y));
        const w = Math.max(...xs) - Math.min(...xs),
          h = Math.max(...ys) - Math.min(...ys);
        if (w > 0.02 && h > 0.015 && w < 0.8 && h < 0.7) {
          x = (Math.max(...xs) + Math.min(...xs)) / 2;
          y = (Math.max(...ys) + Math.min(...ys)) / 2;
          width = w;
          height = h;
        }
      }
      marks.push({
        id: field.id,
        text,
        image: isGraphic ? String(option?.value) : undefined,
        fileId: isArtwork ? field.id : undefined,
        color: colorValue(
          get(
            /foreground|embroidery.*color|text.*color|letter.*color|color.*text/i,
            index,
          ) || "Cream",
        ),
        background: colorValue(get(/background/i, index) || "None"),
        font: get(/font/i, index) || "Standard",
        stitch: get(/stitch/i, index),
        box,
        vertical,
        x,
        y,
        width,
        height,
        rotation,
      });
    }
  }
  return {
    base,
    hasView,
    marks,
    groupLabel: group?.group || productTitle,
    colorLabel: selected?.label ?? "",
    view,
  };
}
