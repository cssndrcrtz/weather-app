import React, { useState, useEffect } from "react";
import WeatherBackground from "./components/WeatherBackground";
import {
  convertTemperature,
  getVisibilityValue,
  getHumidityValue,
  getWindDirection,
} from "./components/Helper";
import {
  HumidityIcon,
  SunriseIcon,
  SunsetIcon,
  VisibilityIcon,
  WindIcon,
} from "./components/Icons";

const App = () => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [suggestion, setSuggestion] = useState([]);
  const [unit, setUnit] = useState("C");
  const [error, setError] = useState("");

  useEffect(() => {
    if (city.trim().length >= 3 && !weather) {
      const timer = setTimeout(() => fetchSuggestions(city), 500);
      return () => clearTimeout(timer);
    }
    setSuggestion([]);
  }, [city, weather]);

  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&appid=${API_KEY}`
      );
      response.ok ? setSuggestion(await response.json()) : setSuggestion([]);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestion([]);
    }
  };

  const fetchWeatherData = async (url, name = "") => {
    setError("");
    setWeather(null);
    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error((await response.json()).message || "City not found");

      const data = await response.json();
      setWeather(data);
      setCity(name || data.name);
      setSuggestion([]);
    } catch (err) {
      setError(err.message);
      setWeather(null);
      console.error("Error fetching weather data:", err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return setError("Please enter a valid city name.");
    await fetchWeatherData(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
  };

  const getWeatherCondition = () =>
    weather && {
      main: weather.weather[0].main,
      dt: weather.dt,
      sys: weather.sys,
    };

  return (
    <div className="relative min-h-screen">
      {error && (
        <div
          className="w-70 fixed top-4 right-4 z-50 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg flex items-start gap-2"
          role="alert"
        >
          <p className="font-bold capitalize flex-1">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-700 hover:text-red-900 font-bold ml-2"
          >
            &times;
          </button>
        </div>
      )}

      <WeatherBackground condition={getWeatherCondition()} />
      <div className="flex items-center justify-center p-6 min-h-screen">
        <div className="w-[500px] h-auto bg-transparent bg-opacity-100 backdrop-blur-lg p-8 rounded-lg shadow-lg">
          <form
            onSubmit={handleSearch}
            className="flex flex-col relative gap-4"
          >
            <input
              type="text"
              placeholder="Search for a city..."
              className="w-full p-2 bg-white/10 rounded-xl shadow-md text-white placeholder:text-gray-400 focus:outline-none"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            {suggestion.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white rounded-lg shadow-lg mt-2 z-10">
                {suggestion.map((s) => (
                  <button
                    type="button"
                    key={`${s.lat}-${s.lon}`}
                    onClick={() =>
                      fetchWeatherData(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${s.lat}&lon=${s.lon}&appid=${API_KEY}&units=metric`,
                        `${s.name}, ${s.country}${
                          s.state ? `, ${s.state}` : ""
                        }`
                      )
                    }
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    {s.name}, {s.country}
                    {s.state && `, ${s.state}`}
                  </button>
                ))}
              </div>
            )}

            {/* Hidden submit button so Enter works */}
            <button type="submit" className="hidden" />
          </form>
          {weather && (
            <div className="flex justify-end items-center my-2">
              <button
                onClick={() => setUnit((u) => (u === "C" ? "F" : "C"))}
                className="bg-white/10 rounded-xl shadow-md text-white p-3 cursor-pointer"
              >
                &deg;{unit}
              </button>
            </div>
          )}

          <h2 className="text-center text-white text-2xl drop-shadow-lg my-2">
            {weather ? weather.name : "City Name"}
          </h2>
          <h1 className="text-center text-white text-7xl sm:text-7xl md:text-7xl lg:text-8xl xl:text-9xl mb-4 drop-shadow-lg">
            {weather
              ? `${Math.round(
                  unit === "C"
                    ? weather.main.temp
                    : (weather.main.temp * 9) / 5 + 32
                )}°${unit}`
              : "--"}
          </h1>

          {weather && (
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="mx-auto my-2"
            />
          )}
          <p className="text-center text-white text-xl mb-4 drop-shadow-lg capitalize">
            {weather ? weather.weather[0].description : "Weather Condition"}
          </p>

          <div className="space-y-6 ">
            {/* Humidity, Wind, Visibility */}
            {weather && weather.main && weather.wind && weather.visibility && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {[
                  [
                    HumidityIcon,
                    "Humidity",
                    `${weather.main.humidity}% (${getHumidityValue(
                      weather.main.humidity
                    )})`,
                  ],
                  [
                    WindIcon,
                    "Wind",
                    `${weather.wind.speed} m/s ${
                      weather.wind.deg
                        ? `(${getWindDirection(weather.wind.deg)})`
                        : ""
                    }`,
                  ],
                  [
                    VisibilityIcon,
                    "Visibility",
                    getVisibilityValue(weather.visibility),
                  ],
                ].map(([Icon, label, value]) => (
                  <div
                    key={label}
                    className="flex flex-col items-center p-4 bg-white/10 rounded-xl shadow-md"
                  >
                    <Icon />
                    <p className="mt-1 font-semibold text-base sm:text-lg text-white">
                      {label}
                    </p>
                    <p className="text-xs sm:text-sm text-center text-gray-200">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Sunrise, Sunset */}
            {weather && weather.sys && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {[
                  [SunriseIcon, "Sunrise", weather.sys.sunrise],
                  [SunsetIcon, "Sunset", weather.sys.sunset],
                ].map(([Icon, label, time]) => (
                  <div
                    key={label}
                    className="flex flex-col items-center p-4 bg-white/10 rounded-xl shadow-md"
                  >
                    <Icon />
                    <p className="mt-1 font-semibold text-base sm:text-lg text-white">
                      {label}
                    </p>
                    <p className="text-sm sm:text-base text-gray-200">
                      {new Date(time * 1000).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
