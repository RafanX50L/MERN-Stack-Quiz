// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import api from "@/services/api";
import { setupInterceptors } from "@/services/interceptor";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

setupInterceptors(api, store.dispatch);

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
