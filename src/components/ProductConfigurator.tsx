"use client";
import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CatalogProduct } from "@/lib/catalog";
import {
  cleanValues,
  isTextField,
  optionCost,
  selectionSummary,
  visiblePanels,
  validateSelections,
  type Field,
  type ProductOptions,
  type Values,
} from "@/lib/product-options";
import { useCart } from "@/lib/cart-context";

function isImage(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^https:\/\/(cdn\.thecustomproductbuilder\.com|storage\.googleapis\.com|cdn\.shopify\.com)\//.test(
      value,
    )
  );
}
export default function ProductConfigurator({
  product,
  config,
}: {
  product: CatalogProduct;
  config: ProductOptions;
}) {
  const [values, setValues] = useState<Values>({});
  const [artwork, setArtwork] = useState<Record<string, File>>({});
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState(product.image);
  const { addLine } = useCart();
  const panels = visiblePanels(config, values);
  const fields = panels.flatMap((p) => p.fields);
  const unitPrice =
    (Number(config.basePrice) || product.price) +
    fields.reduce((sum, f) => sum + optionCost(f, values[f.id] ?? ""), 0);
  const summary = selectionSummary(config, values);
  const wholesale = fields.find((f) => f.type === "wholesaleOrder");
  const quantities: Record<string, number> =
    wholesale && values[wholesale.id] ? JSON.parse(values[wholesale.id]) : {};
  const count = wholesale
    ? Object.values(quantities).reduce((a, b) => a + b, 0)
    : quantity;
  function change(id: string, value: string) {
    setValues((current) => cleanValues(config, { ...current, [id]: value }));
    setAdded(false);
    setError("");
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const invalid = validateSelections(config, values);
    if (invalid) {
      setError(invalid.message);
      const control = document.getElementById(`field-${invalid.id}`);
      const section = control?.closest("details");
      if (section) section.open = true;
      control?.scrollIntoView({ block: "center" });
      control?.focus();
      return;
    }
    if (!count) {
      setError("Choose at least one item.");
      return;
    }
    const selections = summary.map((s) =>
      s.id === wholesale?.id
        ? {
            ...s,
            value: Object.entries(quantities)
              .map(
                ([id, qty]) =>
                  `${wholesale?.options.find((o) => o.id === id)?.label}: ${qty}`,
              )
              .join(", "),
          }
        : s,
    );
    addLine({
      garmentName: product.title,
      garmentColorName: "",
      letters: "",
      letterColorName: "",
      fontLabel: "",
      placement: "",
      size: "",
      quantity: count,
      quantityLocked: Boolean(wholesale),
      price: unitPrice,
      previewDataUrl: product.image,
      productHandle: product.handle,
      sourceUrl: product.source,
      selections,
      artwork: Object.entries(artwork)
        .filter(([id]) => Boolean(values[id]))
        .map(([id, file]) => ({
          field: fields.find((f) => f.id === id)?.title ?? "Artwork",
          file,
        })),
    });
    setAdded(true);
  }
  function renderField(field: Field) {
    const id = `field-${field.id}`;
    const first = field.options[0];
    const value = values[field.id] ?? "";
    if (field.type === "fileUpload")
      return (
        <div>
          <input
            id={id}
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml,application/pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && file.size > 20 * 1024 * 1024) {
                change(field.id, "");
                setError("Please choose artwork smaller than 20 MB.");
                e.target.value = "";
                return;
              }
              if (file)
                setArtwork((current) => ({ ...current, [field.id]: file }));
              change(field.id, file?.name ?? "");
            }}
            required={field.required}
          />
          <small>
            Artwork stays in this session’s design bag (20 MB max). It is not
            sent to MKC.
          </small>
        </div>
      );
    if (isTextField(field)) {
      const props = {
        id,
        value,
        required: field.required,
        maxLength: first?.settings.inputLengthValue ?? 100,
        minLength: first?.settings.inputMinLengthValue,
        placeholder: first?.label,
        onChange: (
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => change(field.id, e.target.value),
      };
      return (
        <div>
          {field.display === "inputLong" ? (
            <textarea {...props} rows={3} />
          ) : (
            <input {...props} type="text" />
          )}
          <small>
            {value.length} / {props.maxLength}
            {first?.settings.chargePerCharacter &&
              ` · $${Number(first.price).toFixed(2)} per character`}
          </small>
        </div>
      );
    }
    if (field.type === "wholesaleOrder")
      return (
        <div className="quantity-grid">
          {field.options.map((o) => (
            <label key={o.id}>
              {o.label}
              <input
                type="number"
                min="0"
                max="999"
                disabled={!o.inStock}
                value={quantities[o.id] ?? 0}
                onChange={(e) =>
                  change(
                    field.id,
                    JSON.stringify({
                      ...quantities,
                      [o.id]: Math.max(
                        0,
                        Math.min(999, Math.floor(Number(e.target.value) || 0)),
                      ),
                    }),
                  )
                }
              />
              {!o.inStock && <small>Unavailable</small>}
            </label>
          ))}
        </div>
      );
    const selected = field.options.find((o) => o.id === value);
    return (
      <div className="option-select-row">
        <select
          id={id}
          required={field.required}
          value={value}
          onChange={(e) => change(field.id, e.target.value)}
        >
          <option value="">
            {field.required ? "Choose an option" : "Select (optional)"}
          </option>
          {field.options.map((o) => (
            <option key={o.id} value={o.id} disabled={!o.inStock}>
              {o.label}
              {Number(o.price) > 0 && !o.label.includes("$")
                ? ` (+$${Number(o.price).toFixed(2)})`
                : ""}
              {!o.inStock ? " — unavailable" : ""}
            </option>
          ))}
        </select>
        {selected && isImage(selected.value) && (
          <a
            href={selected.value}
            target="_blank"
            rel="noreferrer"
            aria-label={`View ${selected.label} reference`}
          >
            <Image
              src={selected.value}
              alt={selected.label}
              width={56}
              height={56}
              unoptimized
            />
          </a>
        )}
      </div>
    );
  }
  return (
    <div className="product-detail shell">
      <div className="studio-breadcrumb">
        <Link href="/catalog">Catalog</Link> / {product.collection} /{" "}
        {product.title}
      </div>
      <div className="product-detail-layout">
        <aside className="product-preview">
          <div className="product-reference">
            <Image
              src={image}
              alt={product.title}
              width={800}
              height={900}
              priority
            />
            <span>MKC PRODUCT EXAMPLE</span>
          </div>
          {product.images.length > 1 && (
            <div className="product-thumbnails">
              {product.images.slice(0, 8).map((src, i) => (
                <button
                  key={src}
                  onClick={() => setImage(src)}
                  aria-label={`View product image ${i + 1}`}
                  aria-pressed={image === src}
                >
                  <Image src={src} alt="" width={65} height={75} />
                </button>
              ))}
            </div>
          )}
          <p className="reference-caption">
            Product photography shows an example design. Your selections are
            listed below; this is not a live production proof.
          </p>
          {summary.length > 0 && (
            <div className="configuration-summary">
              <h2>Your details</h2>
              <dl>
                {summary.map((s) => (
                  <div key={s.id}>
                    <dt>{s.name}</dt>
                    <dd>
                      {s.id === wholesale?.id
                        ? `${count} items by size`
                        : s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </aside>
        <div className="product-options">
          <p className="eyebrow">
            {product.collection.toUpperCase()} /{" "}
            {product.category.toUpperCase()}
          </p>
          <h1>{product.title}</h1>
          <div className="product-starting-price">
            From ${product.price.toFixed(2)} <span>Custom made for you</span>
          </div>
          <p className="product-options-intro">
            Choose the details for this piece. Available options change with
            your selections.
          </p>
          <Link href="/catalog" className="text-link">
            ← Choose a different product
          </Link>
          <form onSubmit={submit} noValidate>
            {panels.map((panel, i) => (
              <details
                className="option-panel"
                open={i === 0 || undefined}
                key={panel.id}
              >
                <summary>
                  <span>
                    <b>{String(i + 1).padStart(2, "0")}</b>
                    {panel.title || "Customization"}
                  </span>
                  <span>+</span>
                </summary>
                <div className="option-panel-fields">
                  {panel.fields.map((field) => (
                    <div className="product-field" key={field.id}>
                      <label htmlFor={`field-${field.id}`}>
                        {field.title}
                        {field.required && (
                          <span aria-label="required"> *</span>
                        )}
                      </label>
                      {field.description && <p>{field.description}</p>}
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              </details>
            ))}
            <div className="product-order-summary">
              {!wholesale && (
                <label className="order-quantity">
                  Quantity
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={quantity}
                    onChange={(e) => {
                      setQuantity(
                        Math.min(
                          999,
                          Math.max(1, Math.floor(Number(e.target.value) || 1)),
                        ),
                      );
                      setAdded(false);
                    }}
                  />
                </label>
              )}
              <div className="estimate">
                <span>Estimated design total</span>
                <strong>${(unitPrice * count).toFixed(2)}</strong>
              </div>
              <p>
                Based on imported base prices and option charges. Specialty
                pricing, artwork, and final availability are confirmed by MKC.
              </p>
              {error && (
                <p role="alert" className="form-error">
                  {error}
                </p>
              )}
              <button className="button button-dark" type="submit">
                {added ? "Added to your design bag ✓" : "Add design to bag"}
                <span>↗</span>
              </button>
              {added && (
                <Link href="/bag" className="view-bag-link" role="status">
                  View your design bag →
                </Link>
              )}
              <a
                href={product.source}
                className="original-product-link"
                target="_blank"
                rel="noreferrer"
              >
                View this product on MKC Threads ↗
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
