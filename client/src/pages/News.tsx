import { useInView } from '../hooks/useInView';
import Footer from '../components/Footer';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  readTime: string;
}

const NEWS_DATA: NewsItem[] = [
  {
    id: 1,
    title: 'GTA VI Trailer Breaks YouTube Records',
    excerpt: 'Rockstar Games\' latest trailer for Grand Theft Auto VI has shattered viewership records, accumulating over 200 million views within the first week of release.',
    category: 'INDUSTRY',
    date: 'Mar 10, 2026',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop',
    readTime: '3 min read',
  },
  {
    id: 2,
    title: 'PlayStation 6 Specs Leaked — What We Know',
    excerpt: 'Leaked documents reveal the next-gen PlayStation console may feature custom AMD Zen 6 architecture with advanced ray tracing capabilities.',
    category: 'HARDWARE',
    date: 'Mar 8, 2026',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=400&fit=crop',
    readTime: '5 min read',
  },
  {
    id: 3,
    title: 'Elden Ring DLC "Shadow of the Erdtree" Wins GOTY',
    excerpt: 'FromSoftware\'s ambitious expansion continues to dominate awards season, taking home Game of the Year at multiple ceremonies.',
    category: 'AWARDS',
    date: 'Mar 6, 2026',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
    readTime: '4 min read',
  },
  {
    id: 4,
    title: 'Nintendo Announces New Direct for Spring 2026',
    excerpt: 'A new Nintendo Direct presentation has been confirmed for later this month, promising reveals for first-party titles on the Switch successor.',
    category: 'EVENTS',
    date: 'Mar 5, 2026',
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&h=400&fit=crop',
    readTime: '2 min read',
  },
  {
    id: 5,
    title: 'Steam Breaks 40 Million Concurrent Users',
    excerpt: 'Valve\'s gaming platform has reached a new milestone with over 40 million concurrent users, driven by a surge in indie game popularity.',
    category: 'INDUSTRY',
    date: 'Mar 3, 2026',
    image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=400&fit=crop',
    readTime: '3 min read',
  },
  {
    id: 6,
    title: 'The Rise of AI-Powered NPCs in Modern Games',
    excerpt: 'Game developers are increasingly integrating large language models to create more dynamic and responsive non-player characters.',
    category: 'TECHNOLOGY',
    date: 'Mar 1, 2026',
    image: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=600&h=400&fit=crop',
    readTime: '6 min read',
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  INDUSTRY: '#4ade80',
  HARDWARE: '#60a5fa',
  AWARDS: '#e8c060',
  EVENTS: '#f472b6',
  TECHNOLOGY: '#a78bfa',
};

export default function News() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 32px 64px', width: '100%', flex: 1 }}>
        {/* Header */}
        <div style={{ animation: 'fadeInUp 0.5s ease-out', marginBottom: '40px' }}>
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '42px',
              letterSpacing: '3px',
              marginBottom: '8px',
              background: 'linear-gradient(90deg, #f0f0f0, #e8c060)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Gaming News
          </h1>
          <p style={{ opacity: 0.4, fontSize: '14px', lineHeight: 1.6 }}>
            Stay updated with the latest in gaming
          </p>
        </div>

        {/* Featured article (first item) */}
        <FeaturedArticle article={NEWS_DATA[0]} />

        {/* News grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px',
            marginTop: '40px',
          }}
        >
          {NEWS_DATA.slice(1).map((article, idx) => (
            <NewsCard key={article.id} article={article} index={idx} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

function FeaturedArticle({ article }: { article: NewsItem }) {
  const { ref, inView } = useInView({ threshold: 0.2 });
  const categoryColor = CATEGORY_COLORS[article.category] || '#e8c060';

  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: '32px',
        background: '#0e0e14',
        borderRadius: '16px',
        border: '1px solid #ffffff08',
        overflow: 'hidden',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#e8c06020';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#ffffff08';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Image */}
      <div style={{ height: '320px', overflow: 'hidden' }}>
        <img
          src={article.image}
          alt={article.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />
      </div>
      {/* Content */}
      <div style={{ padding: '32px 32px 32px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span
            style={{
              fontSize: '10px',
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: '2px',
              color: categoryColor,
              background: `${categoryColor}15`,
              padding: '4px 10px',
              borderRadius: '4px',
            }}
          >
            {article.category}
          </span>
          <span style={{ fontSize: '11px', opacity: 0.3 }}>FEATURED</span>
        </div>
        <h2
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '32px',
            letterSpacing: '2px',
            lineHeight: 1.15,
            marginBottom: '16px',
          }}
        >
          {article.title}
        </h2>
        <p style={{ fontSize: '14px', lineHeight: 1.7, opacity: 0.5, marginBottom: '20px' }}>
          {article.excerpt}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', opacity: 0.35 }}>
          <span>{article.date}</span>
          <span>•</span>
          <span>{article.readTime}</span>
        </div>
      </div>
    </div>
  );
}

function NewsCard({ article, index }: { article: NewsItem; index: number }) {
  const { ref, inView } = useInView({ threshold: 0.15 });
  const categoryColor = CATEGORY_COLORS[article.category] || '#e8c060';

  return (
    <div
      ref={ref}
      style={{
        background: '#0e0e14',
        borderRadius: '14px',
        border: '1px solid #ffffff08',
        overflow: 'hidden',
        cursor: 'pointer',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
        transition: `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.08}s`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#e8c06020';
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#ffffff08';
        e.currentTarget.style.transform = inView ? 'translateY(0)' : 'translateY(30px)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Image */}
      <div style={{ height: '180px', overflow: 'hidden' }}>
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        />
      </div>
      {/* Content */}
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <span
            style={{
              fontSize: '10px',
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: '2px',
              color: categoryColor,
              background: `${categoryColor}15`,
              padding: '3px 8px',
              borderRadius: '4px',
            }}
          >
            {article.category}
          </span>
          <span style={{ fontSize: '11px', opacity: 0.25 }}>{article.date}</span>
        </div>
        <h3
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '20px',
            letterSpacing: '1px',
            lineHeight: 1.2,
            marginBottom: '10px',
          }}
        >
          {article.title}
        </h3>
        <p
          style={{
            fontSize: '13px',
            lineHeight: 1.6,
            opacity: 0.45,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const,
          }}
        >
          {article.excerpt}
        </p>
        <div style={{ marginTop: '14px', fontSize: '11px', opacity: 0.3 }}>
          {article.readTime}
        </div>
      </div>
    </div>
  );
}
