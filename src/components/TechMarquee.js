'use client';

import { getTechIcon } from './TechIcons';

/**
 * TechMarquee — Horizontally scrolling infinite ticker of tech stack icons.
 * Works on both light and dark backgrounds.
 */
export default function TechMarquee({ technologies = [], variant = 'light' }) {
  if (!technologies || technologies.length === 0) return null;

  // Duplicate the array to create a seamless loop
  const doubled = [...technologies, ...technologies, ...technologies];

  return (
    <div className={`tech-marquee-wrap ${variant === 'dark' ? 'marquee-dark' : 'marquee-light'}`}
         aria-hidden="true">
      <div className="tech-marquee-track">
        {doubled.map((tech, idx) => (
          <div key={`${tech}-${idx}`} className="tech-marquee-pill">
            <span className="tech-marquee-icon">
              {getTechIcon(tech)}
            </span>
            <span className="tech-marquee-label">{tech}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
