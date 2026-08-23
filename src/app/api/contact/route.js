import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, service, budget, message } = body;

    // Simple robust validation
    if (!name || !email || !service || !budget || !message) {
      return NextResponse.json({ error: 'Mandatory fields are missing.' }, { status: 400 });
    }

    const inquiries = db.get('inquiries') || [];

    const newInquiry = {
      id: 'inq_' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone: phone || '',
      company: company || '',
      service,
      budget,
      message,
      createdDate: new Date().toISOString(),
      status: 'New' // New | Contacted | In Discussion | Won | Lost
    };

    inquiries.push(newInquiry);
    db.set('inquiries', inquiries);

    return NextResponse.json({ success: true, inquiry: newInquiry }, { status: 201 });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Failed to process inquiry submission.' }, { status: 500 });
  }
}
