// Inscricao Repository Implementation

import { Inscricao } from '../../shared/types';
import { IInscricaoRepository } from './interfaces';
import { IInscricaoDataSource } from '../datasources/interfaces';

export class InscricaoRepository implements IInscricaoRepository {
  constructor(private dataSource: IInscricaoDataSource) {}

  async getAll(): Promise<Inscricao[]> {
    try {
      return await this.dataSource.getAll();
    } catch (error) {
      console.error('Erro ao buscar inscrições:', error);
      throw new Error('Falha ao buscar inscrições');
    }
  }

  async getByUser(userId: string): Promise<Inscricao[]> {
    if (!userId?.trim()) {
      throw new Error('ID do usuário é obrigatório');
    }

    try {
      const inscricoes = await this.dataSource.getAll();
      return inscricoes.filter(inscricao => inscricao.userId === userId);
    } catch (error) {
      console.error(`Erro ao buscar inscrições do usuário ${userId}:`, error);
      throw new Error('Falha ao buscar inscrições do usuário');
    }
  }

  async getByEsporte(esporteId: string): Promise<Inscricao[]> {
    if (!esporteId?.trim()) {
      throw new Error('ID do esporte é obrigatório');
    }

    try {
      const inscricoes = await this.dataSource.getAll();
      return inscricoes.filter(inscricao => inscricao.esporteId === esporteId);
    } catch (error) {
      console.error(`Erro ao buscar inscrições do esporte ${esporteId}:`, error);
      throw new Error('Falha ao buscar inscrições do esporte');
    }
  }

  async getPending(): Promise<Inscricao[]> {
    try {
      const inscricoes = await this.dataSource.getAll();
      return inscricoes.filter(inscricao => inscricao.status === 'pendente');
    } catch (error) {
      console.error('Erro ao buscar inscrições pendentes:', error);
      throw new Error('Falha ao buscar inscrições pendentes');
    }
  }

  async create(inscricao: Omit<Inscricao, 'id' | 'createdAt' | 'updatedAt'>): Promise<Inscricao> {
    this.validateInscricaoData(inscricao);

    try {
      // Verificar se já existe inscrição ativa para o mesmo usuário e esporte
      const inscricoesExistentes = await this.dataSource.getAll();
      const inscricaoExistente = inscricoesExistentes.find(
        i => i.userId === inscricao.userId && 
             i.esporteId === inscricao.esporteId && 
             i.status !== 'cancelada'
      );

      if (inscricaoExistente) {
        throw new Error('Usuário já possui inscrição ativa para este esporte');
      }

      const novaInscricao = {
        ...inscricao,
        id: '', // Será gerado pelo datasource
        status: 'pendente' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return await this.dataSource.create(novaInscricao);
    } catch (error) {
      console.error('Erro ao criar inscrição:', error);
      throw error;
    }
  }

  async approve(id: string): Promise<Inscricao> {
    if (!id?.trim()) {
      throw new Error('ID da inscrição é obrigatório');
    }

    try {
      const inscricao = await this.dataSource.getById(id);
      if (!inscricao) {
        throw new Error('Inscrição não encontrada');
      }

      if (inscricao.status !== 'pendente') {
        throw new Error('Apenas inscrições pendentes podem ser aprovadas');
      }

      return await this.dataSource.update(id, {
        status: 'aprovada',
        updatedAt: new Date()
      });
    } catch (error) {
      console.error(`Erro ao aprovar inscrição ${id}:`, error);
      throw error;
    }
  }

  async reject(id: string): Promise<Inscricao> {
    if (!id?.trim()) {
      throw new Error('ID da inscrição é obrigatório');
    }

    try {
      const inscricao = await this.dataSource.getById(id);
      if (!inscricao) {
        throw new Error('Inscrição não encontrada');
      }

      if (inscricao.status !== 'pendente') {
        throw new Error('Apenas inscrições pendentes podem ser rejeitadas');
      }

      return await this.dataSource.update(id, {
        status: 'rejeitada',
        updatedAt: new Date()
      });
    } catch (error) {
      console.error(`Erro ao rejeitar inscrição ${id}:`, error);
      throw error;
    }
  }

  async cancel(id: string): Promise<void> {
    if (!id?.trim()) {
      throw new Error('ID da inscrição é obrigatório');
    }

    try {
      const inscricao = await this.dataSource.getById(id);
      if (!inscricao) {
        throw new Error('Inscrição não encontrada');
      }

      if (inscricao.status === 'cancelada') {
        throw new Error('Inscrição já está cancelada');
      }

      await this.dataSource.update(id, {
        status: 'cancelada',
        updatedAt: new Date()
      });
    } catch (error) {
      console.error(`Erro ao cancelar inscrição ${id}:`, error);
      throw error;
    }
  }

  private validateInscricaoData(inscricao: Omit<Inscricao, 'id' | 'createdAt' | 'updatedAt'>): void {
    if (!inscricao.userId?.trim()) {
      throw new Error('ID do usuário é obrigatório');
    }

    if (!inscricao.esporteId?.trim()) {
      throw new Error('ID do esporte é obrigatório');
    }

    if (inscricao.observacoes && inscricao.observacoes.length > 500) {
      throw new Error('Observações não podem exceder 500 caracteres');
    }
  }
}
