import { User, AdminStats, AdminUser, AdminReport, BackendCategory } from '@/lib/types';

const API_BASE = '/backend-api';

/**
 * Cookie helpers so Next.js server middleware can read session state
 */
export function setAuthCookies(token: string, role: string = 'user'): void {
  if (typeof document === 'undefined') return;
  const maxAge = 60 * 60 * 24 * 7; // 7 days
  document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `auth_role=${encodeURIComponent(role)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearAuthCookies(): void {
  if (typeof document === 'undefined') return;
  document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'auth_role=; path=/; max-age=0; SameSite=Lax';
}

export function getAuthCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

async function parseJsonResponse(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    if (!res.ok) {
      throw new Error(`Server error (${res.status}). Please ensure PHP backend is running on port 8000.`);
    }
    throw new Error('Invalid response received from server.');
  }
}

/**
 * Authenticate with the PHP backend API.
 */
export async function apiLogin(email: string, password: string): Promise<User> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await parseJsonResponse(res);

  if (!res.ok) {
    throw new Error(data.message || 'Login failed.');
  }

  const user: User = {
    id: data.user.id,
    name: data.user.name,
    email: data.user.email,
    bio: data.user.bio || '',
    role: data.user.role || 'user',
    status: data.user.status || 'active',
    interests: [],
    joinedAt: data.user.created_at,
    token: data.token,
  };

  setAuthCookies(data.token, user.role);
  return user;
}

/**
 * Register a new user with the PHP backend API.
 */
export async function apiSignup(
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
): Promise<User> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, confirm_password: confirmPassword }),
  });

  const data = await parseJsonResponse(res);

  if (!res.ok) {
    throw new Error(data.message || 'Registration failed.');
  }

  const user: User = {
    id: data.user.id,
    name: data.user.name,
    email: data.user.email,
    bio: data.user.bio || '',
    role: data.user.role || 'user',
    status: data.user.status || 'active',
    interests: [],
    joinedAt: data.user.created_at,
    token: data.token,
  };

  setAuthCookies(data.token, user.role);
  return user;
}

/**
 * Logout — invalidates the token on the backend and clears cookies.
 */
export async function apiLogout(token?: string): Promise<void> {
  clearAuthCookies();
  if (!token) return;

  try {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    // Ignore network failures on logout
  }
}

/**
 * Validate current session by querying /api/auth/me.
 */
export async function apiGetMe(token: string): Promise<User | null> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      clearAuthCookies();
      return null;
    }

    const data = await res.json();
    const user: User = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      bio: data.user.bio || '',
      role: data.user.role || 'user',
      status: data.user.status || 'active',
      interests: [],
      joinedAt: data.user.created_at,
      token,
    };

    setAuthCookies(token, user.role);
    return user;
  } catch {
    return null;
  }
}

/**
 * Update user profile.
 */
export async function apiUpdateProfile(
  token: string,
  patch: { name?: string; bio?: string },
): Promise<User> {
  const res = await fetch(`${API_BASE}/api/user/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(patch),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Profile update failed.');
  }

  return {
    id: data.user.id,
    name: data.user.name,
    email: data.user.email,
    bio: data.user.bio || '',
    role: data.user.role,
    status: data.user.status,
    interests: [],
    joinedAt: data.user.created_at,
    token,
  };
}

/* ─────────────────────────────────────────────────────────────
 * Admin API Client Methods (Strictly Protected)
 * ───────────────────────────────────────────────────────────── */

export async function apiGetAdminStats(token: string): Promise<AdminStats> {
  const res = await fetch(`${API_BASE}/api/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch admin stats.');
  return data.stats;
}

export async function apiGetAdminUsers(token: string): Promise<AdminUser[]> {
  const res = await fetch(`${API_BASE}/api/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch users list.');
  return data.users;
}

export async function apiToggleBlockUser(
  token: string,
  userId: number,
  status: 'active' | 'blocked',
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ user_id: userId, status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update user status.');
}

export async function apiGetAdminCategories(token: string): Promise<BackendCategory[]> {
  const res = await fetch(`${API_BASE}/api/admin/categories`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch categories.');
  return data.categories;
}

export async function apiCreateCategory(
  token: string,
  name: string,
  description: string,
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, description }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create category.');
}

export async function apiDeleteCategory(token: string, id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/categories`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete category.');
}

export async function apiGetAdminQuestions(token: string): Promise<any[]> {
  const res = await fetch(`${API_BASE}/api/admin/questions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch questions.');
  return data.questions;
}

export async function apiDeleteQuestion(token: string, id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/questions`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete question.');
}

export async function apiGetAdminReports(token: string): Promise<AdminReport[]> {
  const res = await fetch(`${API_BASE}/api/admin/reports`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch reports.');
  return data.reports;
}

export async function apiUpdateReport(
  token: string,
  id: number,
  status: 'pending' | 'reviewed' | 'resolved',
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update report.');
}
