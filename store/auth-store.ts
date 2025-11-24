import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string;
  createdAt: Date;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

// Mock user for demo
const mockUser: User = {
  id: 'usr-001',
  name: 'Alex Davis',
  email: 'alex.davis@sentinelgrc.com',
  role: 'Compliance Manager',
  department: 'Security & Compliance',
  createdAt: new Date(),
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: mockUser, // Start logged in for demo purposes
      isAuthenticated: true,
      
      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock validation - accept any email/password for demo
        const user: User = {
          id: 'usr-' + Math.random().toString(36).substr(2, 9),
          name: email.split('@')[0].replace('.', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          email,
          role: 'Compliance Manager',
          department: 'Security & Compliance',
          createdAt: new Date(),
        };
        
        set({ user, isAuthenticated: true });
        return true;
      },
      
      signup: async (name: string, email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        const user: User = {
          id: 'usr-' + Math.random().toString(36).substr(2, 9),
          name,
          email,
          role: 'Compliance Manager',
          department: 'Security & Compliance',
          createdAt: new Date(),
        };
        
        set({ user, isAuthenticated: true });
        return true;
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      updateProfile: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },
    }),
    {
      name: 'sentinel-auth-storage',
    }
  )
);


