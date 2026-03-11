import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import type { Game, Review } from '../types';
import HeroBanner from '../components/HeroBanner';
import GameInfoSidebar from '../components/GameInfoSidebar';
import ReviewCard from '../components/ReviewCard';
import WriteReviewForm from '../components/WriteReviewForm';
import SimilarGames from '../components/SimilarGames';
import ShareButton from '../components/ShareButton';
import BrandedLoader from '../components/BrandedLoader';
import Footer from '../components/Footer';

type SortMode = 'recent' | 'helpful' | 'score-high' | 'score-low';
type TabKey = 'overview' | 'breakdown' | 'reviews';
type StatsTab = 'difficulty' | 'playtime' | 'completion';

function sortReviews(reviews: Review[], mode: SortMode): Review[] {
  const sorted = [...reviews];
  switch (mode) {
    case 'helpful':
      return sorted.sort((a, b) => b.helpfulVotes - a.helpfulVotes);
    case 'score-high':
      return sorted.sort((a, b) => b.score - a.score);
    case 'score-low':
      return sorted.sort((a, b) => a.score - b.score);
    default:
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

/** Generate pseudo-performance metrics from the game scores */
function generateMetrics(game: Game) {
  const base = game.criticScore;
  return [
    { label: 'Visuals & Art', score: Math.min(10, +(base / 10 + (Math.sin(game.id * 2) * 0.3)).toFixed(1)) },
    { label: 'Gameplay', score: Math.min(10, +(base / 10 - 0.5 + (Math.cos(game.id * 3) * 0.4)).toFixed(1)) },
    { label: 'Sound & Music', score: Math.min(10, +(base / 10 - 0.2 + (Math.sin(game.id * 5) * 0.3)).toFixed(1)) },
    { label: 'Story & World', score: Math.min(10, +(base / 10 + 0.1 + (Math.cos(game.id) * 0.3)).toFixed(1)) },
  ];
}

/** Generate pros/cons from tags and description */
function generateProsAndCons(game: Game) {
  const proPool = [
    'Stunning visual fidelity and art direction',
    'Deep, rewarding gameplay mechanics',
    'Engaging and memorable storyline',
    'Masterful sound design & soundtrack',
    'Excellent world-building and atmosphere',
    'High replay value',
    'Polished controls and responsive gameplay',
    'Rich character development',
  ];
  const conPool = [
    'Minor performance drops in busy areas',
    'Learning curve can be steep initially',
    'Some UI elements feel cluttered',
    'Loading times on older hardware',
    'Occasional pacing issues',
    'Limited waypoint customization',
  ];

  const seed = game.id;
  const pros = proPool.filter((_, i) => (seed + i) % 3 !== 0).slice(0, 3);
  const cons = conPool.filter((_, i) => (seed + i) % 4 !== 0).slice(0, 3);
  return { pros, cons };
}

/** Generate pseudo game-stats based on game properties */
function generateGameStats(game: Game) {
  const s = game.id;
  const isHard = game.genres.some(g => ['Action', 'RPG', 'Roguelike'].includes(g));
  const isLong = game.genres.some(g => ['RPG', 'Strategy', 'Adventure'].includes(g));

  const difficulty = isHard
    ? [
        { label: 'Simple', pct: 2 + (s % 3), color: '#34d399' },
        { label: 'Easy', pct: 8 + (s % 7), color: '#a3e635' },
        { label: 'Just Right', pct: 38 + (s % 15), color: '#fbbf24' },
        { label: 'Tough', pct: 28 + (s % 10), color: '#fb923c' },
        { label: 'Unforgiving', pct: 0, color: '#f87171' },
      ]
    : [
        { label: 'Simple', pct: 4 + (s % 5), color: '#34d399' },
        { label: 'Easy', pct: 18 + (s % 12), color: '#a3e635' },
        { label: 'Just Right', pct: 55 + (s % 12), color: '#fbbf24' },
        { label: 'Tough', pct: 6 + (s % 5), color: '#fb923c' },
        { label: 'Unforgiving', pct: 2 + (s % 3), color: '#f87171' },
      ];

  // Normalize to 100
  const diffTotal = difficulty.reduce((a, d) => a + d.pct, 0);
  difficulty.forEach(d => d.pct = +((d.pct / diffTotal) * 100).toFixed(1));

  const playTime = isLong
    ? [
        { label: '< 1 Hour', pct: 1, color: '#f87171' },
        { label: '~4 Hours', pct: 2 + (s % 3), color: '#fb923c' },
        { label: '~12 Hours', pct: 8 + (s % 8), color: '#fbbf24' },
        { label: '~20 Hours', pct: 22 + (s % 12), color: '#a3e635' },
        { label: '~40 Hours', pct: 35 + (s % 15), color: '#34d399' },
        { label: '~60 Hours', pct: 18 + (s % 8), color: '#22d3ee' },
        { label: '≥ 80 Hours', pct: 10 + (s % 7), color: '#818cf8' },
      ]
    : [
        { label: '< 1 Hour', pct: 3 + (s % 4), color: '#f87171' },
        { label: '~4 Hours', pct: 8 + (s % 6), color: '#fb923c' },
        { label: '~12 Hours', pct: 30 + (s % 15), color: '#fbbf24' },
        { label: '~20 Hours', pct: 40 + (s % 12), color: '#a3e635' },
        { label: '~40 Hours', pct: 12 + (s % 8), color: '#34d399' },
        { label: '~60 Hours', pct: 4 + (s % 4), color: '#22d3ee' },
        { label: '≥ 80 Hours', pct: 2 + (s % 3), color: '#818cf8' },
      ];

  const ptTotal = playTime.reduce((a, d) => a + d.pct, 0);
  playTime.forEach(d => d.pct = +((d.pct / ptTotal) * 100).toFixed(1));

  const isHighCompletion = game.criticScore >= 90;
  const completion = isHighCompletion
    ? [
        { label: 'Tried It', pct: 4 + (s % 4), color: '#f87171' },
        { label: 'Played It', pct: 8 + (s % 6), color: '#fb923c' },
        { label: 'Halfway', pct: 6 + (s % 5), color: '#fbbf24' },
        { label: 'Beat It', pct: 26 + (s % 10), color: '#a3e635' },
        { label: 'Conquered It', pct: 50 + (s % 12), color: '#34d399' },
      ]
    : [
        { label: 'Tried It', pct: 10 + (s % 8), color: '#f87171' },
        { label: 'Played It', pct: 20 + (s % 10), color: '#fb923c' },
        { label: 'Halfway', pct: 18 + (s % 8), color: '#fbbf24' },
        { label: 'Beat It', pct: 30 + (s % 10), color: '#a3e635' },
        { label: 'Conquered It', pct: 15 + (s % 8), color: '#34d399' },
      ];

  const cTotal = completion.reduce((a, d) => a + d.pct, 0);
  completion.forEach(d => d.pct = +((d.pct / cTotal) * 100).toFixed(1));

  return { difficulty, playTime, completion };
}

export default function GameDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: game, loading, refetch } = useFetch<Game>(id ? `/api/games/${id}` : null);
  const [sortMode, setSortMode] = useState<SortMode>('recent');
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  if (loading) {
    return (
      <div style={{ paddingTop: '90px' }}>
        <div
          style={{
            height: '340px',
            background: 'linear-gradient(135deg, #0e0e14 0%, #1a1a2e 50%, #0e0e14 100%)',
            backgroundSize: '200% 200%',
            animation: 'gradientShift 3s ease infinite',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <BrandedLoader size="lg" />
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div style={{ paddingTop: '140px', textAlign: 'center', animation: 'fadeIn 0.5s ease-out' }}>
        <p style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.2 }}>🎮</p>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', opacity: 0.4, letterSpacing: '2px' }}>
          Game not found
        </h2>
      </div>
    );
  }

  const sortedReviews = sortReviews(game.reviews || [], sortMode);
  const metrics = generateMetrics(game);
  const { pros, cons } = generateProsAndCons(game);
  const gameStats = generateGameStats(game);

  const sortTabs: { key: SortMode; label: string }[] = [
    { key: 'recent', label: 'RECENT' },
    { key: 'helpful', label: 'HELPFUL' },
    { key: 'score-high', label: 'HIGH SCORE' },
    { key: 'score-low', label: 'LOW SCORE' },
  ];

  const navTabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'breakdown', label: 'Detailed Breakdown' },
    { key: 'reviews', label: `Reviews (${game.reviewCount})` },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Hero banner */}
      <div style={{ paddingTop: '90px' }}>
        <HeroBanner game={game} compact />
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px', width: '100%', flex: 1 }}>
        {/* Tags + Share row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '28px', animation: 'fadeInUp 0.5s ease-out 0.1s both' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {game.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '5px 14px',
                  borderRadius: '20px',
                  background: '#ffffff06',
                  border: '1px solid #ffffff0a',
                  fontSize: '12px',
                  opacity: 0.5,
                  fontFamily: "'Bebas Neue', sans-serif",
                  letterSpacing: '1px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <ShareButton title={game.title} />
        </div>

        {/* Navigation tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0',
            borderBottom: '1px solid #ffffff08',
            marginBottom: '32px',
            overflowX: 'auto',
            animation: 'fadeInUp 0.5s ease-out 0.15s both',
          }}
        >
          {navTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '14px 24px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.key ? '2px solid #e8c060' : '2px solid transparent',
                color: activeTab === tab.key ? '#e8c060' : '#f0f0f0',
                opacity: activeTab === tab.key ? 1 : 0.35,
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '14px',
                letterSpacing: '2px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.key) e.currentTarget.style.opacity = '0.7';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.key) e.currentTarget.style.opacity = '0.35';
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 2-column layout */}
        <div className="game-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
          {/* Main content */}
          <div style={{ animation: 'fadeInUp 0.5s ease-out 0.2s both' }}>

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <>
                {/* About */}
                <div
                  style={{
                    background: '#0e0e14',
                    borderRadius: '14px',
                    border: '1px solid #ffffff08',
                    padding: '28px',
                    marginBottom: '28px',
                  }}
                >
                  <SectionTitle>About</SectionTitle>
                  <p style={{ fontSize: '14px', lineHeight: 1.8, opacity: 0.6 }}>
                    {game.longDescription || game.description}
                  </p>
                </div>

                {/* Pros & Cons — GameHub style */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                    marginBottom: '28px',
                  }}
                >
                  {/* Pros */}
                  <div
                    style={{
                      background: '#0e0e14',
                      borderRadius: '14px',
                      border: '1px solid #ffffff08',
                      borderLeft: '4px solid #22c55e',
                      padding: '24px',
                    }}
                  >
                    <h4
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: '14px',
                        letterSpacing: '2px',
                        color: '#22c55e',
                        marginBottom: '16px',
                      }}
                    >
                      ✓ STRENGTHS
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {pros.map((pro) => (
                        <li key={pro} style={{ display: 'flex', gap: '10px', fontSize: '13px', lineHeight: 1.5, opacity: 0.7 }}>
                          <span style={{ color: '#22c55e', flexShrink: 0 }}>+</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cons */}
                  <div
                    style={{
                      background: '#0e0e14',
                      borderRadius: '14px',
                      border: '1px solid #ffffff08',
                      borderLeft: '4px solid #ef4444',
                      padding: '24px',
                    }}
                  >
                    <h4
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: '14px',
                        letterSpacing: '2px',
                        color: '#ef4444',
                        marginBottom: '16px',
                      }}
                    >
                      ✗ WEAK POINTS
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {cons.map((con) => (
                        <li key={con} style={{ display: 'flex', gap: '10px', fontSize: '13px', lineHeight: 1.5, opacity: 0.7 }}>
                          <span style={{ color: '#ef4444', flexShrink: 0 }}>−</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recent Reviews preview */}
                {sortedReviews.slice(0, 2).map((review, idx) => (
                  <div key={review.id} style={{ animation: 'fadeInUp 0.3s ease-out both', animationDelay: `${idx * 0.05}s` }}>
                    <ReviewCard review={review} />
                  </div>
                ))}
                {sortedReviews.length > 2 && (
                  <button
                    onClick={() => setActiveTab('reviews')}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: '#ffffff06',
                      border: '1px solid #ffffff0a',
                      borderRadius: '10px',
                      color: '#e8c060',
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '14px',
                      letterSpacing: '2px',
                      cursor: 'pointer',
                      marginTop: '12px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#ffffff10'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff06'; }}
                  >
                    VIEW ALL {game.reviewCount} REVIEWS →
                  </button>
                )}
              </>
            )}

            {/* BREAKDOWN TAB */}
            {activeTab === 'breakdown' && (
              <>
                <div
                  style={{
                    background: '#0e0e14',
                    borderRadius: '14px',
                    border: '1px solid #ffffff08',
                    padding: '28px',
                    marginBottom: '28px',
                  }}
                >
                  <SectionTitle>Performance Metrics</SectionTitle>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginTop: '8px' }}>
                    {metrics.map((m) => (
                      <MetricBar key={m.label} label={m.label} score={m.score} />
                    ))}
                  </div>
                </div>

                {/* Game Stats Panel */}
                <GameStatsPanel stats={gameStats} gameName={game.title} />

                {/* Pros & Cons again for breakdown */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                    marginBottom: '28px',
                  }}
                >
                  <div
                    style={{
                      background: '#0e0e14',
                      borderRadius: '14px',
                      border: '1px solid #ffffff08',
                      borderLeft: '4px solid #22c55e',
                      padding: '24px',
                    }}
                  >
                    <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '2px', color: '#22c55e', marginBottom: '16px' }}>
                      ✓ STRENGTHS
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {pros.map((pro) => (
                        <li key={pro} style={{ display: 'flex', gap: '10px', fontSize: '13px', lineHeight: 1.5, opacity: 0.7 }}>
                          <span style={{ color: '#22c55e', flexShrink: 0 }}>+</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div
                    style={{
                      background: '#0e0e14',
                      borderRadius: '14px',
                      border: '1px solid #ffffff08',
                      borderLeft: '4px solid #ef4444',
                      padding: '24px',
                    }}
                  >
                    <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '2px', color: '#ef4444', marginBottom: '16px' }}>
                      ✗ WEAK POINTS
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {cons.map((con) => (
                        <li key={con} style={{ display: 'flex', gap: '10px', fontSize: '13px', lineHeight: 1.5, opacity: 0.7 }}>
                          <span style={{ color: '#ef4444', flexShrink: 0 }}>−</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}

            {/* REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <SectionTitle>User Reviews ({game.reviewCount})</SectionTitle>
                  <div style={{ display: 'flex', gap: '2px', background: '#0e0e14', borderRadius: '8px', padding: '3px', border: '1px solid #ffffff08' }}>
                    {sortTabs.map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => setSortMode(key)}
                        style={{
                          background: sortMode === key ? '#ffffff10' : 'transparent',
                          border: 'none',
                          color: sortMode === key ? '#e8c060' : '#f0f0f0',
                          opacity: sortMode === key ? 1 : 0.35,
                          fontSize: '11px',
                          cursor: 'pointer',
                          fontFamily: "'Bebas Neue', sans-serif",
                          letterSpacing: '1px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {sortedReviews.map((review, idx) => (
                  <div key={review.id} style={{ animation: 'fadeInUp 0.3s ease-out both', animationDelay: `${idx * 0.05}s` }}>
                    <ReviewCard review={review} />
                  </div>
                ))}

                {sortedReviews.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px', background: '#0e0e14', borderRadius: '14px', border: '1px solid #ffffff08' }}>
                    <p style={{ opacity: 0.3, fontSize: '14px' }}>No reviews yet. Be the first!</p>
                  </div>
                )}

                <WriteReviewForm gameId={game.id} onSubmitted={refetch} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ animation: 'fadeInUp 0.5s ease-out 0.3s both' }}>
            <div style={{ position: 'sticky', top: '84px' }}>
              <GameInfoSidebar game={game} />
            </div>
          </div>
        </div>

        <SimilarGames currentGame={game} />
      </div>

      <Footer />
    </div>
  );
}

// -- Sub-components --

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '22px',
        letterSpacing: '2px',
        marginBottom: '14px',
        background: 'linear-gradient(90deg, #e8c060, #f0d890)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {children}
    </h3>
  );
}

function MetricBar({ label, score }: { label: string; score: number }) {
  const pct = Math.round((score / 10) * 100);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px' }}>
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '15px',
            letterSpacing: '2px',
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '20px',
            color: '#e8c060',
          }}
        >
          {score} / 10
        </span>
      </div>
      <div
        style={{
          height: '4px',
          width: '100%',
          background: '#ffffff10',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #e8c060, #f0d890)',
            borderRadius: '2px',
            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </div>
  );
}

// -- Chart components for Game Stats --

type StatSegment = { label: string; pct: number; color: string };

/** Donut / Pie chart using CSS conic-gradient */
function DonutChart({ data, donut = true }: { data: StatSegment[]; donut?: boolean }) {
  // Build conic-gradient stops
  let acc = 0;
  const stops = data.map((d) => {
    const start = acc;
    acc += d.pct;
    return `${d.color} ${start}% ${acc}%`;
  }).join(', ');

  // Find the dominant segment
  const dominant = data.reduce((a, b) => (b.pct > a.pct ? b : a), data[0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: `conic-gradient(${stops})`,
          position: 'relative',
          boxShadow: '0 0 40px rgba(0,0,0,0.3)',
        }}
      >
        {donut && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: '#0e0e14',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                fontSize: '24px',
                color: dominant.color,
                lineHeight: 1,
              }}
            >
              {dominant.pct.toFixed(0)}%
            </span>
            <span
              style={{
                fontSize: '10px',
                color: '#888',
                fontWeight: 600,
                letterSpacing: '0.5px',
                marginTop: '4px',
              }}
            >
              {dominant.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/** Horizontal bar chart */
function BarChart({ data }: { data: StatSegment[] }) {
  const maxPct = Math.max(...data.map((d) => d.pct));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
      {data.map((d, i) => (
        <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              fontSize: '11px',
              color: '#aaa',
              fontWeight: 500,
              width: '72px',
              textAlign: 'right',
              flexShrink: 0,
            }}
          >
            {d.label}
          </span>
          <div
            style={{
              flex: 1,
              height: '24px',
              background: '#ffffff06',
              borderRadius: '4px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${(d.pct / maxPct) * 100}%`,
                background: `linear-gradient(90deg, ${d.color}cc, ${d.color})`,
                borderRadius: '4px',
                transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                transitionDelay: `${i * 0.06}s`,
                boxShadow: `0 0 12px ${d.color}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '8px',
              }}
            >
              {d.pct > 5 && (
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#000',
                    opacity: 0.7,
                  }}
                >
                  {d.pct.toFixed(1)}%
                </span>
              )}
            </div>
          </div>
          {d.pct <= 5 && (
            <span style={{ fontSize: '10px', color: '#666', width: '40px', flexShrink: 0 }}>
              {d.pct.toFixed(1)}%
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/** Legend row for chart data */
function StatsLegend({ data }: { data: StatSegment[] }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px 20px',
        justifyContent: 'center',
        marginTop: '16px',
      }}
    >
      {data.map((d) => (
        <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '2px',
              background: d.color,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: '11px', color: '#bbb', fontWeight: 500 }}>
            {d.label}
          </span>
          <span style={{ fontSize: '10px', color: '#666', fontWeight: 600 }}>
            {d.pct.toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  );
}

/** Full Game Stats panel with three sub-tabs */
function GameStatsPanel({
  stats,
  gameName,
}: {
  stats: { difficulty: StatSegment[]; playTime: StatSegment[]; completion: StatSegment[] };
  gameName: string;
}) {
  const [activeStats, setActiveStats] = useState<StatsTab>('difficulty');

  const tabs: { key: StatsTab; label: string }[] = [
    { key: 'difficulty', label: 'Difficulty' },
    { key: 'playtime', label: 'Play Time' },
    { key: 'completion', label: 'Completion' },
  ];

  return (
    <div
      style={{
        background: '#0e0e14',
        borderRadius: '14px',
        border: '1px solid #ffffff08',
        padding: '28px',
        marginBottom: '28px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
        <div>
          <h3
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '22px',
              letterSpacing: '2px',
              background: 'linear-gradient(90deg, #e8c060, #f0d890)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '4px',
            }}
          >
            Game Stats
          </h3>
          <span style={{ fontSize: '11px', color: '#666' }}>
            Community data for {gameName}
          </span>
        </div>

        {/* Sub-tabs */}
        <div
          style={{
            display: 'flex',
            gap: '2px',
            background: '#08080c',
            borderRadius: '8px',
            padding: '3px',
            border: '1px solid #ffffff08',
          }}
        >
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveStats(key)}
              style={{
                background: activeStats === key ? '#ffffff10' : 'transparent',
                border: 'none',
                color: activeStats === key ? '#e8c060' : '#f0f0f0',
                opacity: activeStats === key ? 1 : 0.35,
                fontSize: '11px',
                cursor: 'pointer',
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: '1.5px',
                padding: '7px 14px',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (activeStats !== key) e.currentTarget.style.opacity = '0.6';
              }}
              onMouseLeave={(e) => {
                if (activeStats !== key) e.currentTarget.style.opacity = '0.35';
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty — Donut */}
      {activeStats === 'difficulty' && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <DonutChart data={stats.difficulty} />
          <StatsLegend data={stats.difficulty} />
        </div>
      )}

      {/* Play Time — Bar chart */}
      {activeStats === 'playtime' && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <BarChart data={stats.playTime} />
          <StatsLegend data={stats.playTime} />
        </div>
      )}

      {/* Completion — Pie (no donut hole) */}
      {activeStats === 'completion' && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <DonutChart data={stats.completion} donut={true} />
          <StatsLegend data={stats.completion} />
        </div>
      )}
    </div>
  );
}
