import { it, expect } from 'vitest';
import remarkClaims from '../src/plugins/remark-claims.mjs';
import { buildIndex, parseClaims } from '../src/lib/sources.js';

const index = buildIndex(
  parseClaims(
    [
      'ID,Screen,Country / company,Claim,Source (APA),Link,Retrieved,Verified by,Notes,Quote',
      'SG-1,x,Singapore,A.,"World Bank. (2025). Report. World Bank.",https://wb,,,,',
      'VN-2,x,Vietnam,B.,"Coface. (n.d.). Vietnam. Coface.",https://cf,,,,',
    ].join('\n'),
  ),
);

const paragraph = (value) => ({ type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', value }] }] });
const run = (value, path = 'test.mdx') => {
  const tree = paragraph(value);
  remarkClaims({ index })(tree, { path });
  return tree.children[0].children;
};
const flat = (nodes) => nodes.map((n) => (n.type === 'text' ? n.value : flat(n.children))).join('');

it('replaces claim citations with APA in-text citations linked to the sources page', () => {
  const nodes = run('Growth was fast [@SG-1; @VN-2]. Then [@SG-1] again.');
  expect(flat(nodes)).toBe('Growth was fast (Coface, n.d.; World Bank, 2025). Then (World Bank, 2025) again.');
  const cite = nodes.find((n) => n.type === 'claimCitation');
  expect(cite.data.hProperties.dataClaims).toBe('SG-1 VN-2');
  expect(cite.children.find((n) => n.type === 'link').url).toMatch(/^\/sources#ref-/);
});

it('leaves text without citations alone', () => {
  expect(run('Email me@example.com about it.')).toEqual([{ type: 'text', value: 'Email me@example.com about it.' }]);
});

it('fails on unknown claim IDs and on citations that are not claim IDs', () => {
  expect(() => run('Bad [@SG-99].')).toThrow(/SG-99 in test.mdx/);
  expect(() => run('Old style [@wb-wgi-2025].')).toThrow(/should cite claim IDs/);
});

it('checks but hides citations on the briefing slides, closing up the text around them', () => {
  const slides = '/repo/src/content/briefings/01-need-to-know/index.mdx';
  expect(flat(run('Growth was fast [@SG-1; @VN-2]. Then [@SG-1] again.', slides))).toBe('Growth was fast. Then again.');
  expect(flat(run('[@SG-1] leads.', slides))).toBe(' leads.');
  expect(() => run('Bad [@SG-99].', slides)).toThrow(/SG-99/);
});
