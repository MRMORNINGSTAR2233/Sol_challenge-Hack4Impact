"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/api-client';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
  institution: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: 'teacher' | 'student') => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'teacher' | 'student';
  institution: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await auth.getMe();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, role: 'teacher' | 'student') => {
    try {
      const data = await auth.login({ email, password, role });
      
      // Ensure token is saved to localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return;
      }
      
      throw new Error('No authentication token received');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await auth.register(data);
      
      // Ensure token is saved to localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        return;
      }
      
      throw new Error('No authentication token received');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    try {
      auth.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Always clear local state regardless of API logout success
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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