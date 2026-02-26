'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  phone: string;
  name: string;
  role: 'farmer' | 'buyer';
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (phone: string, otp: string) => Promise<boolean>;
  register: (phone: string, name: string) => Promise<boolean>;
  logout: () => void;
  requestOTP: (phone: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('agrihub_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const requestOTP = async (phone: string): Promise<boolean> => {
    // TODO: Integrate with backend OTP service (Twilio)
    console.log('Requesting OTP for:', phone);
    // Mock success
    return true;
  };

  const login = async (phone: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // TODO: API call to verify OTP
      // Mock login for development
      const mockUser: User = {
        id: '1',
        phone,
        name: 'Petani Demo',
        role: 'farmer',
        isVerified: true,
      };
      
      setUser(mockUser);
      localStorage.setItem('agrihub_user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (phone: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // TODO: API call to register
      const mockUser: User = {
        id: '1',
        phone,
        name,
        role: 'farmer',
        isVerified: false,
      };
      
      setUser(mockUser);
      localStorage.setItem('agrihub_user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('agrihub_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, requestOTP }}>
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
