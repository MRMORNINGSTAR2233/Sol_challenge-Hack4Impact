const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { catchAsync } = require('../utils/error-handler');
const aiService = require('../services/ai.service');
const Chat = require('../models/chat.model');

// Protected routes
router.use(authenticate);

// Grade assignment
router.post('/grade', catchAsync(async (req, res) => {
  const { submission, rubric, studentId } = req.body;
  const result = await aiService.gradeAssignment(submission, rubric, studentId);
  res.json({
    status: 'success',
    data: result,
  });
}));

// Generate feedback
router.post('/feedback', catchAsync(async (req, res) => {
  const { submission, grade, studentId } = req.body;
  const result = await aiService.generateFeedback(submission, grade, studentId);
  res.json({
    status: 'success',
    data: result,
  });
}));

// Chat with AI assistant
router.post('/chat', catchAsync(async (req, res) => {
  const { message, assignmentId } = req.body;
  
  // Find or create chat thread
  let chat = await Chat.findOne({
    userId: req.user.id,
    assignmentId: assignmentId || null,
  });
  
  if (!chat) {
    chat = await Chat.create({
      userId: req.user.id,
      assignmentId,
      messages: [],
    });
  }
  
  // Add user message
  chat.messages.push({
    role: 'user',
    content: message,
  });
  
  // Get AI response
  const aiResponse = await aiService.chat(chat.messages, {
    studentId: req.user.id,
    assignmentId,
  });
  
  // Add AI response
  chat.messages.push({
    role: 'assistant',
    content: aiResponse.response,
  });
  
  await chat.save();
  
  res.json({
    status: 'success',
    data: {
      message: aiResponse.response,
      chatId: chat._id,
    },
  });
}));

// Get chat history
router.get('/chat/:assignmentId?', catchAsync(async (req, res) => {
  const { assignmentId } = req.params;
  
  const chat = await Chat.findOne({
    userId: req.user.id,
    assignmentId: assignmentId || null,
  });
  
  res.json({
    status: 'success',
    data: chat?.messages || [],
  });
}));

module.exports = router; 