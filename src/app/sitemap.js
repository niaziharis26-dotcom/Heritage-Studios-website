import { SITE_URL } from "@/lib/siteConfig";
import db from "@/lib/db";

/**
 * Heritage Studios — XML Sitemap
 * Generated via Next.js App Router Metadata API.
 * Includes only public, indexable, canonical URLs.
 * All URLs derive from NEXT_PUBLIC_SITE_URL environment variable.
 */
export const dynamic = 'force-dynamic';

export default function sitemap() {
  const services = db.get("services") || [];
  const publishedServices = services.filter((s) => s.published && s.slug);

  const staticRoutes = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/reviews`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/social-media`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const serviceRoutes = publishedServices.map((svc) => ({
    url: `${SITE_URL}/services/${svc.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...serviceRoutes];
}