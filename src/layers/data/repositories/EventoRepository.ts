// Evento Repository Implementation

import { Evento } from '../../shared/types';
import { IEventoRepository } from './interfaces';
import { IEventoDataSource } from '../datasources/interfaces';

export class EventoRepository implements IEventoRepository {
  constructor(private dataSource: IEventoDataSource) {}

  async getAll(): Promise<Evento[]> {
    try {
      return await this.dataSource.getAll();
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      throw new Error('Falha ao buscar eventos');
    }
  }

  async getById(id: string): Promise<Evento | null> {
    if (!id?.trim()) {
      throw new Error('ID do evento é obrigatório');
    }

    try {
      return await this.dataSource.getById(id);
    } catch (error) {
      console.error(`Erro ao buscar evento ${id}:`, error);
      throw new Error('Falha ao buscar evento');
    }
  }

  async getUpcoming(): Promise<Evento[]> {
    try {
      const eventos = await this.dataSource.getAll();
      const now = new Date();
      
      return eventos
        .filter(evento => new Date(evento.dataEvento) > now)
        .sort((a, b) => new Date(a.dataEvento).getTime() - new Date(b.dataEvento).getTime());
    } catch (error) {
      console.error('Erro ao buscar próximos eventos:', error);
      throw new Error('Falha ao buscar próximos eventos');
    }
  }

  async create(evento: Omit<Evento, 'id' | 'createdAt' | 'updatedAt'>): Promise<Evento> {
    this.validateEventoData(evento);

    try {
      const novoEvento = {
        ...evento,
        id: '', // Será gerado pelo datasource
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return await this.dataSource.create(novoEvento);
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      throw new Error('Falha ao criar evento');
    }
  }

  async update(id: string, data: Partial<Evento>): Promise<Evento> {
    if (!id?.trim()) {
      throw new Error('ID do evento é obrigatório');
    }

    if (data.nome && !data.nome.trim()) {
      throw new Error('Nome do evento é obrigatório');
    }

    try {
      const eventoAtualizado = {
        ...data,
        updatedAt: new Date()
      };

      return await this.dataSource.update(id, eventoAtualizado);
    } catch (error) {
      console.error(`Erro ao atualizar evento ${id}:`, error);
      throw new Error('Falha ao atualizar evento');
    }
  }

  async delete(id: string): Promise<void> {
    if (!id?.trim()) {
      throw new Error('ID do evento é obrigatório');
    }

    try {
      await this.dataSource.delete(id);
    } catch (error) {
      console.error(`Erro ao deletar evento ${id}:`, error);
      throw new Error('Falha ao deletar evento');
    }
  }

  private validateEventoData(evento: Omit<Evento, 'id' | 'createdAt' | 'updatedAt'>): void {
    if (!evento.nome?.trim()) {
      throw new Error('Nome do evento é obrigatório');
    }

    if (!evento.descricao?.trim()) {
      throw new Error('Descrição do evento é obrigatória');
    }

    if (!evento.dataEvento) {
      throw new Error('Data do evento é obrigatória');
    }

    if (new Date(evento.dataEvento) <= new Date()) {
      throw new Error('Data do evento deve ser futura');
    }

    if (!evento.local?.trim()) {
      throw new Error('Local do evento é obrigatório');
    }

    if (evento.maxParticipantes && evento.maxParticipantes <= 0) {
      throw new Error('Número máximo de participantes deve ser positivo');
    }

    if (evento.preco && evento.preco < 0) {
      throw new Error('Preço não pode ser negativo');
    }
  }
}
