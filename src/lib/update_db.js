const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', '..', 'database.json');
console.log('Reading DB from:', DB_PATH);

if (!fs.existsSync(DB_PATH)) {
  console.error('Database file not found!');
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

// 1. Overhaul services list
db.services = [
  {
    id: "custom-web-development",
    name: "Custom Website Development",
    slug: "custom-web-development",
    category: "Web & E-commerce",
    shortDescription: "Custom websites, web applications, dashboards, APIs, portals, and scalable digital solutions.",
    heroTitle: "Custom Engineered Website Development",
    heroDescription: "We design and build bespoke, high-performance websites and web applications tailored for business growth and seamless user experience.",
    benefits: [
      "Tailored UI/UX designed around your brand identity",
      "Optimized for high-speed, SEO performance, and responsive viewports",
      "Clean, scalable codebase using modern frameworks"
    ],
    features: [
      "Custom React, Next.js, and Node.js solutions",
      "Laravel/PHP backend applications & secure REST APIs",
      "Interactive customer portals & database management",
      "Third-party integrations, custom dashboards & SaaS features"
    ],
    process: [
      "Tell Us Your Requirement: Send project details and goals.",
      "We Analyze: Review stack options, pages, and scope.",
      "Get Your Quote: Clear pricing milestones and timelines.",
      "We Build & Deliver: Engineering, deployment, and optimization."
    ],
    deliverables: [
      "Source Code Repository & Documentation",
      "Production Deployment (Vercel, AWS, etc.)",
      "SEO Setup & Analytics Integration"
    ],
    technologies: ["React", "Next.js", "Node.js", "Laravel", "PostgreSQL", "Tailwind CSS"],
    pricing: [
      { name: "Starter Website", price: "25,000–40,000 (PKR) / $250–400", currency: "PKR/USD", description: "Bespoke static landing pages for small businesses and personal brands.", features: ["Custom Layout", "Fully Responsive", "Contact Form", "Basic SEO"], popular: false, ctaText: "Get Started" },
      { name: "Business Website", price: "45,000–80,000 (PKR) / $450–800", currency: "PKR/USD", description: "Full corporate website with CMS integration for growing agencies.", features: ["CMS Integrations", "Advanced Speed Optimization", "Custom Contact Form", "SEO Setup"], popular: true, ctaText: "Get Started" },
      { name: "Professional Website", price: "80,000–150,000 (PKR) / $800–1,500", currency: "PKR/USD", description: "Custom dashboards, advanced portals, and established business websites.", features: ["Custom Portals", "Advanced APIs", "Enhanced Security", "1 Month Support"], popular: false, ctaText: "Get Started" },
      { name: "WooCommerce Store", price: "70,000–150,000 (PKR) / $700–1,500", currency: "PKR/USD", description: "Fully functional e-commerce stores with secure payment integration.", features: ["WooCommerce Store", "Payment Setup", "Product Filters", "Cart Customization"], popular: false, ctaText: "Build My Store" },
      { name: "Advanced Custom Solution", price: "150,000+ (PKR) / $1,500+", currency: "PKR/USD", description: "SaaS platforms, complex web apps, and customized corporate solutions.", features: ["Bespoke Architecture", "Multi-platform Sync", "Custom Integrations", "Long-term Support"], popular: false, ctaText: "Request Custom Quote" }
    ],
    faqs: [
      { question: "How long does a custom website take to build?", answer: "A starter website takes 1-2 weeks, while larger custom solutions or web apps can take 4-8 weeks." },
      { question: "Do you offer post-launch maintenance?", answer: "Yes, we offer ongoing optimization, security patches, and content updates." }
    ],
    relatedServices: ["wordpress", "shopify", "ads-management"],
    published: true,
    sortOrder: 1
  },
  {
    id: "wordpress",
    name: "WordPress Services",
    slug: "wordpress",
    category: "Web & E-commerce",
    shortDescription: "WordPress websites, WooCommerce, Elementor, speed optimization, security, maintenance, and custom plugins.",
    heroTitle: "Premium WordPress Development & Optimization",
    heroDescription: "Professional WordPress engineering ranging from business websites and WooCommerce setups to security hardening and bug fixing.",
    benefits: [
      "Easy content management with tailored Elementor/Gutenberg builders",
      "Robust security configuration to prevent malware and hacking",
      "Highly optimized page speeds for better search rankings"
    ],
    features: [
      "Custom Theme & Plugin Development",
      "WooCommerce online store setup & payment gateway integration",
      "Technical SEO & responsive redesigns",
      "Malware removal & recovery from database errors"
    ],
    process: [
      "Tell Us Your Requirement: Share current issues or design mocks.",
      "We Analyze: Inspect plugins, hosting, and error logs.",
      "Get Your Quote: Fixed pricing for fixes, development, or monthly tasks.",
      "We Build & Deliver: Code adjustments, speed enhancements, and launch."
    ],
    deliverables: [
      "Optimized WordPress Site",
      "Security Auditing Report",
      "Theme/Plugin License Setup & Guide"
    ],
    technologies: ["WordPress", "WooCommerce", "Elementor Pro", "PHP", "MySQL", "JavaScript"],
    pricing: [
      { name: "Basic Maintenance", price: "$49/mo (PKR 5,000/mo)", currency: "USD", description: "Essential updates, backups, and security monitoring.", features: ["Monthly Backups", "Plugin Updates", "Security Checks", "Minor Fixes"], popular: false, ctaText: "Choose Basic" },
      { name: "Business Maintenance", price: "$99/mo (PKR 10,000/mo)", currency: "USD", description: "Advanced updates, speed monitoring, and content support.", features: ["Everything in Basic", "Speed Monitoring", "Content & Product Updates", "Technical Bug Fixes"], popular: true, ctaText: "Choose Business" },
      { name: "Premium Maintenance", price: "$199/mo (PKR 20,000/mo)", currency: "USD", description: "Priority support and WooCommerce store tasks.", features: ["Everything in Business", "Priority Response", "Advanced WooCommerce Support", "Unlimited Minor Tasks"], popular: false, ctaText: "Choose Premium" }
    ],
    faqs: [
      { question: "Can you fix minor layout and CSS bugs?", answer: "Yes, our bug fixing service covers layout shifts, mobile responsiveness, and CSS issues starting from PKR 1,500." },
      { question: "Do you build custom themes?", answer: "Yes, we design custom templates from Figma and write child themes for a cleaner setup." }
    ],
    relatedServices: ["custom-web-development", "shopify", "ads-management"],
    published: true,
    sortOrder: 2
  },
  {
    id: "shopify",
    name: "Shopify Services",
    slug: "shopify",
    category: "Web & E-commerce",
    shortDescription: "Shopify store development, theme customization, custom Liquid coding, integrations, and speed optimization.",
    heroTitle: "High-Converting Shopify eCommerce Stores",
    heroDescription: "Build, launch, and scale your online store with professional Shopify setup, theme customization, and custom Liquid coding.",
    benefits: [
      "Optimized cart and checkout funnel for maximum conversions",
      "Fast page speeds and mobile-first layouts",
      "Custom product options, bundles, and mega menus"
    ],
    features: [
      "Bespoke Shopify Theme Development & Liquid coding",
      "Payment gateway setups, shipping configurations, and app integrations",
      "eCommerce migration (WooCommerce/Magento to Shopify)",
      "Dropshipping and print-on-demand store architecture"
    ],
    process: [
      "Tell Us Your Requirement: Provide store objectives and branding guidelines.",
      "We Analyze: Map app requirements and payment structure.",
      "Get Your Quote: Scope list and fixed store price.",
      "We Build & Deliver: Responsive store setup, test transaction, and handoff."
    ],
    deliverables: [
      "Ready-to-sell Shopify Storefront",
      "App & Shipping Configuration Guide",
      "Conversion Rate Audit Handoff"
    ],
    technologies: ["Shopify Liquid", "HTML/CSS", "JavaScript", "Shopify Apps", "GraphQL API"],
    pricing: [
      { name: "Starter Setup", price: "25,000–50,000 (PKR) / $250–500", currency: "PKR/USD", description: "Launch your brand on a pre-built premium theme.", features: ["Theme Configuration", "Product Uploads (up to 20)", "Payment Setup", "Standard Apps"], popular: false, ctaText: "Get Started" },
      { name: "Custom Storefront", price: "80,000–180,000 (PKR) / $800–1,800", currency: "PKR/USD", description: "Bespoke layout and custom features using Liquid.", features: ["Bespoke Liquid Theme", "Advanced Product Fields", "Analytics integrations", "3 Months Support"], popular: true, ctaText: "Build Custom Store" }
    ],
    faqs: [
      { question: "Can you help migrate my existing WooCommerce store?", answer: "Yes, we handle product data, customers, and order history migration to Shopify without downtime." },
      { question: "What is Liquid?", answer: "Liquid is Shopify's open-source template language, which we use to code completely customized components." }
    ],
    relatedServices: ["custom-web-development", "ads-management", "video-editing"],
    published: true,
    sortOrder: 3
  },
  {
    id: "ads-management",
    name: "Paid Advertising",
    slug: "ads-management",
    category: "Software & Technology",
    shortDescription: "Meta, Google, TikTok, and YouTube ads management, retargeting campaigns, conversion tracking, and audits.",
    heroTitle: "Performance Paid Advertising & Ads Management",
    heroDescription: "Accelerate sales and lead generation with professional campaign management across Google, Facebook, Instagram, and TikTok.",
    benefits: [
      "Advanced audience targeting & demographic research",
      "Retargeting funnels designed to recover abandoned carts",
      "Clear, performance-driven strategy without false ROI promises"
    ],
    features: [
      "Meta Ads, Google Search/Display, YouTube, and TikTok Campaign setups",
      "CAPI (Conversions API), Pixel tracking, and GA4 Analytics integrations",
      "Creative recommendation, budget strategy, and copy testing",
      "Comprehensive ad account auditing for underperforming campaigns"
    ],
    process: [
      "Tell Us Your Requirement: Define business objectives, budget, and historical performance.",
      "We Analyze: Evaluate landing pages, pixel integrations, and competitors.",
      "Get Your Quote: Fixed monthly management fee mapping your scope.",
      "We Build & Deliver: Target setup, creative testing, and optimization loops."
    ],
    deliverables: [
      "Active Ad Campaigns & Scaling Strategy",
      "GA4 and Pixel Setup Verification",
      "Monthly Strategy & Analytics Performance Report"
    ],
    technologies: ["Meta Pixel", "Google Analytics 4", "Meta CAPI", "Google Tag Manager", "TikTok Pixel"],
    pricing: [
      { name: "Starter Ads Management", price: "$199/mo (PKR 25,000/mo)", currency: "USD", description: "Ideal for local businesses starting on a single ad channel.", features: ["1 Platform (Meta or Google)", "Campaign Setup", "Audience Research", "Monthly Strategy Review"], popular: false, ctaText: "Choose Starter" },
      { name: "Growth Ads Management", price: "$399/mo (PKR 50,000/mo)", currency: "USD", description: "Standard plan for eCommerce stores running cross-channel ads.", features: ["Up to 2 Platforms", "Audience & Creative Testing", "Pixel/CAPI Tracking Setup", "Weekly Optimization"], popular: true, ctaText: "Choose Growth" },
      { name: "Performance Ads Management", price: "$799/mo (PKR 100,000/mo)", currency: "USD", description: "Bespoke scaling strategies for high-budget digital campaigns.", features: ["Multi-platform Scaling", "Full Funnel Optimization", "Priority Support", "Creative Strategy & Audit"], popular: false, ctaText: "Choose Performance" }
    ],
    faqs: [
      { question: "Is the ad budget included in the management fee?", answer: "No, advertising budget is separate. You pay the ad platforms directly. Our fees cover management, copy, optimization, and strategy." },
      { question: "Do you offer campaign setup packages?", answer: "Yes, we offer one-time setup packages starting from PKR 10,000 for local campaigns." }
    ],
    relatedServices: ["shopify", "wordpress", "video-editing"],
    published: true,
    sortOrder: 4
  },
  {
    id: "video-editing",
    name: "Video Editing",
    slug: "video-editing",
    category: "Creative",
    shortDescription: "Reels, Shorts, TikToks, YouTube long-form videos, ad creatives, corporate films, and motion graphics.",
    heroTitle: "Premium Video Editing & Creative Media",
    heroDescription: "High-retention video editing and motion design tailored for social media, product promotions, and YouTube channels.",
    benefits: [
      "Engaging hooks and captions to optimize retention",
      "Cinematic color grading and custom sound design",
      "Dynamic motion graphics, overlays, and transitions"
    ],
    features: [
      "Social media editing (Shorts, Reels, TikTok)",
      "YouTube channel editing (talking head, tutorial, documentary)",
      "High-converting video advertisements for Meta and TikTok campaigns",
      "Advanced motion graphics, logo animation, VFX, and audio mixing"
    ],
    process: [
      "Tell Us Your Requirement: Provide raw footage and creative brief.",
      "We Analyze: Check scripting flow, references, and format.",
      "Get Your Quote: Price per video or monthly flat rate packages.",
      "We Build & Deliver: Rough cut delivery, revisions, and high-res export."
    ],
    deliverables: [
      "High-res Exported Video (MP4/MOV)",
      "Project Files Handoff (if requested)",
      "Subtitles/SRT file export"
    ],
    technologies: ["Adobe Premiere Pro", "Adobe After Effects", "DaVinci Resolve", "Blender", "Audition"],
    pricing: [
      { name: "Social Shorts (10 Videos)", price: "$500 (PKR 75,000)", currency: "USD", description: "Perfect package for reels, TikToks, and YT Shorts content creators.", features: ["Dynamic Captions", "Sound FX & Audio Mix", "Color Correction", "1 Revision per video"], popular: true, ctaText: "Order Shorts Pack" },
      { name: "Custom Video Editing", price: "Starting from $50 / PKR 7,500", currency: "USD", description: "Custom pricing based on duration, motion graphics, and VFX scale.", features: ["High-retention editing", "Motion Graphics", "Color Grading", "2 Revisions"], popular: false, ctaText: "Request Custom Quote" }
    ],
    faqs: [
      { question: "What is your turnaround time?", answer: "Turnaround ranges from 48 hours for short-form clips to 5-7 days for complex YouTube edits and motion design." },
      { question: "Do you offer monthly retainer packages?", answer: "Yes, we offer retainer packages for ongoing content creators and eCommerce brands." }
    ],
    relatedServices: ["ads-management", "shopify", "custom-web-development"],
    published: true,
    sortOrder: 5
  }
];

// 2. Set up dynamic pages inside pages array to allow editing in CMS
db.pages = [
  { id: 'home', title: 'Home', slug: '/', status: 'published', template: 'default', sections: ["hero", "capabilities", "servicesSection", "dashboardShowcase", "process", "projectsSection", "reviewsSection", "cta", "contactSection"], seo: { title: '', description: '', robots: 'index,follow', ogImage: '' }, lastModified: null },
  { id: 'about', title: 'About', slug: '/about', status: 'published', template: 'default', sections: ["aboutPage"], seo: { title: '', description: '', robots: 'index,follow', ogImage: '' }, lastModified: null },
  { id: 'services', title: 'Services', slug: '/services', status: 'published', template: 'default', sections: ["servicesPage"], seo: { title: '', description: '', robots: 'index,follow', ogImage: '' }, lastModified: null },
  { id: 'projects', title: 'Projects', slug: '/projects', status: 'published', template: 'default', sections: [], seo: { title: '', description: '', robots: 'index,follow', ogImage: '' }, lastModified: null },
  { id: 'reviews', title: 'Reviews', slug: '/reviews', status: 'published', template: 'default', sections: [], seo: { title: '', description: '', robots: 'index,follow', ogImage: '' }, lastModified: null },
  { id: 'contact', title: 'Contact', slug: '/contact', status: 'published', template: 'default', sections: ["contactPage"], seo: { title: '', description: '', robots: 'index,follow', ogImage: '' }, lastModified: null },
  { id: 'social-media', title: 'Social Media', slug: '/social-media', status: 'published', template: 'default', sections: [], seo: { title: '', description: '', robots: 'index,follow', ogImage: '' }, lastModified: null }
];

fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
console.log('Database successfully updated!');
