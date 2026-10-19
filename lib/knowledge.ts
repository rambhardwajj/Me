import { ACHIEVEMENTS, CAPABILITIES, EXPERIENCE, JOURNEY, PERSONAS, PROFILE, PROJECTS } from './data';

/**
 * Everything the chat mascot knows about Ram, flattened into plain text from the site's own data,
 * so the bot can never say more than the portfolio does. Private details (phone) never live in data.ts.
 */
export function buildKnowledge() {
  const lines: string[] = [];
  lines.push(`# ${PROFILE.name}`);
  lines.push(`Role: ${PROFILE.role}. ${PROFILE.availability}.`);
  lines.push(`Currently: ${PROFILE.current}. Based in ${PROFILE.location}.`);
  lines.push(`Summary: ${PROFILE.intro}`);
  lines.push(`In his words: ${PROFILE.pitch}`);
  lines.push(`Contact: email ${PROFILE.email}; LinkedIn ${PROFILE.linkedin}; GitHub ${PROFILE.github}; X ${PROFILE.x}; Instagram ${PROFILE.instagram}.`);

  lines.push('\n## Experience (newest first)');
  for (const j of EXPERIENCE) {
    lines.push(`\n### ${j.company} (${j.type}, ${j.location})`);
    lines.push(j.summary);
    if (j.highlights?.length) lines.push(`Recognition: ${j.highlights.join('; ')}.`);
    for (const r of j.roles) {
      lines.push(`- ${r.title}, ${r.start} to ${r.end ?? 'present'}:`);
      for (const g of r.groups) for (const p of g.points) lines.push(`  - ${p}`);
    }
  }

  lines.push('\n## Products and projects');
  for (const p of PROJECTS) {
    lines.push(`\n### ${p.name}${p.url ? ` (${p.url})` : ''}`);
    lines.push(`${p.pitch} Role: ${p.role}${p.period ? `, ${p.period}` : ''}${p.client ? `, client: ${p.client}` : ''}.`);
    lines.push(`Problem: ${p.problem}`);
    for (const d of p.did) lines.push(`- ${d}`);
    lines.push(`Results: ${p.metrics.map((m) => `${m.value} ${m.label}`).join('; ')}. Stack/skills: ${p.stack.join(', ')}.`);
  }

  lines.push('\n## Key achievements');
  for (const a of ACHIEVEMENTS) lines.push(`- ${a.year}: ${a.title} (${a.context}; ${a.metric})`);

  lines.push('\n## Journey, oldest first');
  for (const m of JOURNEY) lines.push(`- ${m.date}: ${m.title}, ${m.org}. ${m.body}${m.points ? ` ${m.points.join('; ')}.` : ''}`);

  lines.push('\n## Three sides of Ram');
  for (const p of PERSONAS) lines.push(`- ${p.name} (${p.platform} ${p.handle}): ${p.tagline}`);

  lines.push('\n## Skills');
  for (const c of CAPABILITIES) lines.push(`- ${c.group}: ${c.items.join(', ')}`);

  return lines.join('\n');
}
