import React from 'react';
import { ShieldCheck, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { navData } from '../nav-config-dashboard';
import { paths } from 'src/routes/paths';

export function NavVertical({ badges = {}, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="cms-sidebar" id="cms-sidebar">
      <div className="cms-sidebar-header">
        <a
          href={paths.dashboard.root}
          className="brand-badge"
          onClick={(e) => {
            e.preventDefault();
            navigate(paths.dashboard.root);
          }}
        >
          <div className="brand-icon-box">
            <ShieldCheck size={24} strokeWidth={2.5} />
          </div>
          <div className="brand-titles">
            <span className="brand-title">SkyTech</span>
            <span className="brand-subtitle">CMS Admin</span>
          </div>
        </a>
      </div>

      <nav className="cms-nav" id="cms-nav">
        {navData.map((section, sIndex) => (
          <React.Fragment key={section.subheader || sIndex}>
            {section.subheader && (
              <div className="nav-section-title">{section.subheader}</div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const badgeCount =
                item.badgeKey && badges[item.badgeKey]
                  ? badges[item.badgeKey]
                  : 0;

              return (
                <button
                  key={item.path}
                  id={`nav-btn-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                  type="button"
                >
                  {Icon && <Icon size={18} className="nav-icon" />}
                  <span>{item.title}</span>
                  {badgeCount > 0 && <span className="nav-pill">{badgeCount}</span>}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </nav>

      <div className="cms-sidebar-footer">
        {onLogout && (
          <button
            type="button"
            id="sidebar-logout-btn"
            className="btn btn-danger btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={onLogout}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
}

export default NavVertical;
