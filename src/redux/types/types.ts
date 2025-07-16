export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
}

export interface UserPokemon {
  id: string;
  pokemonId: number;
  currentFormId: number;
  isFavorite: boolean;
  nickname?: string;
}

export interface PokemonState {
  originalPokemons: Pokemon[];
  userPokemons: Record<string, UserPokemon>;
  loading: boolean;
  error: string | null;
  evolutionData: {};
}

export interface UserState {
  favorites: number[];
}