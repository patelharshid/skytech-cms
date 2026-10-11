import React from 'react';
import { RefreshCw, ExternalLink, LogOut } from 'lucide-react';
import { CONFIG } from 'src/global-config';

export function Header({
  title = 'Admin Portal',
  subtitle,
  backendStatus = false,
  onRefreshStatus,
  checkingStatus = false,
  user,
  onLogout,
}) {
  const adminName = user && user.name ? user.name.split(' ')[0] : 'Admin';
  const initial = adminName ? adminName.charAt(0).toUpperCase() : 'A';

  return (
    <header className="cms-header" id="cms-header">
      <div className="header-left">
        <div className="header-title-box">
          <h1 className="header-page-title" id="page-title">
            {title}
          </h1>
          {subtitle && <span className="cms-card-subtitle">{subtitle}</span>}
        </div>
      </div>

      <div className="header-right">
        <a
          href={CONFIG.frontendUrl}
          target="_blank"
          rel="noreferrer"
          id="header-visit-website-btn"
          className="btn btn-secondary btn-sm"
        >
          <ExternalLink size={14} />
          <span>Live Store</span>
        </a>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 10px',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: 'var(--accent-amber)',
              color: '#090d16',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '0.75rem',
            }}
          >
            {initial}
          </div>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
            }}
          >
            {adminName}
          </span>

        </div>
      </div>
    </header>
  );
}

export default Header;
