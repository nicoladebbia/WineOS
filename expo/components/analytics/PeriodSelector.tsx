import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';

interface Period {
  label: string;
  days: number;
}

interface PeriodSelectorProps {
  selectedPeriod: number;
  onSelectPeriod: (days: number) => void;
  periods?: Period[]; // FIXED: Made configurable via props
}

// FIXED: Use Number.MAX_SAFE_INTEGER for "all time" instead of magic number
export const ALL_TIME_PERIOD = Number.MAX_SAFE_INTEGER;

const DEFAULT_PERIODS: Period[] = [
  { label: 'Today', days: 1 },
  { label: 'Week', days: 7 },
  { label: 'Month', days: 30 },
  { label: 'All', days: ALL_TIME_PERIOD },
];

export default function PeriodSelector({ 
  selectedPeriod, 
  onSelectPeriod,
  periods = DEFAULT_PERIODS // FIXED: Use prop or default
}: PeriodSelectorProps) {
  const handleSelect = (days: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onSelectPeriod(days);
  };

  return (
    <View style={styles.container}>
      {periods.map((period) => {
        const isSelected = selectedPeriod === period.days;
        return (
          <TouchableOpacity
            key={period.days}
            style={[
              styles.button,
              isSelected && styles.buttonActive,
            ]}
            onPress={() => handleSelect(period.days)}
            // FIXED: Added accessibility
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`${period.label} period`}
            accessibilityState={{ selected: isSelected }}
            accessibilityHint={`Show analytics for ${period.label.toLowerCase()}`}
          >
            <Text
              style={[
                styles.buttonText,
                isSelected && styles.buttonTextActive,
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 4,
    gap: 4,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: Colors.primary,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.lightText,
  },
  buttonTextActive: {
    color: Colors.secondary,
  },
});
