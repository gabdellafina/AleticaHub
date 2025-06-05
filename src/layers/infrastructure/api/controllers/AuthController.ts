// Auth Controller - Controlador da camada de infraestrutura

import { Request, Response } from 'express';
import { IAuthUseCases } from '../../business/usecases/AuthUseCases';
import { HTTP_STATUS } from '../../shared/constants';
import { handleApiResponse } from '../../shared/utils';

export class AuthController {
  constructor(private authUseCases: IAuthUseCases) {}

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, senha } = req.body;
      const result = await this.authUseCases.loginUser({ email, senha });
      
      res.status(HTTP_STATUS.OK).json({
        data: result,
        message: 'Login realizado com sucesso'
      });
    } catch (error: any) {
      res.status(error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: error.message
      });
    }
  };

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData = req.body;
      const user = await this.authUseCases.registerUser(userData);
      
      res.status(HTTP_STATUS.CREATED).json({
        data: user,
        message: 'Usuário registrado com sucesso'
      });
    } catch (error: any) {
      res.status(error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: error.message
      });
    }
  };

  verifyUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          error: 'Token não fornecido'
        });
        return;
      }

      await this.authUseCases.verifyUserAccess(token);
      
      res.status(HTTP_STATUS.OK).json({
        access: 'granted'
      });
    } catch (error: any) {
      res.status(error.status || HTTP_STATUS.FORBIDDEN).json({
        error: error.message
      });
    }
  };

  verifyAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          error: 'Token não fornecido'
        });
        return;
      }

      await this.authUseCases.verifyAdminAccess(token);
      
      res.status(HTTP_STATUS.OK).json({
        access: 'granted'
      });
    } catch (error: any) {
      res.status(error.status || HTTP_STATUS.FORBIDDEN).json({
        error: error.message
      });
    }
  };
}
