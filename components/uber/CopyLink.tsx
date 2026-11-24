'use client';

import { useState } from 'react';

/** Copies this page's own address, so one case study can be sent on its own. */
export default function CopyLink({ label = 'Copy the link to this page' }: { label?: string }) {
  const [state, setState] = useState<'idle' | 'done' | 'failed'>('idle');
  const copy = () =>
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => setState('done'))
      .catch(() => setState('failed'));
  return (
    <button type="button" className="ub-link" onClick={copy}>
      <span aria-live="polite">{state === 'done' ? 'Link copied' : state === 'failed' ? 'Copy it from the address bar' : label}</span>
    </button>
  );
}
