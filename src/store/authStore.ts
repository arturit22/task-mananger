import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const DEMO_USER = [
  { id: '1', email: 'user@test.com', password: '123456', name: 'test user' },
  { id: '2', email: 'user2@test.com', password: '123456', name: 'test 2user' },
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });

        try {
          await new Promise((resolve) => setTimeout(resolve, 500));

          const user = DEMO_USER.find((u) => u.email === email && u.password === password);

          if (!user) {
            throw new Error('Неверный email или пароль');
          }

          const fakeToken = btoa(
            JSON.stringify({
              userId: user.id,
              email: user.email,
              exp: Date.now() + 3600000,
            })
          );

          set({
            user: { id: user.id, email: user.email, name: user.name },
            token: fakeToken,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },

      register: async (email: string) => {
        set({ isLoading: true });

        try {
          await new Promise((resolve) => setTimeout(resolve, 500));

          const existingUser = DEMO_USER.find((u) => u.email === email);
          if (existingUser) {
            throw new Error('Пользователь с таким email уже существует');
          }

          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
