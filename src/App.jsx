import React, { useState } from "react";
import CurrentWeather from "./Components/CurrentWeather";
import Forecast from "./Components/ForecastDays";
import WeatherFetch from "./Components/WeatherFetch";
import { SubscriptionProvider } from "./Components/SubscriptionContext";
import Message from "./Components/utils/Message.js"; 
import clear from "./assets/sunny.jpg";
import cloudy from "./assets/cloudy.jpg";
import thunderstorm from "./assets/thunderstorm.jpg";
import snow from "./assets/snow.jpg";
import rain from "./assets/rainy.jpg";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Function to get background based on weather
const getBackground = (weather) => {
  switch (weather) {
    case "Clear":
      return clear;
    case "Clouds":
    case "Mist":
    case "Fog":
      return cloudy;
    case "Rain":
    case "Drizzle":
      return rain;
    case "Thunderstorm":
      return thunderstorm;
    case "Snow":
      return snow;
    default:
      return rain;
  }
};

const App = () => {
  const [city, setCity] = useState("Nairobi");
  const [forecastData, setForecastData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [weather, setWeather] = useState(null);
  const [validCity, setValidCity] = useState(city);
  const [rainData, setRainData] = useState([]); 

  const backgroundImage = getBackground(weather);

  return (
    <main
      className="main-app"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        objectFit: "cover",
      }}
    >
      <SubscriptionProvider>
        <WeatherFetch
          city={city}
          setCity={setCity}
          setForecastData={setForecastData}
          setHourlyData={setHourlyData}
          setWeather={setWeather}
          setValidCity={setValidCity}
          setRainData={setRainData} 
        />

        {/* Integrate Message Component */}
        <Message city={validCity} rainData={rainData} />

        <section className="w-full z-20">
          <CurrentWeather
            city={city}
            setCity={setCity}
            forecastData={forecastData}
            hourlyData={hourlyData}
            weather={weather}
            validCity={validCity}
          />
        </section>

        <section className="w-full z-10">
          <Forecast
            forecastData={forecastData}
            hourlyData={hourlyData}
            city={city}
            setCity={setCity}
            setForecastData={setForecastData}
            setHourlyData={setHourlyData}
            validCity={validCity}
          />
        </section>
      </SubscriptionProvider>

      <ToastContainer />
    </main>
  );
};

export default App;
