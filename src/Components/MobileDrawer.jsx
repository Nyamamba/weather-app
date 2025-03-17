import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar.jsx";
import "./drawer.css";
import {
  motion,
  useDragControls,
  useMotionValue,
  useAnimate,
} from "framer-motion";
import useMeasure from "react-use-measure";

// background images
import clear from "../assets/sunny.jpg";
import cloudy from "../assets/cloudy.jpg";
import thunderstorm from "../assets/thunderstorm.jpg";
import snow from "../assets/snow.jpg";
import rain from "../assets/rainy.jpg";

const getDrawerBackground = (weather, city) => {
  const background = (() => {
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
  })();

  // Save background for the city
  const storedBackgrounds =
    JSON.parse(localStorage.getItem("cityBackgrounds")) || {};
  storedBackgrounds[city] = background;
  localStorage.setItem("cityBackgrounds", JSON.stringify(storedBackgrounds));

  return background;
};

const MobileDrawer = ({
  open,
  setOpen,
  setCity,
  forecastData,
  weather,
  validCity,
}) => {
  const [searchHistory, setSearchHistory] = useState([]);

  // Load search history from local storage
  useEffect(() => {
    const storedHistory =
      JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(storedHistory);
  }, []);

  // Update search history when forecastData changes
  useEffect(() => {
    if (validCity && forecastData?.length > 0) {
      const weatherDescription =
        forecastData[0]?.weather[0]?.description || "Unknown";
      const currentTemp = Math.round(forecastData[0]?.main?.temp) || "N/A";
      const maxTemp = Math.round(forecastData[0]?.main?.temp_max) || "N/A";
      const minTemp = Math.round(forecastData[0]?.main?.temp_min) || "N/A";

      const background = getDrawerBackground(weather, validCity); // Get and store background

      setSearchHistory((prevHistory) => {
        const updatedHistory = [
          {
            city: validCity,
            weatherDescription,
            currentTemp,
            maxTemp,
            minTemp,
            background,
          },
          ...prevHistory.filter((item) => item.city !== validCity),
        ].slice(0, 5);

        localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
        return updatedHistory;
      });
    }
  }, [validCity, forecastData]);

  return (
    <DragCloseDrawer open={open} setOpen={setOpen}>
      <section className="drawer">
        <div className="drawer-search">
          <SearchBar setCity={setCity} /> {/* ✅ Pass setCity */}
        </div>
        <div className="w-full">
          <ul className="history-list-mother">
            {searchHistory.map((item, index) => {
              const storedBackgrounds =
                JSON.parse(localStorage.getItem("cityBackgrounds")) || {};
              const cityBackground =
                storedBackgrounds[item.city] || item.background;

              return (
                <li
                  key={index}
                  className="text-white history-list flex justify-between gap-2 cursor-pointer"
                  style={{
                    backgroundImage: `url(${cityBackground})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                  onClick={() => {
                    setCity(item.city);
                    setOpen(false);
                  }}
                >
                  <div className="flex flex-col items-start gap-8">
                    <p className="text-lg font-bold">{item.city}</p>
                    <p className="text-sm text-white">
                      {item.weatherDescription}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-8">
                    <p className="text-lg">{item.currentTemp}°</p>
                    <p className="text-sm">
                      {item.maxTemp}°C / {item.minTemp}°
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </DragCloseDrawer>
  );
};

export default MobileDrawer;

const DragCloseDrawer = ({ open, setOpen, children }) => {
  const [scope, animate] = useAnimate();
  const controls = useDragControls();
  const y = useMotionValue(0);

  const [drawerRef, { height }] = useMeasure();

  const handleClose = async () => {
    animate(scope.current, {
      opacity: [1, 0],
    });

    const yStart = typeof y.get() === "number" ? y.get() : 0;

    await animate("#drawer", {
      y: [yStart, height],
    });

    setOpen(false);
  };

  return (
    <>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          onClick={handleClose}
          ref={scope}
          className="fixed inset-0 bg-neutral-950/70 z-50"
        >
          <motion.div
            ref={drawerRef}
            id="drawer"
            onClick={(e) => e.stopPropagation()}
            initial={{
              y: "100%",
            }}
            animate={{
              y: "0%",
            }}
            style={{ y }}
            transition={{
              ease: "easeInOut",
            }}
            onDragEnd={() => {
              if (y.get() >= 100) {
                handleClose();
              }
            }}
            drag="y"
            dragControls={controls}
            dragListener={false}
            dragConstraints={{
              top: 0,
              bottom: 0,
            }}
            dragElastic={{
              top: 0,
              bottom: 0.5,
            }}
            className="absolute bottom-0 h-[75vh] w-full overflow-hidden rounded-t-3xl bg-neutral-900/70"
          >
            <div className="absolute left-0 right-0 top-0 z-10 flex justify-center bg-neutral-900/70 p-4">
              <button
                onPointerDown={(e) => {
                  controls.start(e);
                }}
                className="h-2 w-14 cursor-grab touch-none rounded-full bg-neutral-700 active:cursor-grabbing"
              ></button>
            </div>
            <div className="scroll-place  relative z-0 h-full overflow-y-scroll">
              <div className="w-full">{children}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};
