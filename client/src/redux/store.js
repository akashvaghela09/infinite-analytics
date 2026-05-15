import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import coinsReducer from "./coins/coinsSlice";
import weatherReducer from "./weather/weatherSlice";
import appReducer from "./app/appSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    coins: coinsReducer,
    weather: weatherReducer,
  },
});
