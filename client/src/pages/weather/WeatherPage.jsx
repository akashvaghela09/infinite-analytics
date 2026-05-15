import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import PageWrapper from '../../components/common/PageWrapper';
import Card from '../../components/common/Card';
import SearchInput from '../../components/common/SearchInput';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import { CloudSun, MapPin, Wind, Thermometer, Clock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchWeather,
  searchCities,
  setSearchTerm,
  clearSearch,
  clearSearchResults,
  selectCity,
} from '../../redux/weather/weatherSlice';
import { appToast } from '../../redux/app/appSlice';
import TemperatureLineChart from '../../components/charts/TemperatureLineChart';
import { getWeatherIcon, getWeatherLabel } from '../../utils/weatherCodes';

const WeatherPage = () => {
  const dispatch = useDispatch();
  const {
    searchTerm,
    searchResults,
    selectedCity,
    currentWeather,
    hourlyForecast,
    isSearching,
    isLoadingWeather,
    searchError,
    weatherError,
  } = useSelector((state) => state.weather);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const listRef = useRef([]);

  const hours = useMemo(() => {
    const raw = hourlyForecast?.time;
    if (!Array.isArray(raw)) return [];
    return raw.slice(0, 24).map((t) => {
      const d = new Date(t);
      const hh = String(d.getHours()).padStart(2, '0');
      return `${hh}:00`;
    });
  }, [hourlyForecast]);

  const temperatures = useMemo(() => {
    const raw = hourlyForecast?.temperature_2m;
    if (!Array.isArray(raw)) return [];
    return raw.slice(0, 24);
  }, [hourlyForecast]);

  // 400ms debounce for search
  useEffect(() => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      dispatch(clearSearchResults());
      return;
    }

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      dispatch(searchCities(searchTerm.trim()));
      setActiveIndex(-1);
    }, 400);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [dispatch, searchTerm]);

  useEffect(() => {
    if (searchError) {
      dispatch(appToast.error(searchError));
    }
  }, [searchError, dispatch]);

  useEffect(() => {
    const onDocMouseDown = (e) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, []);

  const onSelectCity = useCallback((city) => {
    dispatch(selectCity(city));
    setIsDropdownOpen(false);
    setActiveIndex(-1);
    if (city?.latitude != null && city?.longitude != null) {
      dispatch(
        fetchWeather({
          lat: city.latitude,
          lng: city.longitude,
        })
      );
    }
  }, [dispatch]);

  const handleSearchChange = (e) => {
    const nextValue = e?.target?.value ?? '';
    dispatch(setSearchTerm(nextValue));
    setIsDropdownOpen(true);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isDropdownOpen || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => {
          const next = prev < searchResults.length - 1 ? prev + 1 : 0;
          listRef.current[next]?.scrollIntoView({ block: 'nearest' });
          return next;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => {
          const next = prev > 0 ? prev - 1 : searchResults.length - 1;
          listRef.current[next]?.scrollIntoView({ block: 'nearest' });
          return next;
        });
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < searchResults.length) {
          onSelectCity(searchResults[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsDropdownOpen(false);
        setActiveIndex(-1);
        break;
      default:
        break;
    }
  };

  const conditionLabel = currentWeather
    ? getWeatherLabel(currentWeather.weathercode)
    : '';
  const conditionIcon = currentWeather
    ? getWeatherIcon(currentWeather.weathercode)
    : '';

  const lastUpdated = currentWeather?.time
    ? new Date(currentWeather.time).toLocaleString()
    : '';

  const { minTemp, maxTemp, avgTemp } = useMemo(() => {
    const temps = temperatures;
    if (!temps.length) return { minTemp: null, maxTemp: null, avgTemp: null };
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const avg = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);
    return { minTemp: min, maxTemp: max, avgTemp: avg };
  }, [temperatures]);

  return (
    <PageWrapper title="Weather" description="Check real-time weather and forecasts for any city">
      <div className="mb-6">
        <Card className="p-4">
          <div ref={wrapperRef} className="relative max-w-md">
            <SearchInput
              ref={inputRef}
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              loading={isSearching}
              placeholder="Search city (e.g., London)"
              onClear={() => {
                dispatch(clearSearch());
                setIsDropdownOpen(false);
                setActiveIndex(-1);
              }}
              className="w-full"
            />

            {isDropdownOpen && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-(--bg-secondary) border border-(--border-subtle) rounded-lg overflow-hidden z-20 shadow-lg">
                <div className="max-h-64 overflow-auto">
                  {searchResults.slice(0, 5).map((c, idx) => (
                    <button
                      key={c.id ?? `${c.name}-${c.latitude}-${c.longitude}`}
                      ref={(el) => { listRef.current[idx] = el; }}
                      onClick={() => onSelectCity(c)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`w-full text-left px-4 py-3 transition-colors border-b border-(--border-subtle)/40 last:border-b-0 ${
                        idx === activeIndex
                          ? 'bg-(--bg-elevated)'
                          : 'hover:bg-(--bg-elevated)'
                      }`}
                      type="button"
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 mt-0.5 text-(--accent-400)" strokeWidth={1.5} />
                        <div className="flex-1 min-w-0">
                          <div className="text-(--text-primary) text-sm font-medium truncate">
                            {c.name}{c.admin1 ? `, ${c.admin1}` : ''}
                          </div>
                          <div className="text-(--text-muted) text-xs mt-0.5">
                            {c.country}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isDropdownOpen && searchTerm.trim().length >= 2 && isSearching && (
              <div className="absolute left-0 mt-2 z-20">
                <div className="flex items-center gap-2 px-4 py-3 text-sm text-(--text-secondary)">
                  <Spinner />
                  Searching...
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {!selectedCity && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-(--info) to-(--accent-500) flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(59,130,246,0.3)]">
            <CloudSun className="w-8 h-8 text-white" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-semibold text-(--text-primary) mb-2">
            Search for a City
          </h3>
          <p className="text-(--text-secondary) max-w-md text-center">
            Enter a city name above to see current weather conditions and a 24-hour temperature forecast.
          </p>
        </div>
      )}

      {selectedCity && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-lg bg-(--accent-500)/10">
                  <Thermometer className="w-4 h-4 text-(--accent-400)" strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-2xl font-bold text-(--text-primary) font-mono">
                {currentWeather?.temperature ?? '--'}°C
              </p>
              <p className="text-sm text-(--text-muted) mt-1">Current Temp</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-lg bg-(--accent-500)/10">
                  <Wind className="w-4 h-4 text-(--accent-400)" strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-2xl font-bold text-(--text-primary) font-mono">
                {currentWeather?.windspeed ?? '--'}
              </p>
              <p className="text-sm text-(--text-muted) mt-1">Wind Speed (km/h)</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-lg bg-(--accent-500)/10">
                  <Thermometer className="w-4 h-4 text-(--accent-400)" strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-2xl font-bold text-(--text-primary) font-mono">
                {maxTemp ?? '--'}°C
              </p>
              <p className="text-sm text-(--text-muted) mt-1">High (24h)</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-lg bg-(--accent-500)/10">
                  <Thermometer className="w-4 h-4 text-(--accent-400)" strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-2xl font-bold text-(--text-primary) font-mono">
                {minTemp ?? '--'}°C
              </p>
              <p className="text-sm text-(--text-muted) mt-1">Low (24h)</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="p-6 h-full" variant="elevated">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-(--accent-500)/10 border border-(--accent-500)/30 flex items-center justify-center">
                    <span className="text-3xl">{conditionIcon}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg font-semibold text-(--text-primary) truncate">
                      {selectedCity.name}
                    </div>
                    <div className="text-sm text-(--text-secondary) mt-0.5">
                      {selectedCity.country}
                    </div>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-6">
                  <div className="text-5xl font-bold text-(--text-primary) font-mono">
                    {currentWeather?.temperature ?? '--'}°
                  </div>
                  <div className="text-lg text-(--text-secondary)">C</div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-(--accent-500)/10 border border-(--accent-500)/30 mb-6">
                  <span className="text-sm font-medium text-(--accent-400)">
                    {conditionLabel}
                  </span>
                </div>

                <div className="space-y-3 text-sm border-t border-(--border-subtle) pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-(--text-secondary)">
                      <Wind className="w-4 h-4" strokeWidth={1.5} />
                      <span>Wind</span>
                    </div>
                    <span className="text-(--text-primary) font-medium">
                      {currentWeather?.windspeed ?? '--'} km/h
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-(--text-secondary)">
                      <Clock className="w-4 h-4" strokeWidth={1.5} />
                      <span>Updated</span>
                    </div>
                    <span className="text-(--text-primary) font-medium">{lastUpdated || '--'}</span>
                  </div>
                  {avgTemp !== null && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-(--text-secondary)">
                        <Thermometer className="w-4 h-4" strokeWidth={1.5} />
                        <span>Avg (24h)</span>
                      </div>
                      <span className="text-(--text-primary) font-medium">{avgTemp}°C</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="p-6 h-full min-h-[400px]">
                {isLoadingWeather ? (
                  <div className="flex flex-col items-center justify-center h-full min-h-[320px]">
                    <Spinner size="lg" />
                    <p className="text-(--text-muted) mt-3 text-sm">Loading forecast...</p>
                  </div>
                ) : weatherError ? (
                  <div className="flex flex-col items-center justify-center h-full min-h-[320px]">
                    <p className="text-(--text-primary)">{weatherError}</p>
                    <Button
                      variant="primary"
                      className="mt-4"
                      onClick={() =>
                        dispatch(
                          fetchWeather({
                            lat: selectedCity.latitude,
                            lng: selectedCity.longitude,
                          })
                        )
                      }
                    >
                      Retry
                    </Button>
                  </div>
                ) : (
                  <TemperatureLineChart
                    hours={hours}
                    temperatures={temperatures}
                    city={selectedCity.name}
                  />
                )}
              </Card>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default WeatherPage;
