import { ResponsiveLine } from '@nivo/line';
import { COLORS } from '../../../lib/tokens.js';
import { formatValue } from '../../../lib/format.js';
import { nivoTheme, COUNTRY_NAME } from './nivoTheme.js';
import Tooltip from './Tooltip.jsx';

// series: [{ id: 'SG' | 'VN', data: [{ x: year, y: value }] }]
// Ranks plot with #1 at the top (reversed scale).
export default function TrendLineChart({ series, unit, height = 320 }) {
  const isRank = unit === 'rank';
  const values = series.flatMap((s) => s.data.map((d) => d.y));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = (max - min) * 0.12 || 1;
  const yMin = isRank ? Math.max(1, Math.floor(min - pad)) : unit === 'percentile' ? Math.max(0, Math.floor(min - pad)) : Math.floor(min - pad);
  const yMax = unit === 'percentile' ? Math.min(100, Math.ceil(max + pad)) : Math.ceil(max + pad);

  const EndLabels = ({ series: computed }) => (
    <g>
      {computed.map((s) => {
        const last = s.data.at(-1).position;
        return (
          <g key={s.id} transform={`translate(${last.x + 10}, ${last.y})`}>
            <text dominantBaseline="middle" style={{ fontSize: 12, fill: COLORS.ink, fontWeight: 500 }}>
              {formatValue(s.data.at(-1).data.y, unit)}
            </text>
          </g>
        );
      })}
    </g>
  );

  return (
    <div style={{ height }}>
      <ResponsiveLine
        data={series}
        theme={nivoTheme}
        colors={(s) => COLORS[s.id]}
        margin={{ top: 16, right: 56, bottom: 36, left: 48 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: yMin, max: yMax, reverse: isRank }}
        curve="monotoneX"
        lineWidth={2}
        pointSize={8}
        pointColor={{ from: 'seriesColor' }}
        pointBorderWidth={2}
        pointBorderColor={COLORS.paper}
        enableGridX={false}
        gridYValues={5}
        axisLeft={{ tickValues: 5, tickSize: 0, tickPadding: 8, format: (v) => formatValue(v, unit) }}
        axisBottom={{ tickSize: 0, tickPadding: 10 }}
        enableSlices="x"
        sliceTooltip={({ slice }) => (
          <Tooltip
            title={slice.points[0].data.xFormatted}
            rows={[...slice.points]
              .sort((a, b) => a.seriesId.localeCompare(b.seriesId))
              .map((p) => ({ label: COUNTRY_NAME[p.seriesId], color: COLORS[p.seriesId], value: formatValue(p.data.y, unit) }))}
          />
        )}
        layers={['grid', 'axes', 'lines', 'crosshair', 'points', 'slices', EndLabels]}
        animate={false}
        role="img"
      />
    </div>
  );
}
