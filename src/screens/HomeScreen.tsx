import { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

interface Pokemon {
  id: string;
  name: string;
  isFavorite?: boolean;
}

const HomeScreen = ({ navigation }: any) => {
  const mockPokemons = useMemo<Pokemon[]>(() => [
    { id: '1', name: 'bulbasaur', isFavorite: false },
    { id: '2', name: 'ivysaur', isFavorite: true },
    { id: '3', name: 'venusaur', isFavorite: false },
    { id: '4', name: 'charmander', isFavorite: false },
    { id: '5', name: 'charmeleon', isFavorite: true },
    { id: '6', name: 'charizard', isFavorite: false },
    { id: '7', name: 'squirtle', isFavorite: true },
    { id: '8', name: 'wartortle', isFavorite: false },
    { id: '9', name: 'blastoise', isFavorite: false },
  ], []); 

  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>(mockPokemons);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const filtered = mockPokemons.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPokemons(filtered);
  }, [mockPokemons, search]);

  const toggleFavorite = (id: string) => {
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
      />
    </View>
  );
};

export default HomeScreen;

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