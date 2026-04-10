import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { listLeads, getLead, addLead, editLead, removeLead } from '../controllers/leadController.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/company/:companyId', listLeads);
router.get('/:id', getLead);
router.post('/', addLead);
router.patch('/:id', editLead);
router.delete('/:id', removeLead);

export default router;
