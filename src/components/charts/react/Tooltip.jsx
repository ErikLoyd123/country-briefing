import { COLORS } from '../../../lib/tokens.js';

// Shared tooltip card: a colored key beside ink-colored text.
export default function Tooltip({ title, rows }) {
  return (
    <div
      style={{
        background: COLORS.paper,
        border: `1px solid ${COLORS.rule}`,
        borderRadius: 6,
        padding: '8px 10px',
        boxShadow: '0 8px 24px -12px rgb(14 26 34 / 0.35)',
        fontSize: 13,
        color: COLORS.ink,
        minWidth: 150,
      }}
    >
      {title && <div style={{ color: COLORS.muted, marginBottom: 4 }}>{title}</div>}
      {rows.map((r) => (
        <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: r.color }} />
            {r.label}
          </span>
          <strong style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{r.value}</strong>
        </div>
      ))}
    </div>
  );
}
