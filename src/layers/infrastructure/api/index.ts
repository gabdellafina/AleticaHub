import { Router } from 'express';
import {
  createAuthRoutes,
  createUserRoutes,
  createEsporteRoutes,
  createEventoRoutes,
  createLojaRoutes,
  createChatRoutes,
  createInscricaoRoutes
} from './routes';
import {
  AuthController,
  UserController,
  EsporteController,
  EventoController,
  LojaController,
  ChatController,
  InscricaoController
} from './controllers';
import { AuthMiddleware } from './middlewares';

interface ApiRouterDependencies {
  authController: AuthController;
  userController: UserController;
  esporteController: EsporteController;
  eventoController: EventoController;
  lojaController: LojaController;
  chatController: ChatController;
  inscricaoController: InscricaoController;
  authMiddleware: AuthMiddleware;
}

export function createApiRouter(dependencies: ApiRouterDependencies): Router {
  const router = Router();

  const {
    authController,
    userController,
    esporteController,
    eventoController,
    lojaController,
    chatController,
    inscricaoController,
    authMiddleware
  } = dependencies;

  // Health check endpoint
  router.get('/health', (req, res) => {
    res.json({
      success: true,
      message: 'AtleticaHub API is running',
      timestamp: new Date().toISOString()
    });
  });

  // API routes
  router.use('/auth', createAuthRoutes(authController));
  router.use('/users', createUserRoutes(userController, authMiddleware));
  router.use('/esportes', createEsporteRoutes(esporteController, authMiddleware));
  router.use('/eventos', createEventoRoutes(eventoController, authMiddleware));
  router.use('/loja', createLojaRoutes(lojaController, authMiddleware));
  router.use('/chats', createChatRoutes(chatController, authMiddleware));
  router.use('/inscricoes', createInscricaoRoutes(inscricaoController, authMiddleware));

  // 404 handler for unmatched routes
  router.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Endpoint não encontrado'
    });
  });

  return router;
}
