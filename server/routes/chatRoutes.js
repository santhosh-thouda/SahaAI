import express from 'express';
import {
    createChat,
    getAllChats,
    getChatById,
    sendMessage,
    deleteChat,
    renameChat
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Protect all routes

router.get('/all', getAllChats);
router.get('/:id', getChatById);
router.post('/create', createChat);
router.post('/message', sendMessage);
router.delete('/:id', deleteChat);
router.put('/:id', renameChat);

export default router;
