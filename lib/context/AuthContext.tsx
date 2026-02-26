'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
  logout: () => Promise<void>;
  supabase: SupabaseClient;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Get user profile from database
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUser({
            id: session.user.id,
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
          });
        }
      }
      
      setIsLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            setUser({
              id: session.user.id,
              name: profile.name,
              email: profile.email,
              phone: profile.phone,
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error || !data.user) {
        console.error('Error login:', error);
        return false;
      }
      
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profile) {
        setUser({
          id: data.user.id,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    phone: string,
    role: 'buyer' | 'farmer' = 'buyer',
    village?: string,
    city?: string
  ): Promise<boolean> => {
    try {
      // Use Edge Function to create user (bypasses email confirmation)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/smooth-worker`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password, phone, role, village, city }),
        }
      );
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error('Edge Function error:', result);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        supabase,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}