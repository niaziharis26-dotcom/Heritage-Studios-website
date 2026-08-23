'use client';

import { useState, useEffect } from 'react';
import AdminLayoutWrapper from '@/components/AdminLayoutWrapper';

export default function ActivityLogPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  
  const TABS = ['All', 'Content', 'Media', 'Settings', 'Auth'];

  const fetchActivity = async () => {
    try {
      const res = await fetch('/api/admin/activity');
      if (res.ok) {
        const data = await res.json();
        // If data is array or object containing entries
        if (Array.isArray(data)) {
          setActivities(data);
        } else if (data.entries) {
          setActivities(data.entries);
        } else {
          setActivities([]);
        }
      } else {
        setActivities([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
    const interval = setInterval(fetchActivity, 30000); 
    return () => clearInterval(interval);
  }, []);

  const filteredActivities = filter === 'All' 
    ? activities 
    : activities.filter(a => {
        const act = a.action || '';
        return act.toLowerCase().includes(filter.toLowerCase());
      });

  const getActionColor = (action = '') => {
    const act = action.toLowerCase();
    if (act.includes('draft') || act.includes('content') || act.includes('publish')) return { bg: 'rgba(5, 150, 105, 0.2)', text: '#34d399' };
    if (act.includes('media')) return { bg: 'rgba(59, 130, 246, 0.2)', text: '#60a5fa' }; 
    if (act.includes('auth') || act.includes('login') || act.includes('session')) return { bg: 'rgba(245, 158, 11, 0.2)', text: '#fbbf24' }; 
    if (act.includes('settings') || act.includes('style') || act.includes('global')) return { bg: 'rgba(139, 92, 246, 0.2)', text: '#a78bfa' }; 
    return { bg: 'rgba(255,255,255,0.1)', text: '#9ca3af' };
  };

  return (
    <AdminLayoutWrapper>
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: '#e5e7eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>Activity Log</h1>
          <button 
            onClick={() => { setLoading(true); fetchActivity(); }}
            style={{
              background: '#141a26', border: '1px solid rgba(255,255,255,0.1)', color: '#fff',
              padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}
          >
            {loading ? 'Refreshing...' : '↻ Refresh'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1rem' }}>
          {TABS.map(tab => (
            <button 
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem',
                color: filter === tab ? '#34d399' : '#9ca3af',
                fontWeight: filter === tab ? 600 : 400
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ background: '#0e1420', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          {loading && activities.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>Loading activity...</div>
          ) : filteredActivities.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>No activity recorded yet.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#141a26', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <th style={{ padding: '1rem', color: '#9ca3af', fontWeight: 500 }}>Time</th>
                  <th style={{ padding: '1rem', color: '#9ca3af', fontWeight: 500 }}>User</th>
                  <th style={{ padding: '1rem', color: '#9ca3af', fontWeight: 500 }}>Action</th>
                  <th style={{ padding: '1rem', color: '#9ca3af', fontWeight: 500 }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.slice(0, 50).map(item => {
                  const colors = getActionColor(item.action);
                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '1rem', color: '#9ca3af', fontSize: '0.9rem' }}>
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                      <td style={{ padding: '1rem', color: '#fff' }}>{item.user}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600,
                          background: colors.bg, color: colors.text 
                        }}>
                          {item.action}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: '#e5e7eb' }}>{item.details}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
