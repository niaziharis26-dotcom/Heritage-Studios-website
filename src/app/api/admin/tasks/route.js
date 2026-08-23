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
  return NextResponse.json({ tasks: db.get('tasks') || [] });
}

export async function POST(request) {
  if (!checkApiAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const taskData = await request.json();
    const tasks = db.get('tasks') || [];

    const newTask = {
      id: 't_' + Math.random().toString(36).substr(2, 9),
      task: taskData.task || 'New Task',
      project: taskData.project || 'General',
      priority: taskData.priority || 'Medium', // Low | Medium | High
      dueDate: taskData.dueDate || '',
      status: taskData.status || 'To Do', // To Do | In Progress | Done
      notes: taskData.notes || ''
    };

    tasks.push(newTask);
    db.set('tasks', tasks);

    return NextResponse.json({ success: true, task: newTask });
  } catch (err) {
    console.error('Tasks API error:', err);
    return NextResponse.json({ error: 'Failed to create task.' }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!checkApiAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updated = await request.json();
    const tasks = db.get('tasks') || [];
    const index = tasks.findIndex(t => t.id === updated.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Task not found.' }, { status: 404 });
    }

    tasks[index] = {
      ...tasks[index],
      ...updated
    };

    db.set('tasks', tasks);
    return NextResponse.json({ success: true, task: tasks[index] });
  } catch (err) {
    console.error('Tasks API error:', err);
    return NextResponse.json({ error: 'Failed to update task.' }, { status: 500 });
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

    const tasks = db.get('tasks') || [];
    const filtered = tasks.filter(t => t.id !== id);

    db.set('tasks', filtered);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Tasks API error:', err);
    return NextResponse.json({ error: 'Failed to delete task.' }, { status: 500 });
  }
}
