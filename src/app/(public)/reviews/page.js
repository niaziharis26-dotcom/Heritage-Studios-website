export const dynamic = 'force-dynamic';
import db from '@/lib/db';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/siteConfig';

const PAGE_URL = `${SITE_URL}/reviews`;

export const metadata = {
  title: `Client Reviews & Testimonials | ${SITE_NAME}`,
  description:
    'Read verified client reviews and testimonials for Heritage Studios — real results from real digital projects including websites, Shopify stores, AI systems, and creative media.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: `Client Reviews & Testimonials | ${SITE_NAME}`,
    description: 'Honest feedback from businesses that partnered with Heritage Studios to build exceptional digital products.',
    url: PAGE_URL,
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: `${SITE_NAME} Client Reviews` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Client Reviews & Testimonials | ${SITE_NAME}`,
    description: 'Real client testimonials for Heritage Studios digital agency.',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function ReviewsPage() {
  const reviews = db.get('reviews') || [];
  const settings = db.get('settings') || {};

  const published = reviews.filter(r => r.published).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const waHref = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hi Heritage Studios, I'd like to start a project.")}`
    : '/contact';

  const avgRating = published.length
    ? (published.reduce((s, r) => s + (r.rating || 5), 0) / published.length).toFixed(1)
    : '5.0';

  return (
    <>
      {/* ── Hero ── */}
      <section className="page-hero surface-light">
        <div className="container">
          <div className="page-hero-inner animate-fade-up">
            <span className="eyebrow">Testimonials</span>
            <h1>What Our Clients Say</h1>
            <p style={{ marginTop: '1.25rem', fontSize: 'var(--text-lg)', color: 'var(--hs-text-400)' }}>
              Honest feedback from businesses we've partnered with to build exceptional digital products.
            </p>
            {published.length > 0 && (
              <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '0.25rem', color: 'var(--hs-gold)', fontSize: '1.25rem' }}>★★★★★</div>
                <div>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--hs-text-900)' }}>{avgRating}</span>
                  <span style={{ color: 'var(--hs-text-400)', fontSize: 'var(--text-sm)', marginLeft: '0.5rem' }}>average · {published.length} reviews</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Reviews Grid ── */}
      <section className="section-lg surface-white">
        <div className="container">
          {published.length > 0 ? (
            <div className="grid-3" style={{ gap: '1.5rem' }}>
              {published.map(rev => (
                <div key={rev.id} className="card card-light" style={{ borderRadius: 'var(--r-xl)', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ color: 'var(--hs-gold)', fontSize: '1rem', letterSpacing: '3px', marginBottom: '1.25rem' }}>
                    {'★'.repeat(rev.rating || 5)}
                  </div>
                  <p style={{ fontStyle: 'italic', fontSize: 'var(--text-base)', lineHeight: 1.8, color: 'var(--hs-text-600)', flexGrow: 1, marginBottom: '1.5rem' }}>
                    "{rev.review}"
                  </p>
                  <div style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--hs-border-light)' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--hs-text-900)', marginBottom: '0.25rem' }}>
                      {rev.name}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--hs-text-400)', fontWeight: 500 }}>
                      {rev.position}{rev.company ? `, ${rev.company}` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>★</div>
              <h3 style={{ color: 'var(--hs-text-600)', marginBottom: '0.75rem' }}>Reviews Coming Soon</h3>
              <p style={{ color: 'var(--hs-text-400)' }}>Client testimonials will appear here once published.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section surface-dark">
        <div className="container text-center">
          <span className="eyebrow">Join Our Clients</span>
          <h2 style={{ marginTop: '0.75rem', marginBottom: '1.25rem' }}>Ready to Work Together?</h2>
          <p style={{ color: 'var(--hs-text-inv-60)', maxWidth: '480px', margin: '0 auto 2.5rem', fontSize: 'var(--text-lg)' }}>
            Let's build something exceptional for your business.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/contact" className="btn btn-primary btn-lg">Start a Project</a>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-outline-inv btn-lg">WhatsApp Us</a>
          </div>
        </div>
      </section>
    </>
  );
}
