import { create } from "zustand"
import { jwtDecode } from "jwt-decode"

export type UserRole = "ROLE_ADMIN" | "ROLE_USER" | ""

interface AuthStore {
  isLoggedIn: boolean;
  role: UserRole;
  userId: number | null;
  hydrated: boolean;
  fcmToken: string | null;
  setLoggedIn: (loggedIn: boolean) => void;
  setRole: (role: UserRole) => void;
  setUserId: (userId: number | null) => void;
  setFcmToken: (fcmToken: string | null) => void;
  login: (accessToken: string, userId: number) => void;
  logout: () => void;
  setHydrated: (hydrated: boolean) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  role: "",
  userId: null,
  hydrated: false,
  fcmToken: null,
  setLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
  setRole: (role) => set({ role }),
  setUserId: (userId) => set({ userId }),
  setFcmToken: (fcmToken) => set({ fcmToken }),
  login: (accessToken, userId) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userId", userId.toString());
    }
    const { role } = jwtDecode<{ role: UserRole }>(accessToken);
    set({ isLoggedIn: true, role, userId })
    },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("userId")
    }
    set({ isLoggedIn: false, role: "", userId: null, fcmToken: null })
  },
  setHydrated: (hydrated) => set({ hydrated }),
}))

export default useAuthStore
