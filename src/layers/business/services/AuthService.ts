// Auth Service - Lógica de negócio para autenticação

import { IUserRepository } from '../../data/repositories/interfaces';
import { User, LoginForm, RegisterForm } from '../../shared/types';
import { isValidEmail, createApiError } from '../../shared/utils';
import { HTTP_STATUS, ROLES, USER_STATUS } from '../../shared/constants';

export interface IAuthService {
  login(credentials: LoginForm): Promise<{ user: User; token: string }>;
  register(userData: RegisterForm): Promise<User>;
  verifyToken(token: string): Promise<User>;
  getUserRole(userId: string): Promise<'user' | 'admin'>;
}

export class AuthService implements IAuthService {
  constructor(
    private userRepository: IUserRepository,
    private firebaseAuth: any // Firebase Auth instance
  ) {}

  async login(credentials: LoginForm): Promise<{ user: User; token: string }> {
    const { email, senha } = credentials;

    if (!isValidEmail(email)) {
      throw createApiError('Email inválido', HTTP_STATUS.BAD_REQUEST);
    }

    try {
      // Autenticação com Firebase
      const userCredential = await this.firebaseAuth.signInWithEmailAndPassword(email, senha);
      const token = await userCredential.user.getIdToken();

      // Buscar dados do usuário no banco
      const user = await this.userRepository.getById(userCredential.user.uid);
      if (!user) {
        throw createApiError('Usuário não encontrado', HTTP_STATUS.NOT_FOUND);
      }

      if (user.status !== USER_STATUS.ATIVO) {
        throw createApiError('Usuário não aprovado', HTTP_STATUS.FORBIDDEN);
      }

      return { user, token };
    } catch (error: any) {
      if (error.status) {
        throw error;
      }
      throw createApiError('Credenciais inválidas', HTTP_STATUS.UNAUTHORIZED);
    }
  }

  async register(userData: RegisterForm): Promise<User> {
    const { email, senha, nome, telefone, dataNascimento, curso } = userData;

    if (!isValidEmail(email)) {
      throw createApiError('Email inválido', HTTP_STATUS.BAD_REQUEST);
    }

    if (senha.length < 6) {
      throw createApiError('Senha deve ter pelo menos 6 caracteres', HTTP_STATUS.BAD_REQUEST);
    }

    try {
      // Criar usuário no Firebase
      const userCredential = await this.firebaseAuth.createUserWithEmailAndPassword(email, senha);

      // Criar usuário no banco de dados
      const user = await this.userRepository.create({
        uid: userCredential.user.uid,
        nome,
        email,
        telefone,
        dataNascimento,
        curso,
        role: ROLES.USER,
        status: USER_STATUS.PENDENTE
      });

      return user;
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw createApiError('Email já está em uso', HTTP_STATUS.BAD_REQUEST);
      }
      throw createApiError('Erro ao criar usuário', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyToken(token: string): Promise<User> {
    try {
      const decodedToken = await this.firebaseAuth.verifyIdToken(token);
      const user = await this.userRepository.getById(decodedToken.uid);
      
      if (!user) {
        throw createApiError('Usuário não encontrado', HTTP_STATUS.NOT_FOUND);
      }

      return user;
    } catch (error: any) {
      throw createApiError('Token inválido', HTTP_STATUS.UNAUTHORIZED);
    }
  }

  async getUserRole(userId: string): Promise<'user' | 'admin'> {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw createApiError('Usuário não encontrado', HTTP_STATUS.NOT_FOUND);
    }
    return user.role;
  }
}
