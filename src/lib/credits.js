// Build-time only. Media credits from /credits.yaml.
import raw from '../../credits.yaml?raw';
import { loadYaml } from './yaml.js';

export const credits = loadYaml(raw, 'credits.yaml') ?? [];

// Credits are listed once on /about (the Creative Commons photos require attribution);
// pages don't show per-image credits. Returns null when a file has no entry.
export function findCredit(file) {
  return credits.find((x) => x.file === file) ?? null;
}

const SOURCE_NAMES = {
  unsplash: 'Unsplash',
  'pexels-photo': 'Pexels',
  'pexels-video': 'Pexels',
  pexels: 'Pexels',
  wikimedia: 'Wikimedia Commons',
  flux: 'Flux',
  team: 'Team photo',
};

// e.g. "Mike Enerio / Unsplash" or "Icepinner / Wikimedia Commons, CC BY 4.0"
export function creditLine(c) {
  const source = SOURCE_NAMES[c.source] ?? c.source;
  const who = c.author ? `${c.author} / ${source}` : source;
  const license = /^CC /.test(c.license ?? '') ? `, ${c.license}` : '';
  return `${who}${license}`;
}
