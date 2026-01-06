import { NextResponse } from "next/server";
import { defaultSiteConfig, readSiteConfig, writeSiteConfig, type SiteConfig } from "@/lib/siteConfig";

export const runtime = "nodejs";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function isAllowedAssetUrl(v: unknown): v is string {
  if (typeof v !== "string") return false;
  if (v === "") return true;
  if (v.startsWith("/")) return true; // local public/ path
  if (v.startsWith("https://")) return true; // CDN / R2 public URL
  if (v.startsWith("http://")) return true; // allow non-https for dev
  return false;
}

function sanitize(next: Partial<SiteConfig> | null): SiteConfig {
  const hero: Partial<SiteConfig["hero"]> = next?.hero ?? {};
  const logo: Partial<SiteConfig["logo"]> = next?.logo ?? {};
  const footerLogo: Partial<SiteConfig["footerLogo"]> = next?.footerLogo ?? {};
  const projects = Array.isArray(next?.projects) ? next?.projects : [];

  const enabled = typeof hero.enabled === "boolean" ? hero.enabled : defaultSiteConfig.hero.enabled;
  const mediaType = hero.mediaType === "image" ? "image" : "video";
  const mediaUrl = isAllowedAssetUrl(hero.mediaUrl) ? hero.mediaUrl : defaultSiteConfig.hero.mediaUrl;
  const posterUrl =
    isAllowedAssetUrl(hero.posterUrl)
      ? hero.posterUrl
      : defaultSiteConfig.hero.posterUrl;

  const logoUrl = isAllowedAssetUrl(logo.url) ? logo.url : defaultSiteConfig.logo.url;
  const footerLogoUrl =
    isAllowedAssetUrl(footerLogo.url) ? footerLogo.url : defaultSiteConfig.footerLogo.url;

  return {
    hero: {
      enabled,
      mediaType,
      mediaUrl,
      posterUrl,
      overlayOpacity:
        typeof hero.overlayOpacity === "number" ? clamp(hero.overlayOpacity, 0, 1) : defaultSiteConfig.hero.overlayOpacity,
      mediaXPercent:
        typeof hero.mediaXPercent === "number" ? clamp(hero.mediaXPercent, 0, 100) : defaultSiteConfig.hero.mediaXPercent,
      mediaYPercent:
        typeof hero.mediaYPercent === "number" ? clamp(hero.mediaYPercent, 0, 100) : defaultSiteConfig.hero.mediaYPercent,
      contentXPercent:
        typeof hero.contentXPercent === "number" ? clamp(hero.contentXPercent, 0, 100) : defaultSiteConfig.hero.contentXPercent,
      contentYPercent:
        typeof hero.contentYPercent === "number" ? clamp(hero.contentYPercent, 0, 100) : defaultSiteConfig.hero.contentYPercent,
      contentScale:
        typeof hero.contentScale === "number" ? clamp(hero.contentScale, 0.5, 2) : defaultSiteConfig.hero.contentScale
    },
    logo: {
      url: logoUrl,
      widthPx: typeof logo.widthPx === "number" ? clamp(logo.widthPx, 120, 520) : defaultSiteConfig.logo.widthPx,
      heightPx: typeof logo.heightPx === "number" ? clamp(logo.heightPx, 16, 120) : defaultSiteConfig.logo.heightPx,
      offsetXPx: typeof logo.offsetXPx === "number" ? clamp(logo.offsetXPx, -80, 160) : defaultSiteConfig.logo.offsetXPx,
      offsetYPx: typeof logo.offsetYPx === "number" ? clamp(logo.offsetYPx, -60, 120) : defaultSiteConfig.logo.offsetYPx
    },
    footerLogo: {
      url: footerLogoUrl,
      widthPx:
        typeof footerLogo.widthPx === "number" ? clamp(footerLogo.widthPx, 120, 520) : defaultSiteConfig.footerLogo.widthPx,
      heightPx:
        typeof footerLogo.heightPx === "number" ? clamp(footerLogo.heightPx, 16, 140) : defaultSiteConfig.footerLogo.heightPx,
      offsetXPx:
        typeof footerLogo.offsetXPx === "number" ? clamp(footerLogo.offsetXPx, -80, 160) : defaultSiteConfig.footerLogo.offsetXPx,
      offsetYPx:
        typeof footerLogo.offsetYPx === "number" ? clamp(footerLogo.offsetYPx, -60, 160) : defaultSiteConfig.footerLogo.offsetYPx
    },
    projects: defaultSiteConfig.projects.map((p, idx) => {
      const row = typeof projects[idx] === "object" && projects[idx] ? (projects[idx] as Partial<SiteConfig["projects"][number]>) : {};
      const imageUrl = isAllowedAssetUrl(row.imageUrl) ? row.imageUrl : p.imageUrl;
      return {
        imageUrl,
        mediaXPercent: typeof row.mediaXPercent === "number" ? clamp(row.mediaXPercent, 0, 100) : p.mediaXPercent,
        mediaYPercent: typeof row.mediaYPercent === "number" ? clamp(row.mediaYPercent, 0, 100) : p.mediaYPercent
      };
    })
  };
}

export async function GET() {
  const config = await readSiteConfig();
  return NextResponse.json(config);
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Partial<SiteConfig> | null;
  const next = sanitize(body);
  await writeSiteConfig(next);
  return NextResponse.json(next);
}


