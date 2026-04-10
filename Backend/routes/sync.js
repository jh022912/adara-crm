import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { manualSyncHandler } from '../jobs/syncLeadsJob.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/leads', manualSyncHandler);

export default router;
