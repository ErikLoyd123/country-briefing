import { useMemo, useState } from 'react';
import NumberFlow from '@number-flow/react';
import { scoreAll } from '../../lib/scoring.js';
import { COLORS } from '../../lib/tokens.js';

const COUNTRIES = [
  { code: 'SG', name: 'Singapore' },
  { code: 'VN', name: 'Vietnam' },
];

// Interactive go / no-go: pick an industry preset or set each pillar's weight (0–5).
export default function ScoreTool({ scorecard }) {
  const { pillars, presets, bands } = scorecard;
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
    <div className="score-tool">
      <fieldset>
        <legend className="text-sm font-medium text-ink">Industry weighting</legend>
        <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Industry preset">
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={presetId === p.id}
              onClick={() => choosePreset(p)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                presetId === p.id ? 'border-ink bg-ink text-paper' : 'border-rule bg-paper text-ink hover:border-ink'
              }`}
            >
              {p.label}
            </button>
          ))}
          {presetId === 'custom' && (
            <span className="rounded-full border border-dashed border-ink px-4 py-2 text-sm text-ink">Custom</span>
          )}
        </div>
      </fieldset>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <p className="text-sm font-medium text-ink">How much each area matters</p>
          <p className="mt-1 text-sm text-muted">0 ignores an area; 5 makes it count five times as much as an area set to 1.</p>
          <div className="mt-6 space-y-6">
            {pillars.map((p) => (
              <div key={p.id}>
                <div className="flex items-baseline justify-between">
                  <label htmlFor={`w-${p.id}`} className="text-ink">
                    {p.label}
                  </label>
                  <span className="num text-sm text-muted">weight {weights[p.id]}</span>
                </div>
                <input
                  id={`w-${p.id}`}
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={weights[p.id]}
                  onChange={(e) => setWeight(p.id, Number(e.target.value))}
                  className="score-range mt-2 w-full"
                />
                <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                  {COUNTRIES.map((c) => (
                    <PillarBar key={c.code} country={c} value={scores[c.code].pillars[p.id]} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid content-start gap-6 sm:grid-cols-2">
          {COUNTRIES.map((c) => {
            const s = scores[c.code];
            const bandIndex = bands.indexOf(s.band);
            return (
              <div key={c.code} className="rounded-lg border border-rule bg-paper p-6" aria-live="polite">
                <p className="flex items-center gap-2 text-sm font-medium text-ink">
                  <span className="size-2.5 rounded-full" style={{ background: COLORS[c.code] }} />
                  {c.name}
                </p>
                <p className="num mt-4 text-6xl font-semibold tracking-tight text-ink">
                  <NumberFlow value={Number(s.overall.toFixed(2))} format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
                </p>
                <p className="text-sm text-muted">out of 5 risk</p>
                <p className="mt-4 font-display text-2xl leading-tight text-ink">{s.band.label}</p>
                <p className="mt-1 text-sm text-ink-2">{s.band.summary}</p>
                <ol className="mt-5 grid grid-cols-4 gap-1" aria-label="Verdict bands">
                  {bands.map((b, i) => (
                    <li
                      key={b.label}
                      className="h-1.5 rounded-full"
                      style={{ background: i === bandIndex ? COLORS[c.code] : COLORS.rule }}
                      title={`${b.label} (up to ${b.max})`}
                    />
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PillarBar({ country, value }) {
  const pct = ((value - 1) / 4) * 100;
  return (
    <div className="flex items-center gap-2" title={`${country.name}: ${value.toFixed(1)} out of 5`}>
      <span className="w-6 text-muted">{country.code}</span>
      <span className="relative h-1.5 flex-1 rounded-full" style={{ background: COLORS.paper2 }}>
        <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${Math.max(pct, 2)}%`, background: COLORS[country.code] }} />
      </span>
      <span className="num w-7 text-right text-ink">{value.toFixed(1)}</span>
    </div>
  );
}
