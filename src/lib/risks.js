// Build-time only. Lists every risk written in the briefing, so the homepage and the Dangers risk map
// can summarise them without repeating the text. Reads each opening tag's area, level and title:
//   <RiskCard country="SG" …> in a slides section's index.mdx
//   <Risk …> in a screens section's singapore.mdx / vietnam.mdx (country from the file name)
import { AREAS, RISK_LEVELS, riskAnchor } from './format.js';

const files = import.meta.glob('/src/content/briefings/*/*.mdx', { query: '?raw', import: 'default', eager: true });

export function parseRiskTags(text, tag = 'Risk') {
  return [...text.matchAll(new RegExp(`<${tag}\\s([^>]*)>`, 'g'))].map((m) => Object.fromEntries([...m[1].matchAll(/(\w+)="([^"]*)"/g)].map((a) => [a[1], a[2]])));
}

export function getRisks() {
  const risks = [];
  for (const [path, text] of Object.entries(files)) {
    const [, folder, file] = /briefings\/([^/]+)\/(\w+)\.mdx$/.exec(path);
    const slug = folder.replace(/^\d+-/, '');
    const found =
      file === 'index'
        ? parseRiskTags(text, 'RiskCard')
        : ['singapore', 'vietnam'].includes(file)
          ? parseRiskTags(text).map((r) => ({ ...r, country: file === 'singapore' ? 'SG' : 'VN' }))
          : [];
    for (const r of found) {
      if (!AREAS[r.area] || !RISK_LEVELS[r.level] || !r.title) continue; // Risk.astro / RiskCard.astro report bad attributes
      risks.push({ ...r, href: `/briefing/${slug}#${riskAnchor(r.title)}` });
    }
  }
  return risks;
}
