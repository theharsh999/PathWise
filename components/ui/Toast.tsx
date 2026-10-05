'use client';
import { createContext, useCallback, useContext, useState } from 'react';

type ToastContextType = { show: (msg: string) => void };
const ToastContext = createContext<ToastContextType>({ show: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<{ id: number; text: string }[]>([]);

  const show = useCallback((text: string) => {
    const id = Date.now();
    setMessages((m) => [...m, { id, text }]);
    setTimeout(() => setMessages((m) => m.filter((msg) => msg.id !== id)), 2000);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center">
        {messages.map((m) => (
          <div key={m.id} className="card px-4 py-2.5 text-sm shadow-lg">
            {m.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
