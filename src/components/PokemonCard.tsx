import React from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Easing } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../assets/PokemonCard.styles';

export interface PokemonCardProps {
  pokemon: {
    id: string;
    name: string;
    types: Array<{ name: string }>;
    imageUrl: string;
    isEvolved?: boolean;
    originalName?: string;
  };
  isFavorite: boolean;
  canEvolve: boolean;
  hasEvolved: boolean;
  onPress: () => void;
  onFavoritePress: () => void;
  onEvolutionPress: () => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  isFavorite,
  canEvolve,
  hasEvolved,
  onPress,
  onFavoritePress,
  onEvolutionPress,
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  const glowAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (canEvolve) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [canEvolve, glowAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(76, 175, 80, 0)', 'rgba(76, 175, 80, 0.2)'],
  });

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        style={[
          styles.item,
          isFavorite && styles.favoriteItem,
          canEvolve && styles.evolvableItem,
          pokemon.isEvolved && styles.evolvedItem,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
      >
        {canEvolve && (
          <Animated.View
            style={[
              styles.glowEffect,
              { backgroundColor: glowColor },
            ]}
          />
        )}

        {pokemon.isEvolved && (
          <View style={styles.evolvedTag}>
            <Text style={styles.evolvedTagText}>Evoluído</Text>
          </View>
        )}

        <View style={styles.itemContent}>
          <Image
            source={{ uri: pokemon.imageUrl }}
            style={styles.pokemonImage}
            resizeMode="contain"
          />

          <View style={styles.nameContainer}>
            <Text style={styles.name} numberOfLines={2}>
              {pokemon.name}
            </Text>

            <View style={styles.evolutionStatus}>
              {canEvolve && !hasEvolved && (
                <Text style={styles.evolutionText}>Pode evoluir</Text>
              )}
              {hasEvolved && !canEvolve && (
                <Text style={styles.evolvedText}>Evolução final</Text>
              )}
            </View>
          </View>

          <View style={styles.typeContainer}>
            {pokemon.types.map((type, index) => (
              <View
                key={`${type.name}-${index}`}
                style={[styles.typePill, { backgroundColor: getTypeColor(type.name) }]}
              >
                <Text style={styles.typeText}>{type.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actionsContainer}>
          {canEvolve && (
            <TouchableOpacity
              style={styles.evolveButton}
              onPress={(e) => {
                e.stopPropagation();
                onEvolutionPress();
              }}
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
              color={isFavorite ? '#FFD700' : '#aaa'}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const getTypeColor = (type: string | { name: string }) => {
  const typeName = typeof type === 'string' ? type : type.name;

  const typeColors: Record<string, string> = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };

  return typeColors[typeName.toLowerCase()] || '#777';
};

export default PokemonCard;
