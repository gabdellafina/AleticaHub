// Auth Hook - Hook para gerenciar autenticação

import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { User } from '../../shared/types';
import { API_ENDPOINTS } from '../../shared/constants';
import { handleApiResponse, storage } from '../../shared/utils';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getUserRole: () => Promise<'user' | 'admin' | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = storage.get<string>('authToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(API_ENDPOINTS.VERIFY_USER, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await handleApiResponse<User>(response);
        setUser(userData);
      } else {
        storage.remove('authToken');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      storage.remove('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha: password })
      });

      const data = await handleApiResponse<{ user: User; token: string }>(response);
      
      storage.set('authToken', data.token);
      setUser(data.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    storage.remove('authToken');
    setUser(null);
  };

  const getUserRole = async (): Promise<'user' | 'admin' | null> => {
    if (!user) return null;
    return user.role;
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    getUserRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
