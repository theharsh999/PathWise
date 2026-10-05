'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="max-w-sm mx-auto px-5 py-16">
      <h1 className="font-serif text-3xl mb-2">Reset password</h1>
      <p className="muted mb-7 text-sm">Enter your email and we'll send reset instructions.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        className="flex flex-col gap-4"
      >
        <Input required type="email" placeholder="Email" />
        <Button type="submit">Send reset link</Button>
      </form>
      {sent && <div className="card p-4 text-sm mt-4">If an account exists for that email, reset instructions have been sent.</div>}
      <Link href="/login" className="text-sm muted hover:underline block mt-4">← Back to login</Link>
    </div>
  );
}
