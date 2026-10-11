import React from 'react';
import { ShieldCheck, RefreshCw } from 'lucide-react';

export function SplashScreen() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: 'var(--bg-app)',
        color: 'var(--text-primary)',
        gap: '16px',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '14px',
          background: 'var(--accent-amber-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#080c14',
          boxShadow: 'var(--shadow-glow)',
        }}
      >
        <ShieldCheck size={32} strokeWidth={2.5} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
        <RefreshCw size={16} className="spin" style={{ color: 'var(--accent-amber)' }} />
        <span style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>AUTHENTICATING SKYTECH CMS...</span>
      </div>
    </div>
  );
}

export default SplashScreen;
