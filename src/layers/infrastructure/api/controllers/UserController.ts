// User Controller

import { Request, Response } from 'express';
import { IUserManagementUseCases } from '../../business/usecases/UserManagementUseCases';
import { HTTP_STATUS } from '../../shared/constants';

export class UserController {
  constructor(private userUseCases: IUserManagementUseCases) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userUseCases.getAllUsers();
      
      res.status(HTTP_STATUS.OK).json({
        data: users,
        message: 'Usuários recuperados com sucesso'
      });
    } catch (error: any) {
      res.status(error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: error.message
      });
    }
  };

  approve = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userUseCases.approveUserRegistration(id);
      
      res.status(HTTP_STATUS.OK).json({
        data: user,
        message: 'Usuário aprovado com sucesso'
      });
    } catch (error: any) {
      res.status(error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: error.message
      });
    }
  };

  promoteToAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userUseCases.promoteUserToAdmin(id);
      
      res.status(HTTP_STATUS.OK).json({
        data: user,
        message: 'Usuário promovido a administrador com sucesso'
      });
    } catch (error: any) {
      res.status(error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: error.message
      });
    }
  };

  suspend = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userUseCases.suspendUser(id);
      
      res.status(HTTP_STATUS.OK).json({
        data: user,
        message: 'Usuário suspenso com sucesso'
      });
    } catch (error: any) {
      res.status(error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: error.message
      });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.userUseCases.deleteUser(id);
      
      res.status(HTTP_STATUS.OK).json({
        message: 'Usuário deletado com sucesso'
      });
    } catch (error: any) {
      res.status(error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: error.message
      });
    }
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userUseCases.getUserProfile(id);
      
      res.status(HTTP_STATUS.OK).json({
        data: user,
        message: 'Perfil do usuário recuperado com sucesso'
      });
    } catch (error: any) {
      res.status(error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: error.message
      });
    }
  };
}
