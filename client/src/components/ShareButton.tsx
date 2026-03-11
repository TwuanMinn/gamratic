import { useState } from 'react';
import { useToast } from './Toast';

interface ShareButtonProps {
  title: string;
}

export default function ShareButton({ title }: ShareButtonProps) {
  const [hovered, setHovered] = useState(false);
  const { showToast } = useToast();

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: `${title} — Gamratic`, url });
        return;
      } catch {
        // User cancelled or share failed, fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      showToast('Link copied to clipboard! 🔗', 'success');
    } catch {
      showToast('Could not copy link', 'error');
    }
  };

  return (
    <button
      onClick={handleShare}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: hovered ? '#ffffff10' : 'transparent',
        border: `1px solid ${hovered ? '#ffffff25' : '#ffffff10'}`,
        borderRadius: '10px',
        padding: '10px 20px',
        cursor: 'pointer',
        color: '#f0f0f0',
        fontSize: '13px',
        fontFamily: "'Bebas Neue', sans-serif",
        letterSpacing: '1.5px',
        transition: 'all 0.2s ease',
        opacity: hovered ? 0.9 : 0.5,
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
      SHARE
    </button>
  );
}
