import { useFetch } from '../hooks/useFetch';
import { useInView } from '../hooks/useInView';
import AnimatedCounter from './AnimatedCounter';

interface StatsData {
  totalGames: number;
  totalReviews: number;
  avgScore: number;
  activeReviewers: number;
}

export default function CommunityStats() {
  const { data } = useFetch<StatsData>('/api/stats');
  const { ref, inView } = useInView({ threshold: 0.05 });

  if (!data) return null;

  const stats = [
    { label: 'Games', value: data.totalGames, icon: '🎮', suffix: '' },
    { label: 'Reviews', value: data.totalReviews, icon: '📝', suffix: '' },
    { label: 'Avg Score', value: data.avgScore, icon: '⭐', suffix: '', decimals: 1 },
    { label: 'Reviewers', value: data.activeReviewers, icon: '👥', suffix: '' },
  ];

  return (
    <section
      ref={ref}
      style={{
        maxWidth: '1200px',
        margin: '40px auto 0',
        padding: '0 32px',
        position: 'relative',
        zIndex: 2,
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1px',
          background: '#e8c06010',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid #e8c06015',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 0 60px #e8c06008',
        }}
      >
        {stats.map((stat, idx) => (
          <div
            key={stat.label}
            style={{
              background: 'rgba(14, 14, 20, 0.95)',
              backdropFilter: 'blur(20px)',
              padding: '28px 20px',
              textAlign: 'center',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${0.1 + idx * 0.1}s`,
            }}
          >
            <div style={{ fontSize: '22px', marginBottom: '8px' }}>{stat.icon}</div>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '36px',
                letterSpacing: '2px',
                background: 'linear-gradient(135deg, #e8c060, #f0d890)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '4px',
              }}
            >
              <AnimatedCounter
                target={stat.value}
                inView={inView}
                suffix={stat.suffix}
                decimals={stat.decimals || 0}
              />
            </div>
            <div
              style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                opacity: 0.4,
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
