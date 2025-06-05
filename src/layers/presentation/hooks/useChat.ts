import { useState, useEffect, useCallback } from 'react';
import { ChatUseCases } from '../../business/usecases';
import { Chat, Mensagem, CreateChatDTO, UpdateChatDTO, CreateMensagemDTO } from '../../shared/types';

interface UseChatOptions {
  autoLoadChats?: boolean;
  chatId?: string;
  autoLoadMessages?: boolean;
}

interface UseChatReturn {
  // Chats
  chats: Chat[];
  chatsLoading: boolean;
  chatsError: string | null;
  
  // Current chat
  currentChat: Chat | null;
  
  // Messages
  messages: Mensagem[];
  messagesLoading: boolean;
  messagesError: string | null;
  
  // Chat actions
  createChat: (data: CreateChatDTO) => Promise<Chat | null>;
  updateChat: (id: string, data: UpdateChatDTO) => Promise<Chat | null>;
  deleteChat: (id: string) => Promise<boolean>;
  getChatById: (id: string) => Promise<Chat | null>;
  
  // Message actions
  sendMessage: (data: CreateMensagemDTO) => Promise<Mensagem | null>;
  deleteMessage: (messageId: string) => Promise<boolean>;
  getChatMessages: (chatId: string, page?: number, limit?: number) => Promise<void>;
  
  // Participant actions
  addParticipant: (chatId: string, participantId: string) => Promise<boolean>;
  removeParticipant: (chatId: string, participantId: string) => Promise<boolean>;
  
  // Utils
  refreshChats: () => Promise<void>;
  setCurrentChatId: (chatId: string | null) => void;
  clearErrors: () => void;
}

export function useChat(
  chatUseCases: ChatUseCases,
  options: UseChatOptions = {}
): UseChatReturn {
  const { autoLoadChats = true, chatId, autoLoadMessages = true } = options;

  // Chats state
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatsLoading, setChatsLoading] = useState(false);
  const [chatsError, setChatsError] = useState<string | null>(null);

  // Current chat state
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(chatId || null);

  // Messages state
  const [messages, setMessages] = useState<Mensagem[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  const clearErrors = useCallback(() => {
    setChatsError(null);
    setMessagesError(null);
  }, []);

  // Chat functions
  const refreshChats = useCallback(async () => {
    try {
      setChatsLoading(true);
      setChatsError(null);
      const result = await chatUseCases.getUserChats();
      setChats(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar chats';
      setChatsError(errorMessage);
      console.error('Erro ao carregar chats:', err);
    } finally {
      setChatsLoading(false);
    }
  }, [chatUseCases]);

  const createChat = useCallback(async (data: CreateChatDTO): Promise<Chat | null> => {
    try {
      setChatsLoading(true);
      setChatsError(null);
      const chat = await chatUseCases.createChat(data);
      setChats(prev => [...prev, chat]);
      return chat;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar chat';
      setChatsError(errorMessage);
      console.error('Erro ao criar chat:', err);
      return null;
    } finally {
      setChatsLoading(false);
    }
  }, [chatUseCases]);

  const updateChat = useCallback(async (id: string, data: UpdateChatDTO): Promise<Chat | null> => {
    try {
      setChatsLoading(true);
      setChatsError(null);
      const chat = await chatUseCases.updateChat(id, data);
      setChats(prev => prev.map(c => c.id === id ? chat : c));
      if (currentChatId === id) {
        setCurrentChat(chat);
      }
      return chat;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar chat';
      setChatsError(errorMessage);
      console.error('Erro ao atualizar chat:', err);
      return null;
    } finally {
      setChatsLoading(false);
    }
  }, [chatUseCases, currentChatId]);

  const deleteChat = useCallback(async (id: string): Promise<boolean> => {
    try {
      setChatsLoading(true);
      setChatsError(null);
      await chatUseCases.deleteChat(id);
      setChats(prev => prev.filter(c => c.id !== id));
      if (currentChatId === id) {
        setCurrentChat(null);
        setCurrentChatId(null);
        setMessages([]);
      }
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir chat';
      setChatsError(errorMessage);
      console.error('Erro ao excluir chat:', err);
      return false;
    } finally {
      setChatsLoading(false);
    }
  }, [chatUseCases, currentChatId]);

  const getChatById = useCallback(async (id: string): Promise<Chat | null> => {
    try {
      setChatsLoading(true);
      setChatsError(null);
      const chat = await chatUseCases.getChatById(id);
      if (chat) {
        setCurrentChat(chat);
        setCurrentChatId(id);
      }
      return chat;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar chat';
      setChatsError(errorMessage);
      console.error('Erro ao buscar chat:', err);
      return null;
    } finally {
      setChatsLoading(false);
    }
  }, [chatUseCases]);

  // Message functions
  const sendMessage = useCallback(async (data: CreateMensagemDTO): Promise<Mensagem | null> => {
    try {
      setMessagesError(null);
      const message = await chatUseCases.sendMessage(data);
      setMessages(prev => [...prev, message]);
      
      // Update last message in chat list
      setChats(prev => prev.map(chat => 
        chat.id === data.chatId 
          ? { ...chat, ultimaMensagem: message.conteudo, atualizadoEm: message.criadoEm }
          : chat
      ));
      
      return message;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao enviar mensagem';
      setMessagesError(errorMessage);
      console.error('Erro ao enviar mensagem:', err);
      return null;
    }
  }, [chatUseCases]);

  const deleteMessage = useCallback(async (messageId: string): Promise<boolean> => {
    try {
      setMessagesError(null);
      await chatUseCases.deleteMessage(messageId);
      setMessages(prev => prev.filter(m => m.id !== messageId));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir mensagem';
      setMessagesError(errorMessage);
      console.error('Erro ao excluir mensagem:', err);
      return false;
    }
  }, [chatUseCases]);

  const getChatMessages = useCallback(async (chatId: string, page = 1, limit = 50): Promise<void> => {
    try {
      setMessagesLoading(true);
      setMessagesError(null);
      const result = await chatUseCases.getChatMessages(chatId, page, limit);
      
      if (page === 1) {
        setMessages(result.messages);
      } else {
        // Append older messages for pagination
        setMessages(prev => [...result.messages, ...prev]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar mensagens';
      setMessagesError(errorMessage);
      console.error('Erro ao carregar mensagens:', err);
    } finally {
      setMessagesLoading(false);
    }
  }, [chatUseCases]);

  // Participant functions
  const addParticipant = useCallback(async (chatId: string, participantId: string): Promise<boolean> => {
    try {
      setChatsError(null);
      const chat = await chatUseCases.addParticipant(chatId, participantId);
      setChats(prev => prev.map(c => c.id === chatId ? chat : c));
      if (currentChatId === chatId) {
        setCurrentChat(chat);
      }
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar participante';
      setChatsError(errorMessage);
      console.error('Erro ao adicionar participante:', err);
      return false;
    }
  }, [chatUseCases, currentChatId]);

  const removeParticipant = useCallback(async (chatId: string, participantId: string): Promise<boolean> => {
    try {
      setChatsError(null);
      const chat = await chatUseCases.removeParticipant(chatId, participantId);
      setChats(prev => prev.map(c => c.id === chatId ? chat : c));
      if (currentChatId === chatId) {
        setCurrentChat(chat);
      }
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover participante';
      setChatsError(errorMessage);
      console.error('Erro ao remover participante:', err);
      return false;
    }
  }, [chatUseCases, currentChatId]);

  // Load current chat when chatId changes
  useEffect(() => {
    if (currentChatId && currentChatId !== currentChat?.id) {
      getChatById(currentChatId);
    }
  }, [currentChatId, currentChat?.id, getChatById]);

  // Load messages when current chat changes
  useEffect(() => {
    if (currentChatId && autoLoadMessages) {
      getChatMessages(currentChatId);
    }
  }, [currentChatId, autoLoadMessages, getChatMessages]);

  // Load chats on mount
  useEffect(() => {
    if (autoLoadChats) {
      refreshChats();
    }
  }, [autoLoadChats, refreshChats]);

  return {
    // Chats
    chats,
    chatsLoading,
    chatsError,
    
    // Current chat
    currentChat,
    
    // Messages
    messages,
    messagesLoading,
    messagesError,
    
    // Chat actions
    createChat,
    updateChat,
    deleteChat,
    getChatById,
    
    // Message actions
    sendMessage,
    deleteMessage,
    getChatMessages,
    
    // Participant actions
    addParticipant,
    removeParticipant,
    
    // Utils
    refreshChats,
    setCurrentChatId,
    clearErrors
  };
}
