import authService from '../services/authService';

export const login = async (req, res) => {
  try {
    const { idToken } = req.body;
    const result = await authService.login(idToken);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, nome, telefone, curso, dataNascimento, codigo } = req.body;
    const result = await authService.register({ email, password, nome, telefone, curso, dataNascimento, codigo });
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const verifyUser = (req, res) => {
  if (req.user.role !== 'user') return res.status(403).json({ error: 'Acesso negado' });
  res.status(200).json({ access: 'granted' });
};

export const verifyAdmin = (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso negado' });
  res.status(200).json({ access: 'granted' });
};
