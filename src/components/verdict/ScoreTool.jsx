import { useMemo, useState } from 'react';
import NumberFlow from '@number-flow/react';
import { scoreAll } from '../../lib/scoring.js';

const COUNTRIES = [
  { code: 'SG', name: 'Singapore', dot: 'bg-sg', bar: 'bg-sg' },
  { code: 'VN', name: 'Vietnam', dot: 'bg-vn', bar: 'bg-vn' },
];

// Bars share one 0–5 scale; 2.75rem of each half is kept free for the value label.
const barWidth = (v) => `calc((100% - 2.75rem) * ${v / 5})`;

// Interactive go / no-go: pick an industry preset or set each pillar's weight (0–5).
// Laid out on the site's center seam: scores mirror either side of it, each area's weight
// control sits on it, and the area bars grow outward from it.
export default function ScoreTool({ scorecard }) {
  const { pillars, presets } = scorecard;
  const [presetId, setPresetId] = useState('balanced');
  const [weights, setWeights] = useState(() => ({ ...presets.find((p) => p.id === 'balanced').weights }));

  const scores = useMemo(() => scoreAll(scorecard, weights), [scorecard, weights]);

  const choosePreset = (p) => {
    setPresetId(p.id);
    setWeights({ ...p.weights });
  };
  const setWeight = (id, value) => {
    setPresetId('custom');
    setWeights((w) => ({ ...w, [id]: value }));
  };

  return (
    <div className="score-tool relative">
      <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-ink/15 md:block" aria-hidden="true" />

      <fieldset className="relative mx-auto w-fit bg-paper px-4 py-2 text-center">
        <legend className="sr-only">Industry weighting</legend>
        <p className="text-sm text-muted" aria-hidden="true">Industry weighting</p>
        <div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-1" role="radiogroup" aria-label="Industry preset">
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={presetId === p.id}
              onClick={() => choosePreset(p)}
              className={`border-b-2 py-1.5 transition-colors ${
                presetId === p.id ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              {p.label}
            </button>
          ))}
          {presetId === 'custom' && <span className="border-b-2 border-dashed border-ink py-1.5 text-ink">Custom</span>}
        </div>
      </fieldset>

      <div className="mt-12 grid grid-cols-2 md:mt-16">
        {COUNTRIES.map((c) => {
          const s = scores[c.code];
          const vn = c.code === 'VN';
          return (
            <div key={c.code} className={`min-w-0 ${vn ? 'pl-4 text-right md:pl-10' : 'pr-4 md:pr-10'}`} aria-live="polite">
              <p className={`flex items-center gap-2 font-medium text-ink ${vn ? 'justify-end' : ''}`}>
                <span className={`size-2.5 rounded-full ${c.dot}`} aria-hidden="true" />
                {c.name}
              </p>
              <p className="type-heavy num mt-2 text-[clamp(3.25rem,11vw,9rem)] leading-[0.9] text-ink">
                <span className="sr-only">Overall risk </span>
                <NumberFlow value={Number(s.overall.toFixed(2))} format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
                <span className="sr-only"> out of 5</span>
              </p>
              <p className="mt-4 font-display text-2xl leading-tight text-ink md:text-3xl">{s.band.label}</p>
              <p className={`mt-2 max-w-xs text-sm text-ink-2 md:text-base ${vn ? 'ml-auto' : ''}`}>{s.band.summary}</p>
            </div>
          );
        })}
      </div>

      <ul className="mx-auto mt-16 max-w-5xl space-y-8 md:mt-20">
        {pillars.map((p) => {
          const w = weights[p.id];
          const sg = scores.SG.pillars[p.id];
          const vn = scores.VN.pillars[p.id];
          return (
            <li key={p.id}>
              <div className="relative mx-auto flex w-fit flex-col items-center bg-paper px-4 text-center">
                <label htmlFor={`w-${p.id}`} className="text-sm text-ink md:text-base">
                  {p.label} <span className="num text-muted">weight {w}</span>
                </label>
                <input
                  id={`w-${p.id}`}
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={w}
                  aria-valuetext={`weight ${w}`}
                  onChange={(e) => setWeight(p.id, Number(e.target.value))}
                  className="score-range mt-1 w-44"
                />
                <span className="sr-only">Singapore {sg.toFixed(1)}, Vietnam {vn.toFixed(1)}</span>
              </div>
              <div className={`mt-2 grid grid-cols-2 gap-x-1.5 transition-opacity ${w === 0 ? 'opacity-30' : ''}`} aria-hidden="true">
                <div className="flex items-center justify-end gap-3" title={`Singapore, ${p.label}: ${sg.toFixed(1)} of 5`}>
                  <span className="num text-sm font-semibold text-ink">{sg.toFixed(1)}</span>
                  <span className="h-2.5 shrink-0 rounded-l bg-sg" style={{ width: barWidth(sg) }} />
                </div>
                <div className="flex items-center gap-3" title={`Vietnam, ${p.label}: ${vn.toFixed(1)} of 5`}>
                  <span className="h-2.5 shrink-0 rounded-r bg-vn" style={{ width: barWidth(vn) }} />
                  <span className="num text-sm font-semibold text-ink">{vn.toFixed(1)}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="relative mx-auto mt-10 w-fit bg-paper px-4 py-2 text-center text-sm text-muted">
        Area risk from 1, very low, to 5, very high. A weight of 0 leaves the area out.
      </p>
    </div>
  );
}
