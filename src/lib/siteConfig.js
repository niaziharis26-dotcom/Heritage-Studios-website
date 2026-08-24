/**
 * Heritage Studios — Central SEO Configuration
 * =============================================
 * All SEO-critical URLs derive from NEXT_PUBLIC_SITE_URL.
 * Default production URL is set to https://heritage-studios-website.vercel.app.
 */

export const SITE_NAME = "Heritage Studios";

const DEFAULT_PROD_URL = "https://heritage-studios-website.vercel.app";

function safeUrl(input) {
  if (!input) {
    return process.env.NODE_ENV === "development" ? "http://localhost:3000" : DEFAULT_PROD_URL;
  }
  let str = String(input).trim();
  if (str === "http://localhost:3000" && process.env.NODE_ENV !== "development") {
    return DEFAULT_PROD_URL;
  }
  if (!/^https?:\/\//i.test(str)) {
    str = `https://${str}`;
  }
  try {
    const parsed = new URL(str);
    return parsed.toString().replace(/\/+$/, "");
  } catch {
    return DEFAULT_PROD_URL;
  }
}

export const SITE_URL = safeUrl(
  process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : DEFAULT_PROD_URL)
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