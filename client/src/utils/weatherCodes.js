export function getWeatherLabel(code) {
  const weatherCode = Number(code);
  if (!Number.isFinite(weatherCode)) return 'Unknown';

  if (weatherCode === 0) return 'Clear Sky';
  if (weatherCode >= 1 && weatherCode <= 3) return 'Partly Cloudy';
  if (weatherCode === 45 || weatherCode === 48) return 'Foggy';
  if (weatherCode >= 51 && weatherCode <= 67) return 'Rain';
  if (weatherCode >= 71 && weatherCode <= 77) return 'Snow';
  if (weatherCode >= 80 && weatherCode <= 82) return 'Showers';
  if (weatherCode >= 95 && weatherCode <= 99) return 'Thunderstorm';

  return 'Unknown';
}

export function getWeatherIcon(code) {
  const weatherCode = Number(code);
  if (!Number.isFinite(weatherCode)) return '☁️';

  if (weatherCode === 0) return '☀️';
  if (weatherCode >= 1 && weatherCode <= 3) return '🌤';
  if (weatherCode === 45 || weatherCode === 48) return '🌫';
  if (weatherCode >= 51 && weatherCode <= 67) return '🌧';
  if (weatherCode >= 71 && weatherCode <= 77) return '❄️';
  if (weatherCode >= 80 && weatherCode <= 82) return '🌦';
  if (weatherCode >= 95 && weatherCode <= 99) return '⛈';

  return '☁️';
}
