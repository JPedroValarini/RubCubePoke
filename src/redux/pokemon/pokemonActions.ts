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
    const { data } = await client.query({
      query: gql`
        query SamplePokeAPIquery {
          pokemon_v2_pokemon(limit: 898) {
            id
            name
            pokemon_v2_pokemonsprites {
              sprites(path: "front_default")
            }
          }
        }
      `,
    });

    return data.pokemon_v2_pokemon.map((p: any) => ({
      id: p.id,
      name: p.name,
      sprites: { front_default: p.pokemon_v2_pokemonsprites[0].sprites },
    }));
  }
);

export const evolvePokemon = (originalId: string, evolvedId: string) => ({
  type: EVOLVE_POKEMON,
  payload: { originalId, evolvedId }
});

export const setPokemons = (pokemons: PokemonApiResponse[]) => ({
  type: SET_POKEMONS,
  payload: pokemons
});