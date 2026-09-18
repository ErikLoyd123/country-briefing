// Build-time only. Assembles a desk's briefing sections from src/content/briefings/<desk>/NN-slug/{index,singapore,vietnam}.mdx
import { getCollection } from 'astro:content';
import { getDesk } from './desks.js';

const PART_FILES = { index: 'index', singapore: 'singapore', vietnam: 'vietnam' };
const REQUIRED_INDEX_FIELDS = ['title', 'thesis', 'hero'];

const cache = new Map();

export async function getTopics(desk) {
  getDesk(desk);
  // Cache only in production builds; in dev, frontmatter edits must show up on refresh.
  if (cache.has(desk) && import.meta.env.PROD) return cache.get(desk);
  const entries = await getCollection('briefings');
  const byFolder = new Map();

  for (const entry of entries) {
    const [entryDesk, folder, file, ...rest] = entry.id.split('/');
    getDesk(entryDesk);
    if (entryDesk !== desk) continue;
    const match = /^(\d+)-([a-z0-9-]+)$/.exec(folder ?? '');
    if (!match || rest.length || !Object.values(PART_FILES).includes(file)) {
      throw new Error(
        `briefings: "${entry.id}.mdx" is not in the expected shape <desk>/NN-topic-slug/{index,singapore,vietnam}.mdx`,
      );
    }
    if (!byFolder.has(folder)) byFolder.set(folder, { order: Number(match[1]), slug: match[2], parts: {} });
    byFolder.get(folder).parts[file] = entry;
  }

  const topics = [...byFolder.entries()].map(([folder, t]) => {
    if (!t.parts.index) throw new Error(`briefings/${desk}/${folder}: missing index.mdx`);
    const d = t.parts.index.data;
    // A slides section is authored entirely in index.mdx; a screens section splits into three files.
    const format = d.format ?? 'screens';
    if (format === 'screens') {
      for (const part of Object.values(PART_FILES)) {
        if (!t.parts[part]) throw new Error(`briefings/${desk}/${folder}: missing ${part}.mdx`);
      }
    } else if (t.parts.singapore || t.parts.vietnam) {
      throw new Error(`briefings/${desk}/${folder}: a slides section is written in index.mdx only; remove singapore.mdx and vietnam.mdx`);
    }
    for (const f of REQUIRED_INDEX_FIELDS) {
      if (f === 'thesis' && d.conclusion) continue;
      if (d[f] === undefined) throw new Error(`briefings/${desk}/${folder}/index.mdx: frontmatter field "${f}" is required`);
    }
    if (!d.hero.image && !d.hero.video && !d.hero.label) {
      throw new Error(`briefings/${desk}/${folder}/index.mdx: hero needs image, video, or a placeholder label`);
    }
    return {
      desk,
      folder,
      slug: t.slug,
      order: t.order,
      title: d.title,
      short: d.short ?? d.title,
      thesis: d.thesis,
      hero: d.hero,
      status: d.status,
      format,
      paper: d.paper ?? true,
      conclusion: d.conclusion ?? false,
      parts: t.parts,
    };
  });

  const sorted = topics.sort((a, b) => a.order - b.order);
  if (!sorted.length) throw new Error(`briefings/${desk}: no sections yet. Add src/content/briefings/${desk}/01-<slug>/index.mdx`);
  cache.set(desk, sorted);
  return sorted;
}
