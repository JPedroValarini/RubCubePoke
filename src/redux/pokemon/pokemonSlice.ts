import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../api/apolloClient';
import { gql } from '@apollo/client';

interface PokemonType {
  name: string;
}

interface PokemonBaseData {
  id: string;
  name: string;
  types: PokemonType[];
  imageUrl: string;
  originalId: string;
  canEvolve: boolean;
}

interface EvolutionData {
  id: string;
  name: string;
  imageUrl: string;
  types: PokemonType[];
}

interface PokemonEvolutionChain {
  originalId: string;
  possibleEvolutions: EvolutionData[];
}

interface PokemonState {
  allPokemons: Record<string, PokemonBaseData>;
  evolutions: Record<string, PokemonEvolutionChain>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PokemonState = {
  allPokemons: {},
  evolutions: {},
  status: 'idle',
  error: null,
};

export const fetchPokemons = createAsyncThunk(
  'pokemon/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: gql`
          query SamplePokeAPIquery {
            pokemon_v2_pokemon(limit: 151) {
              id
              name
              pokemon_v2_pokemonsprites {
                sprites(path: "front_default")
              }
              pokemon_v2_pokemontypes {
                pokemon_v2_type {
                  name
                }
              }
              pokemon_v2_pokemonspecy {
                evolves_from_species_id
              }
            }
          }
        `,
      });

      const transformedData = data.pokemon_v2_pokemon.map((p: any) => ({
        id: p.id.toString(),
        name: p.name,
        types: p.pokemon_v2_pokemontypes.map((t: any) => ({
          name: t.pokemon_v2_type.name
        })),
        imageUrl: p.pokemon_v2_pokemonsprites[0]?.sprites ||
          `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`,
        originalId: p.id.toString(),
        canEvolve: false, // Será definido abaixo
      }));

      // Processa as evoluções
      const allPokemons: Record<string, PokemonBaseData> = {};
      const evolutions: Record<string, PokemonEvolutionChain> = {};

      // Primeiro passada para criar todos os pokémons
      transformedData.forEach((pokemon: PokemonBaseData) => {
        allPokemons[pokemon.id] = pokemon;
      });

      // Segunda passada para processar evoluções
      transformedData.forEach((pokemon: PokemonBaseData) => {
        const possibleEvolutions = transformedData
          .filter((p: any) => p.evolvesFromId === pokemon.id)
          .map((evo: any) => ({
            id: evo.id,
            name: evo.name,
            imageUrl: evo.imageUrl,
            types: evo.types,
          }));

        if (possibleEvolutions.length > 0) {
          evolutions[pokemon.id] = {
            originalId: pokemon.id,
            possibleEvolutions,
          };
          // Marca o pokémon como capaz de evoluir
          allPokemons[pokemon.id].canEvolve = true;
        }
      });

      return { allPokemons, evolutions };
    } catch (error) {
      return rejectWithValue('Failed to fetch pokemons');
    }
  }
);

export const evolvePokemon = createAsyncThunk(
  'pokemon/evolvePokemon',
  async ({ originalId, evolutionTargetId }: { originalId: string; evolutionTargetId: string }, { getState }) => {
    const state = getState() as { pokemon: PokemonState };
    const evolutionChain = state.pokemon.evolutions[originalId];

    if (!evolutionChain) {
      throw new Error('Evolution chain not found');
    }

    const targetEvolution = evolutionChain.possibleEvolutions.find(
      evo => evo.id === evolutionTargetId
    );

    if (!targetEvolution) {
      throw new Error('Target evolution not found');
    }

    return {
      originalId,
      evolutionTarget: targetEvolution
    };
  }
);

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemons.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPokemons.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allPokemons = action.payload.allPokemons;
        state.evolutions = action.payload.evolutions;
      })
      .addCase(fetchPokemons.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(evolvePokemon.fulfilled, (state, action) => {
        const { originalId, evolutionTarget } = action.payload;

        // Cria o novo Pokémon evoluído
        state.allPokemons[evolutionTarget.id] = {
          ...state.allPokemons[originalId],
          id: evolutionTarget.id,
          name: evolutionTarget.name,
          types: evolutionTarget.types,
          imageUrl: evolutionTarget.imageUrl,
          originalId,
          canEvolve: state.evolutions[evolutionTarget.id]?.possibleEvolutions?.length > 0
        };

        // Remove o Pokémon original se necessário
        if (originalId !== evolutionTarget.id) {
          delete state.allPokemons[originalId];
        }
      });
  }
});

export default pokemonSlice.reducer;