// The five briefing desks, one per team, in the assignment's order. Each desk has its own briefing, sources and
// about pages under /<slug>/, built from files in its own folders:
//   src/content/briefings/<slug>/NN-section/index.mdx   the briefing sections
//   src/content/about/<slug>.mdx                        the About page text (optional)
//   src/content/appendices/<slug>/<page>.mdx            appendix pages (optional)
//   src/data/<slug>/sources.csv                         the sources table
// A desk with status 'starter' is a placeholder its team has not filled in yet.

export const COURSE = 'DU EMBA Cohort 84 · Global Business';

export const DESKS = [
  {
    slug: 'politics-risk',
    name: 'Politics & Risk',
    blurb: 'Government, society, security and the economy: the risks of doing business, and what they mean for investment.',
    status: 'live',
    team: { name: 'Team Poesis', members: ['Terese Rainwater', 'Allison Eaby', 'Zach Van Valkenburg', 'Erik Loyd'] },
    retrieved: '13 September 2026',
  },
  {
    slug: 'hr-culture',
    name: 'Human Resources & Cultural Implications',
    blurb: 'What a hiring manager needs to know: talent, employee development, and the culture behind both.',
    status: 'starter',
    team: { name: 'Team to be named', members: [] },
  },
  {
    slug: 'marketing',
    name: 'Marketing Practices',
    blurb: 'How customers buy, how price-sensitive they are, and which media channels shape their choices.',
    status: 'starter',
    team: { name: 'Team to be named', members: [] },
  },
  {
    slug: 'supply-chain',
    name: 'Supply Chain, Natural Resources & Infrastructure',
    blurb: 'Logistics hubs, trade routes, energy, natural resources, and what it costs to make and move goods.',
    status: 'starter',
    team: { name: 'Team to be named', members: [] },
  },
  {
    slug: 'finance-economics',
    name: 'Finance & Economics',
    blurb: 'Currency, banking, credit ratings, trade and the trends behind the numbers.',
    status: 'starter',
    team: { name: 'Team Money', members: ['Garett Brownlee', 'Mel Swayne', 'Brian Friedman', 'Justin Alexander', 'Jeff Daskam'] },
    retrieved: '21 September 2026',
  },
].map((d, i) => ({ ...d, number: i + 1 }));

const bySlug = new Map(DESKS.map((d) => [d.slug, d]));

export function getDesk(slug) {
  const desk = bySlug.get(slug);
  if (!desk) throw new Error(`Unknown desk "${slug}". Desks are listed in src/lib/desks.js: ${[...bySlug.keys()].join(', ')}.`);
  return desk;
}

// The desk a URL belongs to, or null for pages shared by all desks (the homepage).
export const deskFromPath = (pathname) => bySlug.get(pathname.split('/')[1]) ?? null;

// A link inside a desk: deskPath('politics-risk', '/sources') → /politics-risk/sources.
export const deskPath = (desk, path = '') => `/${typeof desk === 'string' ? desk : desk.slug}${path}`;
