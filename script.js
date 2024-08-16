document.getElementById('submitBtn').addEventListener('click', function() {
    const city = document.getElementById('cityInput').value.trim();
    if (city === '') {
      alert('Please enter a city name.');
      return;
    }
    fetchWeather(city);
  });
  
  document.getElementById('locationBtn').addEventListener('click', function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeather(`${lat},${lon}`);
      }, function(error) {
        alert('Error getting location. Please enable location services.');
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  });
  
  async function fetchWeather(city) {
    const apiKey = 'ca734531a50f441aa14131146241803';
    const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    
    document.getElementById('loading').style.display = 'block';
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      if (data.error) {
        throw new Error(data.error.message);
      }
  
      displayWeather(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      alert('An error occurred while fetching weather data. Please try again later.');
    } finally {
      document.getElementById('loading').style.display = 'none';
    }
  }
  
  function displayWeather(data) {
    const { location, current } = data;
    const { name, country } = location;
    let { temp_c, condition, humidity, wind_kph } = current;
  
    const tempUnitToggle = document.getElementById('tempUnitToggle');
    const isFahrenheit = tempUnitToggle.checked;
    const temperature = isFahrenheit ? (temp_c * 9 / 5) + 32 : temp_c;
  
    const iconClass = getWeatherIcon(condition.code);
  
    const weatherHTML = `
      <h2>${name}, ${country}</h2>
      <i class="weather-icon ${iconClass}"></i>
      <p class="weather-info">Temperature: ${temperature.toFixed(1)}°${isFahrenheit ? 'F' : 'C'}</p>
      <p class="weather-info">Humidity: ${humidity}%</p>
      <p class="weather-info">Condition: ${condition.text}</p>
      <div class="weather-details">
        <p>Wind: ${wind_kph} kph</p>
        <p>Cloud Cover: ${current.cloud}%</p>
      </div>
    `;
    document.getElementById('weatherDisplay').innerHTML = weatherHTML;
  }
  
  function getWeatherIcon(code) {
    if (code === 1000) return 'fas fa-sun';
    if (code === 1003 || code === 1006) return 'fas fa-cloud';
    if (code >= 1030 && code <= 1063) return 'fas fa-cloud-showers-heavy';
    if (code >= 1066 && code <= 1237) return 'fas fa-snowflake';
    if (code >= 1273 && code <= 1279) return 'fas fa-poo-storm';
    return 'fas fa-sun'; // Default icon
  }
