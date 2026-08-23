import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import db from '@/lib/db';

export async function GET() {
  const publicDir = path.join(process.cwd(), 'src/app/(public)');
  
  const getRoutes = (dir, basePath = '') => {
    let routes = [];
    if (!fs.existsSync(dir)) return routes;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    // Check if this dir has a page.js
    if (entries.some(e => e.name === 'page.js' && !e.isDirectory())) {
      routes.push({
        path: basePath === '' ? '/' : basePath,
        isDynamic: basePath.includes('['),
      });
    }
    
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('(')) {
        routes.push(...getRoutes(path.join(dir, entry.name), `${basePath}/${entry.name}`));
      }
    }
    return routes;
  };

  const fileRoutes = getRoutes(publicDir);
  
  const resolvedRoutes = [];
  
  for (const r of fileRoutes) {
    if (r.isDynamic) {
      if (r.path.includes('/services/[')) {
        const services = db.get('services') || [];
        services.forEach(s => {
          resolvedRoutes.push({
            id: `service_${s.slug || s.id}`,
            title: s.title || s.name || s.slug,
            path: r.path.replace(/\[.*?\]/, s.slug || s.id),
            type: 'service_detail',
            template: r.path,
            isDynamicInstance: true
          });
        });
      } else if (r.path.includes('/portfolio/[')) {
         const portfolio = db.get('portfolio') || [];
         portfolio.forEach(p => {
           resolvedRoutes.push({
             id: `portfolio_${p.slug || p.id}`,
             title: p.title || p.name || p.slug,
             path: r.path.replace(/\[.*?\]/, p.slug || p.id),
             type: 'portfolio_detail',
             template: r.path,
             isDynamicInstance: true
           });
         });
      } else if (r.path.includes('/blog/[')) {
         const blog = db.get('blog') || [];
         blog.forEach(p => {
           resolvedRoutes.push({
             id: `blog_${p.slug || p.id}`,
             title: p.title || p.name || p.slug,
             path: r.path.replace(/\[.*?\]/, p.slug || p.id),
             type: 'blog_detail',
             template: r.path,
             isDynamicInstance: true
           });
         });
      }
      // also keep the raw template route just in case
      resolvedRoutes.push({
        id: `template_${r.path.replace(/\//g, '_').replace(/\[/g, '').replace(/\]/g, '')}`,
        title: `Template: ${r.path}`,
        path: r.path,
        type: 'template',
        template: r.path,
        isDynamicInstance: false
      });
    } else {
      const isHome = r.path === '/';
      resolvedRoutes.push({
        id: isHome ? 'home' : r.path.substring(1).replace(/\//g, '_'),
        title: isHome ? 'Home' : r.path.split('/').pop().charAt(0).toUpperCase() + r.path.split('/').pop().slice(1),
        path: r.path,
        type: 'static',
        template: r.path,
        isDynamicInstance: false
      });
    }
  }

  // Tree representation
  const tree = [
    { section: 'Core Pages', items: resolvedRoutes.filter(r => r.type === 'static') },
    { section: 'Services', items: resolvedRoutes.filter(r => r.type === 'service_detail') },
    { section: 'Portfolio', items: resolvedRoutes.filter(r => r.type === 'portfolio_detail') },
    { section: 'Templates', items: resolvedRoutes.filter(r => r.type === 'template') }
  ].filter(s => s.items.length > 0);

  return NextResponse.json({ routes: resolvedRoutes, tree });
}
