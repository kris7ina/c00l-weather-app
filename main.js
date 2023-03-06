import './style.css'
import axios from 'axios'
import { getWeather } from './weather'
import { ICON_MAP } from './iconMap'
import { WEATHER_MAP } from './iconMap'

document
.getElementById("search-btn")
.addEventListener("click", fetchLocation);

document
.querySelector(".search-input")
.addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      fetchLocation();
    }
  });

function fetchLocation() {
  const cityInput = document.getElementById("city-input").value;
  const encodedCityName = encodeURIComponent(cityInput);
  const API_KEY = "7876878efeb5410b951c96bf69e84b18";
  
  document.querySelector("[data-current-location]").textContent = cityInput;

  axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodedCityName}&key=${API_KEY}`)
.then(response => {
  const { lat, lng } = response.data.results[0].geometry;
  return getWeather(lat, lng, Intl.DateTimeFormat().resolvedOptions().timeZone);
})
.then(renderWeather)
.catch((e) => {
  console.error(e);
  alert("Sorry, we couldn't get weather for this location :(")
  /* Fix:
  document.querySelector(".header-city").textContent = "City not found";
  document.querySelector(".header-date-month").textContent = "ERROR";
  document.querySelector(".current-temp").textContent = "404"; */
})
document.getElementById("city-input").value = "";
};

getWeather(43.8563, 18.4131, Intl.DateTimeFormat().resolvedOptions().timeZone).then(renderWeather);

function renderWeather({ current, daily }) {
  renderHeader(current);
  renderCurrentWeather(current);
  renderDailyWeather(daily);
  document.body.classList.remove("blurred");
};

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "long" });
const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, { day: "numeric" });
const MONTH_FORMATTER = new Intl.DateTimeFormat(undefined, { month: "short" });
const MONTH_FULL = new Intl.DateTimeFormat(undefined, { month: "long" });

function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value;
};

function renderHeader(current) {
  setValue("current-date", DATE_FORMATTER.format(current.timestamp));
  setValue("current-month", MONTH_FULL.format(current.timestamp));
};

function getIconUrl(iconCode) {
  return `svg/${ICON_MAP.get(iconCode)}.svg`;
};

const currentIcon = document.querySelector("[data-current-icon]");
const currentWeatherCode = document.querySelector("[data-current-weather]");

function renderCurrentWeather(current) {
  currentIcon.src = getIconUrl(current.iconCode);
  currentWeatherCode.innerHTML = `${WEATHER_MAP.get(current.iconCode)}`;
  setValue("current-temp", current.currentTemp);
  setValue("current-wind", current.windSpeed);
  setValue("current-rain", current.precip);
  setValue("current-high", current.highTemp);
  setValue("current-low", current.lowTemp);
};

const dailySection = document.querySelector("[data-week-section]");
const dailyTable = document.getElementById("daily-template");

function renderDailyWeather(daily) {
  dailySection.innerHTML = "";
  daily.forEach(day => {
    const element = dailyTable.content.cloneNode(true);
    setValue("avg-temp", day.maxTemp, { parent: element });
    setValue("low-temp", day.minTemp, { parent: element });
    setValue("precip", day.precip, { parent: element });
    setValue("day", DAY_FORMATTER.format(day.timestamp), { parent: element });
    setValue("date", DATE_FORMATTER.format(day.timestamp), { parent: element });
    setValue("month", MONTH_FORMATTER.format(day.timestamp), { parent: element });
    element.querySelector("[data-icon]").src = getIconUrl(day.iconCode);
    dailySection.append(element);
  })
};