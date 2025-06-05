import { Request, Response } from 'express';
import { 
  ChatUseCases, 
  AuthUseCases 
} from '../../../business/usecases';
import { ApiResponse } from '../../../shared/types';

export class ChatController {
  constructor(
    private chatUseCases: ChatUseCases,
    private authUseCases: AuthUseCases
  ) {}

  // Chat management
  async createChat(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Token de autenticação inválido'
        } as ApiResponse);
        return;
      }

      const { nome, tipo, participantes, descricao } = req.body;
      
      if (!nome || !tipo || !participantes) {
        res.status(400).json({
          success: false,
          message: 'Nome, tipo e participantes são obrigatórios'
        } as ApiResponse);
        return;
      }

      const chat = await this.chatUseCases.createChat({
        nome,
        tipo,
        participantes: [...participantes, userId], // Add creator as participant
        descricao,
        criadoPor: userId
      });

      res.status(201).json({
        success: true,
        message: 'Chat criado com sucesso',
        data: chat
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao criar chat:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  async getUserChats(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Token de autenticação inválido'
        } as ApiResponse);
        return;
      }

      const chats = await this.chatUseCases.getUserChats(userId);

      res.status(200).json({
        success: true,
        message: 'Chats recuperados com sucesso',
        data: chats
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao buscar chats:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  async getChatById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Token de autenticação inválido'
        } as ApiResponse);
        return;
      }

      const { chatId } = req.params;
      if (!chatId) {
        res.status(400).json({
          success: false,
          message: 'ID do chat é obrigatório'
        } as ApiResponse);
        return;
      }

      const chat = await this.chatUseCases.getChatById(chatId);
      if (!chat) {
        res.status(404).json({
          success: false,
          message: 'Chat não encontrado'
        } as ApiResponse);
        return;
      }

      // Check if user is participant
      if (!chat.participantes.includes(userId)) {
        res.status(403).json({
          success: false,
          message: 'Acesso negado ao chat'
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Chat recuperado com sucesso',
        data: chat
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao buscar chat:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  async updateChat(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Token de autenticação inválido'
        } as ApiResponse);
        return;
      }

      const { chatId } = req.params;
      const updates = req.body;

      if (!chatId) {
        res.status(400).json({
          success: false,
          message: 'ID do chat é obrigatório'
        } as ApiResponse);
        return;
      }

      const chat = await this.chatUseCases.updateChat(chatId, updates, userId);

      res.status(200).json({
        success: true,
        message: 'Chat atualizado com sucesso',
        data: chat
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao atualizar chat:', error);
      if (error instanceof Error) {
        if (error.message.includes('não encontrado')) {
          res.status(404).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
        if (error.message.includes('permissão')) {
          res.status(403).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
      }
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  async deleteChat(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Token de autenticação inválido'
        } as ApiResponse);
        return;
      }

      const { chatId } = req.params;
      if (!chatId) {
        res.status(400).json({
          success: false,
          message: 'ID do chat é obrigatório'
        } as ApiResponse);
        return;
      }

      await this.chatUseCases.deleteChat(chatId, userId);

      res.status(200).json({
        success: true,
        message: 'Chat excluído com sucesso'
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao excluir chat:', error);
      if (error instanceof Error) {
        if (error.message.includes('não encontrado')) {
          res.status(404).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
        if (error.message.includes('permissão')) {
          res.status(403).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
      }
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  // Message management
  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Token de autenticação inválido'
        } as ApiResponse);
        return;
      }

      const { chatId } = req.params;
      const { conteudo, tipo = 'texto', arquivo } = req.body;

      if (!chatId || !conteudo) {
        res.status(400).json({
          success: false,
          message: 'ID do chat e conteúdo são obrigatórios'
        } as ApiResponse);
        return;
      }

      const message = await this.chatUseCases.sendMessage({
        chatId,
        autorId: userId,
        conteudo,
        tipo,
        arquivo
      });

      res.status(201).json({
        success: true,
        message: 'Mensagem enviada com sucesso',
        data: message
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      if (error instanceof Error) {
        if (error.message.includes('não encontrado')) {
          res.status(404).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
        if (error.message.includes('permissão')) {
          res.status(403).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
      }
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  async getChatMessages(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Token de autenticação inválido'
        } as ApiResponse);
        return;
      }

      const { chatId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      if (!chatId) {
        res.status(400).json({
          success: false,
          message: 'ID do chat é obrigatório'
        } as ApiResponse);
        return;
      }

      const result = await this.chatUseCases.getChatMessages(chatId, userId, page, limit);

      res.status(200).json({
        success: true,
        message: 'Mensagens recuperadas com sucesso',
        data: result
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      if (error instanceof Error) {
        if (error.message.includes('não encontrado')) {
          res.status(404).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
        if (error.message.includes('permissão')) {
          res.status(403).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
      }
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  async deleteMessage(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Token de autenticação inválido'
        } as ApiResponse);
        return;
      }

      const { messageId } = req.params;
      if (!messageId) {
        res.status(400).json({
          success: false,
          message: 'ID da mensagem é obrigatório'
        } as ApiResponse);
        return;
      }

      await this.chatUseCases.deleteMessage(messageId, userId);

      res.status(200).json({
        success: true,
        message: 'Mensagem excluída com sucesso'
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao excluir mensagem:', error);
      if (error instanceof Error) {
        if (error.message.includes('não encontrada')) {
          res.status(404).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
        if (error.message.includes('permissão')) {
          res.status(403).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
      }
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  // Participant management
  async addParticipant(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Token de autenticação inválido'
        } as ApiResponse);
        return;
      }

      const { chatId } = req.params;
      const { participantId } = req.body;

      if (!chatId || !participantId) {
        res.status(400).json({
          success: false,
          message: 'ID do chat e ID do participante são obrigatórios'
        } as ApiResponse);
        return;
      }

      const chat = await this.chatUseCases.addParticipant(chatId, participantId, userId);

      res.status(200).json({
        success: true,
        message: 'Participante adicionado com sucesso',
        data: chat
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao adicionar participante:', error);
      if (error instanceof Error) {
        if (error.message.includes('não encontrado')) {
          res.status(404).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
        if (error.message.includes('permissão')) {
          res.status(403).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
      }
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  async removeParticipant(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Token de autenticação inválido'
        } as ApiResponse);
        return;
      }

      const { chatId, participantId } = req.params;

      if (!chatId || !participantId) {
        res.status(400).json({
          success: false,
          message: 'ID do chat e ID do participante são obrigatórios'
        } as ApiResponse);
        return;
      }

      const chat = await this.chatUseCases.removeParticipant(chatId, participantId, userId);

      res.status(200).json({
        success: true,
        message: 'Participante removido com sucesso',
        data: chat
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao remover participante:', error);
      if (error instanceof Error) {
        if (error.message.includes('não encontrado')) {
          res.status(404).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
        if (error.message.includes('permissão')) {
          res.status(403).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
      }
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }
}
