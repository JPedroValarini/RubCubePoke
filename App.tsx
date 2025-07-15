import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { ApolloProvider } from '@apollo/client';
import client from './src/api/apolloClient';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Pokémons' }}
          />
          <Stack.Screen
            name="Details"
            component={DetailScreen}
            options={{ title: 'Detalhes do Pokémon' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
export { styles as appStyles };