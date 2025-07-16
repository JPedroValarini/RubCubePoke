import { configureStore } from '@reduxjs/toolkit';
import pokemonReducer from './pokemon/pokemonSlice';
import userReducer from './user/userSlice';

export const store = configureStore({
  reducer: {
    pokemon: pokemonReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ['payload.headers', 'payload.config', 'payload.request'],
        ignoredPaths: ['items.dates'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;