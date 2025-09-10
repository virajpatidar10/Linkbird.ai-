import { create } from 'zustand';

interface AppState {
  sidebarCollapsed: boolean;
  selectedLeadId: string | null;
  leadSheetOpen: boolean;
  currentPage: 'dashboard' | 'leads' | 'campaigns' | 'settings';
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openLeadSheet: (leadId: string) => void;
  closeLeadSheet: () => void;
  setCurrentPage: (page: 'dashboard' | 'leads' | 'campaigns' | 'settings') => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  selectedLeadId: null,
  leadSheetOpen: false,
  currentPage: 'leads',
  
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  
  openLeadSheet: (leadId) => set({ selectedLeadId: leadId, leadSheetOpen: true }),
  closeLeadSheet: () => set({ selectedLeadId: null, leadSheetOpen: false }),
  
  setCurrentPage: (page) => set({ currentPage: page }),
}));