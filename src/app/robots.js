import { SITE_URL } from "@/lib/siteConfig";

/**
 * Heritage Studios — robots.txt
 * Generated via Next.js App Router Metadata API.
 * Allows all public pages; disallows admin/CMS/API routes.
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/contact",
          "/services",
          "/projects",
          "/reviews",
          "/social-media",
        ],
        disallow: [
          "/admin/",
          "/api/",
          "/(dashboard)/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}