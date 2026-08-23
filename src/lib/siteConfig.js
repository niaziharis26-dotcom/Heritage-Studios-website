/**
 * Heritage Studios — Central SEO Configuration
 * =============================================
 * All SEO-critical URLs derive from NEXT_PUBLIC_SITE_URL.
 * After Vercel deployment, set that env var in the Vercel dashboard.
 * No other file needs to be changed.
 */

export const SITE_NAME = "Heritage Studios";

function safeUrl(input) {
  if (!input) return "http://localhost:3000";
  let str = String(input).trim();
  if (!/^https?:\/\//i.test(str)) {
    str = `https://${str}`;
  }
  try {
    const parsed = new URL(str);
    return parsed.toString().replace(/\/+$/, "");
  } catch {
    return "http://localhost:3000";
  }
}

export const SITE_URL = safeUrl(
  process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
);

export const DEFAULT_TITLE = `${SITE_NAME} | Premium Technology & Digital Agency`;

export const DEFAULT_DESCRIPTION =
  "Heritage Studios is a premium digital agency engineering custom websites, e-commerce stores, AI solutions, software, and creative media for businesses in Pakistan and worldwide.";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const SITE_KEYWORDS = [
  "digital agency",
  "website development",
  "Shopify development",
  "WordPress development",
  "AI solutions",
  "paid advertising",
  "video editing",
  "software development",
  "Heritage Studios",
  "Pakistan digital agency",
];

export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: DEFAULT_DESCRIPTION,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["English", "Urdu"],
  },
  areaServed: ["PK", "US", "GB", "AE", "CA", "AU"],
  sameAs: [],
};

export const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
};