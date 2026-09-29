import { Suspense } from "react";
import Link from "next/link";
import Studio from "@/components/Studio";

export default function CustomizePage() {
  return (
    <div className="studio-page">
      <div className="studio-breadcrumb">
        <Link href="/">Home</Link> / Design studio
      </div>
      <div className="studio-intro">
        <div>
          <p className="eyebrow">THE MKC DESIGN STUDIO</p>
          <h1>
            Your letters.
            <br />
            Your way.
          </h1>
        </div>
        <p>
          A little color. A personal touch. Choose your garment and bring your
          chapter’s next favorite to life. Preview is illustrative; final
          details may vary.
        </p>
      </div>
      <Suspense fallback={<p>Preparing your design studio…</p>}>
        <Studio />
      </Suspense>
    </div>
  );
}
