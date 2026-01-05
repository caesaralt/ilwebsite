import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";
import { company } from "@/lib/site";
import { readSiteConfig } from "@/lib/siteConfig";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border/70 bg-panel/40 px-3 py-1 text-xs text-fg/90">
      {children}
    </span>
  );
}

function SectionTitle({
  eyebrow,
  title,
  body
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-muted">{eyebrow}</div>
      <h2 className="mt-3 font-[var(--font-display)] text-3xl md:text-4xl leading-tight">{title}</h2>
      {body ? <p className="mt-3 text-sm md:text-base text-muted max-w-2xl">{body}</p> : null}
    </div>
  );
}

export default async function HomePage() {
  // Server-side read, so the landing page reflects the latest saved config.
  // (If your host uses ephemeral filesystem, consider moving this to a DB/object-store.)
  const config = await readSiteConfig();
  const heroObjectPosition = `${config.hero.mediaXPercent}% ${config.hero.mediaYPercent}%`;

  return (
    <div className="grain">
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[100svh]">
        {/* Background media */}
        {config.hero.enabled && config.hero.mediaUrl ? (
          config.hero.mediaType === "video" ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: heroObjectPosition }}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={config.hero.posterUrl || undefined}
              aria-hidden="true"
            >
              <source src={config.hero.mediaUrl} />
            </video>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={config.hero.mediaUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: heroObjectPosition }}
              aria-hidden="true"
            />
          )
        ) : null}

        {/* Readability overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{ backgroundColor: `rgba(21,24,11,${config.hero.overlayOpacity})` }}
        />

        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(1200px 600px at 20% 10%, rgba(133,139,120,0.16), transparent 60%), radial-gradient(900px 500px at 80% 0%, rgba(94,106,68,0.22), transparent 55%), linear-gradient(to bottom, rgba(206,206,206,0.03), transparent)"
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 min-h-[100svh]">
          <div
            className="absolute max-w-[44rem]"
            style={{
              left: `${config.hero.contentXPercent}%`,
              top: `${config.hero.contentYPercent}%`,
              transform: `scale(${config.hero.contentScale})`,
              transformOrigin: "top left"
            }}
          >
            <h1 className="font-[var(--font-display)] text-5xl md:text-7xl leading-[0.95] tracking-tight">
              {company.byline}
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted max-w-2xl">
              {company.subbyline} Lighting, climate, shading, security, audio and energy — all
              orchestrated as one system.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/#contact"
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              >
                Enquire today
              </Link>
              <Link
                href="/#future"
                className="rounded-md border border-border/70 bg-panel/40 px-4 py-2 text-sm text-fg/90 hover:bg-panel/70 hover:text-fg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* OUR FUTURE / LOXONE */}
      <section id="future" className="border-t border-border/60 space-y-3 bg-black">
        <div
          className="rounded-2xl border-0 border-none border-transparent bg-panel/40 p-5"
          style={{ borderImage: "none" }}
        >
          <div className="text-xs uppercase tracking-widest text-muted">A smarter standard</div>
          <div className="mt-3 font-[var(--font-display)] text-2xl leading-snug">
            Automation that works quietly in the background.
          </div>
          <p className="mt-3 text-sm text-muted">
            Not a bundle of apps — a unified system that’s reliable even when the internet isn’t.
          </p>
        </div>

        <div
          className="rounded-2xl border border-black bg-panel/30 p-5 hover:bg-panel/40 transition-colors box-content flex flex-wrap"
          style={{ borderImage: "none" }}
        >
          <div className="font-[var(--font-display)] text-xl w-full">Effortless comfort</div>
          <p className="mt-2 text-sm text-muted w-full">
            Lighting, climate and shading adapt to your lifestyle.
          </p>
        </div>

        <div
          className="rounded-2xl border border-black bg-panel/30 p-5 hover:bg-panel/40 transition-colors box-content flex flex-wrap"
          style={{ borderImage: "none" }}
        >
          <div className="font-[var(--font-display)] text-xl w-full">Security & control</div>
          <p className="mt-2 text-sm text-muted w-full">
            Integrated access, alarms and monitoring — designed for real-world use.
          </p>
        </div>

        <div
          className="rounded-2xl border border-black bg-panel/30 p-5 hover:bg-panel/40 transition-colors box-content flex flex-wrap"
          style={{ borderImage: "none" }}
        >
          <div className="font-[var(--font-display)] text-xl w-full">Energy that pays back</div>
          <p className="mt-2 text-sm text-muted w-full">
            Intelligent management helps reduce waste without sacrificing luxury.
          </p>
        </div>

        {/* Image slot (add image later) */}
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="min-h-[360px] overflow-hidden rounded-3xl border border-border/40 bg-panel/15 md:min-h-[520px]" />
        </div>

        <div className="mx-auto max-w-6xl bg-black px-4 py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-12 md:items-start">
            <div className="md:order-2 md:col-span-6">
              <SectionTitle
                eyebrow="We build with Loxone"
                title="The industry leader in automation."
                body="Unlike conventional smart devices, Loxone delivers a fully integrated system that manages lighting, climate, security and energy with minimal user input."
              />
              <div className="mt-7 flex flex-wrap gap-2">
                <Pill>Local-first reliability</Pill>
                <Pill>Single ecosystem</Pill>
                <Pill>Private by design</Pill>
              </div>
            </div>
            <div className="md:order-1 md:col-span-6">
              <div className="rounded-2xl border border-border/70 bg-panel/30 p-6 md:p-8 shadow-glow">
                <div className="grid gap-5 md:grid-cols-2">
                  {[
                    { title: "Lighting", body: "Scenes that match the moment — and save energy." },
                    { title: "Climate", body: "Room-by-room temperature control in harmony with shading." },
                    { title: "Security", body: "Access, alarms, sensors and monitoring in one system." },
                    { title: "Energy", body: "Smarter consumption through coordinated automation." }
                  ].map((f) => (
                    <div key={f.title} className="rounded-xl border border-border/60 bg-bg/20 p-4">
                      <div className="text-sm font-medium">{f.title}</div>
                      <div className="mt-1 text-sm text-muted">{f.body}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESIDENTIAL / COMMERCIAL SPLIT */}
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="grid gap-6 md:grid-cols-2">
            <div
              id="residential"
              className="rounded-2xl border border-border/70 bg-panel/30 p-7 md:p-10 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.15)]"
            >
              <div className="text-xs uppercase tracking-widest text-muted">Residential</div>
              <div className="mt-3 font-[var(--font-display)] text-3xl leading-tight">
                Households ready to invest in scalable convenience.
              </div>
              <p className="mt-3 text-sm text-muted">
                A home that anticipates you — effortless comfort, enhanced security, and intelligent
                energy management.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-fg/90">
                <li>
                  <span className="text-accent">•</span> Effortless comfort & efficiency
                </li>
                <li>
                  <span className="text-accent">•</span> Enhanced security & control
                </li>
                <li>
                  <span className="text-accent">•</span> Seamless entertainment & energy monitoring
                </li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/#contact"
                  className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent/90 transition-colors"
                >
                  Enquire (Residential)
                </Link>
                <Link
                  href="/#projects"
                  className="rounded-md border border-border/70 bg-bg/20 px-4 py-2 text-sm text-fg/90 hover:bg-panel/60 hover:text-fg transition-colors"
                >
                  View projects
                </Link>
              </div>
            </div>

            <div
              id="commercial"
              className="rounded-2xl border border-black bg-panel/30 p-7 md:p-10 shadow-none"
            >
              <div className="text-xs uppercase tracking-widest text-muted">Commercial</div>
              <div className="mt-3 font-[var(--font-display)] text-3xl leading-tight">
                For business owners who prioritise efficiency.
              </div>
              <p className="mt-3 text-sm text-muted">
                Intelligent control for offices, hospitality and custom applications — scalable,
                secure and privacy-first.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-fg/90">
                <li>
                  <span className="text-accent">•</span> Office buildings: lighting, climate, access
                </li>
                <li>
                  <span className="text-accent">•</span> Hospitality: occupancy-based comfort + remote
                  management
                </li>
                <li>
                  <span className="text-accent">•</span> Custom applications: third-party integration + tailored interfaces
                </li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/#contact"
                  className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent/90 transition-colors"
                >
                  Enquire (Commercial)
                </Link>
                <Link
                  href="/#future"
                  className="rounded-md border border-border/70 bg-bg/20 px-4 py-2 text-sm text-fg/90 hover:bg-panel/60 hover:text-fg transition-colors"
                >
                  Why Loxone
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="border-t border-border/60 bg-black">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <SectionTitle
              eyebrow="Projects"
              title="Explore automation’s limitless possibilities."
              body="A curated snapshot of what’s possible across residential and commercial environments."
            />
            <Link
              href="/#contact"
              className="rounded-md border-0 border-none border-transparent bg-panel/40 px-4 py-2 text-sm text-fg/90 hover:bg-panel/70 hover:text-fg transition-colors h-fit"
              style={{ borderImage: "none" }}
            >
              Discuss your project
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { title: "no32 Restaurant", body: "Hospitality automation — comfort, ambience, efficiency." },
              { title: "BOM Korean BBQ Restaurant", body: "Integrated lighting + climate + control logic." },
              { title: "Private Residence", body: "A serene smart-living environment — privacy-first." }
            ].map((p, idx) => (
              <div
                key={p.title}
                className="rounded-2xl border border-border/70 bg-panel/30 p-6 hover:bg-panel/40 transition-colors"
              >
                <div className="font-[var(--font-display)] text-2xl">{p.title}</div>
                <p className="mt-2 text-sm text-muted">{p.body}</p>
                <div className="mt-6 h-28 rounded-xl border border-border/60 bg-bg/20 overflow-hidden relative">
                  {config.projects[idx]?.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={config.projects[idx]!.imageUrl}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{
                        objectPosition: `${config.projects[idx]!.mediaXPercent}% ${config.projects[idx]!.mediaYPercent}%`
                      }}
                    />
                  ) : null}
                </div>
                <div className="mt-4 text-xs text-muted">Case study coming soon</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUTOMATION VS SMART DEVICES */}
      <section className="border-t border-border/60 bg-black">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          {/* Image slot (add image later) */}
          <div className="mb-10 min-h-[320px] overflow-hidden rounded-3xl border border-border/40 bg-panel/15 md:mb-14 md:min-h-[460px]" />

          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:order-2 md:col-span-5">
              <SectionTitle
                eyebrow="Automation vs smart devices"
                title="A system that runs your space — not another app."
                body="Smart devices often depend on cloud services and manual input. Automation is designed to operate autonomously, reliably and privately."
              />
            </div>
            <div className="md:order-1 md:col-span-7">
              <div className="rounded-2xl border border-border/70 bg-panel/30 p-6 md:p-8 shadow-glow">
                <div className="grid gap-4">
                  {[
                    {
                      title: "Automation vs Control",
                      body: "Automation handles daily functions without constant user commands."
                    },
                    { title: "Reliability", body: "Local operation means your space keeps working even offline." },
                    {
                      title: "Seamless integration",
                      body: "Lighting, HVAC, security and multimedia unified under one ecosystem."
                    },
                    { title: "Energy efficiency", body: "Optimises energy usage automatically, not just manually." }
                  ].map((row) => (
                    <div key={row.title} className="rounded-xl border border-border/60 bg-bg/20 p-4">
                      <div className="text-sm font-medium">{row.title}</div>
                      <div className="mt-1 text-sm text-muted">{row.body}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-12 md:items-start">
            <div className="md:col-span-5">
              <SectionTitle
                eyebrow="Contact"
                title="Take the leap into the future of automated spaces."
                body="Share a few details and we’ll recommend the right next step — consultation, design session, or showroom appointment."
              />
              <div className="mt-8 space-y-3 text-sm text-muted">
                <div>
                  <span className="text-fg/90">Sydney</span> \\ Showroom
                </div>
                <div>
                  <span className="text-fg/90">Melbourne</span> \\ Digital Experience
                </div>
                <div className="pt-2">
                  By appointment only \\{" "}
                  <a className="text-fg hover:text-fg/90" href={`tel:${company.phone.replace(/\s+/g, "")}`}>
                    {company.phone}
                  </a>
                </div>
              </div>
            </div>
            <div className="md:col-span-7">
              <LeadForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


