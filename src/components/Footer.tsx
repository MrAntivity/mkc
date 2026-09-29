import Link from "next/link";
import Brand from "./Brand";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top shell">
        <div>
          <Brand />
          <p>
            For the moments that bring us together.
            <br />
            For the threads that make us, us.
          </p>
        </div>
        <div>
          <h2>Make it yours</h2>
          <Link href="/customize">Greek apparel</Link>
          <a href="https://www.stolesupply.com/">Graduation stoles ↗</a>
          <a href="https://mkcthreads.deco-apparel.com/">Custom apparel ↗</a>
          <a href="https://mkcthreads.espwebsites.com/">
            Promotional products ↗
          </a>
        </div>
        <div>
          <h2>A little guidance</h2>
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/#faq">Frequently asked questions</Link>
          <a href="https://mkcthreads.com/">Visit the original store ↗</a>
          <Link href="/bag">Your design bag</Link>
        </div>
        <div className="footer-note">
          <span className="eyebrow">YOUR NEXT CHAPTER</span>
          <h3>
            Starts with
            <br />a great thread.
          </h3>
          <Link href="/customize" className="text-link">
            Let’s make something <span>↗</span>
          </Link>
        </div>
      </div>
      <div className="footer-bottom shell">
        <span>© {new Date().getFullYear()} MKC Threads.</span>
        <span>Custom apparel. Collective identity.</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
