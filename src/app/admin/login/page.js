'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        window.location.href = '/admin';
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container login-container">
        <div className="card-glass login-card">
          <div className="text-center">
            <span className="logo-icon">♦</span>
            <h1 style={{ fontSize: '2rem', marginTop: '1rem' }}>Admin Portal</h1>
            <p style={{ margin: '0.5rem 0 2rem' }}>Authenticate to access the Visual CMS & Leads Management.</p>
          </div>

          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input 
                type="text" 
                className="form-input" 
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-container {
          max-width: 450px;
        }

        .login-card {
          padding: 3rem 2.5rem;
        }

        .logo-icon {
          font-size: 2.5rem;
          color: var(--color-primary);
        }

        .text-center {
          text-align: center;
        }

        .error-banner {
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.2);
          color: #ef4444;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
