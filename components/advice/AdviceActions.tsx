'use client';
import { Bookmark, BookmarkCheck, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useSavedStore } from '@/store/useSavedStore';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';

export function AdviceActions({ id, title, category }: { id: string; title: string; category: string }) {
  const { isSaved, toggle } = useSavedStore();
  const { show } = useToast();
  const saved = isSaved('advice', id);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      show('Link copied');
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="ghost"
        onClick={() => {
          toggle({ type: 'advice', id, label: title, category });
          show(saved ? 'Removed' : 'Saved');
        }}
        className="flex items-center gap-2"
      >
        {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        {saved ? 'Saved' : 'Save'}
      </Button>
      <Button variant="ghost" onClick={share} className="flex items-center gap-2">
        <Share2 className="w-4 h-4" /> Share / Copy link
      </Button>
      <Button variant="ghost" onClick={() => show('Thanks for the feedback!')} className="flex items-center gap-2">
        <ThumbsUp className="w-4 h-4" /> Helpful
      </Button>
      <Button variant="ghost" onClick={() => show("Thanks — we'll use this to improve.")} className="flex items-center gap-2">
        <ThumbsDown className="w-4 h-4" /> Not helpful
      </Button>
    </div>
  );
}
