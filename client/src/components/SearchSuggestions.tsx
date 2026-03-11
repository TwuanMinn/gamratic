import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Game } from '../types';

interface SearchSuggestionsProps {
  query: string;
  focused: boolean;
  onSelect: () => void;
}

export default function SearchSuggestions({ query, focused, onSelect }: SearchSuggestionsProps) {
  const [results, setResults] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!query || query.length < 2 || !focused) {
      setResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/games?search=${encodeURIComponent(query)}`);
        const json = await res.json();
        if (json.success) {
          setResults(json.data.slice(0, 5));
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, focused]);

  if (!focused || !query || query.length < 2) return null;
  if (results.length === 0 && !loading) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        marginTop: '8px',
        background: 'rgba(14, 14, 20, 0.98)',
        backdropFilter: 'blur(20px)',
        border: '1px solid #ffffff10',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 16px 48px rgba(0,0,0,0.5), 0 0 1px #e8c06020',
        zIndex: 1100,
        animation: 'fadeInUp 0.2s ease-out',
      }}
    >
      {loading ? (
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <span style={{ fontSize: '12px', opacity: 0.3 }}>Searching...</span>
        </div>
      ) : (
        results.map((game) => (
          <Link
            key={game.id}
            to={`/games/${game.id}`}
            onClick={onSelect}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              textDecoration: 'none',
              color: 'inherit',
              borderBottom: '1px solid #ffffff06',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ffffff08';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {/* Thumbnail */}
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                overflow: 'hidden',
                background: game.coverGradient,
                flexShrink: 0,
              }}
            >
              {game.coverImage && (
                <img
                  src={game.coverImage}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '15px',
                  letterSpacing: '0.5px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {game.title}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.4 }}>
                {game.developer} • {game.releaseYear}
              </div>
            </div>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '16px',
                color: game.criticScore >= 90 ? '#4ade80' : game.criticScore >= 75 ? '#facc15' : '#fb923c',
                opacity: 0.8,
              }}
            >
              {game.criticScore}
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
