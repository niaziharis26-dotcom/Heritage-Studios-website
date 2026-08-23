import Link from 'next/link';

export const metadata = {
  title: '404 — Page Not Found | Heritage Studios',
  description: 'The page you are looking for does not exist. Return to Heritage Studios homepage or explore our digital services.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="container content-wrapper text-center">
        <div className="error-badge">404 ERROR</div>
        <h1>Page Not Found</h1>
        <p>
          The page you are looking for does not exist or has been moved.
          Please use the links below to navigate back to a useful area.
        </p>
        <div className="actions-row">
          <Link href="/" className="btn btn-primary">Return Home</Link>
          <Link href="/services" className="btn btn-glass">Explore Services</Link>
          <Link href="/contact" className="btn btn-outline">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}