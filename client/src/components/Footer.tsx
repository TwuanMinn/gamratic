import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(232, 192, 96, 0.08)',
        background: 'linear-gradient(180deg, #08080c, #0a0a10)',
        padding: '48px 40px 32px',
        marginTop: 'auto',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          {/* Logo + tagline */}
          <div>
            <Link
              to="/"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '28px',
                background: 'linear-gradient(135deg, #e8c060, #f0d890, #d4a43a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '4px',
                textDecoration: 'none',
              }}
            >
              GAMRATIC
            </Link>
            <p style={{ fontSize: '13px', opacity: 0.35, marginTop: '6px', maxWidth: '280px', lineHeight: 1.5 }}>
              Rate. Review. Discover.<br />
              Your definitive source for game reviews.
            </p>
          </div>

          {/* Nav columns */}
          <div style={{ display: 'flex', gap: '64px' }}>
            <div>
              <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '2px', opacity: 0.4, marginBottom: '12px' }}>
                EXPLORE
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link to="/" style={{ fontSize: '13px', opacity: 0.5, textDecoration: 'none' }}>Home</Link>
                <Link to="/games" style={{ fontSize: '13px', opacity: 0.5, textDecoration: 'none' }}>Game Catalog</Link>
                <Link to="/news" style={{ fontSize: '13px', opacity: 0.5, textDecoration: 'none' }}>News</Link>
              </div>
            </div>
            <div>
              <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '2px', opacity: 0.4, marginBottom: '12px' }}>
                ACCOUNT
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link to="/auth" style={{ fontSize: '13px', opacity: 0.5, textDecoration: 'none' }}>Sign In</Link>
                <Link to="/auth" style={{ fontSize: '13px', opacity: 0.5, textDecoration: 'none' }}>Register</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #e8c06015, transparent)', marginBottom: '20px' }} />

        {/* Bottom row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '12px', opacity: 0.25 }}>
            © {new Date().getFullYear()} Gamratic. Built with passion for gamers.
          </p>
          <p style={{ fontSize: '11px', opacity: 0.2 }}>
            v1.0.0
          </p>
        </div>
      </div>
    </footer>
  );
}
