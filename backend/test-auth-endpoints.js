/**
 * Test script for Auth Endpoints
 * Run with: node test-auth-endpoints.js
 */

const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:5001/api';
let authToken = null;
let userId = null;

// Test user data
const testUser = {
  name: 'Test User',
  email: `test${Date.now()}@example.com`, // Unique email to avoid conflicts
  password: 'test1234',
  role: 'student',
  institution: 'Test University'
};

// Color codes for console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Helper functions
const log = {
  info: (msg) => console.log(`${colors.cyan}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  divider: () => console.log('-'.repeat(50))
};

// API client
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Tests
async function testRegistration() {
  log.info('Testing user registration...');
  
  try {
    const response = await api.post('/auth/register', testUser);
    authToken = response.data.token;
    userId = response.data.user.id;
    
    log.success('User registration successful');
    log.info(`User created with ID: ${userId}`);
    log.info(`JWT Token: ${authToken.substring(0, 20)}...`);
    
    return true;
  } catch (error) {
    log.error(`Registration failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testLogin() {
  log.info('Testing user login...');
  
  try {
    const response = await api.post('/auth/login', {
      email: testUser.email,
      password: testUser.password
    });
    
    authToken = response.data.token;
    log.success('Login successful');
    log.info(`JWT Token: ${authToken.substring(0, 20)}...`);
    
    return true;
  } catch (error) {
    log.error(`Login failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testGetCurrentUser() {
  log.info('Testing get current user...');
  
  try {
    const response = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    log.success('Retrieved user profile successfully');
    log.info(`User: ${JSON.stringify(response.data, null, 2)}`);
    
    return true;
  } catch (error) {
    log.error(`Get current user failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testLogout() {
  log.info('Testing logout...');
  
  try {
    const response = await api.post('/auth/logout', {}, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    log.success('Logout successful');
    log.info(`Response: ${JSON.stringify(response.data, null, 2)}`);
    
    return true;
  } catch (error) {
    log.error(`Logout failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Run tests
async function runTests() {
  log.divider();
  log.info('Starting Auth API tests');
  log.divider();
  
  let success = await testRegistration();
  log.divider();
  
  if (success) {
    success = await testGetCurrentUser();
    log.divider();
  } else {
    log.warn('Skipping get current user test due to registration failure');
    log.divider();
  }
  
  // Test login with registered user
  success = await testLogin();
  log.divider();
  
  if (success) {
    success = await testLogout();
    log.divider();
  } else {
    log.warn('Skipping logout test due to login failure');
    log.divider();
  }
  
  log.info('Auth API tests completed');
  log.divider();
}

// Run the tests
runTests().catch(error => {
  log.error(`Unhandled error: ${error.message}`);
}); 