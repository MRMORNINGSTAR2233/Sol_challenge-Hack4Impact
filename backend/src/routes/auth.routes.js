const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/user.model');
const { authenticate } = require('../middleware/auth.middleware');
const { catchAsync } = require('../utils/error-handler');
const authController = require('../controllers/auth.controller');

// Register user
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('role').isIn(['teacher', 'student']).withMessage('Invalid role'),
    body('institution').trim().notEmpty().withMessage('Institution is required'),
  ],
  catchAsync(authController.register)
);

// Login user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').exists().withMessage('Password is required'),
  ],
  catchAsync(authController.login)
);

// Get current user
router.get('/me', authenticate, catchAsync(authController.getMe));

// Logout user
router.post('/logout', authenticate, catchAsync(authController.logout));

module.exports = router; 