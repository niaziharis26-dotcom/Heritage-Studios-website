export const dynamic = 'force-dynamic';
import Link from 'next/link';
import db from '@/lib/db';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/siteConfig';

const PAGE_URL = `${SITE_URL}/social-media`;

export const metadata = {
  title: `Social Media Management & Content Services | ${SITE_NAME}`,
  description:
    'Heritage Studios delivers premium social media content strategy, video editing, platform management, and paid social creatives for brands that demand attention — across Instagram, TikTok, YouTube, LinkedIn, and Facebook.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: `Social Media Management & Content Services | ${SITE_NAME}`,
    description:
      'Premium social media content, strategy, and platform management — engineered to grow your brand across Instagram, TikTok, YouTube, LinkedIn, and Facebook.',
    url: PAGE_URL,
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: `${SITE_NAME} Social Media Services` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Social Media Management & Content Services | ${SITE_NAME}`,
    description: 'Premium social media content strategy and platform management for ambitious brands.',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function SocialMediaPage() {
  const settings = db.get('settings') || {};
  const services = db.get('services') || [];

  const creativeSvcs = services.filter(s => s.published && s.category === 'Creative').slice(0, 3);

  const waHref = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hi Heritage Studios, I'm interested in your Social Media services.")}`
    : '/contact';

  const platforms = [
    { name: 'Instagram', icon: '📸', handle: settings.instagramUrl, color: '#E1306C', desc: 'Premium reels, carousels, and feed content. Strategy-driven posts engineered for follower growth and brand authority.' },
    { name: 'TikTok',    icon: '🎬', handle: settings.tiktokUrl,    color: '#010101', desc: 'High-retention short-form content with dynamic editing, captions, and trend-aligned creative strategy.' },
    { name: 'YouTube',   icon: '▶',  handle: settings.youtubeUrl,   color: '#FF0000', desc: 'Long-form video editing, thumbnail design, SEO-optimised titles, and channel growth consulting.' },
    { name: 'LinkedIn',  icon: '💼', handle: settings.linkedinUrl,  color: '#0A66C2', desc: 'Thought leadership content, B2B positioning, and professional brand campaigns for executives and companies.' },
    { name: 'Facebook',  icon: '👤', handle: settings.facebookUrl,  color: '#1877F2', desc: 'Community management, ad creative production, and organic content for Facebook brand pages and groups.' },
  ];

  const offerings = [
    { title: 'Content Production', desc: 'End-to-end content creation — scripting, filming direction, editing, and post-production ready for multi-platform publishing.', icon: '🎥' },
    { title: 'Platform Strategy', desc: 'Data-driven social media strategy with clear objectives, audience research, and content calendars tailored to each platform.', icon: '📊' },
    { title: 'Short-Form Video', desc: 'TikTok, Reels, and Shorts — dynamic short-form content engineered for high retention, engagement, and virality.', icon: '⚡' },
    { title: 'Brand Storytelling', desc: 'Consistent visual identity and narrative across every platform — ensuring your brand presence feels premium and intentional.', icon: '✦' },
    { title: 'Community Management', desc: 'Active engagement, comment moderation, and audience nurturing to build a loyal, highly-engaged online community.', icon: '🤝' },
    { title: 'Paid Social Creatives', desc: 'High-converting ad creatives for Meta, TikTok, and LinkedIn — designed to reduce CPM and maximise ROAS.', icon: '🎯' },
  ];

  return (
    <>
      {/* ── Hero ── */}
      <section className="page-hero surface-light">
        <div className="container">
          <div className="page-hero-inner animate-fade-up">
            <span className="eyebrow">Social Media</span>
            <h1>Build a Premium Brand Presence Online</h1>
            <p style={{ marginTop: '1.25rem', fontSize: 'var(--text-lg)', maxWidth: '620px', color: 'var(--hs-text-400)' }}>
              We engineer social media content that commands attention, builds audiences, and converts followers into customers — across every major platform.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">Start a Campaign</a>
              <Link href="/contact" className="btn btn-outline btn-lg">Discuss Your Strategy</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── What We Offer ── */}
      <section className="section surface-white">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Services</span>
            <h2>What We Deliver</h2>
            <p>Comprehensive social media solutions for brands that refuse to blend in.</p>
          </div>
          <div className="grid-3" style={{ gap: '1.25rem' }}>
            {offerings.map((o, i) => (
              <div key={i} className="cap-card">
                <div className="cap-icon" aria-hidden="true">{o.icon}</div>
                <h3>{o.title}</h3>
                <p>{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Platforms & Social Channels ── */}
      <section className="section surface-dark">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Platforms & Social Channels</span>
            <h2>Our Official Channels & Managed Platforms</h2>
            <p style={{ color: 'var(--hs-text-inv-60)' }}>Follow our channels to see our latest creative content, case studies, and video productions.</p>
          </div>
          <div className="social-platform-grid">
            {platforms.map(p => (
              <div key={p.name} className="card card-glass" style={{ borderRadius: 'var(--r-xl)', padding: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '1.75rem' }} aria-hidden="true">{p.icon}</span>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--hs-text-inv)' }}>{p.name}</h3>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--hs-text-inv-60)', lineHeight: 1.7 }}>{p.desc}</p>
                <a href={p.handle || waHref} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '1.5rem', color: 'var(--hs-emerald)', fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                  {p.handle ? `Visit Our ${p.name} ↗` : `Connect on ${p.name} ↗`}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Content Feed Showcase ── */}
      <section className="section surface-white">
        <div className="container">
          <div className="section-header centered text-center">
            <span className="eyebrow">Content Feed</span>
            <h2>Latest Content & Creative Reels</h2>
            <p>A sample of short-form videos, carousel designs, and creative social posts produced by our studio.</p>
          </div>

          <div className="grid-3" style={{ gap: '1.5rem' }}>
            {[
              { type: 'Instagram Reel', title: 'Aura Luxe Brand Commercial', views: '124K Views', tag: 'Short-Form Video', gradient: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)' },
              { type: 'TikTok Ad', title: 'Shopify Store Conversion Showcase', views: '98K Views', tag: 'High ROAS Ad', gradient: 'linear-gradient(135deg, #00f2fe, #4facfe)' },
              { type: 'YouTube Docuseries', title: 'Quantum Tech Product Launch', views: '450K Views', tag: 'Long-Form Video', gradient: 'linear-gradient(135deg, #ff416c, #ff4b2b)' },
            ].map((feed, i) => (
              <div key={i} className="card card-light" style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '220px', background: feed.gradient, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem', position: 'relative' }}>
                  <span className="badge" style={{ alignSelf: 'flex-start', background: 'rgba(0,0,0,0.4)', color: '#fff', backdropFilter: 'blur(8px)' }}>{feed.tag}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontWeight: 700 }}>
                    <span style={{ fontSize: '1.5rem' }}>▶</span>
                    <span>{feed.views}</span>
                  </div>
                </div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--hs-emerald)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>{feed.type}</div>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--hs-text-900)', marginBottom: '0.75rem' }}>{feed.title}</h3>
                  </div>
                  <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ marginTop: '1rem', width: '100%' }}>
                    Order Similar Content
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Heritage ── */}
      <section className="section surface-light">
        <div className="container">
          <div className="section-header centered text-center">
            <span className="eyebrow">Why Heritage Studios</span>
            <h2>Not a Social Media Agency. A Creative Technology Studio.</h2>
            <p style={{ margin: '0 auto', maxWidth: '600px' }}>
              We combine creative direction, technical production, and data analytics to build social media programs that actually grow brands — not just follower counts.
            </p>
          </div>
          <div className="grid-3" style={{ gap: '1.5rem', marginTop: '3.5rem' }}>
            {[
              { num: '500K+', label: 'Organic views produced', sub: 'Across client accounts' },
              { num: '3.8x',  label: 'Average engagement increase', sub: 'vs. industry baseline' },
              { num: '24h',   label: 'Content turnaround', sub: 'For short-form videos' },
            ].map(s => (
              <div key={s.label} className="card card-light text-center" style={{ borderRadius: 'var(--r-xl)', padding: '2.5rem 2rem' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800, color: 'var(--hs-emerald)', lineHeight: 1, marginBottom: '0.75rem' }}>{s.num}</div>
                <div style={{ fontWeight: 600, color: 'var(--hs-text-900)', marginBottom: '0.4rem' }}>{s.label}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--hs-text-400)' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section surface-dark final-cta">
        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          <span className="eyebrow">Get Started</span>
          <h2 className="cta-heading" style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', color: 'var(--hs-text-inv)', fontWeight: 700, marginBottom: '1.25rem' }}>
            Ready to Grow Your Brand?
          </h2>
          <p style={{ color: 'var(--hs-text-inv-60)', maxWidth: '480px', margin: '1rem auto 0', fontSize: 'var(--text-lg)' }}>
            Let's build a social media presence that commands attention and drives real results.
          </p>
          <div className="cta-actions">
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-xl">WhatsApp Us Now</a>
            <Link href="/contact" className="btn btn-ghost btn-xl">Send an Enquiry</Link>
          </div>
        </div>
      </section>
    </>
  );
}
