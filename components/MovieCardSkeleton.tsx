import { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export function MovieCardSkeleton() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={styles.poster} />
      <View style={styles.info}>
        <View style={styles.titleLine} />
        <View style={styles.titleLineShort} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.5,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  poster: {
    flex: 1,
    backgroundColor: '#2a2a2a',
  },
  info: {
    padding: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  titleLine: {
    height: 12,
    backgroundColor: '#3a3a3a',
    borderRadius: 4,
    marginBottom: 8,
  },
  titleLineShort: {
    height: 12,
    backgroundColor: '#3a3a3a',
    borderRadius: 4,
    width: '60%',
  },
});
