require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/solgrader',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '30d',
  frontend_url: process.env.FRONTEND_URL || 'http://localhost:3000',
  groqApiKey: process.env.GROQ_API_KEY,
  rateLimit: {
    windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // Default: 15 minutes
    max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, // Default: 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
  }
}; 