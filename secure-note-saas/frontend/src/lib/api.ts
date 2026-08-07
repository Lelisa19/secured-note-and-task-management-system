const API_BASE = 'http://localhost:5000/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

export function getAuthUser(): string | null {
  return localStorage.getItem('user') || sessionStorage.getItem('user');
}

export function clearAuthStorage(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
}

let _redirectingToLogin = false;

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearAuthStorage();
    if (!_redirectingToLogin) {
      _redirectingToLogin = true;
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || 'API request failed');
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
