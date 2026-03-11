/** SVG-based platform icons — no emojis per design system rules */

const PC_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const PLAYSTATION_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.5 2v15.5l3.5 1.3V5.3c0-.7.3-1 .8-.8.6.2.8.8.8 1.5v6.7c2.1 1 3.4.3 3.4-2.2 0-2.6-1.1-4-3.5-4.9V2c4.3 1.2 6.5 3.6 6.5 7 0 3.8-2.2 5.4-6.5 3.7v7l-2-.7V2H9.5zm-5 14.3c2.3.8 5.8.4 5.8-2.6 0-2.7-2.3-3.8-4-4.4l-1-.4V6.5l1.5.5V4.8L2 3.2v2.2l2.5.9v5.2c-2.7-1-4.5.1-4.5 2.4 0 2.2 1.8 3.4 4.5 2.6zm-1.8-2.5c0-1 .6-1.4 1.8-1v3c-1.2.3-1.8-.2-1.8-1v-1z"/>
  </svg>
);

const XBOX_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 1.5c1.41 0 2.73.37 3.88 1.01-.37.2-.84.57-1.41 1.1C13.14 4.56 12.58 4 12 4s-1.14.56-2.47 1.61c-.57-.53-1.04-.9-1.41-1.1A8.46 8.46 0 0112 3.5zM4.5 12c0-1.85.67-3.55 1.77-4.88.43.43 1.14 1.2 2.05 2.3C6.74 11.61 5.5 14.03 5.15 15a8.46 8.46 0 01-.65-3zm7.5 8.5c-2.53 0-4.78-1.11-6.33-2.87.5-.73 1.95-2.43 4.62-4.75 1.09 1.4 2.17 2.55 3.21 3.43-.8.63-1.5 1.2-2 1.6a8.54 8.54 0 01-.5 2.59c.33.03.66.05 1 .05s.67-.02 1-.05a8.54 8.54 0 01-.5-2.59c-.5-.4-1.2-.97-2-1.6 1.04-.88 2.12-2.03 3.21-3.43 2.67 2.32 4.12 4.02 4.62 4.75A8.46 8.46 0 0112 20.5zm7.35-5.5c-.35-.97-1.59-3.39-3.17-5.58.91-1.1 1.62-1.87 2.05-2.3A8.46 8.46 0 0119.5 12c0 1.07-.2 2.1-.65 3z"/>
  </svg>
);

const NINTENDO_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 3C4.79 3 3 4.79 3 7v10c0 2.21 1.79 4 4 4h3V3H7zm0 13c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM14 3v18h3c2.21 0 4-1.79 4-4V7c0-2.21-1.79-4-4-4h-3zm3 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
  </svg>
);

const platformMap: Record<string, { icon: React.ReactNode; label: string }> = {
  pc: { icon: PC_ICON, label: 'PC' },
  windows: { icon: PC_ICON, label: 'PC' },
  mac: { icon: PC_ICON, label: 'Mac' },
  playstation: { icon: PLAYSTATION_ICON, label: 'PlayStation' },
  ps4: { icon: PLAYSTATION_ICON, label: 'PS4' },
  ps5: { icon: PLAYSTATION_ICON, label: 'PS5' },
  xbox: { icon: XBOX_ICON, label: 'Xbox' },
  'xbox one': { icon: XBOX_ICON, label: 'Xbox One' },
  'xbox series x': { icon: XBOX_ICON, label: 'Xbox Series X' },
  'xbox series s': { icon: XBOX_ICON, label: 'Xbox Series S' },
  'xbox series x|s': { icon: XBOX_ICON, label: 'Xbox Series X|S' },
  nintendo: { icon: NINTENDO_ICON, label: 'Nintendo' },
  'nintendo switch': { icon: NINTENDO_ICON, label: 'Nintendo Switch' },
  switch: { icon: NINTENDO_ICON, label: 'Switch' },
};

export function getUniquePlatformIcons(platforms: string[]) {
  const seen = new Set<string>();
  const result: { icon: React.ReactNode; label: string }[] = [];

  for (const p of platforms) {
    const key = p.toLowerCase();
    const entry = platformMap[key];
    if (entry && !seen.has(entry.label.split(' ')[0])) {
      seen.add(entry.label.split(' ')[0]);
      result.push(entry);
    }
  }
  return result;
}
