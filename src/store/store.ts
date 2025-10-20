import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import chatSlice from "./slices/chatSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    chat: chatSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
