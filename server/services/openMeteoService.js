const axios = require("axios");

const GEO_BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_BASE_URL = "https://api.open-meteo.com/v1/forecast";

async function searchCity(name) {
  const trimmed = (name || "").trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const response = await axios.get(GEO_BASE_URL, {
    params: {
      name: trimmed,
      count: 5,
      language: "en",
      format: "json",
    },
  });

  const results = response.data?.results;
  if (!Array.isArray(results) || results.length === 0) return [];

  return results.map((r) => ({
    id: r.id,
    name: r.name,
    country: r.country,
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

async function getWeather(lat, lng) {
  const latitude = Number(lat);
  const longitude = Number(lng);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error("Invalid lat/lng");
  }

  const response = await axios.get(WEATHER_BASE_URL, {
    params: {
      latitude,
      longitude,
      current_weather: true,
      hourly: "temperature_2m,windspeed_10m",
      forecast_days: 1,
    },
  });

  const current_weather = response.data?.current_weather;
  const hourly = response.data?.hourly;

  if (!current_weather || !hourly) {
    throw new Error("Weather data unavailable");
  }

  return {
    current_weather: {
      temperature: current_weather.temperature,
      windspeed: current_weather.windspeed,
      weathercode: current_weather.weathercode,
      time: current_weather.time,
    },
    hourly: {
      time: Array.isArray(hourly.time) ? hourly.time : [],
      temperature_2m: Array.isArray(hourly.temperature_2m)
        ? hourly.temperature_2m
        : [],
    },
  };
}

module.exports = {
  searchCity,
  getWeather,
};
