// Este arquivo pode ser removido pois toda a lógica foi movida para o pokemonSlice.ts
// Mantenha apenas se estiver sendo usado em outros lugares específicos

import { EVOLVE_POKEMON, SET_POKEMONS } from './pokemonActions';

interface PokemonState {
  pokemons: any[];
  evolvedPokemons: Record<string, string>;
}

const initialState: PokemonState = {
  pokemons: [],
  evolvedPokemons: {}
};

export const pokemonReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_POKEMONS:
      return {
        ...state,
        pokemons: action.payload
      };
    case EVOLVE_POKEMON:
      return {
        ...state,
        evolvedPokemons: {
          ...state.evolvedPokemons,
          [action.payload.originalId]: action.payload.evolvedId
        }
      };
    default:
      return state;
  }
};