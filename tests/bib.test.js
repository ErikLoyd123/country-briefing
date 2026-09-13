import { it, expect } from 'vitest';
import { parseBibKeys, formatBibliography } from '../src/lib/bib.js';

it('extracts entry keys in order', () => {
  expect([...parseBibKeys('@misc{sample-a,\n title={x}}\n@article{ b2 , title={y}}')]).toEqual(['sample-a', 'b2']);
});

it('formats APA entries for the given keys only', async () => {
  const html = await formatBibliography(['sample-ti-cpi']);
  expect(html).toContain('csl-entry');
  expect(html).toContain('Transparency International');
  expect(html).not.toContain('World Bank');
});

it('returns an empty string for no keys', async () => {
  expect(await formatBibliography([])).toBe('');
});

import { formatInText } from '../src/lib/bib.js';

it('formats an APA in-text citation for one or more keys', async () => {
  expect(await formatInText(['sample-ti-cpi'])).toBe('(Transparency International, 2026)');
  expect(await formatInText(['sample-ti-cpi', 'sample-wb-wgi'])).toMatch(/^\(Transparency International, 2026; World Bank, 2025\)$/);
});

it('returns empty string when there are no keys', async () => {
  expect(await formatInText([])).toBe('');
});
