// User Management Use Cases

import { IUserService } from '../services/UserService';
import { User } from '../../shared/types';

export interface IUserManagementUseCases {
  getAllUsers(): Promise<User[]>;
  approveUserRegistration(userId: string): Promise<User>;
  promoteUserToAdmin(userId: string): Promise<User>;
  suspendUser(userId: string): Promise<User>;
  deleteUser(userId: string): Promise<void>;
  getUserProfile(userId: string): Promise<User>;
}

export class UserManagementUseCases implements IUserManagementUseCases {
  constructor(private userService: IUserService) {}

  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  async approveUserRegistration(userId: string): Promise<User> {
    return this.userService.approveUser(userId);
  }

  async promoteUserToAdmin(userId: string): Promise<User> {
    return this.userService.promoteToAdmin(userId);
  }

  async suspendUser(userId: string): Promise<User> {
    return this.userService.suspendUser(userId);
  }

  async deleteUser(userId: string): Promise<void> {
    return this.userService.deleteUser(userId);
  }

  async getUserProfile(userId: string): Promise<User> {
    return this.userService.getUserById(userId);
  }
}
