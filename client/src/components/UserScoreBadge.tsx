import { getScoreColor } from './ScoreBadge';

interface UserScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function UserScoreBadge({ score, size = 'md' }: UserScoreBadgeProps) {
  const BLUE = '#60a5fa';
  const mapped = score * 10;
  const fallbackColor = getScoreColor(mapped);
  const color = mapped >= 70 ? BLUE : fallbackColor;

  const sizeMap = { sm: 38, md: 56, lg: 72 };
  const fontMap = { sm: 13, md: 18, lg: 24 };
  const dim = sizeMap[size];

  return (
    <div
      title={`User Score: ${score.toFixed(1)}/10`}
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
      }}
    >
      {score.toFixed(1)}
    </div>
  );
}
