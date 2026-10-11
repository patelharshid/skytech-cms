import React from 'react';
import { RefreshCw } from 'lucide-react';

export function LoadingScreen({ message = 'Loading...', sx = {} }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '260px',
        width: '100%',
        color: 'var(--text-secondary)',
        gap: '12px',
        ...sx,
      }}
    >
      <RefreshCw size={28} className="spin" style={{ color: 'var(--accent-amber)' }} />
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{message}</span>
    </div>
  );
}

export default LoadingScreen;
