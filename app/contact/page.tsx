'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="max-w-lg mx-auto px-5 py-14">
      <h1 className="font-serif text-3xl mb-2">Contact us</h1>
      <p className="muted mb-7">Questions, feedback, or something not working? Let us know.</p>
      {!sent ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="flex flex-col gap-4"
        >
          <Input required placeholder="Name" />
          <Input required type="email" placeholder="Email" />
          <Input required placeholder="Subject" />
          <Textarea required className="min-h-[100px]" placeholder="Message" />
          <Button type="submit">Send message</Button>
        </form>
      ) : (
        <div className="card p-5 text-sm">Thanks — your message has been received. We'll get back to you soon.</div>
      )}
      <p className="muted text-sm mt-6">
        Prefer to browse first? Check the{' '}
        <Link href="/faq" className="underline">
          FAQ
        </Link>
        .
      </p>
    </div>
  );
}
