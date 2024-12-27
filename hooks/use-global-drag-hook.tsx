import { create } from "zustand";

interface GlobalDragHookStore {
  isShiftDown: boolean;
  setShiftDown: (isShiftDown: boolean) => void;
  isAlertOpen: boolean;
  setIsAlertOpen: (isAlertOpen: boolean) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
}

export const useGlobalDragHook = create<GlobalDragHookStore>((set) => ({
  isShiftDown: false,
  setShiftDown: (isShiftDown) => set({ isShiftDown }),
  isAlertOpen: false,
  setIsAlertOpen: (isAlertOpen) => set({ isAlertOpen }),
  isDragging: false,
  setIsDragging: (isDragging) => set({ isDragging }),
}));
