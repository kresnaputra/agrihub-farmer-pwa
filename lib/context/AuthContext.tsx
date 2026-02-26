'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';

interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (phone: string, otp: string) => Promise<boolean>;
  register: (name: string, phone: string, otp: string) => Promise<boolean>;
  sendOTP: (phone: string) => Promise<boolean>;
  requestOTP: (phone: string) => Promise<boolean>;
  logout: () => Promise<void>;
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
            phone: profile.phone,
            email: profile.email,
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
              phone: profile.phone,
              email: profile.email,
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const sendOTP = async (phone: string): Promise<boolean> => {
    try {
      // Call Edge Function to send WhatsApp OTP
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-whatsapp-otp`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone }),
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

  const verifyOTP = async (phone: string, otp: string): Promise<{ success: boolean; userId?: string }> => {
    try {
      // Check OTP in database
      const { data, error } = await supabase
        .from('otp_codes')
        .select('*')
        .eq('phone', phone)
        .eq('otp', otp)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .single();
      
      if (error || !data) {
        console.error('Invalid or expired OTP:', error);
        return { success: false };
      }
      
      // Mark OTP as used
      await supabase
        .from('otp_codes')
        .update({ used: true })
        .eq('id', data.id);
      
      return { success: true };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return { success: false };
    }
  };

  const login = async (phone: string, otp: string): Promise<boolean> => {
    try {
      // Verify OTP from Edge Function
      const { success } = await verifyOTP(phone, otp);
      
      if (!success) {
        console.error('Invalid OTP');
        return false;
      }
      
      // Check if user exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', phone)
        .single();
      
      if (profile) {
        setUser({
          id: profile.id,
          name: profile.name,
          phone: profile.phone,
          email: profile.email,
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  const register = async (name: string, phone: string, otp: string): Promise<boolean> => {
    try {
      // First verify OTP
      const { success } = await verifyOTP(phone, otp);
      
      if (!success) {
        console.error('Invalid OTP');
        return false;
      }
      
      // Generate user ID
      const userId = crypto.randomUUID();
      
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            name,
            phone,
            email: `${phone}@agrihub.id`,
          },
        ]);
      
      if (profileError) {
        console.error('Error creating profile:', profileError);
        return false;
      }
      
      setUser({
        id: userId,
        name,
        phone,
        email: `${phone}@agrihub.id`,
      });
      
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
        sendOTP,
        requestOTP: sendOTP, // Alias for backward compatibility
        logout,
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