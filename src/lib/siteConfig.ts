import { promises as fs } from "fs";
import path from "path";
import { getObjectText, isR2Configured, putObject } from "@/lib/r2";

export type SiteConfig = {
  hero: {
    enabled: boolean;
    mediaType: "video" | "image";
    mediaUrl: string;
    posterUrl?: string;
    overlayOpacity: number; // 0..1
    mediaXPercent: number; // 0..100
    mediaYPercent: number; // 0..100
    contentXPercent: number; // 0..100
    contentYPercent: number; // 0..100
    contentScale: number; // e.g. 0.5..2
  };
  logo: {
    url: string;
    widthPx: number;
    heightPx: number;
    offsetXPx: number;
    offsetYPx: number;
  };
  footerLogo: {
    url: string;
    widthPx: number;
    heightPx: number;
    offsetXPx: number;
    offsetYPx: number;
  };
  projects: Array<{
    imageUrl: string;
    mediaXPercent: number;
    mediaYPercent: number;
  }>;
};

export const defaultSiteConfig: SiteConfig = {
  hero: {
    enabled: true,
    mediaType: "video",
    mediaUrl: "/media/hero.mp4",
    posterUrl: "",
    overlayOpacity: 0.55,
    mediaXPercent: 50,
    mediaYPercent: 50,
    contentXPercent: 8,
    contentYPercent: 42,
    contentScale: 1
  },
  logo: {
    url: "/media/integratd-living-logo.png",
    widthPx: 290,
    heightPx: 32,
    offsetXPx: 0,
    offsetYPx: 0
  },
  footerLogo: {
    url: "/media/integratd-living-logo.png",
    widthPx: 220,
    heightPx: 28,
    offsetXPx: 0,
    offsetYPx: 0
  },
  projects: [
    { imageUrl: "", mediaXPercent: 50, mediaYPercent: 50 },
    { imageUrl: "", mediaXPercent: 50, mediaYPercent: 50 },
    { imageUrl: "", mediaXPercent: 50, mediaYPercent: 50 }
  ]
};

function configPath() {
  // Stored under /public so it can be served and also edited on the server.
  return path.join(process.cwd(), "public", "config", "site.json");
}

export async function readSiteConfig(): Promise<SiteConfig> {
  try {
    const raw = await fs.readFile(configPath(), "utf8");
    const parsed = JSON.parse(raw) as Partial<SiteConfig>;

    const parsedProjects = Array.isArray(parsed.projects) ? parsed.projects : [];
    const projects = defaultSiteConfig.projects.map((p, idx) => ({
      ...p,
      ...(typeof parsedProjects[idx] === "object" && parsedProjects[idx] ? parsedProjects[idx] : {})
    }));

    return {
      hero: { ...defaultSiteConfig.hero, ...(parsed.hero ?? {}) },
      logo: { ...defaultSiteConfig.logo, ...(parsed.logo ?? {}) },
      footerLogo: { ...defaultSiteConfig.footerLogo, ...(parsed.footerLogo ?? {}) },
      projects
    };
  } catch {
    // If local file isn't available (e.g., Render ephemeral FS on a fresh deploy),
    // fall back to Cloudflare R2 if configured.
    if (isR2Configured()) {
      const text = await getObjectText("config/site.json");
      if (text) {
        try {
          const parsed = JSON.parse(text) as Partial<SiteConfig>;
          const parsedProjects = Array.isArray(parsed.projects) ? parsed.projects : [];
          const projects = defaultSiteConfig.projects.map((p, idx) => ({
            ...p,
            ...(typeof parsedProjects[idx] === "object" && parsedProjects[idx] ? parsedProjects[idx] : {})
          }));

          const merged: SiteConfig = {
            hero: { ...defaultSiteConfig.hero, ...(parsed.hero ?? {}) },
            logo: { ...defaultSiteConfig.logo, ...(parsed.logo ?? {}) },
            footerLogo: { ...defaultSiteConfig.footerLogo, ...(parsed.footerLogo ?? {}) },
            projects
          };

          // Write-through cache to local disk (best-effort) for faster subsequent reads.
          try {
            const p = configPath();
            await fs.mkdir(path.dirname(p), { recursive: true });
            await fs.writeFile(p, JSON.stringify(merged, null, 2) + "\n", "utf8");
          } catch {
            // ignore
          }

          return merged;
        } catch {
          // ignore and fall through to default
        }
      }
    }

    return defaultSiteConfig;
  }
}

export async function writeSiteConfig(next: SiteConfig) {
  const p = configPath();
  await fs.mkdir(path.dirname(p), { recursive: true });
  const json = JSON.stringify(next, null, 2) + "\n";
  await fs.writeFile(p, json, "utf8");

  // Persist to R2 so config survives deploys/restarts on ephemeral filesystems.
  if (isR2Configured()) {
    await putObject({
      key: "config/site.json",
      body: Buffer.from(json),
      contentType: "application/json; charset=utf-8",
      // Config changes frequently; avoid long-lived caching.
      cacheControl: "no-store"
    });
  }
}


