import Customizer from "@/components/Customizer";

export default function CustomizePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">
          Design Studio
        </p>
        <h1 className="font-display text-3xl sm:text-4xl">
          Build Your Custom Greek Apparel
        </h1>
        <p className="mt-2 max-w-2xl text-foreground/60">
          Pick a garment, choose your colors, and add your letters. Your
          preview updates instantly so you know exactly what you&apos;re
          ordering.
        </p>
      </div>
      <Customizer />
    </div>
  );
}
