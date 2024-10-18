const switchBtn = document.getElementById('switch');
const mode = document.querySelector('.mode');

// Switch button for light to dark mode
switchBtn.addEventListener('change', () => {
    if (switchBtn.checked) {
        document.body.classList.add('blue');
    } else {
        document.body.classList.remove('blue');
    }
});

// API and constants
const keyApi = "c5c587937c8e883bc4ec3916ee11b855";
const UrlKey = "https://api.openweathermap.org/data/2.5/forecast?q=";
const cityInput = document.querySelector('.city-input');
const btn = document.querySelector(".sear-btn");

// Fetch weather data for a given city
async function checkWeather(city) {
    const response = await fetch(UrlKey + city + `&appid=${keyApi}`)
        .then(response => response.json())
        .then((data) => {
            displayWeather(data);
        })
        .catch(error => {
            alert("Please enter the country/city name correctly");
        });
}

// Fetch weather by geolocation (current country when the app opens)
async function getWeatherByLocation(lat, lon) {
    const locationUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${keyApi}`;
    const response = await fetch(locationUrl)
        .then(response => response.json())
        .then((data) => {
            displayWeather(data);
        })
        .catch(error => {
            alert("Unable to fetch weather for your location");
        });
}

// Display weather data and 5-day forecast
function displayWeather(data) {
    const temp = document.querySelector('.temp');
    const country = document.querySelector(".country");

    temp.textContent = Math.floor(data.list[0].main.temp - 273); // Convert from Kelvin to Celsius
    country.textContent = data.city.name;

    // 5 Days Forecast
    const forecastContainer = document.querySelector(".forecast-days");
    forecastContainer.innerHTML = ''; // Clear previous forecast

    data.list.forEach((forecast, index) => {
        if (index % 8 === 0) { // Get data every 8 intervals (~3 hours each) to show one per day
            const iconCode = forecast.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            const forecastItem = document.createElement('div');

            forecastItem.classList.add('day');
            forecastItem.innerHTML = `
                <img class="forecastIcon" src="${iconUrl}" alt="${forecast.weather[0].description}" />
                <p>${Math.floor(forecast.main.temp - 273)}°C</p>`; // Convert temperature from Kelvin to Celsius

            forecastContainer.appendChild(forecastItem);
        }
    });

    // Weather details
    const humidity = document.querySelector('.humidity');
    const speed = document.querySelector('.speed');
    const sunRise = document.querySelector('.sunRise');
    const sunSet = document.querySelector('.sunSet');

    humidity.textContent = data.list[0].main.humidity + '%';
    speed.textContent = data.list[0].wind.speed + 'km/h';

    // Get sunrise and sunset times
    const sunriseTimeStamp = data.city.sunrise;
    const sunsetTimeStamp = data.city.sunset;
    const sunriseDate = new Date(sunriseTimeStamp * 1000);
    const sunsetDate = new Date(sunsetTimeStamp * 1000);
    const sunriseTime = sunriseDate.toLocaleTimeString('en-Us', { hour: '2-digit', minute: '2-digit' }).slice(0, 9);
    const sunsetTime = sunsetDate.toLocaleTimeString('en-Us', { hour: '2-digit', minute: '2-digit' });

    sunRise.textContent = sunriseTime;
    sunSet.textContent = sunsetTime;
}

// Fetch weather on search button click
btn.addEventListener('click', () => {
    checkWeather(cityInput.value);
});

// Fetch current location weather and 5-day forecast when the page loads
window.addEventListener('load', getLocationAndWeather);
