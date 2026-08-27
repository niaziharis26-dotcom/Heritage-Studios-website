export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import db from '@/lib/db';
import DynamicSectionRenderer from '@/components/DynamicSectionRenderer';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/siteConfig';

export async function generateMetadata({ params }) {
  await db.load();
  const pages = db.get('pages') || [];
  const slug = '/' + (params.catchall || []).join('/');
  const page = pages.find(p => p.slug === slug);
  if (!page) return { title: `Page Not Found | ${SITE_NAME}` };

  const pageTitle = page.seo?.title || `${page.title} | ${SITE_NAME}`;
  const pageDesc = page.seo?.description || `Heritage Studios — ${page.title}`;
  const pageUrl = `${SITE_URL}${slug}`;

  return {
    title: pageTitle,
    description: pageDesc,
    robots: page.seo?.noindex ? { index: false, follow: false } : { index: true, follow: true },
    alternates: { canonical: pageUrl },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: pageUrl,
      type: 'website',
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: pageTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDesc,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function CatchAllDynamicPage({ params, searchParams = {} }) {
  await db.load();
  const pages = db.get('pages') || [];
  const slug = '/' + (params.catchall || []).join('/');
  const page = pages.find(p => p.slug === slug);

  if (!page) {
    return notFound();
  }

  const isPreview = searchParams.cms_preview === '1';
  let components = db.get('components') || {};

  if (isPreview) {
    const drafts = db.get('drafts') || {};
    components = { ...components };
    for (const [key, val] of Object.entries(drafts)) {
      components[key] = { ...components[key], ...val };
    }
  }

  const services = db.get('services') || [];
  const settings = db.get('settings') || {};
  const sections = page.sections || [];

  return (
    <>
      {sections.map(sectionId => {
        const data = components[sectionId] || {};
        return (
          <DynamicSectionRenderer
            key={sectionId}
            sectionId={sectionId}
            data={data}
            globalServices={services}
            settings={settings}
          />
        );
      })}
    </>
  );
}
