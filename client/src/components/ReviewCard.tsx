import { useState } from 'react';
import type { Review } from '../types';
import ScoreBadge from './ScoreBadge';
import { useToast } from './Toast';

interface ReviewCardProps {
  review: Review;
}

function getInitials(username: string): string {
  return username.slice(0, 2).toUpperCase();
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const [voted, setVoted] = useState(false);
  const [localVotes, setLocalVotes] = useState(review.helpfulVotes);
  const [voteHovered, setVoteHovered] = useState(false);
  const { showToast } = useToast();

  const handleVote = () => {
    if (voted) return;
    setVoted(true);
    setLocalVotes((prev) => prev + 1);
    showToast('Marked as helpful!', 'success');
  };

  return (
    <div
      style={{
        background: '#0e0e14',
        borderRadius: '10px',
        border: '1px solid #ffffff10',
        padding: '20px',
        marginBottom: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        {/* Avatar initials */}
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#ffffff10',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '16px',
            color: '#e8c060',
            flexShrink: 0,
          }}
        >
          {review.user ? getInitials(review.user.username) : '??'}
        </div>

        <div style={{ flex: 1 }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div>
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                {review.user?.username || 'Anonymous'}
              </span>
              <span style={{ opacity: 0.4, fontSize: '12px', marginLeft: '10px' }}>
                {formatDate(review.createdAt)}
              </span>
            </div>
            <ScoreBadge score={review.score * 10} size="sm" />
          </div>

          {/* Body */}
          <p style={{ fontSize: '14px', lineHeight: 1.6, opacity: 0.8 }}>
            {review.body}
          </p>

          {/* Helpful vote button */}
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={handleVote}
              onMouseEnter={() => setVoteHovered(true)}
              onMouseLeave={() => setVoteHovered(false)}
              disabled={voted}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: voted ? '#e8c06010' : voteHovered ? '#ffffff08' : 'transparent',
                border: `1px solid ${voted ? '#e8c06030' : '#ffffff10'}`,
                borderRadius: '8px',
                padding: '6px 14px',
                cursor: voted ? 'default' : 'pointer',
                fontSize: '12px',
                color: voted ? '#e8c060' : '#f0f0f0',
                opacity: voted ? 0.8 : voteHovered ? 0.7 : 0.4,
                transition: 'all 0.2s ease',
                fontFamily: 'Georgia, serif',
              }}
            >
              <span style={{ fontSize: '14px' }}>{voted ? '✓' : '👍'}</span>
              {voted ? 'Helpful' : 'Helpful'}
            </button>
            {localVotes > 0 && (
              <span style={{ fontSize: '11px', opacity: 0.3 }}>
                {localVotes} found this helpful
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
