'use client';

import type { CSSProperties, ReactNode } from 'react';
import { IDEA, type IdeaSceneId } from '@/lib/uber';
import { Icon, Solid } from './icons';
import { TabletDemo, TripMeter } from './TabletDemo';

/**
 * One graphic for each chapter of "The 20 idle minutes".
 * Every figure is worked out here from the assumptions in IDEA, so the drawings and the words cannot drift apart.
 * Each graphic is drawn in its finished state and animates in from hidden: with reduced motion it is simply there.
 */

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;
const M = IDEA.model;
const PER_DAY = Math.floor(M.rides / M.answerOneIn);
const DRIVER_DAY = PER_DAY * IDEA.driver;
const DRIVER_MONTH = DRIVER_DAY * M.days;
const KEEP = IDEA.fee - IDEA.driver;
const FLEET_SURVEYS = M.cabs * PER_DAY;
const FLEET_DRIVERS = FLEET_SURVEYS * IDEA.driver;
const FLEET_KEEP = FLEET_SURVEYS * KEEP;
const FLEET_KEEP_MONTH = `₹${((FLEET_KEEP * M.days) / 100000).toFixed(1)}L`;
const FARE = IDEA.km * IDEA.perKm;
const LIFT = Math.floor((IDEA.driver / FARE) * 100);

/** The order something appears in, for the staggered entrance. */
const nth = (i: number) => ({ '--i': i }) as CSSProperties;

function Nums({ items }: { items: { value: string; label: string; good?: boolean }[] }) {
  return (
    <dl className="ig-nums">
      {items.map((x, i) => (
        <div key={x.label} className={x.good ? 'good' : ''} style={nth(i)}>
          <dd>{x.value}</dd>
          <dt>{x.label}</dt>
        </div>
      ))}
    </dl>
  );
}

function Chips({ items, check }: { items: string[]; check?: boolean }) {
  return (
    <ul className="ig-chips">
      {items.map((x, i) => (
        <li key={x} style={nth(i)}>
          {check && <Icon name="check" size={14} w={3} />}
          {x}
        </li>
      ))}
    </ul>
  );
}

/* 1. the ride as a strip of time: about 20 idle minutes, and where two short surveys fit */
function Idle() {
  return (
    <>
      <div className="ig-trip" role="img" aria-label="A ride from pickup to drop: about 20 idle minutes, with room for two short surveys">
        <p className="ig-trip-ends">
          <span>Pickup</span>
          <b>About 20 idle minutes in the back seat</b>
          <span>Drop</span>
        </p>
        <div className="ig-track">
          <span className="ig-slot a">Survey 1</span>
          <span className="ig-slot b">Survey 2</span>
          <span className="ig-car">
            <Solid name="car" size={26} />
          </span>
        </div>
        <p className="ig-ticks" aria-hidden="true">
          {[0, 5, 10, 15, 20].map((m) => (
            <span key={m}>{m} min</span>
          ))}
        </p>
      </div>
      <Nums
        items={[
          { value: '20 min', label: 'idle, per ride' },
          { value: '2 to 3 min', label: 'one survey (estimate)' },
          { value: '2', label: 'surveys a ride, at most (estimate)' },
        ]}
      />
    </>
  );
}

/* 2. the tablet itself, to try, with what it shows and what answering does to the driver's trip */
function Tablet({ survey, onSurvey }: { survey: number; onSurvey: (n: number) => void }) {
  return (
    <>
      <div className="ig-tab">
        <TabletDemo step={survey} onStep={onSurvey} />
        <div className="ig-tab-side">
          <ul className="ig-list">
            {IDEA.onTablet.map((x, i) => (
              <li key={x} style={nth(i)}>
                <Icon name="check" size={16} w={3} />
                {x}
              </li>
            ))}
            <li className="off" style={nth(IDEA.onTablet.length)}>
              <Icon name="x" size={16} w={3} />
              {IDEA.optOut}
            </li>
          </ul>
          <p className="ig-cap">The driver’s trip</p>
          <TripMeter step={survey} />
        </div>
      </div>
      <Chips items={IDEA.proof} check />
    </>
  );
}

/* 3. where one survey fee goes: coins run from the brand to the driver and to the venture */
const TO_DRIVER = 'M176 150 C 300 150, 330 78, 452 78';
const TO_KEEP = 'M176 150 C 300 150, 330 226, 452 226';
function Split() {
  const coins = (d: string, n: number, cls: string) =>
    Array.from({ length: n }, (_, i) => <circle key={i} r={9} className={`ig-coin ${cls}`} style={{ offsetPath: `path('${d}')`, animationDelay: `${(i * 2.4) / n}s` } as CSSProperties} />);
  return (
    <>
      <svg className="ig-flow" viewBox="0 0 640 300" role="img" aria-label={`A brand pays ${inr(IDEA.fee)} for a completed survey. ${inr(IDEA.driver)} goes to the driver and ${inr(KEEP)} stays with ${IDEA.venture}.`}>
        <path className="ig-pipe driver" d={TO_DRIVER} />
        <path className="ig-pipe keep" d={TO_KEEP} />
        {coins(TO_DRIVER, 3, 'driver')}
        {coins(TO_KEEP, 2, 'keep')}
        <g className="ig-node brand">
          <rect x="16" y="100" width="160" height="100" rx="18" />
          <text x="96" y="140">Brand pays</text>
          <text x="96" y="180" className="big">
            {inr(IDEA.fee)}
          </text>
        </g>
        <g className="ig-node driver">
          <rect x="452" y="30" width="172" height="96" rx="18" />
          <text x="538" y="66">Driver</text>
          <text x="538" y="106" className="big">
            {inr(IDEA.driver)}
          </text>
        </g>
        <g className="ig-node keep">
          <rect x="452" y="178" width="172" height="96" rx="18" />
          <text x="538" y="214">{IDEA.venture}</text>
          <text x="538" y="254" className="big">
            {inr(KEEP)}
          </text>
        </g>
        <text x="314" y="36" className="ig-flow-cap">
          one completed survey
        </text>
      </svg>
      <Nums
        items={[
          { value: inr(FARE), label: `${IDEA.km} km trip at ${inr(IDEA.perKm)} a km` },
          { value: inr(FARE + IDEA.driver), label: 'the same trip, one survey answered' },
          { value: `+${LIFT}%`, label: 'for the driver', good: true },
        ]}
      />
    </>
  );
}

/* 4. one driver's month, as a sum the reader can follow from left to right */
function Month() {
  return (
    <>
      <div className="ig-sum" role="img" aria-label={`${M.rides} rides a day, one rider in ${M.answerOneIn} answers: ${PER_DAY} surveys a day at ${inr(IDEA.driver)} is ${inr(DRIVER_DAY)} a day, and ${inr(DRIVER_MONTH)} over ${M.days} working days.`}>
        <div className="ig-sum-step">
          <div className="ig-dots">
            {Array.from({ length: M.rides }, (_, i) => (
              <i key={i} className={i % M.answerOneIn === 0 && i / M.answerOneIn < PER_DAY ? 'on' : ''} style={nth(i)} />
            ))}
          </div>
          <p>
            <b>{M.rides} rides a day</b>
            1 rider in {M.answerOneIn} answers
          </p>
        </div>
        <span className="ig-sum-op" aria-hidden="true">
          <Icon name="arrow" size={20} w={2.4} />
        </span>
        <div className="ig-sum-step">
          <p className="ig-eq">
            <b>{PER_DAY}</b> × <b>{inr(IDEA.driver)}</b>
          </p>
          <p>
            <b>{inr(DRIVER_DAY)} a day</b>
            {PER_DAY} surveys, {inr(IDEA.driver)} each
          </p>
        </div>
        <span className="ig-sum-op" aria-hidden="true">
          <Icon name="arrow" size={20} w={2.4} />
        </span>
        <div className="ig-sum-step">
          <div className="ig-cal">
            {Array.from({ length: M.days }, (_, i) => (
              <i key={i} style={nth(i)} />
            ))}
          </div>
          <p>
            <b>{M.days} working days</b>
            in a month
          </p>
        </div>
        <div className="ig-sum-total">
          <b>{inr(DRIVER_MONTH)}</b>
          <span>more a month</span>
        </div>
      </div>
      <Chips items={['Setup fee: ₹500 to ₹1,000, once', 'Uber installs the tablet', 'The rider pays nothing']} />
    </>
  );
}

/* 5. the same sum across 1,000 cabs: a field of dots, ten cabs each */
function Scale() {
  return (
    <div className="ig-fleet">
      <div className="ig-fleet-map" role="img" aria-label={`${M.cabs.toLocaleString('en-IN')} cabs, drawn as 100 dots of ten cabs each`}>
        <div className="ig-field">
          {Array.from({ length: 100 }, (_, i) => (
            <i key={i} style={nth((i * 37) % 100)} />
          ))}
        </div>
        <p className="ig-cap">Each dot is 10 cabs</p>
      </div>
      <div className="ig-fleet-side">
        <Nums
          items={[
            { value: FLEET_SURVEYS.toLocaleString('en-IN'), label: 'surveys a day' },
            { value: inr(FLEET_DRIVERS), label: 'to drivers, a day', good: true },
            { value: inr(FLEET_KEEP), label: `to ${IDEA.venture}, a day` },
            { value: FLEET_KEEP_MONTH, label: `to ${IDEA.venture}, a month of ${M.days} days` },
          ]}
        />
        <p className="ig-plus">
          <Icon name="plus" size={16} w={3} />
          <span>
            <b>Ads, on top:</b> a target of ₹5,000 to ₹5,500 per cab per month
          </span>
        </p>
      </div>
    </div>
  );
}

/* 6. the pilot: how many cabs, for how long, with whom, and what counts as working */
function Pilot() {
  return (
    <div className="ig-plan">
      <div className="ig-pilot-row">
        <p className="ig-cap">
          <Icon name="pin" size={15} /> Gurugram · 20 to 30 cabs
        </p>
        <div className="ig-cabs" role="img" aria-label="Twenty cabs, with ten more possible">
          {Array.from({ length: 30 }, (_, i) => (
            <i key={i} className={i >= 20 ? 'maybe' : ''} style={nth(i)}>
              <Solid name="car" size={18} />
            </i>
          ))}
        </div>
      </div>
      <div className="ig-pilot-row">
        <p className="ig-cap">
          <Icon name="clock" size={15} /> 4 to 6 weeks
        </p>
        <div className="ig-weeks" role="img" aria-label="Four weeks, with two more possible">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className={i >= 4 ? 'maybe' : ''} style={nth(i * 3)}>
              Week {i + 1}
            </span>
          ))}
        </div>
      </div>
      <div className="ig-pilot-cols">
        <div>
          <p className="ig-cap">The first drivers</p>
          <Chips items={IDEA.firstDrivers} />
        </div>
        <div>
          <p className="ig-cap">It has worked if</p>
          <Chips items={IDEA.success} check />
        </div>
      </div>
    </div>
  );
}

/* 7. each risk beside its answer */
function Risks() {
  return (
    <ul className="ig-rlist">
      {IDEA.risks.map((r, i) => (
        <li key={r.risk} style={nth(i * 3)}>
          <span className="ig-risk-ico">
            {r.solid ? <Solid name={r.icon} size={20} /> : <Icon name={r.icon} size={20} />}
          </span>
          <p>
            <b>{r.risk}</b>
            {r.answer}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function IdeaGraphic({ id, survey, onSurvey }: { id: IdeaSceneId; survey: number; onSurvey: (n: number) => void }) {
  let g: ReactNode;
  if (id === 'idle') g = <Idle />;
  else if (id === 'tablet') g = <Tablet survey={survey} onSurvey={onSurvey} />;
  else if (id === 'split') g = <Split />;
  else if (id === 'month') g = <Month />;
  else if (id === 'scale') g = <Scale />;
  else if (id === 'pilot') g = <Pilot />;
  else g = <Risks />;
  return <div className={`ig ig-${id}`}>{g}</div>;
}
