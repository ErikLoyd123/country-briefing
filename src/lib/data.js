// Build-time only. Loads indicators.yaml + indicators.csv once and validates them.
import metaRaw from '../data/indicators.yaml?raw';
import csvRaw from '../data/indicators.csv?raw';
import { parseIndicatorRows } from './csv.js';
import { loadYaml } from './yaml.js';
import { bibKeys } from './bib.js';

const UNITS = ['score', 'rank', 'percentile', 'usd_bn', 'per_100k', 'percent', 'index', 'years'];

export function validateIndicatorData(metaList, rows, knownBibKeys) {
  const ids = new Set();
  for (const m of metaList) {
    if (!m.id || !m.label) throw new Error(`indicators.yaml: every indicator needs id and label (${JSON.stringify(m)})`);
    if (m.unit && !UNITS.includes(m.unit)) throw new Error(`indicators.yaml: "${m.id}" has unknown unit "${m.unit}" (use ${UNITS.join(', ')})`);
    if (!knownBibKeys.has(m.sourceKey)) {
      throw new Error(`indicators.yaml: "${m.id}" sourceKey "${m.sourceKey}" is not in src/references.bib`);
    }
    ids.add(m.id);
  }
  const seen = new Set();
  for (const r of rows) {
    if (!ids.has(r.indicator)) throw new Error(`indicators.csv: row uses unknown indicator "${r.indicator}" (add it to indicators.yaml)`);
    const k = `${r.indicator}/${r.country}/${r.year}`;
    if (seen.has(k)) throw new Error(`indicators.csv: duplicate row for ${k}`);
    seen.add(k);
  }
  for (const id of ids) {
    if (!rows.some((r) => r.indicator === id)) throw new Error(`indicators.csv: indicator "${id}" has no rows`);
  }
}

const metaList = loadYaml(metaRaw, 'src/data/indicators.yaml');
const allRows = parseIndicatorRows(csvRaw);
validateIndicatorData(metaList, allRows, bibKeys());

const metaById = new Map(metaList.map((m) => [m.id, m]));

export function getIndicator(id) {
  const m = metaById.get(id);
  if (!m) throw new Error(`Unknown indicator "${id}". Known: ${[...metaById.keys()].join(', ')}`);
  return m;
}

export function getSeries(id) {
  const meta = getIndicator(id);
  const rows = allRows.filter((r) => r.indicator === id).sort((a, b) => a.year - b.year);
  return { meta, rows, sample: rows.some((r) => r.sample) };
}

export function getLatest(id) {
  const { meta, rows } = getSeries(id);
  const latest = (c) => rows.filter((r) => r.country === c).at(-1) ?? null;
  const SG = latest('SG');
  const VN = latest('VN');
  return { meta, SG, VN, sample: Boolean(SG?.sample || VN?.sample) };
}

export const allIndicators = () => metaList;
