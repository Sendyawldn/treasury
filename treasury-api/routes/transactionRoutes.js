import express from 'express';
import { getAllTransactions, createTransaction, deleteTransaction } from '../controllers/transactionController.js';

const router = express.Router();

router.get('/', getAllTransactions);
router.post('/', createTransaction);
router.delete('/:id', deleteTransaction);

export default router;
