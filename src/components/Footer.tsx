export default function Footer() {
  return (
    <footer id="about" className="border-t border-line bg-navy text-cream/80">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <span className="font-display text-xl text-cream">
              MKC <span className="text-gold">THREADS</span>
            </span>
            <p className="mt-3 max-w-xs text-sm text-cream/70">
              Custom Greek letter apparel for fraternities and sororities.
              Design it, preview it, wear it.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">
              Shop
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/customize" className="hover:text-gold">
                  Customize Apparel
                </a>
              </li>
              <li>
                <a href="#organizations" className="hover:text-gold">
                  Organizations
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:hello@mkcthreads.com" className="hover:text-gold">
                  hello@mkcthreads.com
                </a>
              </li>
              <li>Sizing Guide</li>
              <li>Order Status</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-cream/50">
          © {new Date().getFullYear()} MKC THREADS. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
