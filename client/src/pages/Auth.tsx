import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        showToast('Welcome back! 👋', 'success');
      } else {
        await register(username, email, password);
        showToast('Account created! 🎮', 'success');
      }
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (focused: boolean): React.CSSProperties => ({
    width: '100%',
    background: focused ? 'rgba(8, 8, 12, 0.9)' : '#08080c',
    border: `1px solid ${focused ? '#e8c06040' : '#ffffff10'}`,
    borderRadius: '10px',
    color: '#f0f0f0',
    padding: '13px 18px',
    fontSize: '14px',
    fontFamily: 'Georgia, serif',
    outline: 'none',
    marginBottom: '16px',
    transition: 'all 0.3s ease',
    boxShadow: focused ? '0 0 20px #e8c06008' : 'none',
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient bg glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, #e8c06008, transparent 70%)',
          pointerEvents: 'none',
          animation: 'float 8s ease-in-out infinite',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(14, 14, 20, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid #ffffff08',
          padding: '44px 36px',
          animation: 'fadeInUp 0.6s ease-out',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '40px',
              background: 'linear-gradient(135deg, #e8c060, #f0d890, #d4a43a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '5px',
            }}
          >
            GAMRATIC
          </h1>
          <p style={{ fontSize: '13px', opacity: 0.3, marginTop: '6px', letterSpacing: '2px' }}>
            Rate. Review. Discover.
          </p>
        </div>

        {/* Toggle tabs */}
        <div style={{ display: 'flex', marginBottom: '28px', background: '#ffffff06', borderRadius: '10px', padding: '3px' }}>
          {(['login', 'register'] as const).map((mode) => (
            <button
              key={mode}
              id={`auth-${mode}-tab`}
              onClick={() => { setIsLogin(mode === 'login'); setError(''); }}
              style={{
                flex: 1,
                background: (isLogin ? mode === 'login' : mode === 'register') ? '#ffffff0a' : 'transparent',
                border: 'none',
                color: (isLogin ? mode === 'login' : mode === 'register') ? '#e8c060' : '#f0f0f0',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '15px',
                letterSpacing: '2px',
                padding: '10px',
                cursor: 'pointer',
                borderRadius: '8px',
                opacity: (isLogin ? mode === 'login' : mode === 'register') ? 1 : 0.35,
                transition: 'all 0.2s ease',
              }}
            >
              {mode === 'login' ? 'LOG IN' : 'REGISTER'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              id="auth-username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle(false)}
              onFocus={(e) => Object.assign(e.currentTarget.style, inputStyle(true))}
              onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle(false))}
            />
          )}
          <input
            id="auth-email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle(false)}
            onFocus={(e) => Object.assign(e.currentTarget.style, inputStyle(true))}
            onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle(false))}
          />
          <input
            id="auth-password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle(false)}
            onFocus={(e) => Object.assign(e.currentTarget.style, inputStyle(true))}
            onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle(false))}
          />

          {error && (
            <div
              style={{
                background: '#f8717110',
                border: '1px solid #f8717130',
                borderRadius: '8px',
                padding: '10px 14px',
                marginBottom: '16px',
                animation: 'fadeIn 0.3s ease-out',
              }}
            >
              <p style={{ color: '#f87171', fontSize: '13px' }}>{error}</p>
            </div>
          )}

          <button
            id="auth-submit"
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#ffffff10' : 'linear-gradient(135deg, #e8c060, #d4a43a)',
              color: loading ? '#ffffff30' : '#08080c',
              border: 'none',
              padding: '14px',
              borderRadius: '10px',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '18px',
              letterSpacing: '3px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: loading ? 'none' : '0 4px 20px #e8c06025',
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.boxShadow = '0 8px 30px #e8c06040'; }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.boxShadow = '0 4px 20px #e8c06025'; }}
          >
            {loading ? 'PLEASE WAIT...' : isLogin ? 'LOG IN' : 'CREATE ACCOUNT'}
          </button>
        </form>
      </div>
    </div>
  );
}
