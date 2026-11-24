import type { Metadata } from 'next';
import Link from 'next/link';
import '../uber.css';
import CopyLink from '@/components/uber/CopyLink';
import DocShell, { MAILTO } from '@/components/uber/DocShell';
import ProposalChapters from '@/components/uber/ProposalChapters';
import { PROFILE } from '@/lib/data';
import { BILLBOARD, IDEA } from '@/lib/uber';
import { PROPOSAL_HREF, caseHref } from '@/lib/uber-cases';

const title = `${IDEA.title}: a proposal for Uber · ${PROFILE.name}`;
const description = `${IDEA.line} ${IDEA.kicker}`;
export const metadata: Metadata = { title, description, alternates: { canonical: PROPOSAL_HREF }, openGraph: { title, description, type: 'article', url: PROPOSAL_HREF } };

/** "The 20 idle minutes" on a page of its own: every chapter and its graphic, with nothing to ride through first. */
export default function Proposal() {
  return (
    <DocShell here="proposal">
      <article className="ub-case ub-prop">
        <header className="ub-case-head">
          <p className="ub-kicker">{IDEA.kicker}</p>
          <h1>{IDEA.title}</h1>
          <p className="ub-case-lede">{IDEA.line}</p>
          <p className="ub-prop-p">{IDEA.pitch}</p>
          <p className="ub-prop-n">Every number on this page is an estimate or an illustration, and says so. None is a measured result.</p>
        </header>
        <ProposalChapters />
        <footer className="ub-case-foot">
          <a className="ub-btn solid" href={MAILTO}>
            {BILLBOARD.contact}
          </a>
          <Link className="ub-btn line" href={caseHref('trucost')}>
            {BILLBOARD.caseStudy}
          </Link>
          <CopyLink />
        </footer>
      </article>
    </DocShell>
  );
}
