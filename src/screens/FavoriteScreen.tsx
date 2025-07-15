import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Image,
  Dimensions,
  ImageBackground
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

interface Pokemon {
  id: string;
  name: string;
  imageUrl?: string;
  isFavorite?: boolean;
  type?: string;
}

const FavoriteScreen = ({ route, navigation }: any) => {
  const { favorites }: { favorites: Pokemon[] } = route.params;
  const spinValue = new Animated.Value(0);

  // Animação mais suave
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
              {item.type && (
                <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) }]}>
                  <Text style={styles.typeText}>{item.type}</Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <ImageBackground
      // source={require('./assets/pokeball-pattern.png')}
      style={styles.container}
      imageStyle={{ opacity: 0.05 }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Pokémon Favoritos</Text>
        <View style={styles.divider} />
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

// Função auxiliar para cores de tipo (adicione mais conforme necessário)
const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    fire: '#fd7d24',
    water: '#4592c4',
    grass: '#9bcc50',
    electric: '#eed535',
    // Adicione outros tipos aqui
  };
  return colors[type.toLowerCase()] || '#a0a0a0';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#343a40',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(255, 193, 7, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  divider: {
    height: 4,
    width: 80,
    backgroundColor: '#ffc107',
    borderRadius: 2,
    marginTop: 8,
  },
  card: {
    borderRadius: 16,
    padding: 12,
    width: (width - 48) / 2,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pokemonImage: {
    width: '100%',
    height: 100,
    marginVertical: 8,
  },
  cardFooter: {
    alignItems: 'center',
    marginTop: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#343a40',
    textTransform: 'capitalize',
    marginBottom: 6,
  },
  idText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  typeBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 4,
  },
  typeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  empty: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495057',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 8,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default FavoriteScreen;