import { create } from "zustand";

interface GlobalDragHookStore {
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
}

export const useGlobalDragHook = create<GlobalDragHookStore>((set) => ({
  isDragging: false,
  setIsDragging: (isDragging) => set({ isDragging }),
}));
