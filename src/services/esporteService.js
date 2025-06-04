const prisma = require('../lib/prisma');

exports.listar = async () => {
  return prisma.esporte.findMany();
};

exports.criar = async (nome) => {
  return prisma.esporte.create({ data: { nome } });
};

exports.editar = async (id, nome) => {
  return prisma.esporte.update({ where: { id }, data: { nome } });
};

exports.deletar = async (id) => {
  if (id === '0') throw new Error('Não é possível excluir o esporte Geral');
  return prisma.esporte.delete({ where: { id } });
};