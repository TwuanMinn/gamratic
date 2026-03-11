import type { Review } from '../types';
import { getScoreColor } from './ScoreBadge';

interface RatingDistributionChartProps {
  reviews: Review[];
}

export default function RatingDistributionChart({ reviews }: RatingDistributionChartProps) {
  // Count reviews per score (1-10)
  const counts = new Array(10).fill(0);
  const maxCount = reviews.reduce((max, r) => {
    counts[r.score - 1]++;
    return Math.max(max, counts[r.score - 1]);
  }, 0);

  return (
    <div>
      {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((score) => {
        const count = counts[score - 1];
        const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
        const color = getScoreColor(score * 10);

        return (
          <div
            key={score}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px',
            }}
          >
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '13px',
                width: '20px',
                textAlign: 'right',
                opacity: 0.6,
              }}
            >
              {score}
            </span>
            <div
              style={{
                flex: 1,
                height: '12px',
                background: '#ffffff06',
                borderRadius: '3px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: color,
                  borderRadius: '3px',
                  transition: 'width 0.3s ease',
                  opacity: 0.7,
                }}
              />
            </div>
            <span style={{ fontSize: '11px', opacity: 0.4, width: '18px', textAlign: 'right' }}>
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
