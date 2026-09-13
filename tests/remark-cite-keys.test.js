import { it, expect } from 'vitest';
import { extractCiteKeys } from '../src/plugins/remark-cite-keys.mjs';

it('finds keys inside brackets, including multi-cite and locators, deduplicated in order', () => {
  expect(extractCiteKeys('A [@k1, p. 3] b [see @k2; @k1] c email@x.com [@k3]')).toEqual(['k1', 'k2', 'k3']);
});

it('ignores bare @mentions and emails outside brackets', () => {
  expect(extractCiteKeys('ping @someone or me@example.com')).toEqual([]);
});

it('ignores emails inside brackets', () => {
  expect(extractCiteKeys('[contact me@example.com]')).toEqual([]);
});
