import { paths } from 'src/routes/paths';

export const CONFIG = {
  appName: 'SkyTech CMS',
  appVersion: '1.0.0',
  serverUrl: import.meta.env.VITE_API_URL || 'http://localhost:8081',
  frontendUrl: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173',
  auth: {
    redirectPath: paths.dashboard.marquee,
  },
};
