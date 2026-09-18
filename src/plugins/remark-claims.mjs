// Turns claim citations in Markdown/MDX into APA in-text citations.
//   [@SG-17]            → (Singapore Elections Department, 2025)
//   [@SG-17; @VN-13]    → (Author A, 2025; Author B, 2026)
// Each claim ID must exist in the desk's src/data/<desk>/sources.csv; the build fails otherwise, and on anything
// else written as [@…] so a mistyped citation can't slip through as plain text. The desk comes from the file's
// folder: src/content/briefings/<desk>/…, src/content/appendices/<desk>/… or src/content/about/<desk>.mdx.
//
// The briefing's slides (src/content/briefings) brief rather than document: their citations are checked
// but not shown, and the text around them closes up. The Sources page carries the references.
import { visit, SKIP } from 'unist-util-visit';
import { loadIndex, citationPieces } from '../lib/sources.js';

const GROUP = /\[\s*(@[A-Z]{2,4}-\d+(?:\s*;\s*@[A-Z]{2,4}-\d+)*)\s*\]/g;
const LOOKS_LIKE_CITE = /\[[^\]]*@[^\]]*\]/;

export function citeNode(ids, index, where) {
  return {
    type: 'claimCitation',
    data: { hName: 'span', hProperties: { className: ['cite'], dataClaims: ids.join(' ') } },
    children: citationPieces(ids, index, where).map((p) =>
      p.href ? { type: 'link', url: p.href, title: p.title, children: [{ type: 'text', value: p.text }] } : { type: 'text', value: p.text },
    ),
  };
}

const HIDDEN = /[\\/]content[\\/]briefings[\\/]/;

const DESK_FILE = /[\\/]content[\\/](?:briefings[\\/]|appendices[\\/]|about[\\/])([a-z0-9-]+)(?=[\\/.])/;

export default function remarkClaims(options = {}) {
  return (tree, file) => {
    const where = file.path ?? 'a Markdown file';
    // Look the index up only when the file cites something, so files outside a desk need no sources table.
    let cached = options.index;
    const index = () => {
      if (cached) return cached;
      const desk = DESK_FILE.exec(where)?.[1];
      if (!desk) throw new Error(`${where} cites claims but is not in a desk's folder, so there is no sources table to check them against.`);
      return (cached = loadIndex(desk));
    };
    const hide = (options.hide ?? HIDDEN).test(where);
    visit(tree, 'text', (node, i, parent) => {
      if (!parent || !node.value.includes('@')) return;
      const out = [];
      let last = 0;
      let found = false;
      for (const m of node.value.matchAll(GROUP)) {
        if (m.index > last) out.push({ type: 'text', value: node.value.slice(last, m.index) });
        found = true;
        const ids = m[1].split(';').map((s) => s.trim().slice(1));
        const cite = citeNode(ids, index(), where);
        if (hide) {
          const prev = out.at(-1);
          if (prev?.type === 'text') prev.value = prev.value.replace(/\s+$/, '');
        } else out.push(cite);
        last = m.index + m[0].length;
      }
      const tail = node.value.slice(last);
      const stray = found ? out.filter((n) => n.type === 'text').map((n) => n.value).join(' ') + tail : node.value;
      if (LOOKS_LIKE_CITE.test(stray)) {
        throw new Error(`Citation "${LOOKS_LIKE_CITE.exec(stray)[0]}" in ${where} should cite claim IDs from the desk's sources.csv, like [@SG-12] or [@SG-12; @VN-3].`);
      }
      if (!found) return;
      if (tail) out.push({ type: 'text', value: tail });
      parent.children.splice(i, 1, ...out);
      return [SKIP, i + out.length];
    });
  };
}
