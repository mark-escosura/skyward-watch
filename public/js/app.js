document.addEventListener('DOMContentLoaded', () => {
  const cityInput = document.getElementById('cityInput');
  const searchButton = document.getElementById('searchButton');
  const weatherCard = document.getElementById('weatherCard');
  const cityName = document.getElementById('cityName');
  const temperature = document.getElementById('temperature');
  const description = document.getElementById('description');
  const humidity = document.getElementById('humidity');
  const windSpeed = document.getElementById('windSpeed');

  const showError = (message) => {
    weatherCard.classList.add('error');
    cityName.textContent = 'Error';
    temperature.textContent = '--°C';
    description.textContent = message;
    humidity.textContent = '--%';
    windSpeed.textContent = '-- m/s';
  };

  const updateWeather = (data) => {
    weatherCard.classList.remove('error');
    cityName.textContent = data.city;
    temperature.textContent = `${Math.round(data.temperature)}°C`;
    description.textContent = data.description;
    humidity.textContent = `${data.humidity}%`;
    windSpeed.textContent = `${data.windSpeed} m/s`;
  };

  const fetchWeather = async (city) => {
    try {
      const response = await fetch(`/api/weather/${encodeURIComponent(city)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch weather data');
      }

      updateWeather(data);
    } catch (error) {
      showError(error.message);
    }
  };

  const handleSearch = () => {
    const city = cityInput.value.trim();
    if (city) {
      fetchWeather(city);
    }
  };

  searchButton.addEventListener('click', handleSearch);
  cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });
});
