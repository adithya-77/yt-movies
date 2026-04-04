import { useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Star } from 'lucide-react-native';
import { CachedMovie } from '@/types/movie';
import { getYouTubeThumbnail } from '@/services/imdb';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MovieCardProps {
  movie: CachedMovie;
  onPress: () => void;
  width?: number;
  height?: number;
}

export function MovieCard({ movie, onPress, width, height }: MovieCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  
  const cardWidth = width || (SCREEN_WIDTH - 48) / 2;
  const cardHeight = height || cardWidth * 1.5;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const posterUrl = movie.imdbData?.primaryImage?.url || (movie.youtube_url ? getYouTubeThumbnail(movie.youtube_url) : 'https://via.placeholder.com/300x450/1a1a1a/666666?text=No+Poster');
  const rating = movie.imdbData?.rating?.aggregateRating?.toFixed(1) || 'N/A';
  const title = movie.imdbData?.primaryTitle || movie.name;

  return (
    <Animated.View style={[styles.container, { transform: [{ scale }] }, { width: cardWidth, height: cardHeight }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ flex: 1 }}
      >
        <View style={styles.card}>
          <Image source={{ uri: posterUrl }} style={styles.poster} resizeMode="cover" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 11,
    color: '#FFD700',
    fontWeight: '700',
  },
});
