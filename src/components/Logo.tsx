"use client";

import Link from "next/link";
import { useState } from "react";
import { company } from "@/lib/site";
import type { SiteConfig } from "@/lib/siteConfig";

export function Logo({ logo }: { logo?: SiteConfig["logo"] }) {
  const [imgError, setImgError] = useState(false);
  const cfg: SiteConfig["logo"] = logo ?? {
    url: "/media/integratd-living-logo.png",
    widthPx: 290,
    heightPx: 32,
    offsetXPx: 0,
    offsetYPx: 0
  };

  return (
    <Link
      href="/"
      className="group inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-md"
      aria-label={`${company.name} home`}
    >
      {!imgError ? (
        <span
          className="relative"
          style={{
            width: `${cfg.widthPx}px`,
            height: `${cfg.heightPx}px`,
            transform: `translate(${cfg.offsetXPx}px, ${cfg.offsetYPx}px)`
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cfg.url}
            alt="Integratd Living"
            className="absolute inset-0 h-full w-full object-contain"
            onError={() => setImgError(true)}
          />
        </span>
      ) : (
        <span className="font-[var(--font-display)] text-xl tracking-wide text-fg group-hover:text-fg/90">
          {company.name}
        </span>
      )}
    </Link>
  );
}


