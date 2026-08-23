import { checkAuth } from '@/lib/auth';

export default function AdminDashboardLayout({ children }) {
  // Global auth validation for all admin dashboard routes
  checkAuth();

  return <>{children}</>;
}
