import { useFetch } from '../hooks/useFetch';
import type { Game } from '../types';
import GameCard from './GameCard';

interface SimilarGamesProps {
  currentGame: Game;
}

export default function SimilarGames({ currentGame }: SimilarGamesProps) {
  const { data: allGames } = useFetch<Game[]>('/api/games');

  if (!allGames) return null;

  // Find games sharing genres, excluding current game
  const scored = allGames
    .filter((g) => g.id !== currentGame.id)
    .map((g) => {
      const sharedGenres = g.genres.filter((genre: string) =>
        currentGame.genres.includes(genre)
      );
      return { game: g, score: sharedGenres.length };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || b.game.criticScore - a.game.criticScore)
    .slice(0, 4);

  if (scored.length === 0) return null;

  return (
    <section style={{ marginTop: '48px', animation: 'fadeInUp 0.5s ease-out 0.4s both' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <h3
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '22px',
            letterSpacing: '2px',
            background: 'linear-gradient(90deg, #e8c060, #f0d890)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            whiteSpace: 'nowrap',
          }}
        >
          You Might Also Like
        </h3>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #e8c06030, transparent)' }} />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '20px',
        }}
      >
        {scored.map(({ game }, idx) => (
          <div key={game.id} style={{ animation: 'fadeInUp 0.4s ease-out both', animationDelay: `${0.5 + idx * 0.08}s` }}>
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </section>
  );
}
