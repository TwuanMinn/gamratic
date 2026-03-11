import type { Game } from '../types';
import ScoreBadge from './ScoreBadge';
import UserScoreBadge from './UserScoreBadge';
import RatingDistributionChart from './RatingDistributionChart';

interface GameInfoSidebarProps {
  game: Game;
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '10px 0',
  borderBottom: '1px solid #ffffff08',
  fontSize: '13px',
};

export default function GameInfoSidebar({ game }: GameInfoSidebarProps) {
  return (
    <div
      style={{
        background: '#0e0e14',
        borderRadius: '12px',
        border: '1px solid #ffffff10',
        padding: '20px',
      }}
    >
      <h3
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '18px',
          letterSpacing: '1px',
          marginBottom: '12px',
          opacity: 0.7,
        }}
      >
        Game Info
      </h3>

      {/* Scores row */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <div style={{ textAlign: 'center' }}>
          <ScoreBadge score={game.criticScore} size="lg" />
          <p style={{ fontSize: '10px', opacity: 0.4, marginTop: '4px' }}>Critic</p>
        </div>
        {game.userScore > 0 && (
          <div style={{ textAlign: 'center' }}>
            <UserScoreBadge score={game.userScore} size="lg" />
            <p style={{ fontSize: '10px', opacity: 0.4, marginTop: '4px' }}>User</p>
          </div>
        )}
      </div>

      {/* Metadata table */}
      <div style={rowStyle}>
        <span style={{ opacity: 0.5 }}>Developer</span>
        <span>{game.developer}</span>
      </div>
      <div style={rowStyle}>
        <span style={{ opacity: 0.5 }}>Publisher</span>
        <span>{game.publisher}</span>
      </div>
      <div style={rowStyle}>
        <span style={{ opacity: 0.5 }}>Release</span>
        <span>{game.releaseYear}</span>
      </div>
      <div style={rowStyle}>
        <span style={{ opacity: 0.5 }}>Platforms</span>
        <span style={{ textAlign: 'right', maxWidth: '150px' }}>{game.platforms.join(', ')}</span>
      </div>
      <div style={{ ...rowStyle, borderBottom: 'none' }}>
        <span style={{ opacity: 0.5 }}>Genres</span>
        <span>{game.genres.join(', ')}</span>
      </div>

      {/* Rating Distribution */}
      {game.reviews && game.reviews.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '15px',
              letterSpacing: '1px',
              marginBottom: '10px',
              opacity: 0.7,
            }}
          >
            Rating Distribution
          </h4>
          <RatingDistributionChart reviews={game.reviews} />
        </div>
      )}
    </div>
  );
}
