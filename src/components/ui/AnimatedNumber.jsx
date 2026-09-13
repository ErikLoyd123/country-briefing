import { useEffect, useState } from 'react';
import NumberFlow from '@number-flow/react';

// Counts up from zero once hydrated (use with client:visible). NumberFlow honours
// prefers-reduced-motion by default, so reduced-motion users see the value directly.
export default function AnimatedNumber({ value, decimals = 0, prefix = '', suffix = '', className }) {
  const [shown, setShown] = useState(value);

  useEffect(() => {
    setShown(0);
    const id = requestAnimationFrame(() => setShown(value));
    return () => cancelAnimationFrame(id);
  }, [value]);

  return (
    <NumberFlow
      className={className}
      value={shown}
      prefix={prefix}
      suffix={suffix}
      format={{ minimumFractionDigits: decimals, maximumFractionDigits: decimals }}
    />
  );
}
