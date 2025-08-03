import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

interface VideoPlayerScreenParams {
  url: string;
  title: string;
}

type VideoPlayerScreenRouteProp = RouteProp<{ params: VideoPlayerScreenParams }, 'params'>;

const VideoPlayerScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<VideoPlayerScreenRouteProp>();
  const { url, title } = route.params;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={32} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <Video
        source={{ uri: url }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="contain"
        shouldPlay
        useNativeControls
        style={styles.video}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 4,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 10,
    textAlign: 'center',
  },
  video: {
    width: '100%',
    height: '70%',
    backgroundColor: '#000',
  },
});

export default VideoPlayerScreen; 