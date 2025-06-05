import { Router } from 'express';
import { LojaController } from '../controllers';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

export function createLojaRoutes(
  lojaController: LojaController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  // Public routes - no authentication required
  router.get('/produtos', lojaController.getAllProdutos.bind(lojaController));
  router.get('/produtos/:produtoId', lojaController.getProdutoById.bind(lojaController));
  router.get('/produtos/categoria/:categoria', lojaController.getProdutosByCategoria.bind(lojaController));
  router.get('/produtos/search/:query', lojaController.searchProdutos.bind(lojaController));

  // Protected routes - authentication required
  router.use(authMiddleware.authenticate.bind(authMiddleware));

  // Product management (admin/moderator only)
  router.post(
    '/produtos',
    authMiddleware.requireModerator.bind(authMiddleware),
    lojaController.createProduto.bind(lojaController)
  );
  router.put(
    '/produtos/:produtoId',
    authMiddleware.requireModerator.bind(authMiddleware),
    lojaController.updateProduto.bind(lojaController)
  );
  router.delete(
    '/produtos/:produtoId',
    authMiddleware.requireModerator.bind(authMiddleware),
    lojaController.deleteProduto.bind(lojaController)
  );

  // Product status management (admin/moderator only)
  router.put(
    '/produtos/:produtoId/status',
    authMiddleware.requireModerator.bind(authMiddleware),
    lojaController.updateProdutoStatus.bind(lojaController)
  );

  // Stock management (admin/moderator only)
  router.put(
    '/produtos/:produtoId/stock',
    authMiddleware.requireModerator.bind(authMiddleware),
    lojaController.updateProdutoStock.bind(lojaController)
  );

  // Order management
  router.post('/pedidos', lojaController.createPedido.bind(lojaController));
  router.get('/pedidos', lojaController.getUserPedidos.bind(lojaController));
  router.get('/pedidos/:pedidoId', lojaController.getPedidoById.bind(lojaController));
  router.put('/pedidos/:pedidoId/cancel', lojaController.cancelPedido.bind(lojaController));

  // Order management (admin/moderator only)
  router.get(
    '/admin/pedidos',
    authMiddleware.requireModerator.bind(authMiddleware),
    lojaController.getAllPedidos.bind(lojaController)
  );
  router.put(
    '/admin/pedidos/:pedidoId/status',
    authMiddleware.requireModerator.bind(authMiddleware),
    lojaController.updatePedidoStatus.bind(lojaController)
  );

  return router;
}
