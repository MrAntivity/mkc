import Link from "next/link";
import { GARMENT_TYPES } from "@/lib/garments";

const STEPS = [
  {
    title: "Pick Your Garment",
    body: "Tees, hoodies, crewnecks, and quarter-zips in the colors your chapter actually wears.",
  },
  {
    title: "Add Your Letters",
    body: "Type your Greek letters, pick a color and font, and choose chest or full-back placement.",
  },
  {
    title: "Preview In Real Time",
    body: "Watch your design update instantly on a live mockup before you ever add it to your bag.",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-line bg-navy text-cream">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">
              Custom Greek Letter Apparel
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              Design gear your chapter will actually wear.
            </h1>
            <p className="mt-5 max-w-lg text-cream/70">
              MKC THREADS lets your fraternity or sorority build custom
              apparel and see it come to life in real time &mdash; no
              guessing, no waiting on a proof.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/customize"
                className="rounded-full bg-gold px-6 py-3 text-sm font-semibold uppercase tracking-wide text-navy transition hover:bg-gold-light"
              >
                Start Designing
              </Link>
              <a
                href="#organizations"
                className="rounded-full border border-cream/30 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-cream transition hover:border-cream"
              >
                Browse Garments
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-cream/10 bg-navy-light p-8">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="font-display text-3xl text-gold">24</div>
                <div className="text-xs uppercase tracking-wide text-cream/60">
                  Greek Letters
                </div>
              </div>
              <div>
                <div className="font-display text-3xl text-gold">8</div>
                <div className="text-xs uppercase tracking-wide text-cream/60">
                  Garment Colors
                </div>
              </div>
              <div>
                <div className="font-display text-3xl text-gold">Live</div>
                <div className="text-xs uppercase tracking-wide text-cream/60">
                  Preview
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="font-display text-3xl">How It Works</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="rounded-2xl border border-line bg-white p-6">
              <div className="font-display text-3xl text-gold">
                0{i + 1}
              </div>
              <h3 className="mt-3 font-display text-xl">{step.title}</h3>
              <p className="mt-2 text-sm text-foreground/60">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Garment categories */}
      <section id="organizations" className="border-y border-line bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="font-display text-3xl">Shop by Garment</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {GARMENT_TYPES.map((g) => (
              <Link
                key={g.id}
                href="/customize"
                className="group rounded-2xl border border-line p-6 transition hover:border-navy"
              >
                <div className="flex h-32 items-center justify-center rounded-xl bg-cream text-4xl">
                  👕
                </div>
                <h3 className="mt-4 font-display text-lg">{g.label}</h3>
                <p className="text-sm text-foreground/50">From ${g.basePrice}</p>
                <span className="mt-3 inline-block text-sm font-semibold text-gold group-hover:underline">
                  Customize →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h2 className="font-display text-3xl">Ready to design your look?</h2>
        <p className="mx-auto mt-3 max-w-xl text-foreground/60">
          Jump into the design studio and see your chapter&apos;s letters on
          real apparel in seconds.
        </p>
        <Link
          href="/customize"
          className="mt-8 inline-block rounded-full bg-navy px-8 py-3 text-sm font-semibold uppercase tracking-wide text-cream transition hover:bg-navy-light"
        >
          Open Design Studio
        </Link>
      </section>
    </div>
  );
}
