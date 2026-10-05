'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiSignup } from '@/services/userService';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/components/ui/Toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { show } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const user = await apiSignup(name, email, password, confirm);
      login(user);
      show('Account created successfully');
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-5 py-16">
      <h1 className="font-serif text-3xl mb-2">Create your account</h1>
      <p className="muted mb-7 text-sm">Takes less than a minute.</p>
      {error && (
        <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: 'var(--danger-bg, #fef2f2)', color: 'var(--danger, #dc2626)' }}>
          {error}
        </div>
      )}
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Input required placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input required type="password" minLength={6} placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input required type="password" minLength={6} placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        <label className="flex items-center gap-2 text-sm muted">
          <input required type="checkbox" /> I agree to the Terms
        </label>
        <Button type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</Button>
      </form>
      <div className="text-sm muted mt-4">
        Already have an account?{' '}
        <Link href="/login" className="hover:underline">Log in</Link>
      </div>
    </div>
  );
}
