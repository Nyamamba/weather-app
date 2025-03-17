import React, { useState, useEffect } from "react";
import NotificationBell from "./NotificationBell.jsx";
import SearchBar from "./SearchBar.jsx";
import HourlyForecast from "./HourlyForecast.jsx";
import MobileDrawer from "./MobileDrawer.jsx";
import User from "./User.jsx";
import { useSubscription } from "./SubscriptionContext.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./current.css";

const CurrentWeather = ({
  city,
  setCity,
  forecastData,
  hourlyData,
  weather,
  validCity,
}) => {
  const currentWeather = forecastData?.[0];

  // Get email from subscription context
  const { email } = useSubscription();

  // State for Date & Time
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [openDrawer, setOpenDrawer] = useState("false");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1028); //  Check if mobile

  // ✅ Update state when screen resizes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1028);
      if (window.innerWidth >= 1028) {
        setOpenDrawer(false); // Close drawer on desktop
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
      );
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true, // Ensures AM/PM format
        })
      );
    };

    updateDateTime(); // Initialize immediately
    const interval = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <main className="current-page">
      <section className="current-page-info">
        <nav>
          <section className="city-date-time">
            <p className="city">{validCity}</p>
            <div className="date-time">
              <p>{currentDate}</p>
              <p className="time">{currentTime}</p>
            </div>
          </section>

          <section className="search-bell">
            <div className="search-bar">
              <SearchBar setCity={setCity} />
            </div>

            <div className="search-icon">
              <FontAwesomeIcon
                className="icon"
                icon={faMagnifyingGlass}
                style={{ color: "white", fontSize: "24px", cursor: "pointer" }}
                onClick={() => isMobile && setOpenDrawer(true)}
              />
            </div>
            <div className="notification-bell">
              <NotificationBell validCity={validCity} />
            </div>

            {/* show user component ONLY if email is set */}
            {email && (
              <div className="">
                <User />
              </div>
            )}
          </section>
        </nav>

        {/* Big Weather Section */}
        <section className="big-weather">
          <section className="big-weather-child">
            <h1>
              {currentWeather
                ? currentWeather.weather[0].description
                : "Loading..."}
            </h1>
            <h3>
              {currentWeather
                ? `${Math.round(currentWeather.main.temp)}°C`
                : "--"}
            </h3>
          </section>
        </section>

        <section className="current-hourly-forecast">
          <HourlyForecast hourlyData={hourlyData} />
        </section>
      </section>

      {/* ✅ Include the drawer and pass state */}
      {isMobile && (
        <MobileDrawer
          open={openDrawer}
          setOpen={setOpenDrawer}
          setCity={setCity}
          city={city}
          forecastData={forecastData}
          weather={weather}
          validCity={validCity} // Pass validCity to MobileDrawer
        />
      )}
    </main>
  );
};

export default CurrentWeather;
