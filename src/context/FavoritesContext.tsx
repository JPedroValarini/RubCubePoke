import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PokemonType = {
  name: string;
};

type Pokemon = {
  id: string;
  name: string;
  imageUrl?: string;
  types?: PokemonType[];
  originalId?: string;
};

type FavoritesContextData = {
  favorites: Pokemon[];
  addFavorite: (pokemon: Pokemon, isEvolved?: boolean) => void;
  removeFavorite: (id: string, checkOriginalId?: boolean) => void;
  isFavorite: (id: string, checkOriginalId?: boolean) => boolean;
  clearFavorites: () => void;
  getOriginalIdIfEvolved: (id: string) => string | null;
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
          setFavorites(parsed);
        }
      } catch (error) {
        console.error('Error loading favorites', error);
      }
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem('@pokerub_favorites', JSON.stringify(favorites));
      } catch (error) {
        console.error('Error saving favorites', error);
      }
    };
    saveFavorites();
  }, [favorites]);

  const isFavorite = useCallback((id: string, checkOriginalId: boolean = true) => {
    return favorites.some(p =>
      p.id === id ||
      (checkOriginalId && p.originalId === id)
    );
  }, [favorites]);

  const addFavorite = useCallback((pokemon: Pokemon, isEvolved: boolean = false) => {
    setFavorites(prev => {
      if (isFavorite(pokemon.id, false)) {
        return prev;
      }

      const favoriteToAdd = isEvolved
        ? { ...pokemon, originalId: pokemon.originalId || pokemon.id }
        : pokemon;

      return [...prev, favoriteToAdd];
    });
  }, [isFavorite]);

  const removeFavorite = useCallback((id: string, checkOriginalId: boolean = true) => {
    setFavorites(prev =>
      prev.filter(p =>
        p.id !== id &&
        (!checkOriginalId || p.originalId !== id)
      )
    );
  }, []);

  const clearFavorites = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('@pokerub_favorites');
      setFavorites([]);
    } catch (error) {
      console.error('Error clearing favorites', error);
    }
  }, []);

  const getOriginalIdIfEvolved = useCallback((id: string) => {
    const found = favorites.find(p => p.id === id);
    return found?.originalId || null;
  }, [favorites]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        clearFavorites,
        getOriginalIdIfEvolved
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