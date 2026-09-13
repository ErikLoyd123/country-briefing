// Build-time only. Loads and validates src/data/scorecard.yaml.
import raw from '../data/scorecard.yaml?raw';
import { loadYaml } from './yaml.js';
import { bibKeys } from './bib.js';
import { COUNTRIES, scoreAll } from './scoring.js';

const PILLARS = ['government', 'society', 'security', 'economy'];

function validate(card, known) {
  const fail = (msg) => {
    throw new Error(`scorecard.yaml: ${msg}`);
  };
  if (!Array.isArray(card.pillars) || card.pillars.length === 0) fail('needs pillars');
  for (const p of card.pillars) {
    if (!PILLARS.includes(p.id)) fail(`unknown pillar "${p.id}" (use ${PILLARS.join(', ')})`);
    if (!p.factors?.length) fail(`pillar "${p.id}" has no factors`);
    for (const f of p.factors) {
      for (const c of COUNTRIES) {
        const r = f.ratings?.[c];
        if (!r) fail(`factor "${f.id}" is missing a ${c} rating`);
        if (!Number.isInteger(r.score) || r.score < 1 || r.score > 5) fail(`factor "${f.id}" ${c} score must be an integer 1–5`);
        for (const k of r.cite ?? []) if (!known.has(k)) fail(`factor "${f.id}" ${c} cites unknown key "${k}"`);
      }
    }
  }
  if (!card.presets?.some((p) => p.id === 'balanced')) fail('needs a "balanced" preset');
  const maxes = card.bands.map((b) => b.max);
  if (maxes.some((m, i) => i > 0 && m <= maxes[i - 1]) || maxes.at(-1) < 5) {
    fail('bands must have increasing max values ending at 5');
  }
  return card;
}

export const scorecard = validate(loadYaml(raw, 'src/data/scorecard.yaml'), bibKeys());

export const balancedWeights = scorecard.presets.find((p) => p.id === 'balanced').weights;

export const balancedScores = () => scoreAll(scorecard, balancedWeights);

export const scorecardCiteKeys = () => [
  ...new Set(scorecard.pillars.flatMap((p) => p.factors.flatMap((f) => COUNTRIES.flatMap((c) => f.ratings[c].cite ?? [])))),
];
