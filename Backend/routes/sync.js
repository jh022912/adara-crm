import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { manualSyncHandler } from '../jobs/syncLeadsJob.js';
import { getSheetStats } from '../services/googleSheetsService.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/leads', manualSyncHandler);

router.get('/stats', async (req, res) => {
  try {
    const stats = await getSheetStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
