import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  isVisible,
  cleanValues,
  visiblePanels,
  optionCost,
  selectionSummary,
  validateSelections,
} from "../src/lib/product-options.ts";
const snapshot = JSON.parse(
  fs.readFileSync(new URL("../src/data/catalog.json", import.meta.url)),
);
const config = (handle) =>
  JSON.parse(
    fs.readFileSync(
      new URL(`../public/catalog/options/${handle}.json`, import.meta.url),
    ),
  );
test("all 98 products have distinct, complete customization configurations", () => {
  assert.equal(snapshot.products.length, 98);
  assert.equal(new Set(snapshot.products.map((p) => p.handle)).size, 98);
  for (const p of snapshot.products) {
    const c = config(p.handle),
      fields = c.panels.flatMap((p) => p.fields);
    assert.equal(fields.length, p.fieldCount, p.handle);
    assert.equal(
      new Set(fields.map((f) => f.id)).size,
      fields.length,
      p.handle,
    );
    assert.ok(visiblePanels(c, {}).length, p.handle);
    assert.ok(p.image.startsWith("https://"), p.handle);
  }
});
test("show, hide, oneof, and mixed AND/OR dependencies are evaluated without code execution", () => {
  const rules = [
    { category: "a", option: "x" },
    { category: "b", option: "y", operator: "&&" },
    { category: "c", option: "z", operator: "||" },
  ];
  assert.equal(isVisible({ action: "show", rules }, { a: "x" }), false);
  assert.equal(isVisible({ action: "show", rules }, { a: "x", b: "y" }), true);
  assert.equal(isVisible({ action: "show", rules }, { c: "z" }), true);
  assert.equal(isVisible({ action: "hide", rules }, { c: "z" }), false);
  assert.equal(
    isVisible(
      {
        action: "show",
        rules: [{ category: "a", option: "oneof", options: ["x", "y"] }],
      },
      { a: "y" },
    ),
    true,
  );
});
test("jacket size availability responds to color and clears unavailable selections", () => {
  const c = config("greek-line-jacket");
  const fields = c.panels[0].fields;
  const color = fields.find((f) => f.title === "Apparel Color"),
    size = fields.find((f) => f.title === "Apparel Size");
  const white = color.options.find((o) => o.label === "White"),
    black = color.options.find((o) => o.label === "Black"),
    xs = size.options.find((o) => o.label === "XS");
  assert.equal(
    cleanValues(c, { [color.id]: black.id, [size.id]: xs.id })[size.id],
    xs.id,
  );
  assert.equal(
    cleanValues(c, { [color.id]: white.id, [size.id]: xs.id })[size.id],
    undefined,
  );
});
test("package repeated fields remain independent and summary preserves selections", () => {
  const c = config("package-crossing");
  const colors = visiblePanels(c, {})
    .flatMap((p) => p.fields)
    .filter((f) => /color/i.test(f.title));
  assert.ok(colors.length >= 2);
  const values = Object.fromEntries(
    colors.slice(0, 2).map((f) => [f.id, f.options[0].id]),
  );
  assert.equal(Object.keys(cleanValues(c, values)).length, 2);
  assert.equal(selectionSummary(c, values).length, 2);
});
test("text charges and character limits are respected", () => {
  const field = {
    id: "text",
    type: "input",
    title: "Lettering",
    required: true,
    logic: null,
    options: [
      {
        id: "entry",
        price: 2.5,
        settings: {
          chargePerCharacter: true,
          countSpaceAsCharacter: false,
          inputLengthValue: 4,
          inputMinLengthValue: 2,
        },
      },
    ],
  };
  assert.equal(optionCost(field, "A B"), 5);
  const c = {
    panels: [{ id: "p", title: "Design", logic: null, fields: [field] }],
  };
  assert.ok(validateSelections(c, {}));
  assert.ok(validateSelections(c, { text: "A" }));
  assert.ok(validateSelections(c, { text: "ABCDE" }));
  assert.equal(validateSelections(c, { text: "AB" }), undefined);
});
