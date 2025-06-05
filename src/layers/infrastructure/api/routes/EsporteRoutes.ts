import { Router } from 'express';
import { EsporteController } from '../controllers';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

export function createEsporteRoutes(
  esporteController: EsporteController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  // Public routes - no authentication required
  router.get('/', esporteController.getAllEsportes.bind(esporteController));
  router.get('/:esporteId', esporteController.getEsporteById.bind(esporteController));

  // Protected routes - authentication required
  router.use(authMiddleware.authenticate.bind(authMiddleware));

  // Admin/moderator only routes
  router.post(
    '/',
    authMiddleware.requireModerator.bind(authMiddleware),
    esporteController.createEsporte.bind(esporteController)
  );
  router.put(
    '/:esporteId',
    authMiddleware.requireModerator.bind(authMiddleware),
    esporteController.updateEsporte.bind(esporteController)
  );
  router.delete(
    '/:esporteId',
    authMiddleware.requireModerator.bind(authMiddleware),
    esporteController.deleteEsporte.bind(esporteController)
  );

  // Esporte status management (admin/moderator only)
  router.put(
    '/:esporteId/status',
    authMiddleware.requireModerator.bind(authMiddleware),
    esporteController.updateEsporteStatus.bind(esporteController)
  );

  // Search esportes
  router.get(
    '/search/:query',
    esporteController.searchEsportes.bind(esporteController)
  );

  return router;
}
