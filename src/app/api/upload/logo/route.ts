import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { readSiteConfig, writeSiteConfig } from "@/lib/siteConfig";

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

  const outDir = path.join(process.cwd(), "public", "media");
  await fs.mkdir(outDir, { recursive: true });

  const filename = target === "header" ? `logo-header.${ext}` : `logo-footer.${ext}`;
  const outPath = path.join(outDir, filename);
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(outPath, bytes);

  const config = await readSiteConfig();
  const urlPath = `/media/${filename}`;
  const next =
    target === "header"
      ? { ...config, logo: { ...config.logo, url: urlPath } }
      : { ...config, footerLogo: { ...config.footerLogo, url: urlPath } };

  await writeSiteConfig(next);
  return NextResponse.json({ ok: true, config: next });
}


