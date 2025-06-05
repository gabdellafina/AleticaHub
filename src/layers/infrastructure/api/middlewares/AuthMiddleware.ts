// Auth Middleware - Middleware de autenticação

import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../../../shared/constants';
import { IAuthService } from '../../../business/services/AuthService';
import { UserRole } from '../../../shared/types';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    uid: string;
    role: UserRole;
    email?: string;
  };
}

export class AuthMiddleware {
  constructor(private authService: IAuthService) {}

  authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: 'Token ausente ou inválido'
        });
        return;
      }

      const token = authHeader.split(' ')[1];
      const user = await this.authService.verifyToken(token);

      req.user = {
        id: user.id,
        uid: user.uid,
        role: user.role,
        email: user.email
      };

      next();
    } catch (err) {
      console.error('Erro na autenticação:', err);
      res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Token inválido'
      });
    }
  };

  checkRole = (requiredRole: UserRole) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: 'Usuário não autenticado'
        });
        return;
      }

      // Admin has access to everything
      if (req.user.role === 'admin') {
        next();
        return;
      }

      // Check specific role requirements
      if (req.user.role !== requiredRole) {
        res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: 'Acesso negado: privilégios insuficientes'
        });
        return;
      }

      next();
    };
  };

  requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Usuário não autenticado'
      });
      return;
    }

    if (req.user.role !== 'admin') {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Acesso negado: privilégios de administrador necessários'
      });
      return;
    }

    next();
  };

  requireModerator = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Usuário não autenticado'
      });
      return;
    }

    // Admin and moderator have access
    if (req.user.role !== 'admin' && req.user.role !== 'moderador') {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Acesso negado: privilégios de moderador necessários'
      });
      return;
    }

    next();
  };

  requireUser = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Usuário não autenticado'
      });
      return;
    }

    // All authenticated users have access
    next();
  };

  // Legacy methods for backward compatibility
  verifyToken = this.authenticate;
  checkAdminRole = this.requireAdmin;
}
