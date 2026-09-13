import { csvParse } from 'd3-dsv';

// Parses src/data/indicators.csv (long format: indicator,country,year,value,sample).
// Throws with the CSV line number so teammates can find the bad row.
export function parseIndicatorRows(text) {
  return csvParse(text.trim()).map((r, i) => {
    const line = i + 2;
    if (!['SG', 'VN'].includes(r.country)) {
      throw new Error(`indicators.csv line ${line}: country must be SG or VN, got "${r.country}"`);
    }
    const year = Number(r.year);
    const value = Number(r.value);
    if (!Number.isInteger(year)) {
      throw new Error(`indicators.csv line ${line}: year "${r.year}" is not an integer`);
    }
    if (r.value === undefined || r.value.trim() === '' || Number.isNaN(value)) {
      throw new Error(`indicators.csv line ${line}: value "${r.value}" is not a number`);
    }
    return {
      indicator: r.indicator.trim(),
      country: r.country,
      year,
      value,
      sample: String(r.sample).trim() === 'true',
    };
  });
}
