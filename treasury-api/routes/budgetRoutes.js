import express from 'express';
import { getAllBudgetItems, createBudgetItem, deleteBudgetItem } from '../controllers/budgetController.js';

const router = express.Router();

router.get('/', getAllBudgetItems);
router.post('/', createBudgetItem);
router.delete('/:id', deleteBudgetItem);

export default router;
