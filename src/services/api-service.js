import apiClient from './api-client';
import { defaultMarqueeAnnouncements } from 'src/data/initial-data';

const TOKEN_KEY = 'skytech_cms_token';
const REFRESH_TOKEN_KEY = 'skytech_cms_refresh_token';
const USER_KEY = 'skytech_cms_user';
const MARQUEE_KEY = 'skytech_cms_marquee';

export const apiService = {
  baseUrl: apiClient.baseUrl,

  // ----------------------------------------------------
  // Health & Status
  // ----------------------------------------------------
  checkHealth: async () => {
    return await apiClient.checkHealth();
  },

  // ----------------------------------------------------
  // Authentication
  // ----------------------------------------------------
  isAuthenticated: () => {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  login: async ({ email, password }) => {
    const response = await apiClient.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim(), password }),
    });

    // The backend wraps successful responses in { success, data }.
    const result = response?.data || response;
    const token = result?.session || result?.token;
    if (!token) {
      throw new Error(response?.message || 'The login response did not include a session.');
    }

    const userObj = result.user || {};
    localStorage.setItem(TOKEN_KEY, token);
    if (result.refresh) {
      localStorage.setItem(REFRESH_TOKEN_KEY, result.refresh);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        ...userObj,
        id: userObj.userId ?? userObj.id,
        name: [userObj.firstName, userObj.lastName].filter(Boolean).join(' ') || userObj.name || userObj.email,
      })
    );
    return { success: true, user: userObj, token, source: 'backend' };
  },

  logout: () => {
    [TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY].forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  },

  // ----------------------------------------------------
  // Top Marquee CRUD
  // ----------------------------------------------------
  getTopMarquee: async () => {
    try {
      const result = await apiClient.request('/api/topmarquee/getTopMarquee');
      if (result && Array.isArray(result.data)) {
        localStorage.setItem(MARQUEE_KEY, JSON.stringify(result.data));
        return { data: result.data, source: 'backend' };
      }
    } catch (err) {
      console.warn('[apiService] Backend unreachable, loading cached marquee:', err);
    }

    const cached = localStorage.getItem(MARQUEE_KEY);
    if (cached) {
      try {
        return { data: JSON.parse(cached), source: 'local' };
      } catch {
        // continue
      }
    }

    localStorage.setItem(MARQUEE_KEY, JSON.stringify(defaultMarqueeAnnouncements));
    return { data: defaultMarqueeAnnouncements, source: 'local' };
  },

  getMarqueeById: async (id) => {
    try {
      const result = await apiClient.request(`/api/topmarquee/${id}`);
      if (result && result.data) {
        return result.data;
      }
    } catch (err) {
      console.warn(`[apiService] Fetch marquee ${id} failed:`, err);
    }
    return null;
  },

  createMarquee: async ({ title, isActive }) => {
    const payload = {
      title,
      isActive: typeof isActive !== 'undefined' ? isActive : true,
      createdBy: 1,
    };

    try {
      const result = await apiClient.request('/api/topmarquee', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (result && result.data) {
        return { data: result.data, source: 'backend' };
      }
    } catch (err) {
      console.warn('[apiService] Backend create marquee failed, saving locally:', err);
    }

    const { data: current } = await apiService.getTopMarquee();
    const newItem = {
      id: Date.now(),
      title,
      isActive: typeof isActive !== 'undefined' ? isActive : true,
      createdDateTime: new Date().toISOString(),
    };
    const updated = [newItem, ...current];
    localStorage.setItem(MARQUEE_KEY, JSON.stringify(updated));
    return { data: newItem, source: 'local' };
  },

  updateMarquee: async (id, { title, isActive }) => {
    const payload = {
      title,
      isActive,
      updatedBy: 1,
    };

    try {
      const result = await apiClient.request(`/api/topmarquee/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      if (result && result.data) {
        return { data: result.data, source: 'backend' };
      }
    } catch (err) {
      console.warn(`[apiService] Backend update marquee ${id} failed:`, err);
    }

    const { data: current } = await apiService.getTopMarquee();
    const updated = current.map((elem) => (elem.id === id ? { ...elem, title, isActive } : elem));
    localStorage.setItem(MARQUEE_KEY, JSON.stringify(updated));
    return { data: { id, title, isActive }, source: 'local' };
  },

  deleteMarquee: async (id) => {
    try {
      const result = await apiClient.request(`/api/topmarquee/${id}`, {
        method: 'DELETE',
      });
      if (result && result.success) {
        return { success: true, source: 'backend' };
      }
    } catch (err) {
      console.warn(`[apiService] Backend delete marquee ${id} failed:`, err);
    }

    const { data: current } = await apiService.getTopMarquee();
    const updated = current.filter((elem) => elem.id !== id);
    localStorage.setItem(MARQUEE_KEY, JSON.stringify(updated));
    return { success: true, source: 'local' };
  },
};

export default apiService;
