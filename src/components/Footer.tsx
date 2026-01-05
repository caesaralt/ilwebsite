import Link from "next/link";
import { company, navItems } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-bg">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-3">
            <div className="font-[var(--font-display)] text-lg tracking-wide">{company.name}</div>
            <p className="text-sm text-muted max-w-sm">
              Cloud-free, privacy-first automation for homes and businesses — built on Loxone.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-widest text-muted">Explore</div>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link className="text-sm text-fg/90 hover:text-fg" href={item.href}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-widest text-muted">Contact</div>
              <div className="space-y-2 text-sm text-fg/90">
                <div>{company.locations.join(" · ")}</div>
                <div>
                  <Link href={`tel:${company.phone.replace(/\s+/g, "")}`} className="hover:text-fg">
                    {company.phone}
                  </Link>
                </div>
                <div className="text-muted">By appointment only</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs uppercase tracking-widest text-muted">Follow</div>
            <div className="flex flex-wrap gap-2">
              <a
                className="rounded-md border border-border/70 bg-panel/40 px-3 py-2 text-sm text-fg/90 hover:bg-panel hover:text-fg transition-colors"
                href="#"
              >
                Instagram
              </a>
              <a
                className="rounded-md border border-border/70 bg-panel/40 px-3 py-2 text-sm text-fg/90 hover:bg-panel hover:text-fg transition-colors"
                href="#"
              >
                LinkedIn
              </a>
            </div>
            <div className="text-xs text-muted pt-2">© {new Date().getFullYear()} Integratd.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}


