// Mensagem Repository Implementation

import { Mensagem } from '../../shared/types';
import { IMensagemRepository } from './interfaces';
import { IMensagemDataSource } from '../datasources/interfaces';

export class MensagemRepository implements IMensagemRepository {
  constructor(private dataSource: IMensagemDataSource) {}

  async getByChatId(chatId: string): Promise<Mensagem[]> {
    if (!chatId?.trim()) {
      throw new Error('ID do chat é obrigatório');
    }

    try {
      const mensagens = await this.dataSource.getAll();
      return mensagens
        .filter(mensagem => mensagem.chatId === chatId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } catch (error) {
      console.error(`Erro ao buscar mensagens do chat ${chatId}:`, error);
      throw new Error('Falha ao buscar mensagens do chat');
    }
  }

  async getRecent(chatId: string, limit: number): Promise<Mensagem[]> {
    if (!chatId?.trim()) {
      throw new Error('ID do chat é obrigatório');
    }

    if (limit <= 0) {
      throw new Error('Limite deve ser positivo');
    }

    try {
      const mensagens = await this.getByChatId(chatId);
      return mensagens.slice(-limit); // Pega as últimas mensagens
    } catch (error) {
      console.error(`Erro ao buscar mensagens recentes do chat ${chatId}:`, error);
      throw error;
    }
  }

  async create(mensagem: Omit<Mensagem, 'id' | 'createdAt' | 'updatedAt'>): Promise<Mensagem> {
    this.validateMensagemData(mensagem);

    try {
      const novaMensagem = {
        ...mensagem,
        id: '', // Será gerado pelo datasource
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return await this.dataSource.create(novaMensagem);
    } catch (error) {
      console.error('Erro ao criar mensagem:', error);
      throw new Error('Falha ao criar mensagem');
    }
  }

  async delete(id: string): Promise<void> {
    if (!id?.trim()) {
      throw new Error('ID da mensagem é obrigatório');
    }

    try {
      const mensagem = await this.dataSource.getById(id);
      if (!mensagem) {
        throw new Error('Mensagem não encontrada');
      }

      await this.dataSource.delete(id);
    } catch (error) {
      console.error(`Erro ao deletar mensagem ${id}:`, error);
      throw error;
    }
  }

  private validateMensagemData(mensagem: Omit<Mensagem, 'id' | 'createdAt' | 'updatedAt'>): void {
    if (!mensagem.conteudo?.trim()) {
      throw new Error('Conteúdo da mensagem é obrigatório');
    }

    if (mensagem.conteudo.length > 1000) {
      throw new Error('Mensagem não pode exceder 1000 caracteres');
    }

    if (!mensagem.autorId?.trim()) {
      throw new Error('ID do autor é obrigatório');
    }

    if (!mensagem.chatId?.trim()) {
      throw new Error('ID do chat é obrigatório');
    }
  }
}
