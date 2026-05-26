import { create } from 'zustand';

const useUIStore = create((set) => ({
  isMobileMenuOpen: false,
  isResumeModalOpen: false,
  activeSection: 'hero',
  isLoading: true,
  performanceTier: 'high', // 'low' | 'mid' | 'high'

  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  openResumeModal: () => set({ isResumeModalOpen: true }),
  closeResumeModal: () => set({ isResumeModalOpen: false }),

  setActiveSection: (section) => set({ activeSection: section }),
  setLoading: (loading) => set({ isLoading: loading }),
  setPerformanceTier: (tier) => set({ performanceTier: tier }),
}));

export default useUIStore;
