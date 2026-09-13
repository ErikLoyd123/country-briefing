// Go / no-go scoring. Pure functions — safe to import from React islands.
// pillar = mean(factor scores); overall = Σ(weight × pillar) / Σ(weight);
// band = first band whose max ≥ overall. Scale: 1 very low risk … 5 very high risk.

export const COUNTRIES = ['SG', 'VN'];

const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

export function pillarScore(pillar, country) {
  return mean(pillar.factors.map((f) => f.ratings[country].score));
}

export function overallScore(scorecard, weights, country) {
  let ws = scorecard.pillars.map((p) => Math.max(0, Number(weights?.[p.id] ?? 0)));
  if (ws.every((w) => w === 0)) ws = ws.map(() => 1);
  const total = ws.reduce((a, b) => a + b, 0);
  return scorecard.pillars.reduce((sum, p, i) => sum + ws[i] * pillarScore(p, country), 0) / total;
}

export function bandFor(score, bands) {
  return bands.find((b) => score <= b.max + 1e-9) ?? bands[bands.length - 1];
}

export function scoreAll(scorecard, weights) {
  return Object.fromEntries(
    COUNTRIES.map((c) => {
      const overall = overallScore(scorecard, weights, c);
      return [
        c,
        {
          overall,
          band: bandFor(overall, scorecard.bands),
          pillars: Object.fromEntries(scorecard.pillars.map((p) => [p.id, pillarScore(p, c)])),
        },
      ];
    }),
  );
}
