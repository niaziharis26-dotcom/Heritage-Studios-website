export const dynamic = 'force-dynamic';
import Link from 'next/link';
import db from '@/lib/db';
import TechMarquee from '@/components/TechMarquee';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/siteConfig';

export const metadata = {
  title: `${SITE_NAME} | Premium Tech, E-commerce, Software & Creative Agency`,
  description:
    'Heritage Studios engineers state-of-the-art websites, custom software, AI agents, Shopify stores, paid advertising campaigns, and professional video content for brands in Pakistan and worldwide.',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: `${SITE_NAME} | Premium Technology & Digital Agency`,
    description:
      'Heritage Studios engineers state-of-the-art websites, custom software, AI agents, Shopify stores, paid advertising, and video content for brands worldwide.',
    url: SITE_URL,
    type: 'website',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Heritage Studios — Premium Technology & Digital Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | Premium Technology & Digital Agency`,
    description:
      'Premium digital agency engineering websites, Shopify stores, AI solutions, and creative media for ambitious businesses.',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default async function HomePage() {
  await db.load();
  const components = db.get('components') || {};
  const services   = db.get('services') || [];
  const projects   = db.get('projects') || [];
  const reviews    = db.get('reviews') || [];
  const settings   = db.get('settings') || {};

  const sectionOrder = db.get('homepageSections') || [
    'hero', 'capabilities', 'services', 'dashboardShowcase', 'process', 'projects', 'clientBrands', 'reviews', 'cta', 'contact'
  ];

  const activeServices = services.filter(s => s.published).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  const featuredProjects = projects.filter(p => p.published && p.featured).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  const activeReviews = reviews.filter(r => r.published).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const sectionMap = {

    /* HERO */
    hero: () => {
      const h = components.hero || {};
      if (h.visible === false) return null;
      return (
        <section key="hero" data-cms-id="hero" className="section-hero surface-light">
          <div className="container">
            <div className="hero-grid">
              {/* Left */}
              <div className="animate-fade-up">
                <div className="hero-tag" data-cms-field="subheading">{h.subheading || 'Premium Digital Agency'}</div>
                <h1 className="hero-heading" data-cms-field="heading">
                  {h.heading || 'Heritage Studios'}
                </h1>
                <p className="hero-desc" data-cms-field="description">
                  {h.description || 'We engineer state-of-the-art websites, custom software, AI agents, and stunning creative assets for brands that refuse to settle for ordinary.'}
                </p>
                <div className="hero-actions">
                  {h.primaryCtaText && (
                    <Link href={h.primaryCtaUrl || '/services'} className="btn btn-dark btn-lg" data-cms-field="primaryCtaText">
                      {h.primaryCtaText}
                    </Link>
                  )}
                  {h.secondaryCtaText && (
                    <Link href={h.secondaryCtaUrl || '/contact'} className="btn btn-outline btn-lg" data-cms-field="secondaryCtaText">
                      {h.secondaryCtaText}
                    </Link>
                  )}
                </div>
              </div>

              {/* Right - Floating Tech Cards */}
              <div className="hero-visual" aria-hidden="true">
                <div className="hero-bg-glow" />

                {/* Animated Virtual Mouse Cursor */}
                <div className="hero-mouse-cursor">
                  <svg className="hero-mouse-icon" viewBox="0 0 24 24" width="26" height="26">
                    <path d="M3 3l7 18 3-7 7-3L3 3z" fill="var(--hs-emerald)" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round"/>
                  </svg>
                  <div className="hero-mouse-click-ring" />
                </div>

                <div className="hero-card hero-card-1 card card-glass-light animate-fade-up delay-2">
                  <div className="hero-card-label">
                    <span className="status-dot green" />
                    Monthly Revenue
                  </div>
                  <div className="hero-card-value">$128k</div>
                  <div className="hero-card-sub" style={{ color: 'var(--hs-emerald)', fontWeight: 600, fontSize: '0.8rem', marginTop: '0.25rem' }}>+24.8% this month</div>
                </div>

                <div className="hero-card hero-card-2 card card-glass-light animate-fade-up delay-3">
                  <div className="hero-card-label">
                    <span className="status-dot gold" />
                    Conversion Rate
                  </div>
                  <div className="hero-card-value em">3.42%</div>
                  <div className="hero-card-sub">+0.8pt vs last period</div>
                </div>

                <div className="hero-card hero-card-3 card card-glass-light animate-fade-up delay-4">
                  <div className="hero-card-label">Tech Stack</div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                    {['React', 'Next.js', 'Node.js', 'Python'].map(t => (
                      <span key={t} style={{ padding: '0.2rem 0.55rem', background: 'var(--hs-emerald-a08)', border: '1px solid var(--hs-emerald-a30)', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--hs-emerald)', letterSpacing: '0.05em' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    },

    /* CAPABILITIES */
    capabilities: () => {
      const cap = components.capabilities || {};
      if (cap.visible === false) return null;
      const icons = ['⚡', '🛒', '🤖', '🎬', '📐', '🔗'];
      return (
        <section key="capabilities" data-cms-id="capabilities" className="section surface-white">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">What We Do</span>
              <h2 data-cms-field="heading">{cap.heading || 'Core Capabilities'}</h2>
              <p>Technology should make business simpler, faster, and more profitable.</p>
            </div>
            <div className="capabilities-grid">
              {(cap.items || []).map((item, i) => (
                <div key={i} className="cap-card">
                  <div className="cap-icon" aria-hidden="true">{icons[i] || '⚡'}</div>
                  <h3 data-cms-field={"items." + i + ".title"}>{item.title}</h3>
                  <p data-cms-field={"items." + i + ".desc"}>{item.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '3.5rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <span className="eyebrow" style={{ fontSize: '0.75rem', letterSpacing: '0.12em' }}>Technologies & Software Stack</span>
              </div>
              <TechMarquee technologies={components.marqueeTechnologies || [
                'Shopify', 'WordPress', 'React', 'Next.js', 'Meta Ads', 'Google Ads',
                'WooCommerce', 'Elementor', 'Daraz', 'OpenAI', 'Python', 'Mobile Apps',
                'Laravel', 'Node.js', 'Premiere Pro'
              ]} variant="light" />
            </div>
          </div>
        </section>
      );
    },

    /* SERVICES */
    services: () => {
      if (components.servicesSection?.visible === false) return null;
      const sec = components.servicesSection || {};

      const serviceCards = (sec.cards || [])
        .filter(card => card.visible !== false)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
        .map(card => {
          const svcData = services.find(s => s.id === card.id && s.published);
          if (!svcData) return null;
          return { ...svcData, ...card };
        })
        .filter(Boolean);

      const displayCards = activeServices.filter(s => !s.parentService);

      return (
        <section key="services" data-cms-id="servicesSection" className="section-lg surface-dark">
          <div className="container">
            <div className="section-header" style={{ maxWidth: '760px' }}>
              <span className="eyebrow">Our Services</span>
              <h2 data-cms-field="heading">
                {sec.heading || 'Technology & Digital Services Built for Business Growth'}
              </h2>
              <p style={{ color: 'var(--hs-text-inv-60)', fontSize: 'var(--text-lg)', maxWidth: '640px' }} data-cms-field="subheading">
                {sec.subheading || 'From websites and eCommerce platforms to paid advertising and professional video content, Heritage Studios helps businesses build, improve and grow their digital presence.'}
              </p>
            </div>

            <div className="hp-services-grid">
              {displayCards.map((card, i) => (
                <Link
                  key={card.id || i}
                  href={card.ctaUrl || ("/services/" + card.slug)}
                  className={"hp-svc-card" + (card.featured ? " hp-svc-card-featured" : "")}
                  data-cms-id={card.id}
                  aria-label={"Explore " + card.name}
                >
                  {card.badge && (
                    <div className="hp-svc-card-badge">
                      <span className="badge badge-emerald" data-cms-field="badge">{card.badge}</span>
                    </div>
                  )}
                  <div className="hp-svc-icon" aria-hidden="true" data-cms-field="icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {card.icon && card.icon.startsWith('/') ? (
                      <img src={card.icon} alt={card.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      card.icon || '◆'
                    )}
                  </div>
                  <div className="hp-svc-title" data-cms-field="name">{card.name}</div>
                  <p className="hp-svc-desc" data-cms-field="shortDescription">{card.shortDescription}</p>
                  {card.startingPrice && (
                    <div className="hp-svc-price" data-cms-field="startingPrice">
                      {card.startingPrice}
                    </div>
                  )}
                  <div className="hp-svc-cta" data-cms-field="ctaText">
                    {card.ctaText || 'Explore Service'}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14" aria-hidden="true">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <Link href="/services" className="btn btn-outline-inv btn-lg">
                View All Services
              </Link>
            </div>
          </div>
        </section>
      );
    },

    /* DASHBOARD SHOWCASE */
    dashboardShowcase: () => {
      if (components.dashboardShowcase?.visible === false) return null;
      return (
        <section key="dashboardShowcase" data-cms-id="dashboardShowcase" className="section-lg surface-dark-2">
          <div className="container">
            <div className="section-header centered text-center">
              <span className="eyebrow">Technology</span>
              <h2>We Build High-Performance Digital Systems</h2>
              <p style={{ color: 'var(--hs-text-inv-60)', margin: '0 auto', maxWidth: '560px' }}>
                Not just websites - custom software and analytics platforms engineered for real business outcomes.
              </p>
            </div>

            <div className="db-showcase card card-glass">
              <div className="db-topbar">
                <div className="db-title-row">
                  <span className="status-dot green" />
                  Heritage Analytics Dashboard
                  <span className="badge badge-emerald" style={{ marginLeft: '0.5rem' }}>Live</span>
                </div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--hs-text-inv-60)' }}>Updated just now</span>
              </div>

              <div className="db-kpis">
                <div>
                  <span className="db-kpi-label">Revenue (MTD)</span>
                  <div className="db-kpi-value">$128,492</div>
                  <div className="db-kpi-delta">+18.4% vs last month</div>
                </div>
                <div>
                  <span className="db-kpi-label">Orders</span>
                  <div className="db-kpi-value">1,402</div>
                  <div className="db-kpi-delta">+9.2%</div>
                </div>
                <div>
                  <span className="db-kpi-label">Conversion Rate</span>
                  <div className="db-kpi-value em">3.42%</div>
                  <div className="db-kpi-delta">+0.8pt</div>
                </div>
                <div>
                  <span className="db-kpi-label">Active Users</span>
                  <div className="db-kpi-value">2,840</div>
                  <div className="db-kpi-delta">+24.1%</div>
                </div>
              </div>

              <div className="db-chart" aria-hidden="true" aria-label="Revenue chart">
                <svg viewBox="0 0 800 180" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--hs-emerald)" stopOpacity="0.25"/>
                      <stop offset="100%" stopColor="var(--hs-emerald)" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path d="M0 160 C80 145,140 155,200 100 C260 55,340 110,420 65 C500 20,580 80,660 42 C720 18,770 35,800 10"
                    fill="none" stroke="var(--hs-emerald)" strokeWidth="2.5" vectorEffect="non-scaling-stroke"/>
                  <path d="M0 160 C80 145,140 155,200 100 C260 55,340 110,420 65 C500 20,580 80,660 42 C720 18,770 35,800 10 L800 180 L0 180Z"
                    fill="url(#chartGrad)"/>
                </svg>
              </div>
            </div>
          </div>
        </section>
      );
    },

    /* PROCESS */
    process: () => {
      const proc = components.process || {};
      if (proc.visible === false) return null;
      return (
        <section key="process" data-cms-id="process" className="section surface-light">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">How We Work</span>
              <h2 data-cms-field="heading">{proc.heading || 'Our Execution Framework'}</h2>
            </div>
            <div className="grid-4" style={{ gap: '1.5rem', marginTop: '1rem' }}>
              {(proc.steps || []).map((step, i) => (
                <div key={i} className="card card-light" style={{ padding: '2.5rem 2rem' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 300, color: 'var(--hs-border-light)', lineHeight: 1, marginBottom: '1.5rem' }} data-cms-field={"steps." + i + ".step"}>
                    {step.step || ("0" + (i + 1))}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--hs-text-900)', marginBottom: '0.75rem' }} data-cms-field={"steps." + i + ".name"}>{step.name}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--hs-text-400)' }} data-cms-field={"steps." + i + ".desc"}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    },

    /* PROJECTS */
    projects: () => {
      if (components.projectsSection?.visible === false) return null;
      const sec = components.projectsSection || {};
      if (featuredProjects.length === 0) return null;
      return (
        <section key="projects" data-cms-id="projectsSection" className="section-lg surface-white">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Portfolio</span>
              <h2 data-cms-field="heading">{sec.heading || 'Featured Projects'}</h2>
              <p data-cms-field="subheading">{sec.subheading || 'A showcase of our recent bespoke designs and technical engineering.'}</p>
            </div>
            <div className="projects-grid-asym">
              {featuredProjects.slice(0, 4).map((proj, i) => (
                <Link href="/projects" key={proj.id}
                  className={"proj-card " + (i % 3 === 0 ? "span-8" : "span-4")}
                  aria-label={"View project: " + proj.name}>
                  {proj.image
                    ? <img src={proj.image} alt={proj.name} className="proj-img" loading="lazy" />
                    : <div style={{ width:'100%',height:'100%',background:'linear-gradient(135deg,var(--hs-charcoal-2),var(--hs-charcoal-3))' }} aria-hidden="true"/>
                  }
                  <div className="proj-overlay">
                    <span className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>{proj.category}</span>
                    <h3 style={{ color: 'var(--hs-text-inv)', fontSize: '1.4rem' }}>{proj.name}</h3>
                    {proj.result && (
                      <p style={{ color: 'var(--hs-emerald)', fontSize: 'var(--text-sm)', marginTop: '0.4rem', fontWeight: 600 }}>
                        {proj.result}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
              <Link href="/projects" className="btn btn-dark btn-lg">View All Projects</Link>
            </div>
          </div>
        </section>
      );
    },

    /* CLIENT BRANDS / COLLABORATIONS */
    clientBrands: () => {
      const brandLogos = [
        { name: 'Aura Luxe', symbol: '✦', industry: 'E-Commerce' },
        { name: 'Nexus Media', symbol: '◈', industry: 'Publishing & WP' },
        { name: 'Vanguard SaaS', symbol: '▲', industry: 'Fintech & Cloud' },
        { name: 'Apex Apparel', symbol: '❖', industry: 'Shopify Fashion' },
        { name: 'Zenix Growth', symbol: '⚡', industry: 'Paid Media' },
        { name: 'Nova AI Labs', symbol: '🤖', industry: 'Custom AI Software' },
        { name: 'Quantum Tech', symbol: '🎬', industry: 'Video Production' },
        { name: 'Solstice Media', symbol: '✪', industry: 'Social Media Ads' },
      ];
      return (
        <section key="clientBrands" className="section-sm surface-dark" style={{ borderTop: '1px solid var(--hs-border-dark)', borderBottom: '1px solid var(--hs-border-dark)' }}>
          <div className="container">
            <div className="text-center mb-6">
              <span className="eyebrow" style={{ marginBottom: '0.4rem' }}>Trusted Collaborations</span>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--hs-text-inv-60)' }}>Brands, stores, and tech platforms we've built, optimized, and engineered for</p>
            </div>
            <div className="tech-marquee-wrap">
              <div className="tech-marquee-track">
                {[...brandLogos, ...brandLogos, ...brandLogos].map((brand, i) => (
                  <div key={i} className="client-logo-pill">
                    <span className="client-logo-icon">{brand.symbol}</span>
                    <span>{brand.name}</span>
                    <span style={{ fontSize: '0.65rem', opacity: 0.5, fontWeight: 500 }}>({brand.industry})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      );
    },

    /* REVIEWS */
    reviews: () => {
      if (components.reviewsSection?.visible === false) return null;
      const sec = components.reviewsSection || {};
      if (activeReviews.length === 0) return null;
      return (
        <section key="reviews" data-cms-id="reviewsSection" className="section-lg surface-light">
          <div className="container">
            <div className="section-header centered text-center">
              <span className="eyebrow">Client Feedback</span>
              <h2 data-cms-field="heading">{sec.heading || 'What Our Clients Say'}</h2>
            </div>
            <div className="reviews-grid">
              {activeReviews.map((rev) => (
                <div key={rev.id} className="card card-light review-card" data-cms-id={rev.id}>
                  <div style={{ color: 'var(--hs-gold)', fontSize: '1.1rem', marginBottom: '1rem' }} aria-label={(rev.rating || 5) + " stars"}>
                    {'★'.repeat(rev.rating || 5)}
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--hs-text-600)', lineHeight: 1.75, flex: 1, marginBottom: '1.5rem' }}>
                    "{rev.review}"
                  </p>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--hs-text-900)', fontSize: 'var(--text-sm)' }}>{rev.name}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--hs-text-400)' }}>{rev.position}, {rev.company}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    },

    /* CTA */
    cta: () => {
      const c = components.cta || {};
      if (c.visible === false) return null;
      return (
        <section key="cta" data-cms-id="cta" className="section-lg surface-dark text-center" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <span className="eyebrow">Start Building</span>
            <h2 style={{ marginTop: '0.75rem', marginBottom: '1.25rem', color: 'var(--hs-text-inv)', fontSize: 'clamp(2rem,4vw,3.25rem)' }} data-cms-field="heading">
              {c.heading || 'Ready to Elevate Your Digital Systems?'}
            </h2>
            <p style={{ color: 'var(--hs-text-inv-60)', maxWidth: '540px', margin: '0 auto 2.5rem', fontSize: 'var(--text-lg)' }} data-cms-field="description">
              {c.description || 'Schedule a scoping call with our lead engineers to map out your project requirement, timeline, and exact scope.'}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href={c.primaryCtaUrl || '/contact'} className="btn btn-primary btn-xl" data-cms-field="primaryCtaText">
                {c.primaryCtaText || 'Book Strategy Session'}
              </Link>
              <a href={settings.whatsappNumber ? ("https://wa.me/" + settings.whatsappNumber + "?text=" + encodeURIComponent(settings.whatsappMessage || 'Hi')) : '/contact'}
                target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-xl">
                {c.secondaryCtaText || 'Chat on WhatsApp'}
              </a>
            </div>
          </div>
        </section>
      );
    },

    /* CONTACT */
    contact: () => {
      if (components.contactSection?.visible === false) return null;
      const sec = components.contactSection || {};
      return (
        <section key="contact" data-cms-id="contactSection" className="section-lg surface-white">
          <div className="container">
            <div className="contact-grid">
              <div>
                <span className="eyebrow">Get in Touch</span>
                <h2 data-cms-field="heading" style={{ marginTop: '0.75rem', marginBottom: '1.25rem' }}>
                  {sec.heading || "Let's Engineer Something Great"}
                </h2>
                <p style={{ color: 'var(--hs-text-400)', marginBottom: '2.5rem' }} data-cms-field="subheading">
                  {sec.subheading || 'Reach out to discuss your technical, e-commerce, custom software, or creative requirements.'}
                </p>

                <div className="contact-info-item">
                  <div className="contact-icon" style={{ background: 'var(--hs-emerald-a08)', color: 'var(--hs-emerald)' }}>Email</div>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'var(--hs-text-400)' }}>Email</div>
                    <a href={"mailto:" + (settings.email || 'hello@heritagestudios.co')} style={{ color: 'var(--hs-text-900)', fontWeight: 600, textDecoration: 'none' }}>
                      {settings.email || 'hello@heritagestudios.co'}
                    </a>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon" style={{ background: 'var(--hs-gold-a12)', color: 'var(--hs-gold)' }}>WhatsApp</div>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'var(--hs-text-400)' }}>WhatsApp</div>
                    <a href={settings.whatsappNumber ? ("https://wa.me/" + settings.whatsappNumber) : '#'}
                      target="_blank" rel="noopener noreferrer" style={{ color: 'var(--hs-text-900)', fontWeight: 600, textDecoration: 'none' }}>
                      {settings.phone || '+1 (555) 019-2834'}
                    </a>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="card card-light" style={{ padding: '2.5rem', borderRadius: 'var(--r-xl)' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>Send a Message</h3>
                <form action="/api/contact" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">Name</label>
                      <input id="name" name="name" type="text" className="form-input" placeholder="Your name" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="email">Email</label>
                      <input id="email" name="email" type="email" className="form-input" placeholder="your@email.com" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="service">Interested Service</label>
                    <select id="service" name="service" className="form-input" defaultValue="">
                      <option value="" disabled>Select a service...</option>
                      <option value="custom-web">Custom Website Development</option>
                      <option value="shopify">Shopify Development</option>
                      <option value="wordpress">WordPress Services</option>
                      <option value="ads">Paid Advertising & Marketing</option>
                      <option value="video">Video Editing & Media</option>
                      <option value="other">Other Inquiry</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="message">Message</label>
                    <textarea id="message" name="message" className="form-input" placeholder="Tell us about your project requirements..." required />
                  </div>
                  <button type="submit" className="btn btn-dark btn-lg w-full" style={{ marginTop: '0.5rem' }}>
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      );
    },
  };

  return (
    <>
      {sectionOrder.map(secKey => {
        const renderFn = sectionMap[secKey];
        return renderFn ? renderFn() : null;
      })}
    </>
  );
}
