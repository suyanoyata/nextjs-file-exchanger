import { create } from "zustand";

interface UploadsState {
  isUploadsActionsDisabled: boolean;
  setIsUploadsActionsDisabled: (isUploadsActionsDisabled: boolean) => void;
}

export const useUploadsState = create<UploadsState>((set) => ({
  isUploadsActionsDisabled: false,
  setIsUploadsActionsDisabled: (isUploadsActionsDisabled) =>
    set({ isUploadsActionsDisabled }),
}));
