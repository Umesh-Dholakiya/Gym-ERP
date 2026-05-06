import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import inquirySlice from './slices/inquirySlice';
import serviceSlice from './slices/serviceSlice';
import notificationSlice from './slices/notificationSlice';
import memberSlice from './slices/memberSlice';
import trainerSlice from './slices/trainerSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    inquiries: inquirySlice,
    services: serviceSlice,
    notifications: notificationSlice,
    members: memberSlice,
    trainers: trainerSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;