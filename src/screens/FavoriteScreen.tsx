import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  Easing,
  Image,
  ImageBackground
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useFavorites } from '../context/FavoritesContext';
import styles from '../assets/FavoriteScreen.styles';


interface Pokemon {
  id: string;
  name: string;
  imageUrl?: string;
  types?: { name: string }[];
}

const FavoriteScreen = ({ navigation }: any) => {
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const spinValue = new Animated.Value(0);

  Animated.loop(
    Animated.sequence([
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      Animated.delay(500),
    ])
  ).start();

  const glowInterpolate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '10deg'],
  });

  const renderItem = ({ item }: { item: Pokemon }) => {
    const scaleValue = new Animated.Value(1);

    const onPressIn = () => {
      Animated.spring(scaleValue, {
        toValue: 0.96,
        friction: 5,
        useNativeDriver: true,
      }).start();
    };

    const onPressOut = () => {
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }).start();
    };

    const pokemonImage = item.imageUrl || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.id}.png`;

    return (
      <Animated.View style={{
        transform: [{ scale: scaleValue }],
        margin: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={() => navigation.navigate('Details', { pokemonId: item.id })}
          onLongPress={() => removeFavorite(item.id)}
        >
          <LinearGradient
            colors={['#fff3cd', '#ffc107']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.idText}>#{item.id.toString().padStart(3, '0')}</Text>
              <Animated.View style={{ transform: [{ rotate: glowInterpolate }] }}>
                <MaterialIcons name="star" size={24} color="#d4af37" />
              </Animated.View>
            </View>

            <Image
              source={{ uri: pokemonImage }}
              style={styles.pokemonImage}
              resizeMode="contain"
            />

            <View style={styles.cardFooter}>
              <Text style={styles.name}>{item.name}</Text>
              {item.types && item.types.length > 0 ? (
                <View style={styles.typesContainer}>
                  {item.types.map((type, index) => (
                    <View
                      key={index}
                      style={[styles.typeBadge, { backgroundColor: getTypeColor(type.name) }]}
                    >
                      <Text style={styles.typeText}>{type.name}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noTypeText}>Sem tipo definido</Text>
              )}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <ImageBackground
      style={styles.container}
      imageStyle={{ opacity: 0.05 }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Pokémon Favoritos</Text>
        <View style={styles.divider} />
        <View style={styles.headerActions}>
          <Text style={styles.countText}>{favorites.length} {favorites.length === 1 ? 'favorito' : 'favoritos'}</Text>
          {favorites.length > 0 && (
            <TouchableOpacity
              onPress={() => clearFavorites()}
              style={styles.clearButton}
            >
              <MaterialIcons name="delete" size={20} color="#dc3545" />
              <Text style={styles.clearButtonText}>Limpar tudo</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="star-outline" size={80} color="#ffc107" />
          <Text style={styles.empty}>Sua lista de favoritos está vazia</Text>
          <Text style={styles.emptySubtitle}>Toque no ícone de estrela para adicionar</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => `favorite-${item.id}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ImageBackground>
  );
};

const getTypeColor = (typeName: string) => {
  const colors: Record<string, string> = {
    fire: '#fd7d24',
    water: '#4592c4',
    grass: '#9bcc50',
    electric: '#eed535',
    poison: '#b97fc9',
    flying: '#3dc7ef',
    ice: '#51c4e7',
    fighting: '#d56723',
    ground: '#f7de3f',
    psychic: '#f366b9',
    bug: '#729f3f',
    rock: '#a38c21',
    ghost: '#7b62a3',
    dragon: '#53a4cf',
    dark: '#707070',
    steel: '#9eb7b8',
    fairy: '#fdb9e9',
    normal: '#a4acaf'
  };
  return colors[typeName.toLowerCase()] || '#a0a0a0';
};

export default FavoriteScreen;