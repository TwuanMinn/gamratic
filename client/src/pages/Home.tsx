import { useFetch } from '../hooks/useFetch';
import { useInView } from '../hooks/useInView';
import type { Game } from '../types';
import HeroBanner from '../components/HeroBanner';
import GameCard, { SkeletonCard } from '../components/GameCard';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const ICON_STAR = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#e8c060" stroke="none">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/>
  </svg>
);
const ICON_SPARKLE = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#e8c060" stroke="none">
    <path d="M12 2L9 9l-7 3 7 3 3 7 3-7 7-3-7-3-3-7z"/>
  </svg>
);
const ICON_GEM = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e8c060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12l4 6-10 13L2 9z"/><path d="M11 3l1 10"/><path d="M2 9h20"/>
  </svg>
);
const ICON_FLAME = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e8c060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

export default function Home() {
  const { data: games, loading } = useFetch<Game[]>('/api/games');

  const featured = games?.[0];
  const topRated = games?.slice(0, 6) || [];
  const newReleases = games
    ? [...games].sort((a, b) => b.releaseYear - a.releaseYear).slice(0, 4)
    : [];

  const hiddenGems = games
    ? [...games]
        .filter((g) => g.userScore >= 8.5 && g.reviewCount <= 3 && g.criticScore < 94)
        .sort((a, b) => b.userScore - a.userScore)
        .slice(0, 4)
    : [];

  const allGenres = games
    ? [...new Set(games.flatMap((g) => g.genres))]
    : [];
  const spotlightGenre = allGenres.length > 0
    ? allGenres[Math.floor(Date.now() / 86400000) % allGenres.length]
    : null;
  const genreGames = spotlightGenre && games
    ? games.filter((g) => g.genres.includes(spotlightGenre)).slice(0, 4)
    : [];

  return (
    <div style={{ flex: 1 }}>
      {/* Hero featured game */}
      {featured && <HeroBanner game={featured} />}
      {!featured && loading && (
        <div
          style={{
            height: '480px',
            background: 'linear-gradient(135deg, #0e0e14 0%, #1a1a2e 50%, #0e0e14 100%)',
            backgroundSize: '200% 200%',
            animation: 'gradientShift 3s ease infinite',
          }}
        />
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px', position: 'relative' }}>
        {/* Ambient glow between hero and content */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '200px',
            background: 'radial-gradient(ellipse, #e8c06006 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top Rated Section */}
        <ScrollSection delay={0}>
          <SectionHeader title="Top Rated" icon={ICON_STAR} linkTo="/games" />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '24px',
            }}
          >
            {loading
              ? [1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)
              : topRated.map((game, idx) => (
                  <div key={game.id} style={{ animation: 'fadeInUp 0.5s ease-out both', animationDelay: `${0.2 + idx * 0.08}s` }}>
                    <GameCard game={game} />
                  </div>
                ))}
          </div>
        </ScrollSection>

        {/* New Releases Section */}
        <ScrollSection delay={0.05}>
          <SectionHeader title="New Releases" icon={ICON_SPARKLE} linkTo="/games?sort=newest" />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '20px',
            }}
          >
            {loading
              ? [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
              : newReleases.map((game, idx) => (
                  <div key={game.id} style={{ animation: 'fadeInUp 0.5s ease-out both', animationDelay: `${idx * 0.08}s` }}>
                    <GameCard game={game} />
                  </div>
                ))}
          </div>
        </ScrollSection>

        {/* Hidden Gems Section */}
        {hiddenGems.length > 0 && (
          <ScrollSection delay={0.05}>
            <SectionHeader title="Hidden Gems" subtitle="Highly rated, fewer reviews" icon={ICON_GEM} />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '20px',
              }}
            >
              {hiddenGems.map((game, idx) => (
                <div key={game.id} style={{ animation: 'fadeInUp 0.5s ease-out both', animationDelay: `${idx * 0.08}s` }}>
                  <GameCard game={game} />
                </div>
              ))}
            </div>
          </ScrollSection>
        )}

        {/* Genre Spotlight */}
        {spotlightGenre && genreGames.length > 0 && (
          <ScrollSection delay={0.05}>
            <SectionHeader
              title={`${spotlightGenre} Spotlight`}
              subtitle="Today's genre pick"
              icon={ICON_FLAME}
              linkTo={`/games?genre=${encodeURIComponent(spotlightGenre.toLowerCase())}`}
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '20px',
              }}
            >
              {genreGames.map((game, idx) => (
                <div key={game.id} style={{ animation: 'fadeInUp 0.5s ease-out both', animationDelay: `${idx * 0.08}s` }}>
                  <GameCard game={game} />
                </div>
              ))}
            </div>
          </ScrollSection>
        )}

        {/* Bottom margin */}
        {(!spotlightGenre || genreGames.length === 0) && <div style={{ marginBottom: '80px' }} />}
      </div>

      <Footer />
    </div>
  );
}

function ScrollSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      style={{
        marginTop: '56px',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
      }}
    >
      {children}
    </section>
  );
}

function SectionHeader({
  title,
  subtitle,
  icon,
  linkTo,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  linkTo?: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {icon && (
          <div style={{ opacity: 0.7, display: 'flex', alignItems: 'center' }}>
            {icon}
          </div>
        )}
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
              fontSize: '30px',
              letterSpacing: '3px',
              background: 'linear-gradient(90deg, #e8c060, #f0d890)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p style={{ fontSize: '12px', opacity: 0.3, marginTop: '2px' }}>{subtitle}</p>
          )}
        </div>
      </div>
      <div
        style={{
          flex: 1,
          height: '1px',
          background: 'linear-gradient(90deg, #e8c06025, #e8c06008 50%, transparent)',
        }}
      />
      {linkTo && (
        <Link
          to={linkTo}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
            letterSpacing: '1.5px',
            color: '#e8c060',
            opacity: 0.6,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'opacity 0.2s, gap 0.2s',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.gap = '10px'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6'; e.currentTarget.style.gap = '6px'; }}
        >
          VIEW ALL
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
          </svg>
        </Link>
      )}
    </div>
  );
}
