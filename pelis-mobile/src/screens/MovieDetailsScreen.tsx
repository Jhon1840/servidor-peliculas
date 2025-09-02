import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { MovieDetails } from '../services/models/Movie';
import { movieService } from '../services/MovieService';
import { CONFIG, formatRuntime } from '../config/constants';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

interface MovieDetailsScreenParams {
  movieId: string;
}

type MovieDetailsScreenRouteProp = RouteProp<{ params: MovieDetailsScreenParams }, 'params'>;

const { width, height } = Dimensions.get('window');

const MovieDetailsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<MovieDetailsScreenRouteProp>();
  const { movieId } = route.params;

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMovieDetails();
  }, [movieId]);

  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const movieDetails = await movieService.getMovieDetails(movieId);
      setMovie(movieDetails);
    } catch (err) {
      console.error('Error loading movie details:', err);
      setError('No se pudieron cargar los detalles de la película');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => {
    if (movie) {
      const url = movieService.getPlaybackUrl(movie.Id);
      navigation.navigate('VideoPlayer', { url, title: movie.Name });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner text="Cargando detalles..." />
      </SafeAreaView>
    );
  }

  if (error || !movie) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorMessage
          message={error || 'Película no encontrada'}
          onRetry={loadMovieDetails}
        />
      </SafeAreaView>
    );
  }

  const backdropUrl = movie.ImageTags?.Backdrop
    ? movieService.getImageUrl(movie.Id, 'Backdrop', movie.ImageTags.Backdrop, 800, 450)
    : '';

  const posterUrl = movie.ImageTags?.Primary
    ? movieService.getImageUrl(movie.Id, 'Primary', movie.ImageTags.Primary, 300, 450)
    : '';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with backdrop */}
        <View style={styles.header}>
          {backdropUrl ? (
            <Image source={{ uri: backdropUrl }} style={styles.backdrop} />
          ) : (
            <View style={styles.backdropPlaceholder} />
          )}
          
          <View style={styles.headerOverlay}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color={CONFIG.UI.COLORS.TEXT_PRIMARY} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Movie info */}
        <View style={styles.content}>
          <View style={styles.posterSection}>
            {posterUrl ? (
              <Image source={{ uri: posterUrl }} style={styles.poster} />
            ) : (
              <View style={styles.posterPlaceholder}>
                <Ionicons name="film-outline" size={48} color={CONFIG.UI.COLORS.TEXT_SECONDARY} />
              </View>
            )}
            
            <View style={styles.movieInfo}>
              <Text style={styles.title}>{movie.Name}</Text>
              
              <View style={styles.metaRow}>
                {movie.ProductionYear && (
                  <Text style={styles.metaText}>{movie.ProductionYear}</Text>
                )}
                {movie.RunTimeTicks && (
                  <Text style={styles.metaText}>
                    {formatRuntime(movie.RunTimeTicks)}
                  </Text>
                )}
                {movie.OfficialRating && (
                  <Text style={styles.rating}>{movie.OfficialRating}</Text>
                )}
              </View>

              {movie.CommunityRating && (
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{movie.CommunityRating.toFixed(1)}</Text>
                </View>
              )}

              {movie.Genres && movie.Genres.length > 0 && (
                <View style={styles.genresContainer}>
                  {movie.Genres.slice(0, 3).map((genre, index) => (
                    <View key={index} style={styles.genreTag}>
                      <Text style={styles.genreText}>{genre}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Play button */}
          <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
            <Ionicons name="play" size={24} color={CONFIG.UI.COLORS.TEXT_PRIMARY} />
            <Text style={styles.playButtonText}>Reproducir</Text>
          </TouchableOpacity>

          {/* Overview */}
          {movie.Overview && (
            <View style={styles.overviewSection}>
              <Text style={styles.sectionTitle}>Sinopsis</Text>
              <Text style={styles.overview}>{movie.Overview}</Text>
            </View>
          )}

          {/* Cast */}
          {movie.People && movie.People.length > 0 && (
            <View style={styles.castSection}>
              <Text style={styles.sectionTitle}>Reparto</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {movie.People.slice(0, 10).map((person, index) => (
                  <View key={index} style={styles.castItem}>
                    <Text style={styles.castName}>{person.Name}</Text>
                    <Text style={styles.castRole}>{person.Role}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Studios */}
          {movie.Studios && movie.Studios.length > 0 && (
            <View style={styles.studiosSection}>
              <Text style={styles.sectionTitle}>Estudios</Text>
              <Text style={styles.studiosText}>
                {movie.Studios.map(studio => studio.Name).join(', ')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CONFIG.UI.COLORS.BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    height: height * 0.4,
    position: 'relative',
  },
  backdrop: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backdropPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: CONFIG.UI.COLORS.SECONDARY,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    paddingTop: CONFIG.UI.SPACING.MD,
    paddingLeft: CONFIG.UI.SPACING.MD,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: CONFIG.UI.SPACING.SM,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: CONFIG.UI.SPACING.MD,
  },
  posterSection: {
    flexDirection: 'row',
    marginBottom: CONFIG.UI.SPACING.LG,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginRight: CONFIG.UI.SPACING.MD,
  },
  posterPlaceholder: {
    width: 120,
    height: 180,
    backgroundColor: CONFIG.UI.COLORS.SECONDARY,
    borderRadius: 8,
    marginRight: CONFIG.UI.SPACING.MD,
    justifyContent: 'center',
    alignItems: 'center',
  },
  movieInfo: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    color: CONFIG.UI.COLORS.TEXT_PRIMARY,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: CONFIG.UI.SPACING.SM,
    lineHeight: 28,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: CONFIG.UI.SPACING.SM,
  },
  metaText: {
    color: CONFIG.UI.COLORS.TEXT_SECONDARY,
    fontSize: 14,
    marginRight: CONFIG.UI.SPACING.MD,
  },
  rating: {
    color: CONFIG.UI.COLORS.TEXT_PRIMARY,
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: CONFIG.UI.COLORS.SECONDARY,
    paddingHorizontal: CONFIG.UI.SPACING.SM,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: CONFIG.UI.SPACING.SM,
  },
  ratingText: {
    color: CONFIG.UI.COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: CONFIG.UI.SPACING.XS,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: CONFIG.UI.SPACING.MD,
  },
  genreTag: {
    backgroundColor: CONFIG.UI.COLORS.PRIMARY,
    paddingHorizontal: CONFIG.UI.SPACING.SM,
    paddingVertical: CONFIG.UI.SPACING.XS,
    borderRadius: 12,
    marginRight: CONFIG.UI.SPACING.SM,
    marginBottom: CONFIG.UI.SPACING.XS,
  },
  genreText: {
    color: CONFIG.UI.COLORS.TEXT_PRIMARY,
    fontSize: 12,
    fontWeight: '500',
  },
  playButton: {
    backgroundColor: CONFIG.UI.COLORS.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: CONFIG.UI.SPACING.MD,
    borderRadius: 8,
    marginBottom: CONFIG.UI.SPACING.LG,
  },
  playButtonText: {
    color: CONFIG.UI.COLORS.TEXT_PRIMARY,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: CONFIG.UI.SPACING.SM,
  },
  overviewSection: {
    marginBottom: CONFIG.UI.SPACING.LG,
  },
  sectionTitle: {
    color: CONFIG.UI.COLORS.TEXT_PRIMARY,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: CONFIG.UI.SPACING.SM,
  },
  overview: {
    color: CONFIG.UI.COLORS.TEXT_SECONDARY,
    fontSize: 16,
    lineHeight: 24,
  },
  castSection: {
    marginBottom: CONFIG.UI.SPACING.LG,
  },
  castItem: {
    marginRight: CONFIG.UI.SPACING.MD,
    alignItems: 'center',
  },
  castName: {
    color: CONFIG.UI.COLORS.TEXT_PRIMARY,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  castRole: {
    color: CONFIG.UI.COLORS.TEXT_SECONDARY,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  studiosSection: {
    marginBottom: CONFIG.UI.SPACING.LG,
  },
  studiosText: {
    color: CONFIG.UI.COLORS.TEXT_SECONDARY,
    fontSize: 14,
  },
});

export default MovieDetailsScreen;
