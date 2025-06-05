// Data Source Interface - Define contratos para fontes de dados

import { User, Esporte, Evento, Produto, Inscricao, Mensagem, Chat, Pedido } from '../../shared/types';

export interface IUserDataSource {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  updateRole(id: string, role: 'user' | 'admin'): Promise<User>;
  updateStatus(id: string, status: 'ativo' | 'pendente' | 'suspenso'): Promise<User>;
}

export interface IEsporteDataSource {
  findAll(): Promise<Esporte[]>;
  findById(id: string): Promise<Esporte | null>;
  create(esporte: Omit<Esporte, 'id' | 'createdAt' | 'updatedAt'>): Promise<Esporte>;
  update(id: string, data: Partial<Esporte>): Promise<Esporte>;
  delete(id: string): Promise<void>;
}

export interface IEventoDataSource {
  findAll(): Promise<Evento[]>;
  findById(id: string): Promise<Evento | null>;
  create(evento: Omit<Evento, 'id' | 'createdAt' | 'updatedAt'>): Promise<Evento>;
  update(id: string, data: Partial<Evento>): Promise<Evento>;
  delete(id: string): Promise<void>;
}

export interface IProdutoDataSource {
  findAll(): Promise<Produto[]>;
  findById(id: string): Promise<Produto | null>;
  create(produto: Omit<Produto, 'id' | 'createdAt' | 'updatedAt'>): Promise<Produto>;
  update(id: string, data: Partial<Produto>): Promise<Produto>;
  delete(id: string): Promise<void>;
  updateStock(id: string, quantity: number): Promise<Produto>;
}

export interface IInscricaoDataSource {
  findAll(): Promise<Inscricao[]>;
  findByUserId(userId: string): Promise<Inscricao[]>;
  findByEsporteId(esporteId: string): Promise<Inscricao[]>;
  create(inscricao: Omit<Inscricao, 'id' | 'createdAt' | 'updatedAt'>): Promise<Inscricao>;
  updateStatus(id: string, status: 'pendente' | 'aprovado' | 'rejeitado'): Promise<Inscricao>;
  delete(id: string): Promise<void>;
}

export interface IMensagemDataSource {
  findByChatId(chatId: string): Promise<Mensagem[]>;
  create(mensagem: Omit<Mensagem, 'id' | 'createdAt' | 'updatedAt'>): Promise<Mensagem>;
  delete(id: string): Promise<void>;
}

export interface IChatDataSource {
  findAll(): Promise<Chat[]>;
  findById(id: string): Promise<Chat | null>;
  create(chat: Omit<Chat, 'id' | 'createdAt' | 'updatedAt'>): Promise<Chat>;
  updateLastMessage(id: string, message: string): Promise<Chat>;
}

export interface IPedidoDataSource {
  findAll(): Promise<Pedido[]>;
  findById(id: string): Promise<Pedido | null>;
  findByUserEmail(email: string): Promise<Pedido[]>;
  create(pedido: Omit<Pedido, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pedido>;
  updateStatus(id: string, status: 'pendente' | 'pago' | 'cancelado'): Promise<Pedido>;
  updatePaymentMethod(id: string, method: 'pix' | 'dinheiro'): Promise<Pedido>;
}
