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
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
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
      
      setAllPokemons(prev => [...prev, ...newPokemons]);
      setFilteredPokemons(prev => [...prev, ...newPokemons]);
    }
  }, [data, favorites]);

  useEffect(() => {
    const filtered = allPokemons.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPokemons(filtered);
  }, [search, allPokemons]);

  const loadMore = () => {
    if (!loading) {
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
      <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
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
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#555" /> : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
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
  name: { fontSize: 18, textTransform: 'capitalize' },
  favoriteIcon: {
    fontSize: 20,
    color: '#ffc107',
  },
});

export default HomeScreen;