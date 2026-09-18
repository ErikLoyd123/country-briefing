// Which parts of its assignment prompt a slide answers: a review aid, not part of the briefing.
// Tag a slide with covers={['Government', 'FDI']}; the Briefing menu rolls a section's slide tags up.
// Each desk lists its prompt's questions and the areas under them; pills are colored by question.
// A desk with no entry here has no pills, and a covers tag on its slides fails the build until it adds one.
const PROMPTS = {
  'politics-risk': [
    { label: 'Risks', pill: 'border-blue-200 bg-blue-50 text-blue-800', dot: 'bg-blue-500', areas: ['Government', 'Society', 'Education', 'Security', 'Economy'] },
    { label: 'FDI', pill: 'border-emerald-200 bg-emerald-50 text-emerald-800', dot: 'bg-emerald-500', areas: ['FDI'] },
    { label: 'Political environment', pill: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-800', dot: 'bg-fuchsia-500', areas: ['Politics', 'Transparency', 'Corruption', 'Trade', 'Civil unrest', 'Industries'] },
  ],
};

export const questionsFor = (desk) => PROMPTS[desk] ?? [];

// Dedupe, check, and put areas in prompt order, each with its pill classes.
export function coverPills(areas = [], desk) {
  const questions = questionsFor(desk);
  const allAreas = questions.flatMap((q) => q.areas);
  return [...new Set(areas)]
    .map((area) => {
      const q = questions.find((q) => q.areas.includes(area));
      if (!q) throw new Error(`covers: "${area}" is not a prompt area for desk "${desk}"; use one of ${allAreas.join(', ') || '(none yet: add them in src/lib/covers.js)'}`);
      return { area, pill: q.pill };
    })
    .sort((a, b) => allAreas.indexOf(a.area) - allAreas.indexOf(b.area));
}

// Every area tagged on any slide in a section, read from the raw index.mdx.
export function sectionCovers(topic) {
  const body = topic.parts.index?.body ?? '';
  return [...body.matchAll(/covers=\{\[([^\]]*)\]\}/g)].flatMap((m) => [...m[1].matchAll(/'([^']+)'/g)].map((a) => a[1]));
}
