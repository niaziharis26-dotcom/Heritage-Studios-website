export const dynamic = 'force-dynamic';
import db from '@/lib/db';
import ContactForm from '@/components/ContactForm';
import Link from 'next/link';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/siteConfig';

const PAGE_URL = `${SITE_URL}/contact`;

export const metadata = {
  title: `Contact ${SITE_NAME} — Start Your Project`,
  description:
    'Get in touch with Heritage Studios to discuss your website, Shopify, AI, or advertising project. Book a free strategy call or send an enquiry — our team responds within 24 hours.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: `Contact ${SITE_NAME} — Start Your Project`,
    description:
      'Reach out to Heritage Studios. Book a free strategy call or send an enquiry about your digital project.',
    url: PAGE_URL,
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: `Contact ${SITE_NAME}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Contact ${SITE_NAME} — Start Your Project`,
    description: 'Book a free strategy call or send an enquiry about your digital project with Heritage Studios.',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default async function ContactPage() {
  await db.load();
  const components = db.get('components') || {};
  const settings   = db.get('settings') || {};
  const services   = db.get('services') || [];
  const pg         = components.contactPage || {};

  const publishedServices = services.filter(s => s.published).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const waHref = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappMessage || "Hi Heritage Studios, I'd like to start a project.")}`
    : undefined;

  const contactDetails = [
    settings.email && {
      icon: '✉️',
      label: 'Email',
      value: settings.email,
      href: `mailto:${settings.email}`,
    },
    settings.phone && {
      icon: '📞',
      label: 'Phone',
      value: settings.phone,
      href: `tel:${settings.phone}`,
    },
  ].filter(Boolean);

  return (
    <>
      {/* ── Hero ── */}
      <section className="page-hero surface-light" data-cms-id="contactPage">
        <div className="container">
          <div className="page-hero-inner animate-fade-up">
            <span className="eyebrow">Get in Touch</span>
            <h1 data-cms-field="heroTitle">{pg.heroTitle || 'Start Your Project'}</h1>
            <p style={{ marginTop: '1.25rem', fontSize: 'var(--text-lg)', maxWidth: '540px', color: 'var(--hs-text-400)' }} data-cms-field="heroSubtitle">
              {pg.heroSubtitle || "We're ready to engineer your next big project. Fill out the form and our team will respond within 24 hours."}
            </p>
          </div>
        </div>
      </section>

      {/* ── Contact Section ── */}
      <section className="section-lg surface-white" data-cms-id="contactPage">
        <div className="container">
          <div className="contact-grid" style={{ alignItems: 'start', gap: '4rem' }}>

            {/* ── Left: Info ── */}
            <div>
              <h2 style={{ fontSize: 'var(--text-h3)', marginBottom: '0.75rem' }}>Contact Details</h2>
              <p style={{ marginBottom: '2.5rem', color: 'var(--hs-text-400)' }}>
                Choose the most convenient way to reach us.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {contactDetails.map(({ icon, label, value, href, external }) => (
                  <a
                    key={label}
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1.125rem 1.25rem', background: 'var(--hs-off-white)', border: '1px solid var(--hs-border-light)', borderRadius: 'var(--r-lg)', textDecoration: 'none', transition: 'all 0.25s', color: 'inherit' }}
                    className="contact-detail-row"
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 'var(--r-md)', background: 'var(--hs-emerald-a08)', border: '1px solid var(--hs-emerald-a30)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--hs-emerald)', flexShrink: 0 }}>
                      {icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 'var(--text-caption)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--hs-text-400)', marginBottom: '0.25rem' }}>{label}</div>
                      <div style={{ fontWeight: 600, color: 'var(--hs-text-900)', fontSize: 'var(--text-sm)' }}>{value}</div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Book a Call CTA block */}
              {settings.bookingUrl && (
                <div style={{ marginTop: '2.5rem', padding: '2rem', background: 'var(--hs-charcoal)', borderRadius: 'var(--r-xl)' }}>
                  <div style={{ color: 'var(--hs-emerald)', fontWeight: 700, fontSize: 'var(--text-caption)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>Book a Strategy Call</div>
                  <h3 style={{ color: 'var(--hs-text-inv)', fontSize: '1.35rem', marginBottom: '0.75rem' }}>Free 30-Minute Consultation</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--hs-text-inv-60)', marginBottom: '1.5rem', lineHeight: 1.65 }}>
                    Schedule a free call with our lead engineer to review your project scope, timeline, and technical requirements.
                  </p>
                  <a href={settings.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    Book on Calendly →
                  </a>
                </div>
              )}
            </div>

            {/* ── Right: Form ── */}
            <div>
              <ContactForm servicesList={publishedServices} pageData={pg} />
            </div>

          </div>
        </div>

        <style>{`
          .contact-detail-row:hover {
            border-color: var(--hs-emerald-a30) !important;
            background: var(--hs-white) !important;
          }
        `}</style>
      </section>
    </>
  );
}
