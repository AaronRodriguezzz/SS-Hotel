const express = require('express');
const router = express.Router();
const ChatBot = require('../../Controller/chatbot/geminiApi');

router.post('/api/ask/chatbot', ChatBot.chat_bot);


module.exports = router;