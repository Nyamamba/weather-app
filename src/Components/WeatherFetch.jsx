import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false });

const WeatherFetch = ({
  city,
  setForecastData,
  setHourlyData,
  setCity,
  setWeather,
  setValidCity,
  setRainData,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!city) return;

    const fetchWeather = async () => {
      setLoading(true);
      NProgress.start();
      try {
        const apiKey = "9c0e72e93b6757ac602c9d42c0a0ba88"; // Add your OpenWeatherMap API key
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
        );

        if (!response.ok) {
          throw new Error("City not found");
        }

        const data = await response.json();

        // Pick 1 data point per day (every 8th entry)
        let dailyForecast = data.list.filter((_, index) => index % 8 === 0);
        dailyForecast = dailyForecast.slice(0, 5);

        if (dailyForecast.length < 5) {
          toast.warn("Limited forecast data available for this city.");
        }

        setForecastData(dailyForecast);
        setHourlyData(data.list.slice(0, 10));

        // Extract the current weather
        const currentWeather = data.list[0].weather[0].main;
        setWeather(currentWeather);

        // Normalize city names and update only if necessary
        const fetchedCity = data.city.name.trim().toLowerCase();
        const currentCity = city.trim().toLowerCase();

        if (currentCity !== fetchedCity) {
          setCity(data.city.name);
        }

        setValidCity(city);

        // Extract rain data
        const rainEvents = data.list
          .filter((entry) =>
            ["Rain", "Drizzle", "Thunderstorm"].includes(entry.weather[0].main)
          )
          .map((entry) => ({
            date: entry.dt_txt.split(" ")[0],
            time: entry.dt_txt.split(" ")[1],
            description: entry.weather[0].description,
          }));

        // Only set rainData if there are rain events
        if (rainEvents.length > 0) {
          setRainData(rainEvents);
        } else {
          setRainData([]); // Clear rainData if no rain events
        }
      } catch (err) {
        if (err.message === "City not found") {
          toast.error("City not found! Please try another one.");
        }

        if (!city || city.trim() === "") {
          setCity("Nairobi");
        }
      } finally {
        setLoading(false);
        NProgress.done();
      }
    };

    const debounceFetch = setTimeout(() => {
      fetchWeather();
    }, 500);

    return () => clearTimeout(debounceFetch);
  }, [
    city,
    setForecastData,
    setHourlyData,
    setCity,
    setValidCity,
    setRainData,
  ]);

  return loading ? <p className="hidden">Loading...</p> : null;
};

export default WeatherFetch;
