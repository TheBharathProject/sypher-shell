// sypher.in/u/<slug> — public profile page.
// Calls sypher-api's GET /job-tracker/public/profile/{slug} — no auth required.
//
// Lives in sypher-shell (not Pegasus) because the canonical URL is at the apex,
// not under /pegasus. The route is consumer-facing; treat it like a marketing
// surface rather than a tool surface.

import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "../../_components/site-header";
import { SiteFooter } from "../../_components/site-footer";
import { ProfileChrome } from "./profile-chrome";

const API_URL = process.env.SYPHER_API_URL ?? "https://api.sypher.in";

// ---- Types (mirror sypher-api PublicProfile shape) ----------------------

type Skill = { id: string; name: string; category?: string; sortOrder: number };
type Experience = {
  id: string;
  company: string;
  title: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current: boolean;
  description?: string;
  sortOrder: number;
};
type Education = {
  id: string;
  school: string;
  degree?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
  description?: string;
  sortOrder: number;
};
type Project = {
  id: string;
  name: string;
  description?: string;
  techStack?: string;
  link?: string;
  sortOrder: number;
};
type PublicProfile = {
  slug: string;
  name: string;
  pictureUrl?: string;
  headline?: string;
  about?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  experiences: Experience[];
  educations: Education[];
  projects: Project[];
  skills: Skill[];
};

async function fetchProfile(slug: string): Promise<PublicProfile | null> {
  try {
    const res = await fetch(
      `${API_URL}/job-tracker/public/profile/${encodeURIComponent(slug)}`,
      // 5-min ISR keeps fresh-ish without hammering the API.
      { next: { revalidate: 300 } }
    );
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return (await res.json()) as PublicProfile;
  } catch {
    return null;
  }
}

// ---- Period formatting ---------------------------------------------------

function yearOf(iso?: string): string {
  if (!iso) return "";
  const m = iso.match(/^(\d{4})/);
  return m ? m[1] : "";
}

function formatPeriod(p: { startDate?: string; endDate?: string; current?: boolean }): string {
  const startYear = yearOf(p.startDate);
  const endYear = yearOf(p.endDate);
  if (!startYear && !endYear && !p.current) return "";
  if (startYear && p.current) return `${startYear} – Present`;
  if (startYear && endYear) return `${startYear} – ${endYear}`;
  if (startYear) return startYear;
  if (endYear) return endYear;
  return p.current ? "Present" : "";
}

// ---- Metadata ------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await fetchProfile(slug);
  if (!profile) {
    return { title: "Profile not found · Sypher" };
  }
  return {
    title: `${profile.name} · Sypher`,
    description: profile.headline ?? profile.about ?? `${profile.name}'s public profile on Sypher.`,
    alternates: { canonical: `https://sypher.in/u/${profile.slug}` },
    openGraph: {
      type: "profile",
      title: profile.name,
      description: profile.headline ?? profile.about ?? "",
      url: `https://sypher.in/u/${profile.slug}`,
    },
  };
}

// ---- Page ----------------------------------------------------------------

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await fetchProfile(slug);
  if (!profile) notFound();

  const initial = profile.name.charAt(0).toUpperCase();
  const hasSocial = !!(profile.linkedinUrl || profile.githubUrl || profile.websiteUrl);

  return (
    <>
      <SiteHeader />
      <main className="section-wrap py-16 md:py-24">
        <article className="max-w-[760px] mx-auto">
          {/* Identity card */}
          <header className="pb-10 border-b border-hairline">
            <div className="flex items-baseline justify-between mb-6 gap-4">
              <p className="t-eyebrow">Built on Sypher</p>
              <ProfileChrome slug={profile.slug} />
            </div>
            <div className="flex items-start gap-6">
              <div className="size-20 md:size-24 rounded-full overflow-hidden bg-paper-deep border border-hairline flex items-center justify-center text-ink shrink-0 t-display text-[34px]">
                {profile.pictureUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.pictureUrl}
                    alt={profile.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <span aria-hidden>{initial}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="t-display text-[clamp(28px,4vw,44px)] leading-[1.05]">
                  {profile.name}
                </h1>
                {profile.headline ? (
                  <p className="mt-3 text-[16px] md:text-[18px] text-ink-muted t-display-italic leading-snug">
                    {profile.headline}
                  </p>
                ) : null}
                {profile.location ? (
                  <p className="mt-3 t-eyebrow">{profile.location}</p>
                ) : null}
              </div>
            </div>

            {profile.about ? (
              <p className="mt-8 text-[16px] leading-[1.75] text-ink-muted">
                {profile.about}
              </p>
            ) : null}

            {hasSocial ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {profile.linkedinUrl ? (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-hairline text-[12px] text-ink-muted hover:text-ink hover:border-ink/40 transition-colors"
                  >
                    LinkedIn
                  </a>
                ) : null}
                {profile.githubUrl ? (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-hairline text-[12px] text-ink-muted hover:text-ink hover:border-ink/40 transition-colors"
                  >
                    GitHub
                  </a>
                ) : null}
                {profile.websiteUrl ? (
                  <a
                    href={profile.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-hairline text-[12px] text-ink-muted hover:text-ink hover:border-ink/40 transition-colors"
                  >
                    Website
                  </a>
                ) : null}
              </div>
            ) : null}
          </header>

          {/* Experience */}
          {profile.experiences.length > 0 ? (
            <Section title="Experience">
              {profile.experiences.map((exp) => (
                <Row
                  key={exp.id}
                  primary={`${exp.title} · ${exp.company}`}
                  meta={[formatPeriod(exp), exp.location].filter(Boolean).join(" · ")}
                  description={exp.description}
                />
              ))}
            </Section>
          ) : null}

          {/* Education */}
          {profile.educations.length > 0 ? (
            <Section title="Education">
              {profile.educations.map((ed) => (
                <Row
                  key={ed.id}
                  primary={ed.school}
                  meta={[ed.degree, ed.field, formatPeriod(ed)]
                    .filter(Boolean)
                    .join(" · ")}
                  description={ed.description}
                  trailingMeta={ed.gpa ? `GPA ${ed.gpa}` : undefined}
                />
              ))}
            </Section>
          ) : null}

          {/* Projects */}
          {profile.projects.length > 0 ? (
            <Section title="Projects">
              {profile.projects.map((pr) => (
                <Row
                  key={pr.id}
                  primary={pr.name}
                  meta={pr.techStack}
                  description={pr.description}
                  link={pr.link}
                />
              ))}
            </Section>
          ) : null}

          {/* Skills */}
          {profile.skills.length > 0 ? (
            <Section title="Skills">
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s) => (
                  <span
                    key={s.id}
                    className="px-3 py-1.5 rounded-full bg-paper-deep border border-hairline text-[12px] text-ink"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </Section>
          ) : null}

          <footer className="mt-16 pt-8 border-t border-hairline flex items-center justify-between">
            <p className="text-[13px] text-ink-muted">
              <span className="text-ink font-medium">{profile.name}</span> · Built on{" "}
              <Link href="/" className="text-ink underline-offset-4 hover:underline">
                Sypher
              </Link>
            </p>
            <Link
              href="/pegasus"
              className="text-[12px] text-ink-muted hover:text-ink transition-colors"
            >
              Make your own →
            </Link>
          </footer>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

// ---- Sub-components ------------------------------------------------------

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="t-display text-[clamp(20px,2.6vw,26px)] mb-4">{title}</h2>
      <div>{children}</div>
    </section>
  );
}

function Row({
  primary,
  meta,
  description,
  trailingMeta,
  link,
}: {
  primary: string;
  meta?: string;
  description?: string;
  trailingMeta?: string;
  link?: string;
}) {
  return (
    <div className="py-4 border-t border-hairline first:border-t-0 first:pt-0">
      <div className="flex items-baseline justify-between gap-4">
        <p className="t-display text-[18px] leading-tight">{primary}</p>
        {trailingMeta ? (
          <span className="text-[12px] text-ink-faint shrink-0">{trailingMeta}</span>
        ) : null}
      </div>
      {meta ? <p className="mt-1 text-[13px] text-ink-faint">{meta}</p> : null}
      {description ? (
        <p className="mt-2 text-[15px] leading-[1.65] text-ink-muted whitespace-pre-wrap">
          {description}
        </p>
      ) : null}
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-[13px] text-ink-muted underline-offset-4 hover:underline break-all"
        >
          {link}
        </a>
      ) : null}
    </div>
  );
}
