import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { readSiteConfig, writeSiteConfig } from "@/lib/siteConfig";

export const runtime = "nodejs";

const ALLOWED_IMAGE = new Set(["png", "jpg", "jpeg", "webp"]);
const ALLOWED_VIDEO = new Set(["mp4", "webm"]);

function safeExt(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return ext.replace(/[^a-z0-9]/g, "");
}

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form data." }, { status: 400 });

  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Missing file." }, { status: 400 });

  const ext = safeExt(file.name);
  const mime = file.type || "";

  const isImage = mime.startsWith("image/") && ALLOWED_IMAGE.has(ext);
  const isVideo = mime.startsWith("video/") && ALLOWED_VIDEO.has(ext);
  if (!isImage && !isVideo) {
    return NextResponse.json(
      { error: "Only image (png/jpg/webp) or video (mp4/webm) files are allowed." },
      { status: 400 }
    );
  }

  // NOTE: This writes to the server filesystem. On some hosts, this is ephemeral unless you use a persistent disk.
  const outDir = path.join(process.cwd(), "public", "media");
  await fs.mkdir(outDir, { recursive: true });

  const filename = `hero.${ext}`;
  const outPath = path.join(outDir, filename);
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(outPath, bytes);

  const config = await readSiteConfig();
  const next = {
    ...config,
    hero: {
      ...config.hero,
      enabled: true,
      mediaType: isImage ? "image" : "video",
      mediaUrl: `/media/${filename}`
    }
  };
  await writeSiteConfig(next);

  return NextResponse.json({ ok: true, config: next });
}

export async function DELETE() {
  const config = await readSiteConfig();
  const next = {
    ...config,
    hero: {
      ...config.hero,
      enabled: false,
      mediaUrl: ""
    }
  };
  await writeSiteConfig(next);
  return NextResponse.json({ ok: true, config: next });
}


