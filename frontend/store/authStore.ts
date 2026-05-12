import { create } from 'zustand';
import { User, UserRole } from '../types/entities';

interface AuthStore {
  // State
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
  
  // Hydration
  hydrate: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial State
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,

  // Setters
  setUser: (user) => set({ user }),
  
  setToken: (token) => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
    set({ token });
  },
  
  setRefreshToken: (refreshToken) => {
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    } else {
      localStorage.removeItem('refreshToken');
    }
    set({ refreshToken });
  },
  
  setIsLoading: (isLoading) => set({ isLoading }),

  // Actions
  login: (user, token, refreshToken) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    set({
      user,
      token,
      refreshToken,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  updateUser: (updatedUser) => {
    const { user } = get();
    if (user) {
      const newUser = { ...user, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(newUser));
      set({ user: newUser });
    }
  },

  hasPermission: (permission: string) => {
    const { user } = get();
    if (!user) return false;
    
    // Check if user has admin role (admin has all permissions)
    if (user.role === 'ADMIN') return true;

    // Check permissions in roles
    if (user.roles) {
      return user.roles.some((role) =>
        role.permissions.includes(permission)
      );
    }

    return false;
  },

  hasRole: (role: UserRole) => {
    const { user } = get();
    return user?.role === role;
  },

  // Hydration from localStorage
  hydrate: () => {
    const token = localStorage.getItem('authToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error('Failed to hydrate auth store:', error);
      }
    }
  },
}));
