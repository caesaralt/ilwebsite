"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { navItems } from "@/lib/site";
import { Logo } from "@/components/Logo";

function useLockBodyScroll(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isLocked]);
}

function DiagonalMenuIcon({ expanded }: { expanded: boolean }) {
  return (
    <span aria-hidden="true" className="relative inline-flex h-4 w-5 items-center justify-center">
      <span
        className={[
          "absolute h-px w-5 bg-accent",
          "transition-all duration-300 ease-out",
          expanded ? "translate-y-0 rotate-45" : "-translate-y-2 rotate-45"
        ].join(" ")}
      />
      <span
        className={[
          "absolute h-px w-5 bg-accent rotate-45",
          "transition-opacity duration-200 ease-out",
          expanded ? "opacity-0" : "opacity-100"
        ].join(" ")}
      />
      <span
        className={[
          "absolute h-px w-5 bg-accent",
          "transition-all duration-300 ease-out",
          expanded ? "translate-y-0 -rotate-45" : "translate-y-2 rotate-45"
        ].join(" ")}
      />
    </span>
  );
}

export function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const items = useMemo(() => navItems, []);

  // Only lock scroll for the mobile overlay menu (not for desktop hover flyout).
  useLockBodyScroll(open && isMobile);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <header
      className={[
        // Fixed overlay so the hero sits behind it (Basalte/Anthropic style).
        "fixed top-0 left-0 right-0 z-50",
        // Blend into hero like Basalte/Anthropic — only add tint/blur once you scroll
        scrolled ? "bg-bg/55 backdrop-blur-xl" : "bg-transparent",
        scrolled ? "border-b border-border/30" : "border-b border-transparent"
      ].join(" ")}
    >
      <div className="mx-auto max-w-6xl px-4 pointer-events-none">
        <div className="flex h-16 items-center justify-between gap-3">
          <div className="pointer-events-auto">
            <Logo />
          </div>

          {/* Hidden flyout (desktop hover) + tap-to-open (mobile) */}
          <div
            className="relative pointer-events-auto"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button
              type="button"
              className={[
                "inline-flex items-center justify-center",
                "px-3 py-3",
                "text-sm text-fg",
                "opacity-85 hover:opacity-100 transition-opacity",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-md"
              ].join(" ")}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <DiagonalMenuIcon expanded={open} />
            </button>

            {/* Desktop flyout */}
            <div
              className={[
                "hidden md:block absolute right-0 top-full mt-3 w-[320px]",
                "rounded-2xl border border-border/70 bg-bg/95 backdrop-blur-xl shadow-glow",
                "origin-top-right transition-all duration-200 ease-out",
                open ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 -translate-y-2 scale-[0.98] pointer-events-none"
              ].join(" ")}
            >
              <div className="p-3">
                <div className="grid gap-1">
                  {items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-xl px-3 py-3 text-sm text-fg/90 hover:text-fg hover:bg-panel/60 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Link
                    href="/#contact"
                    className="rounded-xl border border-border/70 bg-panel/40 px-3 py-3 text-sm text-fg/90 hover:bg-panel/70 hover:text-fg transition-colors text-center"
                    onClick={() => setOpen(false)}
                  >
                    Get in touch
                  </Link>
                  <Link
                    href="/#contact"
                    className="rounded-xl bg-accent px-3 py-3 text-sm font-medium text-bg hover:bg-accent/90 transition-colors text-center"
                    onClick={() => setOpen(false)}
                  >
                    Enquire
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay menu */}
      {open ? (
        <div className="md:hidden">
          <div
            className="fixed inset-0 bg-bg/70 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <div className="fixed left-0 right-0 top-16 border-b border-border/60 bg-bg/95">
            <div className="mx-auto max-w-6xl px-4 py-4">
              <div className="grid gap-2">
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-xl px-3 py-3 text-base text-fg hover:bg-panel/60 transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Link
                    href="/#contact"
                    className="rounded-xl border border-border/70 bg-panel/40 px-3 py-3 text-sm text-fg/90 hover:bg-panel/70 hover:text-fg transition-colors text-center"
                    onClick={() => setOpen(false)}
                  >
                    Get in touch
                  </Link>
                  <Link
                    href="/#contact"
                    className="rounded-xl bg-accent px-3 py-3 text-sm font-medium text-bg hover:bg-accent/90 transition-colors text-center"
                    onClick={() => setOpen(false)}
                  >
                    Enquire
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}


