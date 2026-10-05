'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { apiLogout } from '@/services/userService';
import { Shield } from 'lucide-react';

const items = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/ask', label: 'Ask Advice' },
  { href: '/dashboard/questions', label: 'My Questions' },
  { href: '/dashboard/saved', label: 'Saved' },
  { href: '/dashboard/history', label: 'History' },
  { href: '/dashboard/consultations', label: 'Consultations' },
  { href: '/dashboard/profile', label: 'Profile' },
  { href: '/dashboard/settings', label: 'Settings' },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    if (user?.token) {
      await apiLogout(user.token);
    }
    logout();
    router.push('/login');
  };

  return (
    <div className="flex flex-col gap-1">
      {user?.role === 'admin' && (
        <Link
          href="/admin"
          className="px-3 py-2 rounded-lg text-sm font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800 mb-2 flex items-center gap-2"
        >
          <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          Admin Portal
        </Link>
      )}

      {items.map((i) => (
        <Link
          key={i.href}
          href={i.href}
          className={`px-3 py-2 rounded-lg text-sm ${
            pathname === i.href ? 'font-medium border border-border bg-bg' : 'muted hover:text-ink'
          }`}
        >
          {i.label}
        </Link>
      ))}

      <button
        onClick={handleLogout}
        className="px-3 py-2 rounded-lg text-sm text-left muted mt-2 hover:text-red-500 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
