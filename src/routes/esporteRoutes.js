const express = require('express');
const router = express.Router();
const esporteController = require('../controllers/esporteController');
const verificarToken = require('../middlewares/verificarToken');
const checkRole = require('../middlewares/checkRole');

router.get('/', verificarToken, esporteController.listar);
router.post('/', verificarToken, checkRole('admin'), esporteController.criar);
router.put('/:id', verificarToken, checkRole('admin'), esporteController.editar);
router.delete('/:id', verificarToken, checkRole('admin'), esporteController.deletar);

module.exports = router;
