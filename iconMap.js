export const ICON_MAP = new Map();

addMapping([0, 1], "Sun");
addMapping([2], "Cloud_Sun");
addMapping([3], "Cloud");
addMapping([45, 48], "Fog");
addMapping(
  [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82],
  "Rain_Medium"
);
addMapping([71, 73, 75, 77, 85, 86], "Snow_1");
addMapping([95, 96, 99], "Thunder");

function addMapping(values, icon) {
    values.forEach(value => {
        ICON_MAP.set(value, icon);
    });
};

export const WEATHER_MAP = new Map();

addWeather([0, 1], "Sunny");
addWeather([2, 3], "Cloudy");
addWeather([45, 48], "Smog");
addWeather(
  [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99],
  "Rain"
);
addWeather([71, 73, 75, 77, 85, 86], "Snow");

function addWeather(values, str) {
  values.forEach(value => {
      WEATHER_MAP.set(value, str);
  });
};