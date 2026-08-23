'use client';
import { useState } from 'react';

export default function ContactForm({ servicesList = [], pageData = {} }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    budget: '',
    message: ''
  });

  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.service || !form.budget || !form.message) {
      setStatus('error');
      setErrorMsg('Please populate all mandatory fields.');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setStatus('success');
        setForm({
          name: '',
          email: '',
          phone: '',
          company: '',
          service: '',
          budget: '',
          message: ''
        });
      } else {
        const errData = await res.json();
        setStatus('error');
        setErrorMsg(errData.error || 'Failed to submit inquiry.');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMsg('A network error occurred. Please try again.');
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="card-glass contact-form-wrapper">
      {status === 'success' ? (
        <div className="form-feedback success-box">
          <div className="feedback-icon">✓</div>
          <h2>Inquiry Received</h2>
          <p>Thank you for reaching out. We have logged your request and our lead architect will review it shortly.</p>
          <button onClick={() => setStatus('idle')} className="btn btn-primary" style={{ marginTop: '2rem' }}>
            Send Another Inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{pageData.formTitle || 'Send us a Message'}</h2>
            <p style={{ color: 'var(--heritage-muted)' }}>{pageData.formDescription || 'Fill out the form below and our team will get back to you within 24 hours.'}</p>
          </div>
          {status === 'error' && (
            <div className="form-feedback error-box">
              <strong>Error:</strong> {errorMsg}
            </div>
          )}

          <div className="form-row-two">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input 
                name="name" 
                className="form-input" 
                required 
                type="text" 
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input 
                name="email" 
                className="form-input" 
                required 
                type="email" 
                placeholder="john@company.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row-two">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                name="phone" 
                className="form-input" 
                type="tel" 
                placeholder="+1 (555) 012-3456"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input 
                name="company" 
                className="form-input" 
                type="text" 
                placeholder="Acme Corporation"
                value={form.company}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row-two">
            <div className="form-group">
              <label className="form-label">Service Required *</label>
              <select 
                name="service" 
                className="form-input" 
                required
                value={form.service}
                onChange={handleChange}
              >
                <option value="">Select a service...</option>
                {servicesList.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Project Budget Bracket *</label>
              <select 
                name="budget" 
                className="form-input" 
                required
                value={form.budget}
                onChange={handleChange}
              >
                <option value="">Select budget bracket...</option>
                <option value="<$2k">Under $2,000</option>
                <option value="$2k-$5k">$2,000 - $5,000</option>
                <option value="$5k-$10k">$5,000 - $10,000</option>
                <option value=">$10k">$10,000+</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Project Details & Goals *</label>
            <textarea 
              name="message" 
              className="form-input" 
              rows="6" 
              required 
              placeholder="Provide details on features, deliverables, timelines, or active websites..."
              value={form.message}
              onChange={handleChange}
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}
          >
            {status === 'loading' ? 'Transmitting inquiry...' : 'Send Secure Inquiry'}
          </button>
        </form>
      )}
    </div>
  );
}
