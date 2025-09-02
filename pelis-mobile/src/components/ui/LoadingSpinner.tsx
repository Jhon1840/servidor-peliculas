import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { CONFIG } from '../../config/constants';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  overlay?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = CONFIG.UI.COLORS.PRIMARY,
  text,
  overlay = false,
}) => {
  const containerStyle = overlay ? styles.overlayContainer : styles.container;

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: CONFIG.UI.SPACING.LG,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  text: {
    color: CONFIG.UI.COLORS.TEXT_PRIMARY,
    fontSize: 16,
    marginTop: CONFIG.UI.SPACING.MD,
    textAlign: 'center',
  },
});

export default LoadingSpinner;
