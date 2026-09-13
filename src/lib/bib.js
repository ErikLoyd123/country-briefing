// Build-time only (reads the filesystem). Never import from a React island.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import rehypeCitation from 'rehype-citation';

export const BIB_PATH = resolve(process.cwd(), 'src/references.bib');

export function parseBibKeys(text) {
  return new Set([...text.matchAll(/@\w+\s*\{\s*([^,\s]+)\s*,/g)].map((m) => m[1]));
}

export function bibKeys() {
  return parseBibKeys(readFileSync(BIB_PATH, 'utf8'));
}

// Renders an APA reference list (HTML) for the given cite keys, or every entry with '*'.
export async function formatBibliography(keys) {
  if (Array.isArray(keys) && keys.length === 0) return '';
  const noCite = keys === '*' ? ['@*'] : keys.map((k) => `@${k}`);
  const out = await unified()
    .use(rehypeParse, { fragment: true })
    // rehype-citation joins `path` + `bibliography`, so the bibliography must be relative.
    .use(rehypeCitation, { bibliography: 'src/references.bib', path: process.cwd(), csl: 'apa', noCite })
    .use(rehypeStringify)
    .process('');
  return String(out);
}

// APA in-text citation text for chart source lines, e.g. "(World Bank, 2025)".
export async function formatInText(keys) {
  const unique = [...new Set(keys)];
  if (unique.length === 0) return '';
  const out = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeCitation, {
      bibliography: 'src/references.bib',
      path: process.cwd(),
      csl: 'apa',
      suppressBibliography: true,
    })
    .use(rehypeStringify)
    .process(`<p>[${unique.map((k) => `@${k}`).join('; ')}]</p>`);
  return String(out)
    .replace(/<[^>]+>/g, '')
    .replace(/&#x26;|&amp;/g, '&')
    .trim();
}
