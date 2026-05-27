import { create } from "zustand";
import { persist } from "zustand/middleware";

type UiState = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  syncDarkModeClass: () => void;
};

export const useUi = create<UiState>()(
  persist(
    (set, get) => ({
      darkMode: false,
      toggleDarkMode: () => {
        set({ darkMode: !get().darkMode });
        get().syncDarkModeClass();
      },
      syncDarkModeClass: () => {
        const on = get().darkMode;
        document.documentElement.classList.toggle("dark", on);
      },
    }),
    { name: "ecom-ui" },
  ),
);

