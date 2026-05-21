const express = require('express');
const router = express.Router();
const {
  getChats,
  getChatById,
  createChat,
  sendMessage,
  deleteChat,
  clearMessages,
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getChats);
router.post('/', createChat);
router.get('/:id', getChatById);
router.post('/:id/message', sendMessage);
router.delete('/:id', deleteChat);
router.delete('/:id/messages', clearMessages);

module.exports = router;
