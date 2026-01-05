"use client";

import { useMemo, useState } from "react";

type LeadPayload = {
  name: string;
  email: string;
  phone?: string;
  interest: "Residential" | "Commercial" | "Not sure";
  message?: string;
};

export function LeadForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<LeadPayload>({
    name: "",
    email: "",
    phone: "",
    interest: "Not sure",
    message: ""
  });

  const canSubmit = useMemo(() => {
    return form.name.trim().length >= 2 && /\S+@\S+\.\S+/.test(form.email);
  }, [form.email, form.name]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!canSubmit) {
      setStatus("error");
      setError("Please enter your name and a valid email.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-border/70 bg-panel/40 p-8 shadow-glow">
        <div className="font-[var(--font-display)] text-2xl">Thank you.</div>
        <p className="mt-2 text-sm text-muted">
          Your submission has been received. We’ll be in touch soon.
        </p>
        <button
          type="button"
          className="mt-6 rounded-md border border-border/70 bg-panel/60 px-4 py-2 text-sm text-fg hover:bg-panel transition-colors"
          onClick={() => {
            setStatus("idle");
            setForm({ name: "", email: "", phone: "", interest: "Not sure", message: "" });
          }}
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-border/70 bg-panel/40 p-6 md:p-8 shadow-glow"
    >
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="font-[var(--font-display)] text-2xl">Get in touch</div>
          <p className="mt-2 text-sm text-muted">
            Tell us about your space. We’ll respond with next steps and availability.
          </p>
        </div>
        <div className="hidden md:block text-xs text-muted">
          Response time: typically same/next business day
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-xs uppercase tracking-widest text-muted">Name</span>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="h-11 rounded-md border border-border/70 bg-bg/40 px-3 text-sm text-fg placeholder:text-muted/70 outline-none focus:border-accent/70"
            placeholder="Your name"
            autoComplete="name"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-xs uppercase tracking-widest text-muted">Email</span>
          <input
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="h-11 rounded-md border border-border/70 bg-bg/40 px-3 text-sm text-fg placeholder:text-muted/70 outline-none focus:border-accent/70"
            placeholder="you@company.com"
            autoComplete="email"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-xs uppercase tracking-widest text-muted">Phone (optional)</span>
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="h-11 rounded-md border border-border/70 bg-bg/40 px-3 text-sm text-fg placeholder:text-muted/70 outline-none focus:border-accent/70"
            placeholder="+61 ..."
            autoComplete="tel"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-xs uppercase tracking-widest text-muted">Interest</span>
          <select
            value={form.interest}
            onChange={(e) =>
              setForm((f) => ({ ...f, interest: e.target.value as LeadPayload["interest"] }))
            }
            className="h-11 rounded-md border border-border/70 bg-bg/40 px-3 text-sm text-fg outline-none focus:border-accent/70"
          >
            <option>Not sure</option>
            <option>Residential</option>
            <option>Commercial</option>
          </select>
        </label>
      </div>

      <label className="mt-4 grid gap-2">
        <span className="text-xs uppercase tracking-widest text-muted">Message (optional)</span>
        <textarea
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          className="min-h-28 rounded-md border border-border/70 bg-bg/40 px-3 py-3 text-sm text-fg placeholder:text-muted/70 outline-none focus:border-accent/70"
          placeholder="Tell us about your project (location, timeline, goals, etc.)"
        />
      </label>

      {error ? <div className="mt-4 text-sm text-red-300">{error}</div> : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === "submitting" || !canSubmit}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:hover:bg-accent"
        >
          {status === "submitting" ? "Sending..." : "Enquire"}
        </button>
        <div className="text-xs text-muted">
          Privacy-first by design. We don’t sell your data.
        </div>
      </div>
    </form>
  );
}


