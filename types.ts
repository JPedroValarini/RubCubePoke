export type RootStackParamList = {
  Home: undefined;
  Details: {
    pokemonId: string;
    pokemonName: string;
    fullPokemon?: {
      currentName: string;
      originalName: string;
      imageUrl: string;
      types: string[];
      abilities: string[];
      stats: { name: string; base: number }[];
      height: number;
      weight: number;
    };
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}