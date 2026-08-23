export const dynamic = 'force-dynamic';
import Link from 'next/link';
import db from '@/lib/db';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/siteConfig';

const PAGE_URL = `${SITE_URL}/about`;

export const metadata = {
  title: `About ${SITE_NAME} | Premium Technology & Digital Agency`,
  description:
    'Heritage Studios is a premium technology and digital agency engineering beautiful software, high-performance websites, and scalable brands. Learn about our mission, values, and process.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: `About ${SITE_NAME} | Premium Technology & Digital Agency`,
    description:
      'Learn about Heritage Studios — a premium digital agency engineering websites, Shopify stores, AI systems, and creative media for businesses in Pakistan and worldwide.',
    url: PAGE_URL,
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: `About ${SITE_NAME}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `About ${SITE_NAME} | Premium Technology & Digital Agency`,
    description: 'Premium digital agency engineering software, websites, and creative media for ambitious brands.',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function AboutPage() {
  const components = db.get('components') || {};
  const settings   = db.get('settings') || {};
  const about      = components.aboutPage || {};

  return (
    <>
      {/* ── Hero ── */}
      <section className="page-hero surface-light" data-cms-id="aboutPage">
        <div className="container">
          <div className="page-hero-inner animate-fade-up">
            <span className="eyebrow">About Us</span>
            <h1 data-cms-field="heroTitle">{about.heroTitle || 'About Heritage Studios'}</h1>
            <p style={{ marginTop: '1.25rem', fontSize: 'var(--text-lg)', maxWidth: '580px', color: 'var(--hs-text-400)' }} data-cms-field="heroSubtitle">
              {about.heroSubtitle || 'Crafting digital legacies with premium design and advanced engineering.'}
            </p>
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="section surface-white" data-cms-id="aboutPage">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }} className="about-split-grid">
            <div>
              <span className="eyebrow">Our Mission</span>
              <h2 style={{ marginTop: '0.75rem' }} data-cms-field="missionTitle">{about.missionTitle || 'Our Mission'}</h2>
              <p style={{ marginTop: '1.25rem', fontSize: 'var(--text-lg)', lineHeight: 1.8 }} data-cms-field="missionDescription">
                {about.missionDescription || 'To empower businesses with state-of-the-art digital tools that drive growth and command attention.'}
              </p>
              <p style={{ marginTop: '1rem' }}>
                Heritage Studios was founded on a simple belief: exceptional technology should be accessible to ambitious businesses of every size. We combine creative design precision with software engineering rigour to produce digital products that last.
              </p>
            </div>
            <div style={{ position: 'relative' }}>
              <div className="stats-row card card-light" style={{ padding: '2.5rem' }}>
                {[
                  { num: '40+', label: 'Projects Delivered' },
                  { num: '98%', label: 'Client Satisfaction' },
                  { num: '3+',  label: 'Years of Excellence' },
                  { num: '12+', label: 'Technologies Mastered' },
                ].map(s => (
                  <div key={s.label} className="stat-block surface-dark" style={{ borderRadius: 'var(--r-lg)' }}>
                    <div className="stat-num">{s.num}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .about-split-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          }
        `}</style>
      </section>

      {/* ── Values ── */}
      <section className="section surface-light" data-cms-id="aboutPage">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">What We Stand For</span>
            <h2>Our Core Values</h2>
          </div>
          <div className="values-grid">
            {(about.values || []).map((val, i) => (
              <div key={i} className="value-card card card-light">
                <div style={{ width: 40, height: 40, borderRadius: 'var(--r-md)', background: 'var(--hs-emerald-a08)', border: '1px solid var(--hs-emerald-a30)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--hs-emerald)', fontWeight: 700, marginBottom: '1.25rem' }}>
                  {['✦', '◎', '⊞'][i] || '✦'}
                </div>
                <h3 style={{ color: 'var(--hs-text-900)', marginBottom: '0.75rem' }} data-cms-field={`values.${i}.title`}>{val.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)' }} data-cms-field={`values.${i}.desc`}>{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What We Build ── */}
      <section className="section surface-dark">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Capabilities</span>
            <h2>What We Build</h2>
          </div>
          <div className="grid-3" style={{ gap: '1.25rem' }}>
            {[
              { title: 'Custom Websites', desc: 'Bespoke, performance-optimised websites built for growth and conversion.' },
              { title: 'E-Commerce Storefronts', desc: 'Shopify, WooCommerce, and headless commerce built for scale.' },
              { title: 'AI Automation', desc: 'Intelligent agents, LLM integrations, and autonomous workflow systems.' },
              { title: 'SaaS Platforms', desc: 'Multi-tenant software products from MVP to enterprise-grade architecture.' },
              { title: 'Creative Media', desc: 'Video editing, motion graphics, and brand identity design.' },
              { title: 'Analytics Dashboards', desc: 'Real-time reporting tools that turn data into decisions.' },
            ].map((item, i) => (
              <div key={i} className="card card-glass" style={{ borderRadius: 'var(--r-xl)', padding: '2rem' }}>
                <div style={{ color: 'var(--hs-emerald)', fontWeight: 700, fontSize: 'var(--text-caption)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>0{i+1}</div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--hs-text-inv)', marginBottom: '0.65rem' }}>{item.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--hs-text-inv-60)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section surface-light">
        <div className="container text-center">
          <span className="eyebrow">Work With Us</span>
          <h2 style={{ marginTop: '0.75rem', marginBottom: '1.25rem' }}>Let's Build Something Remarkable</h2>
          <p style={{ maxWidth: '480px', margin: '0 auto 2.5rem', fontSize: 'var(--text-lg)' }}>
            Partner with Heritage Studios to take your digital presence to the next level.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-dark btn-lg">Get in Touch</Link>
            <a href={settings.bookingUrl || '/contact'} target={settings.bookingUrl ? '_blank' : undefined} rel="noopener noreferrer" className="btn btn-outline btn-lg">Book a Call</a>
          </div>
        </div>
      </section>
    </>
  );
}
