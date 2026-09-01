import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/lib/features/auth/auth-slice';
import { api } from '@/lib/services/api';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [api.reducerPath]: api.reducer,
    },

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];