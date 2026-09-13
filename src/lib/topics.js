// Build-time only. Assembles briefing topics from src/content/briefings/NN-slug/{index,singapore,vietnam}.mdx
import { getCollection } from 'astro:content';
import { getIndicator } from './data.js';

const PART_FILES = { index: 'index', singapore: 'singapore', vietnam: 'vietnam' };
const REQUIRED_INDEX_FIELDS = ['title', 'thesis', 'ratings', 'hero'];

let cache;

export async function getTopics() {
  // Cache only in production builds; in dev, frontmatter edits must show up on refresh.
  if (cache && import.meta.env.PROD) return cache;
  const entries = await getCollection('briefings');
  const byFolder = new Map();

  for (const entry of entries) {
    const [folder, file, ...rest] = entry.id.split('/');
    const match = /^(\d+)-([a-z0-9-]+)$/.exec(folder ?? '');
    if (!match || rest.length || !Object.values(PART_FILES).includes(file)) {
      throw new Error(
        `briefings: "${entry.id}.mdx" is not in the expected shape NN-topic-slug/{index,singapore,vietnam}.mdx`,
      );
    }
    if (!byFolder.has(folder)) byFolder.set(folder, { order: Number(match[1]), slug: match[2], parts: {} });
    byFolder.get(folder).parts[file] = entry;
  }

  const topics = [...byFolder.entries()].map(([folder, t]) => {
    for (const part of Object.values(PART_FILES)) {
      if (!t.parts[part]) throw new Error(`briefings/${folder}: missing ${part}.mdx`);
    }
    const d = t.parts.index.data;
    for (const f of REQUIRED_INDEX_FIELDS) {
      if (d[f] === undefined) throw new Error(`briefings/${folder}/index.mdx: frontmatter field "${f}" is required`);
    }
    if (!d.hero.image && !d.hero.video && !d.hero.label) {
      throw new Error(`briefings/${folder}/index.mdx: hero needs image, video, or a placeholder label`);
    }
    d.keyStats.forEach(getIndicator); // throws on unknown indicator ids
    return {
      folder,
      slug: t.slug,
      order: t.order,
      title: d.title,
      thesis: d.thesis,
      ratings: d.ratings,
      hero: d.hero,
      pillars: d.pillars,
      keyStats: d.keyStats,
      status: d.status,
      parts: t.parts,
    };
  });

  cache = topics.sort((a, b) => a.order - b.order);
  return cache;
}
