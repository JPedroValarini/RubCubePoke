import { createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../api/apolloClient';
import { gql } from '@apollo/client';

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

export const EVOLVE_POKEMON = 'EVOLVE_POKEMON';
export const SET_POKEMONS = 'SET_POKEMONS';

export const fetchPokemons = createAsyncThunk(
  'pokemon/fetchAll',
  async () => {
    console.log('[pokemonActions] fetchPokemons started'); // LOG 1
    try {
      const { data } = await client.query({
        query: gql`
          query SamplePokeAPIquery {
            pokemon_v2_pokemon(limit: 50) {
              id
              name
              pokemon_v2_pokemonsprites {
                sprites(path: "front_default")
              }
            }
          }
        `,
      });

      const transformedData = data.pokemon_v2_pokemon.map((p: any) => ({
        id: p.id,
        name: p.name,
        sprites: { front_default: p.pokemon_v2_pokemonsprites[0].sprites },
      }));

      console.log('[pokemonActions] fetchPokemons success', transformedData.length, 'pokemons loaded'); // LOG 2
      return transformedData;
    } catch (error) {
      console.error('[pokemonActions] fetchPokemons error', error); // LOG 3
      throw error;
    }
  }
);

export const evolvePokemon = (originalId: string, evolvedId: string) => {
  console.log('[pokemonActions] evolvePokemon dispatched', { originalId, evolvedId }); // LOG 4
  return {
    type: EVOLVE_POKEMON,
    payload: { originalId, evolvedId }
  };
};

export const setPokemons = (pokemons: PokemonApiResponse[]) => {
  console.log('[pokemonActions] setPokemons dispatched', pokemons.length, 'pokemons'); // LOG 5
  return {
    type: SET_POKEMONS,
    payload: pokemons
  };
};