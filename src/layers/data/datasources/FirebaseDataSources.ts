import {
  IUserDataSource,
  IEsporteDataSource,
  IEventoDataSource,
  IProdutoDataSource,
  IPedidoDataSource,
  IInscricaoDataSource,
  IMensagemDataSource,
  IChatDataSource
} from './interfaces';
import {
  User,
  Esporte,
  Evento,
  Produto,
  Pedido,
  Inscricao,
  Mensagem,
  Chat
} from '../../shared/types';

// Firebase imports
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

export class FirebaseUserDataSource implements IUserDataSource {
  private db = getFirestore();
  private collection = collection(this.db, 'users');

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const docRef = await addDoc(this.collection, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const doc = await getDoc(docRef);
    return { id: doc.id, ...doc.data() } as User;
  }

  async findById(id: string): Promise<User | null> {
    const docRef = doc(this.db, 'users', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    return { id: docSnap.id, ...docSnap.data() } as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    const q = query(this.collection, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as User;
  }

  async findAll(): Promise<User[]> {
    const q = query(this.collection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as User[];
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const docRef = doc(this.db, 'users', id);
    await updateDoc(docRef, {
      ...userData,
      updatedAt: serverTimestamp()
    });

    const updatedDoc = await getDoc(docRef);
    return { id: updatedDoc.id, ...updatedDoc.data() } as User;
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.db, 'users', id);
    await deleteDoc(docRef);
  }

  async updateRole(id: string, role: 'user' | 'admin'): Promise<User> {
    const docRef = doc(this.db, 'users', id);
    await updateDoc(docRef, {
      role,
      updatedAt: serverTimestamp()
    });

    const updatedDoc = await getDoc(docRef);
    return { id: updatedDoc.id, ...updatedDoc.data() } as User;
  }

  async updateStatus(id: string, status: 'ativo' | 'pendente' | 'suspenso'): Promise<User> {
    const docRef = doc(this.db, 'users', id);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp()
    });

    const updatedDoc = await getDoc(docRef);
    return { id: updatedDoc.id, ...updatedDoc.data() } as User;
  }
}

export class FirebaseEsporteDataSource implements IEsporteDataSource {
  private db = getFirestore();
  private collection = collection(this.db, 'esportes');

  async create(esporteData: Omit<Esporte, 'id' | 'createdAt' | 'updatedAt'>): Promise<Esporte> {
    const docRef = await addDoc(this.collection, {
      ...esporteData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const doc = await getDoc(docRef);
    return { id: doc.id, ...doc.data() } as Esporte;
  }

  async findById(id: string): Promise<Esporte | null> {
    const docRef = doc(this.db, 'esportes', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    return { id: docSnap.id, ...docSnap.data() } as Esporte;
  }

  async findAll(): Promise<Esporte[]> {
    const q = query(this.collection, orderBy('nome'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Esporte[];
  }

  async update(id: string, esporteData: Partial<Esporte>): Promise<Esporte> {
    const docRef = doc(this.db, 'esportes', id);
    await updateDoc(docRef, {
      ...esporteData,
      updatedAt: serverTimestamp()
    });

    const updatedDoc = await getDoc(docRef);
    return { id: updatedDoc.id, ...updatedDoc.data() } as Esporte;
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.db, 'esportes', id);
    await deleteDoc(docRef);
  }
}

export class FirebaseEventoDataSource implements IEventoDataSource {
  private db = getFirestore();
  private collection = collection(this.db, 'eventos');

  async create(eventoData: Omit<Evento, 'id' | 'createdAt' | 'updatedAt'>): Promise<Evento> {
    const docRef = await addDoc(this.collection, {
      ...eventoData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const doc = await getDoc(docRef);
    return { id: doc.id, ...doc.data() } as Evento;
  }

  async findById(id: string): Promise<Evento | null> {
    const docRef = doc(this.db, 'eventos', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    return { id: docSnap.id, ...docSnap.data() } as Evento;
  }

  async findAll(): Promise<Evento[]> {
    const q = query(
      this.collection,
      orderBy('dataInicio', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Evento[];
  }

  async update(id: string, eventoData: Partial<Evento>): Promise<Evento> {
    const docRef = doc(this.db, 'eventos', id);
    await updateDoc(docRef, {
      ...eventoData,
      updatedAt: serverTimestamp()
    });

    const updatedDoc = await getDoc(docRef);
    return { id: updatedDoc.id, ...updatedDoc.data() } as Evento;
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.db, 'eventos', id);
    await deleteDoc(docRef);
  }
}

// Note: Similar implementations would be created for the other data sources
// (Produto, Pedido, Inscricao, Mensagem, Chat)
// For brevity, I'm showing the pattern with the first few implementations

export class FirebaseChatDataSource implements IChatDataSource {
  private db = getFirestore();
  private collection = collection(this.db, 'chats');

  async create(chatData: Omit<Chat, 'id' | 'createdAt' | 'updatedAt'>): Promise<Chat> {
    const docRef = await addDoc(this.collection, {
      ...chatData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const doc = await getDoc(docRef);
    return { id: doc.id, ...doc.data() } as Chat;
  }

  async findById(id: string): Promise<Chat | null> {
    const docRef = doc(this.db, 'chats', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    return { id: docSnap.id, ...docSnap.data() } as Chat;
  }

  async findAll(): Promise<Chat[]> {
    const q = query(
      this.collection,
      orderBy('updatedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Chat[];
  }

  async updateLastMessage(id: string, message: string): Promise<Chat> {
    const docRef = doc(this.db, 'chats', id);
    await updateDoc(docRef, {
      lastMessage: message,
      updatedAt: serverTimestamp()
    });

    const updatedDoc = await getDoc(docRef);
    return { id: updatedDoc.id, ...updatedDoc.data() } as Chat;
  }
}

export class FirebaseProdutoDataSource implements IProdutoDataSource {
  private db = getFirestore();
  private collection = collection(this.db, 'produtos');

  async create(produtoData: Omit<Produto, 'id' | 'createdAt' | 'updatedAt'>): Promise<Produto> {
    const docRef = await addDoc(this.collection, {
      ...produtoData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const doc = await getDoc(docRef);
    return { id: doc.id, ...doc.data() } as Produto;
  }

  async findById(id: string): Promise<Produto | null> {
    const docRef = doc(this.db, 'produtos', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    return { id: docSnap.id, ...docSnap.data() } as Produto;
  }

  async findAll(): Promise<Produto[]> {
    const q = query(this.collection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Produto[];
  }

  async update(id: string, produtoData: Partial<Produto>): Promise<Produto> {
    const docRef = doc(this.db, 'produtos', id);
    await updateDoc(docRef, {
      ...produtoData,
      updatedAt: serverTimestamp()
    });

    const updatedDoc = await getDoc(docRef);
    return { id: updatedDoc.id, ...updatedDoc.data() } as Produto;
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.db, 'produtos', id);
    await deleteDoc(docRef);
  }

  async updateStock(id: string, quantity: number): Promise<Produto> {
    const docRef = doc(this.db, 'produtos', id);
    const produtoDoc = await getDoc(docRef);
    
    if (!produtoDoc.exists()) {
      throw new Error('Produto não encontrado');
    }

    const produtoData = produtoDoc.data() as Produto;
    const novoEstoque = (produtoData.stock || 0) + quantity;

    if (novoEstoque < 0) {
      throw new Error('Estoque insuficiente');
    }

    await updateDoc(docRef, {
      stock: novoEstoque,
      updatedAt: serverTimestamp()
    });

    const updatedDoc = await getDoc(docRef);
    return { id: updatedDoc.id, ...updatedDoc.data() } as Produto;
  }
}

export class FirebasePedidoDataSource implements IPedidoDataSource {
  private db = getFirestore();
  private collection = collection(this.db, 'pedidos');

  async create(pedidoData: Omit<Pedido, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pedido> {
    const docRef = await addDoc(this.collection, {
      ...pedidoData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const doc = await getDoc(docRef);
    return { id: doc.id, ...doc.data() } as Pedido;
  }

  async findById(id: string): Promise<Pedido | null> {
    const docRef = doc(this.db, 'pedidos', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    return { id: docSnap.id, ...docSnap.data() } as Pedido;
  }

  async findByUserEmail(email: string): Promise<Pedido[]> {
    const q = query(
      this.collection,
      where('userEmail', '==', email),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Pedido[];
  }

  async findAll(): Promise<Pedido[]> {
    const q = query(
      this.collection,
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Pedido[];
  }

  async updateStatus(id: string, status: 'pendente' | 'pago' | 'cancelado'): Promise<Pedido> {
    const docRef = doc(this.db, 'pedidos', id);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp()
    });

    const updatedDoc = await getDoc(docRef);
    return { id: updatedDoc.id, ...updatedDoc.data() } as Pedido;
  }

  async updatePaymentMethod(id: string, method: 'pix' | 'dinheiro'): Promise<Pedido> {
    const docRef = doc(this.db, 'pedidos', id);
    await updateDoc(docRef, {
      paymentMethod: method,
      updatedAt: serverTimestamp()
    });

    const updatedDoc = await getDoc(docRef);
    return { id: updatedDoc.id, ...updatedDoc.data() } as Pedido;
  }
}

export class FirebaseInscricaoDataSource implements IInscricaoDataSource {
  private db = getFirestore();
  private collection = collection(this.db, 'inscricoes');

  async create(inscricaoData: Omit<Inscricao, 'id' | 'createdAt' | 'updatedAt'>): Promise<Inscricao> {
    const docRef = await addDoc(this.collection, {
      ...inscricaoData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const doc = await getDoc(docRef);
    return { id: doc.id, ...doc.data() } as Inscricao;
  }

  async findAll(): Promise<Inscricao[]> {
    const q = query(
      this.collection,
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Inscricao[];
  }

  async findByUserId(userId: string): Promise<Inscricao[]> {
    const q = query(
      this.collection,
      where('usuarioId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Inscricao[];
  }

  async findByEsporteId(esporteId: string): Promise<Inscricao[]> {
    const q = query(
      this.collection,
      where('esporteId', '==', esporteId),
      orderBy('createdAt', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Inscricao[];
  }

  async updateStatus(id: string, status: 'pendente' | 'aprovado' | 'rejeitado'): Promise<Inscricao> {
    const docRef = doc(this.db, 'inscricoes', id);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp()
    });

    const updatedDoc = await getDoc(docRef);
    return { id: updatedDoc.id, ...updatedDoc.data() } as Inscricao;
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.db, 'inscricoes', id);
    await deleteDoc(docRef);
  }
}

export class FirebaseMensagemDataSource implements IMensagemDataSource {
  private db = getFirestore();
  private collection = collection(this.db, 'mensagens');

  async create(mensagemData: Omit<Mensagem, 'id' | 'createdAt' | 'updatedAt'>): Promise<Mensagem> {
    const docRef = await addDoc(this.collection, {
      ...mensagemData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const doc = await getDoc(docRef);
    return { id: doc.id, ...doc.data() } as Mensagem;
  }

  async findByChatId(chatId: string): Promise<Mensagem[]> {
    const q = query(
      this.collection,
      where('chatId', '==', chatId),
      orderBy('createdAt', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Mensagem[];
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.db, 'mensagens', id);
    await deleteDoc(docRef);
  }
}
