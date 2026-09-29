const isBrowser = typeof window !== 'undefined';
const isLocalhost = isBrowser && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === '0.0.0.0' ||
  window.location.hostname === ''
);

// If running in browser on localhost, Vercel, or any same-origin deployment, use relative path '' so requests hit the same origin API
const isVercelSameOrigin = isBrowser && window.location.hostname.endsWith('.vercel.app');
const API_BASE_URL = (isLocalhost || isVercelSameOrigin || !import.meta.env.VITE_API_URL)
  ? ''
  : (import.meta.env.VITE_API_URL || (isBrowser ? '' : 'http://localhost:8000'));

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

    if (response.status === 401 && (endpoint.includes('/auth/profile') || endpoint.includes('/auth/me'))) {
      // Token is explicitly rejected on profile verification
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
  } catch (error: any) {
    console.warn(`API Error on ${endpoint}:`, error);
    if (
      error?.name === 'TypeError' &&
      (error?.message === 'Failed to fetch' ||
        error?.message?.toLowerCase().includes('fetch') ||
        error?.message?.toLowerCase().includes('networkerror'))
    ) {
      throw new Error('AgriFusion server is unreachable. You can continue with Demo Mode or check your connection.');
    }
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

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });


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
    } catch (error: any) {
      if (
        error?.name === 'TypeError' &&
        (error?.message === 'Failed to fetch' ||
          error?.message?.toLowerCase().includes('fetch') ||
          error?.message?.toLowerCase().includes('networkerror'))
      ) {
        throw new Error('Server connection offline. Please verify backend service.');
      }
      throw error;
    }
  },

  uploadFiles: async <T>(
    endpoint: string,
    primaryFile: File,
    additionalFiles?: File[],
    extraFields?: Record<string, string | undefined>
  ): Promise<T> => {
    const formData = new FormData();
    formData.append('file', primaryFile);
    formData.append('files', primaryFile);
    if (additionalFiles && additionalFiles.length > 0) {
      if (additionalFiles[0]) {
        formData.append('additional_file_1', additionalFiles[0]);
        formData.append('files', additionalFiles[0]);
      }
      if (additionalFiles[1]) {
        formData.append('additional_file_2', additionalFiles[1]);
        formData.append('files', additionalFiles[1]);
      }
    }
    if (extraFields) {
      Object.entries(extraFields).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          formData.append(k, v);
        }
      });
    }
    const token = getStoredToken();

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });


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
    } catch (error: any) {
      if (
        error?.name === 'TypeError' &&
        (error?.message === 'Failed to fetch' ||
          error?.message?.toLowerCase().includes('fetch') ||
          error?.message?.toLowerCase().includes('networkerror'))
      ) {
        throw new Error('Server connection offline. Please verify backend service.');
      }
      throw error;
    }
  },
};
