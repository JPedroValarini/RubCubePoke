import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
} from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_POKEMONS } from './../graphql/queries';
import { useFavorites } from '../context/FavoritesContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PokemonCard from '../components/PokemonCard';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { evolvePokemon, setPokemons } from '../redux/pokemon/pokemonSlice';

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

const POKEMONS_PER_PAGE = 10;
const TOTAL_POKEMONS = 898;
const TOTAL_PAGES = Math.ceil(TOTAL_POKEMONS / POKEMONS_PER_PAGE);

const HomeScreen = ({ navigation }: any) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [evolutionModalVisible, setEvolutionModalVisible] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonApiResponse | null>(null);
  const dispatch = useDispatch();
  const { pokemons: storedPokemons, evolvedPokemons } = useSelector((state: RootState) => state.pokemon);
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const offset = (currentPage - 1) * POKEMONS_PER_PAGE;

  const { loading, error, data } = useQuery(GET_POKEMONS, {
    variables: { limit: POKEMONS_PER_PAGE, offset },
    fetchPolicy: 'cache-and-network',
  });

  const pokemons: PokemonApiResponse[] = useMemo(() => {
    if (!data) return storedPokemons;

    return data.pokemon_v2_pokemon.map((p: any) => ({
      id: String(p.id),
      name: p.name,
      pokemon_v2_pokemontypes: p.pokemon_v2_pokemontypes || [],
      evolutionChain: p.pokemon_v2_pokemonspecy?.pokemon_v2_evolutionchain?.pokemon_v2_pokemonspecies?.map((s: any) => ({
        id: String(s.id),
        name: s.name,
        evolvesFromId: s.evolves_from_species_id ? String(s.evolves_from_species_id) : null
      })) || []
    }));
  }, [data, storedPokemons]);

  useEffect(() => {
    if (data) {
      const newPokemons = data.pokemon_v2_pokemon.map((p: any) => ({
        id: String(p.id),
        name: p.name,
        pokemon_v2_pokemontypes: p.pokemon_v2_pokemontypes || [],
        evolutionChain: p.pokemon_v2_pokemonspecy?.pokemon_v2_evolutionchain?.pokemon_v2_pokemonspecies?.map((s: any) => ({
          id: String(s.id),
          name: s.name,
          evolvesFromId: s.evolves_from_species_id ? String(s.evolves_from_species_id) : null
        })) || []
      }));

      dispatch(setPokemons(newPokemons));
    }
  }, [data, dispatch]);

  const filteredPokemons = useMemo(() => {
    return search
      ? pokemons.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      : pokemons;
  }, [pokemons, search]);

  const getNextEvolution = useCallback((pokemon: PokemonApiResponse): PokemonEvolution | null => {
    return pokemon.evolutionChain.find(evo => evo.evolvesFromId === pokemon.id) || null;
  }, []);

  const handleEvolutionPress = useCallback((pokemon: PokemonApiResponse) => {
    setSelectedPokemon(pokemon);
    setEvolutionModalVisible(true);
  }, []);

  const handleEvolutionConfirm = useCallback(() => {
    if (selectedPokemon) {
      const nextEvolution = getNextEvolution(selectedPokemon);
      if (nextEvolution) {
        dispatch(evolvePokemon({
          originalId: selectedPokemon.id,
          evolvedId: nextEvolution.id
        }));
      }
    }
    setEvolutionModalVisible(false);
  }, [selectedPokemon, dispatch, getNextEvolution]);

  const hasEvolved = useCallback((pokemonId: string) => {
    return evolvedPokemons[pokemonId] !== undefined;
  }, [evolvedPokemons]);

  const getEvolvedPokemon = useCallback((pokemonId: string) => {
    const evolvedId = evolvedPokemons[pokemonId];
    return pokemons.find(p => p.id === evolvedId);
  }, [evolvedPokemons, pokemons]);

  const toggleFavorite = useCallback((pokemon: PokemonApiResponse) => {
    if (isFavorite(pokemon.id)) {
      removeFavorite(pokemon.id);
    } else {
      addFavorite({
        id: pokemon.id,
        name: pokemon.name,
        imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
        types: pokemon.pokemon_v2_pokemontypes.map(t => ({
          name: t.pokemon_v2_type.name
        }))
      });
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  const renderItem = useCallback(({ item }: { item: PokemonApiResponse }) => {
    const evolvedId = evolvedPokemons[item.id];
    const evolvedPokemon = getEvolvedPokemon(item.id);

    return (
      <PokemonCard
        pokemon={item}
        isFavorite={isFavorite(evolvedId || item.id)}
        onPress={() => navigation.navigate('Details', {
          pokemonId: evolvedId || item.id,
          pokemonName: item.name
        })}
        onFavoritePress={() => toggleFavorite(evolvedPokemon || item)}
        onEvolutionPress={() => handleEvolutionPress(item)}
        hasEvolved={hasEvolved(item.id)}
        evolvedPokemon={evolvedPokemon}
      />
    );
  }, [evolvedPokemons, getEvolvedPokemon, isFavorite, navigation, handleEvolutionPress, hasEvolved, toggleFavorite]);

  const renderPagination = useCallback(() => {
    const visiblePages = 5;
    const startPage = Math.max(
      1,
      Math.min(currentPage - 2, TOTAL_PAGES - visiblePages + 1)
    );

    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
        {Array.from({ length: Math.min(visiblePages, TOTAL_PAGES) }, (_, i) => {
          const page = startPage + i;
          return (
            <TouchableOpacity
              key={page}
              style={[
                { padding: 8, marginHorizontal: 4, minWidth: 40, alignItems: 'center', backgroundColor: '#e9ecef', borderRadius: 4 },
                currentPage === page && { backgroundColor: '#495057' },
              ]}
              onPress={() => setCurrentPage(page)}
              disabled={currentPage === page}
            >
              <Text style={{ color: '#343a40' }}>{page}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }, [currentPage]);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Erro ao carregar pokémons</Text>
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#f8f9fa' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#343a40' }}>
        PokeRub
      </Text>
      <TextInput
        placeholder="Buscar pokémon..."
        style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#ddd' }}
        value={search}
        onChangeText={setSearch}
      />

      <TouchableOpacity
        style={{ backgroundColor: '#ffc107', padding: 12, borderRadius: 8, marginBottom: 16, alignItems: 'center' }}
        onPress={() => navigation.navigate('Favorites')}
      >
        <Text style={{ fontWeight: 'bold', color: '#343a40' }}>
          Ver Favoritos ({favorites.length})
        </Text>
      </TouchableOpacity>

      {loading && !pokemons.length ? (
        <ActivityIndicator size="large" color="#555" />
      ) : (
        <FlatList
          data={filteredPokemons}
          keyExtractor={(item) => `pokemon-${item.id}`}
          renderItem={renderItem}
          ListFooterComponent={renderPagination}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={evolutionModalVisible}
        onRequestClose={() => setEvolutionModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
            {selectedPokemon && (
              <>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
                  Evoluir {selectedPokemon.name}?
                </Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <View style={{ alignItems: 'center' }}>
                    <Image
                      source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${selectedPokemon.id}.png` }}
                      style={{ width: 80, height: 80 }}
                    />
                    <Text>{selectedPokemon.name}</Text>
                  </View>

                  <MaterialIcons name="arrow-forward" size={24} color="#333" />

                  <View style={{ alignItems: 'center' }}>
                    <Image
                      source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getNextEvolution(selectedPokemon)?.id}.png` }}
                      style={{ width: 80, height: 80 }}
                    />
                    <Text>{getNextEvolution(selectedPokemon)?.name}</Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TouchableOpacity
                    style={{ padding: 10, borderRadius: 5, width: '48%', alignItems: 'center', backgroundColor: '#e9ecef' }}
                    onPress={() => setEvolutionModalVisible(false)}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ padding: 10, borderRadius: 5, width: '48%', alignItems: 'center', backgroundColor: '#4CAF50' }}
                    onPress={handleEvolutionConfirm}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Evoluir!</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;