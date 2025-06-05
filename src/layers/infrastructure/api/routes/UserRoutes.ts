import { Router } from 'express';
import { UserController } from '../controllers';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

export function createUserRoutes(
  userController: UserController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  // Apply authentication middleware to all routes
  router.use(authMiddleware.authenticate.bind(authMiddleware));

  // User profile routes
  router.get('/profile', userController.getProfile.bind(userController));
  router.put('/profile', userController.updateProfile.bind(userController));
  router.delete('/profile', userController.deleteProfile.bind(userController));

  // User management routes (admin only)
  router.get(
    '/', 
    authMiddleware.requireAdmin.bind(authMiddleware),
    userController.getAllUsers.bind(userController)
  );
  router.get(
    '/:userId', 
    authMiddleware.requireAdmin.bind(authMiddleware),
    userController.getUserById.bind(userController)
  );
  router.put(
    '/:userId',
    authMiddleware.requireAdmin.bind(authMiddleware),
    userController.updateUser.bind(userController)
  );
  router.delete(
    '/:userId',
    authMiddleware.requireAdmin.bind(authMiddleware),
    userController.deleteUser.bind(userController)
  );

  // User role management (admin only)
  router.put(
    '/:userId/role',
    authMiddleware.requireAdmin.bind(authMiddleware),
    userController.updateUserRole.bind(userController)
  );

  // User status management (admin only)
  router.put(
    '/:userId/status',
    authMiddleware.requireAdmin.bind(authMiddleware),
    userController.updateUserStatus.bind(userController)
  );

  // User search (admin only)
  router.get(
    '/search/:query',
    authMiddleware.requireAdmin.bind(authMiddleware),
    userController.searchUsers.bind(userController)
  );

  return router;
}
