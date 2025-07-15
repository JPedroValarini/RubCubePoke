import { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_POKEMONS } from './../graphql/queries';

interface Pokemon {
  id: string;
  name: string;
  isFavorite?: boolean;
}

const LIMIT = 50;

const HomeScreen = ({ navigation }: any) => {
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [, setAllPokemons] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);

  const { loading, error, data } = useQuery(GET_POKEMONS, {
    variables: { limit: LIMIT, offset },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (data) {
      const newPokemons = data.pokemon_v2_pokemon.map((p: any) => ({
        id: String(p.id),
        name: p.name,
        isFavorite: favorites.includes(String(p.id)),
      }));

      setAllPokemons(prev => {
        const combined = [...prev, ...newPokemons];
        return Array.from(new Map(combined.map(p => [p.id, p])).values());
      });

      setFilteredPokemons(prev => {
        const combined = [...prev, ...newPokemons];
        const unique = Array.from(new Map(combined.map(p => [p.id, p])).values());
        return search
          ? Array.from(unique).filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()))
          : Array.from(unique);
      });
    }
  }, [data, favorites, search]);

  const loadMore = () => {
    if (!loading && data?.pokemon_v2_pokemon?.length === LIMIT) {
      setOffset(prev => prev + LIMIT);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );

    setAllPokemons(prev =>
      prev.map(p =>
        p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );

    setFilteredPokemons(prev =>
      prev.map(p =>
        p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
      )
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

      <FlatList
        data={filteredPokemons}
        keyExtractor={(item) => `pokemon-${item.id}`}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#555" /> : null
        }
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={5}
      />
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
});

export default HomeScreen;