'use client';
import { useState } from 'react';
import { categories } from '@/data/categories';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/components/ui/Toast';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const { show } = useToast();
  const [name, setName] = useState(user?.name ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [interests, setInterests] = useState<string[]>(user?.interests ?? []);
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const toggleInterest = (slug: string) => {
    setInterests((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, bio, interests });
    setSaved(true);
    show('Profile saved');
  };

  return (
    <div>
      <h1 className="font-serif text-2xl mb-6">Profile</h1>
      <form onSubmit={submit} className="max-w-md flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <span className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold bg-bg border border-border">
            {user.name[0]}
          </span>
          <span className="muted text-sm">Profile picture placeholder</span>
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">Bio</label>
          <Textarea className="min-h-[80px]" value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">Preferred categories</label>
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 8).map((c) => (
              <button
                type="button"
                key={c.slug}
                onClick={() => toggleInterest(c.slug)}
                className={`chip ${interests.includes(c.slug) ? 'active' : ''}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
        <Button type="submit" className="w-fit px-6">Save changes</Button>
        {saved && <p className="text-xs" style={{ color: 'var(--primary)' }}>Saved.</p>}
      </form>
    </div>
  );
}
