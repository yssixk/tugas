import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, setAuthToken } from "../lib/api";

export type Role = "user" | "admin";

export type AuthUser = {
  id: string;
  full_name: string;
  username: string;
  email: string;
  role: Role;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  setSession: (token: string, user: AuthUser) => void;
  clear: () => void;
  hydrateAuthHeader: () => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setSession: (token, user) => {
        setAuthToken(token);
        set({ token, user });
      },
      clear: () => {
        setAuthToken(null);
        set({ token: null, user: null });
      },
      hydrateAuthHeader: () => {
        const token = get().token;
        setAuthToken(token);
      },
    }),
    { name: "ecom-auth" },
  ),
);

export async function fetchMe() {
  const { data } = await api.get("/me");
  return data.me as any;
}

