import express from 'express';
import { getAllTransactions, createTransaction, updateTransaction, deleteTransaction } from '../controllers/transactionController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllTransactions); // Public Read-only
router.post('/', authenticateToken, createTransaction); // Protected
router.put('/:id', authenticateToken, updateTransaction); // Protected
router.delete('/:id', authenticateToken, deleteTransaction); // Protected

export default router;
