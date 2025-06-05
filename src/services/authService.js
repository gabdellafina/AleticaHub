import admin from '../utils/firebaseAdmin';
import prisma from '../lib/prisma';

const login = async (idToken) => {
  if (!idToken) throw new Error('Token não fornecido');
  const decoded = await admin.auth().verifyIdToken(idToken);
  const user = await prisma.usuario.findUnique({ where: { id: decoded.uid } });
  if (!user) throw new Error('Usuário não encontrado');
  return { user, token: idToken };
};

const register = async ({ email, password, nome, telefone, curso, dataNascimento, codigo }) => {
  if (!email || !password || !nome || !telefone || !curso || !dataNascimento) {
    throw new Error('Dados obrigatórios não fornecidos');
  }
  let userRecord;
  try {
    userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: nome,
      phoneNumber: telefone.startsWith('+') ? telefone : undefined
    });
  } catch (err) {
    throw new Error('Erro ao criar usuário no Firebase: ' + err.message);
  }
  const user = await prisma.usuario.create({
    data: {
      id: userRecord.uid,
      nome,
      email,
      telefone,
      curso,
      dataNascimento: new Date(dataNascimento),
      codigo,
      role: 'user',
      status: 'pendente',
    },
  });
  return { user };
};

const authService = { login, register };
export default authService;
