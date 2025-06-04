const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const verificarToken = require('../middlewares/verificarToken');

router.post('/', verificarToken, async (req, res) => {
  const { uid } = req.user;
  const { nome, curso, dataNascimento } = req.body;

  try {
    const user = await prisma.usuario.create({
      data: {
        id: uid,
        nome,
        curso,
        dataNascimento: new Date(dataNascimento),
        role: 'user',
      },
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar usuário', details: err.message });
  }
});

module.exports = router;
