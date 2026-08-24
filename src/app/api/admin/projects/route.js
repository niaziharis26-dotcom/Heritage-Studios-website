import { verifySessionToken } from '@/lib/auth';
import db from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

function checkApiAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return false;
  return Boolean(verifySessionToken(token));
}

export async function GET() {
  if (!checkApiAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ projects: db.get('projects') || [] });
}

export async function POST(request) {
  if (!checkApiAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const projectData = await request.json();
    const projects = db.get('projects') || [];
    
    const newProject = {
      id: 'p_' + Math.random().toString(36).substr(2, 9),
      name: projectData.name || 'New Project',
      slug: projectData.slug || 'new-project',
      category: projectData.category || 'Web & E-commerce',
      image: projectData.image || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800',
      gallery: [],
      description: projectData.description || '',
      technologies: projectData.technologies || [],
      result: projectData.result || '',
      client: projectData.client || '',
      featured: projectData.featured ?? true,
      published: projectData.published ?? true,
      sortOrder: Number(projectData.sortOrder) || (projects.length + 1)
    };

    projects.push(newProject);
    db.set('projects', projects);

    return NextResponse.json({ success: true, project: newProject });
  } catch (err) {
    console.error('Projects API error:', err);
    return NextResponse.json({ error: 'Failed to create project.' }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!checkApiAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updatedProject = await request.json();
    const projects = db.get('projects') || [];
    const index = projects.findIndex(p => p.id === updatedProject.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    projects[index] = {
      ...projects[index],
      ...updatedProject,
      sortOrder: Number(updatedProject.sortOrder) || projects[index].sortOrder
    };

    db.set('projects', projects);
    return NextResponse.json({ success: true, project: projects[index] });
  } catch (err) {
    console.error('Projects API error:', err);
    return NextResponse.json({ error: 'Failed to update project.' }, { status: 500 });
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

    const projects = db.get('projects') || [];
    const filtered = projects.filter(p => p.id !== id);

    db.set('projects', filtered);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Projects API error:', err);
    return NextResponse.json({ error: 'Failed to delete project.' }, { status: 500 });
  }
}
