import { checkAuth } from '@/lib/auth';
import db from '@/lib/db';
import Link from 'next/link';
import AdminLayoutWrapper from '@/components/AdminLayoutWrapper';

export const metadata = {
  title: 'Admin Dashboard | Heritage Studios',
};


export default function AdminDashboardPage() {
  // Validate auth
  checkAuth();

  const inquiries = db.get('inquiries') || [];
  const projects = db.get('internalProjects') || [];
  const tasks = db.get('tasks') || [];

  // Calculate statistics
  const totalInquiries = inquiries.length;
  const newInquiries = inquiries.filter(i => i.status === 'New').length;
  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const pendingTasks = tasks.filter(t => t.status === 'To Do' || t.status === 'In Progress').length;
  const overdueTasks = tasks.filter(t => {
    if (t.status === 'Done') return false;
    if (!t.dueDate) return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  // Recent inquiries list (up to 5)
  const recentInquiries = [...inquiries]
    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
    .slice(0, 5);

  return (
    <AdminLayoutWrapper>
      <div className="admin-dashboard-view">
        {/* Visual Editor Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(5,150,105,0.15), rgba(5,150,105,0.05))',
          border: '1px solid rgba(5,150,105,0.25)',
          borderRadius: '16px',
          padding: '1.5rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>Visual Website Editor</h2>
            <p style={{ margin: '0.25rem 0 0', color: '#9ca3af', fontSize: '0.9rem' }}>Edit your website visually — no code required.</p>
          </div>
          <Link href="/admin/visual-editor" style={{
            background: 'linear-gradient(135deg, #059669, #047857)',
            color: '#fff',
            padding: '0.65rem 1.5rem',
            borderRadius: '10px',
            textDecoration: 'none',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 700,
            fontSize: '0.9rem',
            whiteSpace: 'nowrap'
          }}>Open Visual Editor →</Link>
        </div>

        {/* Key Metrics Row */}
        <div className="admin-kpi-grid">
          <div className="admin-kpi">
            <div className="admin-kpi-icon" aria-hidden="true">✉</div>
            <div className="admin-kpi-label">Total Inquiries</div>
            <div className="admin-kpi-value">{totalInquiries}</div>
            <div className="admin-kpi-sub">{newInquiries} New Inquiries pending review</div>
          </div>
          <div className="admin-kpi">
            <div className="admin-kpi-icon" aria-hidden="true">👥</div>
            <div className="admin-kpi-label">Active Client Projects</div>
            <div className="admin-kpi-value">{activeProjects}</div>
            <div className="admin-kpi-sub">Total of {projects.length} client accounts</div>
          </div>
          <div className="admin-kpi">
            <div className="admin-kpi-icon" aria-hidden="true">✓</div>
            <div className="admin-kpi-label">Pending Tasks</div>
            <div className="admin-kpi-value">{pendingTasks}</div>
            <div className="admin-kpi-sub" style={{ color: overdueTasks > 0 ? '#e53e3e' : 'inherit', fontWeight: overdueTasks > 0 ? '600' : 'normal' }}>
              {overdueTasks} Overdue tasks outstanding
            </div>
          </div>
        </div>

        {/* Workspace Split */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginTop: '2rem' }} className="admin-split-layout">
          {/* Recent Leads */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Recent Inquiries</h3>
              <Link href="/admin/leads" className="btn btn-dark btn-sm">
                Manage Leads
              </Link>
            </div>
            {recentInquiries.length === 0 ? (
              <div className="admin-empty">
                <div className="admin-empty-icon" aria-hidden="true">✉</div>
                <h3>No inquiries yet</h3>
                <p>New enquiries submitted via the public site forms will show up here.</p>
              </div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Sender</th>
                      <th>Service</th>
                      <th>Budget</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInquiries.map((inq) => (
                      <tr key={inq.id}>
                        <td className="cell-primary">
                          <strong>{inq.name}</strong><br />
                          <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{inq.email}</span>
                        </td>
                        <td>{inq.service}</td>
                        <td>{inq.budget}</td>
                        <td>
                          <span className={`badge ${inq.status === 'New' ? 'badge-emerald' : 'badge-light'}`}>
                            {inq.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Actions Panel */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Quick Actions</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <Link href="/admin/cms" className="btn btn-outline w-full" style={{ justifyContent: 'flex-start' }}>
                📝 Edit Homepage Hero
              </Link>
              <Link href="/admin/settings" className="btn btn-outline w-full" style={{ justifyContent: 'flex-start' }}>
                ⚙️ WhatsApp Config
              </Link>
              <Link href="/admin/tasks" className="btn btn-outline w-full" style={{ justifyContent: 'flex-start' }}>
                ✓ Add Project Task
              </Link>
              <Link href="/admin/projects" className="btn btn-outline w-full" style={{ justifyContent: 'flex-start' }}>
                📁 Upload Portfolio Project
              </Link>
            </div>
          </div>
        </div>

        <style>{`
          @media (min-width: 1024px) {
            .admin-split-layout { grid-template-columns: 1.4fr 0.6fr !important; }
          }
        `}</style>
      </div>
    </AdminLayoutWrapper>
  );
}

