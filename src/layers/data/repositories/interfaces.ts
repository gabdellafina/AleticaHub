// Repository Interfaces - Define contratos para repositórios

import { User, Esporte, Evento, Produto, Inscricao, Mensagem, Chat, Pedido } from '../../shared/types';

export interface IUserRepository {
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  getAll(): Promise<User[]>;
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  promoteToAdmin(id: string): Promise<User>;
  approve(id: string): Promise<User>;
  suspend(id: string): Promise<User>;
}

export interface IEsporteRepository {
  getAll(): Promise<Esporte[]>;
  getById(id: string): Promise<Esporte | null>;
  create(esporte: Omit<Esporte, 'id' | 'createdAt' | 'updatedAt'>): Promise<Esporte>;
  update(id: string, data: Partial<Esporte>): Promise<Esporte>;
  delete(id: string): Promise<void>;
  getByDiasTreino(dias: string[]): Promise<Esporte[]>;
}

export interface IEventoRepository {
  getAll(): Promise<Evento[]>;
  getById(id: string): Promise<Evento | null>;
  getUpcoming(): Promise<Evento[]>;
  create(evento: Omit<Evento, 'id' | 'createdAt' | 'updatedAt'>): Promise<Evento>;
  update(id: string, data: Partial<Evento>): Promise<Evento>;
  delete(id: string): Promise<void>;
}

export interface IProdutoRepository {
  getAll(): Promise<Produto[]>;
  getById(id: string): Promise<Produto | null>;
  getAvailable(): Promise<Produto[]>;
  create(produto: Omit<Produto, 'id' | 'createdAt' | 'updatedAt'>): Promise<Produto>;
  update(id: string, data: Partial<Produto>): Promise<Produto>;
  delete(id: string): Promise<void>;
  decreaseStock(id: string, quantity: number): Promise<Produto>;
  increaseStock(id: string, quantity: number): Promise<Produto>;
}

export interface IInscricaoRepository {
  getAll(): Promise<Inscricao[]>;
  getByUser(userId: string): Promise<Inscricao[]>;
  getByEsporte(esporteId: string): Promise<Inscricao[]>;
  getPending(): Promise<Inscricao[]>;
  create(inscricao: Omit<Inscricao, 'id' | 'createdAt' | 'updatedAt'>): Promise<Inscricao>;
  approve(id: string): Promise<Inscricao>;
  reject(id: string): Promise<Inscricao>;
  cancel(id: string): Promise<void>;
}

export interface IMensagemRepository {
  getByChatId(chatId: string): Promise<Mensagem[]>;
  getRecent(chatId: string, limit: number): Promise<Mensagem[]>;
  create(mensagem: Omit<Mensagem, 'id' | 'createdAt' | 'updatedAt'>): Promise<Mensagem>;
  delete(id: string): Promise<void>;
}

export interface IChatRepository {
  getAll(): Promise<Chat[]>;
  getById(id: string): Promise<Chat | null>;
  getByType(tipo: 'geral' | 'esporte'): Promise<Chat[]>;
  create(chat: Omit<Chat, 'id' | 'createdAt' | 'updatedAt'>): Promise<Chat>;
  updateLastMessage(id: string, message: string): Promise<Chat>;
}

export interface IPedidoRepository {
  getAll(): Promise<Pedido[]>;
  getById(id: string): Promise<Pedido | null>;
  getByUserEmail(email: string): Promise<Pedido[]>;
  getPending(): Promise<Pedido[]>;
  create(pedido: Omit<Pedido, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pedido>;
  markAsPaid(id: string, paymentMethod: 'pix' | 'dinheiro'): Promise<Pedido>;
  cancel(id: string): Promise<Pedido>;
}
