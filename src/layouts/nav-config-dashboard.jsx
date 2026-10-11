import {
  Megaphone,
  LayoutDashboard,
} from 'lucide-react';
import { paths } from 'src/routes/paths';

export const navData = [
  {
    subheader: 'Overview',
    items: [
      {
        title: 'Dashboard',
        path: paths.dashboard.analytics,
        icon: LayoutDashboard,
      },
      {
        title: 'Top Marquee Bar',
        path: paths.dashboard.marquee,
        icon: Megaphone,
        badgeKey: 'marqueeCount',
      },
    ],
  },
];
