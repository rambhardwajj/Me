import type { Metadata } from 'next';
import Link from 'next/link';
import './uber.css';
import DocShell from '@/components/uber/DocShell';
import { WORK_HREF } from '@/lib/uber-cases';

export const metadata: Metadata = { title: 'No ride found · Ram Bhardwaj', robots: { index: false } };

/** A wrong address under /uber: said the way a ride app says it, with the two ways back. */
export default function NotFound() {
  return (
    <DocShell here="none">
      <div className="ub-case ub-lost">
        <header className="ub-case-head">
          <p className="ub-kicker">404 · No ride found</p>
          <h1>No drivers on this route.</h1>
          <p className="ub-case-lede">This address is not on Ram’s map. Here are two that are.</p>
        </header>
        <div className="ub-case-foot">
          <Link className="ub-btn solid" href="/uber">
            Back to the first screen
          </Link>
          <Link className="ub-btn line" href={WORK_HREF}>
            All work
          </Link>
        </div>
      </div>
    </DocShell>
  );
}
