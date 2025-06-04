const admin = require('../utils/firebaseAdmin');
const prisma = require('../lib/prisma');

exports.login = async (idToken) => {
  if (!idToken) throw new Error('Token não fornecido');

  const decoded = await admin.auth().verifyIdToken(idToken);
  const user = await prisma.usuario.findUnique({ where: { id: decoded.uid } });
  if (!user) throw new Error('Usuário não encontrado');

  return { user, token: idToken };
};
