import { Router } from 'express';
import { InscricaoController } from '../controllers';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

export function createInscricaoRoutes(
  inscricaoController: InscricaoController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  // All inscription routes require authentication
  router.use(authMiddleware.authenticate.bind(authMiddleware));

  // User inscription management
  router.post('/', inscricaoController.createInscricao.bind(inscricaoController));
  router.get('/', inscricaoController.getUserInscricoes.bind(inscricaoController));
  router.get('/:inscricaoId', inscricaoController.getInscricaoById.bind(inscricaoController));
  router.put('/:inscricaoId', inscricaoController.updateInscricao.bind(inscricaoController));
  router.put('/:inscricaoId/cancel', inscricaoController.cancelInscricao.bind(inscricaoController));

  // Event inscription management (for event organizers)
  router.get('/evento/:eventoId', inscricaoController.getEventoInscricoes.bind(inscricaoController));
  router.get('/evento/:eventoId/stats', inscricaoController.getInscricaoStats.bind(inscricaoController));
  router.get('/evento/:eventoId/export', inscricaoController.exportInscricoes.bind(inscricaoController));

  // Inscription approval/rejection (for event organizers and admins)
  router.put('/:inscricaoId/approve', inscricaoController.approveInscricao.bind(inscricaoController));
  router.put('/:inscricaoId/reject', inscricaoController.rejectInscricao.bind(inscricaoController));

  return router;
}
