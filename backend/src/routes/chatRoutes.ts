import { Router } from 'express';
import { getChatMessages, sendChatMessage } from '../controllers/chatController.js';

const router = Router();

router.get('/messages', getChatMessages);
router.post('/messages', sendChatMessage);

export default router;
