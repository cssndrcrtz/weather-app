import React from "react";

const WeatherBackground = ({ condition }) => {
  const backgrounds = {
    Thunderstorm: "linear-gradient(0deg, #6E7C84 0%, #668BA7 100%)",
    Drizzle: "linear-gradient(0deg, #B3CDE0 0%, #6497B1 100%)",
    Rain: "linear-gradient(0deg, #5D737E 0%, #64A6BD 100%)",
    Snow: "linear-gradient(0deg, #E0F7FA 0%, #B2EBF2 100%)",
    Clear: {
      day: "linear-gradient(0deg, #87CEFA 0%, #00BFFF 100%)",
      night: "linear-gradient(0deg, #0D1B2A 0%, #1B263B 100%)",
    },
    Clouds: {
      day: "linear-gradient(0deg, #B0BEC5 0%, #90A4AE 100%)",
      night: "linear-gradient(0deg, #37474F 0%, #263238 100%)",
    },
    Mist: "linear-gradient(0deg, #CFD8DC 0%, #B0BEC5 100%)",
    Smoke: "linear-gradient(0deg, #B0BEC5 0%, #90A4AE 100%)",
    Haze: "linear-gradient(0deg, #ECEFF1 0%, #CFD8DC 100%)",
    Fog: "linear-gradient(0deg, #B0BEC5 0%, #78909C 100%)",
    default: "linear-gradient(0deg, #71DDFF 0%, #B7EEFF 66%, #C4F1FF 71%)",
  };

  const getBackground = () => {
    if (!condition) return backgrounds.default;
    const weatherType = condition.main;
    const isDay =
      condition.dt < condition.sys.sunset &&
      condition.dt > condition.sys.sunrise;

    if (backgrounds[weatherType]) {
      if (typeof backgrounds[weatherType] === "object") {
        return isDay
          ? backgrounds[weatherType].day
          : backgrounds[weatherType].night;
      }
      return backgrounds[weatherType];
    }
    return backgrounds.default;
  };

  const background = getBackground();

  return (
    <div
      className="fixed inset-0 z-0"
      style={{ backgroundImage: background }}
    />
  );
};

export default WeatherBackground;
