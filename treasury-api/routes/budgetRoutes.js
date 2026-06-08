import express from 'express';
import { getAllBudgetItems, createBudgetItem, deleteBudgetItem } from '../controllers/budgetController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllBudgetItems); // Public
router.post('/', authenticateToken, createBudgetItem); // Protected
router.delete('/:id', authenticateToken, deleteBudgetItem); // Protected

export default router;
