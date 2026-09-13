// Pure formatting helpers — safe for React islands.

export const COUNTRY = {
  SG: { code: 'SG', name: 'Singapore', city: 'Singapore' },
  VN: { code: 'VN', name: 'Vietnam', city: 'Ho Chi Minh City' },
};

export const RISK_LABELS = { 1: 'Very low', 2: 'Low', 3: 'Moderate', 4: 'High', 5: 'Very high' };

export function formatValue(value, unit) {
  if (value === null || value === undefined) return '—';
  switch (unit) {
    case 'rank':
      return `#${Math.round(value)}`;
    case 'percent':
      return `${Math.round(value)}%`;
    case 'percentile':
      return `${Math.round(value)}th`;
    case 'usd_bn':
      return `$${value.toFixed(value >= 100 ? 0 : 1)}B`;
    case 'per_100k':
      return value.toFixed(1);
    case 'index':
      return value.toFixed(3);
    case 'years':
      return `${value.toFixed(1)} yrs`;
    default:
      return Number.isInteger(value) ? String(value) : value.toFixed(1);
  }
}

export const UNIT_LABEL = {
  score: 'score',
  rank: 'global rank',
  percentile: 'percentile',
  usd_bn: 'US$ billions',
  per_100k: 'per 100,000',
  percent: '% of GDP',
  index: 'index (0–1)',
  years: 'years',
};
