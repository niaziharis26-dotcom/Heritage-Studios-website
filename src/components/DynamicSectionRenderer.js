import Link from 'next/link';
import TechMarquee from './TechMarquee';
import ContactForm from './ContactForm';

export default function DynamicSectionRenderer({ sectionId, data = {}, globalServices = [], settings = {} }) {
  if (data.visible === false) return null;

  const type = sectionId.split('_')[0];

  const wrapperProps = {
    'data-cms-id': sectionId,
    className: `section-dynamic section-${type}`
  };

  switch (type) {
    case 'hero':
      return (
        <section {...wrapperProps} className={`${wrapperProps.className} surface-light`}>
          <div className="container">
            <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: data.imageUrl ? '1.2fr 0.8fr' : '1fr', gap: '3rem', alignItems: 'center' }}>
              <div className="animate-fade-up">
                {data.subheading && <div className="hero-tag" data-cms-field="subheading">{data.subheading}</div>}
                <h1 className="hero-heading" data-cms-field="heading">
                  {data.heading || 'Heritage Studios'}
                </h1>
                {data.description && (
                  <p className="hero-desc" data-cms-field="description">
                    {data.description}
                  </p>
                )}
                <div className="hero-actions" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
                  {data.primaryCtaText && (
                    <Link href={data.primaryCtaUrl || '/services'} className="btn btn-dark btn-lg" data-cms-field="primaryCtaText">
                      {data.primaryCtaText}
                    </Link>
                  )}
                  {data.secondaryCtaText && (
                    <Link href={data.secondaryCtaUrl || '/contact'} className="btn btn-outline btn-lg" data-cms-field="secondaryCtaText">
                      {data.secondaryCtaText}
                    </Link>
                  )}
                </div>
              </div>
              {data.imageUrl && (
                <div className="hero-visual" style={{ position: 'relative' }}>
                  <img src={data.imageUrl} alt={data.heading || 'Hero image'} style={{ width: '100%', borderRadius: '12px', objectFit: 'cover' }} data-cms-field="imageUrl" />
                </div>
              )}
            </div>
          </div>
        </section>
      );

    case 'textBlock':
      const alignClass = data.align === 'center' ? 'text-center' : data.align === 'right' ? 'text-right' : 'text-left';
      const bgClass = data.bg === 'dark' ? 'surface-dark' : data.bg === 'light' ? 'surface-light' : 'surface-white';
      return (
        <section {...wrapperProps} className={`${wrapperProps.className} section ${bgClass} ${alignClass}`}>
          <div className="container" style={{ maxWidth: '800px', margin: data.align === 'center' ? '0 auto' : undefined }}>
            {data.subheading && <span className="eyebrow" data-cms-field="subheading">{data.subheading}</span>}
            {data.heading && <h2 style={{ marginTop: '0.75rem' }} data-cms-field="heading">{data.heading}</h2>}
            {data.content && (
              <p style={{ marginTop: '1.25rem', fontSize: 'var(--text-lg)', lineHeight: 1.8, color: data.bg === 'dark' ? 'var(--hs-text-inv-60)' : 'var(--hs-text-400)' }} data-cms-field="content">
                {data.content}
              </p>
            )}
          </div>
        </section>
      );

    case 'imageBlock':
      return (
        <section {...wrapperProps} className={`${wrapperProps.className} section surface-white`}>
          <div className="container text-center">
            {data.imageUrl && (
              <div style={{ overflow: 'hidden', borderRadius: '12px' }}>
                <img src={data.imageUrl} alt={data.altText || 'Image Block'} style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }} data-cms-field="imageUrl" />
              </div>
            )}
            {data.caption && <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--hs-text-400)' }} data-cms-field="caption">{data.caption}</p>}
          </div>
        </section>
      );

    case 'imageText':
      const isRight = data.imagePosition !== 'left';
      return (
        <section {...wrapperProps} className={`${wrapperProps.className} section surface-white`}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', direction: isRight ? 'ltr' : 'rtl' }} className="about-split-grid">
              <div style={{ direction: 'ltr' }}>
                {data.heading && <h2 data-cms-field="heading">{data.heading}</h2>}
                {data.description && <p style={{ marginTop: '1.25rem', lineHeight: 1.8 }} data-cms-field="description">{data.description}</p>}
                {data.primaryCtaText && (
                  <div style={{ marginTop: '2rem' }}>
                    <Link href={data.primaryCtaUrl || '#'} className="btn btn-primary btn-lg" data-cms-field="primaryCtaText">
                      {data.primaryCtaText}
                    </Link>
                  </div>
                )}
              </div>
              <div style={{ direction: 'ltr' }}>
                {data.imageUrl && (
                  <img src={data.imageUrl} alt={data.heading || 'Image'} style={{ width: '100%', borderRadius: '12px', objectFit: 'cover' }} data-cms-field="imageUrl" />
                )}
              </div>
            </div>
          </div>
        </section>
      );

    case 'capabilities':
      return (
        <section {...wrapperProps} className={`${wrapperProps.className} section surface-white`}>
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Capabilities</span>
              <h2 data-cms-field="heading">{data.heading || 'Core Capabilities'}</h2>
            </div>
            <div className="capabilities-grid">
              {(data.items || []).map((item, i) => (
                <div key={i} className="cap-card">
                  <div className="cap-icon" aria-hidden="true">✦</div>
                  <h3 data-cms-field={`items.${i}.title`}>{item.title}</h3>
                  <p data-cms-field={`items.${i}.desc`}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'servicesSection':
      return (
        <section {...wrapperProps} className={`${wrapperProps.className} section-lg surface-dark`}>
          <div className="container">
            <div className="section-header" style={{ maxWidth: '700px' }}>
              <span className="eyebrow">Services</span>
              <h2 data-cms-field="heading">{data.heading || 'Our Services'}</h2>
              <p style={{ color: 'var(--hs-text-inv-60)' }} data-cms-field="subheading">
                {data.subheading || 'Engineered digital products custom designed for business outcomes.'}
              </p>
            </div>

            <div className="services-editorial">
              {globalServices.filter(s => s.published).slice(0, 5).map((svc, i) => (
                <Link href={`/services/${svc.slug}`} key={svc.id} className="service-card-ed card card-glass">
                  <div className="service-num">0{i + 1}</div>
                  <div>
                    <h3>{svc.name}</h3>
                    <p style={{ color: 'var(--hs-text-inv-60)', fontSize: 'var(--text-sm)', marginTop: '0.5rem' }}>
                      {svc.shortDescription}
                    </p>
                  </div>
                  {svc.technologies && svc.technologies.length > 0 && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <TechMarquee technologies={svc.technologies} variant="dark" />
                    </div>
                  )}
                  <div className="service-arrow">View Service →</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      );

    case 'pricingSection':
      return (
        <section {...wrapperProps} className={`${wrapperProps.className} section surface-light`}>
          <div className="container">
            <div className="section-header centered text-center">
              <span className="eyebrow">Pricing</span>
              <h2 data-cms-field="heading">{data.heading || 'Flexible Investment Plans'}</h2>
              {data.description && <p data-cms-field="description">{data.description}</p>}
            </div>
            <div className="pricing-grid">
              {(data.packages || []).map((plan, i) => (
                <div key={i} className={`pricing-card card card-light ${plan.popular === 'true' || plan.popular === true ? 'featured' : ''}`}>
                  {plan.badge && <span className="badge badge-gold" style={{ alignSelf: 'flex-start', marginBottom: '1rem' }} data-cms-field={`packages.${i}.badge`}>{plan.badge}</span>}
                  <h3 style={{ color: 'var(--hs-text-900)', marginBottom: '0.5rem' }} data-cms-field={`packages.${i}.name`}>{plan.name}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', marginBottom: '1.5rem', lineHeight: 1.6 }} data-cms-field={`packages.${i}.description`}>{plan.description}</p>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <span className="price-currency" style={{ color: 'var(--hs-text-900)' }} data-cms-field={`packages.${i}.currency`}>{plan.currency === 'USD' ? '$' : plan.currency}</span>
                    <span className="price-amount" style={{ color: 'var(--hs-text-900)' }} data-cms-field={`packages.${i}.price`}>{plan.price}</span>
                    {plan.billing && <span style={{ color: 'var(--hs-text-400)', fontSize: '0.8rem' }} data-cms-field={`packages.${i}.billing`}>{plan.billing}</span>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
                    {(plan.features || '').split(',').map((f, fi) => f.trim() && (
                      <div key={fi} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--hs-emerald)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--hs-text-600)' }}>{f.trim()}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={plan.ctaUrl || '/contact'} className={`btn w-full ${plan.popular === 'true' || plan.popular === true ? 'btn-primary' : 'btn-outline'}`} data-cms-field={`packages.${i}.ctaText`}>
                    {plan.ctaText || 'Get Started'}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'featureGrid':
      return (
        <section {...wrapperProps} className={`${wrapperProps.className} section surface-white`}>
          <div className="container">
            {data.heading && (
              <div className="section-header">
                <h2 data-cms-field="heading">{data.heading}</h2>
              </div>
            )}
            <div className="grid-3" style={{ gap: '1.5rem' }}>
              {(data.features || []).map((feat, i) => (
                <div key={i} className="card card-light" style={{ padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--hs-text-900)', marginBottom: '0.65rem' }} data-cms-field={`features.${i}.title`}>{feat.title}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--hs-text-400)' }} data-cms-field={`features.${i}.desc`}>{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'stats':
      return (
        <section {...wrapperProps} className={`${wrapperProps.className} section surface-light`}>
          <div className="container">
            {data.heading && <h2 className="text-center" style={{ marginBottom: '2.5rem' }} data-cms-field="heading">{data.heading}</h2>}
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem' }}>
              {(data.stats || []).map((s, i) => (
                <div key={i} className="text-center" style={{ minWidth: 160 }}>
                  <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--hs-emerald)' }} data-cms-field={`stats.${i}.number`}>{s.number}</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--hs-text-600)', marginTop: '0.25rem' }} data-cms-field={`stats.${i}.label`}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'testimonials':
      return (
        <section {...wrapperProps} className={`${wrapperProps.className} section surface-dark`}>
          <div className="container">
            {data.heading && (
              <div className="section-header centered text-center">
                <span className="eyebrow">Reviews</span>
                <h2 data-cms-field="heading">{data.heading}</h2>
              </div>
            )}
            <div className="reviews-grid">
              {(data.reviews || []).map((rev, i) => (
                <div key={i} className="review-card card card-glass">
                  <div className="review-stars" style={{ color: 'var(--hs-gold)' }}>
                    {'★'.repeat(Number(rev.rating) || 5)}
                  </div>
                  <p className="review-text" data-cms-field={`reviews.${i}.review`}>"{rev.review}"</p>
                  <div className="review-author">
                    <div className="review-name" data-cms-field={`reviews.${i}.name`}>{rev.name}</div>
                    <div className="review-title" data-cms-field={`reviews.${i}.position`}>
                      {rev.position}{rev.company ? `, ${rev.company}` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'faq':
      return (
        <section {...wrapperProps} className={`${wrapperProps.className} section surface-white`}>
          <div className="container" style={{ maxWidth: '760px' }}>
            <div className="section-header">
              <span className="eyebrow">FAQs</span>
              <h2 data-cms-field="heading">{data.heading || 'Frequently Asked Questions'}</h2>
            </div>
            <div className="faq-list">
              {(data.items || []).map((faq, i) => (
                <div key={i} className="faq-item">
                  <div className="faq-q">
                    <span data-cms-field={`items.${i}.question`}>{faq.question}</span>
                  </div>
                  <div className="faq-a" style={{ display: 'block', padding: '1rem 0' }} data-cms-field={`items.${i}.answer`}>
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'process':
      return (
        <section {...wrapperProps} className={`${wrapperProps.className} section surface-light`}>
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Approach</span>
              <h2 data-cms-field="heading">{data.heading || 'Our Execution Framework'}</h2>
            </div>
            <div className="grid-4" style={{ gap: '1.5rem' }}>
              {(data.steps || []).map((step, i) => (
                <div key={i} className="card card-light" style={{ padding: '2.5rem 2rem' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 300, color: 'var(--hs-border-light)', lineHeight: 1, marginBottom: '1.5rem' }} data-cms-field={`steps.${i}.step`}>
                    {step.step || `0${i+1}`}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--hs-text-900)', marginBottom: '0.75rem' }} data-cms-field={`steps.${i}.name`}>{step.name}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--hs-text-400)' }} data-cms-field={`steps.${i}.desc`}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'cta':
      return (
        <section {...wrapperProps} className={`${wrapperProps.className} section-lg surface-dark final-cta`}>
          <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
            <span className="eyebrow">CTA</span>
            <div className="cta-heading" data-cms-field="heading">
              {data.heading || 'Ready to Build Something Exceptional?'}
            </div>
            {data.description && (
              <p style={{ color: 'var(--hs-text-inv-60)', fontSize: 'var(--text-lg)', maxWidth: '560px', margin: '0 auto' }} data-cms-field="description">
                {data.description}
              </p>
            )}
            <div className="cta-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2.5rem' }}>
              {data.primaryCtaText && (
                <a href={data.primaryCtaUrl || settings.bookingUrl || '/contact'} className="btn btn-primary btn-xl" data-cms-field="primaryCtaText">
                  {data.primaryCtaText}
                </a>
              )}
              {data.secondaryCtaText && (
                <a href={data.secondaryCtaUrl || `https://wa.me/${settings.whatsappNumber || ''}`} className="btn btn-ghost btn-xl" data-cms-field="secondaryCtaText">
                  {data.secondaryCtaText}
                </a>
              )}
            </div>
          </div>
        </section>
      );

    case 'logoStrip':
      return (
        <section {...wrapperProps} className={`${wrapperProps.className} section surface-white text-center`}>
          <div className="container">
            {data.heading && <p className="eyebrow" data-cms-field="heading">{data.heading}</p>}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '3rem', marginTop: '2rem' }}>
              {(data.logos || []).map((logo, i) => (
                <div key={i} style={{ opacity: 0.6, maxWidth: 120 }}>
                  <img src={logo.logoUrl} alt={logo.companyName} style={{ maxHeight: 35, width: 'auto', display: 'block' }} data-cms-field={`logos.${i}.logoUrl`} />
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'gallery':
      return (
        <section {...wrapperProps} className={`${wrapperProps.className} section surface-white`}>
          <div className="container">
            {data.heading && <h2 className="text-center" style={{ marginBottom: '2.5rem' }} data-cms-field="heading">{data.heading}</h2>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
              {(data.images || []).map((img, i) => (
                <div key={i} style={{ overflow: 'hidden', borderRadius: '8px', aspectRatio: '4/3' }}>
                  <img src={img.imageUrl} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} data-cms-field={`images.${i}.imageUrl`} />
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'videoBlock':
      return (
        <section {...wrapperProps} className={`${wrapperProps.className} section surface-white`}>
          <div className="container text-center" style={{ maxWidth: '800px' }}>
            {data.videoUrl && (
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px' }}>
                <video src={data.videoUrl} poster={data.posterUrl} controls autoPlay={data.autoplay === 'true'} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
              </div>
            )}
          </div>
        </section>
      );

    case 'contactSection':
      return (
        <section {...wrapperProps} className={`${wrapperProps.className} section surface-light`}>
          <div className="container">
            <div className="contact-grid" style={{ alignItems: 'start' }}>
              <div>
                <span className="eyebrow">Contact</span>
                <h2 data-cms-field="heading">{data.heading || "Let's Engineer Something Great"}</h2>
                {data.subheading && <p style={{ marginTop: '1rem', maxWidth: '420px' }} data-cms-field="subheading">{data.subheading}</p>}
                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {settings.email && (
                    <div className="contact-info-item">
                      <div className="contact-icon" style={{ background: 'var(--hs-emerald-a08)', border: '1px solid var(--hs-emerald-a30)', color: 'var(--hs-emerald)' }}>✉️</div>
                      <div>
                        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--hs-text-400)', marginBottom: '0.25rem' }}>Email</div>
                        <a href={`mailto:${settings.email}`} style={{ color: 'var(--hs-text-900)', fontWeight: 500 }}>{settings.email}</a>
                      </div>
                    </div>
                  )}
                  {settings.phone && (
                    <div className="contact-info-item">
                      <div className="contact-icon" style={{ background: 'var(--hs-emerald-a08)', border: '1px solid var(--hs-emerald-a30)', color: 'var(--hs-emerald)' }}>📞</div>
                      <div>
                        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--hs-text-400)', marginBottom: '0.25rem' }}>Phone</div>
                        <a href={`tel:${settings.phone}`} style={{ color: 'var(--hs-text-900)', fontWeight: 500 }}>{settings.phone}</a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="card card-light" style={{ padding: '2.5rem' }}>
                <ContactForm servicesList={globalServices.filter(s => s.published)} pageData={data} />
              </div>
            </div>
          </div>
        </section>
      );

    case 'customContent':
      return (
        <section {...wrapperProps} className={`${wrapperProps.className} section`}>
          <div className="container" dangerouslySetInnerHTML={{ __html: data.content || '' }} data-cms-field="content" />
        </section>
      );

    default:
      return null;
  }
}
