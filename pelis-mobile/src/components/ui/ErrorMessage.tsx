import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CONFIG } from '../../config/constants';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  retryText?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  retryText = 'Reintentar',
  icon = 'alert-circle',
}) => {
  return (
    <View style={styles.container}>
      <Ionicons 
        name={icon} 
        size={48} 
        color={CONFIG.UI.COLORS.ERROR} 
        style={styles.icon}
      />
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>{retryText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: CONFIG.UI.SPACING.LG,
  },
  icon: {
    marginBottom: CONFIG.UI.SPACING.MD,
  },
  message: {
    color: CONFIG.UI.COLORS.TEXT_PRIMARY,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: CONFIG.UI.SPACING.LG,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: CONFIG.UI.COLORS.PRIMARY,
    paddingHorizontal: CONFIG.UI.SPACING.LG,
    paddingVertical: CONFIG.UI.SPACING.MD,
    borderRadius: 8,
  },
  retryText: {
    color: CONFIG.UI.COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ErrorMessage;
