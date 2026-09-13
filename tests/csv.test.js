import { it, expect } from 'vitest';
import { parseIndicatorRows } from '../src/lib/csv.js';

const header = 'indicator,country,year,value,sample\n';

it('parses typed rows', () => {
  const rows = parseIndicatorRows(`${header}cpi_score,SG,2024,84,true\n`);
  expect(rows).toEqual([{ indicator: 'cpi_score', country: 'SG', year: 2024, value: 84, sample: true }]);
});

it('treats anything other than "true" as not sample', () => {
  expect(parseIndicatorRows(`${header}cpi_score,VN,2024,40,false\n`)[0].sample).toBe(false);
});

it('rejects an unknown country with the line number', () => {
  expect(() => parseIndicatorRows(`${header}x,TH,2024,1,false\n`)).toThrow(/line 2.*country/);
});

it('rejects a non-numeric value', () => {
  expect(() => parseIndicatorRows(`${header}x,SG,2024,abc,false\n`)).toThrow(/value/);
});
