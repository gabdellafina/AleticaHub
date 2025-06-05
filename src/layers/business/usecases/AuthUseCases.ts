// Auth Use Cases - Casos de uso para autenticação

import { IAuthService } from '../services/AuthService';
import { LoginForm, RegisterForm, User } from '../../shared/types';

export interface IAuthUseCases {
  loginUser(credentials: LoginForm): Promise<{ user: User; token: string }>;
  registerUser(userData: RegisterForm): Promise<User>;
  verifyUserAccess(token: string): Promise<User>;
  verifyAdminAccess(token: string): Promise<User>;
}

export class AuthUseCases implements IAuthUseCases {
  constructor(private authService: IAuthService) {}

  async loginUser(credentials: LoginForm): Promise<{ user: User; token: string }> {
    return this.authService.login(credentials);
  }

  async registerUser(userData: RegisterForm): Promise<User> {
    return this.authService.register(userData);
  }

  async verifyUserAccess(token: string): Promise<User> {
    const user = await this.authService.verifyToken(token);
    // Adicionar validações específicas de acesso de usuário se necessário
    return user;
  }

  async verifyAdminAccess(token: string): Promise<User> {
    const user = await this.authService.verifyToken(token);
    
    if (user.role !== 'admin') {
      throw new Error('Acesso negado: privilégios de administrador necessários');
    }
    
    return user;
  }
}
