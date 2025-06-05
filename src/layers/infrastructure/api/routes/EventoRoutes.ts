import { Router } from 'express';
import { EventoController } from '../controllers';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

export function createEventoRoutes(
  eventoController: EventoController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  // Public routes - no authentication required
  router.get('/', eventoController.getAllEventos.bind(eventoController));
  router.get('/:eventoId', eventoController.getEventoById.bind(eventoController));

  // Protected routes - authentication required
  router.use(authMiddleware.authenticate.bind(authMiddleware));

  // Event creation and management
  router.post('/', eventoController.createEvento.bind(eventoController));
  router.put('/:eventoId', eventoController.updateEvento.bind(eventoController));
  router.delete('/:eventoId', eventoController.deleteEvento.bind(eventoController));

  // Event status management
  router.put(
    '/:eventoId/status',
    eventoController.updateEventoStatus.bind(eventoController)
  );

  // Event search and filtering
  router.get(
    '/search/:query',
    eventoController.searchEventos.bind(eventoController)
  );
  router.get(
    '/esporte/:esporteId',
    eventoController.getEventosByEsporte.bind(eventoController)
  );
  router.get(
    '/user/:userId',
    eventoController.getUserEventos.bind(eventoController)
  );

  // Event participants management
  router.get(
    '/:eventoId/participants',
    eventoController.getEventoParticipants.bind(eventoController)
  );

  return router;
}
