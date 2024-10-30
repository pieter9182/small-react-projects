import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

const App = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [forecastData, setForecastData] = useState({});
  const [error, setError] = useState(null);
  const cities = ['Amsterdam', 'Alkmaar', 'Rotterdam', 'Leiden'];
  const API_KEY = '71ddc6856bb1e38268d77835a9377aa3'; 

  const fetchWeatherData = async () => {
      const weatherPromises = cities.map(city => 
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
      );
      const weatherResponses = await Promise.all(weatherPromises);
      setWeatherData(weatherResponses.map(response => response.data));

      const forecastPromises = cities.map(city => 
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)
      );
      const forecastResponses = await Promise.all(forecastPromises);

      const forecastData = {};
      forecastResponses.forEach((response, index) => {
        const cityName = cities[index];
        const forecastList = response.data.list;

        const nextDayForecast = forecastList.find(item => {
          const forecastDate = new Date(item.dt_txt);
          const now = new Date();
          return forecastDate.getDate() !== now.getDate(); 
        });
  
       
        forecastData[cityName] = nextDayForecast;  
      });
  
   
      setForecastData(forecastData);
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  return (
    <div className="weather-app">
      <h1>Weather in the Netherlands</h1>
      {error && <p>{error}</p>}
      <div className="weather-cards">
        {weatherData.length > 0 ? (
          weatherData.map((data, index) => (
            <div className="weather-card" key={index}>
              <h2>{data.name}</h2>
              <div className="weather-icon">
                {data.weather[0].main === 'Clear' ? '☀️' : '🌧️'}
              </div>
              <p className="temperature">{data.main.temp}°C</p>
              <p className="weather-description">{data.weather[0].description}</p>
              <div className="extra-info">
                <p><strong>Humidity:</strong> {data.main.humidity}%</p>
                <p><strong>Wind:</strong> {data.wind.speed} m/s</p>
              </div>

              {forecastData[data.name] ? (
                <div className="forecast">
                  <h3>Tomorrow's Forecast</h3>
                  <p><strong>Temp:</strong> {forecastData[data.name].main.temp}°C</p>
                  <p><strong>Weather:</strong> {forecastData[data.name].weather[0].description}</p>
                </div>
              ) : (
                <p>No forecast available for tomorrow.</p>
              )}
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
  
};

export default App;
