'use client';
import { useState } from 'react';
import { Check } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Expert, Booking } from '@/lib/types';
import { createBooking } from '@/services/expertService';
import { useBookingsStore } from '@/store/useBookingsStore';

const TIMES = ['10:00 AM', '1:00 PM', '3:30 PM', '5:00 PM'];

export function BookingModal({ expert, open, onClose }: { expert: Expert; open: boolean; onClose: () => void }) {
  const { add } = useBookingsStore();
  const [date, setDate] = useState('');
  const [time, setTime] = useState(TIMES[0]);
  const [type, setType] = useState<Booking['consultationType']>('Video call');
  const [confirmed, setConfirmed] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    setLoading(true);
    const booking = await createBooking({
      expertId: expert.id,
      expertName: expert.name,
      date: date || new Date().toISOString().slice(0, 10),
      time,
      consultationType: type,
    });
    add(booking);
    setConfirmed(booking);
    setLoading(false);
  };

  const handleClose = () => {
    setConfirmed(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title={`Book with ${expert.name}`}>
      {!confirmed ? (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Date</label>
            <input type="date" className="input-field px-3 py-2 w-full text-sm" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Time</label>
            <select className="input-field px-3 py-2 w-full text-sm" value={time} onChange={(e) => setTime(e.target.value)}>
              {TIMES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Consultation type</label>
            <div className="flex gap-2">
              {(['Video call', 'Chat'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`chip ${type === t ? 'active' : ''}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={confirm} disabled={loading} className="w-full">
            {loading ? 'Confirming…' : 'Confirm booking'}
          </Button>
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center bg-primary text-primary-ink">
            <Check className="w-6 h-6" />
          </div>
          <h3 className="font-medium mb-1">Booking confirmed</h3>
          <p className="muted text-sm mb-5">
            You're set up with {expert.name} on {confirmed.date} at {confirmed.time}. Details are saved to your dashboard.
          </p>
          <Button variant="ghost" onClick={handleClose} className="w-full">
            Done
          </Button>
        </div>
      )}
    </Modal>
  );
}
