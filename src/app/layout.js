import "./globals.css";
import db from "@/lib/db";
import {
  SITE_NAME,
  SITE_URL,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  ORGANIZATION_SCHEMA,
  WEBSITE_SCHEMA,
} from "@/lib/siteConfig";

// ── Viewport metadata (separate export required by Next.js 14) ──────────────
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#059669",
};

// ── Root metadata ─────────────────────────────────────────────────────────
export async function generateMetadata() {
  const settings = db.get("settings") || {};
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: settings.defaultSeoTitle || `${SITE_NAME} | Premium Technology & Digital Agency`,
      template: `%s | ${SITE_NAME}`,
    },
    description: settings.defaultSeoDescription || DEFAULT_DESCRIPTION,
    keywords: [
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
    ],
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: SITE_URL,
      siteName: SITE_NAME,
      title: settings.defaultSeoTitle || `${SITE_NAME} | Premium Technology & Digital Agency`,
      description: settings.defaultSeoDescription || DEFAULT_DESCRIPTION,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — Premium Technology & Digital Agency`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@HeritagStudios",
      creator: "@HeritagStudios",
      title: settings.defaultSeoTitle || `${SITE_NAME} | Premium Technology & Digital Agency`,
      description: settings.defaultSeoDescription || DEFAULT_DESCRIPTION,
      images: [DEFAULT_OG_IMAGE],
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
      other: [{ rel: "manifest", url: "/site.webmanifest" }],
    },
    alternates: {
      canonical: SITE_URL,
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Organization + WebSite structured data — present on every page */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([ORGANIZATION_SCHEMA, WEBSITE_SCHEMA]),
          }}
        />
        {children}
      </body>
    </html>
  );
}