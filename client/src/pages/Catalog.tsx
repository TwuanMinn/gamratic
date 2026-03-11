import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import type { Game } from '../types';
import GameCard, { SkeletonCard } from '../components/GameCard';
import Footer from '../components/Footer';

const GAMES_PER_PAGE = 12;

type CategoryFilter = '' | 'trending' | 'top-rated' | 'new-releases';

const GENRES = ['RPG', 'Action', 'Adventure', 'Strategy', 'Roguelike', 'Metroidvania', 'Puzzle', 'FPS', 'Horror'];
const PLATFORMS = ['PC', 'PS5', 'PS4', 'Xbox Series X', 'Xbox One', 'Nintendo Switch'];

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [category, setCategory] = useState<CategoryFilter>('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [sort, setSort] = useState('top-rated');
  const [search, setSearch] = useState(initialSearch);
  const [searchFocused, setSearchFocused] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (selectedGenres.length === 1) params.set('genre', selectedGenres[0]);
    if (selectedPlatforms.length === 1) params.set('platform', selectedPlatforms[0]);
    if (sort !== 'top-rated') params.set('sort', sort);
    if (category === 'new-releases') params.set('sort', 'newest');
    return params.toString();
  }, [search, selectedGenres, selectedPlatforms, sort, category]);

  const { data: games, loading } = useFetch<Game[]>(`/api/games${queryString ? `?${queryString}` : ''}`);

  const filteredGames = games || [];
  const totalPages = Math.ceil(filteredGames.length / GAMES_PER_PAGE);
  const safePage = Math.min(currentPage, totalPages || 1);
  const paginatedGames = filteredGames.slice(
    (safePage - 1) * GAMES_PER_PAGE,
    safePage * GAMES_PER_PAGE,
  );

  const clearFilters = () => {
    setCategory('');
    setSelectedGenres([]);
    setSelectedPlatforms([]);
    setSort('top-rated');
    setSearch('');
    setSearchParams({});
    setCurrentPage(1);
  };

  const toggleGenre = (g: string) => {
    setSelectedGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
    setCurrentPage(1);
  };

  const togglePlatform = (p: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
    setCurrentPage(1);
  };

  const categories: { key: CategoryFilter; label: string }[] = [
    { key: '', label: 'ALL GAMES' },
    { key: 'trending', label: 'TRENDING' },
    { key: 'top-rated', label: 'TOP RATED' },
    { key: 'new-releases', label: 'NEW RELEASES' },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Header strip */}
      <div style={{ paddingTop: '90px', position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse at 20% 50%, #e8c06008 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, #e8c06005 0%, transparent 50%)
            `,
          }}
        />
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #e8c06015 50%, transparent)', position: 'relative' }} />
      </div>

      {/* Main layout: Sidebar + Content */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '32px',
          width: '100%',
          flex: 1,
          display: 'flex',
          gap: '40px',
        }}
      >
        {/* ---- SIDEBAR ---- */}
        <aside
          style={{
            width: '240px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            animation: 'fadeInUp 0.4s ease-out',
          }}
        >
          {/* Title */}
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                fontSize: '36px',
                letterSpacing: '3px',
                background: 'linear-gradient(135deg, #f0f0f0 0%, #e8c060 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '4px',
              }}
            >
              BROWSE
            </h1>
            <p
              style={{
                fontSize: '10px',
                fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                letterSpacing: '3px',
                color: '#666',
              }}
            >
              CATALOG FILTERS
            </p>
          </div>

          {/* Category navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {categories.map((cat) => {
              const isActive = category === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => { setCategory(cat.key); setCurrentPage(1); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    borderLeft: isActive ? '2px solid #e8c060' : '2px solid transparent',
                    background: isActive ? '#e8c06012' : 'transparent',
                    color: isActive ? '#e8c060' : '#888',
                    fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                    fontSize: '13px',
                    letterSpacing: '2px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = '#ffffff06';
                      e.currentTarget.style.color = '#ccc';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#888';
                    }
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: '#ffffff08' }} />

          {/* FILTERS heading */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                fontSize: '13px',
                letterSpacing: '3px',
                color: '#fff',
                marginBottom: '20px',
              }}
            >
              FILTERS
            </h3>

            {/* Genre checkboxes */}
            <div style={{ marginBottom: '24px' }}>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                  letterSpacing: '2px',
                  color: '#666',
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                GENRE
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {GENRES.map((g) => {
                  const checked = selectedGenres.includes(g);
                  return (
                    <label
                      key={g}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        color: checked ? '#f0f0f0' : '#777',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => { if (!checked) e.currentTarget.style.color = '#bbb'; }}
                      onMouseLeave={(e) => { if (!checked) e.currentTarget.style.color = '#777'; }}
                    >
                      <div
                        onClick={(e) => { e.preventDefault(); toggleGenre(g); }}
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '3px',
                          border: checked ? '1.5px solid #e8c060' : '1.5px solid #ffffff25',
                          background: checked ? '#e8c06020' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                          flexShrink: 0,
                          cursor: 'pointer',
                        }}
                      >
                        {checked && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#e8c060" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      {g}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Platform checkboxes */}
            <div>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                  letterSpacing: '2px',
                  color: '#666',
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                PLATFORM
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {PLATFORMS.map((p) => {
                  const checked = selectedPlatforms.includes(p);
                  return (
                    <label
                      key={p}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        color: checked ? '#f0f0f0' : '#777',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => { if (!checked) e.currentTarget.style.color = '#bbb'; }}
                      onMouseLeave={(e) => { if (!checked) e.currentTarget.style.color = '#777'; }}
                    >
                      <div
                        onClick={(e) => { e.preventDefault(); togglePlatform(p); }}
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '3px',
                          border: checked ? '1.5px solid #e8c060' : '1.5px solid #ffffff25',
                          background: checked ? '#e8c06020' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                          flexShrink: 0,
                          cursor: 'pointer',
                        }}
                      >
                        {checked && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#e8c060" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      {p}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Clear filters */}
          {(selectedGenres.length > 0 || selectedPlatforms.length > 0 || category) && (
            <button
              onClick={clearFilters}
              style={{
                background: 'transparent',
                border: '1px solid #ffffff15',
                color: '#888',
                padding: '10px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                letterSpacing: '2px',
                fontSize: '11px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#e8c060'; e.currentTarget.style.color = '#e8c060'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#ffffff15'; e.currentTarget.style.color = '#888'; }}
            >
              CLEAR ALL FILTERS
            </button>
          )}
        </aside>

        {/* ---- MAIN CONTENT ---- */}
        <section style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>
          {/* Search + Sort row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', animation: 'fadeInUp 0.4s ease-out 0.05s both' }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: 1 }}>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e8c060"
                strokeWidth="2"
                style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  opacity: searchFocused ? 0.8 : 0.3, transition: 'opacity 0.2s',
                }}
              >
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                id="catalog-search"
                type="text"
                placeholder="Search games..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  width: '100%',
                  background: searchFocused ? 'rgba(14,14,20,0.9)' : '#0e0e14',
                  border: `1px solid ${searchFocused ? '#e8c06040' : '#ffffff10'}`,
                  borderRadius: '8px',
                  color: '#f0f0f0',
                  padding: '12px 16px 12px 40px',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
              />
            </div>

            {/* Sort */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                  letterSpacing: '2px',
                  color: '#666',
                }}
              >
                SORT BY
              </span>
              <select
                id="filter-sort"
                value={sort}
                onChange={(e) => { setSort(e.target.value); setCurrentPage(1); }}
                style={{
                  background: '#0e0e14',
                  border: '1px solid #ffffff10',
                  borderRadius: '8px',
                  color: '#f0f0f0',
                  padding: '10px 32px 10px 14px',
                  fontSize: '13px',
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: "var(--font-body, Inter, sans-serif)",
                  appearance: 'none' as const,
                }}
              >
                <option value="top-rated">Popularity</option>
                <option value="newest">Release Date</option>
                <option value="most-reviews">Most Reviews</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          {games && (
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <p style={{ fontSize: '13px', color: '#666' }}>
                Showing <span style={{ color: '#f0f0f0' }}>{filteredGames.length}</span> games
                {totalPages > 1 && <span style={{ color: '#444' }}> · Page {safePage} of {totalPages}</span>}
              </p>
            </div>
          )}

          {/* Game grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {loading
              ? [1, 2, 3, 4, 5, 6, 7, 8].map((i) => <SkeletonCard key={i} />)
              : paginatedGames.map((game, idx) => (
                  <div key={game.id} style={{ animation: 'fadeInUp 0.4s ease-out both', animationDelay: `${idx * 0.04}s` }}>
                    <GameCard game={game} />
                  </div>
                ))}
          </div>

          {!loading && games?.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0', animation: 'fadeIn 0.5s ease-out' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e8c060" strokeWidth="1.5" style={{ opacity: 0.2, marginBottom: '16px' }}>
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path d="M9 10h.01M15 10h.01M9.5 15.5c1-1 3.5-1 4.5 0" />
              </svg>
              <p style={{ fontSize: '18px', opacity: 0.4, fontFamily: "var(--font-display)", letterSpacing: '2px' }}>No games found</p>
              <button
                onClick={clearFilters}
                style={{
                  marginTop: '20px', background: 'transparent', border: '1px solid #e8c060',
                  color: '#e8c060', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer',
                  fontFamily: "var(--font-display)", letterSpacing: '2px', fontSize: '14px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#e8c060'; e.currentTarget.style.color = '#08080c'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#e8c060'; }}
              >
                CLEAR FILTERS
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                gap: '8px', marginTop: '32px', animation: 'fadeIn 0.4s ease-out',
              }}
            >
              <PaginationButton
                label="←"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
              />
              {getPaginationRange(safePage, totalPages).map((page, i) =>
                page === '...' ? (
                  <span key={`dots-${i}`} style={{ color: '#ffffff20', fontSize: '14px', padding: '0 4px' }}>…</span>
                ) : (
                  <PaginationButton
                    key={page}
                    label={String(page)}
                    onClick={() => setCurrentPage(page as number)}
                    active={page === safePage}
                  />
                )
              )}
              <PaginationButton
                label="→"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
              />
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}

function PaginationButton({ label, onClick, disabled, active }: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '6px',
        border: active ? '1px solid #e8c060' : '1px solid #ffffff10',
        background: active
          ? 'linear-gradient(135deg, #e8c060, #d4a43a)'
          : hovered && !disabled
            ? '#ffffff08'
            : 'transparent',
        color: active ? '#08080c' : disabled ? '#ffffff15' : '#f0f0f0',
        cursor: disabled ? 'default' : 'pointer',
        fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
        fontSize: '15px',
        letterSpacing: '1px',
        transition: 'all 0.2s ease',
        opacity: disabled ? 0.3 : 1,
      }}
    >
      {label}
    </button>
  );
}

function getPaginationRange(current: number, total: number): (number | string)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | string)[] = [1];

  if (current > 3) pages.push('...');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('...');

  pages.push(total);
  return pages;
}
