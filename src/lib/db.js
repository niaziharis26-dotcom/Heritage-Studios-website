/**
 * Heritage Studios — MongoDB-First Database Layer
 * ================================================
 * This module connects directly to MongoDB Atlas on every request.
 * It eliminates the broken /tmp file-sync approach that caused
 * stale data to appear on the Vercel frontend.
 *
 * Architecture:
 *   - MongoDB Atlas is the SINGLE SOURCE OF TRUTH
 *   - Connection is cached at the module level (survives Lambda warm instances)
 *   - db.load() populates an in-memory cache per invocation
 *   - db.get(key) reads from that cache synchronously
 *   - db.set(key, val) writes to MongoDB and updates the cache
 *   - No filesystem I/O for runtime data (no database.json dependency)
 */

const crypto = require('crypto');

// ── MongoDB connection singleton ───────────────────────────────────────────────
// Cached across Lambda warm invocations (standard Next.js serverless pattern).
let cachedClient = null;
let cachedDb = null;

async function getMongoDb() {
  if (cachedDb) return cachedDb;

  if (!process.env.MONGODB_URI) {
    return null; // No MongoDB URI — will fall back to defaults
  }

  try {
    const { MongoClient } = require('mongodb');
    if (!cachedClient) {
      cachedClient = new MongoClient(process.env.MONGODB_URI, {
        connectTimeoutMS: 8000,
        serverSelectionTimeoutMS: 8000,
        maxPoolSize: 10,
      });
      await cachedClient.connect();
    }
    cachedDb = cachedClient.db('heritage_studios');
    return cachedDb;
  } catch (err) {
    console.error('[db] MongoDB connection error:', err.message);
    cachedClient = null;
    cachedDb = null;
    return null;
  }
}

// ── Password helpers ───────────────────────────────────────────────────────────
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedPassword) {
  const [salt, hash] = storedPassword.split(':');
  const checkHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === checkHash;
}

// ── Default seed data ─────────────────────────────────────────────────────────
const DEFAULT_SERVICES = [
  {
    id: "1",
    name: "Website Development",
    slug: "website-development",
    category: "Web & E-commerce",
    shortDescription: "Premium custom-coded responsive websites tailored for business growth.",
    heroTitle: "Custom Engineered Websites",
    heroDescription: "We design and build bespoke websites that elevate your brand and drive conversions.",
    benefits: ["Fully responsive on all devices", "Search-engine optimized structure", "Blazing fast loading speeds"],
    features: ["Custom UI/UX designs", "Semantic HTML5 structure", "Contact form integrations", "Analytics tracking setup"],
    process: ["Discovery & planning", "Figma design mockup", "Custom coding & styling", "Testing & launch"],
    deliverables: ["Source code repository", "Production deployment", "SEO & analytics handoff"],
    technologies: ["React", "Next.js", "Vanilla CSS", "Node.js"],
    pricing: [
      { name: "Starter", price: "1200", currency: "USD", description: "Bespoke 5-page landing website", features: ["1 Custom Design", "Fully Responsive", "Contact Form", "Basic SEO"], popular: false, ctaText: "Select Starter" },
      { name: "Growth", price: "2500", currency: "USD", description: "Full corporate business site", features: ["Up to 12 pages", "Custom CMS integration", "Speed Optimization", "Advanced SEO", "3 months support"], popular: true, ctaText: "Select Growth" }
    ],
    faqs: [{ question: "How long does it take?", answer: "Usually between 2 to 4 weeks depending on complexity." }],
    relatedServices: ["ui-ux-design", "saas-development"],
    published: true,
    sortOrder: 1
  },
  {
    id: "2",
    name: "Shopify Development",
    slug: "shopify-development",
    category: "Web & E-commerce",
    shortDescription: "End-to-end custom Shopify storefronts and app integrations.",
    heroTitle: "High-Converting Shopify Storefronts",
    heroDescription: "Accelerate your e-commerce growth with tailored Shopify store development and premium design.",
    benefits: ["Fast page transitions", "Optimized conversion rates", "Seamless third-party apps integration"],
    features: ["Liquid custom coding", "Product schema setup", "Custom checkout branding"],
    process: ["Store strategy", "Theme design", "Coding & setup", "Migration & launch"],
    deliverables: ["Ready-to-sell Shopify store", "App configuration report", "Staff training session"],
    technologies: ["Shopify Liquid", "HTML/CSS", "JavaScript"],
    pricing: [
      { name: "Standard", price: "1500", currency: "USD", description: "Standard Shopify setup & customization", features: ["Theme Customization", "Payment Gateway Setup", "10 Products Uploaded", "Basic SEO"], popular: false, ctaText: "Get Started" },
      { name: "Custom Elite", price: "3500", currency: "USD", description: "Fully bespoke custom coded storefront", features: ["Custom Liquid design", "Advanced app integrations", "Product bundle configurations", "Speed optimization", "SEO priority"], popular: true, ctaText: "Build Custom Store" }
    ],
    faqs: [{ question: "Can you migrate my products?", answer: "Yes, we support automated migration from WooCommerce, Magento, or custom databases." }],
    relatedServices: ["wordpress-development", "payment-gateway-integration"],
    published: true,
    sortOrder: 2
  },
  {
    id: "3",
    name: "AI Solutions",
    slug: "ai-solutions",
    category: "Software & Technology",
    shortDescription: "Custom AI integrations, LLM pipelines, chatbots, and automation agents.",
    heroTitle: "Empower Your Business With Intelligent AI Solutions",
    heroDescription: "Build cutting-edge intelligence into your workflows with AI agents, chatbots, and advanced predictive modeling.",
    benefits: ["Automate manual tasks", "Provide 24/7 customer support", "Uncover data-driven insights"],
    features: ["LLM integration (OpenAI, Claude, Gemini)", "Retrieval Augmented Generation (RAG)", "Autonomous workflow agents"],
    process: ["AI audit & discovery", "Prototype validation", "Production integration", "Monitoring"],
    deliverables: ["Deployed AI system", "API documentation", "Testing suites"],
    technologies: ["Python", "Next.js", "OpenAI API", "Langchain", "Vector DBs"],
    pricing: [
      { name: "Consulting & MVP", price: "3000", currency: "USD", description: "Proof of concept or consultation", features: ["AI Strategy", "Interactive Chatbot Prototype", "API Feasibility Study"], popular: false, ctaText: "Book AI Discovery" },
      { name: "Enterprise Agent", price: "8000", currency: "USD", description: "Fully integrated AI workflow automation", features: ["Autonomous Agent setup", "Custom Database Sync", "RAG Integration", "High Security & Logging", "Admin Analytics Dashboard"], popular: true, ctaText: "Build Enterprise Agent" }
    ],
    faqs: [{ question: "Do you build custom models?", answer: "We primarily utilize and fine-tune state-of-the-art LLMs, but can assist in custom model hosting." }],
    relatedServices: ["custom-software", "saas-development"],
    published: true,
    sortOrder: 3
  },
  {
    id: "4",
    name: "Video Editing",
    slug: "video-editing",
    category: "Creative",
    shortDescription: "Premium short-form content, ads, and YouTube video post-production.",
    heroTitle: "Premium Post-Production & Video Editing",
    heroDescription: "Engaging video editing tailored for social channels, product ads, and high-retention storytelling.",
    benefits: ["Boost viewer retention", "Stunning color grading and sound design", "Fast delivery turnarounds"],
    features: ["Dynamic transitions & motion graphics", "Professional sound design", "Optimized formats for TikTok/Reels/YT"],
    process: ["Asset upload", "Rough cut review", "Polishing & graphics", "Final delivery"],
    deliverables: ["High-res exported video (MP4/MOV)", "All project source files", "Subtitles/SRT files"],
    technologies: ["Premiere Pro", "After Effects", "DaVinci Resolve"],
    pricing: [
      { name: "Shorts Pack", price: "500", currency: "USD", description: "10 high-retention short-form videos", features: ["Dynamic captions", "Sound effects", "Color grading", "1 Revision per video"], popular: true, ctaText: "Order Shorts Pack" }
    ],
    faqs: [],
    relatedServices: ["motion-graphics", "social-media-solutions"],
    published: true,
    sortOrder: 4
  }
];

const DEFAULT_PROJECTS = [
  {
    id: "p1",
    name: "Aura E-Commerce Storefront",
    slug: "aura-ecommerce",
    category: "Web & E-commerce",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800",
    gallery: [],
    description: "Bespoke custom-coded Headless storefront for a premium fragrance brand.",
    technologies: ["Next.js", "React", "Vanilla CSS", "Stripe API"],
    result: "42% increase in mobile conversion rate and 65% faster loading speed.",
    client: "Aura Cosmetics Ltd",
    featured: true,
    published: true,
    sortOrder: 1
  },
  {
    id: "p2",
    name: "Nova Intelligence Agent",
    slug: "nova-intelligence",
    category: "Software & Technology",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800",
    gallery: [],
    description: "Custom AI support agent integrated with client database to resolve up to 75% of queries instantly.",
    technologies: ["Python", "Langchain", "OpenAI GPT-4o", "Next.js"],
    result: "Reduced support ticket response times from 4 hours to instantaneous answers.",
    client: "Nova Logistics Inc",
    featured: true,
    published: true,
    sortOrder: 2
  }
];

const DEFAULT_REVIEWS = [
  {
    id: "r1",
    name: "Sarah Jenkins",
    company: "Aura Cosmetics",
    position: "Founder & CEO",
    avatar: "",
    rating: 5,
    review: "Heritage Studios transformed our online store. The custom headless e-commerce setup they built is fast, beautiful, and our sales have skyrocketed since launching.",
    published: true,
    sortOrder: 1
  },
  {
    id: "r2",
    name: "Marcus Vance",
    company: "Nova Logistics",
    position: "VP of Operations",
    avatar: "",
    rating: 5,
    review: "Their custom AI automation tools saved our team hundreds of hours. They are highly professional developers who actually deliver what they promise.",
    published: true,
    sortOrder: 2
  }
];

const DEFAULT_COMPONENTS = {
  hero: {
    heading: "Heritage Studios",
    subheading: "Where Premium Craftsmanship Meets Next-Gen Technology",
    description: "We engineer state-of-the-art websites, custom software, AI agents, and stunning creative assets for brands that refuse to settle for the ordinary.",
    primaryCtaText: "Explore Services",
    primaryCtaUrl: "/services",
    secondaryCtaText: "Book a Call",
    secondaryCtaUrl: "#book-a-call",
    visible: true
  },
  capabilities: {
    heading: "Engineered for Excellence",
    items: [
      { title: "Custom Software", desc: "Engineered solutions from SaaS portals to custom-coded architectures." },
      { title: "E-Commerce", desc: "Premium Shopify, WooCommerce, and headless commerce storefronts." },
      { title: "AI Automation", desc: "Custom AI agents, intelligent chatbots, and predictive modeling." },
      { title: "Creative Media", desc: "High-retention video editing, motion graphics, and UI/UX designs." }
    ],
    visible: true
  },
  process: {
    heading: "Our Execution Framework",
    steps: [
      { step: "01", name: "Audit & Strategy", desc: "We deep-dive into your existing architecture, goals, and workflows to map out a concrete plan." },
      { step: "02", name: "Premium Design", desc: "We build gorgeous, custom, high-fidelity layouts focusing on clean typography and branding." },
      { step: "03", name: "Clean Engineering", desc: "We write fast, semantic, and secure code with vanilla styles and robust backend mechanics." },
      { step: "04", name: "Rigorous QA", desc: "We run responsive, functional, and browser-level checks to verify 100% correctness." }
    ],
    visible: true
  },
  aboutPage: {
    heroTitle: "About Heritage Studios",
    heroSubtitle: "Crafting digital legacies with premium design and advanced engineering.",
    missionTitle: "Our Mission",
    missionDescription: "To empower businesses with state-of-the-art digital tools that drive growth and command attention.",
    values: [
      { title: "Excellence", desc: "We accept nothing less than premium quality in our code and design." },
      { title: "Innovation", desc: "Staying ahead of the curve with AI and cutting-edge tech." },
      { title: "Transparency", desc: "Clear communication and honest project management." }
    ]
  },
  servicesPage: {
    heroTitle: "Our Services",
    heroSubtitle: "Engineered solutions tailored to elevate your business operations and digital presence.",
    ctaTitle: "Ready to Start?",
    ctaDescription: "Let's discuss how we can transform your digital strategy."
  },
  contactPage: {
    heroTitle: "Get in Touch",
    heroSubtitle: "We're ready to engineer your next big project.",
    formTitle: "Send us a Message",
    formDescription: "Fill out the form below and our team will get back to you within 24 hours."
  },
  cta: {
    heading: 'Ready to Elevate Your Technology?',
    description: 'Book a strategic scoping call with our lead engineers today to review your project requirement.',
    primaryCtaText: 'Book Strategy Session',
    primaryCtaUrl: 'https://calendly.com/heritagestudios',
    secondaryCtaText: 'Chat on WhatsApp',
    visible: true
  },
  servicesSection: {
    heading: 'Our Services',
    subheading: 'Engineered digital products custom designed for business outcomes.',
    visible: true
  },
  projectsSection: {
    heading: 'Featured Projects',
    subheading: 'A showcase of our recent bespoke designs and technical engineering.',
    visible: true
  },
  reviewsSection: {
    heading: 'What Our Clients Say',
    visible: true
  },
  dashboardShowcase: {
    visible: true
  },
  contactSection: {
    heading: "Let's Engineer Something Great",
    subheading: 'Reach out to discuss your technical, e-commerce, custom software, or creative requirements.',
    visible: true
  }
};

const DEFAULT_SETTINGS = {
  companyName: "Heritage Studios",
  logoText: "HERITAGE STUDIOS",
  email: "hello@heritagestudios.co",
  phone: "+1 (555) 019-2834",
  whatsappNumber: "15550192834",
  whatsappMessage: "Hi Heritage Studios, I would like to build a premium digital project with you.",
  bookingUrl: "https://calendly.com/heritagestudios",
  defaultSeoTitle: "Heritage Studios | Premium Tech, E-commerce, Software & Creative Agency",
  defaultSeoDescription: "We engineer premium digital solutions including custom software, Shopify development, AI chatbots, video editing, and advanced analytics.",
  footerText: "Crafting digital assets with mathematical precision and premium creative flair.",
  copyright: "© 2026 Heritage Studios. All rights reserved.",
  instagramUrl: "https://instagram.com/heritagestudios",
  facebookUrl: "https://facebook.com/heritagestudios",
  youtubeUrl: "https://youtube.com/heritagestudios",
  tiktokUrl: "https://tiktok.com/@heritagestudios",
  linkedinUrl: "https://linkedin.com/company/heritagestudios"
};

const INITIAL_DB = {
  admin: {
    username: "haris",
    passwordHash: hashPassword("Asusrogphone123")
  },
  navigation: {
    links: [
      { id: 'n1', name: 'Home', path: '/', visible: true, order: 1 },
      { id: 'n2', name: 'Services', path: '/services', visible: true, order: 2 },
      { id: 'n3', name: 'About', path: '/about', visible: true, order: 3 },
      { id: 'n4', name: 'Projects', path: '/projects', visible: true, order: 4 },
      { id: 'n5', name: 'Reviews', path: '/reviews', visible: true, order: 5 },
      { id: 'n6', name: 'Social Media', path: '/social-media', visible: true, order: 6 },
      { id: 'n7', name: 'Contact', path: '/contact', visible: true, order: 7 }
    ],
    ctaText: 'Book a Call',
    ctaUrl: 'https://calendly.com/heritagestudios'
  },
  footer: {
    ctaHeading: 'Ready to grow your brand?',
    ctaSub: "Let's build something extraordinary together.",
    ctaPrimaryText: 'WhatsApp Us',
    ctaSecondaryText: 'Book a Strategy Call',
    tagline: 'Crafting digital assets with mathematical precision and premium creative flair.',
    companyLinksTitle: 'Company',
    companyLinks: [
      { name: 'Home', path: '/' },
      { name: 'About Us', path: '/about' },
      { name: 'All Services', path: '/services' },
      { name: 'Portfolio', path: '/projects' },
      { name: 'Client Reviews', path: '/reviews' },
      { name: 'Social Media', path: '/social-media' },
      { name: 'Contact', path: '/contact' }
    ],
    servicesColumnTitle: 'Services',
    contactColumnTitle: 'Get in Touch'
  },
  settings: DEFAULT_SETTINGS,
  services: DEFAULT_SERVICES,
  projects: DEFAULT_PROJECTS,
  reviews: DEFAULT_REVIEWS,
  components: DEFAULT_COMPONENTS,
  homepageSections: ["hero", "capabilities", "services", "dashboardShowcase", "process", "projects", "reviews", "cta", "contact"],
  inquiries: [],
  clients: [],
  internalProjects: [],
  tasks: [],
  media: [],
  drafts: {},
  revisions: [],
  activityLog: [],
  pages: [
    { id: 'home', title: 'Home', slug: '/', status: 'published', template: 'default', seo: { title: '', description: '', robots: 'index,follow', ogImage: '' }, lastModified: null },
    { id: 'about', title: 'About', slug: '/about', status: 'published', template: 'default', seo: { title: '', description: '', robots: 'index,follow', ogImage: '' }, lastModified: null },
    { id: 'services', title: 'Services', slug: '/services', status: 'published', template: 'default', seo: { title: '', description: '', robots: 'index,follow', ogImage: '' }, lastModified: null },
    { id: 'projects', title: 'Projects', slug: '/projects', status: 'published', template: 'default', seo: { title: '', description: '', robots: 'index,follow', ogImage: '' }, lastModified: null },
    { id: 'reviews', title: 'Reviews', slug: '/reviews', status: 'published', template: 'default', seo: { title: '', description: '', robots: 'index,follow', ogImage: '' }, lastModified: null },
    { id: 'contact', title: 'Contact', slug: '/contact', status: 'published', template: 'default', seo: { title: '', description: '', robots: 'index,follow', ogImage: '' }, lastModified: null },
    { id: 'social-media', title: 'Social Media', slug: '/social-media', status: 'published', template: 'default', seo: { title: '', description: '', robots: 'index,follow', ogImage: '' }, lastModified: null },
  ],
  globalStyles: {
    primaryColor: '#059669',
    secondaryColor: '#0a0f1a',
    accentColor: '#34d399',
    headingFont: 'Outfit',
    bodyFont: 'Plus Jakarta Sans',
    baseFontSize: '16px',
    borderRadius: '12px',
    containerWidth: '1280px',
  },
};

// ── Database class ─────────────────────────────────────────────────────────────
class Database {
  constructor() {
    this.data = null;
    this._loadPromise = null;
  }

  /**
   * Load all data from MongoDB Atlas into in-memory cache.
   * Called at the start of every Server Component request via `await db.load()`.
   * Subsequent calls within the same module instance return instantly from cache.
   */
  async load() {
    // Implement a 2-second TTL to deduplicate calls within the same request 
    // (generateMetadata, layout, page) while ensuring warm Lambdas don't serve stale data.
    const now = Date.now();
    if (this.data && this._lastLoadTime && (now - this._lastLoadTime < 2000)) {
      return this.data;
    }

    // Deduplicate concurrent load() calls
    if (this._loadPromise) return this._loadPromise;

    this._loadPromise = this._fetchFromMongo().then(data => {
      this.data = data;
      this._lastLoadTime = Date.now();
      this._loadPromise = null;
      return data;
    });
    
    return this._loadPromise;
  }

  async _fetchFromMongo() {
    const mongoDb = await getMongoDb();

    if (mongoDb) {
      try {
        const doc = await mongoDb.collection('database').findOne({ _id: 'main' });
        if (doc) {
          const { _id, ...rest } = doc;
          const data = this._mergeDefaults(rest);
          console.log('[db] Loaded data from MongoDB Atlas');
          return data;
        } else {
          // Collection exists but no document — seed with defaults
          console.log('[db] No document in MongoDB — seeding with defaults');
          const seedData = JSON.parse(JSON.stringify(INITIAL_DB));
          await this._writeToMongo(seedData);
          return seedData;
        }
      } catch (err) {
        console.error('[db] Failed to fetch from MongoDB, using defaults:', err.message);
      }
    } else {
      // Try to load from database.json as a local fallback (dev only)
      try {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(process.cwd(), 'database.json');
        if (fs.existsSync(filePath)) {
          const raw = fs.readFileSync(filePath, 'utf8');
          const parsed = JSON.parse(raw);
          console.log('[db] Loaded data from local database.json (dev fallback)');
          return this._mergeDefaults(parsed);
        }
      } catch (e) {
        console.warn('[db] Could not load database.json:', e.message);
      }
    }

    // Last resort: use INITIAL_DB defaults
    console.log('[db] Using hardcoded INITIAL_DB defaults');
    return JSON.parse(JSON.stringify(INITIAL_DB));
  }

  /**
   * Merge loaded data with defaults to handle missing/new keys.
   */
  _mergeDefaults(data) {
    const merged = { ...JSON.parse(JSON.stringify(INITIAL_DB)), ...data };

    // Deep merge components so new component keys aren't lost
    merged.components = { ...DEFAULT_COMPONENTS, ...(data.components || {}) };

    // Ensure array fields exist
    if (!merged.navigation) merged.navigation = INITIAL_DB.navigation;
    if (!merged.footer) merged.footer = INITIAL_DB.footer;
    if (!merged.clients) merged.clients = [];
    if (!merged.drafts) merged.drafts = {};
    if (!merged.revisions) merged.revisions = [];
    if (!merged.activityLog) merged.activityLog = [];
    if (!merged.pages || !Array.isArray(merged.pages) || merged.pages.length === 0) {
      merged.pages = INITIAL_DB.pages;
    }
    if (!merged.globalStyles) merged.globalStyles = INITIAL_DB.globalStyles;

    return merged;
  }

  /**
   * Write the full data object to MongoDB.
   */
  async _writeToMongo(data) {
    const mongoDb = await getMongoDb();
    if (!mongoDb) {
      console.warn('[db] No MongoDB connection — write skipped');
      return false;
    }

    try {
      // Prune revisions before writing to keep document size reasonable
      const saveData = JSON.parse(JSON.stringify(data || {}));
      if (saveData.revisions) {
        saveData.revisions = saveData.revisions.slice(-50);
      }
      if (saveData.activityLog) {
        saveData.activityLog = saveData.activityLog.slice(0, 500);
      }

      await mongoDb.collection('database').updateOne(
        { _id: 'main' },
        { $set: saveData },
        { upsert: true }
      );
      return true;
    } catch (err) {
      console.error('[db] MongoDB write error:', err.message);
      return false;
    }
  }

  /**
   * Synchronous read from in-memory cache.
   * MUST call await db.load() before calling db.get() in async contexts.
   * For API routes that always call db.set(), the data is already loaded.
   */
  get(key) {
    if (!this.data) {
      // Fallback: load defaults synchronously if load() was somehow not called
      this.data = JSON.parse(JSON.stringify(INITIAL_DB));
      console.warn('[db] db.get() called before db.load() — using defaults for key:', key);
    }
    return this.data[key];
  }

  /**
   * Persist a top-level key to MongoDB and update in-memory cache.
   * API routes call this after every admin action.
   */
  async set(key, val) {
    // Ensure data is loaded before mutating
    await this.load();
    this.data[key] = val;

    const saved = await this._writeToMongo(this.data);
    if (saved) {
      console.log(`[db] Saved key "${key}" to MongoDB`);
    } else {
      // Local dev fallback: write to database.json
      try {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(process.cwd(), 'database.json');
        fs.writeFileSync(filePath, JSON.stringify(this.data, null, 2), 'utf8');
        console.log(`[db] Saved key "${key}" to local database.json (dev fallback)`);
      } catch (e) {
        console.error('[db] Failed to write to local database.json:', e.message);
      }
    }

    return val;
  }

  /**
   * Force a fresh fetch from MongoDB on the next db.get() call.
   * Called after revalidatePath() to ensure the next SSR render picks up latest data.
   */
  invalidate() {
    this.data = null;
    this._loadPromise = null;
    this._lastLoadTime = 0;
  }

  // ── Admin authentication ───────────────────────────────────────────────────

  verifyAdmin(usernameInput, passwordInput) {
    if (!this.data) this.data = JSON.parse(JSON.stringify(INITIAL_DB));
    if (!usernameInput || !passwordInput) return false;
    const u = String(usernameInput).toLowerCase().trim();
    const p = String(passwordInput).trim();

    // 1. Environment variable override
    if (process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) {
      if (u === process.env.ADMIN_USERNAME.toLowerCase().trim() && p === process.env.ADMIN_PASSWORD.trim()) {
        return true;
      }
    }

    // 2. Direct fail-safe check (for recovery)
    if ((u === 'haris' || u === 'admin') && (p === 'Asusrogphone123' || p === 'admin123')) {
      return true;
    }

    // 3. Database hash check
    const admin = this.data.admin || {};
    if (admin.username && admin.username.toLowerCase().trim() === u && admin.passwordHash) {
      return verifyPassword(p, admin.passwordHash);
    }
    return false;
  }

  updateAdminPassword(newPassword) {
    if (!this.data) this.data = JSON.parse(JSON.stringify(INITIAL_DB));
    this.data.admin.passwordHash = hashPassword(newPassword);
    return this.set('admin', this.data.admin);
  }

  // ── CMS Visual Editor helpers ──────────────────────────────────────────────

  async logActivity(user, action, details) {
    await this.load();
    if (!this.data.activityLog) this.data.activityLog = [];
    this.data.activityLog.unshift({
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      user: user || 'admin',
      action,
      details,
    });
    this.data.activityLog = this.data.activityLog.slice(0, 500);
    await this._writeToMongo(this.data);
  }

  async createRevision(user, label, snapshot) {
    await this.load();
    if (!this.data.revisions) this.data.revisions = [];
    this.data.revisions.push({
      id: `rev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      user: user || 'admin',
      label: label || 'Unnamed revision',
      snapshot: JSON.parse(JSON.stringify(snapshot)),
    });
    this.data.revisions = this.data.revisions.slice(-50);
    await this._writeToMongo(this.data);
  }

  getDraft(key) {
    const drafts = this.data?.drafts || {};
    return drafts[key] || null;
  }

  async setDraft(key, val) {
    await this.load();
    if (!this.data.drafts) this.data.drafts = {};
    this.data.drafts[key] = { ...val, _draftedAt: new Date().toISOString() };
    await this._writeToMongo(this.data);
    return this.data.drafts[key];
  }

  async publishDraft(key) {
    await this.load();
    const draft = this.data.drafts && this.data.drafts[key];
    if (!draft) return false;
    if (!this.data.components) this.data.components = {};
    const { _draftedAt, ...cleanDraft } = draft;
    this.data.components[key] = { ...this.data.components[key], ...cleanDraft };
    delete this.data.drafts[key];
    await this._writeToMongo(this.data);
    return true;
  }

  /**
   * syncToGithub() — kept as a no-op stub.
   * Previously synced database.json to GitHub on every save.
   * MongoDB is now the source of truth; this method is no longer needed.
   * Existing callers (CMS routes) can continue calling it without error.
   */
  async syncToGithub() {
    // No-op: MongoDB is now the authoritative source of truth.
    // GitHub database.json is a static seed file only.
    return false;
  }
}

// ── Singleton export ───────────────────────────────────────────────────────────
const dbInstance = new Database();
module.exports = dbInstance;
