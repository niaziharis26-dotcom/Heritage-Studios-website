/**
 * Heritage Studios — Component Registry
 *
 * Defines every CMS-editable section, its fields, and its metadata.
 * Adding a new component: add an entry here → the Visual Editor auto-discovers it.
 *
 * Field types: 'text' | 'textarea' | 'url' | 'email' | 'color' | 'number' | 'select' | 'toggle'
 */

export const COMPONENT_REGISTRY = {

  // ── Reusable Page Builder Blocks ───────────────────────────────────────────

  hero: {
    name: 'Hero Section',
    icon: '🏠',
    description: 'Main hero banner with headings, descriptions, and call-to-actions',
    category: 'general',
    fields: [
      { id: 'heading', label: 'Main Heading', type: 'text', placeholder: 'Heritage Studios', required: true },
      { id: 'subheading', label: 'Subheading', type: 'text', placeholder: 'Where Premium Craftsmanship Meets Next-Gen Technology' },
      { id: 'description', label: 'Description', type: 'textarea', placeholder: 'We engineer state-of-the-art websites...' },
      { id: 'primaryCtaText', label: 'Primary Button Text', type: 'text', placeholder: 'Explore Services' },
      { id: 'primaryCtaUrl', label: 'Primary Button URL', type: 'url', placeholder: '/services' },
      { id: 'secondaryCtaText', label: 'Secondary Button Text', type: 'text', placeholder: 'Book a Call' },
      { id: 'secondaryCtaUrl', label: 'Secondary Button URL', type: 'url', placeholder: '#book-a-call' },
      { id: 'imageUrl', label: 'Hero Image URL', type: 'text', placeholder: 'https://images.unsplash.com/photo...' },
    ],
    canHide: true,
    canReorder: true,
  },

  textBlock: {
    name: 'Text Content',
    icon: '📝',
    description: 'A block of rich text or standard paragraph headings',
    category: 'general',
    fields: [
      { id: 'heading', label: 'Heading', type: 'text', placeholder: 'Title' },
      { id: 'subheading', label: 'Subheading / Eyebrow', type: 'text', placeholder: 'Category' },
      { id: 'content', label: 'Content Paragraph', type: 'textarea', placeholder: 'Write your content here...' },
      { id: 'align', label: 'Alignment', type: 'select', options: ['left', 'center', 'right'], default: 'left' },
      { id: 'bg', label: 'Background Color Style', type: 'select', options: ['white', 'light', 'dark'], default: 'white' }
    ],
    canHide: true,
    canReorder: true,
  },

  imageBlock: {
    name: 'Image Banner',
    icon: '🖼️',
    description: 'A single image block with optional caption',
    category: 'general',
    fields: [
      { id: 'imageUrl', label: 'Image URL', type: 'text', placeholder: '/images/example.jpg', required: true },
      { id: 'altText', label: 'Alternative Text', type: 'text', placeholder: 'Describe the image' },
      { id: 'caption', label: 'Caption', type: 'text', placeholder: 'Optional image caption' }
    ],
    canHide: true,
    canReorder: true,
  },

  imageText: {
    name: 'Image + Text Split',
    icon: '🌗',
    description: 'Side-by-side text block and image placement',
    category: 'general',
    fields: [
      { id: 'heading', label: 'Heading', type: 'text', placeholder: 'Our Capabilities' },
      { id: 'description', label: 'Description', type: 'textarea', placeholder: 'Details...' },
      { id: 'imageUrl', label: 'Image URL', type: 'text', required: true },
      { id: 'imagePosition', label: 'Image Side', type: 'select', options: ['left', 'right'], default: 'right' },
      { id: 'primaryCtaText', label: 'Button Text', type: 'text' },
      { id: 'primaryCtaUrl', label: 'Button URL', type: 'url' },
    ],
    canHide: true,
    canReorder: true,
  },

  capabilities: {
    name: 'Capabilities Grid',
    icon: '⚡',
    description: 'Core service capabilities showcase — icon cards',
    category: 'general',
    fields: [
      { id: 'heading', label: 'Section Heading', type: 'text', placeholder: 'Engineered for Excellence', required: true },
    ],
    arrayField: {
      key: 'items',
      label: 'Capability Cards',
      addLabel: 'Add Card',
      fields: [
        { id: 'title', label: 'Card Title', type: 'text', placeholder: 'Custom Software' },
        { id: 'desc', label: 'Card Description', type: 'textarea', placeholder: 'Engineered solutions...' },
      ],
    },
    canHide: true,
    canReorder: true,
  },

  servicesSection: {
    name: 'Service Cards Row',
    icon: '🛠️',
    description: 'A grid of service cards dynamically loaded or customized',
    category: 'general',
    fields: [
      { id: 'heading', label: 'Section Heading', type: 'text', placeholder: 'Our Services', required: true },
      { id: 'subheading', label: 'Subheading', type: 'textarea', placeholder: 'Engineered digital products custom designed for business outcomes.' },
    ],
    canHide: true,
    canReorder: true,
  },

  pricingSection: {
    name: 'Pricing Cards Grid',
    icon: '💰',
    description: 'Pricing plans grid for service categories',
    category: 'general',
    fields: [
      { id: 'heading', label: 'Heading', type: 'text', placeholder: 'Flexible Investment Plans' },
      { id: 'description', label: 'Description', type: 'textarea', placeholder: 'Choose the level that fits your goals.' }
    ],
    arrayField: {
      key: 'packages',
      label: 'Pricing Packages',
      addLabel: 'Add Plan',
      fields: [
        { id: 'name', label: 'Plan Name', type: 'text', placeholder: 'Growth' },
        { id: 'price', label: 'Price Amount', type: 'text', placeholder: '$399' },
        { id: 'currency', label: 'Currency', type: 'text', placeholder: 'USD' },
        { id: 'billing', label: 'Billing Period', type: 'text', placeholder: '/month' },
        { id: 'description', label: 'Short Description', type: 'textarea' },
        { id: 'features', label: 'Features (comma separated)', type: 'textarea', placeholder: 'Feature 1, Feature 2, Feature 3' },
        { id: 'badge', label: 'Ribbon Badge Text (optional)', type: 'text' },
        { id: 'popular', label: 'Featured / Highlight Plan (true/false)', type: 'text', placeholder: 'false' },
        { id: 'ctaText', label: 'Button Label', type: 'text', placeholder: 'Select Plan' },
        { id: 'ctaUrl', label: 'Button URL', type: 'text', placeholder: '/contact' }
      ]
    },
    canHide: true,
    canReorder: true,
  },

  featureGrid: {
    name: 'Feature Grid',
    icon: '🔳',
    description: 'Grid list highlighting specific key features',
    category: 'general',
    fields: [
      { id: 'heading', label: 'Grid Title', type: 'text', placeholder: 'Key Features' },
    ],
    arrayField: {
      key: 'features',
      label: 'Feature Items',
      addLabel: 'Add Feature',
      fields: [
        { id: 'title', label: 'Feature Title', type: 'text', placeholder: 'Fully Responsive' },
        { id: 'desc', label: 'Feature description', type: 'textarea' }
      ]
    },
    canHide: true,
    canReorder: true,
  },

  stats: {
    name: 'Statistics Banner',
    icon: '📈',
    description: 'Highlight key numeric statistics and achievements',
    category: 'general',
    fields: [
      { id: 'heading', label: 'Section Title', type: 'text' }
    ],
    arrayField: {
      key: 'stats',
      label: 'Stat Columns',
      addLabel: 'Add Stat',
      fields: [
        { id: 'number', label: 'Stat Value (e.g. 99%)', type: 'text' },
        { id: 'label', label: 'Label Text', type: 'text' }
      ]
    },
    canHide: true,
    canReorder: true,
  },

  testimonials: {
    name: 'Testimonials / Reviews',
    icon: '⭐',
    description: 'Client reviews and testimonials block',
    category: 'general',
    fields: [
      { id: 'heading', label: 'Heading', type: 'text', placeholder: 'What Our Clients Say' },
    ],
    arrayField: {
      key: 'reviews',
      label: 'Reviews',
      addLabel: 'Add Review',
      fields: [
        { id: 'name', label: 'Client Name', type: 'text' },
        { id: 'company', label: 'Company Name', type: 'text' },
        { id: 'position', label: 'Position', type: 'text' },
        { id: 'rating', label: 'Rating (1-5)', type: 'number' },
        { id: 'review', label: 'Review Text', type: 'textarea' }
      ]
    },
    canHide: true,
    canReorder: true,
  },

  faq: {
    name: 'FAQ Accordion',
    icon: '❓',
    description: 'Expandable list of questions and answers',
    category: 'general',
    fields: [
      { id: 'heading', label: 'Section Title', type: 'text', placeholder: 'Frequently Asked Questions' },
    ],
    arrayField: {
      key: 'items',
      label: 'FAQs',
      addLabel: 'Add FAQ',
      fields: [
        { id: 'question', label: 'Question', type: 'text', required: true },
        { id: 'answer', label: 'Answer', type: 'textarea', required: true }
      ]
    },
    canHide: true,
    canReorder: true,
  },

  process: {
    name: 'Process Flow Timeline',
    icon: '🔄',
    description: 'Step-by-step methodology timeline',
    category: 'general',
    fields: [
      { id: 'heading', label: 'Section Heading', type: 'text', placeholder: 'Our Execution Framework', required: true },
    ],
    arrayField: {
      key: 'steps',
      label: 'Process Steps',
      addLabel: 'Add Step',
      fields: [
        { id: 'step', label: 'Step Number (e.g. 01)', type: 'text', placeholder: '01' },
        { id: 'name', label: 'Step Name', type: 'text', placeholder: 'Audit & Strategy', required: true },
        { id: 'desc', label: 'Step Description', type: 'textarea', placeholder: 'We deep-dive into your existing architecture...' },
      ],
    },
    canHide: true,
    canReorder: true,
  },

  cta: {
    name: 'CTA Banner',
    icon: '🚀',
    description: 'Call-to-action conversion banner with action buttons',
    category: 'general',
    fields: [
      { id: 'heading', label: 'Heading', type: 'text', placeholder: 'Ready to Elevate Your Technology?', required: true },
      { id: 'description', label: 'Description', type: 'textarea', placeholder: 'Book a strategic scoping call with our lead engineers today.' },
      { id: 'primaryCtaText', label: 'Primary Button Text', type: 'text', placeholder: 'Book Strategy Session' },
      { id: 'primaryCtaUrl', label: 'Primary Button URL', type: 'url', placeholder: 'https://calendly.com/heritagestudios' },
      { id: 'secondaryCtaText', label: 'Secondary Button Text', type: 'text', placeholder: 'Chat on WhatsApp' },
      { id: 'secondaryCtaUrl', label: 'Secondary Button URL', type: 'url', placeholder: 'https://wa.me/...' }
    ],
    canHide: true,
    canReorder: true,
  },

  logoStrip: {
    name: 'Client Logo Banner',
    icon: '🏢',
    description: 'A strip of client logos or partner badges',
    category: 'general',
    fields: [
      { id: 'heading', label: 'Eyebrow / Small Title', type: 'text', placeholder: 'Trusted by leaders' }
    ],
    arrayField: {
      key: 'logos',
      label: 'Logos list',
      addLabel: 'Add Logo Image',
      fields: [
        { id: 'logoUrl', label: 'Logo Image URL', type: 'text' },
        { id: 'companyName', label: 'Company Name', type: 'text' }
      ]
    },
    canHide: true,
    canReorder: true,
  },

  gallery: {
    name: 'Photo Gallery Grid',
    icon: '📸',
    description: 'Grid layout of photo uploads/references',
    category: 'general',
    fields: [
      { id: 'heading', label: 'Gallery Heading', type: 'text' }
    ],
    arrayField: {
      key: 'images',
      label: 'Gallery Images',
      addLabel: 'Add Photo',
      fields: [
        { id: 'imageUrl', label: 'Photo URL', type: 'text' },
        { id: 'alt', label: 'Alt Tag', type: 'text' }
      ]
    },
    canHide: true,
    canReorder: true,
  },

  videoBlock: {
    name: 'Embedded Video Block',
    icon: '🎥',
    description: 'Embed video player for promotions or reviews',
    category: 'general',
    fields: [
      { id: 'videoUrl', label: 'Video Source URL (MP4 / YouTube)', type: 'text', required: true },
      { id: 'posterUrl', label: 'Thumbnail Poster Image URL', type: 'text' },
      { id: 'autoplay', label: 'Autoplay Video (true/false)', type: 'text', placeholder: 'false' }
    ],
    canHide: true,
    canReorder: true,
  },

  contactSection: {
    name: 'Contact Form Block',
    icon: '✉️',
    description: 'Contact form and brand details banner',
    category: 'general',
    fields: [
      { id: 'heading', label: 'Heading', type: 'text', placeholder: "Let's Engineer Something Great", required: true },
      { id: 'subheading', label: 'Subheading', type: 'textarea', placeholder: 'Reach out to discuss your requirements.' },
    ],
    canHide: true,
    canReorder: true,
  },

  customContent: {
    name: 'Custom Content HTML',
    icon: '💻',
    description: 'Insert raw HTML or custom text layouts',
    category: 'general',
    fields: [
      { id: 'content', label: 'Raw HTML / Text Content', type: 'textarea', placeholder: '<div>Custom HTML goes here</div>' }
    ],
    canHide: true,
    canReorder: true,
  },

  // ── Legacy Component Pages ────────────────────────────────────────────────
  aboutPage: {
    name: 'About Page',
    icon: '📖',
    description: 'Legacy page content for the About page',
    page: 'about',
    category: 'page',
    fields: [
      { id: 'heroTitle', label: 'Hero Title', type: 'text' },
      { id: 'heroSubtitle', label: 'Hero Subtitle', type: 'text' },
      { id: 'missionTitle', label: 'Mission Title', type: 'text' },
      { id: 'missionDescription', label: 'Mission Description', type: 'textarea' },
    ],
    arrayField: {
      key: 'values',
      label: 'Core Values',
      addLabel: 'Add Value',
      fields: [
        { id: 'title', label: 'Value Title', type: 'text' },
        { id: 'desc', label: 'Value Description', type: 'textarea' },
      ],
    },
  },

  servicesPage: {
    name: 'Services Landing Page',
    icon: '🛠️',
    description: 'Legacy page content for the Services index page',
    page: 'services',
    category: 'page',
    fields: [
      { id: 'heroTitle', label: 'Hero Title', type: 'text' },
      { id: 'heroSubtitle', label: 'Hero Subtitle', type: 'text' },
      { id: 'ctaTitle', label: 'CTA Title', type: 'text' },
      { id: 'ctaDescription', label: 'CTA Description', type: 'textarea' },
    ],
  },

  contactPage: {
    name: 'Contact Page',
    icon: '📨',
    description: 'Legacy page content for the Contact page',
    page: 'contact',
    category: 'page',
    fields: [
      { id: 'heroTitle', label: 'Hero Title', type: 'text' },
      { id: 'heroSubtitle', label: 'Hero Subtitle', type: 'text' },
      { id: 'formTitle', label: 'Form Title', type: 'text' },
      { id: 'formDescription', label: 'Form Description', type: 'textarea' },
    ],
  }
};

export const PAGE_SECTIONS = {
  home: ['hero', 'capabilities', 'servicesSection', 'dashboardShowcase', 'process', 'projectsSection', 'reviewsSection', 'cta', 'contactSection'],
  about: ['aboutPage'],
  services: ['servicesPage'],
  contact: ['contactPage'],
  projects: [],
  reviews: [],
  'social-media': [],
};

export function getRegistryForPage(pageId) {
  const sectionIds = PAGE_SECTIONS[pageId] || [];
  return sectionIds
    .filter(id => COMPONENT_REGISTRY[id])
    .map(id => ({ id, ...COMPONENT_REGISTRY[id] }));
}

export function getFieldsForComponent(componentId) {
  const reg = COMPONENT_REGISTRY[componentId];
  if (!reg) return [];
  return reg.fields || [];
}

export function getArrayFieldForComponent(componentId) {
  const reg = COMPONENT_REGISTRY[componentId];
  if (!reg) return null;
  return reg.arrayField || null;
}

export function getComponentsByCategory(category) {
  return Object.entries(COMPONENT_REGISTRY)
    .filter(([, reg]) => reg.category === category)
    .map(([id, reg]) => ({ id, ...reg }));
}

export default COMPONENT_REGISTRY;
