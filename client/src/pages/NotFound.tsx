import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, #e8c06008, transparent 70%)',
          pointerEvents: 'none',
          animation: 'float 6s ease-in-out infinite',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, animation: 'fadeInUp 0.6s ease-out' }}>
        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '140px',
            background: 'linear-gradient(135deg, #e8c060, #d4a43a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '10px',
            lineHeight: 1,
            opacity: 0.2,
          }}
        >
          404
        </h1>
        <h2
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '30px',
            letterSpacing: '3px',
            marginBottom: '12px',
            opacity: 0.6,
          }}
        >
          Page Not Found
        </h2>
        <p style={{ fontSize: '14px', opacity: 0.3, marginBottom: '28px', lineHeight: 1.6 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #e8c060, #d4a43a)',
            color: '#08080c',
            padding: '12px 28px',
            borderRadius: '10px',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '16px',
            letterSpacing: '2px',
            textDecoration: 'none',
            boxShadow: '0 4px 20px #e8c06025',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 30px #e8c06040'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px #e8c06025'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          BACK TO HOME
        </Link>
      </div>
    </div>
  );
}
