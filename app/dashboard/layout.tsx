'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { apiGetMe } from '@/services/userService';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, login, isValidated, setValidated } = useAuthStore();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      // Wait a tick for Zustand persist rehydration
      await new Promise((r) => setTimeout(r, 80));

      const currentUser = useAuthStore.getState().user;

      if (!currentUser || !currentUser.token) {
        // No local session — redirect to login
        logout();
        router.replace('/login');
        return;
      }

      // If already validated in this browser session, skip server check
      if (useAuthStore.getState().isValidated) {
        setChecking(false);
        return;
      }

      // Validate the token against the backend
      const validUser = await apiGetMe(currentUser.token);

      if (!validUser) {
        // Token invalid/expired — force re-login
        logout();
        router.replace('/login');
        return;
      }

      // Update user data from server and mark as validated
      login({ ...validUser, token: currentUser.token });
      setValidated(true);
      setChecking(false);
    };

    validateSession();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  if (checking || !user) {
    return (
      <div className="max-w-6xl mx-auto px-5 py-12 muted text-sm">
        Verifying your session…
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-10 grid md:grid-cols-[200px,1fr] gap-8">
      <aside className="hidden md:block">
        <DashboardSidebar />
      </aside>
      <div>
        <details className="md:hidden mb-5 card p-3">
          <summary className="text-sm font-medium cursor-pointer">Dashboard menu</summary>
          <div className="mt-2">
            <DashboardSidebar />
          </div>
        </details>
        {children}
      </div>
    </div>
  );
}
