import TrendLineChart from '../charts/react/TrendLineChart.jsx';
import RiskRadarChart from '../charts/react/RiskRadarChart.jsx';
import AnimatedNumber from '../ui/AnimatedNumber.jsx';
import { formatValue, UNIT_LABEL } from '../../lib/format.js';
import { numberParts } from '../../lib/numberParts.js';
import { COLORS } from '../../lib/tokens.js';

// Scene components receive props already resolved at build time by src/pages/present.astro.
// Sizes use cqw (container query width of the 16:9 stage) so slides scale to any screen.

const Sample = ({ show }) =>
  show ? (
    <span className="rounded-full border border-sample/40 px-[0.8cqw] py-[0.2cqw] text-[1cqw] text-sample">Sample data</span>
  ) : null;

function Title({ kicker, title, subtitle }) {
  return (
    <div className="scene-dark flex h-full flex-col justify-end p-[6cqw]">
      <p className="text-[1.4cqw] text-on-night-muted">{kicker}</p>
      <h1 className="mt-[1cqw] max-w-[70cqw] font-display text-[6.2cqw] leading-[1.02]">{title}</h1>
      <p className="mt-[2cqw] max-w-[55cqw] font-display text-[2.2cqw] text-on-night/80">{subtitle}</p>
      <div className="mt-[4cqw] flex h-[0.5cqw] w-[12cqw] overflow-hidden rounded-full">
        <span className="w-1/2 bg-sg" />
        <span className="w-1/2 bg-vn" />
      </div>
    </div>
  );
}

function BigQuestion({ text }) {
  return (
    <div className="scene-dark flex h-full items-center p-[8cqw]">
      <p className="max-w-[75cqw] font-display text-[5.4cqw] leading-[1.08]">{text}</p>
    </div>
  );
}

function StatDuel({ label, unit, higherIsBetter, SG, VN, sample, takeaway, source }) {
  return (
    <div className="scene-light flex h-full flex-col p-[5cqw]">
      <div className="flex items-start justify-between gap-[2cqw]">
        <div>
          <h2 className="font-display text-[3.4cqw] leading-tight text-ink">{label}</h2>
          <p className="mt-[0.6cqw] text-[1.3cqw] text-muted">
            {UNIT_LABEL[unit]}, {higherIsBetter ? 'higher is better' : 'lower is better'}
          </p>
        </div>
        <Sample show={sample} />
      </div>
      <div className="mt-auto grid grid-cols-2 gap-[4cqw]">
        {[
          ['SG', 'Singapore', SG],
          ['VN', 'Vietnam', VN],
        ].map(([code, name, row]) => {
          const parts = numberParts(row.value, unit);
          return (
            <div key={code} className="border-t-[0.35cqw] pt-[1.5cqw]" style={{ borderColor: COLORS[code] }}>
              <p className="text-[1.6cqw] text-ink">
                {name}, {row.year}
              </p>
              <p className="num text-[11cqw] font-semibold leading-none tracking-tight text-ink">
                <AnimatedNumber {...parts} />
              </p>
            </div>
          );
        })}
      </div>
      <div className="mt-[3cqw] flex items-end justify-between gap-[2cqw]">
        <p className="max-w-[60cqw] font-display text-[2.2cqw] text-ink-2">{takeaway}</p>
        <p className="text-[1cqw] text-muted">{source}</p>
      </div>
    </div>
  );
}

function ChartScene({ title, subtitle, series, unit, sample, source }) {
  return (
    <div className="scene-light flex h-full flex-col p-[4.5cqw]">
      <div className="flex items-start justify-between gap-[2cqw]">
        <div>
          <h2 className="font-display text-[3.2cqw] leading-tight text-ink">{title}</h2>
          <p className="mt-[0.5cqw] text-[1.3cqw] text-muted">{subtitle}</p>
        </div>
        <div className="flex items-center gap-[1.6cqw] text-[1.3cqw] text-ink">
          <span className="flex items-center gap-[0.5cqw]"><span className="h-[0.25cqw] w-[2cqw] rounded bg-sg" />Singapore</span>
          <span className="flex items-center gap-[0.5cqw]"><span className="h-[0.25cqw] w-[2cqw] rounded bg-vn" />Vietnam</span>
          <Sample show={sample} />
        </div>
      </div>
      <div className="mt-[2cqw] min-h-0 flex-1">
        <TrendLineChart series={series} unit={unit} height="100%" />
      </div>
      <p className="mt-[1cqw] text-[1cqw] text-muted">{source}</p>
    </div>
  );
}

function MapScene({ title, text, map }) {
  const fill = (c) => (c === 'SG' ? COLORS.SG : c === 'VN' ? COLORS.VN : '#1f2f3a');
  return (
    <div className="scene-dark grid h-full grid-cols-[0.8fr_1.2fr] items-center gap-[3cqw] p-[5cqw]">
      <div>
        <h2 className="font-display text-[4.2cqw] leading-[1.05]">{title}</h2>
        <p className="mt-[2cqw] text-[1.7cqw] leading-relaxed text-on-night-muted">{text}</p>
      </div>
      <svg viewBox={`0 0 ${map.width} ${map.height}`} className="h-full max-h-[46cqw] w-full" role="img" aria-label="Map of Southeast Asia">
        <rect width={map.width} height={map.height} fill="#0e1a22" />
        {map.countries.map((c, i) => (
          <path key={i} d={c.d} fill={fill(c.country)} stroke="#34495a" strokeWidth="0.8" />
        ))}
        {map.lanes.map((l) => (
          <path key={l.name} className="lane" d={l.d} fill="none" stroke="#d6e1e4" strokeWidth="2" strokeDasharray="2 9" strokeLinecap="round" />
        ))}
        {map.cities.map((c) => (
          <g key={c.name}>
            <circle cx={c.xy[0]} cy={c.xy[1]} r="6" fill={COLORS[c.country]} stroke="#0e1a22" strokeWidth="2.5" />
            <text x={c.xy[0] + c.dx} y={c.xy[1] + c.dy} textAnchor={c.anchor} fontSize="20" fill="#eef1ee" stroke="#0e1a22" strokeWidth="4" paintOrder="stroke">
              {c.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function TimelineScene({ title, events }) {
  return (
    <div className="scene-light flex h-full flex-col p-[5cqw]">
      <h2 className="font-display text-[3.4cqw] text-ink">{title}</h2>
      <ol className="relative mt-auto grid grid-flow-col gap-[1.2cqw]" style={{ gridAutoColumns: '1fr' }}>
        <span className="absolute top-[0.55cqw] right-0 left-0 h-px bg-rule" aria-hidden="true" />
        {events.map((e) => (
          <li key={e.date + e.title} className="relative pt-[2.4cqw]">
            <span
              className="absolute top-0 left-0 size-[1.1cqw] rounded-full"
              style={{ background: e.country === 'SG' ? COLORS.SG : e.country === 'VN' ? COLORS.VN : COLORS.ink }}
            />
            <p className="num text-[1.1cqw] text-muted">{e.date}</p>
            <p className="mt-[0.4cqw] text-[1.25cqw] font-medium leading-snug text-ink">{e.title}</p>
          </li>
        ))}
      </ol>
      <p className="mt-[2cqw] flex gap-[2cqw] text-[1.2cqw] text-muted">
        <span><span className="mr-[0.4cqw] inline-block size-[0.8cqw] rounded-full bg-sg" />Singapore</span>
        <span><span className="mr-[0.4cqw] inline-block size-[0.8cqw] rounded-full bg-vn" />Vietnam</span>
        <span><span className="mr-[0.4cqw] inline-block size-[0.8cqw] rounded-full bg-ink" />Both</span>
      </p>
    </div>
  );
}

function ScorecardScene({ title, rows, sample }) {
  return (
    <div className="scene-light grid h-full grid-cols-[0.8fr_1.2fr] items-center gap-[3cqw] p-[5cqw]">
      <div>
        <h2 className="font-display text-[4cqw] leading-[1.05] text-ink">{title}</h2>
        <p className="mt-[1.5cqw] text-[1.5cqw] text-ink-2">Average rating per risk area, 1 very low to 5 very high.</p>
        <table className="mt-[2.5cqw] w-full text-[1.4cqw]">
          <tbody>
            {rows.map((r) => (
              <tr key={r.pillar} className="border-b border-rule">
                <th className="py-[0.6cqw] text-left font-normal text-ink">{r.pillar}</th>
                <td className="num py-[0.6cqw] text-right" style={{ color: COLORS.ink }}>{r.SG.toFixed(1)}</td>
                <td className="num py-[0.6cqw] text-right" style={{ color: COLORS.ink }}>{r.VN.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-[1.5cqw]"><Sample show={sample} /></div>
      </div>
      <div className="h-[40cqw]">
        <RiskRadarChart rows={rows} height="100%" />
      </div>
    </div>
  );
}

function Verdict({ title, scores, sample }) {
  return (
    <div className="scene-dark flex h-full flex-col p-[5cqw]">
      <div className="flex items-start justify-between">
        <h2 className="font-display text-[4cqw]">{title}</h2>
        <Sample show={sample} />
      </div>
      <div className="mt-auto grid grid-cols-2 gap-[5cqw]">
        {[
          ['SG', 'Singapore'],
          ['VN', 'Vietnam'],
        ].map(([code, name]) => (
          <div key={code} className="border-t-[0.35cqw] pt-[1.5cqw]" style={{ borderColor: COLORS[code] }}>
            <p className="text-[1.6cqw] text-on-night-muted">{name}</p>
            <p className="mt-[0.5cqw] font-display text-[5.6cqw] leading-none">{scores[code].band.label}</p>
            <p className="num mt-[1.2cqw] text-[1.8cqw] text-on-night-muted">
              <AnimatedNumber value={Number(scores[code].overall.toFixed(2))} decimals={2} /> out of 5 risk
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageScene({ label, caption }) {
  return (
    <div className="scene-dark relative flex h-full items-end">
      <div className="placeholder-stage absolute inset-0 flex items-start justify-end p-[3cqw] text-[1.3cqw] text-on-night-muted">{label}</div>
      <p className="relative m-[5cqw] max-w-[60cqw] font-display text-[3cqw] leading-tight">{caption}</p>
    </div>
  );
}

function Quote({ text, attribution }) {
  return (
    <div className="scene-dark flex h-full flex-col items-start justify-center p-[8cqw]">
      <p className="font-display text-[9cqw] leading-none">{text}</p>
      <p className="mt-[3cqw] text-[1.8cqw] text-on-night-muted">{attribution}</p>
    </div>
  );
}

export const SCENES = { Title, BigQuestion, StatDuel, ChartScene, MapScene, TimelineScene, ScorecardScene, Verdict, ImageScene, Quote };
