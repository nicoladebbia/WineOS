import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Zap, Search, TrendingUp } from 'lucide-react-native';
import Colors from '@/constants/colors';

export type AddMode = 'quick' | 'search' | 'reorder';

interface AddModeSelectorProps {
  selectedMode: AddMode;
  onSelectMode: (mode: AddMode) => void;
}

export default function AddModeSelector({ selectedMode, onSelectMode }: AddModeSelectorProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.modeButton, selectedMode === 'quick' && styles.modeButtonActive]}
        onPress={() => onSelectMode('quick')}
      >
        <Zap size={20} color={selectedMode === 'quick' ? Colors.secondary : Colors.lightText} />
        <Text style={[styles.modeText, selectedMode === 'quick' && styles.modeTextActive]}>
          Quick Add
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.modeButton, selectedMode === 'search' && styles.modeButtonActive]}
        onPress={() => onSelectMode('search')}
      >
        <Search size={20} color={selectedMode === 'search' ? Colors.secondary : Colors.lightText} />
        <Text style={[styles.modeText, selectedMode === 'search' && styles.modeTextActive]}>
          Database
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.modeButton, selectedMode === 'reorder' && styles.modeButtonActive]}
        onPress={() => onSelectMode('reorder')}
      >
        <TrendingUp size={20} color={selectedMode === 'reorder' ? Colors.secondary : Colors.lightText} />
        <Text style={[styles.modeText, selectedMode === 'reorder' && styles.modeTextActive]}>
          Reorder
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 4,
    gap: 4,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
  },
  modeButtonActive: {
    backgroundColor: Colors.primary,
  },
  modeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.lightText,
  },
  modeTextActive: {
    color: Colors.secondary,
  },
});
