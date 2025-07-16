import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_POKEMON_DETAILS } from '../graphql/queries';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import styles from '../assets/DetailScreen.styles';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;
type DetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Details'
>;

interface Props {
  route: DetailScreenRouteProp;
  navigation: DetailScreenNavigationProp;
}

interface PokemonType {
  pokemon_v2_type: {
    name: string;
  };
}

interface PokemonAbility {
  pokemon_v2_ability: {
    name: string;
  };
}

const DetailScreen: React.FC<Props> = ({ route }) => {
  const { pokemonId, pokemonName } = route.params;
  const navigation = useNavigation<DetailScreenNavigationProp>();

  const { loading, error, data } = useQuery(GET_POKEMON_DETAILS, {
    variables: { id: parseInt(pokemonId, 10) },
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#555" />
        <Text style={styles.loadingText}>Carregando {pokemonName}...</Text>
      </View>
    );
  }

  if (error || !data?.pokemon_v2_pokemon_by_pk) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Erro ao carregar detalhes</Text>
        <Text style={styles.errorMessage}>{error?.message}</Text>
      </View>
    );
  }

  const pokemonData = data.pokemon_v2_pokemon_by_pk;
  const isEvolved = pokemonName.toLowerCase() !== pokemonData.name.toLowerCase();

  const getPokemonTypes = () => {
    return pokemonData.pokemon_v2_pokemontypes?.map(
      (type: PokemonType) => type.pokemon_v2_type.name
    ) || [];
  };

  const getPokemonAbilities = () => {
    return pokemonData.pokemon_v2_pokemonabilities?.map(
      (ability: PokemonAbility) => ability.pokemon_v2_ability.name
    ) || [];
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{pokemonName}</Text>

      {isEvolved && (
        <View style={styles.evolvedTag}>
          <Text style={styles.evolvedText}>
            Evoluído de {pokemonData.name}
          </Text>
        </View>
      )}

      <Image
        source={{
          uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`
        }}
        style={styles.image}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações Básicas</Text>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Número:</Text>
          <Text style={styles.value}>#{pokemonId.padStart(3, '0')}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Altura:</Text>
          <Text style={styles.value}>{(pokemonData.height / 10).toFixed(1)} m</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Peso:</Text>
          <Text style={styles.value}>{(pokemonData.weight / 10).toFixed(1)} kg</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipos</Text>
        <View style={styles.typesContainer}>
          {getPokemonTypes().map((type: string, index: number) => (
            <View key={index} style={styles.typeBadge}>
              <Text style={styles.typeText}>{type}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Habilidades</Text>
        <View style={styles.abilitiesContainer}>
          {getPokemonAbilities().map((ability: string, index: number) => (
            <View key={index} style={styles.abilityBadge}>
              <Text style={styles.abilityText}>{ability}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DetailScreen;