import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mobileSidebarOpen: false,
  toasts: [],
  networkStatus: 'online',
  pageTitle: '',
  pageDescription: '',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setMobileSidebarOpen: (state, action) => {
      state.mobileSidebarOpen = action.payload;
    },
    toggleMobileSidebar: (state) => {
      state.mobileSidebarOpen = !state.mobileSidebarOpen;
    },
    addToast: (state, action) => {
      const toast = {
        id: Date.now() + Math.random().toString(36).slice(2),
        message: action.payload.message,
        type: action.payload.type || 'info',
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearAllToasts: (state) => {
      state.toasts = [];
    },
    setNetworkStatus: (state, action) => {
      state.networkStatus = action.payload;
    },
    setPageMetadata: (state, action) => {
      if (action.payload.title !== undefined) {
        state.pageTitle = action.payload.title;
      }
      if (action.payload.description !== undefined) {
        state.pageDescription = action.payload.description;
      }
    },
    clearPageMetadata: (state) => {
      state.pageTitle = '';
      state.pageDescription = '';
    },
  },
});

export const {
  setMobileSidebarOpen,
  toggleMobileSidebar,
  addToast,
  removeToast,
  clearAllToasts,
  setNetworkStatus,
  setPageMetadata,
  clearPageMetadata,
} = appSlice.actions;

export const appToast = {
  success: (message) => addToast({ message, type: 'success' }),
  error: (message) => addToast({ message, type: 'error' }),
  info: (message) => addToast({ message, type: 'info' }),
};

export default appSlice.reducer;
