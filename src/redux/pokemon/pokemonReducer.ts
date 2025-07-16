import { EVOLVE_POKEMON, SET_POKEMONS } from './pokemonActions';

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