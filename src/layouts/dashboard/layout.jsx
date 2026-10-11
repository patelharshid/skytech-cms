import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { NavVertical } from './nav-vertical';
import { Header } from './header';
import { apiService } from 'src/services/api-service';
import { NotificationToast } from 'src/components/toast';
import { paths } from 'src/routes/paths';

const PAGE_META = {
  [paths.dashboard.analytics]: {
    title: 'Platform Analytics',
    subtitle: 'SkyTech system metrics and content overview',
  },
  [paths.dashboard.marquee]: {
    title: 'Top Marquee Bar',
    subtitle: 'Header rolling announcement ticker management',
  },
};

export function DashboardLayout({ children }) {
  const [currentUser, setCurrentUser] = useState(apiService.getCurrentUser());
  const [backendOnline, setBackendOnline] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [marqueeCount, setMarqueeCount] = useState(0);
  const [toast, setToast] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  const checkStatus = useCallback(async () => {
    setCheckingStatus(true);
    const health = await apiService.checkHealth();
    setBackendOnline(health.online);
    setCheckingStatus(false);
    return health.online;
  }, []);

  const loadMarqueeBadge = useCallback(async () => {
    try {
      const res = await apiService.getTopMarquee();
      const items = res && res.data ? res.data : [];
      const activeCount = items.filter((m) => m.isActive).length;
      setMarqueeCount(activeCount);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    checkStatus();
    loadMarqueeBadge();
    setCurrentUser(apiService.getCurrentUser());

    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [checkStatus, loadMarqueeBadge]);

  const handleLogout = () => {
    apiService.logout();
    showToast('Signed out successfully.', 'success');
    navigate(paths.auth.login, { replace: true });
  };

  const currentMeta = PAGE_META[location.pathname] || {
    title: 'Admin Command Center',
    subtitle: 'SkyTech ecosystem management',
  };

  return (
    <div className="cms-layout">
      <NavVertical
        badges={{ marqueeCount }}
        onLogout={handleLogout}
      />

      <main className="cms-main">
        <Header
          title={currentMeta.title}
          subtitle={currentMeta.subtitle}
          backendStatus={backendOnline}
          checkingStatus={checkingStatus}
          onRefreshStatus={checkStatus}
          user={currentUser}
          onLogout={handleLogout}
        />

        <div className="cms-content">
          {children || <Outlet context={{ showToast, refreshBadge: loadMarqueeBadge }} />}
        </div>
      </main>

      <NotificationToast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

export default DashboardLayout;
