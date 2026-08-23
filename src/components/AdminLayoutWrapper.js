'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const NAV = [
  { group: 'Overview', items: [
    { name: 'Dashboard',    path: '/admin',            icon: '◈' },
  ]},
  { group: 'Content', items: [
    { name: 'Content Editor', path: '/admin/cms',        icon: '⊞' },
    { name: 'Services',     path: '/admin/services',   icon: '✦' },
    { name: 'Projects',     path: '/admin/projects',   icon: '◎' },
    { name: 'Reviews',      path: '/admin/reviews',    icon: '★' },
    { name: 'Media',        path: '/admin/media',      icon: '🖼' },
  ]},
  { group: 'Business', items: [
    { name: 'Leads',        path: '/admin/leads',      icon: '✉' },
    { name: 'Clients',      path: '/admin/clients',    icon: '👥' },
    { name: 'Tasks',        path: '/admin/tasks',      icon: '✓' },
  ]},
  { group: 'Management', items: [
    { name: 'Pages', path: '/admin/pages', icon: '📄' },
    { name: 'Activity Log', path: '/admin/activity', icon: '📋' },
  ]},
  { group: 'System', items: [
    { name: 'Site Settings', path: '/admin/settings', icon: '⚙' },
  ]},
];

export default function AdminLayoutWrapper({ children }) {
  const router   = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' });
      if (res.ok) { router.push('/admin/login'); router.refresh(); }
    } catch (e) { console.error('Logout error:', e); }
  };

  const isActive = (path) =>
    path === '/admin' ? pathname === '/admin' : pathname.startsWith(path);

  const currentPage = NAV.flatMap(g => g.items).find(i => isActive(i.path))?.name || 'Dashboard';

  return (
    <div className="admin-wrap">

      {/* ── Sidebar ── */}
      <aside className="admin-sidebar" role="navigation" aria-label="Admin navigation">
        {/* Brand */}
        <div className="admin-sidebar-brand">
          <span className="admin-sidebar-brand-mark">♦</span>
          <div>
            <div>Heritage Studios</div>
            <div className="admin-sidebar-tag">Admin Panel</div>
          </div>
        </div>

        {/* Nav Groups */}
        <div className="admin-sidebar-nav">
          {NAV.map(group => (
            <div key={group.group}>
              <div className="admin-nav-section-label">{group.group}</div>
              {group.items.map(item => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`admin-nav-item ${isActive(item.path) ? 'active' : ''}`}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                >
                  <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="admin-sidebar-footer">
          <Link href="/" target="_blank" rel="noopener noreferrer" className="admin-nav-item">
            <span className="nav-icon">↗</span>
            View Public Site
          </Link>
          <button onClick={handleLogout} className="admin-nav-item" style={{ color: '#e57373' }}>
            <span className="nav-icon">⏻</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="admin-main-area">

        {/* Top Bar */}
        <header className="admin-topbar" role="banner">
          <div className="admin-page-title">{currentPage}</div>
          <div className="admin-topbar-actions">
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.4rem 0.75rem',
              background: 'var(--hs-off-white)',
              border: '1px solid var(--hs-border-light)',
              borderRadius: 'var(--r-sm)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              color: 'var(--hs-text-600)',
            }}>
              <span style={{ color: 'var(--hs-emerald)', fontSize: '0.7rem' }}>♦</span>
              admin
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="admin-content" role="main" id="main-content">
          {children}
        </main>

      </div>
    </div>
  );
}
