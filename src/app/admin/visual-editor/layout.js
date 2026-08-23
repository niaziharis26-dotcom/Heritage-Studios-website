import { checkAuth } from '@/lib/auth';

export const metadata = {
  title: 'Visual Editor | Heritage Studios Admin',
};

export default function VisualEditorLayout({ children }) {
  checkAuth();
  return (
    <div style={{ height: '100vh', overflow: 'hidden', background: '#0a0f1a' }}>
      {children}
    </div>
  );
}
