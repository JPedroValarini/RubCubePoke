export interface PokemonEvolutionHistory {
  id: string;
  currentId: string; // Adicione isso
  name: string;
  sprite: string;
  evolvedTo: string; // Torne obrigatório
}

export interface PokemonEvolutionChain {
  originalId: string;
  currentId: string;
  possibleEvolutions: {
    id: string;
    name: string;
  }[];
  evolutionHistory: PokemonEvolutionHistory[]; // Use o tipo corrigido
}