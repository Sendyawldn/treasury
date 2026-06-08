import express from 'express';
import { getAllMembers, createMember, deleteMember } from '../controllers/memberController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllMembers); // Public
router.post('/', authenticateToken, createMember); // Protected
router.delete('/:id', authenticateToken, deleteMember); // Protected

export default router;
