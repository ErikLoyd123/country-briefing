// Splits a formatted indicator value into prefix / number / suffix for AnimatedNumber.
export function numberParts(value, unit) {
  switch (unit) {
    case 'rank':
      return { prefix: '#', value: Math.round(value), decimals: 0, suffix: '' };
    case 'percent':
      return { prefix: '', value: Math.round(value), decimals: 0, suffix: '%' };
    case 'percentile':
      return { prefix: '', value: Math.round(value), decimals: 0, suffix: 'th' };
    case 'usd_bn':
      return { prefix: '$', value, decimals: value >= 100 ? 0 : 1, suffix: 'B' };
    case 'index':
      return { prefix: '', value, decimals: 3, suffix: '' };
    case 'years':
      return { prefix: '', value, decimals: 1, suffix: '' };
    case 'per_100k':
      return { prefix: '', value, decimals: 1, suffix: '' };
    default:
      return { prefix: '', value, decimals: Number.isInteger(value) ? 0 : 1, suffix: '' };
  }
}
