export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import db from '@/lib/db';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/siteConfig';

export async function generateMetadata({ params }) {
  await db.load();
  const services = db.get('services') || [];
  const svc = services.find(s => s.slug === params.slug);
  if (!svc) return { title: 'Service Not Found | Heritage Studios' };
  const seo = svc.seo || {};
  const pageTitle = seo.title || `${svc.name} Services | ${SITE_NAME}`;
  const pageDesc = seo.description || svc.heroDescription || svc.shortDescription || '';
  const pageUrl = `${SITE_URL}/services/${svc.slug}`;
  return {
    title: pageTitle,
    description: pageDesc,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: pageUrl,
      type: 'website',
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${svc.name} — ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDesc,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function ServiceDetailPage({ params }) {
  await db.load();
  const services = db.get('services') || [];
  const settings = db.get('settings') || {};
  const whyUsData = db.get('whyUs') || [];
  const allProjects = db.get('projects') || [];
  const allReviews  = db.get('reviews') || [];
  const pricingDisclaimer = db.get('pricingDisclaimer') || 'All displayed prices are starting estimates. Final pricing depends on project requirements, complexity, integrations, scope, and timeline.';

  const svc = services.find(s => s.slug === params.slug && s.published);
  if (!svc) return notFound();

  // Parent service
  const parentSvc = svc.parentService
    ? services.find(s => s.id === svc.parentService && s.published)
    : null;

  // Child sub-services
  const childServices = services
    .filter(s => s.parentService === svc.id && s.published)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  // Related services
  const relatedServices = (svc.relatedServices || [])
    .map(id => services.find(s => (s.slug === id || s.id === id) && s.published))
    .filter(Boolean)
    .slice(0, 3);

  // Filter projects for this service domain
  const domainProjects = allProjects.filter(p => p.published && (
    p.serviceId === svc.id ||
    p.serviceId === svc.parentService ||
    p.category === svc.category
  )).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const displayProjects = domainProjects.length > 0
    ? domainProjects
    : allProjects.filter(p => p.published).slice(0, 3);

  // Filter reviews for this service domain
  const domainReviews = allReviews.filter(r => r.published && (
    r.serviceId === svc.id ||
    r.serviceId === svc.parentService
  )).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const displayReviews = domainReviews.length > 0
    ? domainReviews
    : allReviews.filter(r => r.published).slice(0, 3);

  const waHref = settings.whatsappNumber
    ? ("https://wa.me/" + settings.whatsappNumber + "?text=" + encodeURIComponent("Hi Heritage Studios, I'm interested in: " + svc.name + "."))
    : '/contact';

  const isAds = svc.id === 'ads-management' || svc.parentService === 'ads-management';
  const isVideo = svc.id === 'video-editing' || svc.parentService === 'video-editing';

  // ── Structured Data ────────────────────────────────────────────────────
  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` },
  ];
  if (parentSvc) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 3,
      name: parentSvc.name,
      item: `${SITE_URL}/services/${parentSvc.slug}`,
    });
  }
  breadcrumbItems.push({
    '@type': 'ListItem',
    position: breadcrumbItems.length + 1,
    name: svc.name,
    item: `${SITE_URL}/services/${svc.slug}`,
  });

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: svc.name,
    description: svc.heroDescription || svc.shortDescription || '',
    provider: {
      '@type': 'Organization',
      name: 'Heritage Studios',
      url: SITE_URL,
    },
    url: `${SITE_URL}/services/${svc.slug}`,
  };

  const faqSchema = svc.faqs && svc.faqs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: svc.faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }
    : null;

  const schemas = [breadcrumbSchema, serviceSchema, ...(faqSchema ? [faqSchema] : [])];

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      {/* HERO */}
      <section className="service-detail-hero surface-light" data-cms-id={svc.id}>
        <div className="container">
          <nav className="svc-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="svc-breadcrumb-sep" aria-hidden="true">/</span>
            <Link href="/services">Services</Link>
            {parentSvc && (
              <>
                <span className="svc-breadcrumb-sep" aria-hidden="true">/</span>
                <Link href={"/services/" + parentSvc.slug}>{parentSvc.name}</Link>
              </>
            )}
            <span className="svc-breadcrumb-sep" aria-hidden="true">/</span>
            <span style={{ color: 'var(--hs-text-600)' }}>{svc.name}</span>
          </nav>

          <div style={{ maxWidth: '780px' }}>
            {svc.category && (
              <span className="badge badge-emerald" style={{ marginBottom: '1.25rem' }} data-cms-field="category">
                {svc.category}
              </span>
            )}

            {svc.icon && svc.icon.startsWith('/') && (
              <div style={{ width: '64px', height: '64px', marginBottom: '1.25rem' }}>
                 <img src={svc.icon} alt={svc.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            )}
            <h1 data-cms-field="heroTitle" style={{ marginBottom: '1.25rem' }}>
              {svc.heroTitle || svc.name}
            </h1>

            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--hs-text-400)', lineHeight: 1.75, maxWidth: '640px', marginBottom: '1rem' }} data-cms-field="heroDescription">
              {svc.heroDescription || svc.shortDescription}
            </p>

            {svc.startingPrice && (
              <div style={{ marginBottom: '2rem' }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--hs-emerald)' }} data-cms-field="startingPrice">
                  {svc.startingPrice}
                </span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
              <Link href="/contact" className="btn btn-dark btn-lg">Get a Free Quote</Link>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      {svc.benefits && svc.benefits.length > 0 && (
        <section className="section surface-white" data-cms-id={svc.id}>
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Why Choose Heritage Studios</span>
              <h2>Key Benefits</h2>
            </div>
            <div className="why-us-grid">
              {svc.benefits.map((b, i) => (
                <div key={i} className="why-us-card" data-cms-field={`benefits.${i}`}>
                  <span className="why-us-icon">✓</span>
                  <div className="why-us-desc" style={{ color: 'var(--hs-text-inv-60)', fontWeight: 500 }} data-cms-field={`benefits.${i}`}>{b}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CHILD SERVICES */}
      {childServices.length > 0 && (
        <section className="section surface-light">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Services</span>
              <h2>Explore {svc.name}</h2>
            </div>
            <div className="svc-subgrid">
              {childServices.map(child => (
                <Link key={child.id} href={"/services/" + child.slug} className="svc-sub-card" data-cms-id={child.id}>
                  {child.icon && (
                    <div style={{ fontSize: '2rem', marginBottom: '0.75rem', lineHeight: 1, width: '40px', height: '40px' }}>
                      {child.icon.startsWith('/') ? <img src={child.icon} alt={child.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : child.icon}
                    </div>
                  )}
                  <h3 data-cms-field="name">{child.name}</h3>
                  <p data-cms-field="shortDescription">{child.shortDescription}</p>
                  {child.startingPrice && (
                    <div className="svc-sub-price" data-cms-field="startingPrice">{child.startingPrice}</div>
                  )}
                  <div className="svc-sub-arrow">
                    Explore
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12" aria-hidden="true">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FEATURES */}
      {svc.features && svc.features.length > 0 && (
        <section className="section surface-white" data-cms-id={svc.id}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '3rem', alignItems: 'start' }}>
              <div>
                <div className="section-header">
                  <span className="eyebrow">What We Cover</span>
                  <h2>Key Capabilities</h2>
                </div>
                <p style={{ color: 'var(--hs-text-400)', marginBottom: '2rem' }}>
                  Core services and technical capabilities offered for {svc.name.toLowerCase()}.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link href="/contact" className="btn btn-dark">Get a Quote</Link>
                  <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-outline">WhatsApp</a>
                </div>
              </div>
              <div className="feature-tag-grid">
                {svc.features.map((f, i) => {
                  const isObj = typeof f === 'object' && f !== null;
                  const name = isObj ? f.name : f;
                  const icon = isObj ? f.icon : null;
                  return (
                    <span key={i} className="feature-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: 'var(--text-sm)' }} data-cms-field={`features.${i}`}>
                      {icon && <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{icon}</span>}
                      {name}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PRICING */}
      {svc.pricing && svc.pricing.length > 0 && (
        <section className="section surface-light" data-cms-id={svc.id}>
          <div className="container">
            <div className="section-header centered text-center">
              <span className="eyebrow">Investment</span>
              <h2>Pricing & Packages</h2>
              {isVideo ? (
                <p>All video pricing is project-specific. Contact us with your requirements for an accurate quote.</p>
              ) : (
                <p>Starting estimates - final pricing confirmed after reviewing your requirements.</p>
              )}
            </div>

            <div className="svc-pricing-grid">
              {svc.pricing.map((plan, i) => (
                <div key={i} className={"svc-pricing-card" + (plan.popular ? " popular" : "")} data-cms-id={"pricing-" + i}>
                  {plan.badge && (
                    <div className="svc-pricing-badge">{plan.badge}</div>
                  )}
                  {!plan.badge && plan.popular && (
                    <div className="svc-pricing-badge">Most Popular</div>
                  )}

                  <div className="svc-pricing-name" data-cms-field={"pricing." + i + ".name"}>{plan.name}</div>
                  <div className="svc-pricing-desc" data-cms-field={"pricing." + i + ".description"}>{plan.description}</div>

                  <div className="svc-pricing-price" data-cms-field={"pricing." + i + ".price"}>{plan.price}</div>
                  {plan.billingPeriod && plan.billingPeriod !== 'one-time' && !(plan.price && (plan.price.includes('/month') || plan.price.includes('/mo'))) && (
                    <div className="svc-pricing-period">{plan.billingPeriod}</div>
                  )}
                  {plan.startingFromPkr && (
                    <div className="svc-pricing-pkr">{plan.startingFromPkr}</div>
                  )}
                  {plan.bestFor && (
                    <div className="svc-pricing-bestfor">Best for: {plan.bestFor}</div>
                  )}

                  <div className="svc-pricing-features">
                    {(plan.features || []).map((f, fi) => (
                      <div key={fi} className="svc-pricing-feature">
                        <span className="svc-pricing-feature-check">✓</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  {plan.disclaimer && (
                    <div className="svc-pricing-disclaimer-sm">{plan.disclaimer}</div>
                  )}

                  <Link href="/contact" className={"btn w-full" + (plan.popular ? " btn-primary" : " btn-outline")} style={{ marginTop: plan.disclaimer ? '0.75rem' : 'auto' }}>
                    {plan.ctaText || 'Get Started'}
                  </Link>
                </div>
              ))}
            </div>

            <div className="svc-pricing-disclaimer-block">
              <strong>⚠ Disclaimer:</strong> {pricingDisclaimer}
            </div>
          </div>
        </section>
      )}

      {/* BUG FIX PRICING */}
      {svc.bugFixPricing && svc.bugFixPricing.length > 0 && (
        <section className="section surface-white">
          <div className="container">
            <div className="section-header centered text-center">
              <span className="eyebrow">Quick Fixes</span>
              <h2>Bug Fix & Maintenance Pricing</h2>
              <p>Transparent pricing for common fixes and maintenance tasks.</p>
            </div>
            <div className="bug-fix-table">
              {svc.bugFixPricing.map((fix, i) => (
                <div key={i} className="bug-fix-row">
                  <div className="bug-fix-name">{fix.name}</div>
                  <div className="bug-fix-desc">{fix.description}</div>
                  <div className="bug-fix-price">{fix.price}</div>
                </div>
              ))}
            </div>
            {svc.bugFixDisclaimer && (
              <div className="svc-pricing-disclaimer-block" style={{ marginTop: '1.5rem' }}>
                <strong>Note:</strong> {svc.bugFixDisclaimer}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ADS AUDIT */}
      {svc.adsAudit && (
        <section className="section surface-dark">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Audit Service</span>
              <h2 style={{ color: 'var(--hs-text-inv)' }}>Ads Account Audit</h2>
            </div>
            <div className="audit-card">
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--hs-text-inv-60)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Starting from</div>
              <div className="audit-price">{svc.adsAudit.startingPrice}</div>
              {svc.adsAudit.startingPricePkr && (
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--hs-text-inv-60)', marginBottom: '1rem' }}>{svc.adsAudit.startingPricePkr}</div>
              )}
              {svc.adsAudit.includes && svc.adsAudit.includes.length > 0 && (
                <div className="audit-features">
                  {svc.adsAudit.includes.map((item, i) => (
                    <div key={i} className="audit-feature">{item}</div>
                  ))}
                </div>
              )}
              <Link href="/contact" className="btn btn-primary">Request an Audit</Link>
            </div>
            {svc.adsDisclaimer && (
              <div className="ads-spend-disclaimer" style={{ marginTop: '1.5rem' }}>
                <strong>⚠ Ad Spend Note:</strong> {svc.adsDisclaimer}
                {svc.adsSpendExample && (
                  <div className="ads-example">{svc.adsSpendExample}</div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ONE-TIME SETUP PACKAGES */}
      {svc.oneTimeSetup && svc.oneTimeSetup.length > 0 && (
        <section className="section surface-light">
          <div className="container">
            <div className="section-header centered text-center">
              <span className="eyebrow">One-Time Setup</span>
              <h2>Setup & Launch Packages</h2>
              <p>Get your ad campaigns set up professionally from scratch.</p>
            </div>
            <div className="setup-grid">
              {svc.oneTimeSetup.map((pkg, i) => (
                <div key={i} className="setup-card">
                  <div className="setup-card-name">{pkg.name}</div>
                  <div className="setup-card-price">{pkg.price}</div>
                  {pkg.features && pkg.features.length > 0 && (
                    <div className="setup-card-features">
                      {pkg.features.map((f, fi) => (
                        <div key={fi} className="setup-card-feature">{f}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FEATURED PROJECTS FOR THIS SERVICE */}
      {displayProjects.length > 0 && (
        <section className="section-lg surface-white">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Case Studies</span>
              <h2>Featured {svc.name} Projects</h2>
              <p style={{ color: 'var(--hs-text-400)' }}>
                Real-world projects delivered for clients in the {svc.category || svc.name} sector.
              </p>
            </div>

            <div className="projects-full-grid">
              {displayProjects.map(proj => (
                <article key={proj.id} className="project-full-card">
                  <div className="project-img-wrap">
                    {proj.image ? (
                      <img src={proj.image} alt={proj.name} loading="lazy" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--hs-charcoal-2), var(--hs-charcoal-3))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '2rem', opacity: 0.3 }}>◎</span>
                      </div>
                    )}
                  </div>
                  <div className="project-body">
                    <span className="badge badge-emerald" style={{ fontSize: '0.62rem' }}>{proj.category || 'Case Study'}</span>
                    <h3>{proj.name}</h3>
                    <p style={{ marginBottom: '0.75rem' }}>{proj.description}</p>
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

            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link href="/projects" className="btn btn-outline btn-lg">View All Agency Projects</Link>
            </div>
          </div>
        </section>
      )}

      {/* CLIENT REVIEWS FOR THIS SERVICE */}
      {displayReviews.length > 0 && (
        <section className="section surface-light">
          <div className="container">
            <div className="section-header centered text-center">
              <span className="eyebrow">Client Feedback</span>
              <h2>What Clients Say About Our {svc.name}</h2>
            </div>
            <div className="grid-3" style={{ gap: '1.5rem' }}>
              {displayReviews.map(rev => (
                <div key={rev.id} className="card card-light" style={{ borderRadius: 'var(--r-xl)', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ color: 'var(--hs-gold)', fontSize: '1rem', letterSpacing: '3px', marginBottom: '1.25rem' }}>
                    {'★'.repeat(rev.rating || 5)}
                  </div>
                  <p style={{ fontStyle: 'italic', fontSize: 'var(--text-base)', lineHeight: 1.8, color: 'var(--hs-text-600)', flexGrow: 1, marginBottom: '1.5rem' }}>
                    "{rev.review}"
                  </p>
                  <div style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--hs-border-light)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {rev.image && (
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--hs-border-light)' }}>
                        <img src={rev.image} alt={rev.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--hs-text-900)', marginBottom: '0.25rem' }}>
                        {rev.name}
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--hs-text-400)', fontWeight: 500 }}>
                        {rev.position}{rev.company ? (", " + rev.company) : ''}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROCESS */}
      {svc.process && svc.process.length > 0 && (
        <section className="section surface-dark">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">How It Works</span>
              <h2 style={{ color: 'var(--hs-text-inv)' }}>Our Execution Framework</h2>
            </div>
            <div className="grid-4" style={{ gap: '1.25rem' }}>
              {svc.process.map((step, i) => (
                <div key={i} className="card card-glass" style={{ borderRadius: 'var(--r-xl)', padding: '2rem' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.75rem', fontWeight: 300, color: 'var(--hs-border-dark)', lineHeight: 1, marginBottom: '1.25rem' }}>
                    0{i + 1}
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--hs-text-inv)', fontWeight: 500, lineHeight: 1.65 }}>{step}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '2.5rem' }}>
              <Link href="/contact" className="btn btn-primary btn-lg">Start Your Project</Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQS */}
      {svc.faqs && svc.faqs.length > 0 && (
        <section className="section surface-white">
          <div className="container" style={{ maxWidth: '800px' }}>
            <div className="section-header">
              <span className="eyebrow">Questions</span>
              <h2>Frequently Asked Questions</h2>
            </div>
            <div className="faq-accordion">
              {svc.faqs.map((faq, i) => (
                <details key={i}>
                  <summary>
                    {faq.question}
                    <span className="faq-accordion-icon" aria-hidden="true">+</span>
                  </summary>
                  <div className="faq-accordion-body">{faq.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="section surface-dark final-cta">
        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          <span className="eyebrow">Let's Work Together</span>
          <h2 style={{ marginTop: '0.75rem', marginBottom: '1.25rem', color: 'var(--hs-text-inv)' }}>
            Ready to get started with {svc.name}?
          </h2>
          <p style={{ color: 'var(--hs-text-inv-60)', maxWidth: '480px', margin: '0 auto', fontSize: 'var(--text-lg)' }}>
            Tell us your requirements and we'll provide a clear quote and timeline.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2.5rem' }}>
            <Link href="/contact" className="btn btn-primary btn-xl">Get a Free Quote</Link>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-xl">
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
