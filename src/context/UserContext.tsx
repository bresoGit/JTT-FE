// src/context/UserContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import type { AppUser } from "../types/user";

interface UserContextValue {
  user: AppUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: { user: AppUser; token: string }) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // init from localStorage (ako postoji)
  useEffect(() => {
    const storedToken = localStorage.getItem("jtt_token");
    const storedUser = localStorage.getItem("jtt_user");

    if (storedToken && storedUser) {
      try {
        const parsedUser: AppUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
      } catch {
        // ako je nešto korumpirano, očisti
        localStorage.removeItem("jtt_token");
        localStorage.removeItem("jtt_user");
      }
    }
  }, []);

  const login = (payload: { user: AppUser; token: string }) => {
    setUser(payload.user);
    setToken(payload.token);
    localStorage.setItem("jtt_token", payload.token);
    localStorage.setItem("jtt_user", JSON.stringify(payload.user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("jtt_token");
    localStorage.removeItem("jtt_user");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        login,
        logout,
      }}
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
