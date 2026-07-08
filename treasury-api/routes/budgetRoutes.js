import express from 'express';
import { getAllBudgetItems, createBudgetItem, updateBudgetItem, deleteBudgetItem } from '../controllers/budgetController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllBudgetItems); // Public
router.post('/', authenticateToken, createBudgetItem); // Protected
router.put('/:id', authenticateToken, updateBudgetItem); // Protected
router.delete('/:id', authenticateToken, deleteBudgetItem); // Protected

export default router;
