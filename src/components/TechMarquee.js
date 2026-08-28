'use client';

import { getTechIcon } from './TechIcons';

export default function TechMarquee({ technologies = [], services = [], variant = 'light' }) {
  if (!technologies || technologies.length === 0) return null;

  const doubled = [...technologies, ...technologies, ...technologies];

  const getCustomIcon = (techName) => {
    // Try to find a matching service by name or technology
    const match = services.find(s => {
      if (!s || !s.name) return false;
      if (s.name.toLowerCase() === techName.toLowerCase()) return true;
      // technologies may be array or string
      const techStr = Array.isArray(s.technologies)
        ? s.technologies.join(',')
        : (typeof s.technologies === 'string' ? s.technologies : '');
      return techStr.toLowerCase().includes(techName.toLowerCase());
    });
    if (match && match.icon && match.icon.startsWith('/')) {
      return <img src={match.icon} alt={techName} style={{ width: '22px', height: '22px', objectFit: 'contain' }} />;
    }
    return getTechIcon(techName);
  };

  return (
    <div className={`tech-marquee-wrap ${variant === 'dark' ? 'marquee-dark' : 'marquee-light'}`} aria-hidden="true">
      <div className="tech-marquee-track">
        {doubled.map((tech, idx) => (
          <div key={`${tech}-${idx}`} className="tech-marquee-pill">
            <span className="tech-marquee-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {getCustomIcon(tech)}
            </span>
            <span className="tech-marquee-label">{tech}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
