// Chat Service - Business Logic Layer

import { Chat, Mensagem } from '../../shared/types';
import { IChatRepository, IMensagemRepository, IUserRepository } from '../../data/repositories/interfaces';

export class ChatService {
  constructor(
    private chatRepository: IChatRepository,
    private mensagemRepository: IMensagemRepository,
    private userRepository: IUserRepository
  ) {}

  async getAllChats(): Promise<Chat[]> {
    try {
      return await this.chatRepository.getAll();
    } catch (error) {
      console.error('Erro no serviço ao buscar chats:', error);
      throw new Error('Falha ao buscar chats');
    }
  }

  async getChatById(id: string): Promise<Chat | null> {
    if (!id?.trim()) {
      throw new Error('ID do chat é obrigatório');
    }

    try {
      return await this.chatRepository.getById(id);
    } catch (error) {
      console.error(`Erro no serviço ao buscar chat ${id}:`, error);
      throw new Error('Falha ao buscar chat');
    }
  }

  async getChatsByType(tipo: 'geral' | 'esporte'): Promise<Chat[]> {
    try {
      return await this.chatRepository.getByType(tipo);
    } catch (error) {
      console.error(`Erro no serviço ao buscar chats do tipo ${tipo}:`, error);
      throw new Error('Falha ao buscar chats por tipo');
    }
  }

  async createChat(chat: Omit<Chat, 'id' | 'createdAt' | 'updatedAt'>, creatorId: string): Promise<Chat> {
    if (!creatorId?.trim()) {
      throw new Error('ID do criador é obrigatório');
    }

    await this.validateChatCreationPermissions(creatorId, chat.tipo);
    
    try {
      const newChat = {
        ...chat,
        participantes: chat.participantes || []
      };

      return await this.chatRepository.create(newChat);
    } catch (error) {
      console.error('Erro no serviço ao criar chat:', error);
      throw error;
    }
  }

  async getChatMessages(chatId: string, userId: string): Promise<Mensagem[]> {
    if (!chatId?.trim()) {
      throw new Error('ID do chat é obrigatório');
    }

    if (!userId?.trim()) {
      throw new Error('ID do usuário é obrigatório');
    }

    try {
      // Verificar se usuário tem acesso ao chat
      await this.validateChatAccess(chatId, userId);
      
      return await this.mensagemRepository.getByChatId(chatId);
    } catch (error) {
      console.error(`Erro no serviço ao buscar mensagens do chat ${chatId}:`, error);
      throw error;
    }
  }

  async getRecentMessages(chatId: string, userId: string, limit: number = 50): Promise<Mensagem[]> {
    if (!chatId?.trim()) {
      throw new Error('ID do chat é obrigatório');
    }

    if (!userId?.trim()) {
      throw new Error('ID do usuário é obrigatório');
    }

    if (limit <= 0 || limit > 100) {
      throw new Error('Limite deve estar entre 1 e 100');
    }

    try {
      // Verificar se usuário tem acesso ao chat
      await this.validateChatAccess(chatId, userId);
      
      return await this.mensagemRepository.getRecent(chatId, limit);
    } catch (error) {
      console.error(`Erro no serviço ao buscar mensagens recentes do chat ${chatId}:`, error);
      throw error;
    }
  }

  async sendMessage(chatId: string, userId: string, conteudo: string): Promise<Mensagem> {
    if (!chatId?.trim()) {
      throw new Error('ID do chat é obrigatório');
    }

    if (!userId?.trim()) {
      throw new Error('ID do usuário é obrigatório');
    }

    if (!conteudo?.trim()) {
      throw new Error('Conteúdo da mensagem é obrigatório');
    }

    try {
      // Verificar se usuário tem acesso ao chat
      await this.validateChatAccess(chatId, userId);

      // Verificar se usuário pode enviar mensagens
      await this.validateMessagePermissions(userId);

      // Criar mensagem
      const mensagem = await this.mensagemRepository.create({
        chatId,
        autorId: userId,
        conteudo: conteudo.trim()
      });

      // Atualizar última mensagem do chat
      await this.chatRepository.updateLastMessage(chatId, conteudo.trim());

      return mensagem;
    } catch (error) {
      console.error('Erro no serviço ao enviar mensagem:', error);
      throw error;
    }
  }

  async deleteMessage(messageId: string, userId: string): Promise<void> {
    if (!messageId?.trim()) {
      throw new Error('ID da mensagem é obrigatório');
    }

    if (!userId?.trim()) {
      throw new Error('ID do usuário é obrigatório');
    }

    try {
      // Buscar mensagem para verificar autor
      const mensagens = await this.mensagemRepository.getByChatId(''); // Seria implementado método específico
      const mensagem = mensagens.find(m => m.id === messageId);
      
      if (!mensagem) {
        throw new Error('Mensagem não encontrada');
      }

      // Verificar se usuário pode deletar (autor ou admin)
      const user = await this.userRepository.getById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      if (mensagem.autorId !== userId && user.role !== 'admin') {
        throw new Error('Usuário não tem permissão para deletar esta mensagem');
      }

      await this.mensagemRepository.delete(messageId);
    } catch (error) {
      console.error(`Erro no serviço ao deletar mensagem ${messageId}:`, error);
      throw error;
    }
  }

  async getChatsForUser(userId: string): Promise<Chat[]> {
    if (!userId?.trim()) {
      throw new Error('ID do usuário é obrigatório');
    }

    try {
      const user = await this.userRepository.getById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const allChats = await this.chatRepository.getAll();
      
      // Filtrar chats que o usuário pode acessar
      return allChats.filter(chat => {
        // Chat geral: todos podem acessar se estão ativos
        if (chat.tipo === 'geral') {
          return user.status === 'ativo';
        }
        
        // Chat de esporte: verificar se usuário está inscrito no esporte
        if (chat.tipo === 'esporte' && chat.esporteId) {
          // Esta verificação seria feita com o repositório de inscrições
          return true; // Implementar lógica real
        }
        
        return false;
      });
    } catch (error) {
      console.error(`Erro no serviço ao buscar chats do usuário ${userId}:`, error);
      throw new Error('Falha ao buscar chats do usuário');
    }
  }

  private async validateChatCreationPermissions(userId: string, tipo: 'geral' | 'esporte'): Promise<void> {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (user.role !== 'admin') {
      throw new Error('Apenas administradores podem criar chats');
    }

    if (user.status !== 'ativo') {
      throw new Error('Usuário deve estar ativo para criar chats');
    }
  }

  private async validateChatAccess(chatId: string, userId: string): Promise<void> {
    const chat = await this.chatRepository.getById(chatId);
    if (!chat) {
      throw new Error('Chat não encontrado');
    }

    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (user.status !== 'ativo') {
      throw new Error('Usuário deve estar ativo para acessar chats');
    }

    // Para chats de esporte, verificar se usuário está inscrito
    if (chat.tipo === 'esporte' && chat.esporteId) {
      // Esta verificação seria feita com o repositório de inscrições
      // Por agora, assumindo que admins sempre têm acesso
      if (user.role !== 'admin') {
        // Implementar verificação de inscrição no esporte
      }
    }
  }

  private async validateMessagePermissions(userId: string): Promise<void> {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (user.status === 'suspenso') {
      throw new Error('Usuários suspensos não podem enviar mensagens');
    }

    if (user.status !== 'ativo') {
      throw new Error('Usuário deve estar ativo para enviar mensagens');
    }
  }
}
