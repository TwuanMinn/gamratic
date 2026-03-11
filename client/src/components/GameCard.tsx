import { Link } from 'react-router-dom';
import type { Game } from '../types';
import ScoreBadge from './ScoreBadge';
import UserScoreBadge from './UserScoreBadge';
import { getUniquePlatformIcons } from './PlatformIcons';
import { useState } from 'react';

interface GameCardProps {
  game: Game;
}

/** Pick a gradient tint based on game accent or genre */
function getCardGradient(game: Game): string {
  const accent = game.accentColor || '#ff9d33';
  return `linear-gradient(135deg, ${accent}15 0%, transparent 100%)`;
}

export default function GameCard({ game }: GameCardProps) {
  const [hovered, setHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const isMustPlay = game.criticScore >= 95;
  const platformIcons = getUniquePlatformIcons(game.platforms);

  return (
    <Link
      to={`/games/${game.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          background: '#0e0e14',
          borderRadius: '10px',
          overflow: 'hidden',
          border: `1px solid ${hovered ? '#ffffff20' : '#ffffff08'}`,
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
          boxShadow: hovered
            ? `0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px ${game.accentColor}10`
            : '0 2px 10px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        {/* Must Play Badge */}
        {isMustPlay && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              zIndex: 10,
              background: 'linear-gradient(135deg, #e8c060, #d4a43a)',
              color: '#08080c',
              padding: '3px 10px',
              borderRadius: '4px',
              fontSize: '10px',
              fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
              letterSpacing: '1.5px',
              boxShadow: '0 2px 12px #e8c06040',
              fontWeight: 700,
            }}
          >
            MUST PLAY
          </div>
        )}

        {/* Cover image */}
        <div
          style={{
            height: '190px',
            background: game.coverGradient,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {game.coverImage && (
            <img
              src={game.coverImage}
              alt={game.title}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), filter 0.5s ease-out, opacity 0.6s ease-out',
                transform: hovered ? 'scale(1.08)' : 'scale(1)',
                filter: imageLoaded
                  ? hovered ? 'grayscale(0) brightness(1.05)' : 'grayscale(0.15) brightness(0.95)'
                  : 'blur(12px)',
                opacity: imageLoaded ? 1 : 0.6,
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}

          {/* Color gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: getCardGradient(game),
              opacity: 0.5,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {/* Dark bottom gradient for readability */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(0deg, rgba(14,14,20,0.9) 0%, rgba(14,14,20,0.2) 50%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

          {/* Score badges — top right */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 3,
              display: 'flex',
              gap: '6px',
            }}
          >
            <ScoreBadge score={game.criticScore} size="sm" />
            {game.userScore > 0 && <UserScoreBadge score={game.userScore} size="sm" />}
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding: '16px 18px 18px' }}>
          <h3
            style={{
              fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
              fontSize: '20px',
              letterSpacing: '1.5px',
              marginBottom: '3px',
              color: hovered ? '#e8c060' : '#f0f0f0',
              transition: 'color 0.2s ease',
            }}
          >
            {game.title}
          </h3>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              fontSize: '11px',
              color: '#888',
              fontWeight: 500,
              marginBottom: '12px',
            }}
          >
            <span>{game.developer}</span>
            <span>{game.releaseYear}</span>
          </div>

          {/* Genre tags + Platform icons row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', flex: 1 }}>
              {game.genres.map((genre) => (
                <span
                  key={genre}
                  style={{
                    fontSize: '9px',
                    padding: '3px 8px',
                    background: '#ffffff08',
                    color: '#999',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {genre}
                </span>
              ))}
            </div>
            {/* Platform icons */}
            {platformIcons.length > 0 && (
              <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                {platformIcons.map(({ icon, label }) => (
                  <span
                    key={label}
                    title={label}
                    style={{
                      fontSize: '12px',
                      opacity: 0.35,
                      transition: 'opacity 0.2s',
                      color: '#999',
                    }}
                  >
                    {icon}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Skeleton loading card
export function SkeletonCard() {
  return (
    <div
      style={{
        background: '#0e0e14',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid #ffffff08',
      }}
    >
      <div
        style={{
          height: '190px',
          background: 'linear-gradient(90deg, #0e0e14 25%, #16161e 50%, #0e0e14 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s ease-in-out infinite',
        }}
      />
      <div style={{ padding: '16px 18px 18px' }}>
        <div style={{ height: '20px', width: '70%', background: '#ffffff06', borderRadius: '4px', marginBottom: '8px' }} />
        <div style={{ height: '14px', width: '40%', background: '#ffffff04', borderRadius: '4px', marginBottom: '14px' }} />
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ height: '20px', width: '50px', background: '#ffffff04' }} />
          <div style={{ height: '20px', width: '60px', background: '#ffffff04' }} />
        </div>
      </div>
    </div>
  );
}
