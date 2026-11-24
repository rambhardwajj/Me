'use client';

import { IDEA, IDEA_SUMS } from '@/lib/uber';
import { Icon } from './icons';

const Q = IDEA.tablet.questions;
export const SURVEY_DONE = Q.length + 1;
const rupees = (n: number) => `₹${n}`;
const FARE = IDEA.km * IDEA.perKm;
/** ₹15 on ₹120: 12.5%, shown exactly. */
const LIFT = IDEA_SUMS.lift;

/**
 * The back-seat tablet from "The 20 idle minutes", small enough to try: an ask, three sample questions, a thank-you.
 * `step` is 0 for the ask, 1 to 3 for the questions, 4 when done and -1 when the rider said no.
 */
export function TabletDemo({ step, onStep }: { step: number; onStep: (n: number) => void }) {
  const q = step >= 1 && step <= Q.length ? Q[step - 1] : null;
  return (
    <div className="td" role="group" aria-label="Back-seat tablet, a demo you can try">
      <div className="td-frame">
        <div className="td-screen" key={step} aria-live="polite">
          <p className="td-top">
            <span>{IDEA.tablet.brand}</span>
            <span>{q ? `${step} of ${Q.length}` : IDEA.notes.label}</span>
          </p>
          {step === 0 && (
            <div className="td-mid">
              <p className="td-big">Earn {rupees(IDEA.driver)} for your driver.</p>
              <p className="td-sub">{IDEA.tablet.ask}</p>
              <div className="td-acts">
                <button type="button" className="td-go" onClick={() => onStep(1)}>
                  {IDEA.tablet.start}
                </button>
                <button type="button" className="td-no" onClick={() => onStep(-1)}>
                  {IDEA.tablet.skip}
                </button>
              </div>
            </div>
          )}
          {q && (
            <div className="td-mid">
              <p className="td-q">{q.q}</p>
              <div className="td-opts">
                {q.a.map((a) => (
                  <button key={a} type="button" onClick={() => onStep(step + 1)}>
                    {a}
                  </button>
                ))}
              </div>
              <span className="td-bar" aria-hidden="true">
                <i style={{ width: `${(step / Q.length) * 100}%` }} />
              </span>
            </div>
          )}
          {step === SURVEY_DONE && (
            <div className="td-mid">
              <span className="td-tick" aria-hidden="true">
                <Icon name="check" size={28} w={3} />
              </span>
              <p className="td-big">{IDEA.tablet.done}</p>
              <p className="td-sub">
                {rupees(IDEA.driver)} goes to your driver for this trip.
              </p>
              <div className="td-acts">
                <button type="button" className="td-no" onClick={() => onStep(0)}>
                  {IDEA.tablet.again}
                </button>
              </div>
            </div>
          )}
          {step === -1 && (
            <div className="td-mid">
              <p className="td-big">{IDEA.tablet.skipped}</p>
              <p className="td-sub">The tablet asks once. The driver never does.</p>
              <div className="td-acts">
                <button type="button" className="td-no" onClick={() => onStep(0)}>
                  {IDEA.tablet.again}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <span className="td-arm" aria-hidden="true" />
    </div>
  );
}

/** One trip on the driver's side: the fare, the survey bonus, and what the trip pays once the rider has answered. */
export function TripMeter({ step }: { step: number }) {
  const done = step === SURVEY_DONE;
  return (
    <dl className={`tm ${done ? 'done' : ''}`} aria-live="polite">
      <div>
        <dt>
          Fare, {IDEA.km} km at {rupees(IDEA.perKm)}
        </dt>
        <dd>{rupees(FARE)}</dd>
      </div>
      <div className="tm-bonus">
        <dt>Survey bonus</dt>
        <dd>{done ? `+${rupees(IDEA.driver)}` : step === -1 ? rupees(0) : `up to +${rupees(IDEA.driver)}`}</dd>
      </div>
      <div className="tm-total">
        <dt>This trip pays</dt>
        <dd>
          {rupees(done ? FARE + IDEA.driver : FARE)}
          {done && <span>{LIFT} more</span>}
        </dd>
      </div>
    </dl>
  );
}
