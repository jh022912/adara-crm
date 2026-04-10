import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { listCompanies, getCompany, addCompany, editCompany, removeCompany } from '../controllers/companyController.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', listCompanies);
router.get('/:id', getCompany);
router.post('/', addCompany);
router.patch('/:id', editCompany);
router.delete('/:id', removeCompany);

export default router;
