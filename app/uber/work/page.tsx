import type { Metadata } from 'next';
import Link from 'next/link';
import '../uber.css';
import DocShell from '@/components/uber/DocShell';
import Mark from '@/components/uber/Mark';
import { Icon } from '@/components/uber/icons';
import { PROFILE } from '@/lib/data';
import { CASE_IDS, WORK_HREF, caseHref, getCase } from '@/lib/uber-cases';

const title = `Work · ${PROFILE.name}`;
const description = 'Case studies from Ram Bhardwaj: TruCost, Newral, LeetCase, Ciena and more. Each one has its own page.';
export const metadata: Metadata = { title, description, alternates: { canonical: WORK_HREF }, openGraph: { title, description, type: 'website', url: WORK_HREF } };

/** Every case study, one tap each. */
export default function Work() {
  return (
    <DocShell here="work">
      <div className="ub-case">
        <header className="ub-case-head">
          <p className="ub-kicker">All work</p>
          <h1>Work</h1>
          <p className="ub-case-lede">What I built, where, and what came of it. Each case has its own page and its own link.</p>
        </header>
        <ul className="ub-worklist">
          {CASE_IDS.map((id) => {
            const c = getCase(id)!;
            return (
              <li key={id}>
                <Link href={caseHref(id)}>
                  <span className="ub-worklist-mark">
                    <Mark id={id} size={44} />
                  </span>
                  <span className="ub-worklist-text">
                    <b>{c.t.name}</b>
                    <small>{c.t.sub}</small>
                  </span>
                  {c.t.result && <span className="ub-worklist-res">{c.t.result.value}</span>}
                  <Icon name="chevRight" size={18} w={2.2} />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </DocShell>
  );
}
