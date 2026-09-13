import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Pandoc-style citations: [@key], [@key, p. 4], [see @a; @b].
// Keys must start after "[", whitespace, ";" or "(" so emails don't match.
export function extractCiteKeys(text) {
  const keys = [];
  for (const group of text.matchAll(/\[([^[\]]*@[^[\]]*)\]/g)) {
    for (const m of group[1].matchAll(/(?:^|[\s;(])-?@([\w:.#$%&+?<>~/-]*\w)/g)) {
      if (!keys.includes(m[1])) keys.push(m[1]);
    }
  }
  return keys;
}

const stripFrontmatter = (src) => src.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');

// Collects every citation key in a Markdown/MDX file into frontmatter.citeKeys
// (read back via render(entry).remarkPluginFrontmatter) and fails the build if a
// key is not defined in src/references.bib — rehype-citation would silently leave it.
export default function remarkCiteKeys() {
  return (_tree, file) => {
    const bib = readFileSync(resolve(process.cwd(), 'src/references.bib'), 'utf8');
    const known = new Set([...bib.matchAll(/@\w+\s*\{\s*([^,\s]+)\s*,/g)].map((m) => m[1]));
    const keys = extractCiteKeys(stripFrontmatter(String(file.value ?? '')));
    const unknown = keys.filter((k) => !known.has(k));
    if (unknown.length) {
      throw new Error(
        `Unknown citation key(s) ${unknown.map((k) => '@' + k).join(', ')} in ${file.path}. Add the entry to src/references.bib.`,
      );
    }
    file.data.astro ??= {};
    file.data.astro.frontmatter ??= {};
    file.data.astro.frontmatter.citeKeys = keys;
  };
}
