import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import GoogleCallback from "../pages/auth/GoogleCallback";
import DashboardPage from "../pages/DashboardPage";
import CoinsPage from "../pages/coins/CoinsPage";
import CoinDetailPage from "../pages/coins/CoinDetailPage";
import WeatherPage from "../pages/weather/WeatherPage";
import ProfilePage from "../pages/profile/ProfilePage";
import EditProfilePage from "../pages/profile/EditProfilePage";
import SettingsPage from "../pages/settings/SettingsPage";
import PrivateRoute from "./PrivateRoute";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/coins"
        element={
          <PrivateRoute>
            <CoinsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/coins/:symbol"
        element={
          <PrivateRoute>
            <CoinDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/weather"
        element={
          <PrivateRoute>
            <WeatherPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/edit"
        element={
          <PrivateRoute>
            <EditProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRouter;
