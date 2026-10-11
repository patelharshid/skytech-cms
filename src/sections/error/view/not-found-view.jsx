import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

export function NotFoundView() {
  const router = useRouter();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        textAlign: 'center',
        padding: '32px',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          background: 'rgba(244, 63, 94, 0.12)',
          color: 'var(--accent-rose)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <ShieldAlert size={40} />
      </div>
      <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '8px' }}>404 - Not Found</h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', marginBottom: '24px' }}>
        The admin page or management view you are looking for does not exist or has been moved.
      </p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => router.push(paths.dashboard.root)}
      >
        <ArrowLeft size={16} />
        <span>Return to Dashboard</span>
      </button>
    </div>
  );
}

export default NotFoundView;
