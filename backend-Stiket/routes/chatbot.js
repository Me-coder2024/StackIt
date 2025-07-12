const express = require('express');
const router = express.Router();
const { sendToN8nAgent } = require('../controllers/chatbotController');

// Route: POST /api/chat
router.post('/', sendToN8nAgent);

module.exports = router;
