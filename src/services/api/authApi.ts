// filepath: c:\Users\julio\Downloads\AtleticaHub-FrontEnd\AleticaHub\src\services\api\authApi.ts
// Auth API Service - Comunicação com backend para autenticação

import { httpClient } from './httpClient';

// Types for API requests/responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  password: string;
  telefone: string;
  dataNascimento: string;
  curso: string;
  codigo?: string; // Campo opcional para acesso administrativo
}

export interface AuthResponse {
  user: {
    id: string;
    nome: string;
    email: string;
    role: 'user' | 'admin' | 'moderator';
    status: 'ativo' | 'pendente' | 'suspenso';
    telefone?: string;
    dataNascimento?: string;
    curso?: string;
  };
  token: string;
  refreshToken?: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  status: 'ativo' | 'pendente' | 'suspenso';
  telefone?: string;
  dataNascimento?: string;
  curso?: string;
}

class AuthApiService {  // Login user
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>('/auth/login', { email, password });
      
      // Store token for subsequent requests
      httpClient.setAuthToken(response.token);
      
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Erro ao fazer login');
    }
  }

  // Register new user
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>('/auth/register', userData);
      
      // Store token for subsequent requests
      httpClient.setAuthToken(response.token);
      
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Erro ao registrar usuário');
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await httpClient.post('/auth/logout');
    } catch (error) {
      // Even if API call fails, we should remove local token
      console.warn('Erro ao fazer logout no servidor:', error);
    } finally {
      httpClient.removeAuthToken();
    }
  }

  // Get current user profile
  async getProfile(): Promise<User> {
    try {
      return await httpClient.get<User>('/auth/me');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Erro ao buscar perfil do usuário');
    }
  }

  // Refresh authentication token
  async refreshToken(): Promise<{ token: string }> {
    try {
      const response = await httpClient.post<{ token: string }>('/auth/refresh');
      httpClient.setAuthToken(response.token);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Erro ao renovar token');
    }
  }  // Verify if user is authenticated
  async verifyToken(): Promise<boolean> {
    try {
      await this.getProfile();
      return true;
    } catch {
      httpClient.removeAuthToken();
      return false;
    }
  }

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      return await httpClient.put<User>('/auth/profile', userData);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Erro ao atualizar perfil');
    }
  }

  // Change password
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      await httpClient.put('/auth/password', { oldPassword, newPassword });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Erro ao alterar senha');
    }
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await httpClient.post('/auth/forgot-password', { email });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Erro ao solicitar reset de senha');
    }
  }

  // Reset password with token
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await httpClient.post('/auth/reset-password', { token, newPassword });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Erro ao resetar senha');
    }
  }  // Check if user has specific role
  async checkRole(requiredRole: 'user' | 'admin' | 'moderator'): Promise<boolean> {
    try {
      const user = await this.getProfile();
      return user.role === requiredRole || (requiredRole === 'user' && ['admin', 'moderator'].includes(user.role));
    } catch {
      return false;
    }
  }

  // Get current authentication token
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  }

  // Check if user is authenticated (token exists)
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('authToken');
  }
}

// Export singleton instance
export const authApi = new AuthApiService();
export default authApi;
