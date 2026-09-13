import { describe, it, expect } from 'vitest';
import { pillarScore, overallScore, bandFor, scoreAll } from '../src/lib/scoring.js';

const card = {
  pillars: [
    {
      id: 'government',
      factors: [
        { id: 'a', ratings: { SG: { score: 1 }, VN: { score: 3 } } },
        { id: 'b', ratings: { SG: { score: 2 }, VN: { score: 4 } } },
      ],
    },
    {
      id: 'security',
      factors: [{ id: 'c', ratings: { SG: { score: 1 }, VN: { score: 2 } } }],
    },
  ],
  bands: [
    { max: 2, label: 'Go' },
    { max: 3, label: 'Go with mitigations' },
    { max: 3.75, label: 'Proceed with caution' },
    { max: 5, label: 'No-go' },
  ],
};

describe('scoring', () => {
  it('pillar score is the mean of factor scores', () => {
    expect(pillarScore(card.pillars[0], 'VN')).toBe(3.5);
  });

  it('overall is the weighted mean of pillar scores', () => {
    expect(overallScore(card, { government: 3, security: 1 }, 'VN')).toBeCloseTo((3 * 3.5 + 1 * 2) / 4);
  });

  it('missing weights count as zero; all-zero weights fall back to equal weights', () => {
    expect(overallScore(card, { government: 1 }, 'SG')).toBe(1.5);
    expect(overallScore(card, { government: 0, security: 0 }, 'SG')).toBeCloseTo((1.5 + 1) / 2);
  });

  it('band boundaries are inclusive of max', () => {
    expect(bandFor(2, card.bands).label).toBe('Go');
    expect(bandFor(2.01, card.bands).label).toBe('Go with mitigations');
    expect(bandFor(5, card.bands).label).toBe('No-go');
  });

  it('scoreAll returns overall, band and pillar scores for both countries', () => {
    const r = scoreAll(card, { government: 1, security: 1 });
    expect(r.SG.pillars.government).toBe(1.5);
    expect(r.VN.overall).toBeCloseTo(2.75);
    expect(r.VN.band.label).toBe('Go with mitigations');
  });
});
