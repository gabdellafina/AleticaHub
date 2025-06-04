const authService = require('../services/authService');

exports.login = async (req, res) => {
  try {
    const { idToken } = req.body;
    const result = await authService.login(idToken);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.verifyUser = (req, res) => {
  if (req.user.role !== 'user') return res.status(403).json({ error: 'Acesso negado' });
  res.status(200).json({ access: 'granted' });
};

exports.verifyAdmin = (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso negado' });
  res.status(200).json({ access: 'granted' });
};
