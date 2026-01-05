"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { company } from "@/lib/site";

export function Logo() {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href="/"
      className="group inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-md"
      aria-label={`${company.name} home`}
    >
      {!imgError ? (
        <span className="relative h-7 w-[240px] md:h-8 md:w-[290px]">
          <Image
            src="/media/integratd-living-logo.png"
            alt="Integratd Living"
            fill
            priority
            sizes="(max-width: 768px) 240px, 290px"
            className="object-contain"
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


