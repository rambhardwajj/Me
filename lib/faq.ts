import { ACHIEVEMENTS, PROFILE, PROJECTS } from './data';

/**
 * Offline answers for Mini Ram, used when the AI is unavailable (quota, outage, network).
 * Every line is assembled from data.ts, so it can't drift from the rest of the site.
 */
const pick = (needle: string) => ACHIEVEMENTS.find((a) => a.title.toLowerCase().includes(needle.toLowerCase()));
const leetcase = PROJECTS.find((p) => p.id === 'leetcase');

function now() {
  return `Ram is doing a ${PROFILE.current} and building LeetCase on the side. ${PROFILE.availability}. Best way to reach him: ${PROFILE.email}.`;
}

function wins() {
  const list = ['Wingathon', 'Synappses', 'Newral’s revenue', 'Customer’s First', 'world dance battle']
    .map(pick)
    .filter(Boolean)
    .map((a) => `- ${a!.title} (${a!.metric})`);
  return `A few of Ram's biggest wins:\n${list.join('\n')}`;
}

function aboutLeetcase() {
  if (!leetcase) return fallback();
  const m = leetcase.metrics.map((x) => `${x.value} ${x.label}`).join(', ');
  return `${leetcase.name}: ${leetcase.pitch} Ram is the ${leetcase.role}${leetcase.period ? ` (${leetcase.period})` : ''}. ${leetcase.did.join('. ')}. Results so far: ${m}.${leetcase.url ? ` Try it: ${leetcase.url}` : ''}`;
}

function whyHire() {
  const proof = ['Synappses', 'Newral’s revenue', 'Shipped TruCost', 'Customer’s First']
    .map(pick)
    .filter(Boolean)
    .map((a) => `- ${a!.title}: ${a!.metric}`);
  return `Ram is a ${PROFILE.intro}\n\nThe proof:\n${proof.join('\n')}\n\nHe's an engineer at heart, so he can go deep with dev teams and still own pricing, GTM and the P&L. Reach him at ${PROFILE.email}.`;
}

function fallback() {
  return `${PROFILE.pitch} For anything more specific, email Ram at ${PROFILE.email}.`;
}

/** Best local answer for a question, matched loosely on keywords. */
export function localAnswer(question: string) {
  const q = question.toLowerCase();
  if (q.includes('leetcase')) return aboutLeetcase();
  if (/(hire|why .*pm|why .*product|fit|strength)/.test(q)) return whyHire();
  if (/(win|achiev|award|proud|best|highlight)/.test(q)) return wins();
  if (/(now|current|doing|today|these days|available|open to)/.test(q)) return now();
  return fallback();
}
