import { CONFIG } from 'src/global-config';

const TOKEN_KEY = 'skytech_cms_token';

export const apiClient = {
  baseUrl: CONFIG.serverUrl,

  async checkHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch(`${CONFIG.serverUrl}/api/topmarquee/getTopMarquee`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return { online: response.ok, status: response.status };
    } catch {
      return { online: false, status: 'Network Error' };
    }
  },

  async request(endpoint, options = {}) {
    const token = localStorage.getItem(TOKEN_KEY);
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    const response = await fetch(`${CONFIG.serverUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error [${response.status}]: ${errorText || response.statusText}`);
    }

    return await response.json();
  },
};

export default apiClient;
