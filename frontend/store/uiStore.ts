import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface UIStore {
  // Sidebar State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Theme State
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // Search State
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Notification Center
  isNotificationCenterOpen: boolean;
  setIsNotificationCenterOpen: (open: boolean) => void;

  // AI Chat Panel
  isAIChatOpen: boolean;
  setIsAIChatOpen: (open: boolean) => void;
  toggleAIChat: () => void;

  // Modal State
  modalOpen: Record<string, boolean>;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  toggleModal: (modalId: string) => void;

  // Drawer/Sheet State
  drawerOpen: Record<string, boolean>;
  openDrawer: (drawerId: string) => void;
  closeDrawer: (drawerId: string) => void;
  toggleDrawer: (drawerId: string) => void;

  // Loading State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Hydration
  hydrate: () => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  // Sidebar State
  sidebarOpen: true,
  setSidebarOpen: (open) => {
    localStorage.setItem('sidebarOpen', String(open));
    set({ sidebarOpen: open });
  },
  toggleSidebar: () => {
    const newState = !get().sidebarOpen;
    localStorage.setItem('sidebarOpen', String(newState));
    set({ sidebarOpen: newState });
  },

  // Theme State
  theme: 'dark',
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },

  // Search State
  isSearchOpen: false,
  setIsSearchOpen: (open) => set({ isSearchOpen: open }),

  // Notification Center
  isNotificationCenterOpen: false,
  setIsNotificationCenterOpen: (open) => set({ isNotificationCenterOpen: open }),

  // AI Chat Panel
  isAIChatOpen: false,
  setIsAIChatOpen: (open) => set({ isAIChatOpen: open }),
  toggleAIChat: () => {
    set((state) => ({ isAIChatOpen: !state.isAIChatOpen }));
  },

  // Modal State
  modalOpen: {},
  openModal: (modalId) => {
    set((state) => ({
      modalOpen: { ...state.modalOpen, [modalId]: true },
    }));
  },
  closeModal: (modalId) => {
    set((state) => ({
      modalOpen: { ...state.modalOpen, [modalId]: false },
    }));
  },
  toggleModal: (modalId) => {
    set((state) => ({
      modalOpen: {
        ...state.modalOpen,
        [modalId]: !state.modalOpen[modalId],
      },
    }));
  },

  // Drawer State
  drawerOpen: {},
  openDrawer: (drawerId) => {
    set((state) => ({
      drawerOpen: { ...state.drawerOpen, [drawerId]: true },
    }));
  },
  closeDrawer: (drawerId) => {
    set((state) => ({
      drawerOpen: { ...state.drawerOpen, [drawerId]: false },
    }));
  },
  toggleDrawer: (drawerId) => {
    set((state) => ({
      drawerOpen: {
        ...state.drawerOpen,
        [drawerId]: !state.drawerOpen[drawerId],
      },
    }));
  },

  // Loading State
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  // Hydration from localStorage
  hydrate: () => {
    const sidebarOpen = localStorage.getItem('sidebarOpen') !== 'false';
    const theme = (localStorage.getItem('theme') || 'dark') as Theme;

    // Apply theme on hydration
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    set({
      sidebarOpen,
      theme,
    });
  },
}));
