export type SignCode = 'Z283' | 'Z286';

interface VerkehrszeichenSignProps {
  code: SignCode;
  size?: number;
}

export function VerkehrszeichenSign({ code, size = 64 }: VerkehrszeichenSignProps): JSX.Element {
  const r = 44;
  const cx = 50;
  const cy = 50;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={code}>
      <defs>
        <clipPath id={`clip-${code}-${size}`}>
          <circle cx={cx} cy={cy} r={r - 1} />
        </clipPath>
      </defs>

      {/* Blue fill + clipped stripes */}
      <circle cx={cx} cy={cy} r={r} fill="#004a99" />
      <g clipPath={`url(#clip-${code}-${size})`}>
        {code === 'Z283' ? (
          <>
            <line x1="22" y1="22" x2="78" y2="78" stroke="#d52b1e" strokeWidth="9" strokeLinecap="butt" />
            <line x1="78" y1="22" x2="22" y2="78" stroke="#d52b1e" strokeWidth="9" strokeLinecap="butt" />
          </>
        ) : (
          <line x1="78" y1="14" x2="22" y2="86" stroke="#d52b1e" strokeWidth="9" strokeLinecap="butt" />
        )}
      </g>

      {/* Red border ring on top */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#d52b1e" strokeWidth="9" />
    </svg>
  );
}
