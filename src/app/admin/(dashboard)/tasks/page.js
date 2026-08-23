'use client';
import { useState, useEffect } from 'react';
import AdminLayoutWrapper from '@/components/AdminLayoutWrapper';

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    task: '',
    project: '',
    priority: 'Medium',
    dueDate: '',
    status: 'To Do',
    notes: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/admin/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (t) => {
    setEditingTask(t);
    setIsCreating(false);
    setForm(t);
  };

  const handleCreateClick = () => {
    setIsCreating(true);
    setEditingTask(null);
    setForm({
      task: '',
      project: 'General Operation',
      priority: 'Medium',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'To Do',
      notes: ''
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = '/api/admin/tasks';
      const method = editingTask ? 'PUT' : 'POST';
      const payload = { ...form };
      if (editingTask) {
        payload.id = editingTask.id;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setEditingTask(null);
        setIsCreating(false);
        fetchTasks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const res = await fetch('/api/admin/tasks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        fetchTasks();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <AdminLayoutWrapper>
        <div>Loading tasks dashboard...</div>
      </AdminLayoutWrapper>
    );
  }

  return (
    <AdminLayoutWrapper>
      <div className="admin-tasks-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', alignItems: 'center' }}>
          <div>
            <h3>Task Management</h3>
            <p style={{ fontSize: '0.9rem' }}>Track team milestones, internal projects, and client deadlines.</p>
          </div>
          {!isCreating && !editingTask && (
            <button onClick={handleCreateClick} className="btn btn-primary btn-sm">
              + Add Task
            </button>
          )}
        </div>

        {/* Form Panel */}
        {(isCreating || editingTask) && (
          <div className="card-glass edit-panel" style={{ marginBottom: '3rem', padding: '2.5rem' }}>
            <h4>{editingTask ? 'Edit Task' : 'New Task'}</h4>
            <form onSubmit={handleSave} style={{ marginTop: '2rem' }}>
              <div className="form-row-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Task Headline *</label>
                  <input required value={form.task} className="form-input" placeholder="Configure Shopify checkout redirect script" onChange={(e) => setForm({...form, task: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Associated Client / Project *</label>
                  <input required value={form.project} className="form-input" placeholder="Aura E-Commerce" onChange={(e) => setForm({...form, project: e.target.value})} />
                </div>
              </div>

              <div className="form-row-three" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Priority *</label>
                  <select value={form.priority} className="form-input" onChange={(e) => setForm({...form, priority: e.target.value})}>
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date *</label>
                  <input type="date" required value={form.dueDate} className="form-input" onChange={(e) => setForm({...form, dueDate: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Task Status *</label>
                  <select value={form.status} className="form-input" onChange={(e) => setForm({...form, status: e.target.value})}>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Developer Notes</label>
                <textarea rows="3" value={form.notes} className="form-input" placeholder="Write additional implementation details..." onChange={(e) => setForm({...form, notes: e.target.value})}></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="submit" className="btn btn-primary">Save Task</button>
                <button type="button" onClick={() => { setEditingTask(null); setIsCreating(false); }} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Task lists grouped by status */}
        {!isCreating && !editingTask && (
          <div className="tasks-grid-columns" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {['To Do', 'In Progress', 'Done'].map(columnStatus => {
              const columnTasks = tasks.filter(t => t.status === columnStatus);
              return (
                <div key={columnStatus} className="card-glass task-col" style={{ padding: '1.5rem' }}>
                  <h4 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                    {columnStatus} ({columnTasks.length})
                  </h4>
                  <div className="tasks-stack" style={{ display: 'flex', flexTarget: 'column', flexDirection: 'column', gap: '1rem' }}>
                    {columnTasks.length === 0 ? (
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-medium)', textAlign: 'center', padding: '1rem 0' }}>No tasks in this stage.</p>
                    ) : (
                      columnTasks.map(task => (
                        <div key={task.id} className="card-glass task-item-inner" style={{ padding: '1rem', background: 'rgba(0,0,0,0.15)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span className={`badge`} style={{ fontSize: '0.65rem', background: task.priority === 'High' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)', color: task.priority === 'High' ? '#ef4444' : 'inherit' }}>
                              {task.priority}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-medium)' }}>
                              Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                          <strong style={{ display: 'block', margin: '0.5rem 0', fontSize: '0.95rem' }}>{task.task}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-primary-light)' }}>Project: {task.project}</span>
                          {task.notes && <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--color-gray-medium)' }}>{task.notes}</p>}
                          
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                            <button onClick={() => handleEditClick(task)} className="btn btn-glass btn-sm" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}>Edit</button>
                            <button onClick={() => handleDelete(task.id)} className="btn btn-glass btn-sm" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', color: '#ef4444' }}>Delete</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayoutWrapper>
  );
}
