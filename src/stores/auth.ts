import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

export type UserRole = "ROLE_ADMIN" | "ROLE_USER" | "";

interface AuthStore {
  isLoggedIn: boolean;
  role: UserRole;
  hydrated: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  setRole: (role: UserRole) => void;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setHydrated: (hydrated: boolean) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  role: "",
  hydrated: false,
  setLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
  setRole: (role) => set({ role }),
  login: (accessToken, refreshToken) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
    const { role } = jwtDecode<{ role: UserRole }>(accessToken);
    set({ isLoggedIn: true, role })
    },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
    set({ isLoggedIn: false, role: "" });
  },
  setHydrated: (hydrated) => set({ hydrated }),
}));

export default useAuthStore;