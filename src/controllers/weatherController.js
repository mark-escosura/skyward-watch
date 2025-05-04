const axios = require('axios');
const config = require('../config/config');

class WeatherController {
  static async getWeather(req, res) {
    try {
      const { city } = req.params;

      if (!city || typeof city !== 'string') {
        return res.status(400).json({ error: 'Invalid city parameter' });
      }

      const response = await axios.get(`${config.weather.baseUrl}/weather`, {
        params: {
          q: city,
          appid: config.weather.apiKey,
          units: config.weather.units,
        },
      });

      const weatherData = {
        temperature: response.data.main.temp,
        description: response.data.weather[0].description,
        humidity: response.data.main.humidity,
        windSpeed: response.data.wind.speed,
        city: response.data.name,
      };

      res.json(weatherData);
    } catch (error) {
      console.error('Weather API error:', error.message);

      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          return res.status(404).json({ error: 'City not found' });
        }
        if (status === 401) {
          return res.status(500).json({ error: 'Invalid API key' });
        }
      }

      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
  }
}

module.exports = WeatherController;
