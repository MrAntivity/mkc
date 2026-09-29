"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function BagPage() {
  const { lines, count, subtotal, removeLine, updateQuantity } = useCart();
  return (
    <div className="bag-page shell">
      <p className="eyebrow">YOUR NEXT CHAPTER, IN THE MAKING</p>
      <h1>
        Your design bag <span>({count})</span>
      </h1>
      {lines.length === 0 ? (
        <div className="empty-bag">
          <p>
            A blank canvas. A whole lot of possibilities.
            <br />
            Your custom designs will appear here.
          </p>
          <Link href="/customize" className="button button-dark">
            Start creating <span>↗</span>
          </Link>
        </div>
      ) : (
        <div className="bag-layout">
          <div>
            {lines.map((line) => (
              <article className="bag-item" key={line.id}>
                {line.previewDataUrl && (
                  <Image
                    unoptimized
                    src={line.previewDataUrl}
                    width={100}
                    height={125}
                    alt={`${line.letters} on ${line.garmentName}`}
                  />
                )}
                <div>
                  <h2>{line.garmentName}</h2>
                  <p>
                    {line.garmentColorName} / {line.size} / {line.letters}
                  </p>
                  <p>
                    {line.fontLabel} · {line.letterColorName} · {line.placement}
                  </p>
                  <p>${line.price.toFixed(2)} each</p>
                  <label>
                    Quantity
                    <input
                      type="number"
                      min="1"
                      max="999"
                      value={line.quantity}
                      onChange={(event) =>
                        updateQuantity(
                          line.id,
                          Math.min(
                            999,
                            Math.max(
                              1,
                              Math.floor(Number(event.target.value) || 1),
                            ),
                          ),
                        )
                      }
                    />
                  </label>
                  <button
                    onClick={() => removeLine(line.id)}
                    aria-label={`Remove ${line.garmentName} from bag`}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
          <aside className="bag-summary">
            <h2>Your design summary</h2>
            <div className="bag-total">
              <span>Estimated subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <p>
              This bag is a design preview, not an order. Designs stay here
              while you browse but are cleared on refresh. To place an order,
              recreate your design at the original MKC store. Pricing and
              options there may differ.
            </p>
            <a href="https://mkcthreads.com/" className="button button-dark">
              Visit MKC to order <span>↗</span>
            </a>
          </aside>
        </div>
      )}
    </div>
  );
}
