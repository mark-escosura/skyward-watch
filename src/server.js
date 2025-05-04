const express = require('express');
const path = require('path');
const config = require('./config/config');
const securityMiddleware = require('./middleware/security');
const WeatherController = require('./controllers/weatherController');

class Server {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupStaticFiles();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    securityMiddleware(this.app);
  }

  setupRoutes() {
    this.app.get('/api/weather/:city', WeatherController.getWeather);
  }

  setupStaticFiles() {
    this.app.use(
      express.static(path.join(__dirname, '../public'), {
        maxAge: config.cache.staticFiles.maxAge,
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
          }
        },
      })
    );
  }

  setupErrorHandling() {
    this.app.use((err, req, res, next) => {
      console.error('Unhandled error:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
  }

  start() {
    this.app.listen(config.app.port, () => {
      console.log(
        `Server running in ${config.app.env} mode on port ${config.app.port}`
      );
    });
  }
}

const server = new Server();
server.start();
