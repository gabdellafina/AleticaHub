import { Router } from 'express';
import { ChatController } from '../controllers';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

export function createChatRoutes(
  chatController: ChatController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  // All chat routes require authentication
  router.use(authMiddleware.authenticate.bind(authMiddleware));

  // Chat management
  router.post('/', chatController.createChat.bind(chatController));
  router.get('/', chatController.getUserChats.bind(chatController));
  router.get('/:chatId', chatController.getChatById.bind(chatController));
  router.put('/:chatId', chatController.updateChat.bind(chatController));
  router.delete('/:chatId', chatController.deleteChat.bind(chatController));

  // Message management
  router.post('/:chatId/messages', chatController.sendMessage.bind(chatController));
  router.get('/:chatId/messages', chatController.getChatMessages.bind(chatController));
  router.delete('/messages/:messageId', chatController.deleteMessage.bind(chatController));

  // Participant management
  router.post('/:chatId/participants', chatController.addParticipant.bind(chatController));
  router.delete('/:chatId/participants/:participantId', chatController.removeParticipant.bind(chatController));

  return router;
}
