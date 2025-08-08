import React from "react";
import windIcon from "../assets/icons/wind.svg";
import humidityIcon from "../assets/icons/humidity.svg";
import visibilityIcon from "../assets/icons/visibility.svg";
import sunriseIcon from "../assets/icons/sunrise.svg";
import sunsetIcon from "../assets/icons/sunset.svg";

const Icon = ({ src, alt, className }) => (
  <img src={src} alt={alt} className={`w-6 h-6 inline-block ${className}`} />
);

export const WindIcon = () => (
  <Icon src={windIcon} alt="wind" className="animate-icon svg-hover" />
);
export const HumidityIcon = () => (
  <Icon
    src={humidityIcon}
    alt="humidity"
    className="powerful-pulse svg-hover"
  />
);
export const VisibilityIcon = () => (
  <Icon
    src={visibilityIcon}
    alt="visibility"
    className="powerful-pulse svg-hover"
  />
);
export const SunriseIcon = () => (
  <Icon src={sunriseIcon} alt="sunrise" className="powerful-pulse svg-hover" />
);
export const SunsetIcon = () => (
  <Icon src={sunsetIcon} alt="sunset" className="powerful-pulse svg-hover" />
);
