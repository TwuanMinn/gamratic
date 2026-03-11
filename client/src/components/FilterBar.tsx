interface FilterBarProps {
  genre: string;
  platform: string;
  sort: string;
  minScore: number;
  onGenreChange: (v: string) => void;
  onPlatformChange: (v: string) => void;
  onSortChange: (v: string) => void;
  onMinScoreChange: (v: number) => void;
  onClear: () => void;
}

const selectStyle: React.CSSProperties = {
  background: '#0e0e14',
  border: '1px solid #ffffff10',
  borderRadius: '8px',
  color: '#f0f0f0',
  padding: '8px 12px',
  fontSize: '13px',
  fontFamily: 'Georgia, serif',
  outline: 'none',
  cursor: 'pointer',
  appearance: 'none' as const,
  minWidth: '130px',
};

const genres = ['All Genres', 'RPG', 'Action', 'Adventure', 'Strategy', 'Roguelike', 'Metroidvania'];
const platforms = ['All Platforms', 'PC', 'PS5', 'PS4', 'Xbox Series X', 'Xbox One', 'Nintendo Switch'];
const sorts = [
  { value: 'top-rated', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'most-reviews', label: 'Most Reviews' },
];

export default function FilterBar({
  genre, platform, sort, minScore,
  onGenreChange, onPlatformChange, onSortChange, onMinScoreChange, onClear,
}: FilterBarProps) {
  const hasFilters = genre || platform || sort !== 'top-rated' || minScore > 0;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        padding: '16px 0',
      }}
    >
      <select
        id="filter-genre"
        value={genre || 'All Genres'}
        onChange={(e) => onGenreChange(e.target.value === 'All Genres' ? '' : e.target.value)}
        style={selectStyle}
      >
        {genres.map((g) => <option key={g} value={g}>{g}</option>)}
      </select>

      <select
        id="filter-platform"
        value={platform || 'All Platforms'}
        onChange={(e) => onPlatformChange(e.target.value === 'All Platforms' ? '' : e.target.value)}
        style={selectStyle}
      >
        {platforms.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>

      <select
        id="filter-sort"
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        style={selectStyle}
      >
        {sorts.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '12px', opacity: 0.5 }}>Min Score:</span>
        <input
          id="filter-min-score"
          type="range"
          min={0}
          max={100}
          value={minScore}
          onChange={(e) => onMinScoreChange(Number(e.target.value))}
          style={{ width: '100px', accentColor: '#e8c060' }}
        />
        <span style={{ fontSize: '13px', color: '#e8c060', fontFamily: "'Bebas Neue', sans-serif", minWidth: '24px' }}>
          {minScore}
        </span>
      </div>

      {hasFilters && (
        <button
          id="filter-clear"
          onClick={onClear}
          style={{
            background: 'transparent',
            border: '1px solid #ffffff20',
            color: '#f0f0f0',
            padding: '7px 14px',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer',
            fontFamily: 'Georgia, serif',
            opacity: 0.6,
            transition: 'opacity 0.2s',
          }}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
