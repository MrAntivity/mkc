import Image from "next/image";
import Link from "next/link";
import { withBasePath } from "@/lib/base-path";

const products = [
  {
    name: "The Line Jacket",
    category: "A crossing-day classic",
    price: 45,
    id: "lineJacket",
    image: "/products/line-jacket/black.jpg",
    colors: ["#222", "#8e3239", "#273858", "#e5cc7b"],
  },
  {
    name: "The Everyday Tee",
    category: "Your letters. On repeat.",
    price: 24,
    id: "tee",
    image: "/products/classic-tee/sand.jpg",
    colors: ["#c7b899", "#202020", "#859baf", "#fafafa"],
  },
  {
    name: "The Chapter Jacket",
    category: "Stand out, together",
    price: 45,
    id: "lineJacket",
    image: "/products/line-jacket/maroon.jpg",
    colors: ["#73313b", "#243449", "#e1c567", "#222"],
  },
  {
    name: "The Campus Tee",
    category: "An everyday essential",
    price: 24,
    id: "tee",
    image: "/products/classic-tee/forest-green.jpg",
    colors: ["#284b35", "#533861", "#a1afbc", "#222"],
  },
];

export default function Home() {
  return (
    <div className="storefront">
      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> CUSTOM THREADS. SHARED STORIES.
          </p>
          <h1>
            More than
            <br />
            letters.
            <br />
            <span>A whole legacy.</span>
          </h1>
          <p className="hero-description">
            For your chapter. Your people. Your next big moment. Custom apparel
            that feels as good as belonging.
          </p>
          <div className="hero-buttons">
            <Link href="/customize" className="button button-dark">
              Create your own <span>↗</span>
            </Link>
            <a href="#collections" className="text-link">
              Explore collections <span>↓</span>
            </a>
          </div>
          <div className="hero-footnote">
            <span className="mini-emblem">MKC</span>
            <p>
              YOUR IDENTITY, DOWN TO THE THREAD.
              <br />
              <span>Choose it. Customize it. Make it yours.</span>
            </p>
          </div>
        </div>
        <div className="hero-art">
          <div className="art-topline">
            <span>THE CHAPTER EDIT</span>
            <span>01 / MKC ORIGINALS</span>
          </div>
          <span className="art-outline" aria-hidden="true">
            YOUR
            <br />
            PEOPLE.
          </span>
          <div className="hero-garment">
            <Image
              src={withBasePath("/products/line-jacket/black.jpg")}
              alt="Black coach-style line jacket, ready for your chapter’s letters"
              width={640}
              height={700}
              priority
            />
            <span className="jacket-letters" aria-hidden="true">
              Μ<br />Κ<br />C
            </span>
          </div>
          <span className="round-stamp" aria-hidden="true">
            MADE YOURS
            <br />
            <b>✳</b>
            <br />
            WORN TOGETHER
          </span>
          <div className="hero-product-tag">
            <span>
              <small>THE ONE YOU’LL KEEP.</small>
              <strong>The Line Jacket</strong>
            </span>
            <Link
              href="/customize?garment=lineJacket"
              aria-label="Customize the Line Jacket"
            >
              ↗
            </Link>
          </div>
        </div>
      </section>
      <div
        className="ticker"
        aria-label="Made to represent, designed by you, worn together"
      >
        <span>MADE TO REPRESENT</span>
        <b>✳</b>
        <span>DESIGNED BY YOU</span>
        <b>✳</b>
        <span>WORN TOGETHER</span>
        <b>✳</b>
        <span>MAKE IT MKC</span>
        <b>✳</b>
      </div>
      <section className="section shell" id="collections">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FIND YOUR THREAD</p>
            <h2>
              Different moments.
              <br />
              Same sense of belonging.
            </h2>
          </div>
          <p>
            From your first letters to your final walk.
            <br />
            We’ve got something for every chapter.
          </p>
        </div>
        <div className="collection-grid">
          <Link href="/customize" className="collection-feature">
            <div className="collection-image">
              <Image
                src={withBasePath("/products/classic-tee/navy.jpg")}
                alt="Navy cotton T-shirt from the Greek apparel collection"
                width={640}
                height={700}
              />
              <span className="tee-letters" aria-hidden="true">
                ΑΒΓ
              </span>
            </div>
            <div className="collection-caption">
              <span>
                <small>01 / FOR YOUR CHAPTER</small>
                <h3>Greek life. Your way.</h3>
              </span>
              <span className="circle-arrow">↗</span>
            </div>
          </Link>
          <div className="collection-secondary">
            <a
              className="service-card graduation"
              href="https://www.stolesupply.com/"
            >
              <span className="eyebrow">02 / FOR YOUR MILESTONE</span>
              <span className="service-symbol" aria-hidden="true">
                ’26
              </span>
              <div>
                <h3>
                  A moment
                  <br />
                  worth wearing.
                </h3>
                <p>Custom graduation stoles</p>
              </div>
              <span className="circle-arrow">↗</span>
            </a>
            <a
              className="service-card apparel"
              href="https://mkcthreads.deco-apparel.com/"
            >
              <span className="eyebrow">03 / FOR YOUR WHOLE CREW</span>
              <div>
                <h3>
                  Big ideas.
                  <br />
                  Meet great threads.
                </h3>
                <p>Embroidered & printed apparel</p>
              </div>
              <span className="circle-arrow">↗</span>
            </a>
          </div>
        </div>
        <a href="https://mkcthreads.espwebsites.com/" className="promo-link">
          <span>
            <b>Something beyond apparel?</b> Explore custom promotional products
            for your brand, team, or next event.
          </span>
          <span>Explore the catalog ↗</span>
        </a>
      </section>
      <section className="product-section section" id="essentials">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE EVERYDAY ROTATION</p>
              <h2>
                Good threads.
                <br />
                Endless possibilities.
              </h2>
            </div>
            <Link href="/customize" className="text-link">
              Shop the design studio <span>↗</span>
            </Link>
          </div>
          <div className="product-grid">
            {products.map((p, i) => (
              <Link
                className="product-card"
                key={p.name}
                href={`/customize?garment=${p.id}`}
              >
                <div className="product-image">
                  <span className="product-label">
                    {i === 0 ? "THE SIGNATURE" : "MAKE IT YOURS"}
                  </span>
                  <Image
                    src={withBasePath(p.image)}
                    alt={p.name}
                    width={640}
                    height={700}
                  />
                  <span className="product-open" aria-hidden="true">
                    ↗
                  </span>
                </div>
                <div className="product-title">
                  <h3>{p.name}</h3>
                  <span>From ${p.price}</span>
                </div>
                <p>{p.category}</p>
                <div
                  className="swatches"
                  aria-label="Available in multiple colors"
                >
                  {p.colors.map((color) => (
                    <span key={color} style={{ background: color }} />
                  ))}
                  <small>+ more</small>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="story-section shell" id="about">
        <div className="story-art">
          <span className="eyebrow">
            INDIVIDUALLY YOURS. COLLECTIVELY OURS.
          </span>
          <div className="story-type">
            A THREAD
            <br />
            THAT TIES
            <br />
            <i>US TOGETHER.</i>
          </div>
          <span className="story-bottom">
            THE MKC WAY <span>↗</span>
          </span>
        </div>
        <div className="story-copy">
          <p className="eyebrow">MORE THAN WHAT YOU WEAR</p>
          <h2>
            Some things
            <br />
            just mean more.
          </h2>
          <p>
            The letters you earn. The people beside you. The moments you’ll talk
            about for years.
          </p>
          <p>
            We make custom apparel for all of it. From Greek letter gear to
            graduation stoles and something for your entire crew, MKC helps you
            wear what matters.
          </p>
          <Link href="/customize" className="text-link">
            Put your story on it <span>↗</span>
          </Link>
        </div>
      </section>
      <section className="section process-section shell" id="how-it-works">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR IDEA, BROUGHT TO LIFE</p>
            <h2>
              A little you.
              <br />
              In every detail.
            </h2>
          </div>
          <Link href="/customize" className="button button-dark">
            Enter the design studio <span>↗</span>
          </Link>
        </div>
        <div className="process-grid">
          {[
            {
              title: "Find your fit.",
              body: "Start with a tee, hoodie, crewneck, quarter-zip, or classic line jacket.",
            },
            {
              title: "Make your mark.",
              body: "Add your letters. Choose your colors, placement, and finishing details.",
            },
            {
              title: "See your vision.",
              body: "Explore a live design preview and collect your favorites in your design bag.",
            },
          ].map((step, i) => (
            <div key={step.title}>
              <span className="step-number">0{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="faq-section shell" id="faq">
        <div>
          <p className="eyebrow">GOOD TO KNOW</p>
          <h2>
            The finer
            <br />
            details.
          </h2>
        </div>
        <div className="faq-list">
          <details>
            <summary>
              What can I customize?<span>+</span>
            </summary>
            <p>
              Choose your garment, color, Greek letters, lettering style,
              placement, size, and quantity in the design studio. Options vary
              by garment.
            </p>
          </details>
          <details>
            <summary>
              How long does production take?<span>+</span>
            </summary>
            <p>
              Production times vary, especially during crossing season, and do
              not include shipping. Check{" "}
              <a href="https://mkcthreads.com/">
                MKC’s current production notice
              </a>{" "}
              before ordering. Rush options are available through the original
              store.
            </p>
          </details>
          <details>
            <summary>
              Is the live preview a production proof?<span>+</span>
            </summary>
            <p>
              The preview helps you explore your design. It is not a production
              proof; colors and placement can vary on the finished garment.
              Visit MKC’s original store for its proof and customization
              policies.
            </p>
          </details>
          <details>
            <summary>
              Where can I order graduation stoles?<span>+</span>
            </summary>
            <p>
              Visit{" "}
              <a href="https://www.stolesupply.com/">
                MKC’s Stole Supply portal
              </a>{" "}
              to design and order custom embroidered graduation stoles.
            </p>
          </details>
        </div>
      </section>
      <section className="closing-cta">
        <div className="shell">
          <p className="eyebrow">YOUR PEOPLE. YOUR STORY. YOUR THREADS.</p>
          <h2>
            Let’s make it
            <br />
            <i>mean something.</i>
          </h2>
          <Link href="/customize" className="button button-light">
            Make it yours <span>↗</span>
          </Link>
          <span className="closing-star" aria-hidden="true">
            ✳
          </span>
        </div>
      </section>
    </div>
  );
}
