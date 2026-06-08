import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const login = (req, res) => {
  const { username, password } = req.body;
  
  // Dummy authentication since there's no Admin model defined in schema yet
  if (username === 'admin' && password === 'admin') {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'supersecret_cihuyy_key', { expiresIn: '1d' });
    res.json({ token, message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
};
