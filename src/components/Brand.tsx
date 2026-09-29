import Link from "next/link";

export default function Brand() {
  return (
    <Link href="/" className="brand" aria-label="MKC Threads home">
      <span className="brand-mark" aria-hidden="true">
        m<span>k</span>c<span className="brand-dot">®</span>
      </span>
      <span className="brand-sub">THREADS & CO.</span>
    </Link>
  );
}
