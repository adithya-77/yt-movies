import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  Linking,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Play, X, Menu, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MovieCard } from '@/components/MovieCard';
import { supabase } from '@/lib/supabase';
import { fetchIMDbData, getYouTubeThumbnail } from '@/services/imdb';
import { CachedMovie } from '@/types/movie';
import { SafeAreaView } from 'react-native-safe-area-context';
import { validateImdbId, validateYouTubeUrl, formatImdbId } from '@/utils/validation';

const { width, height } = Dimensions.get('window');

// Safely parse genres (handles string, array, or undefined)
const parseGenres = (raw: any): string[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return []; }
  }
  return [];
};

export default function HomeScreen() {
  const router = useRouter();
  const [movies, setMovies] = useState<CachedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add Movie Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [imdbId, setImdbId] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);

  const loadMovies = async () => {
    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      if (data) {
        const moviesWithImdbData = await Promise.all(
          data.map(async (movie) => {
            // 1. If cached in DB, use it instantly (Zero latency)
            if (movie.imdb_data) {
              return {
                ...movie,
                imdbData: movie.imdb_data,
              };
            }

            // 2. Fallback for old movies: fetch from API and lazy-migrate to DB
            const imdbData = await fetchIMDbData(movie.imdb_id);
            if (imdbData) {
              // Update Supabase in the background so next time it's instant
              supabase.from('movies').update({ imdb_data: imdbData }).eq('id', movie.id).then();
            }

            return {
              ...movie,
              imdbData: imdbData || undefined,
            };
          })
        );
        setMovies(moviesWithImdbData);
      }
    } catch (err) {
      console.error('Error loading movies:', err);
      setError('Failed to load movies. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadMovies();
  }, []);

  const handleMoviePress = (movie: CachedMovie) => {
    router.push({
      pathname: '/movie/[id]',
      params: {
        id: movie.id,
        movieData: JSON.stringify(movie)
      },
    });
  };

  const handleAddMovie = async () => {
    setAddError(null);
    if (!validateImdbId(imdbId)) {
      setAddError('Enter a valid IMDb ID (e.g., tt1234567)');
      return;
    }
    if (!validateYouTubeUrl(youtubeUrl)) {
      setAddError('Enter a valid YouTube URL');
      return;
    }

    setAddLoading(true);
    try {
      const formattedId = formatImdbId(imdbId);
      // Fetch IMDb data to get genres
      const imdbData = await fetchIMDbData(formattedId);
      const genres = imdbData?.genres || [];

      const { error: insertError } = await supabase.from('movies').insert({
        name: imdbData?.primaryTitle || '',
        imdb_id: formattedId,
        youtube_url: youtubeUrl.trim(),
        genres: genres,
      });
      if (insertError) {
        if (insertError.code === '23505') {
          setAddError('This movie already exists!');
        } else {
          throw insertError;
        }
        return;
      }
      setImdbId('');
      setYoutubeUrl('');
      setModalVisible(false);
      setRefreshing(true);
      loadMovies();
    } catch (err) {
      console.error('Error adding movie:', err);
      setAddError('Failed to add movie. Try again.');
    } finally {
      setAddLoading(false);
    }
  };

  const renderHeroBanner = (heroMovie: CachedMovie) => {
    const posterUrl = heroMovie.imdbData?.primaryImage?.url || (heroMovie.youtube_url ? getYouTubeThumbnail(heroMovie.youtube_url) : 'https://images.unsplash.com/photo-1440404653325-ab127f49c002?q=80&w=1470&auto=format&fit=crop');
    const title = heroMovie.imdbData?.primaryTitle || heroMovie.name;
    const rating = heroMovie.imdbData?.rating?.aggregateRating;
    const year = heroMovie.imdbData?.startYear;
    const genres = heroMovie.imdbData?.genres?.slice(0, 2) || [];
    
    return (
      <View style={styles.heroContainer}>
        <ImageBackground 
          source={{ uri: posterUrl }} 
          style={styles.heroImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['transparent', 'rgba(15, 23, 30, 0.4)', '#0F171E']}
            locations={[0, 0.5, 1]}
            style={styles.heroGradient}
          >
            <View style={styles.heroBottomRow}>
              <View style={{ flex: 1, marginRight: 16 }}>
                <Text style={styles.heroTitle} numberOfLines={2}>{title}</Text>
                <View style={styles.heroMeta}>
                  {rating && (
                    <View style={styles.heroMetaPill}>
                      <Text style={styles.heroMetaStar}>⭐</Text>
                      <Text style={styles.heroMetaText}>{rating}</Text>
                    </View>
                  )}
                  {year && <Text style={styles.heroMetaText}>{year}</Text>}
                  {genres.map(g => (
                    <View key={g} style={styles.heroGenrePill}>
                      <Text style={styles.heroGenreText}>{g}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <TouchableOpacity 
                style={styles.heroPlayBtn}
                onPress={() => handleMoviePress(heroMovie)}
                activeOpacity={0.8}
              >
                <Play size={22} color="#000" fill="#000" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    );
  };

  // Pick up to 5 random movies for the hero carousel (memoized so it doesn't re-shuffle on re-render)
  const heroMovies = useMemo(() => {
    if (movies.length === 0) return [];
    return [...movies].sort(() => 0.5 - Math.random()).slice(0, Math.min(5, movies.length));
  }, [movies]);



  const sections = useMemo(() => {
    if (movies.length === 0) return [];

    const result: any[] = [];

    // 1. Recently Added
    result.push({
      id: 'recent',
      title: 'Recently Added',
      data: movies.slice(0, 10),
    });

    const genreMap: Record<string, CachedMovie[]> = {};
    movies.forEach(movie => {
      const movieGenres = parseGenres(movie.genres).length > 0
        ? parseGenres(movie.genres)
        : parseGenres(movie.imdbData?.genres);
      if (movieGenres.length === 0) {
        if (!genreMap['Other']) genreMap['Other'] = [];
        genreMap['Other'].push(movie);
      } else {
        movieGenres.forEach((genre: string) => {
          if (!genreMap[genre]) genreMap[genre] = [];
          genreMap[genre].push(movie);
        });
      }
    });

    Object.entries(genreMap).forEach(([genre, genreMovies], index, arr) => {
      result.push({
        id: `genre-${genre}`,
        title: genre,
        data: genreMovies,
        isLast: index === arr.length - 1
      });
    });

    return result;
  }, [movies]);

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontFamily: 'Inter_400Regular' }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.mainWrapper}>
      {/* Hamburger icon at top left */}
      <SafeAreaView style={styles.topBar}>
        <TouchableOpacity style={styles.hamburgerBtn} onPress={() => setMenuVisible(true)}>
          <Menu color="#fff" size={24} />
        </TouchableOpacity>
      </SafeAreaView>

      <FlatList
        style={styles.container}
        data={sections}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
            colors={['#fff']}
          />
        }
        keyExtractor={(item) => item.id}
        ListHeaderComponent={(
          <View>
            {heroMovies.length > 0 ? (
              <View>
                <FlatList
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  data={heroMovies}
                  keyExtractor={(item) => 'hero-' + item.id}
                  onMomentumScrollEnd={(e) => {
                    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
                    setHeroIndex(idx);
                  }}
                  renderItem={({ item }) => renderHeroBanner(item)}
                />
                {/* Dot indicators */}
                <View style={styles.dotsContainer}>
                  {heroMovies.map((_, i) => (
                    <View key={i} style={[styles.dot, heroIndex === i && styles.dotActive]} />
                  ))}
                </View>
              </View>
            ) : (
              <View style={[styles.heroContainer, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a' }]}>
                <Text style={{ color: '#999' }}>No Featured Movie</Text>
              </View>
            )}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </View>
        )}
        renderItem={({ item }) => (
          <View style={[styles.sectionContainer, item.isLast && { marginBottom: 80 }]}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              initialNumToRender={4}
              windowSize={3}
              data={item.data}
              keyExtractor={(movie) => movie.id + item.id}
              renderItem={({ item: movie }) => (
                <View style={{ marginRight: 12 }}>
                  <MovieCard 
                    movie={movie}
                    onPress={() => handleMoviePress(movie)} 
                    width={width * 0.32}
                    height={width * 0.48}
                  />
                </View>
              )}
              contentContainerStyle={styles.horizontalListContent}
            />
          </View>
        )}
      />

      {/* Side Menu Overlay */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={() => setMenuVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.menuDrawer} onPress={() => {}}>
            <View style={styles.menuHeader}>
              {/* <Text style={styles.menuAppName}>CineStream</Text> */}
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <X color="#fff" size={22} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => { setMenuVisible(false); setModalVisible(true); }}
            >
              <Plus color="#fff" size={20} />
              <Text style={styles.menuItemText}>Add Movie</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Add Movie Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
            <TouchableOpacity activeOpacity={1} style={styles.modalContent} onPress={() => {}}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Movie</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <X color="#fff" size={24} />
                </TouchableOpacity>
              </View>

              {addError && (
                <View style={styles.modalError}>
                  <Text style={styles.modalErrorText}>{addError}</Text>
                </View>
              )}

              <Text style={styles.inputLabel}>IMDb ID</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., tt1234567"
                placeholderTextColor="#666"
                value={imdbId}
                onChangeText={setImdbId}
                autoCapitalize="none"
              />

              <Text style={styles.inputLabel}>YouTube URL</Text>
              <TextInput
                style={styles.input}
                placeholder="https://youtube.com/watch?v=..."
                placeholderTextColor="#666"
                value={youtubeUrl}
                onChangeText={setYoutubeUrl}
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={[styles.submitBtn, addLoading && { opacity: 0.5 }]}
                onPress={handleAddMovie}
                disabled={addLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.submitBtnText}>
                  {addLoading ? 'Adding...' : 'Add Movie'}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#0F171E',
  },
  container: {
    flex: 1,
  },
  heroContainer: {
    width: width,
    height: height * 0.55,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 32,
  },
  heroBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#ffffff',
    textAlign: 'left',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 4,
  },
  heroPlayBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  heroMetaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  heroMetaStar: {
    fontSize: 11,
  },
  heroMetaText: {
    color: '#e0e0e0',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  heroGenrePill: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  heroGenreText: {
    color: '#ccc',
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },
  sectionContainer: {
    marginTop: -10,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#ffffff',
    marginLeft: 16,
    marginBottom: 14,
  },
  horizontalListContent: {
    paddingLeft: 16,
    paddingRight: 4,
  },
  errorContainer: {
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E50914',
  },
  errorText: {
    color: '#E50914',
    fontSize: 14,
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    color: '#fff',
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
  },
  modalError: {
    backgroundColor: 'rgba(229, 9, 20, 0.15)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E50914',
  },
  modalErrorText: {
    color: '#E50914',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  inputLabel: {
    color: '#ccc',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  submitBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: '#000',
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },
  // Top bar & hamburger
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  hamburgerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Menu drawer
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
  },
  menuDrawer: {
    width: width * 0.7,
    backgroundColor: '#141414',
    paddingTop: (StatusBar.currentHeight || 50) + 10,
    paddingHorizontal: 24,
    paddingBottom: 40,
    flex: 1,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  menuAppName: {
    color: '#E50914',
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  menuItemText: {
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 2,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#fff',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
