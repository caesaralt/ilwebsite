import { NextResponse } from "next/server";
import { readSiteConfig, writeSiteConfig } from "@/lib/siteConfig";
import { isR2PublicConfigured, makeObjectKey, putPublicObject } from "@/lib/r2";

export const runtime = "nodejs";

const ALLOWED = new Set(["png", "jpg", "jpeg", "webp", "svg"]);

function safeExt(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return ext.replace(/[^a-z0-9]/g, "");
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const target = url.searchParams.get("target"); // header | footer
  if (target !== "header" && target !== "footer") {
    return NextResponse.json({ error: "Missing/invalid target. Use target=header|footer." }, { status: 400 });
  }

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form data." }, { status: 400 });

  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Missing file." }, { status: 400 });

  const ext = safeExt(file.name);
  const mime = file.type || "";
  const isImage = mime.startsWith("image/") && ALLOWED.has(ext);
  if (!isImage) {
    return NextResponse.json({ error: "Only image files (png/jpg/webp/svg) are allowed." }, { status: 400 });
  }

  if (!isR2PublicConfigured()) {
    return NextResponse.json(
      { error: "R2 is not configured. Set R2_* env vars (including R2_PUBLIC_BASE_URL) in Render to enable uploads." },
      { status: 500 }
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const key = makeObjectKey(target === "header" ? "media/logo-header" : "media/logo-footer", file.name);
  const { publicUrl } = await putPublicObject({
    key,
    body: bytes,
    contentType: file.type || "image/svg+xml",
    // Logos may be updated but are still content-addressed by key (timestamp/uuid), so immutable is fine.
    cacheControl: "public, max-age=31536000, immutable"
  });

  const config = await readSiteConfig();
  const next =
    target === "header"
      ? { ...config, logo: { ...config.logo, url: publicUrl } }
      : { ...config, footerLogo: { ...config.footerLogo, url: publicUrl } };

  await writeSiteConfig(next);
  return NextResponse.json({ ok: true, config: next });
}


