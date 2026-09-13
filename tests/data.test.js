import { it, expect } from 'vitest';
import { validateIndicatorData, getSeries, getLatest, getIndicator } from '../src/lib/data.js';

const meta = [{ id: 'a', label: 'A', unit: 'score', higherIsBetter: true, sourceKey: 'k' }];
const row = (over) => ({ indicator: 'a', country: 'SG', year: 2020, value: 1, sample: true, ...over });

it('throws when a row references an unknown indicator', () => {
  expect(() => validateIndicatorData(meta, [row({ indicator: 'zzz' })], new Set(['k']))).toThrow(/zzz/);
});

it('throws when sourceKey is not in the bibliography', () => {
  expect(() => validateIndicatorData(meta, [row()], new Set())).toThrow(/sourceKey/);
});

it('throws when an indicator has no rows', () => {
  expect(() => validateIndicatorData(meta, [], new Set(['k']))).toThrow(/no rows/);
});

it('throws on duplicate indicator/country/year rows', () => {
  expect(() => validateIndicatorData(meta, [row(), row()], new Set(['k']))).toThrow(/duplicate/i);
});

it('loads the real data files: series sorted by year, latest per country, sample flag', () => {
  const s = getSeries('cpi_score');
  expect(s.meta.label).toMatch(/Corruption/);
  const years = s.rows.filter((r) => r.country === 'SG').map((r) => r.year);
  expect(years).toEqual([...years].sort((x, y) => x - y));
  const latest = getLatest('cpi_score');
  expect(latest.SG.year).toBe(Math.max(...years));
  expect(latest.sample).toBe(true);
});

it('getIndicator throws for unknown ids', () => {
  expect(() => getIndicator('nope')).toThrow(/Unknown indicator "nope"/);
});

import { scorecard, balancedScores, scorecardCiteKeys } from '../src/lib/scorecard.js';
import { credits } from '../src/lib/credits.js';

it('loads and validates the scorecard with a balanced preset', () => {
  expect(scorecard.pillars.map((p) => p.id)).toEqual(['government', 'society', 'security', 'economy']);
  const s = balancedScores();
  expect(s.SG.overall).toBeGreaterThanOrEqual(1);
  expect(s.VN.overall).toBeLessThanOrEqual(5);
  expect(scorecardCiteKeys().length).toBeGreaterThan(0);
});

it('parses credits.yaml into an array', () => {
  expect(Array.isArray(credits)).toBe(true);
});
