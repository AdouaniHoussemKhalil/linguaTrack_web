interface ScoreRingProps {
  /** Score sur 100 ; `null` affiche « – ». */
  score: number | null;
  size?: number | undefined;
  label?: string | undefined;
}

const strokeClass = (score: number) =>
  score >= 80 ? "stroke-success-9" : score >= 50 ? "stroke-warning-9" : "stroke-danger-9";

/** Jauge circulaire du score /100, colorée selon le niveau (QuickadUI n'a pas de jauge). */
export const ScoreRing = ({ score, size = 112, label = "Score" }: ScoreRingProps) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const value = score === null ? 0 : Math.min(Math.max(score, 0), 100);

  return (
    <div
      role="img"
      aria-label={score === null ? `${label} indisponible` : `${label} : ${Math.round(value)} sur 100`}
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} className="stroke-neutral-4" />
        {score !== null && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - value / 100)}
            className={`transition-[stroke-dashoffset] duration-500 ${strokeClass(value)}`}
          />
        )}
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="text-2xl font-bold text-neutral-12">{score === null ? "–" : Math.round(value)}</span>
        <span className="mt-1 text-xs text-neutral-11">/100</span>
      </div>
    </div>
  );
};
