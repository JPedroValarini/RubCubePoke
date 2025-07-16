import React from 'react';
import { StatusBar } from 'react-native';
import { ApolloProvider } from '@apollo/client';
import { Provider as ReduxProvider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { store } from './src/redux/store';
import client from './src/api/apolloClient';
import { RootStackParamList } from './types';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';
import FavoriteScreen from './src/screens/FavoriteScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <ReduxProvider store={store}>
      <ApolloProvider client={client}>
        <FavoritesProvider>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" />
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#f8f9fa',
                },
                headerTintColor: '#343a40',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            >
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'Pokémons' }}
              />
              <Stack.Screen
                name="Details"
                component={DetailScreen}
                options={({ route }) => ({
                  title: route.params.pokemonName || 'Detalhes'
                })}
              />
              <Stack.Screen
                name="Favorites"
                component={FavoriteScreen}
                options={{ title: 'Favoritos' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </FavoritesProvider>
      </ApolloProvider>
    </ReduxProvider>
  );
}

export default App;