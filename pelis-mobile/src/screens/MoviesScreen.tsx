import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  RefreshControl,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import EmptyState from '../components/ui/EmptyState';
import { Movie } from '../services/models/Movie';
import { movieService } from '../services/MovieService';
import { cacheService, CacheService } from '../services/CacheService';
import { CONFIG } from '../config/constants';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');

const MoviesScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMovies(movies);
    }
  }, [searchQuery, movies]);

  const loadMovies = async (useCache: boolean = true) => {
    try {
      setLoading(true);
      setError(null);

      // Try to get from cache first
      if (useCache) {
        const cachedMovies = cacheService.get<Movie[]>(CacheService.KEYS.MOVIES);
        if (cachedMovies) {
          setMovies(cachedMovies);
          setFilteredMovies(cachedMovies);
          setLoading(false);
        }
      }

      const response = await movieService.getMovies();
      const moviesList = response.Items || [];
      
      setMovies(moviesList);
      setFilteredMovies(moviesList);
      
      // Cache the results
      cacheService.set(CacheService.KEYS.MOVIES, moviesList);
    } catch (error) {
      console.error('Error loading movies:', error);
      setError('No se pudieron cargar las películas. Verifica que el servidor esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredMovies(movies);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    try {
      // Try cache first
      const cacheKey = CacheService.KEYS.SEARCH(query);
      const cachedResults = cacheService.get<Movie[]>(cacheKey);
      
      if (cachedResults) {
        setFilteredMovies(cachedResults);
        setIsSearching(false);
        return;
      }

      const response = await movieService.searchMovies(query);
      const searchResults = response.Items || [];
      
      setFilteredMovies(searchResults);
      cacheService.set(cacheKey, searchResults);
    } catch (error) {
      console.error('Error searching movies:', error);
      // Fallback to local filtering
      const filtered = movies.filter(movie =>
        movie.Name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMovies(filtered);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMovies(false); // Don't use cache on refresh
    setRefreshing(false);
  };

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('MovieDetails', { movieId: movie.Id });
  };

  const renderMovie = ({ item }: { item: Movie }) => (
    <MovieCard movie={item} onPress={handleMoviePress} />
  );

  const renderEmptyState = () => {
    if (searchQuery) {
      return (
        <EmptyState
          icon="search-outline"
          title="No se encontraron películas"
          subtitle="Intenta con otro término de búsqueda"
        />
      );
    }
    
    return (
      <EmptyState
        icon="film-outline"
        title="No hay películas disponibles"
        subtitle="Verifica que el servidor esté funcionando"
      />
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.title}>Mis Películas</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Ionicons name="refresh" size={24} color={CONFIG.UI.COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>
        {filteredMovies.length} película{filteredMovies.length !== 1 ? 's' : ''}
        {searchQuery && ` para "${searchQuery}"`}
      </Text>
    </View>
  );

  if (loading && movies.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner text="Cargando películas..." />
      </SafeAreaView>
    );
  }

  if (error && movies.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorMessage
          message={error}
          onRetry={() => loadMovies(false)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <SearchBar 
        onSearch={handleSearch}
        placeholder="Buscar películas..."
      />
      
      {isSearching && (
        <View style={styles.searchingContainer}>
          <LoadingSpinner size="small" text="Buscando..." />
        </View>
      )}
      
      <FlatList
        data={filteredMovies}
        renderItem={renderMovie}
        keyExtractor={(item) => item.Id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={CONFIG.UI.COLORS.PRIMARY}
            colors={[CONFIG.UI.COLORS.PRIMARY]}
          />
        }
        ListEmptyComponent={renderEmptyState}
        ListHeaderComponent={isSearching ? null : undefined}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CONFIG.UI.COLORS.BACKGROUND,
  },
  header: {
    paddingHorizontal: CONFIG.UI.SPACING.MD,
    paddingVertical: CONFIG.UI.SPACING.SM,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: CONFIG.UI.SPACING.XS,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: CONFIG.UI.COLORS.TEXT_PRIMARY,
  },
  subtitle: {
    fontSize: 14,
    color: CONFIG.UI.COLORS.TEXT_SECONDARY,
  },
  refreshButton: {
    padding: CONFIG.UI.SPACING.SM,
    borderRadius: 20,
    backgroundColor: CONFIG.UI.COLORS.SECONDARY,
  },
  searchingContainer: {
    paddingVertical: CONFIG.UI.SPACING.SM,
  },
  listContainer: {
    paddingHorizontal: CONFIG.UI.SPACING.MD,
    paddingBottom: CONFIG.UI.SPACING.LG,
  },
  row: {
    justifyContent: 'space-between',
  },
});

export default MoviesScreen; 