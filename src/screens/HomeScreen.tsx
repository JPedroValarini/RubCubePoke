import { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
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
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  const offset = (currentPage - 1) * POKEMONS_PER_PAGE;

  const { loading, error, data } = useQuery(GET_POKEMONS, {
    variables: { limit: POKEMONS_PER_PAGE, offset },
    fetchPolicy: 'cache-and-network',
  });

  const pokemons: PokemonApiResponse[] = useMemo(() => {
    if (!data) return [];
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
  }, [data]);

  const filteredPokemons = useMemo(() => {
    return search
      ? pokemons.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
      : pokemons;
  }, [pokemons, search]);

  const getNextEvolution = (pokemon: PokemonApiResponse): PokemonEvolution | null => {
    return pokemon.evolutionChain.find(evo => evo.evolvesFromId === pokemon.id) || null;
  };

  const handleEvolutionPress = (pokemon: PokemonApiResponse) => {
    setSelectedPokemon(pokemon);
    setEvolutionModalVisible(true);
  };

  const handleEvolutionConfirm = () => {
    console.log(`${selectedPokemon?.name} evoluiu!`);
    setEvolutionModalVisible(false);
  };

  const renderItem = ({ item }: { item: PokemonApiResponse }) => (
    <PokemonCard
      pokemon={item}
      isFavorite={isFavorite(item.id)}
      onPress={() => navigation.navigate('Details', { pokemonId: item.id })}
      onFavoritePress={() => toggleFavorite(item)}
      onEvolutionPress={() => handleEvolutionPress(item)}
    />
  );

  const toggleFavorite = (pokemon: PokemonApiResponse) => {
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
  };

  const renderPagination = () => {
    const visiblePages = 5;
    const startPage = Math.max(
      1,
      Math.min(currentPage - 2, TOTAL_PAGES - visiblePages + 1)
    );

    return (
      <View style={styles.paginationContainer}>
        {Array.from({ length: Math.min(visiblePages, TOTAL_PAGES) }, (_, i) => {
          const page = startPage + i;
          return (
            <TouchableOpacity
              key={page}
              style={[
                styles.pageButton,
                currentPage === page && styles.activePageButton,
              ]}
              onPress={() => setCurrentPage(page)}
              disabled={currentPage === page}
            >
              <Text style={styles.pageText}>{page}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Erro ao carregar pokémons</Text>
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PokeRub</Text>
      <TextInput
        placeholder="Buscar pokémon..."
        style={styles.input}
        value={search}
        onChangeText={setSearch}
      />

      <TouchableOpacity
        style={styles.favButton}
        onPress={() => navigation.navigate('Favorites')}
      >
        <Text style={styles.favButtonText}>
          Ver Favoritos ({favorites.length})
        </Text>
      </TouchableOpacity>

      {loading ? (
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
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedPokemon && (
              <>
                <Text style={styles.modalTitle}>Evoluir {selectedPokemon.name}?</Text>

                <View style={styles.evolutionPreview}>
                  <View style={styles.pokemonPreview}>
                    <Image
                      source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${selectedPokemon.id}.png` }}
                      style={styles.previewImage}
                    />
                    <Text>{selectedPokemon.name}</Text>
                  </View>

                  <MaterialIcons name="arrow-forward" size={24} color="#333" />

                  <View style={styles.pokemonPreview}>
                    <Image
                      source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getNextEvolution(selectedPokemon)?.id}.png` }}
                      style={styles.previewImage}
                    />
                    <Text>{getNextEvolution(selectedPokemon)?.name}</Text>
                  </View>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setEvolutionModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={handleEvolutionConfirm}
                  >
                    <Text style={styles.buttonText}>Evoluir!</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#343a40',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  pageButton: {
    padding: 10,
    marginHorizontal: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    minWidth: 40,
    alignItems: 'center',
  },
  activePageButton: {
    backgroundColor: '#ffc107',
  },
  pageText: {
    fontSize: 16,
    fontWeight: '500',
  },
  favButton: {
    backgroundColor: '#ffc107',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
  },
  favButtonText: {
    color: '#343a40',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  evolutionPreview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 15,
  },
  pokemonPreview: {
    alignItems: 'center',
  },
  previewImage: {
    width: 80,
    height: 80,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;