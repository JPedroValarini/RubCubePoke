import { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  StyleSheet,
  Image,
} from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PokemonCard from '../components/PokemonCard';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { evolvePokemon } from '../redux/pokemon/pokemonSlice';
import { useEffect } from 'react';
import { fetchPokemons } from '../redux/pokemon/pokemonSlice';

const POKEMONS_PER_PAGE = 10;

const HomeScreen = ({ navigation }: any) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [evolutionModalVisible, setEvolutionModalVisible] = useState(false);
  const [selectedPokemonId, setSelectedPokemonId] = useState<string | null>(null);
  const [isEvolving, setIsEvolving] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const { allPokemons, evolutions } = useSelector((state: RootState) => state.pokemon);
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    if (Object.keys(allPokemons).length === 0) {
      dispatch(fetchPokemons());
    }
  }, [allPokemons, dispatch]);

  const allPokemonsList = useMemo(() => {
    return Object.values(allPokemons);
  }, [allPokemons]);

  const paginatedPokemons = useMemo(() => {
    const filtered = search
      ? allPokemonsList.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      : allPokemonsList;
    const offset = (currentPage - 1) * POKEMONS_PER_PAGE;
    return filtered.slice(offset, offset + POKEMONS_PER_PAGE);
  }, [search, allPokemonsList, currentPage]);

  const totalPages = Math.ceil(
    (search ? allPokemonsList.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).length
      : allPokemonsList.length) / POKEMONS_PER_PAGE
  );

  // Corrigir a função canEvolve
  const canEvolve = useCallback((pokemonId: string) => {
    const pokemon = allPokemons[pokemonId];
    if (!pokemon) return false;

    // Verifica se é a forma original e se tem evoluções disponíveis
    const evolutionChain = evolutions[pokemon.originalId || pokemonId];
    return Boolean(evolutionChain?.possibleEvolutions?.length);
  }, [allPokemons, evolutions]);

  // Corrigir a função getNextEvolution
  const getNextEvolution = useCallback((pokemonId: string) => {
    const evolutionChain = evolutions[pokemonId];
    return evolutionChain?.possibleEvolutions[0];
  }, [evolutions]);


  const handleEvolutionPress = useCallback((pokemonId: string) => {
    setSelectedPokemonId(pokemonId);
    setEvolutionModalVisible(true);
  }, []);

  const handleEvolutionConfirm = useCallback(async () => {
    if (selectedPokemonId) {
      setIsEvolving(true);
      try {
        const nextEvolution = getNextEvolution(selectedPokemonId);
        if (nextEvolution) {
          await dispatch(
            evolvePokemon({
              originalId: selectedPokemonId, // Usamos o ID diretamente agora
              evolutionTargetId: nextEvolution.id,
            })
          );
        }
      } finally {
        setIsEvolving(false);
        setEvolutionModalVisible(false);
      }
    }
  }, [selectedPokemonId, dispatch, getNextEvolution]);

  const toggleFavorite = useCallback((pokemonId: string) => {
    const pokemon = allPokemons[pokemonId];
    if (!pokemon) return;

    if (isFavorite(pokemonId)) {
      removeFavorite(pokemonId);
    } else {
      addFavorite({
        id: pokemon.id,
        name: pokemon.name,
        imageUrl: pokemon.imageUrl,
        // types: pokemon.types.map((name) => ({ name })),
      });
    }
  }, [allPokemons, isFavorite, addFavorite, removeFavorite]);

  const renderItem = useCallback(({ item }: { item: any }) => {
    const isOriginal = item.originalId === item.id;
    const originalPokemon = isOriginal ? item : allPokemons[item.originalId];

    const pokemonDisplay = {
      id: item.id,
      name: item.name,
      types: item.types,
      imageUrl: item.imageUrl,
      isEvolved: !isOriginal,
      originalName: originalPokemon?.name,
    };

    return (
      <PokemonCard
        pokemon={pokemonDisplay}
        isFavorite={isFavorite(item.id)}
        canEvolve={canEvolve(item.id)}
        hasEvolved={!isOriginal}
        onPress={() => navigation.navigate('Details', {
          pokemonId: item.id,
          pokemonName: item.name,
        })}
        onFavoritePress={() => toggleFavorite(item.id)}
        onEvolutionPress={() => handleEvolutionPress(item.id)}
      />
    );
  }, [isFavorite, canEvolve, navigation, toggleFavorite, handleEvolutionPress, allPokemons]);

  const renderPagination = useCallback(() => {
    if (totalPages <= 1) return null;

    const visiblePages = 5;
    const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - visiblePages + 1));

    return (
      <View style={styles.paginationContainer}>
        {currentPage > 1 && (
          <TouchableOpacity
            style={styles.paginationButton}
            onPress={() => setCurrentPage(currentPage - 1)}
          >
            <MaterialIcons name="chevron-left" size={20} color="#343a40" />
          </TouchableOpacity>
        )}

        {Array.from({ length: Math.min(visiblePages, totalPages) }, (_, i) => {
          const page = startPage + i;
          return (
            <TouchableOpacity
              key={page}
              style={[
                styles.paginationPage,
                currentPage === page && styles.paginationPageActive,
              ]}
              onPress={() => setCurrentPage(page)}
              disabled={currentPage === page}
            >
              <Text style={currentPage === page ? styles.paginationTextActive : styles.paginationText}>
                {page}
              </Text>
            </TouchableOpacity>
          );
        })}

        {currentPage < totalPages && (
          <TouchableOpacity
            style={styles.paginationButton}
            onPress={() => setCurrentPage(currentPage + 1)}
          >
            <MaterialIcons name="chevron-right" size={20} color="#343a40" />
          </TouchableOpacity>
        )}
      </View>
    );
  }, [currentPage, totalPages]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PokeRub</Text>

      <TextInput
        placeholder="Buscar pokémon..."
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#999"
      />

      <TouchableOpacity
        style={styles.favoritesButton}
        onPress={() => navigation.navigate('Favorites')}
      >
        <MaterialIcons name="star" size={20} color="#343a40" />
        <Text style={styles.favoritesButtonText}>
          Favoritos ({favorites.length})
        </Text>
      </TouchableOpacity>

      {!paginatedPokemons.length ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>
            {search ? 'Nenhum Pokémon encontrado' : 'Carregando Pokémon...'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={paginatedPokemons}
          keyExtractor={(item) => `pokemon-${item.id}`}
          renderItem={renderItem}
          ListFooterComponent={renderPagination}
          contentContainerStyle={styles.listContent}
        />
      )}

      <Modal
        animationType="slide"
        transparent
        visible={evolutionModalVisible}
        onRequestClose={() => setEvolutionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Evoluir este Pokémon?</Text>

            {selectedPokemonId && (
              <View style={styles.evolutionPreview}>
                <PokemonPreview
                  id={selectedPokemonId}
                  name={allPokemons[selectedPokemonId]?.name}
                />
                <MaterialIcons name="arrow-forward" size={32} color="#4CAF50" />
                <PokemonPreview
                  id={getNextEvolution(selectedPokemonId)?.id || ''}
                  name={getNextEvolution(selectedPokemonId)?.name || ''}
                />
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEvolutionModalVisible(false)}
                disabled={isEvolving}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleEvolutionConfirm}
                disabled={isEvolving}
              >
                {isEvolving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.confirmButtonText}>Evoluir!</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const PokemonPreview = ({ id, name }: { id: string; name?: string }) => (
  <View style={styles.pokemonPreview}>
    <Image
      source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png` }}
      style={styles.pokemonPreviewImage}
    />
    <Text style={styles.pokemonPreviewName} numberOfLines={1}>
      {name || `#${id}`}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#343a40',
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#343a40',
  },
  favoritesButton: {
    flexDirection: 'row',
    backgroundColor: '#ffc107',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  favoritesButtonText: {
    fontWeight: 'bold',
    color: '#343a40',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#555',
  },
  listContent: {
    paddingBottom: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },
  paginationButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#e9ecef',
  },
  paginationPage: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#e9ecef',
  },
  paginationPageActive: {
    backgroundColor: '#4CAF50',
  },
  paginationText: {
    color: '#343a40',
  },
  paginationTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#343a40',
  },
  evolutionPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  pokemonPreview: {
    alignItems: 'center',
    flex: 1,
  },
  pokemonPreviewImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  pokemonPreviewName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#343a40',
    maxWidth: 120,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#e9ecef',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButtonText: {
    color: '#343a40',
    fontWeight: 'bold',
    fontSize: 16,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen;