import React, { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { User as AppUser } from "../types/types";
import { signOut as signOutService } from "../services/auth";

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Helper to convert Supabase user to App User
const mapSupabaseUserToAppUser = (supabaseUser: User | null): AppUser | null => {
  if (!supabaseUser) return null;
  
  // Get name from user_metadata or use email prefix as fallback
  const name = supabaseUser.user_metadata?.name || 
               supabaseUser.user_metadata?.full_name ||
               supabaseUser.email?.split("@")[0] || 
               "User";
  
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || "",
    name: name,
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial session
    supabase.auth.getUser().then(({ data }) => {
      setUser(mapSupabaseUserToAppUser(data.user));
      setLoading(false);
    });

    // Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(mapSupabaseUserToAppUser(session?.user ?? null));
        setLoading(false);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    setLoading(true);
    await signOutService();
    // The onAuthStateChange listener will update the user state
    // But we set it here immediately for immediate UI feedback
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
