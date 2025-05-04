const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('../config/config');

module.exports = (app) => {
  // Security headers
  app.use(helmet());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: config.security.rateLimit.windowMs,
    max: config.security.rateLimit.max,
    message: 'Too many requests from this IP, please try again later.',
  });
  app.use(limiter);

  // CORS
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
};
