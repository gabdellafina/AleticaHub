// User Service - Lógica de negócio para usuários

import { IUserRepository } from '../../data/repositories/interfaces';
import { User } from '../../shared/types';
import { createApiError } from '../../shared/utils';
import { HTTP_STATUS, ROLES, USER_STATUS } from '../../shared/constants';

export interface IUserService {
  getAllUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User>;
  approveUser(id: string): Promise<User>;
  promoteToAdmin(id: string): Promise<User>;
  suspendUser(id: string): Promise<User>;
  deleteUser(id: string): Promise<void>;
}

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.getAll();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw createApiError('Usuário não encontrado', HTTP_STATUS.NOT_FOUND);
    }
    return user;
  }

  async approveUser(id: string): Promise<User> {
    const user = await this.getUserById(id);
    
    if (user.status === USER_STATUS.ATIVO) {
      throw createApiError('Usuário já está ativo', HTTP_STATUS.BAD_REQUEST);
    }

    return this.userRepository.approve(id);
  }

  async promoteToAdmin(id: string): Promise<User> {
    const user = await this.getUserById(id);
    
    if (user.role === ROLES.ADMIN) {
      throw createApiError('Usuário já é administrador', HTTP_STATUS.BAD_REQUEST);
    }

    if (user.status !== USER_STATUS.ATIVO) {
      throw createApiError('Usuário deve estar ativo para ser promovido', HTTP_STATUS.BAD_REQUEST);
    }

    return this.userRepository.promoteToAdmin(id);
  }

  async suspendUser(id: string): Promise<User> {
    const user = await this.getUserById(id);
    
    if (user.status === USER_STATUS.SUSPENSO) {
      throw createApiError('Usuário já está suspenso', HTTP_STATUS.BAD_REQUEST);
    }

    return this.userRepository.suspend(id);
  }

  async deleteUser(id: string): Promise<void> {
    await this.getUserById(id); // Verifica se existe
    return this.userRepository.delete(id);
  }
}
