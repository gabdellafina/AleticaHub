// Esporte Repository Implementation

import { IEsporteRepository } from './interfaces';
import { IEsporteDataSource } from '../datasources/interfaces';
import { Esporte } from '../../shared/types';

export class EsporteRepository implements IEsporteRepository {
  constructor(private dataSource: IEsporteDataSource) {}

  async getAll(): Promise<Esporte[]> {
    return this.dataSource.findAll();
  }

  async getById(id: string): Promise<Esporte | null> {
    return this.dataSource.findById(id);
  }

  async create(esporte: Omit<Esporte, 'id' | 'createdAt' | 'updatedAt'>): Promise<Esporte> {
    return this.dataSource.create(esporte);
  }

  async update(id: string, data: Partial<Esporte>): Promise<Esporte> {
    return this.dataSource.update(id, data);
  }

  async delete(id: string): Promise<void> {
    if (id === '0') {
      throw new Error('Não é possível excluir o esporte Geral');
    }
    return this.dataSource.delete(id);
  }

  async getByDiasTreino(dias: string[]): Promise<Esporte[]> {
    const esportes = await this.dataSource.findAll();
    return esportes.filter(esporte => 
      esporte.diasTreino.some(dia => dias.includes(dia))
    );
  }
}
