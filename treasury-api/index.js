import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import memberRoutes from './routes/memberRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { authenticateToken } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);
app.use('/_/api/auth', authRoutes);

app.use('/api/members', memberRoutes);
app.use('/_/api/members', memberRoutes);

app.use('/api/transactions', transactionRoutes);
app.use('/_/api/transactions', transactionRoutes);

app.use('/api/budgets', budgetRoutes);
app.use('/_/api/budgets', budgetRoutes);

app.get('/', (req, res) => {
  res.send('Treasury API is running');
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
