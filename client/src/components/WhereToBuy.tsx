import { useState } from 'react';
import type { Game } from '../types';

interface BuyLink {
  store: string;
  logo: string;
  platform: string;
  price: number;
  originalPrice: number | null;
  discount: number | null;
  url: string;
}

/** Retailer visual configs */
const RETAILERS: Record<string, { bg: string; color: string; logo: string }> = {
  Amazon: { bg: '#232f3e', color: '#ff9900', logo: 'amazon' },
  'Best Buy': { bg: '#0046be', color: '#fff200', logo: 'bestbuy' },
  GameStop: { bg: '#1a1a1a', color: '#e12726', logo: 'gamestop' },
  Target: { bg: '#cc0000', color: '#ffffff', logo: 'target' },
  Steam: { bg: '#1b2838', color: '#66c0f4', logo: 'steam' },
  'Epic Games': { bg: '#2a2a2a', color: '#ffffff', logo: 'epic' },
  'GOG.com': { bg: '#421463', color: '#ffffff', logo: 'gog' },
  'PlayStation Store': { bg: '#003087', color: '#ffffff', logo: 'ps' },
  'Xbox Store': { bg: '#107c10', color: '#ffffff', logo: 'xbox' },
  'Nintendo eShop': { bg: '#e60012', color: '#ffffff', logo: 'nintendo' },
  Fanatical: { bg: '#ff6600', color: '#ffffff', logo: 'fanatical' },
};

/** Generate buy links from game platforms, deterministic per game */
function generateBuyLinks(game: Game): { platform: string; links: BuyLink[] }[] {
  const seed = game.id;
  const basePrice = 59.99;
  const groupMap: Record<string, BuyLink[]> = {};

  const platformRetailers: Record<string, { store: string; priceRange: [number, number] }[]> = {
    'PlayStation 5': [
      { store: 'Amazon', priceRange: [24.99, 49.99] },
      { store: 'Target', priceRange: [29.99, 54.99] },
      { store: 'Best Buy', priceRange: [34.99, 59.99] },
      { store: 'GameStop', priceRange: [39.99, 69.99] },
      { store: 'PlayStation Store', priceRange: [39.99, 69.99] },
    ],
    'Xbox Series X': [
      { store: 'Amazon', priceRange: [24.99, 49.99] },
      { store: 'GameStop', priceRange: [39.99, 69.99] },
      { store: 'Best Buy', priceRange: [34.99, 69.99] },
      { store: 'Xbox Store', priceRange: [39.99, 69.99] },
    ],
    PC: [
      { store: 'Steam', priceRange: [9.99, 59.99] },
      { store: 'Epic Games', priceRange: [14.99, 59.99] },
      { store: 'Fanatical', priceRange: [9.99, 39.99] },
      { store: 'GOG.com', priceRange: [14.99, 49.99] },
    ],
    'Nintendo Switch': [
      { store: 'Amazon', priceRange: [29.99, 59.99] },
      { store: 'Best Buy', priceRange: [39.99, 59.99] },
      { store: 'GameStop', priceRange: [39.99, 59.99] },
      { store: 'Nintendo eShop', priceRange: [39.99, 59.99] },
    ],
    'PlayStation 4': [
      { store: 'Amazon', priceRange: [14.99, 39.99] },
      { store: 'GameStop', priceRange: [19.99, 39.99] },
      { store: 'PlayStation Store', priceRange: [19.99, 49.99] },
    ],
    'Xbox One': [
      { store: 'Amazon', priceRange: [14.99, 39.99] },
      { store: 'GameStop', priceRange: [19.99, 39.99] },
      { store: 'Xbox Store', priceRange: [19.99, 49.99] },
    ],
  };

  // Map common platform names
  const platformAliases: Record<string, string> = {
    PS5: 'PlayStation 5',
    PS4: 'PlayStation 4',
    Xbox: 'Xbox Series X',
    Switch: 'Nintendo Switch',
    Windows: 'PC',
    Mac: 'PC',
    Linux: 'PC',
  };

  const gamePlatforms = game.platforms.map((p) => platformAliases[p] || p);
  const uniquePlatforms = [...new Set(gamePlatforms)];

  uniquePlatforms.forEach((platform) => {
    const retailers = platformRetailers[platform];
    if (!retailers) return;

    const links: BuyLink[] = retailers.map((r, i) => {
      // Deterministic "random" price
      const priceSeed = (seed * 7 + i * 13 + platform.length * 3) % 100;
      const [min, max] = r.priceRange;
      const price = +(min + ((priceSeed / 100) * (max - min))).toFixed(2);
      const hasDiscount = price < basePrice * 0.85;
      const discount = hasDiscount ? -Math.round(((basePrice - price) / basePrice) * 100) : null;

      // Generate a search URL for the store
      const encodedTitle = encodeURIComponent(game.title);
      const storeUrls: Record<string, string> = {
        Amazon: `https://www.amazon.com/s?k=${encodedTitle}+${platform}+game`,
        'Best Buy': `https://www.bestbuy.com/site/searchpage.jsp?st=${encodedTitle}`,
        GameStop: `https://www.gamestop.com/search/?q=${encodedTitle}`,
        Target: `https://www.target.com/s?searchTerm=${encodedTitle}`,
        Steam: `https://store.steampowered.com/search/?term=${encodedTitle}`,
        'Epic Games': `https://store.epicgames.com/browse?q=${encodedTitle}`,
        'GOG.com': `https://www.gog.com/games?search=${encodedTitle}`,
        'PlayStation Store': `https://store.playstation.com/search/${encodedTitle}`,
        'Xbox Store': `https://www.xbox.com/games/store/search/${encodedTitle}`,
        'Nintendo eShop': `https://www.nintendo.com/search/#q=${encodedTitle}`,
        Fanatical: `https://www.fanatical.com/search?search=${encodedTitle}`,
      };

      return {
        store: r.store,
        logo: RETAILERS[r.store]?.logo || 'store',
        platform,
        price,
        originalPrice: hasDiscount ? basePrice : null,
        discount,
        url: storeUrls[r.store] || '#',
      };
    });

    // Sort by price
    links.sort((a, b) => a.price - b.price);

    if (!groupMap[platform]) groupMap[platform] = [];
    groupMap[platform].push(...links);
  });

  return Object.entries(groupMap).map(([platform, links]) => ({ platform, links }));
}

/** Retailer logo URLs — using Google favicon service for reliability */
const RETAILER_LOGOS: Record<string, string> = {
  Amazon: 'https://www.google.com/s2/favicons?domain=amazon.com&sz=64',
  'Best Buy': 'https://www.google.com/s2/favicons?domain=bestbuy.com&sz=64',
  GameStop: 'https://www.google.com/s2/favicons?domain=gamestop.com&sz=64',
  Target: 'https://www.google.com/s2/favicons?domain=target.com&sz=64',
  Steam: 'https://www.google.com/s2/favicons?domain=store.steampowered.com&sz=64',
  'Epic Games': 'https://www.google.com/s2/favicons?domain=epicgames.com&sz=64',
  'GOG.com': 'https://www.google.com/s2/favicons?domain=gog.com&sz=64',
  'PlayStation Store': 'https://www.google.com/s2/favicons?domain=store.playstation.com&sz=64',
  'Xbox Store': 'https://www.google.com/s2/favicons?domain=xbox.com&sz=64',
  'Nintendo eShop': 'https://www.google.com/s2/favicons?domain=nintendo.com&sz=64',
  Fanatical: 'https://www.google.com/s2/favicons?domain=fanatical.com&sz=64',
};

/** Retailer logo badge with brand colors and actual logos */
function RetailerBadge({ store }: { store: string }) {
  const config = RETAILERS[store] || { bg: '#333', color: '#fff', logo: store };
  const logoUrl = RETAILER_LOGOS[store];

  return (
    <div
      style={{
        width: '90px',
        height: '40px',
        borderRadius: '8px',
        background: config.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '6px 10px',
        overflow: 'hidden',
      }}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={store}
          style={{
            maxWidth: '70%',
            maxHeight: '70%',
            objectFit: 'contain',
            borderRadius: '4px',
          }}
          onError={(e) => {
            // Fallback to text if image fails
            const parent = e.currentTarget.parentElement;
            if (parent) {
              e.currentTarget.style.display = 'none';
              const fallback = document.createElement('span');
              fallback.textContent = store;
              fallback.style.cssText = `color:${config.color};font-weight:900;font-size:${store.length > 10 ? '9px' : '11px'};text-transform:uppercase;letter-spacing:0.5px;text-align:center;line-height:1.2`;
              parent.appendChild(fallback);
            }
          }}
        />
      ) : (
        <span
          style={{
            color: config.color,
            fontWeight: 900,
            fontSize: store.length > 10 ? '9px' : '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          {store}
        </span>
      )}
    </div>
  );
}

export default function WhereToBuy({ game }: { game: Game }) {
  const buyGroups = generateBuyLinks(game);
  const [expanded, setExpanded] = useState(false);

  if (buyGroups.length === 0) return null;

  // Flatten all links, show first 3 when collapsed
  const allLinks = buyGroups.flatMap((g) => g.links);
  const totalCount = allLinks.length;
  const COLLAPSED_LIMIT = 3;
  const needsToggle = totalCount > COLLAPSED_LIMIT;

  // When collapsed, only show first group's links (capped at 3)
  const visibleGroups = expanded
    ? buyGroups
    : buyGroups.slice(0, 1).map((g) => ({ ...g, links: g.links.slice(0, COLLAPSED_LIMIT) }));

  return (
    <div
      style={{
        background: '#0e0e14',
        borderRadius: '14px',
        border: '1px solid #ffffff08',
        padding: '28px',
        marginBottom: '28px',
        animation: 'fadeInUp 0.3s ease-out both',
      }}
    >
      <h3
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '16px',
          letterSpacing: '3px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#f0f0f0',
        }}
      >
        <span style={{ fontSize: '18px' }}>🛒</span>
        WHERE TO BUY
      </h3>

      {visibleGroups.map((group, groupIdx) => (
        <div key={group.platform}>
          {/* Platform divider */}
          {groupIdx > 0 && (
            <div style={{ borderTop: '1px solid #ffffff08', marginTop: '20px', marginBottom: '20px' }} />
          )}
          <p
            style={{
              fontSize: '11px',
              color: '#666',
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: '2px',
              marginBottom: '14px',
              paddingBottom: '8px',
              borderBottom: groupIdx === 0 ? '1px solid #ffffff06' : 'none',
            }}
          >
            {group.platform}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {group.links.map((link) => (
              <a
                key={`${link.store}-${link.platform}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(232, 192, 96, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
                }}
              >
                {/* Store logo badge */}
                <RetailerBadge store={link.store} />

                {/* Store name + platform */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: '#f0f0f0', fontSize: '13px', fontWeight: 600 }}>{link.store}</p>
                  <p style={{ color: '#555', fontSize: '11px' }}>{link.platform}</p>
                </div>

                {/* Discount badge */}
                {link.discount && (
                  <span
                    style={{
                      background: '#e8c060',
                      color: '#08080c',
                      fontSize: '10px',
                      fontWeight: 900,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {link.discount}%
                  </span>
                )}

                {/* Price */}
                <div style={{ textAlign: 'right', minWidth: '70px' }}>
                  <span style={{ color: '#f0f0f0', fontSize: '15px', fontWeight: 700 }}>
                    ${link.price.toFixed(2)}
                  </span>
                  {link.originalPrice && (
                    <span
                      style={{
                        color: '#555',
                        fontSize: '11px',
                        textDecoration: 'line-through',
                        marginLeft: '6px',
                      }}
                    >
                      ${link.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Buy button */}
                <div
                  style={{
                    padding: '8px 16px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '8px',
                    color: '#f0f0f0',
                    fontSize: '11px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s',
                  }}
                >
                  Buy Now
                  <span style={{ fontSize: '10px', opacity: 0.6 }}>↗</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}

      {/* Show More / Show Less toggle */}
      {needsToggle && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            width: '100%',
            padding: '12px',
            marginTop: '16px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '10px',
            color: '#e8c060',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '13px',
            letterSpacing: '2px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
        >
          {expanded ? '▲ SHOW LESS' : `▼ SHOW ALL ${totalCount} STORES`}
        </button>
      )}

      <p
        style={{
          color: '#333',
          fontSize: '10px',
          marginTop: '16px',
          lineHeight: 1.5,
        }}
      >
        * Prices may vary. Links open in a new tab.
      </p>
    </div>
  );
}
