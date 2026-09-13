import { COLORS, FONTS } from '../../../lib/tokens.js';

// Recessive axes and hairline grid; text in ink tokens, never series colors.
export const nivoTheme = {
  background: 'transparent',
  text: { fontFamily: FONTS.sans, fontSize: 12, fill: COLORS.muted },
  axis: {
    domain: { line: { stroke: 'transparent' } },
    ticks: { line: { stroke: 'transparent' }, text: { fontFamily: FONTS.sans, fontSize: 12, fill: COLORS.muted } },
    legend: { text: { fontFamily: FONTS.sans, fontSize: 12, fill: COLORS.muted } },
  },
  grid: { line: { stroke: COLORS.grid, strokeWidth: 1 } },
  crosshair: { line: { stroke: COLORS.ink2, strokeWidth: 1, strokeOpacity: 0.5, strokeDasharray: '0' } },
  tooltip: { container: { background: 'transparent', padding: 0, boxShadow: 'none' } },
  labels: { text: { fontFamily: FONTS.sans, fontSize: 12, fill: COLORS.ink } },
};

export const COUNTRY_NAME = { SG: 'Singapore', VN: 'Vietnam' };
