import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

const initialState = {
  searchResults: [],
  isSearching: false,
  searchError: null,
  searchTerm: "",

  // Selected city
  selectedCity: null,

  // Weather data
  currentWeather: null,
  hourlyForecast: null,
  isLoadingWeather: false,
  weatherError: null,
};

export const searchCities = createAsyncThunk(
  "weather/searchCities",
  async (name, thunkAPI) => {
    try {
      const response = await api.get("/weather/search", {
        params: { name },
      });
      return response.data.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async ({ lat, lng }, thunkAPI) => {
    try {
      const response = await api.get("/weather", {
        params: { lat, lng },
      });
      return response.data.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    clearSearch: (state) => {
      state.searchTerm = "";
      state.searchResults = [];
      state.searchError = null;
      state.isSearching = false;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchError = null;
      state.isSearching = false;
    },
    selectCity: (state, action) => {
      state.selectedCity = action.payload;
      state.searchResults = [];
      state.searchError = null;
      state.isSearching = false;
    },
    clearWeather: (state) => {
      state.currentWeather = null;
      state.hourlyForecast = null;
      state.weatherError = null;
      state.isLoadingWeather = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchCities.pending, (state) => {
        state.isSearching = true;
        state.searchError = null;
      })
      .addCase(searchCities.fulfilled, (state, action) => {
        state.isSearching = false;
        state.searchResults = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(searchCities.rejected, (state, action) => {
        state.isSearching = false;
        state.searchError = action.payload;
        state.searchResults = [];
      })
      .addCase(fetchWeather.pending, (state) => {
        state.isLoadingWeather = true;
        state.weatherError = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.isLoadingWeather = false;
        state.currentWeather = action.payload?.current_weather || null;
        state.hourlyForecast = action.payload?.hourly || null;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.isLoadingWeather = false;
        state.weatherError = action.payload;
        state.currentWeather = null;
        state.hourlyForecast = null;
      });
  },
});

export const {
  setSearchTerm,
  clearSearch,
  clearSearchResults,
  selectCity,
  clearWeather,
} = weatherSlice.actions;

export default weatherSlice.reducer;
