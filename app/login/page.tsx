'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiLogin } from '@/services/userService';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/components/ui/Toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Shield, User, Loader2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  const { login } = useAuthStore();
  const { show } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    const targetEmail = customEmail || email;
    const targetPassword = customPass || password;

    try {
      const user = await apiLogin(targetEmail, targetPassword);
      login(user);
      show(`Logged in as ${user.name} (${user.role})`);

      if (redirectPath) {
        router.push(redirectPath);
      } else if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed. Please check credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const fillAndLogin = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
    submit(undefined, e, p);
  };

  return (
    <div className="max-w-sm mx-auto px-5 py-14">
      <h1 className="font-serif text-3xl font-bold mb-2">Welcome back</h1>
      <p className="muted mb-6 text-sm">
        {redirectPath
          ? `Please sign in to access ${redirectPath}`
          : 'Log in to access your dashboard, saved advice, and consultations.'}
      </p>

      {error && (
        <div
          className="mb-4 p-3 rounded-xl text-sm border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300"
        >
          {error}
        </div>
      )}

      <form onSubmit={(e) => submit(e)} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-medium block mb-1">Email address</label>
          <Input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">Password</label>
          <Input
            type="password"
            required
            minLength={4}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full mt-1">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Authenticating…
            </span>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      <div className="flex justify-between text-sm muted mt-4">
        <Link href="/forgot-password" className="hover:underline text-xs">
          Forgot password?
        </Link>
        <Link href="/signup" className="hover:underline text-xs">
          Create account
        </Link>
      </div>

      {/* 1-Click Demo Accounts */}
      <div className="mt-8 p-4 rounded-xl border border-border bg-card">
        <div className="text-xs font-semibold mb-2">Quick Test Accounts:</div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => fillAndLogin('admin@example.com', 'password123')}
            disabled={loading}
            className="w-full text-left px-3 py-2 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30 hover:bg-purple-100/60 dark:hover:bg-purple-900/40 transition-colors flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-semibold flex items-center gap-1.5 text-purple-700 dark:text-purple-300">
                <Shield className="w-3.5 h-3.5" /> Administrator
              </div>
              <div className="text-[11px] text-muted-foreground">admin@example.com / password123</div>
            </div>
            <span className="text-[11px] font-medium text-purple-600 dark:text-purple-400">1-Click Login →</span>
          </button>

          <button
            type="button"
            onClick={() => fillAndLogin('user@example.com', 'password123')}
            disabled={loading}
            className="w-full text-left px-3 py-2 rounded-lg border border-border bg-muted/40 hover:bg-muted transition-colors flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-semibold flex items-center gap-1.5 text-ink">
                <User className="w-3.5 h-3.5 text-muted-foreground" /> Standard User
              </div>
              <div className="text-[11px] text-muted-foreground">user@example.com / password123</div>
            </div>
            <span className="text-[11px] font-medium text-primary">1-Click Login →</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
