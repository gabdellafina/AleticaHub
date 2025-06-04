const esporteService = require('../services/esporteService');

exports.listar = async (req, res) => {
  const esportes = await esporteService.listar();
  res.status(200).json(esportes);
};

exports.criar = async (req, res) => {
  const { nome } = req.body;
  const esporte = await esporteService.criar(nome);
  res.status(201).json(esporte);
};

exports.editar = async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  const esporte = await esporteService.editar(id, nome);
  res.status(200).json(esporte);
};

exports.deletar = async (req, res) => {
  const { id } = req.params;
  const result = await esporteService.deletar(id);
  res.status(200).json(result);
};
