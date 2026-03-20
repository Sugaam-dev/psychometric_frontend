import { createContext, useContext, useState, useEffect } from "react";

export type User = {
  id: number;
  name: string;
  role: string;
  session_id?: number;
};

type UserContextType = {
  user: User | null;
  setUser: (user: Partial<User>) => void;
  clearUser: () => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUserState(JSON.parse(stored));
    }
  }, []);

 const setUser = (partialUser: Partial<User>) => {
  setUserState(prev => {

    if (!prev && !partialUser.id) {
      return prev;
    }

    const merged: User = {
      id: partialUser.id ?? prev?.id ?? 0,
      name: partialUser.name ?? prev?.name ?? "",
      role: partialUser.role ?? prev?.role ?? "",
      session_id: partialUser.session_id ?? prev?.session_id
    };

    localStorage.setItem("user", JSON.stringify(merged));
    return merged;
  });
};

  const clearUser = () => {
    localStorage.removeItem("user");
    setUserState(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within UserProvider");
  }
  return ctx;
}
