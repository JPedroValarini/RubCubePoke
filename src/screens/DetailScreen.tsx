import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_POKEMON_DETAILS } from '../graphql/queries';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

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

interface PokemonStat {
  base_stat: number;
  pokemon_v2_stat: {
    name: string;
  };
}

interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  pokemon_v2_pokemontypes: PokemonType[];
  pokemon_v2_pokemonabilities: PokemonAbility[];
  pokemon_v2_pokemonstats: PokemonStat[];
}

interface PokemonDetailsData {
  pokemon_v2_pokemon_by_pk: PokemonDetails;
}

interface PokemonDetailsVars {
  id: number;
}

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;
type DetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Details'>;

interface Props {
  route: DetailScreenRouteProp;
}

const DetailScreen: React.FC<Props> = ({ route }) => {
  const { pokemonId, pokemonName } = route.params;
  const navigation = useNavigation<DetailScreenNavigationProp>();
  const { evolvedPokemons } = useSelector((state: RootState) => state.pokemon);

  const isEvolved = Object.values(evolvedPokemons).includes(pokemonId);
  const originalPokemonId = Object.keys(evolvedPokemons).find(key => evolvedPokemons[key] === pokemonId);

  const { loading, error, data } = useQuery<PokemonDetailsData, PokemonDetailsVars>(
    GET_POKEMON_DETAILS,
    {
      variables: { id: parseInt(pokemonId, 10) },
    }
  );

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

  const formatStatName = (name: string): string => {
    const statNames: Record<string, string> = {
      hp: 'HP',
      attack: 'Ataque',
      defense: 'Defesa',
      'special-attack': 'Ataque Especial',
      'special-defense': 'Defesa Especial',
      speed: 'Velocidade'
    };
    return statNames[name] || name;
  };

  const renderArrayItems = <T,>(
    items: T[] | undefined | null,
    renderItem: (item: T, index: number) => React.ReactNode,
    emptyMessage: string
  ) => {
    if (!items || items.length === 0) {
      return <Text style={styles.value}>{emptyMessage}</Text>;
    }
    return items.map(renderItem);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isEvolved && (
        <View style={styles.evolvedBadge}>
          <Text style={styles.evolvedBadgeText}>Evoluído</Text>
        </View>
      )}

      <Text style={styles.title}>{pokemonName || pokemon.name}</Text>
      <Image source={{ uri: imageUrl }} style={styles.image} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações Básicas</Text>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Altura:</Text>
          <Text style={styles.value}>{(pokemon.height / 10).toFixed(1)} m</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Peso:</Text>
          <Text style={styles.value}>{(pokemon.weight / 10).toFixed(1)} kg</Text>
        </View>
        {isEvolved && originalPokemonId && (
          <View style={styles.infoBox}>
            <Text style={styles.label}>Evoluiu de:</Text>
            <Text style={styles.value}>Pokémon #{originalPokemonId}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipos</Text>
        <View style={styles.typesContainer}>
          {renderArrayItems(
            pokemon.pokemon_v2_pokemontypes,
            (type, index) => (
              <View key={`type-${index}`} style={styles.typeBadge}>
                <Text style={styles.typeText}>
                  {type.pokemon_v2_type?.name || 'Desconhecido'}
                </Text>
              </View>
            ),
            'Nenhum tipo encontrado'
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Habilidades</Text>
        <View style={styles.abilitiesContainer}>
          {renderArrayItems(
            pokemon.pokemon_v2_pokemonabilities,
            (ability, index) => (
              <View key={`ability-${index}`} style={styles.abilityBadge}>
                <Text style={styles.abilityText}>
                  {ability.pokemon_v2_ability?.name || 'Desconhecida'}
                </Text>
              </View>
            ),
            'Nenhuma habilidade encontrada'
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estatísticas</Text>
        {renderArrayItems(
          pokemon.pokemon_v2_pokemonstats,
          (stat, index) => {
            const statName = stat.pokemon_v2_stat?.name || 'stat';
            const statValue = stat.base_stat || 0;

            return (
              <View key={`stat-${index}`} style={styles.statContainer}>
                <Text style={styles.statLabel}>
                  {formatStatName(statName)}:
                </Text>
                <View style={styles.statBarContainer}>
                  <View
                    style={[
                      styles.statBar,
                      { width: `${(statValue / 255) * 100}%` }
                    ]}
                  />
                  <Text style={styles.statValue}>{statValue}</Text>
                </View>
              </View>
            );
          },
          'Nenhuma estatística encontrada'
        )}
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

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 30,
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
    color: '#333',
  },
  evolvedBadge: {
    backgroundColor: '#4CAF50',
    padding: 6,
    borderRadius: 12,
    marginBottom: 8,
    alignSelf: 'center',
  },
  evolvedBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  section: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#495057',
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    color: '#343a40',
  },
  value: {
    fontSize: 16,
    color: '#6c757d',
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  typeBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 12,
    margin: 4,
  },
  typeText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  abilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  abilityBadge: {
    backgroundColor: '#2196F3',
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 12,
    margin: 4,
  },
  abilityText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  statContainer: {
    marginBottom: 8,
  },
  statLabel: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#343a40',
  },
  statBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBar: {
    height: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    marginRight: 8,
  },
  statValue: {
    fontWeight: 'bold',
    color: '#495057',
  },
  backButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#ffc107',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
});

export default DetailScreen;