import { it, expect } from 'vitest';
import rehypeFrames from '../src/plugins/rehype-frames.mjs';

const el = (tagName, text = '') => ({ type: 'element', tagName, properties: {}, children: [{ type: 'text', value: text }] });
const jsx = (name) => ({ type: 'mdxJsxFlowElement', name, attributes: [], children: [] });
const nl = () => ({ type: 'text', value: '\n' });
const BRIEFING = { path: '/repo/src/content/briefings/01-x/index.mdx' };

// Each frame as a list of its non-blank children, named by tag or component.
const frames = (tree) =>
  tree.children.map((n) => (n.tagName === 'section' ? n.children.filter((c) => c.type !== 'text').map((c) => c.tagName ?? c.name) : n.type));

const run = (children, file = BRIEFING) => {
  const tree = { type: 'root', children };
  rehypeFrames()(tree, file);
  return tree;
};

it('groups prose, gives visuals their own frame, and starts a frame at each heading', () => {
  const tree = run([jsx('Lorem'), nl(), el('p'), jsx('TrendLine'), el('p'), el('h3'), el('p'), el('ul'), jsx('Callout'), jsx('HintCards')]);
  expect(frames(tree)).toEqual([['Lorem', 'p'], ['TrendLine'], ['p'], ['h3', 'p', 'ul'], ['Callout'], ['HintCards']]);
});

it('keeps a visual with the heading directly above it, and stacked headings together', () => {
  const tree = run([el('h2'), el('h3'), jsx('RegionMap'), el('p')]);
  expect(frames(tree)).toEqual([['h2', 'h3', 'RegionMap'], ['p']]);
});

it('leaves module code outside frames', () => {
  const tree = run([{ type: 'mdxjsEsm', value: 'export const x = 1' }, el('p')]);
  expect(frames(tree)).toEqual(['mdxjsEsm', ['p']]);
});

it('only frames briefing files', () => {
  const tree = run([el('p'), jsx('TrendLine')], { path: '/repo/src/content/paper/executive-summary.mdx' });
  expect(tree.children.map((n) => n.tagName ?? n.name)).toEqual(['p', 'TrendLine']);
});
