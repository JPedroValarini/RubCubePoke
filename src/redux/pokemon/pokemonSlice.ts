import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PokemonEvolution {
  id: string;
  name: string;
  evolvesFromId: string | null;
}

interface PokemonApiResponse {
  id: string;
  name: string;
  pokemon_v2_pokemontypes: {
    pokemon_v2_type: {
      name: string;
    };
  }[];
  evolutionChain: PokemonEvolution[];
}

interface PokemonState {
  pokemons: PokemonApiResponse[];
  evolvedPokemons: Record<string, string>;
}

const initialState: PokemonState = {
  pokemons: [],
  evolvedPokemons: {}
};

export const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    setPokemons: (state, action: PayloadAction<PokemonApiResponse[]>) => {
      state.pokemons = action.payload;
    },
    evolvePokemon: (
      state,
      action: PayloadAction<{ originalId: string; evolvedId: string }>
    ) => {
      const { originalId, evolvedId } = action.payload;
      state.evolvedPokemons[originalId] = evolvedId;
    },
    resetEvolutions: (state) => {
      state.evolvedPokemons = {};
    }
  },
});

export const { setPokemons, evolvePokemon, resetEvolutions } = pokemonSlice.actions;
export default pokemonSlice.reducer;