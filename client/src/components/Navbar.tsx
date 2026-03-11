import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import SearchSuggestions from './SearchSuggestions';
import gamraticLogo from '../assets/gamratic-logo.png';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/games?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setSearchFocused(false);
    }
  };

  const handleMobileSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && mobileSearch.trim()) {
      navigate(`/games?search=${encodeURIComponent(mobileSearch.trim())}`);
      setMobileSearch('');
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mobileMenuOpen]);

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '90px',
          background: 'rgba(8, 8, 12, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(232, 192, 96, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          zIndex: 1000,
          animation: 'fadeIn 0.4s ease-out',
        }}
      >
        {/* Left: Logo + Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0px',
              textDecoration: 'none',
            }}
          >
            <img
              src={gamraticLogo}
              alt="Gamratic"
              style={{
                width: '80px',
                height: '80px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 8px rgba(232, 192, 96, 0.3))',
              }}
            />
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '36px',
                background: 'linear-gradient(135deg, #e8c060, #f0d890, #d4a43a)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '4px',
                animation: 'gradientShift 4s ease infinite',
              }}
            >
              GAMRATIC
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            {(['/', '/games', '/news', '/community'] as const).map((path) => (
              <Link
                key={path}
                to={path}
                style={{
                  color: isActive(path) ? '#e8c060' : '#f0f0f0',
                  fontSize: '20px',
                  fontFamily: "'Bebas Neue', sans-serif",
                  letterSpacing: '2px',
                  opacity: isActive(path) ? 1 : 0.5,
                  position: 'relative',
                  padding: '4px 0',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => { if (!isActive(path)) e.currentTarget.style.opacity = '0.8'; }}
                onMouseLeave={(e) => { if (!isActive(path)) e.currentTarget.style.opacity = '0.5'; }}
              >
                {path === '/' ? 'HOME' : path === '/games' ? 'GAMES' : path === '/news' ? 'NEWS' : 'COMMUNITY'}
                {isActive(path) && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: '#e8c060',
                      borderRadius: '1px',
                      boxShadow: '0 0 8px #e8c06060',
                    }}
                  />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Search + Auth + Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="nav-search" style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                opacity: searchFocused ? 0.8 : 0.3,
                fontSize: '13px',
                transition: 'opacity 0.2s',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            >
              🔍
            </span>
            <input
              id="nav-search"
              type="text"
              placeholder="Search games..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => {
                // Delay to allow clicking suggestions
                setTimeout(() => setSearchFocused(false), 200);
              }}
              style={{
                background: searchFocused ? 'rgba(14, 14, 20, 0.9)' : 'rgba(14, 14, 20, 0.6)',
                border: `1px solid ${searchFocused ? '#e8c06050' : '#ffffff10'}`,
                borderRadius: '10px',
                color: '#f0f0f0',
                padding: '9px 16px 9px 38px',
                fontSize: '13px',
                width: searchFocused ? '280px' : '200px',
                fontFamily: 'Georgia, serif',
                outline: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: searchFocused ? '0 0 20px #e8c06010' : 'none',
              }}
            />
            {/* Search suggestions dropdown */}
            <SearchSuggestions
              query={search}
              focused={searchFocused}
              onSelect={() => {
                setSearch('');
                setSearchFocused(false);
              }}
            />
          </div>

          {/* Desktop auth */}
          <div className="nav-links">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Link
                  to={`/user/${user.id}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #e8c060, #d4a43a)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '14px',
                      color: '#08080c',
                    }}
                  >
                    {user.username.slice(0, 2).toUpperCase()}
                  </div>
                  <span style={{ color: '#e8c060', fontSize: '14px', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.5px' }}>
                    {user.username}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  style={{
                    background: 'transparent',
                    border: '1px solid #ffffff15',
                    color: '#f0f0f0',
                    opacity: 0.4,
                    fontSize: '12px',
                    padding: '5px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontFamily: "'Bebas Neue', sans-serif",
                    letterSpacing: '1px',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8'; e.currentTarget.style.borderColor = '#ffffff30'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.4'; e.currentTarget.style.borderColor = '#ffffff15'; }}
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <Link to="/auth" style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    background: 'transparent',
                    border: '1px solid #e8c060',
                    color: '#e8c060',
                    padding: '7px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontFamily: "'Bebas Neue', sans-serif",
                    letterSpacing: '1.5px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e8c060';
                    e.currentTarget.style.color = '#08080c';
                    e.currentTarget.style.boxShadow = '0 0 20px #e8c06030';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#e8c060';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  SIGN IN
                </button>
              </Link>
            )}
          </div>

          {/* Hamburger button (mobile) */}
          <button
            className="nav-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              flexDirection: 'column',
              gap: '5px',
            }}
          >
            <span style={{ display: 'block', width: '22px', height: '2px', background: '#e8c060', borderRadius: '1px', transition: 'all 0.3s', transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ display: 'block', width: '22px', height: '2px', background: '#e8c060', borderRadius: '1px', transition: 'all 0.3s', opacity: mobileMenuOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: '22px', height: '2px', background: '#e8c060', borderRadius: '1px', transition: 'all 0.3s', transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            top: '120px',
            left: 0,
            right: 0,
            background: 'rgba(8, 8, 12, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(232, 192, 96, 0.08)',
            padding: '20px 24px',
            zIndex: 999,
            animation: 'fadeInUp 0.2s ease-out',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* Mobile search bar */}
          <div style={{ position: 'relative', marginBottom: '4px' }}>
            <span
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                opacity: 0.4,
                fontSize: '13px',
                pointerEvents: 'none',
              }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Search games..."
              value={mobileSearch}
              onChange={(e) => setMobileSearch(e.target.value)}
              onKeyDown={handleMobileSearch}
              style={{
                width: '100%',
                background: 'rgba(14, 14, 20, 0.8)',
                border: '1px solid #ffffff10',
                borderRadius: '10px',
                color: '#f0f0f0',
                padding: '12px 16px 12px 38px',
                fontSize: '14px',
                fontFamily: 'Georgia, serif',
                outline: 'none',
              }}
            />
          </div>
          <Link to="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '2px', color: isActive('/') ? '#e8c060' : '#f0f0f0', opacity: isActive('/') ? 1 : 0.6, textDecoration: 'none', padding: '8px 0' }}>HOME</Link>
          <Link to="/games" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '2px', color: isActive('/games') ? '#e8c060' : '#f0f0f0', opacity: isActive('/games') ? 1 : 0.6, textDecoration: 'none', padding: '8px 0' }}>GAMES</Link>
          <Link to="/news" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '2px', color: isActive('/news') ? '#e8c060' : '#f0f0f0', opacity: isActive('/news') ? 1 : 0.6, textDecoration: 'none', padding: '8px 0' }}>NEWS</Link>
          <Link to="/community" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '2px', color: isActive('/community') ? '#e8c060' : '#f0f0f0', opacity: isActive('/community') ? 1 : 0.6, textDecoration: 'none', padding: '8px 0' }}>COMMUNITY</Link>
          <div style={{ height: '1px', background: '#ffffff10', margin: '4px 0' }} />
          {user ? (
            <>
              <Link to={`/user/${user.id}`} style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', letterSpacing: '1px', color: '#e8c060', textDecoration: 'none', padding: '8px 0' }}>{user.username}</Link>
              <button onClick={logout} style={{ background: 'transparent', border: '1px solid #ffffff15', color: '#f0f0f0', opacity: 0.5, padding: '10px', borderRadius: '8px', cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px', fontSize: '14px' }}>LOGOUT</button>
            </>
          ) : (
            <Link to="/auth" style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #e8c060, #d4a43a)', color: '#08080c', padding: '12px', borderRadius: '10px', fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', letterSpacing: '2px', textDecoration: 'none' }}>SIGN IN</Link>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-hamburger { display: flex !important; }
          .nav-links { display: none !important; }
        }
      `}</style>
    </>
  );
}
