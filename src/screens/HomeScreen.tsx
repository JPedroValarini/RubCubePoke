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
} from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_POKEMONS } from './../graphql/queries';
import { useFavorites } from '../context/FavoritesContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface PokemonApiResponse {
  id: string;
  name: string;
  pokemon_v2_pokemontypes: {
    pokemon_v2_type: {
      name: string;
    };
  }[];
}

const POKEMONS_PER_PAGE = 10;
const TOTAL_POKEMONS = 898;
const TOTAL_PAGES = Math.ceil(TOTAL_POKEMONS / POKEMONS_PER_PAGE);

const HomeScreen = ({ navigation }: any) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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
      pokemon_v2_pokemontypes: p.pokemon_v2_pokemontypes || []
    }));
  }, [data]);

  const filteredPokemons = useMemo(() => {
    return search
      ? pokemons.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
      : pokemons;
  }, [pokemons, search]);

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

  const renderItem = ({ item }: { item: PokemonApiResponse }) => {
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.id}.png`;

    return (
      <TouchableOpacity
        style={[styles.item, isFavorite(item.id) && styles.favoriteItem]}
        onPress={() => navigation.navigate('Details', { pokemonId: item.id })}
      >
        <View style={styles.itemContent}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.pokemonImage}
            resizeMode="contain"
          />
          <Text style={styles.name}>{item.name}</Text>
        </View>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            toggleFavorite(item);
          }}
          style={styles.favoriteButton}
        >
          <MaterialIcons
            name={isFavorite(item.id) ? 'star' : 'star-outline'}
            size={24}
            color="#ffc107"
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
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
  item: {
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  favoriteItem: {
    backgroundColor: '#fff3cd',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pokemonImage: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    textTransform: 'capitalize',
    color: '#343a40',
    fontWeight: '500',
  },
  favoriteButton: {
    padding: 8,
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
});

export default HomeScreen;