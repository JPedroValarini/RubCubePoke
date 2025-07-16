import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState } from '../types/types';

const initialState: UserState = {
  favorites: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const pokemonId = action.payload;
      const index = state.favorites.indexOf(pokemonId);
      if (index >= 0) {
        state.favorites.splice(index, 1); // Remove
      } else {
        state.favorites.push(pokemonId); // Adiciona
      }
    },
  },
});

export const { toggleFavorite } = userSlice.actions;
export default userSlice.reducer;