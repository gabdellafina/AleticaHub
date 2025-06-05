// Auth Routes - Rotas de autenticação

import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

export class AuthRoutes {
  private router = Router();

  constructor(
    private authController: AuthController,
    private authMiddleware: AuthMiddleware
  ) {
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Rotas públicas
    this.router.post('/login', this.authController.login);
    this.router.post('/register', this.authController.register);

    // Rotas protegidas
    this.router.get(
      '/verify-user',
      this.authMiddleware.verifyToken,
      this.authController.verifyUser
    );

    this.router.get(
      '/verify-admin',
      this.authMiddleware.verifyToken,
      this.authMiddleware.checkAdminRole,
      this.authController.verifyAdmin
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
