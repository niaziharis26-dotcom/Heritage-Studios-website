export const dynamic = 'force-dynamic';
import Link from 'next/link';
import db from '@/lib/db';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/siteConfig';

const PAGE_URL = `${SITE_URL}/projects`;

export const metadata = {
  title: `Portfolio & Projects | ${SITE_NAME}`,
  description:
    "Explore Heritage Studios' portfolio of premium digital projects — bespoke websites, high-performance e-commerce stores, AI systems, software platforms, and creative media.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: `Portfolio & Projects | ${SITE_NAME}`,
    description:
      "A curated showcase of Heritage Studios' bespoke digital work — websites, Shopify stores, AI platforms, and creative media.",
    url: PAGE_URL,
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: `${SITE_NAME} Portfolio` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Portfolio & Projects | ${SITE_NAME}`,
    description: "Heritage Studios' portfolio of websites, Shopify stores, AI systems, and creative media.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function ProjectsPage() {
  const projects = db.get('projects') || [];
  const settings = db.get('settings') || {};

  const published = projects.filter(p => p.published).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  // Group by category
  const categories = [...new Set(published.map(p => p.category).filter(Boolean))];

  const waHref = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hi Heritage Studios, I'd like to discuss a project.")}`
    : '/contact';

  return (
    <>
      {/* ── Hero ── */}
      <section className="page-hero surface-light">
        <div className="container">
          <div className="page-hero-inner animate-fade-up">
            <span className="eyebrow">Portfolio</span>
            <h1>Featured Projects</h1>
            <p style={{ marginTop: '1.25rem', fontSize: 'var(--text-lg)', color: 'var(--hs-text-400)' }}>
              A curated showcase of bespoke digital work — from high-performance storefronts to intelligent software systems.
            </p>
          </div>
        </div>
      </section>

      {/* ── Projects Grid ── */}
      <section className="section-lg surface-white">
        <div className="container">
          {published.length > 0 ? (
            <div className="projects-full-grid">
              {published.map(proj => (
                <article key={proj.id} className="project-full-card">
                  <div className="project-img-wrap">
                    {proj.image ? (
                      <img src={proj.image} alt={proj.name} loading="lazy" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--hs-charcoal-2), var(--hs-charcoal-3))', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden="true">
                        <span style={{ fontSize: '2rem', opacity: 0.3 }}>◎</span>
                      </div>
                    )}
                  </div>
                  <div className="project-body">
                    <span className="badge badge-emerald" style={{ fontSize: '0.62rem' }}>{proj.category || 'Project'}</span>
                    <h3>{proj.name}</h3>
                    <p style={{ marginBottom: '0.5rem' }}>{proj.description}</p>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="tag-row">
                        {proj.technologies.slice(0, 4).map(t => <span key={t} className="tag">{t}</span>)}
                      </div>
                    )}
                    {proj.result && (
                      <div style={{ marginTop: '1.25rem', padding: '0.875rem 1rem', background: 'var(--hs-emerald-a08)', border: '1px solid var(--hs-emerald-a30)', borderRadius: 'var(--r-md)', fontSize: 'var(--text-xs)', color: 'var(--hs-emerald)', fontWeight: 600, lineHeight: 1.5 }}>
                        ↑ {proj.result}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--hs-text-400)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>◎</div>
              <h3 style={{ color: 'var(--hs-text-600)', marginBottom: '0.75rem' }}>Portfolio Coming Soon</h3>
              <p>Projects will be showcased here once they're added from the admin panel.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section surface-dark">
        <div className="container text-center">
          <span className="eyebrow">Start Your Project</span>
          <h2 style={{ marginTop: '0.75rem', marginBottom: '1.25rem' }}>Ready to Build Something Like This?</h2>
          <p style={{ color: 'var(--hs-text-inv-60)', maxWidth: '480px', margin: '0 auto 2.5rem', fontSize: 'var(--text-lg)' }}>
            Let's discuss your vision and engineer an exceptional digital product together.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary btn-lg">Start a Project</Link>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-outline-inv btn-lg">Chat on WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  );
}
