import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock successful login
        const user: User = {
          id: '1',
          email,
          name: email.split('@')[0],
          avatar: `https://api.dicebear.com/6.x/initials/svg?seed=${email}`
        };
        
        set({ user, isAuthenticated: true });
        return true;
      },
      
      loginWithGoogle: async () => {
        // Simulate Google OAuth
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user: User = {
          id: '1',
          email: 'demo@linkbird.ai',
          name: 'Demo User',
          avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=DemoUser'
        };
        
        set({ user, isAuthenticated: true });
        return true;
      },
      
      register: async (email: string, password: string, name: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user: User = {
          id: '1',
          email,
          name,
          avatar: `https://api.dicebear.com/6.x/initials/svg?seed=${name}`
        };
        
        set({ user, isAuthenticated: true });
        return true;
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: 'linkbird-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
);