import React, { useState, useEffect } from "react";

import type { User } from "../../types/types";

// Mock Supabase-like storage (replace with actual Supabase later)
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    const newUser = { id: Date.now().toString(), email, name };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const signIn = async (email: string, password: string) => {
    // In real app, verify credentials
    const stored = localStorage.getItem("users");
    const users = stored ? JSON.parse(stored) : [];
    const found = users.find((u: User) => u.email === email);

    if (found) {
      localStorage.setItem("user", JSON.stringify(found));
      setUser(found);
      return found;
    }

    // For demo, create user if not found
    const newUser = {
      id: Date.now().toString(),
      email,
      name: email.split("@")[0],
    };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const signOut = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return { user, loading, signUp, signIn, signOut };
};

export { useAuth };
