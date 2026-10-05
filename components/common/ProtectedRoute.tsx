'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { apiGetMe } from '@/services/userService';
import { ShieldAlert, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, login, logout } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'authorized' | 'unauthorized'>('loading');

  useEffect(() => {
    let isMounted = true;

    const verify = async () => {
      // Small pause to allow Zustand store hydration from localStorage
      await new Promise((resolve) => setTimeout(resolve, 60));
      if (!isMounted) return;

      const currentUser = useAuthStore.getState().user;

      // 1. Check if token exists
      if (!currentUser || !currentUser.token) {
        logout();
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      // 2. Verify token with backend
      try {
        const validatedUser = await apiGetMe(currentUser.token);

        if (!isMounted) return;

        if (!validatedUser) {
          logout();
          router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
          return;
        }

        // Account blocked check
        if (validatedUser.status === 'blocked') {
          logout();
          alert('Your account has been suspended. Please contact support.');
          router.replace('/login');
          return;
        }

        // Update local session with fresh server data
        login({ ...validatedUser, token: currentUser.token });

        // 3. Role-based authorization check
        if (requiredRole === 'admin' && validatedUser.role !== 'admin') {
          setStatus('unauthorized');
          return;
        }

        setStatus('authorized');
      } catch {
        if (!isMounted) return;
        // In case of network glitch but valid local state
        if (currentUser.token) {
          if (requiredRole === 'admin' && currentUser.role !== 'admin') {
            setStatus('unauthorized');
          } else {
            setStatus('authorized');
          }
        } else {
          logout();
          router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [pathname, requiredRole]); // eslint-disable-line react-hooks/exhaustive-deps

  if (status === 'loading') {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
        <p className="text-sm font-medium">Verifying authorization…</p>
        <p className="text-xs muted mt-1">Checking secure session credentials with the backend</p>
      </div>
    );
  }

  if (status === 'unauthorized') {
    return (
      <div className="max-w-md mx-auto my-16 p-8 border border-border rounded-2xl bg-card text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-serif font-bold mb-2">Access Restricted</h2>
        <p className="text-sm muted mb-6">
          This section requires Administrator privileges. Your account ({user?.email}) is authorized as a standard user.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg bg-primary text-primary-ink text-sm font-medium"
          >
            Back to Dashboard
          </Link>
          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted"
          >
            Log in as Admin
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
