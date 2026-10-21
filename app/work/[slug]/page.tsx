import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CASES, getCase } from '@/lib/cases';
import { PROFILE } from '@/lib/data';
import { ThemeToggle } from '@/components/Theme';

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const found = getCase(slug);
  if (!found) return {};
  return { title: `${found.p.name} case study · ${PROFILE.name}`, description: found.p.pitch };
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = getCase(slug);
  if (!found) notFound();
  const { c, p } = found;
  const next = CASES[(CASES.findIndex((x) => x.slug === slug) + 1) % CASES.length];
  const nextName = getCase(next.slug)?.p.name;

  return (
    <main className="cs" style={{ ['--a' as string]: p.accent }}>
      <header className="cs-bar">
        <div className="wrap cs-bar-in">
          <Link href="/#work" className="cs-back">
            ← All work
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <article className="wrap cs-in">
        <span className="label kicker">Case study</span>
        <h1>{p.name}</h1>
        <p className="cs-pitch">{p.pitch}</p>
        <dl className="cs-meta">
          <div>
            <dt>Role</dt>
            <dd>{p.role}</dd>
          </div>
          {p.period && (
            <div>
              <dt>When</dt>
              <dd>{p.period}</dd>
            </div>
          )}
          {p.client && (
            <div>
              <dt>Client</dt>
              <dd>{p.client}</dd>
            </div>
          )}
          {p.url && (
            <div>
              <dt>Live</dt>
              <dd>
                <a className="link" href={p.url} target="_blank" rel="noreferrer">
                  {p.domain} ↗
                </a>
              </dd>
            </div>
          )}
        </dl>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="cs-shot" src={c.image} alt={`${p.name} screens`} />

        <section className="cs-sec">
          <h2>
            <span>01</span> The problem
          </h2>
          <p>{p.problem}</p>
          <p className="cs-muted">{c.context}</p>
        </section>

        <section className="cs-sec">
          <h2>
            <span>02</span> My role
          </h2>
          <p>{c.role}</p>
          <ul className="cs-list">
            {p.did.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>

        <section className="cs-sec">
          <h2>
            <span>03</span> Key decisions
          </h2>
          <ol className="cs-decisions">
            {c.decisions.map((d, i) => (
              <li key={d.title}>
                <b>
                  <i>{String(i + 1).padStart(2, '0')}</i> {d.title}
                </b>
                <p>{d.choice}</p>
                <p className="cs-trade">
                  <span>Trade-off</span> {d.tradeoff}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="cs-sec">
          <h2>
            <span>04</span> Outcomes
          </h2>
          <div className="cs-out">
            {p.metrics.map((m) => (
              <div key={m.label}>
                <b>{m.value}</b>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </section>

        <footer className="cs-foot">
          {p.url && (
            <a className="btn-primary" href={p.url} target="_blank" rel="noreferrer">
              Visit {p.name} ↗
            </a>
          )}
          <Link className="btn-ghost" href={`/work/${next.slug}`}>
            Next: {nextName} →
          </Link>
          <a className="btn-ghost" href={`mailto:${PROFILE.email}`}>
            Talk to Ram
          </a>
        </footer>
      </article>
    </main>
  );
}
