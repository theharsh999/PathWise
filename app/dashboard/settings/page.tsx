'use client';
import { useRouter } from 'next/navigation';
import { useThemeStore } from '@/store/useThemeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { apiLogout } from '@/services/userService';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const { show } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    if (user?.token) {
      await apiLogout(user.token);
    }
    logout();
    show('Logged out successfully');
    router.push('/');
  };

  const deleteAccount = () => {
    if (!confirm('Delete your account and locally stored data? This cannot be undone.')) return;
    ['pw_user', 'pw_saved', 'pw_questions', 'pw_bookings', 'pw_history'].forEach((k) => localStorage.removeItem(k));
    show('Account deleted');
    router.push('/');
    window.location.reload();
  };

  return (
    <div>
      <h1 className="font-serif text-2xl mb-6">Settings</h1>
      <div className="flex flex-col gap-6 max-w-md">
        <div className="card p-5">
          <h2 className="font-medium mb-3 text-sm">Appearance</h2>
          <div className="flex gap-2">
            {(['light', 'dark', 'auto'] as const).map((t) => (
              <button key={t} onClick={() => setTheme(t)} className={`chip ${theme === t ? 'active' : ''}`}>
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <h2 className="font-medium mb-3 text-sm">Notifications</h2>
          {['New advice replies', 'Product updates', 'Expert messages'].map((n, i) => (
            <label key={n} className="flex items-center justify-between text-sm py-1.5">
              <span className="muted">{n}</span>
              <input type="checkbox" defaultChecked={i < 2} />
            </label>
          ))}
        </div>
        <div className="card p-5">
          <h2 className="font-medium mb-3 text-sm">Privacy</h2>
          <label className="flex items-center justify-between text-sm py-1.5">
            <span className="muted">Make profile visible to experts</span>
            <input type="checkbox" defaultChecked />
          </label>
          <label className="flex items-center justify-between text-sm py-1.5">
            <span className="muted">Allow anonymous usage analytics</span>
            <input type="checkbox" />
          </label>
        </div>
        <div className="card p-5">
          <h2 className="font-medium mb-3 text-sm">Session</h2>
          {user && (
            <div className="text-xs muted mb-3">
              Logged in as <strong>{user.email}</strong> ({user.role || 'user'})
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
            <Button variant="danger" onClick={deleteAccount}>Delete account</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
