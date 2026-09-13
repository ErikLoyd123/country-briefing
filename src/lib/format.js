// Pure formatting helpers — safe for React islands.

export const COUNTRY = {
  SG: { code: 'SG', name: 'Singapore', city: 'Singapore' },
  VN: { code: 'VN', name: 'Vietnam', city: 'Ho Chi Minh City' },
};

// The team's three-level read on a risk. step picks the shade from the --color-risk ramp.
export const RISK_LEVELS = {
  high: { label: 'Watch closely', step: 5, dark: true },
  mid: { label: 'Manage it', step: 3, dark: true },
  low: { label: 'Low, but real', step: 1, dark: false },
};

// The four areas of risk named in the assignment.
export const AREAS = {
  government: 'Government',
  society: 'Society',
  security: 'Security',
  economy: 'Economy',
};

export const riskAnchor = (title) =>
  'risk-' +
  title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 6)
    .join('-');
