import { CONFIG } from 'src/global-config';

const TOKEN_KEY = 'skytech_cms_token';
const pendingGetRequests = new Map();

export const apiClient = {
  baseUrl: CONFIG.serverUrl,

  async checkHealth() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    try {
      await this.request('/api/topmarquee/getTopMarquee', { signal: controller.signal });
      return { online: true, status: 200 };
    } catch {
      return { online: false, status: 'Network Error' };
    } finally {
      clearTimeout(timeoutId);
    }
  },

  async request(endpoint, options = {}) {
    const method = (options.method || 'GET').toUpperCase();
    const requestKey = `${method}:${endpoint}`;

    if (method === 'GET' && pendingGetRequests.has(requestKey)) {
      return pendingGetRequests.get(requestKey);
    }

    const token = localStorage.getItem(TOKEN_KEY);
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    const requestPromise = (async () => {
      const response = await fetch(`${CONFIG.serverUrl}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error [${response.status}]: ${errorText || response.statusText}`);
      }

      return response.json();
    })();

    if (method !== 'GET') {
      return requestPromise;
    }

    pendingGetRequests.set(requestKey, requestPromise);
    try {
      return await requestPromise;
    } finally {
      if (pendingGetRequests.get(requestKey) === requestPromise) {
        pendingGetRequests.delete(requestKey);
      }
    }
  },
};

export default apiClient;
