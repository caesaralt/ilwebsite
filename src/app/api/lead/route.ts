import { NextResponse } from "next/server";

type LeadPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  interest?: unknown;
  message?: unknown;
};

function isEmail(v: unknown): v is string {
  return typeof v === "string" && /\S+@\S+\.\S+/.test(v);
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as LeadPayload | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = body.email;
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const interest = typeof body.interest === "string" ? body.interest.trim() : "Not sure";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (name.length < 2 || !isEmail(email)) {
    return NextResponse.json({ error: "Name and valid email are required." }, { status: 400 });
  }

  // TODO (future): Persist to DB (Render Postgres), send email, push to CRM, etc.
  // For now we log in server output so Render logs capture leads during early stages.
  console.log("[lead]", {
    name,
    email,
    phone,
    interest,
    message,
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({ ok: true });
}


