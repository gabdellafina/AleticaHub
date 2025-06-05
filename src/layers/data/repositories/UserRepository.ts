// User Repository Implementation

import { IUserRepository } from './interfaces';
import { IUserDataSource } from '../datasources/interfaces';
import { User } from '../../shared/types';
import { USER_STATUS, ROLES } from '../../shared/constants';

export class UserRepository implements IUserRepository {
  constructor(private dataSource: IUserDataSource) {}

  async getById(id: string): Promise<User | null> {
    return this.dataSource.findById(id);
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.dataSource.findByEmail(email);
  }

  async getAll(): Promise<User[]> {
    return this.dataSource.findAll();
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const userData = {
      ...user,
      role: user.role || ROLES.USER,
      status: user.status || USER_STATUS.PENDENTE
    };
    return this.dataSource.create(userData);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return this.dataSource.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.dataSource.delete(id);
  }

  async promoteToAdmin(id: string): Promise<User> {
    return this.dataSource.updateRole(id, ROLES.ADMIN);
  }

  async approve(id: string): Promise<User> {
    return this.dataSource.updateStatus(id, USER_STATUS.ATIVO);
  }

  async suspend(id: string): Promise<User> {
    return this.dataSource.updateStatus(id, USER_STATUS.SUSPENSO);
  }
}
