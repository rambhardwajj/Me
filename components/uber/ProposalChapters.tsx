'use client';

import { useState } from 'react';
import { IDEA } from '@/lib/uber';
import { IdeaGraphic } from './IdeaGraphics';

/** The chapters of "The 20 idle minutes", one under the other, each with its graphic. The tablet can be tried in place. */
export default function ProposalChapters() {
  const [survey, setSurvey] = useState(0);
  return (
    <ol className="ub-prop-chaps">
      {IDEA.scenes.map((sc, i) => (
        <li key={sc.id} id={sc.id}>
          <p className="ub-kicker">
            {i + 1} of {IDEA.scenes.length} · {sc.tab}
          </p>
          <h2>{sc.title}</h2>
          <p className="ub-prop-p">{sc.text}</p>
          <div className="ub-prop-g">
            <IdeaGraphic id={sc.id} survey={survey} onSurvey={setSurvey} />
          </div>
          {sc.note && <p className="ub-prop-n">{sc.note}</p>}
        </li>
      ))}
    </ol>
  );
}
