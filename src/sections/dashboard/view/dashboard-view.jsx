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
      </div>
    </div>
  );
}

export default DashboardView;
