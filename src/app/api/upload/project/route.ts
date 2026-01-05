import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { readSiteConfig, writeSiteConfig } from "@/lib/siteConfig";

export const runtime = "nodejs";

const ALLOWED = new Set(["png", "jpg", "jpeg", "webp"]);

function safeExt(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return ext.replace(/[^a-z0-9]/g, "");
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const indexRaw = url.searchParams.get("index");
  const index = indexRaw ? Number(indexRaw) : NaN;
  if (!Number.isInteger(index) || index < 0 || index > 2) {
    return NextResponse.json({ error: "Missing/invalid index. Use index=0|1|2." }, { status: 400 });
  }

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form data." }, { status: 400 });

  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Missing file." }, { status: 400 });

  const ext = safeExt(file.name);
  const mime = file.type || "";
  const isImage = mime.startsWith("image/") && ALLOWED.has(ext);
  if (!isImage) {
    return NextResponse.json({ error: "Only image files (png/jpg/webp) are allowed." }, { status: 400 });
  }

  const outDir = path.join(process.cwd(), "public", "media");
  await fs.mkdir(outDir, { recursive: true });

  const filename = `project-${index}.${ext}`;
  const outPath = path.join(outDir, filename);
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(outPath, bytes);

  const config = await readSiteConfig();
  const next = {
    ...config,
    projects: config.projects.map((p, i) => (i === index ? { ...p, imageUrl: `/media/${filename}` } : p))
  };
  await writeSiteConfig(next);
  return NextResponse.json({ ok: true, config: next });
}


