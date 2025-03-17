// HourlyForecast.js
import React from "react";
import rain from "../assets/rainysmall.png";
import thunderstorm from "../assets/thunderstormsmall.png";
import snow from "../assets/snowsmall.png";
import sunny from "../assets/sunnysmall.png";
import cloudy from "../assets/cloudsmall.png";
import "./hourly.css";
import "../index.css";

const weatherIcons = {
  Rain: rain,
  Thunderstorm: thunderstorm,
  Clear: sunny,
  Clouds: cloudy,
  Snow: snow,
};

const HourlyForecast = ({ hourlyData }) => {
  if (!hourlyData || hourlyData.length === 0) {
    return <p className="text-white">Loading hourly forecast......</p>;
  }

  return (
    <main className="hourly-forecast">
      <div className="hourly-container">
        {hourlyData.map((hour, index) => (
          <div key={index} className="hour-card">
            <p className="hour-time">
              {new Date(hour.dt * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <img
              className="weather-icon"
              src={weatherIcons[hour.weather[0].main] || cloudy}
              alt={hour.weather[0].description}
            />
            <p className="hour-temp">{Math.round(hour.main.temp)}°C</p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default HourlyForecast;
