// Build-time only. Media credits from /credits.yaml.
import raw from '../../credits.yaml?raw';
import { loadYaml } from './yaml.js';

export const credits = loadYaml(raw, 'credits.yaml') ?? [];

export function getCredit(file) {
  const c = credits.find((x) => x.file === file);
  if (!c) {
    throw new Error(`No credit entry for "${file}". Add it to credits.yaml (source, author, url, license, aiGenerated).`);
  }
  return c;
}

export function creditLine(c) {
  const who = c.author ? `${c.author} / ${c.source}` : c.source;
  return c.aiGenerated ? `Illustrative (AI-generated) · ${who}` : `Photo: ${who}`;
}
