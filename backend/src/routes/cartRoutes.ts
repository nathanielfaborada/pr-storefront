import { Router } from 'express';
import { holdItem, releaseItem, getSessionHolds } from '../controllers/cartController.js';

const router = Router();

router.post('/hold', holdItem);
router.post('/release', releaseItem);
router.get('/holds/:sessionId', getSessionHolds);

export default router;
