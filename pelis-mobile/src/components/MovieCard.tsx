import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Movie, jellyfinService } from '../services/jellyfinApi';
import { CONFIG, formatRuntime } from '../config/constants';

interface MovieCardProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // 2 columnas con padding

const MovieCard: React.FC<MovieCardProps> = ({ movie, onPress }) => {
  const imageUrl = movie.ImageTags?.Primary
    ? jellyfinService.getImageUrl(movie.Id, 'Primary', movie.ImageTags.Primary)
    : '';



  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(movie)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
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
  imageContainer: {
    width: '100%',
    height: cardWidth * 1.5, // Aspect ratio 2:3
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
  },
  year: {
    color: CONFIG.UI.COLORS.TEXT_SECONDARY,
    fontSize: 12,
  },
  runtime: {
    color: CONFIG.UI.COLORS.TEXT_SECONDARY,
    fontSize: 12,
  },
  watchedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: CONFIG.UI.COLORS.SUCCESS,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  watchedText: {
    color: CONFIG.UI.COLORS.TEXT_PRIMARY,
    fontSize: 10,
    fontWeight: '500',
  },
});

export default MovieCard; 