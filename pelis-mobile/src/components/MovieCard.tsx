import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Movie } from '../services/models/Movie';
import { movieService } from '../services/MovieService';
import { CONFIG, formatRuntime } from '../config/constants';

interface MovieCardProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
  variant?: 'default' | 'compact' | 'featured';
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // 2 columnas con padding

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  onPress, 
  variant = 'default' 
}) => {
  const imageUrl = movie.ImageTags?.Primary
    ? movieService.getImageUrl(movie.Id, 'Primary', movie.ImageTags.Primary)
    : '';

  const isWatched = movie.UserData?.Played || false;
  const hasProgress = movie.UserData?.PlaybackPositionTicks && movie.UserData.PlaybackPositionTicks > 0;

  const getCardStyle = () => {
    switch (variant) {
      case 'compact':
        return [styles.card, styles.compactCard];
      case 'featured':
        return [styles.card, styles.featuredCard];
      default:
        return styles.card;
    }
  };

  const getImageStyle = () => {
    switch (variant) {
      case 'compact':
        return [styles.image, styles.compactImage];
      case 'featured':
        return [styles.image, styles.featuredImage];
      default:
        return styles.image;
    }
  };

  return (
    <TouchableOpacity
      style={getCardStyle()}
      onPress={() => onPress(movie)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={getImageStyle()} />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="film-outline" size={32} color={CONFIG.UI.COLORS.TEXT_SECONDARY} />
            <Text style={styles.placeholderText}>Sin imagen</Text>
          </View>
        )}
        
        {/* Status indicators */}
        <View style={styles.statusContainer}>
          {isWatched && (
            <View style={styles.watchedBadge}>
              <Ionicons name="checkmark" size={12} color={CONFIG.UI.COLORS.TEXT_PRIMARY} />
            </View>
          )}
          
          {hasProgress && !isWatched && (
            <View style={styles.progressBadge}>
              <Ionicons name="play" size={12} color={CONFIG.UI.COLORS.TEXT_PRIMARY} />
            </View>
          )}
        </View>

        {/* Rating overlay */}
        {movie.CommunityRating && (
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingText}>{movie.CommunityRating.toFixed(1)}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={variant === 'compact' ? 1 : 2}>
          {movie.Name}
        </Text>
        
        <View style={styles.metaInfo}>
          {movie.ProductionYear && (
            <Text style={styles.year}>{movie.ProductionYear}</Text>
          )}
          {movie.RunTimeTicks && (
            <Text style={styles.runtime}>
              {formatRuntime(movie.RunTimeTicks)}
            </Text>
          )}
        </View>

        {/* Genres */}
        {movie.Genres && movie.Genres.length > 0 && variant !== 'compact' && (
          <Text style={styles.genres} numberOfLines={1}>
            {movie.Genres.slice(0, 2).join(', ')}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: CONFIG.UI.COLORS.SECONDARY,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  compactCard: {
    width: cardWidth * 0.8,
    marginBottom: 12,
  },
  featuredCard: {
    width: cardWidth * 1.2,
    marginBottom: 20,
  },
  imageContainer: {
    width: '100%',
    height: cardWidth * 1.5, // Aspect ratio 2:3
    position: 'relative',
  },
  compactImage: {
    height: cardWidth * 1.2,
  },
  featuredImage: {
    height: cardWidth * 1.8,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: CONFIG.UI.COLORS.TEXT_SECONDARY,
    fontSize: 12,
    marginTop: 4,
  },
  statusContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  watchedBadge: {
    backgroundColor: CONFIG.UI.COLORS.SUCCESS,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBadge: {
    backgroundColor: CONFIG.UI.COLORS.WARNING,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: CONFIG.UI.COLORS.TEXT_PRIMARY,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    color: CONFIG.UI.COLORS.TEXT_PRIMARY,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 18,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  year: {
    color: CONFIG.UI.COLORS.TEXT_SECONDARY,
    fontSize: 12,
  },
  runtime: {
    color: CONFIG.UI.COLORS.TEXT_SECONDARY,
    fontSize: 12,
  },
  genres: {
    color: CONFIG.UI.COLORS.TEXT_SECONDARY,
    fontSize: 11,
    fontStyle: 'italic',
  },
});

export default MovieCard; 