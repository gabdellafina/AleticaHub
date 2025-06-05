// Chat Repository Implementation

import { Chat } from '../../shared/types';
import { IChatRepository } from './interfaces';
import { IChatDataSource } from '../datasources/interfaces';

export class ChatRepository implements IChatRepository {
  constructor(private dataSource: IChatDataSource) {}

  async getAll(): Promise<Chat[]> {
    try {
      return await this.dataSource.getAll();
    } catch (error) {
      console.error('Erro ao buscar chats:', error);
      throw new Error('Falha ao buscar chats');
    }
  }

  async getById(id: string): Promise<Chat | null> {
    if (!id?.trim()) {
      throw new Error('ID do chat é obrigatório');
    }

    try {
      return await this.dataSource.getById(id);
    } catch (error) {
      console.error(`Erro ao buscar chat ${id}:`, error);
      throw new Error('Falha ao buscar chat');
    }
  }

  async getByType(tipo: 'geral' | 'esporte'): Promise<Chat[]> {
    try {
      const chats = await this.dataSource.getAll();
      return chats.filter(chat => chat.tipo === tipo);
    } catch (error) {
      console.error(`Erro ao buscar chats do tipo ${tipo}:`, error);
      throw new Error('Falha ao buscar chats por tipo');
    }
  }

  async create(chat: Omit<Chat, 'id' | 'createdAt' | 'updatedAt'>): Promise<Chat> {
    this.validateChatData(chat);

    try {
      // Verificar se já existe chat com o mesmo nome e tipo
      const chatsExistentes = await this.dataSource.getAll();
      const chatExistente = chatsExistentes.find(
        c => c.nome === chat.nome && c.tipo === chat.tipo
      );

      if (chatExistente) {
        throw new Error('Já existe um chat com este nome e tipo');
      }

      const novoChat = {
        ...chat,
        id: '', // Será gerado pelo datasource
        ultimaMensagem: '',
        participantes: chat.participantes || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return await this.dataSource.create(novoChat);
    } catch (error) {
      console.error('Erro ao criar chat:', error);
      throw error;
    }
  }

  async updateLastMessage(id: string, message: string): Promise<Chat> {
    if (!id?.trim()) {
      throw new Error('ID do chat é obrigatório');
    }

    if (!message?.trim()) {
      throw new Error('Mensagem é obrigatória');
    }

    try {
      const chat = await this.dataSource.getById(id);
      if (!chat) {
        throw new Error('Chat não encontrado');
      }

      return await this.dataSource.update(id, {
        ultimaMensagem: message.trim(),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error(`Erro ao atualizar última mensagem do chat ${id}:`, error);
      throw error;
    }
  }

  private validateChatData(chat: Omit<Chat, 'id' | 'createdAt' | 'updatedAt'>): void {
    if (!chat.nome?.trim()) {
      throw new Error('Nome do chat é obrigatório');
    }

    if (chat.nome.length > 100) {
      throw new Error('Nome do chat não pode exceder 100 caracteres');
    }

    if (!chat.tipo || !['geral', 'esporte'].includes(chat.tipo)) {
      throw new Error('Tipo do chat deve ser "geral" ou "esporte"');
    }

    if (chat.descricao && chat.descricao.length > 500) {
      throw new Error('Descrição do chat não pode exceder 500 caracteres');
    }

    if (chat.esporteId && chat.tipo !== 'esporte') {
      throw new Error('ID do esporte só pode ser especificado para chats de esporte');
    }

    if (chat.tipo === 'esporte' && !chat.esporteId?.trim()) {
      throw new Error('ID do esporte é obrigatório para chats de esporte');
    }
  }
}
