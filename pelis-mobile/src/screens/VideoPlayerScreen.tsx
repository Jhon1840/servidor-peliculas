import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CONFIG } from '../config/constants';

interface VideoPlayerScreenParams {
  url: string;
  title: string;
}

type VideoPlayerScreenRouteProp = RouteProp<{ params: VideoPlayerScreenParams }, 'params'>;

const { width, height } = Dimensions.get('window');

const VideoPlayerScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<VideoPlayerScreenRouteProp>();
  const { url, title } = route.params;

  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Hide status bar for full screen experience
    StatusBar.setHidden(true, 'fade');
    
    return () => {
      StatusBar.setHidden(false, 'fade');
    };
  }, []);

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (status && 'isPlaying' in status && status.isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
  };

  const handleSeek = async (positionMillis: number) => {
    if (videoRef.current) {
      await videoRef.current.setPositionAsync(positionMillis);
    }
  };

  const handleVolumeChange = async (volume: number) => {
    if (videoRef.current) {
      await videoRef.current.setVolumeAsync(volume);
    }
  };

  const handleMute = async () => {
    if (videoRef.current) {
      const currentVolume = (status && 'volume' in status) ? status.volume : 1;
      await videoRef.current.setVolumeAsync(currentVolume > 0 ? 0 : 1);
    }
  };

  const handleFullscreen = () => {
    
    setShowControls(!showControls);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const onPlaybackStatusUpdate = (playbackStatus: AVPlaybackStatus) => {
    setStatus(playbackStatus);
    setIsLoading(false);
    
    if ('error' in playbackStatus && playbackStatus.error) {
      setError('Error al reproducir el video');
      console.error('Video playback error:', playbackStatus.error);
    }
  };

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!status || !('durationMillis' in status) || !('positionMillis' in status)) return 0;
    if (!status.durationMillis || !status.positionMillis) return 0;
    return status.positionMillis / status.durationMillis;
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={CONFIG.UI.COLORS.ERROR} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleBack}>
            <Text style={styles.retryButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: url }}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        isLooping={false}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
      />

      {/* Loading overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Ionicons name="refresh" size={32} color={CONFIG.UI.COLORS.TEXT_PRIMARY} />
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      )}

      {showControls && (
        <View style={styles.controlsOverlay}>
          
          <View style={styles.topControls}>
            <TouchableOpacity style={styles.controlButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color={CONFIG.UI.COLORS.TEXT_PRIMARY} />
            </TouchableOpacity>
            <Text style={styles.videoTitle} numberOfLines={1}>
              {title}
            </Text>
            <TouchableOpacity style={styles.controlButton} onPress={handleFullscreen}>
              <Ionicons name="expand" size={24} color={CONFIG.UI.COLORS.TEXT_PRIMARY} />
            </TouchableOpacity>
          </View>

          <View style={styles.centerControls}>
            <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
              <Ionicons 
                name={(status && 'isPlaying' in status && status.isPlaying) ? "pause" : "play"} 
                size={48} 
                color={CONFIG.UI.COLORS.TEXT_PRIMARY} 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomControls}>
            <View style={styles.progressContainer}>
              <Text style={styles.timeText}>
                {(status && 'positionMillis' in status) ? formatTime(status.positionMillis) : '0:00'}
              </Text>
              
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${getProgress() * 100}%` }
                  ]} 
                />
              </View>
              
              <Text style={styles.timeText}>
                {(status && 'durationMillis' in status && status.durationMillis) ? formatTime(status.durationMillis) : '0:00'}
              </Text>
            </View>

            <View style={styles.bottomButtons}>
              <TouchableOpacity style={styles.controlButton} onPress={handleMute}>
                <Ionicons 
                  name={(status && 'volume' in status && status.volume === 0) ? "volume-mute" : "volume-high"} 
                  size={24} 
                  color={CONFIG.UI.COLORS.TEXT_PRIMARY} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.controlButton} onPress={handleFullscreen}>
                <Ionicons name="contract" size={24} color={CONFIG.UI.COLORS.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <TouchableOpacity 
        style={styles.tapArea} 
        onPress={() => setShowControls(!showControls)}
        activeOpacity={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: CONFIG.UI.COLORS.TEXT_PRIMARY,
    fontSize: 16,
    marginTop: CONFIG.UI.SPACING.SM,
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
    zIndex: 5,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: CONFIG.UI.SPACING.LG,
    paddingHorizontal: CONFIG.UI.SPACING.MD,
    paddingBottom: CONFIG.UI.SPACING.SM,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: CONFIG.UI.SPACING.SM,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoTitle: {
    color: CONFIG.UI.COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: CONFIG.UI.SPACING.MD,
  },
  centerControls: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 40,
    padding: CONFIG.UI.SPACING.MD,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    paddingHorizontal: CONFIG.UI.SPACING.MD,
    paddingBottom: CONFIG.UI.SPACING.LG,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: CONFIG.UI.SPACING.MD,
  },
  timeText: {
    color: CONFIG.UI.COLORS.TEXT_PRIMARY,
    fontSize: 14,
    fontWeight: '500',
    minWidth: 40,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginHorizontal: CONFIG.UI.SPACING.SM,
  },
  progressFill: {
    height: '100%',
    backgroundColor: CONFIG.UI.COLORS.PRIMARY,
    borderRadius: 2,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tapArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: CONFIG.UI.SPACING.LG,
  },
  errorText: {
    color: CONFIG.UI.COLORS.TEXT_PRIMARY,
    fontSize: 18,
    textAlign: 'center',
    marginVertical: CONFIG.UI.SPACING.LG,
  },
  retryButton: {
    backgroundColor: CONFIG.UI.COLORS.PRIMARY,
    paddingHorizontal: CONFIG.UI.SPACING.LG,
    paddingVertical: CONFIG.UI.SPACING.MD,
    borderRadius: 8,
  },
  retryButtonText: {
    color: CONFIG.UI.COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VideoPlayerScreen; 