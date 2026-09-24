const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? ''
    : 'http://localhost:8000');

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

function getStoredToken(): string | null {
  try {
    const token = localStorage.getItem('agrifusion_token');
    if (token && token !== 'undefined' && token !== 'null') {
      return token;
    }
  } catch {
    // localStorage might be unavailable
  }
  return null;
}

export function setStoredAuth(token: string | null, user: unknown | null) {
  try {
    if (token) {
      localStorage.setItem('agrifusion_token', token);
    } else {
      localStorage.removeItem('agrifusion_token');
    }

    if (user) {
      localStorage.setItem('agrifusion_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('agrifusion_user');
    }
  } catch (err) {
    console.error('Failed to update localStorage auth:', err);
  }
}

export function getStoredUser<T>(): T | null {
  try {
    const raw = localStorage.getItem('agrifusion_user');
    if (raw && raw !== 'undefined' && raw !== 'null') {
      return JSON.parse(raw) as T;
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getStoredToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const fetchOptions: RequestInit = {
    method: options.method || 'GET',
    headers,
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, fetchOptions);

    if (response.status === 401) {
      // Token is expired or invalid
      setStoredAuth(null, null);
      window.dispatchEvent(new CustomEvent('agrifusion_auth_expired'));
    }

    if (!response.ok) {
      let errDetail = `${response.status} ${response.statusText}`;
      try {
        const errorJson = await response.json();
        if (errorJson.detail) {
          errDetail = typeof errorJson.detail === 'string' ? errorJson.detail : JSON.stringify(errorJson.detail);
        } else if (errorJson.error) {
          errDetail = errorJson.error;
        } else if (errorJson.message) {
          errDetail = errorJson.message;
        }
      } catch {
        // use default statusText
      }
      throw new Error(errDetail);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) => request<T>(endpoint, { method: 'POST', body }),
  put: <T>(endpoint: string, body: unknown) => request<T>(endpoint, { method: 'PUT', body }),
  patch: <T>(endpoint: string, body: unknown) => request<T>(endpoint, { method: 'PATCH', body }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),

  uploadFile: async <T>(endpoint: string, file: File, extraFields?: Record<string, string | undefined>): Promise<T> => {
    const formData = new FormData();
    formData.append('file', file);
    if (extraFields) {
      Object.entries(extraFields).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          formData.append(k, v);
        }
      });
    }
    const token = getStoredToken();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      body: formData,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (response.status === 401) {
      setStoredAuth(null, null);
      window.dispatchEvent(new CustomEvent('agrifusion_auth_expired'));
    }

    if (!response.ok) {
      let errDetail = `Upload failed with status ${response.status}`;
      try {
        const errorJson = await response.json();
        if (errorJson.detail) errDetail = errorJson.detail;
      } catch {
        // fallback
      }
      throw new Error(errDetail);
    }

    return (await response.json()) as T;
  },
};
