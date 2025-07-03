const authService = require('../services/auth.service');

const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const user = await authService.login(req.body);
    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  register,
  login
};
