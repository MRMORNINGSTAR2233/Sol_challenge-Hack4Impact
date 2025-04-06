const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { AppError } = require('../utils/error-handler');
const config = require('../config');

exports.register = async (req, res) => {
  const { name, email, password, role, institution } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('User already exists', 400);
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
    institution
  });

  // Create token
  const token = jwt.sign(
    { id: user._id },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  // Remove password from output
  user.password = undefined;

  res.status(201).json({
    token,
    user
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid credentials', 401);
  }

  // Create token
  const token = jwt.sign(
    { id: user._id },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  // Remove password from output
  user.password = undefined;

  res.json({
    token,
    user
  });
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json(user);
};

exports.logout = async (req, res) => {
  res.json({ message: 'Logged out successfully' });
}; 