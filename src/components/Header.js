'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';

export default function Header({ settings, navigation = {} }) {
  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navLinks = (navigation.links || [])
    .filter(l => l.visible)
    .sort((a, b) => a.order - b.order);

  const ctaText = navigation.ctaText || 'Book a Call';
  const ctaUrl  = navigation.ctaUrl  || settings?.bookingUrl || '/contact';

  // Hero is always light — header starts transparent with dark text
  // On scroll → frosted dark glass
  const cls = scrolled ? 'hs-header--scrolled' : 'hs-header--light';

  return (
    <>
      <header className={`hs-header ${cls}`} role="banner">
        <div className="container hs-header-inner">

          {/* Logo */}
          <Link href="/" className="hs-logo" aria-label="Heritage Studios — Home">
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <nav className="hs-nav" role="navigation" aria-label="Main navigation">
            {navLinks.map(link => (
              <Link
                key={link.id || link.path}
                href={link.path}
                className={`hs-nav-link ${pathname === link.path ? 'active' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hs-header-actions">
            <a href={ctaUrl} className="btn btn-primary hs-header-cta">
              {ctaText}
            </a>
            <button
              className={`hs-hamburger ${mobileOpen ? 'open' : ''}`}
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`hs-mobile-menu ${mobileOpen ? 'open' : ''}`}
        aria-hidden={!mobileOpen}
        role="dialog"
        aria-label="Mobile navigation"
      >
        <nav className="hs-mobile-nav">
          {navLinks.map(link => (
            <Link
              key={link.id || link.path}
              href={link.path}
              className={`hs-mobile-link ${pathname === link.path ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <a href={ctaUrl} className="btn btn-primary btn-lg hs-mobile-cta" onClick={() => setMobileOpen(false)}>
          {ctaText}
        </a>
      </div>
    </>
  );
}
