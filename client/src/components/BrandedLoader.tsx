export default function BrandedLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = { sm: 40, md: 64, lg: 96 };
  const dim = sizeMap[size];
  const fontSize = { sm: 18, md: 28, lg: 42 }[size];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
      }}
    >
      <div
        style={{
          width: dim,
          height: dim,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Spinning ring */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid #ffffff08',
            borderTopColor: '#e8c060',
            animation: 'spin 1s cubic-bezier(0.5, 0.2, 0.3, 1) infinite',
          }}
        />
        {/* Outer glow ring */}
        <div
          style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #e8c06010, transparent 70%)',
            animation: 'pulseGlow 2s ease-in-out infinite',
          }}
        />
        {/* "G" letter */}
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize,
            background: 'linear-gradient(135deg, #e8c060, #f0d890)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '1px',
            animation: 'float 2s ease-in-out infinite',
          }}
        >
          G
        </span>
      </div>
    </div>
  );
}
