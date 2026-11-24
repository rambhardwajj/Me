import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import '../../uber.css';
import CopyLink from '@/components/uber/CopyLink';
import DocShell, { MAILTO } from '@/components/uber/DocShell';
import { Icon } from '@/components/uber/icons';
import { PROFILE } from '@/lib/data';
import { BILLBOARD, trip } from '@/lib/uber';
import { CASE_IDS, PROPOSAL_HREF, WORK_HREF, caseHref, getCase } from '@/lib/uber-cases';

export function generateStaticParams() {
  return CASE_IDS.map((slug) => ({ slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) return {};
  const title = `${c.t.name} case study · ${PROFILE.name}`;
  const description = c.t.result ? `${c.t.blurb} Result: ${c.t.result.value}, ${c.t.result.sub.toLowerCase()}.` : c.t.blurb;
  return { title, description, alternates: { canonical: caseHref(c.slug) }, openGraph: { title, description, type: 'article', url: caseHref(c.slug) } };
}

/**
 * One case study, in the same order every time: Problem, My role, What I did, Result, What I would do differently.
 * A part with nothing real to say is left out (the gaps are listed in lib/uber-cases.ts). The picture comes first.
 */
export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) notFound();
  const { t } = c;
  const next = trip(CASE_IDS[(CASE_IDS.indexOf(c.slug) + 1) % CASE_IDS.length]);
  const rows = [...(t.receipt ?? [])].filter((r) => r.value !== t.result?.value);

  return (
    <DocShell here="work">
      <article className="ub-case">
        <Link className="ub-link ub-case-back" href={WORK_HREF}>
          <Icon name="back" size={16} w={2.4} />
          Back to all work
        </Link>
        {c.visual && (
          <figure className={`ub-case-art ${c.visual.contain ? 'contain' : ''}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.visual.src} alt={c.visual.alt} width={960} height={540} fetchPriority="high" />
            <figcaption>{c.visual.caption}</figcaption>
          </figure>
        )}
        <header className="ub-case-head">
          <p className="ub-kicker">Case study</p>
          <h1>{t.name}</h1>
          <p className="ub-case-lede">{t.blurb}</p>
        </header>

        <div className="ub-case-parts">
          {t.problem && (
            <section>
              <h2>Problem</h2>
              <p>{t.problem}</p>
            </section>
          )}
          <section>
            <h2>My role</h2>
            <ul className="ub-case-roles">
              {c.role.map((r) => (
                <li key={r.title}>
                  <b>{r.title}</b>
                  {r.when && <span>{r.when}</span>}
                </li>
              ))}
            </ul>
          </section>
          {t.did && (
            <section>
              <h2>What I did</h2>
              <ul className="ub-ticks">
                {t.did.map((x) => (
                  <li key={x}>
                    <i aria-hidden="true">
                      <Icon name="check" size={12} w={3.2} />
                    </i>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {(t.result || t.proof) && (
            <section className="ub-case-result">
              <h2>Result</h2>
              {t.result && (
                <p className="ub-bigstat">
                  <b>{t.result.value}</b>
                  <span>{t.result.sub}</span>
                </p>
              )}
              {t.proof && (
                <p className="ub-case-proof">
                  <b>{t.proof.title}</b>
                  {[t.proof.badge, t.proof.note].filter(Boolean).map((x) => (
                    <span key={x}>{x}</span>
                  ))}
                </p>
              )}
              {rows.length > 0 && (
                <dl className="ub-receipt">
                  {rows.map((r) => (
                    <div key={r.label}>
                      <dt>{r.label}</dt>
                      <i aria-hidden="true" />
                      <dd>{r.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </section>
          )}
          {c.differently && (
            <section>
              <h2>What I would do differently</h2>
              <p>{c.differently}</p>
            </section>
          )}
        </div>

        <footer className="ub-case-foot">
          <a className="ub-btn solid" href={MAILTO}>
            {BILLBOARD.contact}
          </a>
          <Link className="ub-btn line" href={caseHref(next.id)}>
            Next: {next.name}
            <Icon name="arrow" size={16} />
          </Link>
          <CopyLink />
          <Link className="ub-link" href={PROPOSAL_HREF}>
            {BILLBOARD.proposal}
          </Link>
          <Link className="ub-link" href={WORK_HREF}>
            Back to all work
          </Link>
        </footer>
      </article>
    </DocShell>
  );
}
