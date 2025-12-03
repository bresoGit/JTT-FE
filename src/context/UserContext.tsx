// src/context/UserContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { AppUser } from "../types/user";

interface LoginPayload {
  user: AppUser;
  token: string; // raw JWT, no "Bearer " inside
}

interface UserContextValue {
  user: AppUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // ✅ Synchronous init from localStorage
  const [user, setUser] = useState<AppUser | null>(() => {
    try {
      const storedUser = localStorage.getItem("jtt_user");
      if (!storedUser) return null;
      return JSON.parse(storedUser) as AppUser;
    } catch {
      localStorage.removeItem("jtt_user");
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("jtt_token");
  });

  const login = ({ user, token }: LoginPayload) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("jtt_token", token);
    localStorage.setItem("jtt_user", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("jtt_token");
    localStorage.removeItem("jtt_user");
  };

  return (
    <UserContext.Provider
      value={{ user, token, isAuthenticated: !!user && !!token, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextValue => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return ctx;
};
