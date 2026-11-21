'use client';

import { useEffect, useRef } from 'react';
import { PROJECTS } from '@/lib/data';
import { ACCENT, STOPS, minLabel, trip as getTrip, tripMinutes, type TripId } from '@/lib/uber';
import { stopStory, tripPhotos } from '@/lib/uber-photos';
import { Shot } from './StagePanel';
import { Icon, Pict } from './icons';

/** Which entry of the site's project list each trip is, for its live link and skill tags. Synappses is left out: only its role and dates are confirmed. */
const SITE_PROJECT: Partial<Record<TripId, string>> = { trucost: 'trucost', leetcase: 'leetcase', unbothrrd: 'unbothered' };

type Props = {
  id: TripId | null;
  onClose: () => void;
  onRide: (id: TripId) => void;
  onReserve: () => void;
};

/** Everything about one project, in a modal: photos, what it was, the problem, what Ram did, what came of it. */
export default function ProjectDialog({ id, onClose, onRide, onReserve }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (id && !el.open) el.showModal();
    if (!id && el.open) el.close();
  }, [id]);

  const t = id ? getTrip(id) : null;
  const site = id ? PROJECTS.find((x) => x.id === SITE_PROJECT[id]) : undefined;
  const photos = id ? tripPhotos(id) : [];
  const min = t ? tripMinutes(t) : null;
  const events = id ? STOPS.filter((x) => x.type !== 'you' && x.trip === id).map((x) => ({ x, story: stopStory(x.id) })).filter((e) => e.story.body) : [];

  return (
    <dialog
      ref={ref}
      className="ub-dialog"
      aria-labelledby="ub-dialog-h"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={t ? { ['--acc' as string]: ACCENT[t.id] } : undefined}
    >
      {t && (
        <div className="ub-dialog-in">
          <header className="ub-dialog-head">
            <span className="ub-dialog-ico">
              <Pict name={t.icon} size={40} />
            </span>
            <div>
              <h2 id="ub-dialog-h">{t.name}</h2>
              <p>{t.sub}</p>
            </div>
            <button type="button" className="ub-dialog-x" onClick={onClose} aria-label="Close">
              <Icon name="x" size={20} />
            </button>
          </header>

          <div className="ub-dialog-body">
            {photos.length > 0 && (
              <div className={`ub-dialog-photos n${Math.min(photos.length, 3)}`}>
                {photos.slice(0, 3).map((ph) => (
                  <figure key={ph.src}>
                    <span>
                      <Shot photo={ph} eager />
                    </span>
                    <figcaption>{ph.caption}</figcaption>
                  </figure>
                ))}
              </div>
            )}

            <div className="ub-dialog-cols">
              <div>
                <h3>What it is</h3>
                <p>{t.blurb}</p>
                {t.problem && (
                  <>
                    <h3>The problem</h3>
                    <p>{t.problem}</p>
                  </>
                )}
                {t.did && (
                  <>
                    <h3>What Ram did</h3>
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
                  </>
                )}
                {events.map(({ x, story }) => (
                  <div key={x.id}>
                    <h3>{story.title}</h3>
                    <p>{story.body}</p>
                  </div>
                ))}
              </div>
              <aside>
                {t.result && (
                  <p className="ub-bigstat">
                    <b>{t.result.value}</b>
                    <span>{t.result.sub}</span>
                  </p>
                )}
                {t.proof && (
                  <p className="ub-dialog-proof">
                    <b>{t.proof.title}</b>
                    {t.proof.badge && <span>{t.proof.badge}</span>}
                    {t.proof.note && <small>{t.proof.note}</small>}
                  </p>
                )}
                <dl className="ub-receipt">
                  {[...(t.receipt ?? []), ...(min !== null ? [{ label: 'Distance from today', value: minLabel(min) }] : [])].map((r) => (
                    <div key={r.label}>
                      <dt>{r.label}</dt>
                      <i aria-hidden="true" />
                      <dd>{r.value}</dd>
                    </div>
                  ))}
                </dl>
                {site?.stack && (
                  <p className="ub-dialog-tags">
                    {site.stack.map((x) => (
                      <span key={x}>{x}</span>
                    ))}
                  </p>
                )}
                {site?.url && (
                  <a className="ub-dialog-link" href={site.url} target="_blank" rel="noreferrer">
                    Open {site.domain}
                    <Icon name="out" size={16} />
                  </a>
                )}
              </aside>
            </div>
          </div>

          <footer className="ub-dialog-foot">
            <button type="button" className="ub-btn line" onClick={() => onRide(t.id)}>
              Ride there on the map
            </button>
            <button type="button" className="ub-btn solid" onClick={onReserve}>
              Reserve Ram
            </button>
          </footer>
        </div>
      )}
    </dialog>
  );
}
