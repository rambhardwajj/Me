"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PROJECTS } from "@/lib/data";
import {
  ACCENT,
  EXPERIENCE,
  LOGO,
  STOPS,
  minLabel,
  stop,
  trip as getTrip,
  tripMinutes,
  type TripId,
} from "@/lib/uber";
import { caseHref, hasCase } from "@/lib/uber-cases";
import { GEO_HOME, PLACE_GEO, rideTo } from "@/lib/uber-geo";
import { PORTRAIT, stopStory, tripPhotos } from "@/lib/uber-photos";
import { Shot } from "./StagePanel";
import { Icon, Solid } from "./icons";
import Mark from "./Mark";

/** Which entry of the site's project list each trip is, for its live link and skill tags. Synappses is left out: only its role and dates are confirmed. */
const SITE_PROJECT: Partial<Record<TripId, string>> = {
  trucost: "trucost",
  leetcase: "leetcase",
  unbothrrd: "unbothered",
};

type Props = {
  id: TripId | null;
  /** The car has just driven here: the modal opens as the end of a ride, with the trip, the driver and a receipt. */
  arrived?: boolean;
  onClose: () => void;
  onRide: (id: TripId) => void;
  onReserve: () => void;
};

/** What a rider says after the stars. No rating is stored or shown to anyone: it is a moment of the ride, not data. */
const AFTER_STARS = "Thanks for riding. Tips are not accepted. A call back is.";

/**
 * Everything about one project, in a modal: photos, what it was, the problem, what Ram did, what came of it.
 * When the car has just driven there it is the end of a ride, the way a ride app ends one: you have arrived, the trip
 * you took, your driver, and a receipt.
 */
export default function ProjectDialog({
  id,
  arrived,
  onClose,
  onRide,
  onReserve,
}: Props) {
  const [stars, setStars] = useState<{ id: TripId | null; n: number }>({
    id: null,
    n: 0,
  });
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
  const job = id ? EXPERIENCE.find((j) => j.trip === id) : undefined;
  const placeId = t ? rideTo(t) : null;
  const place = placeId ? PLACE_GEO[placeId] : null;
  const institute = placeId ? stop(placeId) : null;
  const passed = id
    ? STOPS.filter((x) => x.type === "dot" && x.trip === id).length
    : 0;
  const rated = stars.id === id ? stars.n : 0;
  const role = job?.roles[0];
  const events = id
    ? STOPS.filter((x) => x.type !== "you" && x.trip === id)
        .map((x) => ({ x, story: stopStory(x.id) }))
        .filter((e) => e.story.body)
    : [];

  return (
    <dialog
      ref={ref}
      className="ub-dialog"
      aria-labelledby="ub-dialog-h"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={t ? { ["--acc" as string]: ACCENT[t.id] } : undefined}
    >
      {t && (
        <div className="ub-dialog-in">
          {arrived && (
            <header className="ub-arr">
              <div className="ub-arr-top">
                <span className="ub-arr-tick" aria-hidden="true">
                  <Icon name="check" size={22} w={3.2} />
                </span>
                <div>
                  <p className="ub-arr-k">Trip complete</p>
                  <h2 id="ub-dialog-h">You have arrived at {t.name}.</h2>
                  <p className="ub-arr-sub">
                    Hope the ride was smooth. Here is what Ram did at this stop.
                  </p>
                </div>
                <button
                  type="button"
                  className="ub-dialog-x"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <Icon name="x" size={20} />
                </button>
              </div>
              <div
                className="ub-arr-trip"
                role="img"
                aria-label={`The trip: from Ram today, in ${GEO_HOME.city}, to ${t.name}${place ? `, in ${place.city}` : ""}.`}
              >
                <span className="ub-arr-end">
                  <i className="dot" aria-hidden="true" />
                  <span>
                    <small>Pickup</small>
                    <b>Ram, today</b>
                    <em>{GEO_HOME.city}</em>
                  </span>
                </span>
                <span className="ub-arr-line" aria-hidden="true">
                  <i>
                    <Solid name="car" size={18} />
                  </i>
                  <small>
                    {passed
                      ? `${passed} ${passed === 1 ? "stop" : "stops"} on the way`
                      : "Straight there"}
                  </small>
                </span>
                <span className="ub-arr-end">
                  <i className="sq" aria-hidden="true" />
                  <span>
                    <small>Drop-off</small>
                    <b>{t.name}</b>
                    <em>
                      {institute && institute.name !== t.name
                        ? `at ${institute.name}${place ? `, ${place.city}` : ""}`
                        : (place?.city ?? t.sub)}
                    </em>
                  </span>
                </span>
              </div>
            </header>
          )}
          {arrived && (
            <div className="ub-drv">
              <span className="ub-drv-face">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PORTRAIT.src} alt="" width={56} height={56} loading="lazy" decoding="async" />
              </span>
              <p>
                <small>Your driver</small>
                <b>Ram Bhardwaj</b>
                <span>{role ? role.title : t.sub}</span>
              </p>
              <span
                className="ub-drv-plate"
                aria-label={role ? `When: ${role.when}` : undefined}
              >
                <Mark id={t.id} size={22} />
                {role ? role.when : (institute?.name ?? t.name)}
              </span>
            </div>
          )}
          {!arrived && (
            <header className="ub-dialog-head">
              <span className={`ub-dialog-ico ${LOGO[t.id] ? "logo" : ""}`}>
                <Mark id={t.id} size={LOGO[t.id] ? 60 : 40} />
              </span>
              <div>
                <h2 id="ub-dialog-h">{t.name}</h2>
                <p>{t.sub}</p>
              </div>
              <button
                type="button"
                className="ub-dialog-x"
                onClick={onClose}
                aria-label="Close"
              >
                <Icon name="x" size={20} />
              </button>
            </header>
          )}

          <div className="ub-dialog-body">
            {photos.length > 0 && (
              <div
                className={`ub-dialog-photos n${Math.min(photos.length, 3)}`}
              >
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
                {job && (
                  <>
                    <h3>Roles Ram held</h3>
                    <ol className="ub-roles">
                      {job.roles.map((r) => (
                        <li key={r.title}>
                          <b>{r.title}</b>
                          <span>{r.when}</span>
                        </li>
                      ))}
                    </ol>
                  </>
                )}
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
                {arrived && <h3 className="ub-rcpt-h">Your receipt</h3>}
                <dl className="ub-receipt">
                  {[
                    ...(t.receipt ?? []),
                    ...(min !== null
                      ? [{ label: "Distance from today", value: minLabel(min) }]
                      : []),
                    ...(arrived
                      ? [
                          { label: "Fare", value: "Free" },
                          { label: "Paid with", value: "Your time" },
                        ]
                      : []),
                  ].map((r) => (
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
                  <a
                    className="ub-dialog-link"
                    href={site.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open {site.domain}
                    <Icon name="out" size={16} />
                  </a>
                )}
              </aside>
            </div>
          </div>

          <footer className={`ub-dialog-foot ${arrived ? "arr" : ""}`}>
            {arrived && (
              <div className="ub-rate">
                <b>{rated ? AFTER_STARS : "How was the ride?"}</b>
                <span role="radiogroup" aria-label="Rate this ride">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={rated === n}
                      aria-label={`${n} ${n === 1 ? "star" : "stars"}`}
                      className={n <= rated ? "on" : ""}
                      onClick={() => setStars({ id, n })}
                    >
                      <Icon name="star" size={22} w={2} />
                    </button>
                  ))}
                </span>
              </div>
            )}
            {arrived ? (
              <button type="button" className="ub-btn line" onClick={onClose}>
                Done
              </button>
            ) : (
              <button
                type="button"
                className="ub-btn line"
                onClick={() => onRide(t.id)}
              >
                Ride there on the map
              </button>
            )}
            {hasCase(t.id) && (
              <Link className="ub-link" href={caseHref(t.id)}>
                Open as a page, with its own link
              </Link>
            )}
            <button type="button" className="ub-btn solid" onClick={onReserve}>
              Reserve Ram
            </button>
          </footer>
        </div>
      )}
    </dialog>
  );
}
