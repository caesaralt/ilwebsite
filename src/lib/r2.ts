import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

export type R2CoreEnv = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
};

export type R2PublicEnv = R2CoreEnv & {
  publicBaseUrl: string;
};

function readR2CoreEnv(): R2CoreEnv | null {
  const accountId = process.env.R2_ACCOUNT_ID ?? "";
  const accessKeyId = process.env.R2_ACCESS_KEY_ID ?? "";
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY ?? "";
  const bucket = process.env.R2_BUCKET ?? "";

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) return null;
  return { accountId, accessKeyId, secretAccessKey, bucket };
}

export function isR2Configured(): boolean {
  return readR2CoreEnv() !== null;
}

export function isR2PublicConfigured(): boolean {
  const core = readR2CoreEnv();
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL ?? "";
  return !!(core && publicBaseUrl);
}

function getClient(env: R2CoreEnv) {
  // Cloudflare R2 is S3-compatible; region is "auto" and endpoint is account-scoped.
  return new S3Client({
    region: "auto",
    endpoint: `https://${env.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.accessKeyId,
      secretAccessKey: env.secretAccessKey
    },
    forcePathStyle: true
  });
}

function joinPublicUrl(base: string, key: string) {
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  const k = key.startsWith("/") ? key.slice(1) : key;
  // Don't encode '/' separators; only encode individual segments.
  const encoded = k
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
  return `${b}/${encoded}`;
}

export function makeObjectKey(prefix: string, filename: string) {
  const cleanPrefix = prefix.replace(/^\/*/, "").replace(/\/*$/, "");
  const cleanName = filename
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^\-+|\-+$/g, "");

  const id = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : crypto.randomBytes(16).toString("hex");
  return `${cleanPrefix}/${Date.now()}-${id}-${cleanName}`;
}

export async function putPublicObject(args: {
  key: string;
  body: Uint8Array;
  contentType: string;
  cacheControl?: string;
}) {
  const core = readR2CoreEnv();
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL ?? "";
  if (!core || !publicBaseUrl) throw new Error("R2 public uploads are not configured (missing env vars).");

  const env: R2PublicEnv = { ...core, publicBaseUrl };

  const client = getClient(env);

  await client.send(
    new PutObjectCommand({
      Bucket: env.bucket,
      Key: args.key,
      Body: args.body,
      ContentType: args.contentType,
      CacheControl: args.cacheControl ?? "public, max-age=31536000, immutable"
    })
  );

  return { publicUrl: joinPublicUrl(env.publicBaseUrl, args.key) };
}

export async function putObject(args: {
  key: string;
  body: Uint8Array;
  contentType: string;
  cacheControl?: string;
}) {
  const env = readR2CoreEnv();
  if (!env) throw new Error("R2 is not configured (missing env vars).");

  const client = getClient(env);
  await client.send(
    new PutObjectCommand({
      Bucket: env.bucket,
      Key: args.key,
      Body: args.body,
      ContentType: args.contentType,
      CacheControl: args.cacheControl
    })
  );
}

async function streamToString(body: any): Promise<string> {
  // Node.js runtime: AWS SDK v3 returns a Readable stream for GetObjectCommand.Body.
  if (!body) return "";
  if (typeof body.transformToString === "function") return await body.transformToString();

  const chunks: Buffer[] = [];
  for await (const chunk of body as AsyncIterable<Buffer | Uint8Array | string>) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

export async function getObjectText(key: string): Promise<string | null> {
  const env = readR2CoreEnv();
  if (!env) return null;

  const client = getClient(env);
  try {
    const res = await client.send(
      new GetObjectCommand({
        Bucket: env.bucket,
        Key: key
      })
    );
    return await streamToString(res.Body);
  } catch {
    return null;
  }
}


