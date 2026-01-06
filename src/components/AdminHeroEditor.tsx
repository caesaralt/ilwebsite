 "use client";

import { useEffect, useMemo, useState } from "react";
import type { SiteConfig } from "@/lib/siteConfig";

type SaveState = "idle" | "saving" | "saved" | "error";

async function fetchConfig(): Promise<SiteConfig> {
  const res = await fetch("/api/config", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load config");
  return (await res.json()) as SiteConfig;
}

async function saveConfig(next: SiteConfig): Promise<SiteConfig> {
  const res = await fetch("/api/config", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(next)
  });
  if (!res.ok) throw new Error("Failed to save config");
  return (await res.json()) as SiteConfig;
}

async function uploadFile(endpoint: string, file: File): Promise<SiteConfig> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(endpoint, { method: "POST", body: form });
  if (!res.ok) throw new Error("Upload failed");
  const data = (await res.json()) as { config: SiteConfig };
  return data.config;
}

async function removeHero(): Promise<SiteConfig> {
  const res = await fetch("/api/upload/hero", { method: "DELETE" });
  if (!res.ok) throw new Error("Remove failed");
  const data = (await res.json()) as { config: SiteConfig };
  return data.config;
}

export function AdminHeroEditor() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [uploadState, setUploadState] = useState<SaveState>("idle");

  useEffect(() => {
    fetchConfig()
      .then(setConfig)
      .catch(() => setConfig(null));
  }, []);

  const statusPill = (s: SaveState) => {
    if (s === "idle") return null;
    const label = s === "saving" ? "Working…" : s === "saved" ? "Done" : "Error";
    const tone =
      s === "saved"
        ? "bg-accent/20 text-accent"
        : s === "error"
          ? "bg-red-500/15 text-red-300"
          : "bg-panel/50 text-fg/80";
    return <span className={`rounded-full px-2 py-1 text-xs ${tone}`}>{label}</span>;
  };

  const heroPreview = useMemo(() => {
    if (!config) return null;
    const { hero } = config;
    const overlay = `rgba(21,24,11,${hero.overlayOpacity})`;
    const objectPosition = `${hero.mediaXPercent}% ${hero.mediaYPercent}%`;
    const hasMedia = hero.enabled && hero.mediaUrl;

    return (
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-bg/40 aspect-[16/9]">
        {hasMedia ? (
          hero.mediaType === "video" ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition }}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={hero.posterUrl || undefined}
            >
              <source src={hero.mediaUrl} />
            </video>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hero.mediaUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition }}
            />
          )
        ) : (
          <div className="absolute inset-0 bg-bg/90" />
        )}

        <div className="pointer-events-none absolute inset-0" style={{ background: overlay }} />

        <div
          className="absolute max-w-[70%] text-fg"
          style={{
            left: `${hero.contentXPercent}%`,
            top: `${hero.contentYPercent}%`,
            transform: `scale(${hero.contentScale})`,
            transformOrigin: "top left"
          }}
        >
          <div className="font-[var(--font-display)] text-4xl leading-[0.95] tracking-tight">Hero title preview</div>
          <div className="mt-2 text-sm text-muted">Adjust placement below.</div>
        </div>
      </div>
    );
  }, [config]);

  async function withUpload(work: () => Promise<SiteConfig>) {
    setUploadState("saving");
    try {
      const next = await work();
      setConfig(next);
      setUploadState("saved");
      setTimeout(() => setUploadState("idle"), 1200);
    } catch {
      setUploadState("error");
    }
  }

  async function onSave(next: SiteConfig) {
    setSaveState("saving");
    try {
      const saved = await saveConfig(next);
      setConfig(saved);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1200);
    } catch {
      setSaveState("error");
    }
  }

  if (!config) {
    return (
      <div className="rounded-2xl border border-border/60 bg-panel/30 p-6">
        <div className="text-sm text-muted">Loading editor…</div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-[var(--font-display)] text-2xl">Landing editor</div>
          <div className="mt-1 text-sm text-muted">
            Upload/position the landing background, logos, and project images.
          </div>
        </div>
        <div className="flex items-center gap-2">
          {statusPill(uploadState)}
          {statusPill(saveState)}
        </div>
      </div>

      {heroPreview}

      {/* HERO BACKGROUND */}
      <div className="rounded-2xl border border-border/60 bg-panel/30 p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-medium">Hero background</div>
            <div className="mt-1 text-sm text-muted">
              Upload image/video, move the crop (object-position), or remove it entirely.
            </div>
          </div>
          <button
            type="button"
            className="rounded-md border border-border/60 bg-bg/30 px-3 py-2 text-sm text-fg/90 hover:bg-bg/40 transition-colors"
            onClick={() => void withUpload(() => removeHero())}
          >
            Remove background
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-fg/90">
            <input
              type="checkbox"
              checked={config.hero.enabled}
              onChange={(e) =>
                setConfig((c) => (c ? { ...c, hero: { ...c.hero, enabled: e.target.checked } } : c))
              }
            />
            Enabled
          </label>
          <div className="text-xs text-muted">
            Current: <span className="text-fg/80">{config.hero.mediaUrl || "(none)"}</span>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted">Upload</div>
            <input
              className="mt-2 block w-full text-sm"
              type="file"
              accept="image/png,image/jpeg,image/webp,video/mp4,video/webm"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void withUpload(() => uploadFile("/api/upload/hero", f));
                e.currentTarget.value = "";
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted">Media X% (crop)</label>
              <input
                className="mt-1 w-full rounded-md border border-border/60 bg-bg/40 px-2 py-1 text-sm"
                type="number"
                min={0}
                max={100}
                value={config.hero.mediaXPercent}
                onChange={(e) =>
                  setConfig((c) => (c ? { ...c, hero: { ...c.hero, mediaXPercent: Number(e.target.value) } } : c))
                }
              />
            </div>
            <div>
              <label className="block text-xs text-muted">Media Y% (crop)</label>
              <input
                className="mt-1 w-full rounded-md border border-border/60 bg-bg/40 px-2 py-1 text-sm"
                type="number"
                min={0}
                max={100}
                value={config.hero.mediaYPercent}
                onChange={(e) =>
                  setConfig((c) => (c ? { ...c, hero: { ...c.hero, mediaYPercent: Number(e.target.value) } } : c))
                }
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-muted">Overlay opacity ({config.hero.overlayOpacity})</label>
              <input
                className="mt-2 w-full"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={config.hero.overlayOpacity}
                onChange={(e) =>
                  setConfig((c) => (c ? { ...c, hero: { ...c.hero, overlayOpacity: Number(e.target.value) } } : c))
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* HERO TEXT */}
      <div className="rounded-2xl border border-border/60 bg-panel/30 p-6">
        <div className="text-sm font-medium">Hero text placement</div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-muted">X% (left)</label>
            <input
              className="mt-1 w-full rounded-md border border-border/60 bg-bg/40 px-2 py-1 text-sm"
              type="number"
              min={0}
              max={100}
              value={config.hero.contentXPercent}
              onChange={(e) =>
                setConfig((c) => (c ? { ...c, hero: { ...c.hero, contentXPercent: Number(e.target.value) } } : c))
              }
            />
          </div>
          <div>
            <label className="block text-xs text-muted">Y% (top)</label>
            <input
              className="mt-1 w-full rounded-md border border-border/60 bg-bg/40 px-2 py-1 text-sm"
              type="number"
              min={0}
              max={100}
              value={config.hero.contentYPercent}
              onChange={(e) =>
                setConfig((c) => (c ? { ...c, hero: { ...c.hero, contentYPercent: Number(e.target.value) } } : c))
              }
            />
          </div>
          <div>
            <label className="block text-xs text-muted">Scale</label>
            <input
              className="mt-1 w-full rounded-md border border-border/60 bg-bg/40 px-2 py-1 text-sm"
              type="number"
              min={0.5}
              max={2}
              step={0.05}
              value={config.hero.contentScale}
              onChange={(e) =>
                setConfig((c) => (c ? { ...c, hero: { ...c.hero, contentScale: Number(e.target.value) } } : c))
              }
            />
          </div>
        </div>
      </div>

      {/* LOGOS */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-panel/30 p-6">
          <div className="text-sm font-medium">Header logo (top-left)</div>
          <div className="mt-2 text-sm text-muted">Upload and move/resize the header logo.</div>

          <input
            className="mt-4 block w-full text-sm"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void withUpload(() => uploadFile("/api/upload/logo?target=header", f));
              e.currentTarget.value = "";
            }}
          />

          <div className="mt-3 text-xs text-muted">
            Current: <span className="text-fg/80">{config.logo.url}</span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-xs text-muted">Width (px)</label>
              <input
                className="mt-1 w-full rounded-md border border-border/60 bg-bg/40 px-2 py-1 text-sm"
                type="number"
                value={config.logo.widthPx}
                onChange={(e) =>
                  setConfig((c) => (c ? { ...c, logo: { ...c.logo, widthPx: Number(e.target.value) } } : c))
                }
              />
            </div>
            <div>
              <label className="block text-xs text-muted">Height (px)</label>
              <input
                className="mt-1 w-full rounded-md border border-border/60 bg-bg/40 px-2 py-1 text-sm"
                type="number"
                value={config.logo.heightPx}
                onChange={(e) =>
                  setConfig((c) => (c ? { ...c, logo: { ...c.logo, heightPx: Number(e.target.value) } } : c))
                }
              />
            </div>
            <div>
              <label className="block text-xs text-muted">Offset X (px)</label>
              <input
                className="mt-1 w-full rounded-md border border-border/60 bg-bg/40 px-2 py-1 text-sm"
                type="number"
                value={config.logo.offsetXPx}
                onChange={(e) =>
                  setConfig((c) => (c ? { ...c, logo: { ...c.logo, offsetXPx: Number(e.target.value) } } : c))
                }
              />
            </div>
            <div>
              <label className="block text-xs text-muted">Offset Y (px)</label>
              <input
                className="mt-1 w-full rounded-md border border-border/60 bg-bg/40 px-2 py-1 text-sm"
                type="number"
                value={config.logo.offsetYPx}
                onChange={(e) =>
                  setConfig((c) => (c ? { ...c, logo: { ...c.logo, offsetYPx: Number(e.target.value) } } : c))
                }
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-panel/30 p-6">
          <div className="text-sm font-medium">Footer logo</div>
          <div className="mt-2 text-sm text-muted">Upload and move/resize the logo at the bottom of the page.</div>

          <input
            className="mt-4 block w-full text-sm"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void withUpload(() => uploadFile("/api/upload/logo?target=footer", f));
              e.currentTarget.value = "";
            }}
          />

          <div className="mt-3 text-xs text-muted">
            Current: <span className="text-fg/80">{config.footerLogo.url}</span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-xs text-muted">Width (px)</label>
              <input
                className="mt-1 w-full rounded-md border border-border/60 bg-bg/40 px-2 py-1 text-sm"
                type="number"
                value={config.footerLogo.widthPx}
                onChange={(e) =>
                  setConfig((c) =>
                    c ? { ...c, footerLogo: { ...c.footerLogo, widthPx: Number(e.target.value) } } : c
                  )
                }
              />
            </div>
            <div>
              <label className="block text-xs text-muted">Height (px)</label>
              <input
                className="mt-1 w-full rounded-md border border-border/60 bg-bg/40 px-2 py-1 text-sm"
                type="number"
                value={config.footerLogo.heightPx}
                onChange={(e) =>
                  setConfig((c) =>
                    c ? { ...c, footerLogo: { ...c.footerLogo, heightPx: Number(e.target.value) } } : c
                  )
                }
              />
            </div>
            <div>
              <label className="block text-xs text-muted">Offset X (px)</label>
              <input
                className="mt-1 w-full rounded-md border border-border/60 bg-bg/40 px-2 py-1 text-sm"
                type="number"
                value={config.footerLogo.offsetXPx}
                onChange={(e) =>
                  setConfig((c) =>
                    c ? { ...c, footerLogo: { ...c.footerLogo, offsetXPx: Number(e.target.value) } } : c
                  )
                }
              />
            </div>
            <div>
              <label className="block text-xs text-muted">Offset Y (px)</label>
              <input
                className="mt-1 w-full rounded-md border border-border/60 bg-bg/40 px-2 py-1 text-sm"
                type="number"
                value={config.footerLogo.offsetYPx}
                onChange={(e) =>
                  setConfig((c) =>
                    c ? { ...c, footerLogo: { ...c.footerLogo, offsetYPx: Number(e.target.value) } } : c
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* PROJECTS */}
      <div className="rounded-2xl border border-border/60 bg-panel/30 p-6">
        <div className="text-sm font-medium">Projects images</div>
        <div className="mt-2 text-sm text-muted">Upload images for the 3 project cards and adjust their crop.</div>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {config.projects.map((p, idx) => {
            const objectPosition = `${p.mediaXPercent}% ${p.mediaYPercent}%`;
            return (
              <div key={idx} className="rounded-xl border border-border/60 bg-bg/20 p-4">
                <div className="text-xs text-muted">Project #{idx + 1}</div>
                <div className="mt-3 relative overflow-hidden rounded-xl border border-border/60 bg-bg/40 h-28">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.imageUrl}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{ objectPosition }}
                    />
                  ) : null}
                </div>
                <input
                  className="mt-3 block w-full text-sm"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void withUpload(() => uploadFile(`/api/upload/project?index=${idx}`, f));
                    e.currentTarget.value = "";
                  }}
                />
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-muted">X%</label>
                    <input
                      className="mt-1 w-full rounded-md border border-border/60 bg-bg/40 px-2 py-1 text-sm"
                      type="number"
                      min={0}
                      max={100}
                      value={p.mediaXPercent}
                      onChange={(e) =>
                        setConfig((c) =>
                          c
                            ? {
                                ...c,
                                projects: c.projects.map((row, i) =>
                                  i === idx ? { ...row, mediaXPercent: Number(e.target.value) } : row
                                )
                              }
                            : c
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted">Y%</label>
                    <input
                      className="mt-1 w-full rounded-md border border-border/60 bg-bg/40 px-2 py-1 text-sm"
                      type="number"
                      min={0}
                      max={100}
                      value={p.mediaYPercent}
                      onChange={(e) =>
                        setConfig((c) =>
                          c
                            ? {
                                ...c,
                                projects: c.projects.map((row, i) =>
                                  i === idx ? { ...row, mediaYPercent: Number(e.target.value) } : row
                                )
                              }
                            : c
                        )
                      }
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-3 w-full rounded-md border border-border/60 bg-bg/30 px-3 py-2 text-sm text-fg/90 hover:bg-bg/40 transition-colors"
                  onClick={() =>
                    setConfig((c) =>
                      c
                        ? {
                            ...c,
                            projects: c.projects.map((row, i) => (i === idx ? { ...row, imageUrl: "" } : row))
                          }
                        : c
                    )
                  }
                >
                  Clear image
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent/90 transition-colors"
        onClick={() => void onSave(config)}
      >
        Save all settings
      </button>

      <div className="rounded-2xl border border-border/60 bg-bg/30 p-4 text-xs text-muted">
        Note: uploads/settings are stored in Cloudflare R2 when R2 env vars are configured (recommended for Render).
        If R2 isn’t configured, uploads will fail on production.
      </div>
    </div>
  );
}


