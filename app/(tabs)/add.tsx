import { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { InputField } from '@/components/InputField';
import { supabase } from '@/lib/supabase';
import { validateImdbId, validateYouTubeUrl, validateMovieName, formatImdbId } from '@/utils/validation';

export default function AddMovieScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [imdbId, setImdbId] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateInputs = (): boolean => {
    if (!validateImdbId(imdbId)) {
      setError('Please enter a valid IMDb ID (e.g., tt1234567)');
      return false;
    }
    if (!validateYouTubeUrl(youtubeUrl)) {
      setError('Please enter a valid YouTube URL');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError(null);

    if (!validateInputs()) {
      return;
    }

    setLoading(true);

    try {
      const { error: insertError } = await supabase.from('movies').insert({
        name: name.trim() || '',
        imdb_id: formatImdbId(imdbId),
        youtube_url: youtubeUrl.trim(),
      });

      if (insertError) {
        throw insertError;
      }

      setName('');
      setImdbId('');
      setYoutubeUrl('');

      router.push('/(tabs)/');
    } catch (err: any) {
      console.error('Error adding movie:', err);
      if (err.code === '23505') {
        setError('This movie already exists in your collection');
      } else {
        setError('Failed to add movie. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header title="Add Movie" subtitle="Add a new movie to your collection" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <InputField
          label="Movie Name (Optional)"
          value={name}
          onChangeText={setName}
          placeholder="Auto-fetched from IMDb if left empty"
        />

        <InputField
          label="IMDb ID"
          value={imdbId}
          onChangeText={setImdbId}
          placeholder="e.g., tt1234567"
        />

        <InputField
          label="YouTube URL"
          value={youtubeUrl}
          onChangeText={setYoutubeUrl}
          placeholder="e.g., https://youtube.com/watch?v=..."
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Adding...' : 'Add Movie'}
          </Text>
        </TouchableOpacity>

        <View style={styles.hint}>
          <Text style={styles.hintTitle}>Tips:</Text>
          <Text style={styles.hintText}>
            • Find IMDb ID on imdb.com (e.g., tt0111161 for Shawshank Redemption)
          </Text>
          <Text style={styles.hintText}>
            • Use the official trailer YouTube URL
          </Text>
          <Text style={styles.hintText}>
            • Movie data will be fetched automatically from IMDb
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  errorContainer: {
    backgroundColor: '#330000',
    padding: 16,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E50914',
  },
  errorText: {
    color: '#E50914',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#E50914',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  hint: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
  },
  hintTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  hintText: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 8,
    lineHeight: 20,
  },
});
