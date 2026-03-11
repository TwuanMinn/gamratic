import { Link } from 'react-router-dom';
import type { Game } from '../types';
import ScoreBadge from './ScoreBadge';
import UserScoreBadge from './UserScoreBadge';
import { useParallax } from '../hooks/useParallax';

interface HeroBannerProps {
  game: Game;
  compact?: boolean;
}

export default function HeroBanner({ game, compact = false }: HeroBannerProps) {
  const height = compact ? '340px' : '560px';
  const parallaxOffset = useParallax(compact ? 0.15 : 0.3);

  return (
    <div
      style={{
        width: '100%',
        height,
        background: game.coverGradient,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Cover image with parallax */}
      {game.coverImage && (
        <img
          src={game.coverImage}
          alt={game.title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '120%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
            transform: `translateY(-${parallaxOffset}px)`,
            willChange: 'transform',
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}

      {/* Horizontal gradient — GameVault style: opaque left, transparent right */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(
            90deg,
            #08080c 0%,
            #08080ce6 35%,
            #08080c80 55%,
            ${game.accentColor || '#e8c060'}10 100%
          )`,
        }}
      />

      {/* Bottom edge fade */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(0deg, #08080c, transparent)',
        }}
      />

      {/* Subtle noise texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: compact ? '28px 40px' : '0 64px',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          animation: 'fadeInUp 0.7s ease-out',
        }}
      >
        <div style={{ maxWidth: '650px' }}>
          {/* Featured badge */}
          {!compact && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '16px',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#e8c060" stroke="none">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/>
              </svg>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '3px',
                  color: '#e8c060',
                  textTransform: 'uppercase',
                }}
              >
                Featured Game
              </span>
            </div>
          )}

          {/* Subtitle */}
          <span
            style={{
              display: compact ? 'inline-block' : 'none',
              fontSize: '11px',
              fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
              letterSpacing: '2px',
              color: '#e8c060',
              opacity: 0.7,
              marginBottom: '8px',
            }}
          >
            {game.releaseYear} • {game.developer}
          </span>

          {/* Title — massive condensed */}
          <h1
            style={{
              fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
              fontSize: compact ? '40px' : '80px',
              letterSpacing: compact ? '3px' : '2px',
              lineHeight: 0.95,
              marginBottom: compact ? '14px' : '20px',
              textShadow: '0 4px 30px rgba(0,0,0,0.6)',
              color: '#fff',
            }}
          >
            {game.title}
          </h1>

          {/* Description */}
          {!compact && (
            <p
              style={{
                fontSize: '16px',
                lineHeight: 1.7,
                color: '#999',
                marginBottom: '32px',
                maxWidth: '520px',
              }}
            >
              {game.description}
            </p>
          )}

          {/* Score badges — circular with labels */}
          <div style={{ display: 'flex', alignItems: 'center', gap: compact ? '14px' : '24px', marginBottom: compact ? '0' : '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <ScoreBadge score={game.criticScore} size={compact ? 'md' : 'lg'} />
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  color: '#666',
                  textTransform: 'uppercase',
                }}
              >
                Critic
              </span>
            </div>
            {game.userScore > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <UserScoreBadge score={game.userScore} size={compact ? 'md' : 'lg'} />
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    color: '#666',
                    textTransform: 'uppercase',
                  }}
                >
                  Users
                </span>
              </div>
            )}
            {/* Metadata separator */}
            <div
              style={{
                borderLeft: '1px solid #ffffff15',
                paddingLeft: compact ? '12px' : '20px',
                marginLeft: '4px',
              }}
            >
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#ccc', marginBottom: '2px' }}>{game.developer}</p>
              <p style={{ fontSize: '12px', color: '#666' }}>
                {game.releaseYear} • {game.platforms.slice(0, 3).join(', ')}
              </p>
            </div>
          </div>

          {/* CTA */}
          {!compact && (
            <Link
              to={`/games/${game.id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: '#e8c060',
                color: '#08080c',
                padding: '14px 36px',
                borderRadius: '4px',
                fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                fontSize: '18px',
                letterSpacing: '2px',
                textDecoration: 'none',
                fontWeight: 700,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.04)';
                e.currentTarget.style.boxShadow = '0 8px 30px #e8c06040';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              VIEW GAME
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>
          )}

          {compact && (
            <p
              style={{
                fontSize: '15px',
                lineHeight: 1.7,
                opacity: 0.6,
                maxWidth: '560px',
              }}
            >
              {game.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
