import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../hooks/useAuth';
import Footer from '../components/Footer';
import type { Game } from '../types';

interface Review {
  id: number;
  score: number;
  body: string;
  createdAt: string;
  helpfulVotes: number;
  user?: { id: number; username: string };
  game?: { id: number; title: string; coverImage: string; criticScore: number };
}

export default function Community() {
  const { user } = useAuth();
  const { data: recentReviews } = useFetch<Review[]>('/api/games/reviews/recent');
  const { data: games } = useFetch<Game[]>('/api/games');
  const [expandedReview, setExpandedReview] = useState<number | null>(null);

  // Top reviewers from review data
  const topReviewers = recentReviews
    ? Object.values(
        recentReviews.reduce((acc: Record<string, { username: string; userId: number; count: number; avgScore: number; totalScore: number; totalHelpful: number }>, r) => {
          const name = r.user?.username || 'Anonymous';
          const uid = r.user?.id || 0;
          if (!acc[name]) acc[name] = { username: name, userId: uid, count: 0, avgScore: 0, totalScore: 0, totalHelpful: 0 };
          acc[name].count++;
          acc[name].totalScore += r.score;
          acc[name].totalHelpful += r.helpfulVotes || 0;
          acc[name].avgScore = Math.round((acc[name].totalScore / acc[name].count) * 10);
          return acc;
        }, {})
      ).sort((a, b) => b.totalHelpful - a.totalHelpful).slice(0, 5)
    : [];

  // Discussion topics from games
  const discussions = games?.slice(0, 6).map((game, i) => ({
    id: game.id,
    title: [
      `Is ${game.title} overrated or underrated?`,
      `Best strategies and tips for ${game.title}`,
      `Hot take: ${game.title} deserves a ${game.criticScore > 85 ? 'higher' : 'lower'} score`,
      `${game.title} vs its predecessor — which is better?`,
      `What makes ${game.title} special?`,
      `Should you buy ${game.title} in 2026?`,
    ][i % 6],
    tag: ['Discussion', 'Strategy', 'Hot Take', 'Versus', 'Review', 'Guide'][i % 6],
    tagColor: ['#e8c060', '#4a9ead', '#e74c3c', '#9b59b6', '#27ae60', '#3498db'][i % 6],
    replies: Math.floor(Math.random() * 200) + 30,
    upvotes: Math.floor(Math.random() * 1500) + 100,
    views: Math.floor(Math.random() * 3000) + 400,
    lastActive: ['2m ago', '15m ago', '1h ago', '3h ago', '6h ago', '12h ago'][i % 6],
    poster: ['NightOwl', 'PixelKnight', 'CriticalMass', 'GhostFrame', 'VoidWalker', 'RetroGamer'][i % 6],
    game,
    hot: i < 2,
  })) || [];

  // Trending topics
  const trending = [
    { tag: '#ELDENRING', title: 'Shadow of the Erdtree build guides mega-thread', posts: '4.5k posts this week' },
    { tag: '#SILKSONG', title: 'Hollow Knight Silksong release date speculation', posts: '2.1k posts this week' },
    { tag: '#GTA6', title: 'Vice City confirmed — leaked map analysis', posts: '3.8k posts this week' },
    { tag: '#INDIEGEMS', title: 'Best indie roguelikes of 2026 so far', posts: '890 posts this week' },
  ];

  // Poll data
  const polls = [
    {
      title: 'Best RPG of All Time?',
      live: true,
      totalVotes: 8_245,
      timeLeft: '3 days left',
      options: [
        { label: 'Elden Ring', pct: 35 },
        { label: "Baldur's Gate 3", pct: 30 },
        { label: 'The Witcher 3', pct: 22 },
        { label: 'Persona 5 Royal', pct: 13 },
      ],
    },
    {
      title: 'Preferred Platform?',
      live: false,
      totalVotes: 12_102,
      timeLeft: 'Ended 1 week ago',
      options: [
        { label: 'PC', pct: 42 },
        { label: 'Console (PS5/Xbox)', pct: 38 },
        { label: 'Handheld (Deck/Switch)', pct: 20 },
      ],
    },
  ];

  const rankTitles = ['Mythic Contributor', 'Legendary', 'Guide Master', 'Elite Reviewer', 'Rising Star'];
  const rankBorderColors = ['#e8c060', '#c0c0c0', '#cd7f32', '#4a9ead', '#9b59b6'];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Main content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '100px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }} className="community-grid">
          {/* Left Column - Main Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

            {/* Hero Section */}
            <section
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '24px',
                background: `
                  radial-gradient(ellipse at 80% 20%, rgba(232, 192, 96, 0.15) 0%, transparent 50%),
                  radial-gradient(ellipse at 20% 80%, rgba(232, 192, 96, 0.05) 0%, transparent 50%),
                  linear-gradient(135deg, rgba(232, 192, 96, 0.08) 0%, #0c0c14 40%, #08080c 100%)
                `,
                border: '1px solid rgba(232, 192, 96, 0.15)',
                padding: '48px',
              }}
            >
              <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 14px',
                    background: 'rgba(232, 192, 96, 0.1)',
                    color: '#e8c060',
                    fontSize: '10px',
                    fontWeight: 800,
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    borderRadius: '20px',
                    marginBottom: '16px',
                    fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                  }}
                >
                  Community Hub
                </span>
                <h1
                  style={{
                    fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                    fontSize: 'clamp(36px, 5vw, 56px)',
                    color: '#f0f0f0',
                    lineHeight: 1,
                    marginBottom: '20px',
                    letterSpacing: '2px',
                    fontStyle: 'italic',
                  }}
                >
                  GEAR UP.<br />TALK SHOP.
                </h1>
                <p style={{ color: '#777', fontSize: '16px', lineHeight: 1.7, marginBottom: '32px' }}>
                  Join {(recentReviews?.length || 0) > 0 ? `${topReviewers.length * 25}k+` : '...'} gamers discussing the latest releases, strategy guides, and honest reviews.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  <Link
                    to={user ? '/games' : '/auth'}
                    style={{
                      padding: '14px 32px',
                      background: '#e8c060',
                      color: '#08080c',
                      fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                      fontSize: '14px',
                      letterSpacing: '2px',
                      fontWeight: 800,
                      borderRadius: '12px',
                      textDecoration: 'none',
                      transition: 'transform 0.2s',
                      display: 'inline-block',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    Start Discussion
                  </Link>
                  <Link
                    to="/games"
                    style={{
                      padding: '14px 32px',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#f0f0f0',
                      fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                      fontSize: '14px',
                      letterSpacing: '2px',
                      fontWeight: 800,
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      display: 'inline-block',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                  >
                    Browse Games
                  </Link>
                </div>
              </div>
              {/* Hero glow */}
              <div
                style={{
                  position: 'absolute',
                  right: '-80px',
                  bottom: '-80px',
                  width: '320px',
                  height: '320px',
                  background: 'rgba(232, 192, 96, 0.12)',
                  filter: 'blur(120px)',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                }}
              />
            </section>

            {/* Featured Discussions */}
            <section>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3
                  style={{
                    fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                    fontSize: '22px',
                    letterSpacing: '2px',
                    color: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>💬</span>
                  FEATURED DISCUSSIONS
                </h3>
                <Link to="/games" style={{ color: '#e8c060', fontSize: '12px', fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)", letterSpacing: '1px', textDecoration: 'none' }}>
                  View All →
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {discussions.map((topic, idx) => (
                  <Link
                    key={topic.id}
                    to={`/games/${topic.game.id}`}
                    style={{
                      display: 'flex',
                      gap: '16px',
                      padding: '20px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255,255,255,0.06)',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      animation: 'fadeInUp 0.3s ease-out both',
                      animationDelay: `${idx * 0.05}s`,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(232, 192, 96, 0.15)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                  >
                    {/* Upvote column */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '12px',
                        padding: '8px 12px',
                        border: '1px solid rgba(255,255,255,0.03)',
                        flexShrink: 0,
                        minWidth: '52px',
                      }}
                    >
                      <span style={{ fontSize: '14px', color: '#e8c060', lineHeight: 1 }}>▲</span>
                      <span style={{ fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)", fontSize: '16px', color: '#f0f0f0', letterSpacing: '1px' }}>
                        {topic.upvotes >= 1000 ? `${(topic.upvotes / 1000).toFixed(1)}k` : topic.upvotes}
                      </span>
                      <span style={{ fontSize: '14px', color: '#333', lineHeight: 1 }}>▼</span>
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            padding: '2px 8px',
                            background: `${topic.tagColor}20`,
                            color: topic.tagColor,
                            fontSize: '9px',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            borderRadius: '4px',
                            letterSpacing: '1px',
                          }}
                        >
                          {topic.tag}
                        </span>
                        {topic.hot && (
                          <span style={{ padding: '2px 6px', background: 'rgba(232, 192, 96, 0.15)', color: '#e8c060', fontSize: '9px', fontWeight: 800, borderRadius: '4px', letterSpacing: '1px' }}>
                            🔥 HOT
                          </span>
                        )}
                        <span style={{ color: '#444', fontSize: '11px' }}>
                          Posted by {topic.poster} • {topic.lastActive}
                        </span>
                      </div>
                      <h4 style={{ color: '#f0f0f0', fontSize: '15px', fontWeight: 600, marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {topic.title}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#555', fontSize: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>💬 {topic.replies} Comments</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>👁 {topic.views.toLocaleString()}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>🔖 Save</span>
                      </div>
                    </div>

                    {/* Game thumbnail */}
                    <img
                      src={topic.game.coverImage}
                      alt={topic.game.title}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '10px',
                        objectFit: 'cover',
                        flexShrink: 0,
                        alignSelf: 'center',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    />
                  </Link>
                ))}
              </div>
            </section>

            {/* Recent Activity Feed */}
            <section>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3
                  style={{
                    fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                    fontSize: '22px',
                    letterSpacing: '2px',
                    color: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>⚡</span>
                  RECENT REVIEWS
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentReviews?.slice(0, 10).map((review, idx) => (
                  <div
                    key={review.id}
                    style={{
                      padding: '20px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255,255,255,0.06)',
                      transition: 'all 0.2s',
                      animation: 'fadeInUp 0.3s ease-out both',
                      animationDelay: `${idx * 0.04}s`,
                      cursor: 'pointer',
                    }}
                    onClick={() => setExpandedReview(expandedReview === review.id ? null : review.id)}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(232, 192, 96, 0.12)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                  >
                    <div style={{ display: 'flex', gap: '14px' }}>
                      {/* Avatar */}
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, hsl(${((review.user?.id || 0) * 60) % 360}, 50%, 40%), hsl(${((review.user?.id || 0) * 60 + 40) % 360}, 40%, 30%))`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                          fontSize: '14px',
                          color: '#fff',
                          flexShrink: 0,
                          border: '2px solid rgba(232, 192, 96, 0.2)',
                        }}
                      >
                        {(review.user?.username || 'A').slice(0, 2).toUpperCase()}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                          <span style={{ color: '#e8c060', fontSize: '13px', fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)", letterSpacing: '1px' }}>
                            {review.user?.username || 'Anonymous'}
                          </span>
                          <span style={{ color: '#333', fontSize: '11px' }}>rated</span>
                          {review.game && (
                            <Link
                              to={`/games/${review.game.id}`}
                              style={{ color: '#f0f0f0', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}
                              onClick={(e) => e.stopPropagation()}
                              onMouseEnter={(e) => { e.currentTarget.style.color = '#e8c060'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = '#f0f0f0'; }}
                            >
                              {review.game.title}
                            </Link>
                          )}
                          <span
                            style={{
                              background: review.score >= 8 ? '#2d6b3a' : review.score >= 6 ? '#8a7a2a' : '#8a2a2a',
                              color: '#f0f0f0',
                              padding: '2px 10px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                              letterSpacing: '1px',
                              fontWeight: 700,
                            }}
                          >
                            {review.score}/10
                          </span>
                        </div>
                        <p
                          style={{
                            color: '#888',
                            fontSize: '13px',
                            lineHeight: 1.6,
                            overflow: expandedReview === review.id ? 'visible' : 'hidden',
                            textOverflow: expandedReview === review.id ? 'unset' : 'ellipsis',
                            whiteSpace: expandedReview === review.id ? 'normal' : 'nowrap',
                          }}
                        >
                          {review.body}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                          <span style={{ color: '#444', fontSize: '11px' }}>
                            {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span style={{ color: '#444', fontSize: '11px' }}>👍 {review.helpfulVotes || 0}</span>
                          {review.game && (
                            <Link
                              to={`/games/${review.game.id}`}
                              style={{ color: '#555', fontSize: '11px', textDecoration: 'none' }}
                              onClick={(e) => e.stopPropagation()}
                              onMouseEnter={(e) => { e.currentTarget.style.color = '#e8c060'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = '#555'; }}
                            >
                              💬 Reply
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {(!recentReviews || recentReviews.length === 0) && (
                  <div style={{ textAlign: 'center', padding: '60px', color: '#444' }}>
                    <p style={{ fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)", fontSize: '18px', letterSpacing: '2px' }}>
                      No reviews yet
                    </p>
                    {!user && (
                      <Link to="/auth" style={{ color: '#e8c060', fontSize: '13px', marginTop: '8px', display: 'inline-block' }}>
                        Sign in to start reviewing
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Community Polls */}
            <section>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3
                  style={{
                    fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                    fontSize: '22px',
                    letterSpacing: '2px',
                    color: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>🗳️</span>
                  COMMUNITY POLLS
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {polls.map((poll) => (
                  <div
                    key={poll.title}
                    style={{
                      padding: '24px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                      <h4 style={{ color: '#e0e0e0', fontSize: '15px', fontWeight: 700 }}>{poll.title}</h4>
                      <span
                        style={{
                          fontSize: '9px',
                          background: poll.live ? '#e8c060' : '#333',
                          color: poll.live ? '#08080c' : '#999',
                          fontWeight: 900,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                          fontStyle: 'italic',
                          flexShrink: 0,
                        }}
                      >
                        {poll.live ? 'LIVE' : 'ENDED'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {poll.options.map((opt) => (
                        <div
                          key={opt.label}
                          style={{
                            position: 'relative',
                            width: '100%',
                            height: '44px',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '10px',
                            border: '1px solid rgba(255,255,255,0.04)',
                            overflow: 'hidden',
                            cursor: poll.live ? 'pointer' : 'default',
                          }}
                        >
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              width: `${opt.pct}%`,
                              background: 'rgba(232, 192, 96, 0.12)',
                              transition: 'width 1s ease',
                            }}
                          />
                          <div
                            style={{
                              position: 'relative',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0 14px',
                              fontSize: '13px',
                              fontWeight: 600,
                              color: opt.pct === Math.max(...poll.options.map((o) => o.pct)) ? '#f0f0f0' : '#777',
                            }}
                          >
                            <span>{opt.label}</span>
                            <span>{opt.pct}%</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <p
                      style={{
                        color: '#444',
                        fontSize: '9px',
                        marginTop: '14px',
                        textTransform: 'uppercase',
                        fontWeight: 800,
                        letterSpacing: '2px',
                      }}
                    >
                      {poll.totalVotes.toLocaleString()} Total Votes • {poll.timeLeft}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA Banner */}
            <section
              style={{
                background: '#e8c060',
                borderRadius: '24px',
                padding: '48px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '32px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div style={{ flex: 1, minWidth: '260px', position: 'relative', zIndex: 1 }}>
                <h3
                  style={{
                    fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                    fontSize: '32px',
                    color: '#08080c',
                    lineHeight: 1.1,
                    letterSpacing: '2px',
                    marginBottom: '12px',
                  }}
                >
                  WANT TO HAVE YOUR SAY?
                </h3>
                <p style={{ color: 'rgba(8, 8, 12, 0.7)', fontWeight: 500, fontSize: '16px' }}>
                  Create an account and start reviewing immediately. Our community is waiting for your hot takes.
                </p>
              </div>
              <Link
                to={user ? '/games' : '/auth'}
                style={{
                  background: '#08080c',
                  color: '#e8c060',
                  padding: '16px 36px',
                  borderRadius: '16px',
                  fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                  fontSize: '16px',
                  fontWeight: 900,
                  letterSpacing: '2px',
                  textDecoration: 'none',
                  transition: 'transform 0.2s',
                  position: 'relative',
                  zIndex: 1,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                {user ? 'BROWSE GAMES' : 'JOIN THE CONVERSATION'}
              </Link>
              <span
                style={{
                  position: 'absolute',
                  bottom: '-30px',
                  right: '-30px',
                  fontSize: '180px',
                  color: 'rgba(8, 8, 12, 0.06)',
                  transform: 'rotate(12deg)',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                💬
              </span>
            </section>
          </div>

          {/* Right Sidebar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Community Pulse */}
            <div
              style={{
                padding: '24px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px',
              }}
            >
              <h4
                style={{
                  fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                  fontSize: '14px',
                  letterSpacing: '2px',
                  color: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '20px',
                }}
              >
                <span style={{ fontSize: '16px' }}>📊</span>
                COMMUNITY PULSE
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                {[
                  { label: 'Reviews', value: recentReviews?.length || 0, change: '+12%' },
                  { label: 'Games Rated', value: games?.length || 0, change: '+5.2%' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      padding: '14px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.03)',
                    }}
                  >
                    <p style={{ color: '#555', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{stat.label}</p>
                    <p style={{ fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)", fontSize: '24px', color: '#f0f0f0', letterSpacing: '1px' }}>{stat.value}</p>
                    <p style={{ color: '#4caf50', fontSize: '9px', fontWeight: 700, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      ↑ {stat.change}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                {[
                  { label: 'Active Reviewers', value: topReviewers.length.toString() },
                  { label: 'Avg Score', value: topReviewers.length > 0 ? `${(topReviewers.reduce((s, r) => s + r.avgScore, 0) / topReviewers.length / 10).toFixed(1)}/10` : '-' },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', padding: '6px 0' }}>
                    <span style={{ color: '#666' }}>{item.label}</span>
                    <span style={{ color: '#f0f0f0', fontWeight: 700 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Now */}
            <div
              style={{
                padding: '24px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px',
              }}
            >
              <h4
                style={{
                  fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                  fontSize: '14px',
                  letterSpacing: '2px',
                  color: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '20px',
                }}
              >
                <span style={{ fontSize: '16px' }}>⚡</span>
                TRENDING NOW
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {trending.map((topic) => (
                  <div key={topic.tag} style={{ cursor: 'pointer' }}>
                    <p style={{ color: '#555', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '1px' }}>{topic.tag}</p>
                    <p style={{ color: '#ddd', fontSize: '13px', fontWeight: 600, marginBottom: '4px', lineHeight: 1.4 }}>{topic.title}</p>
                    <p style={{ color: '#444', fontSize: '10px' }}>{topic.posts}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hall of Fame */}
            <div
              style={{
                padding: '24px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px',
              }}
            >
              <h4
                style={{
                  fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                  fontSize: '14px',
                  letterSpacing: '2px',
                  color: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '20px',
                }}
              >
                <span style={{ fontSize: '16px' }}>🏆</span>
                HALL OF FAME
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {topReviewers.map((reviewer, idx) => (
                  <Link
                    key={reviewer.username}
                    to={reviewer.userId ? `/user/${reviewer.userId}` : '#'}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      textDecoration: 'none',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                  >
                    {/* Avatar with rank border */}
                    <div style={{ position: 'relative' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          border: `2px solid ${rankBorderColors[idx]}`,
                          background: `linear-gradient(135deg, hsl(${(idx * 60 + 30) % 360}, 50%, 35%), hsl(${(idx * 60 + 70) % 360}, 40%, 25%))`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                          fontSize: '13px',
                          color: '#fff',
                        }}
                      >
                        {reviewer.username.slice(0, 2).toUpperCase()}
                      </div>
                      {idx < 3 && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '-2px',
                            right: '-2px',
                            width: '16px',
                            height: '16px',
                            background: rankBorderColors[idx],
                            borderRadius: '50%',
                            border: '2px solid #08080c',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '8px',
                          }}
                        >
                          {idx === 0 ? '👑' : idx === 1 ? '⭐' : '🔥'}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <p style={{ color: '#f0f0f0', fontSize: '13px', fontWeight: 700 }}>{reviewer.username}</p>
                      <p style={{ color: '#555', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                        {rankTitles[idx]}
                      </p>
                    </div>

                    {/* Points */}
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: '#e8c060', fontSize: '13px', fontWeight: 900, fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)", letterSpacing: '1px' }}>
                        {reviewer.totalHelpful.toLocaleString()}
                      </p>
                      <p style={{ color: '#444', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Points</p>
                    </div>
                  </Link>
                ))}

                {topReviewers.length === 0 && (
                  <p style={{ color: '#444', fontSize: '12px', textAlign: 'center', padding: '20px' }}>
                    No reviewers yet — be the first!
                  </p>
                )}
              </div>

              <Link
                to="/games"
                style={{
                  display: 'block',
                  width: '100%',
                  marginTop: '20px',
                  padding: '10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#666',
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '8px',
                  textAlign: 'center',
                  transition: 'color 0.2s',
                  fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                  letterSpacing: '1px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#e8c060'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#666'; }}
              >
                View Full Leaderboard
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* CSS for grid layout */}
      <style>{`
        @media (min-width: 1024px) {
          .community-grid {
            grid-template-columns: 1fr 340px !important;
          }
        }
      `}</style>

      <Footer />
    </div>
  );
}
