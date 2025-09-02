import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CONFIG } from '../config/constants';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  showSearchButton?: boolean;
  debounceMs?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onFocus,
  onBlur,
  placeholder = 'Buscar películas...',
  autoFocus = false,
  showSearchButton = false,
  debounceMs = 300,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const focusAnimation = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(focusAnimation, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    setDebounceTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [query, debounceMs]);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleSearch = () => {
    onSearch(query);
  };

  const borderColor = focusAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [CONFIG.UI.COLORS.SECONDARY, CONFIG.UI.COLORS.PRIMARY],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.searchContainer, 
        { borderColor },
        showSearchButton && styles.searchContainerWithButton
      ]}>
        <Ionicons 
          name="search" 
          size={20} 
          color={isFocused ? CONFIG.UI.COLORS.PRIMARY : CONFIG.UI.COLORS.TEXT_SECONDARY} 
          style={styles.searchIcon} 
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={CONFIG.UI.COLORS.TEXT_SECONDARY}
          value={query}
          onChangeText={setQuery}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoFocus={autoFocus}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={CONFIG.UI.COLORS.TEXT_SECONDARY} />
          </TouchableOpacity>
        )}
      </Animated.View>
      {showSearchButton && (
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: CONFIG.UI.SPACING.MD,
    paddingVertical: CONFIG.UI.SPACING.SM,
    backgroundColor: CONFIG.UI.COLORS.BACKGROUND,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CONFIG.UI.COLORS.SECONDARY,
    borderRadius: 25,
    paddingHorizontal: CONFIG.UI.SPACING.MD,
    height: 44,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  searchContainerWithButton: {
    marginRight: CONFIG.UI.SPACING.SM,
  },
  searchIcon: {
    marginRight: CONFIG.UI.SPACING.SM,
  },
  input: {
    flex: 1,
    color: CONFIG.UI.COLORS.TEXT_PRIMARY,
    fontSize: 16,
    paddingVertical: CONFIG.UI.SPACING.SM,
  },
  clearButton: {
    padding: CONFIG.UI.SPACING.XS,
    marginLeft: CONFIG.UI.SPACING.SM,
  },
  searchButton: {
    backgroundColor: CONFIG.UI.COLORS.PRIMARY,
    paddingHorizontal: CONFIG.UI.SPACING.MD,
    paddingVertical: CONFIG.UI.SPACING.SM,
    borderRadius: 20,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: CONFIG.UI.COLORS.TEXT_PRIMARY,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SearchBar; 