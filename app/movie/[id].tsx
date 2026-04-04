import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Play, ArrowLeft, ArrowUpRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CachedMovie, IMDbCredit, IMDbCertificate } from '@/types/movie';
import { getYouTubeThumbnail, fetchIMDbCredits, fetchIMDbCertificates } from '@/services/imdb';

const { width, height } = Dimensions.get('window');

export default function MovieDetailsScreen() {
  const { movieData } = useLocalSearchParams();
  const router = useRouter();
  
  const [credits, setCredits] = useState<IMDbCredit[]>([]);
  const [cbfc, setCbfc] = useState<string>('');
  const [plotExpanded, setPlotExpanded] = useState(false);

  if (!movieData) return null;
  const movie: CachedMovie = JSON.parse(movieData as string);

  useEffect(() => {
    fetchIMDbCredits(movie.imdb_id).then(data => {
      setCredits(data);
    });
    fetchIMDbCertificates(movie.imdb_id).then((certs: IMDbCertificate[]) => {
      const indiaCert = certs.find(c => c.country.code === 'IN');
      if (indiaCert) {
        setCbfc(indiaCert.rating);
      } else {
        const usCert = certs.find(c => c.country.code === 'US');
        setCbfc(usCert?.rating || 'N/A');
      }
    });
  }, [movie.imdb_id]);

  const posterUrl = movie.imdbData?.primaryImage?.url || (movie.youtube_url ? getYouTubeThumbnail(movie.youtube_url) : 'https://images.unsplash.com/photo-1440404653325-ab127f49c002?q=80&w=1470&auto=format&fit=crop');
  const title = movie.imdbData?.primaryTitle || movie.name;
  
  const ratingText = movie.imdbData?.rating?.aggregateRating ? `${movie.imdbData.rating.aggregateRating}/10` : 'N/A';
  const rawRating = movie.imdbData?.rating?.aggregateRating || 0;
  // Fallback to RT-like score percentage for the badge if there's rating
  const percentage = rawRating ? `${Math.round(rawRating * 10)}%` : 'N/A';
  const year = movie.imdbData?.startYear ? `${movie.imdbData.startYear}` : '2023';
  const runtime = movie.imdbData?.runtimeSeconds ? `${Math.floor(movie.imdbData.runtimeSeconds / 3600)} hr ${Math.floor((movie.imdbData.runtimeSeconds % 3600) / 60)} min` : '2 hr 15 min';

  const plot = movie.imdbData?.plot || 'No description available for this movie.';

  const handlePlayClick = () => {
    if (movie.youtube_url) {
      Linking.openURL(movie.youtube_url).catch(err => console.error('An error occurred', err));
    }
  };

  const castItems = credits.filter(c => c.category === 'actor').map(c => ({
    id: c.name.id,
    name: c.name.displayName,
    imageUrl: c.name.primaryImage?.url,
    role: c.characters && c.characters.length > 0 ? c.characters[0] : 'Actor'
  }));

  const crewItems = credits.filter(c => c.category === 'director' || c.category === 'writer').map(c => ({
    id: c.name.id + c.category,
    name: c.name.displayName,
    imageUrl: c.name.primaryImage?.url,
    role: c.category.charAt(0).toUpperCase() + c.category.slice(1) // "Director", "Writer"
  }));

  const combinedCredits = [...crewItems, ...castItems];

  return (
    <View style={styles.container}>
      <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <View style={styles.heroContainer}>
          <Image source={{ uri: posterUrl }} style={styles.heroImage} resizeMode="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(10,10,10,0.5)', '#0A0A0A', '#0A0A0A']}
            locations={[0.2, 0.5, 0.85, 1]}
            style={styles.heroGradient}
          />
          <SafeAreaView style={styles.header}>
            <View style={styles.topActionsRow}>
              <TouchableOpacity onPress={() => router.back()} style={styles.actionBtn}>
                <ArrowLeft color="#000" size={20} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          <View style={styles.metaOverlay}>
            <Text style={styles.title}>{title}</Text>
            
            <View style={styles.metaRow}>
              {percentage !== 'N/A' && <Text style={styles.greenText}>*{percentage}</Text>}
              {cbfc !== '' && (
                <View style={styles.cbfcBadge}>
                  <Text style={styles.cbfcText}>CBFC: {cbfc}</Text>
                </View>
              )}
              <Text style={styles.metaDetails}>
                {year} • {runtime}
              </Text>
            </View>

            <TouchableOpacity onPress={() => setPlotExpanded(!plotExpanded)} activeOpacity={0.7} style={{ width: '100%' }}>
              <Text style={styles.plot} numberOfLines={plotExpanded ? undefined : 3}>{plot}</Text>
              <View style={styles.expandArrow}>
                <Text style={{ color: '#999', fontSize: 18 }}>{plotExpanded ? '▲' : '▼'}</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.watchNowPill} onPress={handlePlayClick} activeOpacity={0.9}>
              <View style={{ flex: 1 }} />
              <View style={{ alignItems: 'center', flex: 2 }}>
                <Text style={styles.watchNowMainText}>Watch now</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-start' }}>
                <View style={styles.playIconContainer}>
                  <Play color="#fff" size={18} fill="#fff" />
                </View>
              </View>
            </TouchableOpacity>

          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionHeader}>Ratings</Text>
          <View style={styles.ratingsCardRow}>
            <TouchableOpacity style={styles.ratingCard} activeOpacity={0.8} onPress={() => Linking.openURL(`https://www.imdb.com/title/${movie.imdb_id}/`)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                <View style={styles.imdbBadge}>
                  <Text style={styles.imdbBadgeText}>IMDb</Text>
                </View>
                <View>
                  <Text style={styles.ratingNumber}>{ratingText}</Text>
                  <Text style={styles.ratingSource}>IMDb</Text>
                </View>
              </View>
              <ArrowUpRight color="#666" size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.castHeaderRow}>
             <Text style={styles.sectionHeader}>Cast & Crew</Text>
             <TouchableOpacity style={styles.roundIconBtn} onPress={() => Linking.openURL(`https://www.imdb.com/title/${movie.imdb_id}/fullcredits/`)}>
               <ArrowUpRight color="#ccc" size={16} />
             </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={combinedCredits}
            keyExtractor={(item, idx) => item.id + idx}
            contentContainerStyle={styles.creditsList}
            renderItem={({ item }) => (
              <View style={styles.castItem}>
                <Image 
                  source={{ uri: item.imageUrl || 'https://via.placeholder.com/150x150/1a1a1a/666666?text=No+Img' }} 
                  style={styles.castImage} 
                />
                <Text style={styles.castName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.castCharacter} numberOfLines={1}>{item.role}</Text>
              </View>
            )}
            ListEmptyComponent={() => <Text style={{color: '#666', paddingLeft: 20}}>Loading...</Text>}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  heroContainer: {
    width,
    height: height * 0.75, // very tall like JioHotstar
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  topActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.78)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metaOverlay: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 40,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 12,
  },
  greenText: {
    color: '#10B981',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  cbfcBadge: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  cbfcText: {
    color: '#ccc',
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },
  metaDetails: {
    color: '#e0e0e0',
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
  },
  plot: {
    color: '#d0d0d0',
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'left',
    marginBottom: 24,
    width: '100%',
  },
  expandArrow: {
    alignItems: 'flex-end',
    marginTop: -4,
    marginBottom: 8,
  },
  watchNowPill: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  playIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  watchNowMainText: {
    color: '#000',
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },
  watchNowSubText: {
    color: '#B20710', // Darker reddish text under it
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 2,
  },
  content: {
    paddingTop: 10,
  },
  sectionHeader: {
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  ratingsCardRow: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  ratingCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    width: '60%',
  },
  imdbBadge: {
    backgroundColor: '#F5C518', // Official IMDb Yellow
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imdbBadgeText: {
    color: '#000',
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
  },
  ratingNumber: {
    color: '#fff',
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
  },
  ratingSource: {
    color: '#999',
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  castHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
  },
  roundIconBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  creditsList: {
    paddingLeft: 20,
    paddingRight: 8,
  },
  castItem: {
    width: 80,
    marginRight: 16,
    alignItems: 'center',
  },
  castImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
    marginBottom: 10,
    backgroundColor: '#333',
  },
  castName: {
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    textAlign: 'center',
  },
  castCharacter: {
    color: '#777',
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
});
