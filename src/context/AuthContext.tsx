// filepath: c:\Users\julio\Downloads\AtleticaHub-FrontEnd\AleticaHub\src\context\AuthContext.tsx
// Auth Context - Gerenciamento global do estado de autenticação

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi, AuthResponse, User } from '../services/api/authApi';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  checkRole: (role: 'user' | 'admin' | 'moderator') => boolean;
}

interface RegisterData {
  nome: string;
  email: string;
  password: string;
  telefone: string;
  dataNascimento: string;
  curso: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on app start
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authApi.isAuthenticated()) {
          const userProfile = await authApi.getProfile();
          setUser(userProfile);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        // If verification fails, remove invalid token
        authApi.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);

      // Login diretamente com a API de backend
      const response: AuthResponse = await authApi.login(email, password);
      setUser(response.user);

      // Store token in local storage for persistent sessions
      localStorage.setItem('authToken', response.token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const register = async (userData: RegisterData): Promise<void> => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await authApi.register(userData);
      setUser(response.user);

      // Store token in local storage for persistent sessions
      localStorage.setItem('authToken', response.token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authApi.logout();
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Even if API call fails, clear local state
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    try {
      const updatedUser = await authApi.updateProfile(userData);
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  const checkRole = (requiredRole: 'user' | 'admin' | 'moderator'): boolean => {
    if (!user) return false;

    if (requiredRole === 'user') {
      return ['user', 'admin', 'moderator'].includes(user.role);
    }

    if (requiredRole === 'moderator') {
      return ['moderator', 'admin'].includes(user.role);
    }

    if (requiredRole === 'admin') {
      return user.role === 'admin';
    }

    return false;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    checkRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
