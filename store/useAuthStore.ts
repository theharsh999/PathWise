import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/types';
import { setAuthCookies, clearAuthCookies } from '@/services/userService';

type AuthState = {
  user: User | null;
  isValidated: boolean;
  login: (user: User) => void;
  updateProfile: (patch: Partial<User>) => void;
  logout: () => void;
  setValidated: (v: boolean) => void;
  getToken: () => string | undefined;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isValidated: false,

      login: (user) => {
        if (user.token) {
          setAuthCookies(user.token, user.role || 'user');
        }
        set({ user, isValidated: true });
      },

      updateProfile: (patch) =>
        set((state) => {
          if (!state.user) return state;
          const updated = { ...state.user, ...patch };
          if (updated.token) {
            setAuthCookies(updated.token, updated.role || 'user');
          }
          return { user: updated };
        }),

      logout: () => {
        clearAuthCookies();
        set({ user: null, isValidated: false });
      },

      setValidated: (v) => set({ isValidated: v }),

      getToken: () => get().user?.token,
    }),
    { name: 'pw_user' },
  ),
);
