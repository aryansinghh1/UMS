const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  sendMessage,
  getConversations,
  getMessages,
  markAsRead,
  getContacts,
  sendAnnouncement,
} = require('../controllers/messageController');

router.use(protect);

router.post('/', sendMessage);
router.post('/announce', sendAnnouncement);
router.get('/conversations', getConversations);
router.get('/contacts', getContacts);
router.get('/course/:courseId/user/:userId', getMessages);
router.put('/read/:courseId/:userId', markAsRead);

module.exports = router;
