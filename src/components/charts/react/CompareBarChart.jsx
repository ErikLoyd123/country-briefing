import { ResponsiveBar } from '@nivo/bar';
import { COLORS } from '../../../lib/tokens.js';
import { formatValue } from '../../../lib/format.js';
import { nivoTheme, COUNTRY_NAME } from './nivoTheme.js';
import Tooltip from './Tooltip.jsx';

// rows: [{ label: 'Rule of law', SG: 95, VN: 52 }] — horizontal grouped bars, one group per indicator.
export default function CompareBarChart({ rows, unit, max }) {
  const barThickness = 22;
  const groupGap = 26;
  const height = rows.length * (barThickness * 2 + 2 + groupGap) + 40;

  return (
    <div style={{ height }}>
      <ResponsiveBar
        data={[...rows].reverse()}
        keys={['SG', 'VN']}
        indexBy="label"
        groupMode="grouped"
        layout="horizontal"
        theme={nivoTheme}
        colors={({ id }) => COLORS[id]}
        margin={{ top: 4, right: 64, bottom: 28, left: 150 }}
        padding={groupGap / (barThickness * 2 + 2 + groupGap)}
        innerPadding={2}
        valueScale={{ type: 'linear', min: 0, max: max ?? 'auto' }}
        borderRadius={4}
        enableGridX
        enableGridY={false}
        gridXValues={5}
        axisLeft={{ tickSize: 0, tickPadding: 12 }}
        axisBottom={{ tickValues: 5, tickSize: 0, tickPadding: 8, format: (v) => formatValue(v, unit) }}
        enableLabel
        label={(d) => formatValue(d.value, unit)}
        labelPosition="end"
        labelOffset={8}
        labelTextColor={COLORS.ink}
        labelSkipWidth={0}
        tooltip={({ indexValue, data }) => (
          <Tooltip
            title={indexValue}
            rows={['SG', 'VN'].map((c) => ({ label: COUNTRY_NAME[c], color: COLORS[c], value: formatValue(data[c], unit) }))}
          />
        )}
        animate={false}
        role="img"
      />
    </div>
  );
}
