import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PokemonType = {
  name: string;
};

type Pokemon = {
  id: string;
  name: string;
  imageUrl?: string;
  types?: PokemonType[];
};

type FavoritesContextData = {
  favorites: Pokemon[];
  addFavorite: (pokemon: Pokemon) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
};


const FavoritesContext = createContext<FavoritesContextData>({} as FavoritesContextData);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Pokemon[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const saved = await AsyncStorage.getItem('@pokerub_favorites');
        if (saved) {
          const parsed = JSON.parse(saved);

          const migratedFavorites = parsed.map((pokemon: any) => {
            if (pokemon.type && !pokemon.types) {
              return {
                ...pokemon,
                types: [{ name: pokemon.type }]
              };
            }
            return pokemon;
          });

          setFavorites(migratedFavorites);
        }
      } catch (error) {
        console.error('Error loading favorites', error);
      }
    };
    loadFavorites();
  }, []);

  const addFavorite = (pokemon: Pokemon) => {
    console.log('Adicionando favorito:', pokemon);
    setFavorites(prev => [...prev, pokemon]);
  };

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(p => p.id !== id));
  };

  const clearFavorites = async () => {
    try {
      await AsyncStorage.removeItem('@pokerub_favorites');
      setFavorites([]);
    } catch (error) {
      console.error('Error clearing favorites', error);
    }
  };

  const isFavorite = (id: string) => {
    return favorites.some(p => p.id === id);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        clearFavorites
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};