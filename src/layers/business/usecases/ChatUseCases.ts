// Chat Use Cases - Business Logic Layer

import { Chat, Mensagem } from '../../shared/types';
import { ChatService } from '../services/ChatService';

export class ChatUseCases {
  constructor(private chatService: ChatService) {}

  // Casos de uso para usuários
  async getUserChats(userId: string): Promise<Chat[]> {
    return await this.chatService.getChatsForUser(userId);
  }

  async joinChat(chatId: string, userId: string): Promise<Chat | null> {
    // Validar acesso e retornar chat
    const chat = await this.chatService.getChatById(chatId);
    if (!chat) {
      throw new Error('Chat não encontrado');
    }

    // Validar acesso seria feito internamente no service
    return chat;
  }

  async getChatHistory(chatId: string, userId: string, limit?: number): Promise<Mensagem[]> {
    if (limit && limit > 0) {
      return await this.chatService.getRecentMessages(chatId, userId, limit);
    }
    return await this.chatService.getChatMessages(chatId, userId);
  }

  async sendMessage(chatId: string, userId: string, message: string): Promise<Mensagem> {
    return await this.chatService.sendMessage(chatId, userId, message);
  }

  async deleteMessage(messageId: string, userId: string): Promise<void> {
    return await this.chatService.deleteMessage(messageId, userId);
  }

  // Casos de uso administrativos
  async createGeneralChat(
    chatData: { nome: string; descricao?: string },
    adminId: string
  ): Promise<Chat> {
    const chat = {
      nome: chatData.nome,
      descricao: chatData.descricao || '',
      tipo: 'geral' as const,
      ultimaMensagem: '',
      participantes: []
    };

    return await this.chatService.createChat(chat, adminId);
  }

  async createSportChat(
    chatData: { nome: string; descricao?: string; esporteId: string },
    adminId: string
  ): Promise<Chat> {
    const chat = {
      nome: chatData.nome,
      descricao: chatData.descricao || '',
      tipo: 'esporte' as const,
      esporteId: chatData.esporteId,
      ultimaMensagem: '',
      participantes: []
    };

    return await this.chatService.createChat(chat, adminId);
  }

  async getAllChats(): Promise<Chat[]> {
    return await this.chatService.getAllChats();
  }

  async getChatsByType(tipo: 'geral' | 'esporte'): Promise<Chat[]> {
    return await this.chatService.getChatsByType(tipo);
  }

  // Casos de uso compostos
  async getChatDashboard(): Promise<{
    totalChats: number;
    generalChats: number;
    sportChats: number;
    recentActivity: Array<{
      chatId: string;
      chatNome: string;
      ultimaMensagem: string;
      tipo: 'geral' | 'esporte';
    }>;
  }> {
    const [allChats, generalChats, sportChats] = await Promise.all([
      this.chatService.getAllChats(),
      this.chatService.getChatsByType('geral'),
      this.chatService.getChatsByType('esporte')
    ]);

    // Criar atividade recente baseada na última mensagem
    const recentActivity = allChats
      .filter(chat => chat.ultimaMensagem)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
      .map(chat => ({
        chatId: chat.id,
        chatNome: chat.nome,
        ultimaMensagem: chat.ultimaMensagem,
        tipo: chat.tipo
      }));

    return {
      totalChats: allChats.length,
      generalChats: generalChats.length,
      sportChats: sportChats.length,
      recentActivity
    };
  }

  async getChatStatistics(chatId: string): Promise<{
    totalMessages: number;
    activeUsers: number;
    lastActivity: Date | null;
  }> {
    // Esta implementação seria mais robusta com dados reais
    const chat = await this.chatService.getChatById(chatId);
    if (!chat) {
      throw new Error('Chat não encontrado');
    }

    // Por agora, retornando estatísticas básicas
    // Em uma implementação real, consultaríamos tabelas de mensagens
    return {
      totalMessages: 0, // Seria calculado a partir das mensagens
      activeUsers: chat.participantes?.length || 0,
      lastActivity: chat.ultimaMensagem ? chat.updatedAt : null
    };
  }
}
