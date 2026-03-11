interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

function getScoreColor(score: number): string {
  if (score >= 90) return '#4ade80';
  if (score >= 75) return '#facc15';
  if (score >= 60) return '#fb923c';
  return '#f87171';
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Outstanding';
  if (score >= 75) return 'Great';
  if (score >= 60) return 'Good';
  return 'Mixed';
}

export default function ScoreBadge({ score, size = 'md' }: ScoreBadgeProps) {
  const color = getScoreColor(score);
  const sizeMap = { sm: 38, md: 56, lg: 72 };
  const fontMap = { sm: 15, md: 22, lg: 28 };
  const dim = sizeMap[size];

  return (
    <div
      title={`${getScoreLabel(score)} — ${score}/100`}
      style={{
        width: dim,
        height: dim,
        borderRadius: '50%',
        background: 'rgba(10, 10, 10, 0.85)',
        border: `2.5px solid ${color}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
        fontSize: fontMap[size],
        fontWeight: 700,
        color: '#ffffff',
        boxShadow: `0 0 18px ${color}40, 0 2px 8px rgba(0,0,0,0.5)`,
        flexShrink: 0,
        letterSpacing: '0.5px',
      }}
    >
      {score}
    </div>
  );
}

export { getScoreColor };
