import db from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

function checkApiAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return false;
  const sessions = db.get('sessions') || {};
  return sessions[token] && new Date(sessions[token].expires) > new Date();
}

export async function GET() {
  if (!checkApiAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ services: db.get('services') || [] });
}

export async function POST(request) {
  if (!checkApiAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const serviceData = await request.json();
    const services = db.get('services') || [];
    
    const newService = {
      id: 's_' + Math.random().toString(36).substr(2, 9),
      name: serviceData.name || 'New Service',
      slug: serviceData.slug || 'new-service',
      category: serviceData.category || 'Web & E-commerce',
      shortDescription: serviceData.shortDescription || '',
      heroTitle: serviceData.heroTitle || '',
      heroDescription: serviceData.heroDescription || '',
      benefits: serviceData.benefits || [],
      features: serviceData.features || [],
      process: serviceData.process || [],
      deliverables: serviceData.deliverables || [],
      technologies: serviceData.technologies || [],
      pricing: serviceData.pricing || [],
      faqs: serviceData.faqs || [],
      relatedServices: serviceData.relatedServices || [],
      published: serviceData.published ?? true,
      sortOrder: Number(serviceData.sortOrder) || (services.length + 1)
    };

    services.push(newService);
    db.set('services', services);
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, service: newService });
  } catch (err) {
    console.error('Services API error:', err);
    return NextResponse.json({ error: 'Failed to create service.' }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!checkApiAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updatedService = await request.json();
    const services = db.get('services') || [];
    const index = services.findIndex(s => s.id === updatedService.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Service not found.' }, { status: 404 });
    }

    services[index] = {
      ...services[index],
      ...updatedService,
      sortOrder: Number(updatedService.sortOrder) || services[index].sortOrder
    };

    db.set('services', services);
    revalidatePath('/', 'layout');
    
    return NextResponse.json({ success: true, service: services[index] });
  } catch (err) {
    console.error('Services API error:', err);
    return NextResponse.json({ error: 'Failed to update service.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!checkApiAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const services = db.get('services') || [];
    const filtered = services.filter(s => s.id !== id);

    db.set('services', filtered);
    revalidatePath('/', 'layout');
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Services API error:', err);
    return NextResponse.json({ error: 'Failed to delete service.' }, { status: 500 });
  }
}
