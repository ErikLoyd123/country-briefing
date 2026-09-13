import { ResponsiveRadar } from '@nivo/radar';
import { COLORS } from '../../../lib/tokens.js';
import { nivoTheme, COUNTRY_NAME } from './nivoTheme.js';
import Tooltip from './Tooltip.jsx';

// rows: [{ pillar: 'Government & Politics', SG: 1.3, VN: 3 }] on the 1–5 risk scale.
export default function RiskRadarChart({ rows, height = 360 }) {
  return (
    <div style={{ height }}>
      <ResponsiveRadar
        data={rows}
        keys={['SG', 'VN']}
        indexBy="pillar"
        maxValue={5}
        theme={nivoTheme}
        colors={({ key }) => COLORS[key]}
        margin={{ top: 28, right: 90, bottom: 28, left: 90 }}
        curve="linearClosed"
        gridShape="linear"
        gridLevels={5}
        borderWidth={2}
        borderColor={{ from: 'color' }}
        fillOpacity={0.1}
        dotSize={8}
        dotColor={{ from: 'color' }}
        dotBorderWidth={2}
        dotBorderColor={COLORS.paper}
        sliceTooltip={({ index, data }) => (
          <Tooltip
            title={index}
            rows={data.map((d) => ({ label: COUNTRY_NAME[d.id], color: COLORS[d.id], value: `${d.value.toFixed(1)} / 5` }))}
          />
        )}
        animate={false}
        role="img"
      />
    </div>
  );
}
