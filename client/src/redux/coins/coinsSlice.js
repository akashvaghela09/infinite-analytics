import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

const initialState = {
  coins: [],
  filteredCoins: [],
  searchTerm: "",
  selectedCoin: null,
  klines: [],
  selectedInterval: "1d",
  isLoadingCoins: false,
  isLoadingCoinDetails: false,
  isLoadingKlines: false,
  isLoading: false,
  isError: false,
  message: "",
  page: 1,
  limit: 10,
  totalCoins: 0,
  totalPages: 1,
  sortBy: "quoteVolume",
  sortOrder: "desc",
};

export const fetchCoins = createAsyncThunk(
  "coins/fetchCoins",
  async ({ page, limit, sortBy, sortOrder, search } = {}, thunkAPI) => {
    try {
      const state = thunkAPI.getState().coins;
      const params = {
        page: page || state.page,
        limit: limit || state.limit,
        sortBy: sortBy || state.sortBy,
        sortOrder: sortOrder || state.sortOrder,
        search: search !== undefined ? search : state.searchTerm,
      };
      const response = await api.get("/coins", { params });
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchCoinDetails = createAsyncThunk(
  "coins/fetchCoinDetails",
  async (symbol, thunkAPI) => {
    try {
      const response = await api.get(`/coins/${symbol}`);
      return response.data.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchKlines = createAsyncThunk(
  "coins/fetchKlines",
  async ({ symbol, interval, limit = 100 }, thunkAPI) => {
    try {
      const response = await api.get(`/coins/${symbol}/klines`, {
        params: { interval, limit },
      });
      return response.data.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const coinsSlice = createSlice({
  name: "coins",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isLoading = false;
      state.message = "";
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      // Client-side filter on current page data
      if (action.payload === "") {
        state.filteredCoins = state.coins;
      } else {
        const term = action.payload.toLowerCase();
        state.filteredCoins = state.coins.filter((coin) =>
          coin.symbol.toLowerCase().includes(term),
        );
      }
    },
    clearSearch: (state) => {
      state.searchTerm = "";
      state.filteredCoins = state.coins;
    },
    setInterval: (state, action) => {
      state.selectedInterval = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
      state.page = 1;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      state.page = 1;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
      state.page = 1;
    },
    clearSelectedCoin: (state) => {
      state.selectedCoin = null;
      state.klines = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoins.pending, (state) => {
        state.isLoadingCoins = true;
        state.isLoading = true;
      })
      .addCase(fetchCoins.fulfilled, (state, action) => {
        state.isLoadingCoins = false;
        state.isLoading = false;
        const { data, page, limit, totalCoins, totalPages } = action.payload;
        state.coins = data;
        state.page = page;
        state.limit = limit;
        state.totalCoins = totalCoins;
        state.totalPages = totalPages;
        if (state.searchTerm) {
          const term = state.searchTerm.toLowerCase();
          state.filteredCoins = data.filter((coin) =>
            coin.symbol.toLowerCase().includes(term),
          );
        } else {
          state.filteredCoins = data;
        }
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.isLoadingCoins = false;
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchCoinDetails.pending, (state) => {
        state.isLoadingCoinDetails = true;
      })
      .addCase(fetchCoinDetails.fulfilled, (state, action) => {
        state.isLoadingCoinDetails = false;
        state.selectedCoin = action.payload;
      })
      .addCase(fetchCoinDetails.rejected, (state, action) => {
        state.isLoadingCoinDetails = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchKlines.pending, (state) => {
        state.isLoadingKlines = true;
      })
      .addCase(fetchKlines.fulfilled, (state, action) => {
        state.isLoadingKlines = false;
        state.klines = action.payload;
      })
      .addCase(fetchKlines.rejected, (state, action) => {
        state.isLoadingKlines = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const {
  reset,
  setSearchTerm,
  clearSearch,
  setInterval,
  setPage,
  setLimit,
  setSortBy,
  setSortOrder,
  clearSelectedCoin,
} = coinsSlice.actions;
export default coinsSlice.reducer;
