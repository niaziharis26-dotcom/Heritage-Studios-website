export const dynamic = 'force-dynamic';
import Link from 'next/link';
import db from '@/lib/db';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/siteConfig';

const PAGE_URL = `${SITE_URL}/services`;

export const metadata = {
  title: 'Technology & Digital Services | Heritage Studios',
  description:
    "Explore Heritage Studios' complete suite of digital services: custom web development, WordPress, Shopify, AI solutions, paid advertising, video editing, and software development for businesses in Pakistan and worldwide.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Technology & Digital Services | Heritage Studios',
    description:
      "Custom websites, Shopify stores, AI solutions, paid advertising, and professional video — Heritage Studios' full service catalog.",
    url: PAGE_URL,
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'Heritage Studios Services' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Technology & Digital Services | Heritage Studios',
    description: "Heritage Studios' complete digital service catalog — websites, Shopify, AI, ads, and video.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function ServicesPage() {
  const components = db.get('components') || {};
  const services   = db.get('services') || [];
  const settings   = db.get('settings') || {};
  const pg         = components.servicesPage || {};

  const published = services.filter(s => s.published).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  // Primary root service families dynamically from database
  const rootServices = published.filter(s => !s.parentService);

  const waHref = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hi Heritage Studios, I'd like to discuss your services.")}`
    : '/contact';

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="page-hero surface-light" data-cms-id="servicesPage">
        <div className="container text-center" style={{ maxWidth: '840px' }}>
          <span className="eyebrow">Complete Agency Services</span>
          <h1 data-cms-field="heroTitle" style={{ marginTop: '0.75rem' }}>
            {pg.heroTitle || 'Technology & Digital Services Built for Business Growth'}
          </h1>
          <p style={{ marginTop: '1.25rem', fontSize: 'var(--text-lg)', color: 'var(--hs-text-400)', lineHeight: 1.75 }} data-cms-field="heroSubtitle">
            {pg.heroSubtitle || 'From bespoke custom websites and eCommerce platforms to targeted advertising and high-retention video production, Heritage Studios helps businesses build, scale and stand out.'}
          </p>

          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: 'var(--text-sm)', color: 'var(--hs-emerald)', fontWeight: 600 }}>
            <span>✓</span> Serving businesses in Pakistan & worldwide
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-dark btn-lg">Get a Free Quote</Link>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">WhatsApp Us</a>
          </div>
        </div>
      </section>

      {/* ── TOP-LEVEL SERVICE FAMILIES ──────────────────────── */}
      <section className="section surface-white">
        <div className="container">
          <div className="section-header centered text-center">
            <span className="eyebrow">Primary Offerings</span>
            <h2>Explore Our Core Service Families</h2>
            <p>Select a specialized service category to view packages, pricing, and capabilities.</p>
          </div>

          <div className="hp-services-grid" style={{ marginTop: '2.5rem' }}>
            {rootServices.map((mainSvc) => (
              <Link
                key={mainSvc.id}
                href={`/services/${mainSvc.slug}`}
                className="hp-svc-card"
                style={{ background: 'var(--hs-off-white)', border: '1px solid var(--hs-border-light)' }}
                data-cms-id={mainSvc.id}
              >
                <div className="hp-svc-icon" style={{ fontSize: '2.25rem' }}>{mainSvc.icon || '◆'}</div>
                <div className="hp-svc-title" style={{ color: 'var(--hs-text-900)' }} data-cms-field="name">{mainSvc.name}</div>
                <p className="hp-svc-desc" style={{ color: 'var(--hs-text-400)' }} data-cms-field="shortDescription">{mainSvc.shortDescription}</p>
                
                {mainSvc.startingPrice && (
                  <div className="hp-svc-price" data-cms-field="startingPrice">{mainSvc.startingPrice}</div>
                )}

                <div className="hp-svc-cta" style={{ color: 'var(--hs-emerald)' }}>
                  Explore Service
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALL SERVICES DIRECTORY ─────────────────────────── */}
      <section className="section surface-light">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Full Service Catalog</span>
            <h2>All Services & Specializations</h2>
          </div>

          <div className="svc-subgrid" style={{ marginTop: '2rem' }}>
            {published.map((svc) => (
              <Link key={svc.id} href={`/services/${svc.slug}`} className="svc-sub-card" data-cms-id={svc.id}>
                {svc.category && (
                  <span style={{ fontSize: 'var(--text-caption)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: 'var(--hs-emerald)', marginBottom: '0.5rem', display: 'block' }}>
                    {svc.category}
                  </span>
                )}
                <h3 data-cms-field="name">{svc.name}</h3>
                <p data-cms-field="shortDescription">{svc.shortDescription}</p>

                {svc.startingPrice && (
                  <div className="svc-sub-price" data-cms-field="startingPrice">{svc.startingPrice}</div>
                )}

                <div className="svc-sub-arrow">
                  Get Quote
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY HERITAGE STUDIOS ──────────────────────────── */}
      <section className="section surface-dark-2">
        <div className="container">
          <div className="section-header centered text-center">
            <span className="eyebrow">Why Heritage Studios</span>
            <h2 style={{ color: 'var(--hs-text-inv)' }}>Engineered for Real Business Results</h2>
          </div>

          <div className="why-us-grid">
            <div className="why-us-card">
              <span className="why-us-icon">⚡</span>
              <div className="why-us-title">Fast Response</div>
              <div className="why-us-desc">Quick turnaround and direct engineering communication for urgent tasks.</div>
            </div>
            <div className="why-us-card">
              <span className="why-us-icon">🎯</span>
              <div className="why-us-title">Business-Focused</div>
              <div className="why-us-desc">Every line of code and ad campaign is engineered around measurable revenue outcomes.</div>
            </div>
            <div className="why-us-card">
              <span className="why-us-icon">💎</span>
              <div className="why-us-title">Transparent Pricing</div>
              <div className="why-us-desc">Clear starting estimates without hidden fees or surprise invoices.</div>
            </div>
            <div className="why-us-card">
              <span className="why-us-icon">🌍</span>
              <div className="why-us-title">Pakistan & International</div>
              <div className="why-us-desc">Serving local brands in PKR and global enterprises in USD with tailored support.</div>
            </div>
            <div className="why-us-card">
              <span className="why-us-icon">🛠️</span>
              <div className="why-us-title">Technical Rigor</div>
              <div className="why-us-desc">From clean custom Next.js code to high-converting Shopify Liquid templates and ad setups.</div>
            </div>
            <div className="why-us-card">
              <span className="why-us-icon">🤝</span>
              <div className="why-us-title">Long-Term Growth</div>
              <div className="why-us-desc">Continuous technical maintenance, campaign optimization, and dedicated post-launch support.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXECUTION PROCESS ────────────────────────────── */}
      <section className="section surface-white">
        <div className="container">
          <div className="section-header centered text-center">
            <span className="eyebrow">Execution Framework</span>
            <h2>How It Works</h2>
          </div>

          <div className="grid-4" style={{ gap: '1.5rem', marginTop: '2.5rem' }}>
            <div className="card card-light" style={{ padding: '2rem' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--hs-emerald)', fontWeight: 700, marginBottom: '0.75rem' }}>01</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Tell Us Your Requirement</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--hs-text-400)', lineHeight: 1.6 }}>Share your project specs, reference sites, budget, or target objectives.</p>
            </div>
            <div className="card card-light" style={{ padding: '2rem' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--hs-emerald)', fontWeight: 700, marginBottom: '0.75rem' }}>02</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>We Analyze & Scope</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--hs-text-400)', lineHeight: 1.6 }}>Our technical team reviews your setup and formulates an optimal strategy.</p>
            </div>
            <div className="card card-light" style={{ padding: '2rem' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--hs-emerald)', fontWeight: 700, marginBottom: '0.75rem' }}>03</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Scope & Quote</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--hs-text-400)', lineHeight: 1.6 }}>Receive a transparent breakdown, fixed pricing estimate, and timeline.</p>
            </div>
            <div className="card card-light" style={{ padding: '2rem' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--hs-emerald)', fontWeight: 700, marginBottom: '0.75rem' }}>04</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Build & Launch</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--hs-text-400)', lineHeight: 1.6 }}>We design, code, optimize, test, and launch your project with ongoing care.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────── */}
      <section className="section surface-dark final-cta">
        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          <span className="eyebrow">Get Started</span>
          <h2 style={{ marginTop: '0.75rem', marginBottom: '1.25rem', color: 'var(--hs-text-inv)' }}>
            Ready to elevate your digital presence?
          </h2>
          <p style={{ color: 'var(--hs-text-inv-60)', maxWidth: '520px', margin: '0 auto 2.5rem', fontSize: 'var(--text-lg)' }}>
            Contact our team today to discuss your project requirements and receive a clear quote.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary btn-xl">Get a Free Quote</Link>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-xl">Chat on WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  );
}
