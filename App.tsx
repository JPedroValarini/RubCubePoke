import { StatusBar, StyleSheet, View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';

function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <HomeScreen navigation={{ navigate: () => {} }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;