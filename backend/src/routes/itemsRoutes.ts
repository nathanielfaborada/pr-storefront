import { Router } from 'express';
import { getItems, getItemById } from '../controllers/itemsController.js';

const router = Router();

router.get('/', getItems);
router.get('/:id', getItemById);

export default router;
