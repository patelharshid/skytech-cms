import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  BellOff,
  Radio,
  Activity,
  PlusCircle,
  ArrowRight,
  Server,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';
import { StatCard } from 'src/components/stat-card';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { CONFIG } from 'src/global-config';
import { apiService } from 'src/services/api-service';

export function DashboardView({
  marqueeItems: propMarquees,
  backendOnline: propBackendOnline,
}) {
  const router = useRouter();

  const [marqueeItems, setMarqueeItems] = useState(propMarquees || []);
  const [backendOnline, setBackendOnline] = useState(
    typeof propBackendOnline !== 'undefined' ? propBackendOnline : false
  );

  useEffect(() => {
    if (!propMarquees) {
      apiService.getTopMarquee().then((res) => {
        if (res && res.data) setMarqueeItems(res.data);
      });
      apiService.checkHealth().then((res) => {
        if (res) setBackendOnline(res.online);
      });
    }
  }, [propMarquees]);

  const activeMarquees = marqueeItems.filter((m) => m.isActive);
  const inactiveMarquees = marqueeItems.filter((m) => !m.isActive);

  const tickerText =
    activeMarquees.map((m) => m.title).join('   •   ') || 'No active announcements set.';

  return (
    <div id="view-dashboard">
      {/* KPI Stats for Marquee & System */}
      <div className="stats-grid">
        <StatCard
          title="Active Announcements"
          value={activeMarquees.length}
          icon={Megaphone}
          trendText="Displayed on live top header"
        />
        <StatCard
          title="Inactive / Hidden"
          value={inactiveMarquees.length}
          icon={BellOff}
          color="var(--accent-rose)"
          trendText="Saved in draft or paused"
        />
        <StatCard
          title="Total Headlines"
          value={marqueeItems.length}
          icon={Radio}
          color="var(--accent-cyan)"
          trendText="All configured announcements"
        />
        <StatCard
          title="Backend Status"
          value={backendOnline ? 'Online' : 'Offline'}
          icon={Activity}
          color={backendOnline ? 'var(--accent-emerald)' : 'var(--accent-amber)'}
          trendText={backendOnline ? 'Port 8081 Connected' : 'Local Fallback Active'}
        />
      </div>

      {/* Architecture & Quick Actions Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
          marginBottom: '28px',
        }}
      >
        {/* Quick Actions Panel */}
        <div className="cms-card">
          <div className="cms-card-header">
            <div>
              <h2 className="cms-card-title">Top Marquee Management</h2>
              <p className="cms-card-subtitle">Manage public rolling ticker</p>
            </div>
            <PlusCircle size={20} color="var(--accent-cyan)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              id="dash-quick-marquee"
              className="btn btn-secondary"
              style={{ justifyContent: 'space-between', padding: '16px 18px' }}
              onClick={() => router.push(paths.dashboard.marquee)}
              type="button"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(245,158,11,0.15)',
                    color: 'var(--accent-amber)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Megaphone size={18} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.92rem' }}>
                    Open Top Marquee Bar Manager
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Add, edit, toggle visibility, and delete announcements
                  </div>
                </div>
              </div>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardView;
