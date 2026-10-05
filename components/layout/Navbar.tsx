'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Search, Shield, LogOut } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuthStore } from '@/store/useAuthStore';
import { apiLogout } from '@/services/userService';

const navLinks = [
  { href: '/categories', label: 'Categories' },
  { href: '/experts', label: 'Experts' },
  { href: '/blog', label: 'Blog' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/about', label: 'About' },
];

export function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    if (user?.token) {
      await apiLogout(user.token);
    }
    logout();
    router.push('/login');
  };

  return (
    <header
      className="sticky top-0 z-40 border-b border-border bg-bg"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="font-serif text-xl font-semibold shrink-0">
          Pathwise
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm muted">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-ink">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/search" className="p-2 rounded-lg border border-border hidden sm:inline-flex" aria-label="Search">
            <Search className="w-[18px] h-[18px]" />
          </Link>
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-2">
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </Link>
              )}
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-border text-sm hover:bg-muted/40"
              >
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-primary text-primary-ink">
                  {user.name[0]}
                </span>
                <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
              </Link>
              <Link
                href="/ask"
                className="hidden sm:inline-block px-3.5 py-1.5 text-sm rounded-lg font-medium bg-primary text-primary-ink hover:opacity-90"
              >
                Get Advice
              </Link>
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex p-2 rounded-lg border border-border text-muted hover:text-ink hover:bg-muted"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="hidden sm:inline-block px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-muted">
                Log in
              </Link>
              <Link href="/signup" className="hidden sm:inline-block px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-muted">
                Sign up
              </Link>
              <Link href="/ask" className="px-4 py-1.5 text-sm rounded-lg font-medium bg-primary text-primary-ink hover:opacity-90">
                Get Advice
              </Link>
            </div>
          )}

          <button className="md:hidden p-2 rounded-lg border border-border" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border px-5 py-3 flex flex-col gap-3 text-sm bg-bg">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/search" onClick={() => setOpen(false)}>Search</Link>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1.5"
                >
                  <Shield className="w-4 h-4" /> Admin Portal
                </Link>
              )}
              <Link href="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
              <Link href="/ask" onClick={() => setOpen(false)}>Ask Advice</Link>
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="text-left text-red-500 font-medium"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)}>Log in</Link>
              <Link href="/signup" onClick={() => setOpen(false)}>Sign up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
