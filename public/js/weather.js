// DOM Elements
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const conditions = document.getElementById('conditions');
const humidity = document.getElementById('humidity');
const errorMessage = document.getElementById('error-message');

// Event Listeners
searchButton.addEventListener('click', getWeather);
cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    getWeather();
  }
});

async function getWeather() {
  const city = cityInput.value.trim();

  if (!city) {
    showError('Please enter a city name');
    return;
  }

  // Show loading state
  searchButton.disabled = true;
  searchButton.textContent = 'Loading...';
  clearError();
  resetDisplay();

  try {
    const response = await fetch(`/api/weather/${encodeURIComponent(city)}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch weather data');
    }

    if (!data || !data.main || !data.weather) {
      throw new Error('Invalid weather data received');
    }

    displayWeather(data);
  } catch (error) {
    console.error('Error:', error);
    showError(error.message);
  } finally {
    // Reset button state
    searchButton.disabled = false;
    searchButton.textContent = 'Get Weather';
  }
}

function displayWeather(data) {
  try {
    cityName.textContent = data.name;
    temperature.textContent = Math.round(data.main.temp);
    conditions.textContent = data.weather[0].description;
    humidity.textContent = data.main.humidity;
  } catch (error) {
    console.error('Error displaying weather:', error);
    showError('Error displaying weather data');
  }
}

function resetDisplay() {
  cityName.textContent = '--';
  temperature.textContent = '--';
  conditions.textContent = '--';
  humidity.textContent = '--';
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
}

function clearError() {
  errorMessage.textContent = '';
  errorMessage.style.display = 'none';
}
