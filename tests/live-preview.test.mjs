import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const cache = new Map();
function load(name) {
  const file = path.resolve("src/lib", name + ".ts");
  if (cache.has(file)) return cache.get(file);
  const loaded = { exports: {} };
  const js = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  new Function("require", "module", "exports", js)(
    (specifier) =>
      specifier.startsWith(".")
        ? load(specifier.replace("./", ""))
        : require(specifier),
    loaded,
    loaded.exports,
  );
  cache.set(file, loaded.exports);
  return loaded.exports;
}
const { buildScene, garmentFields, greekText } = load("live-preview");
const { cleanValues } = load("product-options");
const products = JSON.parse(fs.readFileSync("src/data/catalog.json")).products;
const config = (handle) =>
  JSON.parse(fs.readFileSync(`public/catalog/options/${handle}.json`));
const scene = (c, v, view = "front", group) =>
  buildScene(c, v, view, "fallback.jpg", "Greek", "Greek - Line Jacket", group);
test("every catalog product has source rendering data and a preview image", () => {
  for (const product of products) {
    const c = config(product.handle);
    assert.ok(c.render, product.handle);
    assert.ok(
      buildScene(
        c,
        {},
        "front",
        product.image,
        product.collection,
        product.title,
      ).base.startsWith("https://"),
      product.handle,
    );
  }
});
test("apparel color selects the exact new garment photo", () => {
  const c = config("greek-line-jacket"),
    f = garmentFields(c)[0].field;
  const red = f.options.find((o) => o.label === "Red"),
    navy = f.options.find((o) => o.label === "Navy");
  assert.equal(scene(c, { [f.id]: red.id }).base, red.value);
  assert.equal(scene(c, { [f.id]: navy.id }).base, navy.value);
  assert.notEqual(red.value, navy.value);
});
test("Greek organization, text color, font, stitch and placement change the scene", () => {
  const c = config("greek-line-jacket"),
    front = c.panels.find((p) => p.title === "Front");
  const placement = front.fields.find(
    (f) => f.title === "Greek Letter Placement",
  );
  const org = front.fields.find((f) => f.title === "Organization");
  const fg = front.fields.find((f) => f.title === "Foreground Color");
  const font = front.fields.find((f) => f.title === "Greek Letter Font");
  const stitch = front.fields.find((f) => f.title === "Stitch Type");
  const left = placement.options.find((o) => /Left/.test(o.label));
  let values = cleanValues(c, {
    [placement.id]: left.id,
    [org.id]: "Nu Alpha Phi",
    [fg.id]: fg.options.find((o) => o.label === "Red").id,
    [font.id]: font.options[0].id,
    [stitch.id]: stitch.options[0].id,
  });
  let mark = scene(c, values).marks.find((m) => m.id === org.id);
  assert.equal(mark.text, "ΝΑΦ");
  assert.equal(mark.color, "#c32b37");
  assert.equal(mark.vertical, true);
  const right = placement.options.find((o) => /Right/.test(o.label));
  values = cleanValues(c, {
    ...values,
    [placement.id]: right.id,
    [fg.id]: fg.options.find((o) => o.label === "White").id,
    [font.id]: font.options[1].id,
    [stitch.id]: stitch.options[1].id,
  });
  let next = scene(c, values).marks.find((m) => m.id === org.id);
  assert.notEqual(next.x, mark.x);
  assert.notEqual(next.color, mark.color);
  assert.notEqual(next.font, mark.font);
  assert.notEqual(next.stitch, mark.stitch);
});
test("package preview switches garments independently", () => {
  const c = config("package-crossing"),
    groups = garmentFields(c);
  assert.ok(groups.length > 1);
  const values = Object.fromEntries(
    groups.map((g) => [
      g.field.id,
      g.field.options.find(
        (o) => typeof o.value === "string" && o.value.startsWith("https://"),
      ).id,
    ]),
  );
  assert.notEqual(
    scene(c, values, "front", groups[0].field.id).base,
    scene(c, values, "front", groups[1].field.id).base,
  );
});
test("plain text is not incorrectly translated to Greek", () => {
  assert.equal(greekText("class of 2026"), "class of 2026");
  assert.equal(greekText("Alpha Kappa Psi"), "ΑΚΨ");
});
