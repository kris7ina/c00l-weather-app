import axios from "axios";

export function getWeather(lat, lon, timezone) {
    return axios.get(
      "https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,precipitation_probability,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max&current_weather=true&windspeed_unit=ms&timeformat=unixtime",
      {
        params: {
          latitude: lat,
          longitude: lon,
          timezone,
        }
      }
    )
    .then(({ data }) => {
      return {
        current: parseCurrentWeather(data),
        daily: parseDailyWeather(data),
      }
    })
};

function parseCurrentWeather({ current_weather, daily }) {
  
  const { 
    temperature: currentTemp,
    windspeed: windSpeed,
    weathercode: iconCode, 
  } = current_weather;
  
  const {
    temperature_2m_max: [maxTemp],
    temperature_2m_min: [minTemp],
    precipitation_probability_max: [precip],
  } = daily;
  
  return {
    currentTemp: Math.round(currentTemp),
    highTemp: Math.round(maxTemp),
    lowTemp: Math.round(minTemp),
    windSpeed: Math.round(windSpeed),
    precip: Math.floor(precip / 10) * 10,
    iconCode,
  }
};

function parseDailyWeather({ daily }) {
    return daily.time.map((time, index) => {
        return {
            timestamp: (time * 1000) + 86400000,
            iconCode: daily.weathercode[index],
            maxTemp: Math.round(daily.temperature_2m_max[index]),
            minTemp: Math.round(daily.temperature_2m_min[index]),
            precip: Math.floor(daily.precipitation_probability_max[index] / 10) * 10,
        }
    })
};