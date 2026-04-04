import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

interface LoaderProps {
  message?: string;
}

export function Loader({ message = 'Loading...' }: LoaderProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#E50914" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: '#999999',
  },
});
