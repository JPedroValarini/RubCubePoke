import { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_POKEMONS } from './../graphql/queries';

interface Pokemon {
  id: string;
  name: string;
  isFavorite?: boolean;
}

const POKEMONS_PER_PAGE = 10;
const TOTAL_POKEMONS = 898;
const TOTAL_PAGES = Math.ceil(TOTAL_POKEMONS / POKEMONS_PER_PAGE);

const HomeScreen = ({ navigation }: any) => {
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const offset = (currentPage - 1) * POKEMONS_PER_PAGE;

  const { loading, error, data } = useQuery(GET_POKEMONS, {
    variables: { limit: POKEMONS_PER_PAGE, offset },
    fetchPolicy: 'cache-and-network',
  });

  const pokemons: Pokemon[] = useMemo(() => {
    if (!data) return [];
    return data.pokemon_v2_pokemon.map((p: any) => ({
      id: String(p.id),
      name: p.name,
      isFavorite: favorites.includes(String(p.id)),
    }));
  }, [data, favorites]);

  const filteredPokemons = useMemo(() => {
    return search
      ? pokemons.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
      : pokemons;
  }, [pokemons, search]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  const renderItem = ({ item }: { item: Pokemon }) => (
    <TouchableOpacity
      style={[styles.item, item.isFavorite && styles.favoriteItem]}
      onPress={() => navigation.navigate('Details', { pokemonId: item.id })}
    >
      <Text style={styles.name}>{item.name}</Text>
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
          toggleFavorite(item.id);
        }}
      >
        <Text style={styles.favoriteIcon}>
          {item.isFavorite ? '★' : '☆'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  item: {
    padding: 12,
    backgroundColor: '#f2f2f2',
    marginBottom: 8,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favoriteItem: {
    backgroundColor: '#fff3cd',
  },
  name: {
    fontSize: 18,
    textTransform: 'capitalize',
    color: '#222',
  },
  favoriteIcon: {
    fontSize: 20,
    color: '#ffc107',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  pageButton: {
    padding: 8,
    marginHorizontal: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  activePageButton: {
    backgroundColor: '#ffc107',
  },
  pageText: {
    fontSize: 16,
  },
});

export default HomeScreen;
