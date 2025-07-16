export type RootStackParamList = {
  Home: undefined;
  Details: { pokemonId: string; pokemonName?: string };
  Favorites: undefined;
};

// Extendendo os tipos globais do React Navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}