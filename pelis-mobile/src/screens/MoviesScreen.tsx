import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import { Movie, jellyfinService } from '../services/jellyfinApi';
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

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter(movie =>
        movie.Name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }, [searchQuery, movies]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const response = await jellyfinService.getMovies();
      setMovies(response.Items || []);
      setFilteredMovies(response.Items || []);
    } catch (error) {
      console.error('Error loading movies:', error);
      Alert.alert(
        'Error',
        'No se pudieron cargar las películas. Verifica que el servidor Jellyfin esté funcionando.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredMovies(movies);
      return;
    }

    try {
      const response = await jellyfinService.searchMovies(query);
      setFilteredMovies(response.Items || []);
    } catch (error) {
      console.error('Error searching movies:', error);
      // Fallback to local filtering
      const filtered = movies.filter(movie =>
        movie.Name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMovies();
    setRefreshing(false);
  };

  const handleMoviePress = (movie: Movie) => {
    const url = jellyfinService.getPlaybackUrl(movie.Id);
    navigation.navigate('VideoPlayer', { url, title: movie.Name });
  };

  const renderMovie = ({ item }: { item: Movie }) => (
    <MovieCard movie={item} onPress={handleMoviePress} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {searchQuery ? 'No se encontraron películas' : 'No hay películas disponibles'}
      </Text>
      {searchQuery && (
        <Text style={styles.emptySubtext}>
          Intenta con otro término de búsqueda
        </Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={CONFIG.UI.COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Cargando películas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Películas</Text>
        
      </View>
      
      
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: CONFIG.UI.COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: CONFIG.UI.COLORS.TEXT_SECONDARY,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: CONFIG.UI.COLORS.TEXT_PRIMARY,
    fontSize: 16,
    marginTop: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: CONFIG.UI.COLORS.TEXT_PRIMARY,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    color: CONFIG.UI.COLORS.TEXT_SECONDARY,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default MoviesScreen; 