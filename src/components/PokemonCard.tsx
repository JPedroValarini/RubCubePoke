import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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

interface PokemonCardProps {
  pokemon: PokemonApiResponse;
  isFavorite: boolean;
  onPress: () => void;
  onFavoritePress: () => void;
  onEvolutionPress: () => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  isFavorite,
  onPress,
  onFavoritePress,
  onEvolutionPress,
}) => {
  const canEvolve = pokemon.evolutionChain.length > 1 &&
    pokemon.evolutionChain.some(evo => evo.evolvesFromId === pokemon.id);

  return (
    <TouchableOpacity
      style={[
        styles.item,
        isFavorite && styles.favoriteItem,
        canEvolve && styles.evolvableItem
      ]}
      onPress={onPress}
    >
      <View style={styles.itemContent}>
        <Image
          source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png` }}
          style={styles.pokemonImage}
          resizeMode="contain"
        />
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{pokemon.name}</Text>
          {canEvolve && (
            <Text style={styles.evolutionText}>Pode evoluir</Text>
          )}
        </View>
      </View>

      <View style={styles.actionsContainer}>
        {canEvolve && (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onEvolutionPress();
            }}
            style={styles.evolveButton}
          >
            <MaterialIcons name="auto-awesome" size={20} color="#4CAF50" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onFavoritePress();
          }}
          style={styles.favoriteButton}
        >
          <MaterialIcons
            name={isFavorite ? 'star' : 'star-outline'}
            size={24}
            color="#ffc107"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  evolvableItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
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
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    textTransform: 'capitalize',
    color: '#343a40',
    fontWeight: '500',
  },
  evolutionText: {
    fontSize: 12,
    color: '#4CAF50',
    fontStyle: 'italic',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  evolveButton: {
    padding: 8,
    marginRight: 8,
  },
  favoriteButton: {
    padding: 8,
  },
});

export default PokemonCard;