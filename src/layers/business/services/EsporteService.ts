// Esporte Service - Lógica de negócio para esportes

import { IEsporteRepository } from '../../data/repositories/interfaces';
import { Esporte, EsporteForm } from '../../shared/types';
import { createApiError } from '../../shared/utils';
import { HTTP_STATUS, DIAS_SEMANA } from '../../shared/constants';

export interface IEsporteService {
  getAllEsportes(): Promise<Esporte[]>;
  getEsporteById(id: string): Promise<Esporte>;
  createEsporte(data: EsporteForm): Promise<Esporte>;
  updateEsporte(id: string, data: Partial<EsporteForm>): Promise<Esporte>;
  deleteEsporte(id: string): Promise<void>;
  checkScheduleConflict(diasTreino: string[], excludeId?: string): Promise<boolean>;
}

export class EsporteService implements IEsporteService {
  constructor(private esporteRepository: IEsporteRepository) {}

  async getAllEsportes(): Promise<Esporte[]> {
    return this.esporteRepository.getAll();
  }

  async getEsporteById(id: string): Promise<Esporte> {
    const esporte = await this.esporteRepository.getById(id);
    if (!esporte) {
      throw createApiError('Esporte não encontrado', HTTP_STATUS.NOT_FOUND);
    }
    return esporte;
  }

  async createEsporte(data: EsporteForm): Promise<Esporte> {
    await this.validateEsporteData(data);

    const hasConflict = await this.checkScheduleConflict(data.diasTreino);
    if (hasConflict) {
      throw createApiError('Conflito de horário detectado', HTTP_STATUS.BAD_REQUEST);
    }

    return this.esporteRepository.create(data);
  }

  async updateEsporte(id: string, data: Partial<EsporteForm>): Promise<Esporte> {
    await this.getEsporteById(id); // Verifica se existe

    if (data.diasTreino) {
      await this.validateDiasTreino(data.diasTreino);
      const hasConflict = await this.checkScheduleConflict(data.diasTreino, id);
      if (hasConflict) {
        throw createApiError('Conflito de horário detectado', HTTP_STATUS.BAD_REQUEST);
      }
    }

    return this.esporteRepository.update(id, data);
  }

  async deleteEsporte(id: string): Promise<void> {
    if (id === '0') {
      throw createApiError('Não é possível excluir o esporte Geral', HTTP_STATUS.BAD_REQUEST);
    }

    await this.getEsporteById(id); // Verifica se existe
    return this.esporteRepository.delete(id);
  }

  async checkScheduleConflict(diasTreino: string[], excludeId?: string): Promise<boolean> {
    const esportesConflitantes = await this.esporteRepository.getByDiasTreino(diasTreino);
    
    if (excludeId) {
      return esportesConflitantes.some(esporte => esporte.id !== excludeId);
    }
    
    return esportesConflitantes.length > 0;
  }

  private async validateEsporteData(data: EsporteForm): Promise<void> {
    if (!data.nome?.trim()) {
      throw createApiError('Nome do esporte é obrigatório', HTTP_STATUS.BAD_REQUEST);
    }

    if (!data.descricao?.trim()) {
      throw createApiError('Descrição do esporte é obrigatória', HTTP_STATUS.BAD_REQUEST);
    }

    await this.validateDiasTreino(data.diasTreino);
  }

  private async validateDiasTreino(diasTreino: string[]): Promise<void> {
    if (!diasTreino || diasTreino.length === 0) {
      throw createApiError('Pelo menos um dia de treino deve ser selecionado', HTTP_STATUS.BAD_REQUEST);
    }

    const diasInvalidos = diasTreino.filter(dia => !DIAS_SEMANA.includes(dia as any));
    if (diasInvalidos.length > 0) {
      throw createApiError(`Dias inválidos: ${diasInvalidos.join(', ')}`, HTTP_STATUS.BAD_REQUEST);
    }
  }
}
