import React from "react";
import "./forecast.css";
import WeatherFetch from "./WeatherFetch";
import rain from "../assets/rainysmall.png";
import thunderstorm from "../assets/thunderstormsmall.png";
import snow from "../assets/snowsmall.png";
import sunny from "../assets/sunnysmall.png";
import cloudy from "../assets/cloudsmall.png";

const weatherIcons = {
  Rain: rain,
  Thunderstorm: thunderstorm,
  Clear: sunny,
  Clouds: cloudy,
  Snow: snow,
};

const Forecast = ({
  forecastData,
  city,
  setCity,
  setForecastData,
  setHourlyData,
  validCity,
}) => {
  console.log("Forecast Data:", forecastData);
  return (
    <main className="forecast-main">
      <WeatherFetch
        city={city}
        setForecastData={setForecastData}
        setHourlyData={setHourlyData}
        setCity={setCity}
      />
      <section className="place">
        <p>{validCity}</p>
      </section>

      {forecastData?.[0]?.main?.temp ? (
        <>
          {/* Current Weather */}
          <section className="current-weather">
            <div className="current-weather-box">
              <p className="day-temp">
                {Math.round(forecastData[0].main.temp)}°C
              </p>
            </div>
          </section>

          <section className="forecast-title">
            <h3>
              Next <b>5</b> Days Forecast
            </h3>
          </section>
          {/* 7-Day Forecast */}
          <section className="forecast">
            {forecastData.map((day, index) => (
              <section className="forecast-days" key={index}>
                <section className="forecast-days-img">
                  <img
                    src={weatherIcons[day.weather[0].main] || sunny}
                    alt={day.weather[0].description}
                  />
                </section>
                <section className="day-date-weather">
                  <p className="day-date">
                    {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="weather-description">
                    {day.weather[0].description}
                  </p>
                </section>
                <section className="forecast-temp">
                  <p>{Math.round(day.main.temp_max)}°C</p>
                  <p>{Math.round(day.main.temp_min)}°C</p>
                </section>
              </section>
            ))}
          </section>
        </>
      ) : (
        <div>
          <p className="p-2">Loading 5-day forecast...</p>
        </div>
      )}
    </main>
  );
};

export default Forecast;
