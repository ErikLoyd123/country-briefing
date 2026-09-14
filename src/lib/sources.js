// Build-time only (reads the filesystem). Never import from a React island.
// Sources come from src/data/sources.csv, the team's verification table: one row per claim,
// each with the APA reference it rests on. Text cites claims by ID ([@SG-12]); the site turns
// that into an APA in-text citation for the claim's source.
import { readFileSync, statSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { csvParse } from 'd3-dsv';

export const SOURCES_PATH = resolve(process.cwd(), 'src/data/sources.csv');
export const SOURCES_PAGE = '/sources';

export const CLAIM_ID = /^[A-Z]{2,4}-\d+$/;

const COLUMNS = {
  id: 'ID',
  screen: 'Screen',
  subject: 'Country / company',
  claim: 'Claim',
  apa: 'Source (APA)',
  url: 'Link',
  retrieved: 'Retrieved',
  verifiedBy: 'Verified by',
  notes: 'Notes',
  quote: 'Quote',
};
const REQUIRED = ['id', 'claim', 'apa', 'url'];

// "Author. (date). Title. Publisher." → { author, date, year, rest }
export function parseApa(apa) {
  const m = /^(.+?) \((n\.d\.|\d{4}(?:, [^)]+)?)\)\. (.+)$/.exec(apa.trim());
  if (!m) return null;
  const date = m[2];
  return { author: m[1], date, year: date === 'n.d.' ? 'n.d.' : date.slice(0, 4), rest: m[3] };
}

const KEEP_PERIOD = /\b(Inc|Ltd|Co|Corp|Jr|Sr|al)\.$/;

// Author as it appears in an in-text citation: an organisation in full, a person by surname.
export function inTextAuthor(author) {
  const person = /^([^,]+), [A-Z]\.(?: ?[A-Z]\.)*( et al\.?)?$/.exec(author);
  if (person) return person[1] + (person[2] ? ' et al.' : '');
  return KEEP_PERIOD.test(author) ? author : author.replace(/\.$/, '');
}

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');

export function parseClaims(text) {
  const rows = csvParse(text.replace(/^﻿/, '').trim());
  for (const key of REQUIRED) {
    if (!rows.columns.includes(COLUMNS[key])) throw new Error(`sources.csv: missing column "${COLUMNS[key]}"`);
  }
  const seen = new Set();
  return rows.map((r, i) => {
    const row = i + 2;
    const c = Object.fromEntries(Object.entries(COLUMNS).map(([k, col]) => [k, (r[col] ?? '').trim()]));
    if (!CLAIM_ID.test(c.id)) throw new Error(`sources.csv row ${row}: ID "${c.id}" should look like SG-12`);
    if (seen.has(c.id)) throw new Error(`sources.csv row ${row}: ID ${c.id} is used twice`);
    seen.add(c.id);
    for (const key of REQUIRED) if (!c[key]) throw new Error(`sources.csv row ${row} (${c.id}): "${COLUMNS[key]}" is empty`);
    if (!parseApa(c.apa)) {
      throw new Error(`sources.csv row ${row} (${c.id}): source "${c.apa}" is not in APA form "Author. (Year). Title. Publisher."`);
    }
    return c;
  });
}

// Groups claims by source and gives each source its in-text label. Two different works by the same
// author in the same year get a, b, c suffixes, ordered by title (APA 7, section 8.19).
export function buildIndex(claims) {
  // A source is one link. Rows citing the same link must describe it the same way.
  const byUrl = new Map();
  for (const c of claims) {
    const known = byUrl.get(c.url);
    if (known && known.apa !== c.apa) {
      throw new Error(`sources.csv: ${known.claims[0]} and ${c.id} share a link but describe the source differently. Make "Source (APA)" match.`);
    }
    if (!known) {
      const p = parseApa(c.apa);
      byUrl.set(c.url, { apa: c.apa, url: c.url, ...p, author: inTextAuthor(p.author), rawAuthor: p.author, claims: [] });
    }
    byUrl.get(c.url).claims.push(c.id);
  }
  const sources = [...byUrl.values()];

  const groups = new Map();
  for (const s of sources) {
    const k = `${s.author}|${s.year}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(s);
  }
  for (const group of groups.values()) {
    group.sort((a, b) => a.rest.localeCompare(b.rest));
    group.forEach((s, i) => {
      s.suffix = group.length > 1 ? String.fromCharCode(97 + i) : '';
    });
  }

  for (const s of sources) {
    s.yearLabel = s.year === 'n.d.' ? (s.suffix ? `n.d.-${s.suffix}` : 'n.d.') : s.year + s.suffix;
    s.label = `${s.author}, ${s.yearLabel}`;
    s.id = `ref-${slugify(s.author)}-${s.year === 'n.d.' ? 'nd' : s.year}${s.suffix}`;
    const date = s.year === 'n.d.' ? s.yearLabel : s.yearLabel + s.date.slice(4);
    s.reference = `${s.rawAuthor} (${date}). ${s.rest}`;
  }
  // Reference list order: author, then year (n.d. last), then suffix.
  sources.sort((a, b) => a.author.localeCompare(b.author) || (a.year === 'n.d.') - (b.year === 'n.d.') || a.yearLabel.localeCompare(b.yearLabel));

  const claimById = new Map(claims.map((c) => [c.id, c]));
  const sourceByClaim = new Map();
  for (const s of sources) for (const id of s.claims) sourceByClaim.set(id, s);
  return { claims, claimById, sources, sourceByClaim };
}

let cache;
export function loadIndex() {
  const mtime = statSync(SOURCES_PATH).mtimeMs;
  if (!cache || cache.mtime !== mtime) cache = { mtime, index: buildIndex(parseClaims(readFileSync(SOURCES_PATH, 'utf8'))) };
  return cache.index;
}

// The sources behind a list of claim IDs, deduplicated, in APA in-text order.
export function sourcesFor(ids, index = loadIndex(), where = '') {
  const unknown = ids.filter((id) => !index.claimById.has(id));
  if (unknown.length) {
    throw new Error(`Unknown claim ID(s) ${unknown.join(', ')}${where ? ` in ${where}` : ''}. Add the claim to src/data/sources.csv.`);
  }
  const list = [...new Set(ids.map((id) => index.sourceByClaim.get(id)))];
  return list.sort((a, b) => a.author.localeCompare(b.author) || a.yearLabel.localeCompare(b.yearLabel));
}

// Citation as a list of pieces: [{ text }, { text, href, title }]. Consecutive works by one author
// share the name: (Crocs, Inc., 2025, 2026).
export function citationPieces(ids, index = loadIndex(), where = '') {
  const pieces = [{ text: '(' }];
  let prev = null;
  for (const s of sourcesFor(ids, index, where)) {
    const link = { href: `${SOURCES_PAGE}#${s.id}`, title: s.reference };
    if (prev && prev.author === s.author) pieces.push({ text: ', ' }, { ...link, text: s.yearLabel });
    else pieces.push(...(prev ? [{ text: '; ' }] : []), { ...link, text: s.label });
    prev = s;
  }
  pieces.push({ text: ')' });
  return pieces;
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// HTML for components that take claim IDs as a prop (cite={['SG-1', 'SG-2']}).
export function citationHtml(ids, index = loadIndex(), where = '') {
  if (!ids?.length) return '';
  const inner = citationPieces(ids, index, where)
    .map((p) => (p.href ? `<a href="${p.href}" title="${esc(p.title)}">${esc(p.text)}</a>` : esc(p.text)))
    .join('');
  return `<span class="cite" data-claims="${ids.join(' ')}">${inner}</span>`;
}

// Text with trailing claim IDs rendered as a citation: "Body text." + [SG-1] → "Body text (…)."
export function withCitation(text, ids, index = loadIndex(), where = '') {
  if (!ids?.length) return esc(text);
  const m = /^([\s\S]*?)([.!?]?)$/.exec(text.trim());
  return `${esc(m[1])} ${citationHtml(ids, index, where)}${m[2]}`;
}

// Pages that brief rather than document (the slides and the homepage) set Astro.locals.hideCitations.
// Components pass Astro.locals here: claim IDs are still checked against sources.csv, but nothing is shown.
// The paper and the Sources page carry the citations; the Sources page lists where each claim appears.
export function siteCitation(locals, ids, where = '') {
  if (!locals?.hideCitations) return citationHtml(ids, undefined, where);
  if (ids?.length) sourcesFor(ids, undefined, where);
  return '';
}

export function siteWithCitation(locals, text, ids, where = '') {
  if (!locals?.hideCitations) return withCitation(text, ids, undefined, where);
  if (ids?.length) sourcesFor(ids, undefined, where);
  return esc(text);
}

// Where each claim appears on the site: Map of claim ID → [{ section, slide, href }].
// Reads each slides section's index.mdx one <Slide> at a time, counting claim IDs written in the slide and
// in the data files its components read.
const DATA_BY_TAG = { Timeline: 'timeline.yaml', TradeAgreements: 'trade-agreements.yaml' };
export const slideAnchor = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export function claimUsage(index = loadIndex()) {
  const cwd = process.cwd();
  const ids = (text) => [...text.matchAll(/\b[A-Z]{2,4}-\d+\b/g)].map((m) => m[0]).filter((id) => index.claimById.has(id));
  const dataIds = (file) => ids(readFileSync(resolve(cwd, 'src/data', file), 'utf8'));
  const usage = new Map();
  const add = (id, place) => {
    const list = usage.get(id) ?? [];
    if (!list.some((p) => p.href === place.href)) list.push(place);
    usage.set(id, list);
  };
  add.all = (list, place) => list.forEach((id) => add(id, place));

  const dir = resolve(cwd, 'src/content/briefings');
  for (const folder of readdirSync(dir).sort()) {
    const file = join(dir, folder, 'index.mdx');
    let text;
    try {
      text = readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    const front = /^---\n([\s\S]*?)\n---/.exec(text)?.[1] ?? '';
    const field = (name) => new RegExp(`^${name}:\\s*"?(.+?)"?\\s*$`, 'm').exec(front)?.[1];
    const section = field('short') ?? field('title') ?? folder;
    const slug = folder.replace(/^\d+-/, '');
    for (const chunk of text.split(/(?=<Slide[\s>])/).slice(1)) {
      const title = /^<Slide[^>]*?\stitle="([^"]*)"/.exec(chunk)?.[1] ?? '';
      const place = { section, slide: title, href: `/briefing/${slug}${title ? `#${slideAnchor(title)}` : ''}` };
      add.all(ids(chunk), place);
      for (const [tag, data] of Object.entries(DATA_BY_TAG)) if (chunk.includes(`<${tag}`)) add.all(dataIds(data), place);
    }
  }
  return usage;
}

// Claim IDs cited anywhere in content (MDX) or data (YAML). Drives the paper's reference list.
export function citedClaimIds(index = loadIndex()) {
  const roots = ['src/content', 'src/data'].map((d) => resolve(process.cwd(), d));
  const found = new Set();
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(mdx?|ya?ml)$/.test(e.name)) {
        for (const m of readFileSync(p, 'utf8').matchAll(/\b[A-Z]{2,4}-\d+\b/g)) if (index.claimById.has(m[0])) found.add(m[0]);
      }
    }
  };
  roots.forEach(walk);
  return found;
}

// Facts the team wanted but could not source (src/data/sources-not-used.csv).
export function loadNotUsed() {
  const text = readFileSync(resolve(process.cwd(), 'src/data/sources-not-used.csv'), 'utf8');
  return csvParse(text.replace(/^﻿/, '').trim()).map((r) => ({ wanted: r['What we wanted'], why: r['Why it is not on the dashboard'] }));
}

// Verification table groups: the Screen column mapped to the site's sections.
export const SCREEN_GROUPS = [
  { title: 'Need to Know', screens: ['need to know', 'at a glance'] },
  { title: 'Dangers and Annoyances', screens: ['dangers government', 'dangers society', 'dangers security', 'dangers economy'] },
  { title: 'Money Matters', screens: ['money matters'] },
  { title: 'The Political Weather', screens: ['political weather', 'what changed'] },
  { title: 'Local Knowledge', screens: ['local knowledge'] },
  { title: 'Etiquette', screens: ['etiquette'] },
  { title: 'Itineraries', screens: ['itinerary'] },
];

export function claimsByGroup(index = loadIndex()) {
  const known = new Set(SCREEN_GROUPS.flatMap((g) => g.screens));
  const groups = SCREEN_GROUPS.map((g) => ({ title: g.title, claims: index.claims.filter((c) => g.screens.includes(c.screen.toLowerCase())) }));
  const other = index.claims.filter((c) => !known.has(c.screen.toLowerCase()));
  return other.length ? [...groups, { title: 'Other', claims: other }] : groups;
}
