// Build-time only. Lists every <Risk> card written in the briefing country files, so the
// homepage can summarise them without repeating the text. Reads each opening tag's
// area, level and title attributes.
import { AREAS, RISK_LEVELS, riskAnchor } from './format.js';

const files = import.meta.glob('/src/content/briefings/*/{singapore,vietnam}.mdx', { query: '?raw', import: 'default', eager: true });

export function parseRiskTags(text) {
  return [...text.matchAll(/<Risk\s([^>]*)>/g)].map((m) => Object.fromEntries([...m[1].matchAll(/(\w+)="([^"]*)"/g)].map((a) => [a[1], a[2]])));
}

export function getRisks() {
  const risks = [];
  for (const [path, text] of Object.entries(files)) {
    const [, folder, file] = /briefings\/([^/]+)\/(\w+)\.mdx$/.exec(path);
    const slug = folder.replace(/^\d+-/, '');
    for (const r of parseRiskTags(text)) {
      if (!AREAS[r.area] || !RISK_LEVELS[r.level] || !r.title) continue; // Risk.astro reports bad attributes
      risks.push({ ...r, country: file === 'singapore' ? 'SG' : 'VN', href: `/briefing/${slug}#${riskAnchor(r.title)}` });
    }
  }
  return risks;
}
