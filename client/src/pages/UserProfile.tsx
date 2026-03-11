import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import type { User } from '../types';
import ScoreBadge from '../components/ScoreBadge';
import Footer from '../components/Footer';

function getInitials(username: string): string {
  return username.slice(0, 2).toUpperCase();
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const { data: user, loading } = useFetch<User>(id ? `/api/users/${id}` : null);

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ paddingTop: '120px', textAlign: 'center', flex: 1 }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#ffffff06', margin: '0 auto 16px', animation: 'shimmer 2s ease-in-out infinite' }} />
          <div style={{ width: '160px', height: '20px', background: '#ffffff06', borderRadius: '6px', margin: '0 auto 8px' }} />
          <div style={{ width: '100px', height: '14px', background: '#ffffff04', borderRadius: '6px', margin: '0 auto' }} />
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ paddingTop: '140px', textAlign: 'center', flex: 1, animation: 'fadeIn 0.5s ease-out' }}>
          <p style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.2 }}>👤</p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', opacity: 0.5 }}>User not found</h2>
        </div>
        <Footer />
      </div>
    );
  }

  const reviews = user.reviews || [];
  const avgScore = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length).toFixed(1)
    : '—';
  const totalHelpful = reviews.reduce((sum, r) => sum + (r.helpfulVotes || 0), 0);

  // Compute favorite genre from reviewed games
  const genreCount: Record<string, number> = {};
  reviews.forEach((r) => {
    if (r.game?.genres) {
      (Array.isArray(r.game.genres) ? r.game.genres : []).forEach((g: string) => {
        genreCount[g] = (genreCount[g] || 0) + 1;
      });
    }
  });
  const favoriteGenre = Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Profile hero */}
      <div
        style={{
          paddingTop: '90px',
          background: 'linear-gradient(180deg, #0f0f18 0%, #08080c 100%)',
          borderBottom: '1px solid #ffffff06',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 32px 36px', animation: 'fadeInUp 0.5s ease-out' }}>
          {/* Profile header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '28px' }}>
            <div
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #e8c060, #c9a227)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '34px',
                color: '#08080c',
                flexShrink: 0,
                boxShadow: '0 4px 20px #e8c06020',
              }}
            >
              {getInitials(user.username)}
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '36px',
                  letterSpacing: '2px',
                  background: 'linear-gradient(90deg, #f0f0f0, #e8c060)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {user.username}
              </h1>
              {user.bio && (
                <p style={{ fontSize: '14px', opacity: 0.6, marginTop: '4px' }}>{user.bio}</p>
              )}
              <p style={{ fontSize: '12px', opacity: 0.3, marginTop: '6px' }}>
                Joined {formatDate(user.joinedAt)}
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
            }}
          >
            {[
              { label: 'Reviews', value: reviews.length },
              { label: 'Avg Score', value: avgScore },
              { label: 'Helpful', value: totalHelpful },
              { label: 'Favorite Genre', value: favoriteGenre },
            ].map((stat, idx) => (
              <div
                key={stat.label}
                style={{
                  background: '#0e0e14',
                  borderRadius: '12px',
                  border: '1px solid #ffffff08',
                  padding: '16px',
                  textAlign: 'center',
                  animation: 'fadeInUp 0.4s ease-out both',
                  animationDelay: `${0.1 + idx * 0.08}s`,
                }}
              >
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: '#e8c060', marginBottom: '4px' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '11px', opacity: 0.35, textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review history */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '36px 32px 64px', width: '100%', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '22px',
              letterSpacing: '2px',
              background: 'linear-gradient(90deg, #e8c060, #f0d890)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Review History
          </h2>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #e8c06030, transparent)' }} />
        </div>

        {reviews.length > 0 ? (
          reviews.map((review, idx) => (
            <Link
              key={review.id}
              to={`/games/${review.gameId}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  background: '#0e0e14',
                  borderRadius: '14px',
                  border: '1px solid #ffffff08',
                  padding: '16px',
                  marginBottom: '12px',
                  animation: 'fadeInUp 0.4s ease-out both',
                  animationDelay: `${idx * 0.05}s`,
                  transition: 'border-color 0.2s, background 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#e8c06020'; e.currentTarget.style.background = '#0f0f15'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#ffffff08'; e.currentTarget.style.background = '#0e0e14'; }}
              >
                {/* Game cover thumbnail */}
                {review.game?.coverImage && (
                  <div style={{ width: '64px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                    <img
                      src={review.game.coverImage}
                      alt={review.game.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div>
                      <span style={{ fontWeight: 'bold', fontSize: '15px' }}>
                        {review.game?.title || `Game #${review.gameId}`}
                      </span>
                      <span style={{ opacity: 0.3, fontSize: '12px', marginLeft: '10px' }}>
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <ScoreBadge score={review.score * 10} size="sm" />
                  </div>
                  <p style={{ fontSize: '13px', lineHeight: 1.6, opacity: 0.6, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                    {review.body}
                  </p>
                  {review.helpfulVotes > 0 && (
                    <p style={{ fontSize: '11px', opacity: 0.3, marginTop: '6px' }}>
                      👍 {review.helpfulVotes} found this helpful
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '48px', background: '#0e0e14', borderRadius: '14px', border: '1px solid #ffffff08' }}>
            <p style={{ fontSize: '36px', marginBottom: '8px', opacity: 0.15 }}>📝</p>
            <p style={{ opacity: 0.3, fontSize: '14px' }}>No reviews yet</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
