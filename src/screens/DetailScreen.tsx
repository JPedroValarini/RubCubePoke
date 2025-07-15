import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_POKEMON_DETAILS } from '../graphql/queries';

const DetailScreen = ({ route, navigation }: any) => {
  const { pokemonId } = route.params;

  const { loading, error, data } = useQuery(GET_POKEMON_DETAILS, {
    variables: { id: parseInt(pokemonId, 10) },
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#555" />
      </View>
    );
  }

  if (error || !data?.pokemon_v2_pokemon_by_pk) {
    return (
      <View style={styles.center}>
        <Text>Erro ao carregar detalhes</Text>
        <Text>{error?.message}</Text>
      </View>
    );
  }

  const pokemon = data.pokemon_v2_pokemon_by_pk;
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{pokemon.name}</Text>
      <Image source={{ uri: imageUrl }} style={styles.image} />

      <View style={styles.infoBox}>
        <Text style={styles.label}>Altura:</Text>
        <Text style={styles.value}>{pokemon.height / 10} m</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Peso:</Text>
        <Text style={styles.value}>{pokemon.weight / 10} kg</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Tipos:</Text>
        <Text style={styles.value}>
          {pokemon.pokemon_v2_pokemontypes.map((t: any) => t.pokemon_v2_type.name).join(', ')}
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Habilidades:</Text>
        <Text style={styles.value}>
          {pokemon.pokemon_v2_pokemonabilities.map((a: any) => a.pokemon_v2_ability.name).join(', ')}
        </Text>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginBottom: 12,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  infoBox: {
    width: '100%',
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#555',
  },
  backButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#ffc107',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#000',
  },
});

export default DetailScreen;
