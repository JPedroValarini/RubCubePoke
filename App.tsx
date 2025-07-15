import { StatusBar, StyleSheet, View } from 'react-native';
import { ApolloProvider } from '@apollo/client';
import client from './src/api/apolloClient';
import HomeScreen from './src/screens/HomeScreen';

function App() {
  return (
    <ApolloProvider client={client}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <HomeScreen navigation={{ navigate: () => { } }} />
      </View>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;