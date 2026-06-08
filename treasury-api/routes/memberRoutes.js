import express from 'express';
import { getAllMembers, createMember, deleteMember } from '../controllers/memberController.js';

const router = express.Router();

router.get('/', getAllMembers);
router.post('/', createMember);
router.delete('/:id', deleteMember);

export default router;
