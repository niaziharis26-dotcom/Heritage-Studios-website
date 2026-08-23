import db from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

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
  return NextResponse.json({ reviews: db.get('reviews') || [] });
}

export async function POST(request) {
  if (!checkApiAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const revData = await request.json();
    const reviews = db.get('reviews') || [];

    const newReview = {
      id: 'rev_' + Math.random().toString(36).substr(2, 9),
      name: revData.name || 'Anonymous Client',
      company: revData.company || '',
      position: revData.position || '',
      avatar: '',
      rating: Number(revData.rating) || 5,
      review: revData.review || '',
      published: revData.published ?? true,
      sortOrder: Number(revData.sortOrder) || (reviews.length + 1)
    };

    reviews.push(newReview);
    db.set('reviews', reviews);

    return NextResponse.json({ success: true, review: newReview });
  } catch (err) {
    console.error('Reviews API error:', err);
    return NextResponse.json({ error: 'Failed to create review.' }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!checkApiAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updated = await request.json();
    const reviews = db.get('reviews') || [];
    const index = reviews.findIndex(r => r.id === updated.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Review not found.' }, { status: 404 });
    }

    reviews[index] = {
      ...reviews[index],
      ...updated,
      rating: Number(updated.rating) || reviews[index].rating,
      sortOrder: Number(updated.sortOrder) || reviews[index].sortOrder
    };

    db.set('reviews', reviews);
    return NextResponse.json({ success: true, review: reviews[index] });
  } catch (err) {
    console.error('Reviews API error:', err);
    return NextResponse.json({ error: 'Failed to update review.' }, { status: 500 });
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

    const reviews = db.get('reviews') || [];
    const filtered = reviews.filter(r => r.id !== id);

    db.set('reviews', filtered);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Reviews API error:', err);
    return NextResponse.json({ error: 'Failed to delete review.' }, { status: 500 });
  }
}
