import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Filter, X, SortAsc } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { WineType, Country } from '@/types/wine';
import { SortOption } from '@/hooks/useDatabaseFilters';

interface WineDatabaseFiltersProps {
  typeFilter: WineType | 'all';
  countryFilter: Country | 'all';
  classificationFilter: string | 'all';
  sortBy: SortOption;
  availableClassifications: string[];
  onTypeChange: (type: WineType | 'all') => void;
  onCountryChange: (country: Country | 'all') => void;
  onClassificationChange: (classification: string | 'all') => void;
  onSortChange: (sort: SortOption) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

const wineTypes: (WineType | 'all')[] = ['all', 'Red', 'White', 'Rosé', 'Sparkling', 'Dessert', 'Fortified'];
const countries: (Country | 'all')[] = ['all', 'Italy', 'France', 'Spain', 'USA', 'Argentina', 'Australia', 'Germany', 'Portugal', 'South Africa', 'Chile'];
const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
  { value: 'price-asc', label: 'Price Low-High' },
  { value: 'price-desc', label: 'Price High-Low' },
];

export default function WineDatabaseFilters({
  typeFilter,
  countryFilter,
  classificationFilter,
  sortBy,
  availableClassifications,
  onTypeChange,
  onCountryChange,
  onClassificationChange,
  onSortChange,
  onReset,
  hasActiveFilters,
}: WineDatabaseFiltersProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Filter size={18} color={Colors.primary} />
          <Text style={styles.headerTitle}>Filters</Text>
        </View>
        {hasActiveFilters && (
          <TouchableOpacity onPress={onReset} style={styles.resetButton}>
            <X size={16} color={Colors.primary} />
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
        {/* Type Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Type</Text>
          <View style={styles.filterChips}>
            {wineTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.filterChip,
                  typeFilter === type && styles.filterChipActive,
                ]}
                onPress={() => onTypeChange(type)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    typeFilter === type && styles.filterChipTextActive,
                  ]}
                >
                  {type === 'all' ? 'All' : type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Country Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Country</Text>
          <View style={styles.filterChips}>
            {countries.slice(0, 5).map((country) => (
              <TouchableOpacity
                key={country}
                style={[
                  styles.filterChip,
                  countryFilter === country && styles.filterChipActive,
                ]}
                onPress={() => onCountryChange(country)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    countryFilter === country && styles.filterChipTextActive,
                  ]}
                >
                  {country === 'all' ? 'All' : country}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Classification Filter */}
        {availableClassifications.length > 0 && (
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Classification</Text>
            <View style={styles.filterChips}>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  classificationFilter === 'all' && styles.filterChipActive,
                ]}
                onPress={() => onClassificationChange('all')}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    classificationFilter === 'all' && styles.filterChipTextActive,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              {availableClassifications.map((classification) => (
                <TouchableOpacity
                  key={classification}
                  style={[
                    styles.filterChip,
                    classificationFilter === classification && styles.filterChipActive,
                  ]}
                  onPress={() => onClassificationChange(classification)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      classificationFilter === classification && styles.filterChipTextActive,
                    ]}
                  >
                    {classification}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Sort Options */}
        <View style={styles.filterSection}>
          <View style={styles.filterLabelRow}>
            <SortAsc size={14} color={Colors.text} />
            <Text style={styles.filterLabel}>Sort By</Text>
          </View>
          <View style={styles.filterChips}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.filterChip,
                  sortBy === option.value && styles.filterChipActive,
                ]}
                onPress={() => onSortChange(option.value)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    sortBy === option.value && styles.filterChipTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  filtersScroll: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  filterSection: {
    marginRight: 16,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.lightText,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  filterChip: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  filterChipTextActive: {
    color: Colors.secondary,
  },
});
