import { create } from "zustand";

interface LoadingState {
  loading: boolean;
  setLoading: (state: boolean) => void;
  showLoading: () => void;
  hideLoading: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  loading: true,
  setLoading: (state) => set({ loading: state }),
  showLoading: () => set({ loading: true }),
  hideLoading: () => set({ loading: false }),
}));
