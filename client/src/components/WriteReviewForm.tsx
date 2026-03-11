import { useState } from 'react';
import ScoreBadge from './ScoreBadge';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './Toast';
import { apiUrl } from '../lib/api';

interface WriteReviewFormProps {
  gameId: number;
  onSubmitted: () => void;
}

export default function WriteReviewForm({ gameId, onSubmitted }: WriteReviewFormProps) {
  const { user } = useAuth();
  const [score, setScore] = useState(7);
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  if (!user) {
    return (
      <div
        style={{
          background: '#0e0e14',
          borderRadius: '10px',
          border: '1px solid #ffffff10',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <p style={{ opacity: 0.5, fontSize: '14px' }}>Sign in to write a review</p>
      </div>
    );
  }

  const charCount = body.trim().length;
  const canSubmit = charCount >= 30 && !submitting;

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch(apiUrl(`/api/games/${gameId}/reviews`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ score, body: body.trim() }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to submit review');
      setBody('');
      setScore(7);
      showToast('Review submitted! 🎮', 'success');
      onSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        background: '#0e0e14',
        borderRadius: '10px',
        border: '1px solid #ffffff10',
        padding: '24px',
      }}
    >
      <h3
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '20px',
          letterSpacing: '1px',
          marginBottom: '16px',
        }}
      >
        Write a Review
      </h3>

      {/* Score slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <span style={{ fontSize: '13px', opacity: 0.5, minWidth: '60px' }}>Your Score:</span>
        <input
          id="review-score-slider"
          type="range"
          min={1}
          max={10}
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          style={{ flex: 1, accentColor: '#e8c060' }}
        />
        <ScoreBadge score={score * 10} size="md" />
      </div>

      {/* Text area */}
      <textarea
        id="review-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Share your thoughts on this game... (minimum 30 characters)"
        style={{
          width: '100%',
          minHeight: '120px',
          background: '#08080c',
          border: '1px solid #ffffff10',
          borderRadius: '8px',
          color: '#f0f0f0',
          padding: '14px',
          fontSize: '14px',
          fontFamily: 'Georgia, serif',
          lineHeight: 1.6,
          resize: 'vertical',
          outline: 'none',
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = '#e8c060'; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = '#ffffff10'; }}
      />

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
        <span style={{ fontSize: '12px', opacity: charCount >= 30 ? 0.5 : 0.8, color: charCount >= 30 ? '#f0f0f0' : '#fb923c' }}>
          {charCount}/30 characters
        </span>
        <button
          id="review-submit"
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{
            background: canSubmit ? '#e8c060' : '#ffffff10',
            color: canSubmit ? '#08080c' : '#ffffff30',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '8px',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '16px',
            letterSpacing: '1px',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            transition: 'background 0.2s, transform 0.1s',
          }}
        >
          {submitting ? 'Submitting...' : 'SUBMIT REVIEW'}
        </button>
      </div>

      {error && (
        <p style={{ color: '#f87171', fontSize: '13px', marginTop: '10px' }}>{error}</p>
      )}
    </div>
  );
}
