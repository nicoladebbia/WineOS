import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Filter } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { translations } from '@/constants/translations';
import { WineType, Country } from '@/types/wine';
import { WINE_TYPES, COUNTRIES, REORDER_STATUSES, getAllRegionsWithCountry, type RegionWithCountry } from '@/constants/filterOptions';

interface FilterBarProps {
  selectedTypes: WineType[];
  selectedCountries: Country[];
  selectedRegions: string[];
  selectedStatuses: ('ok' | 'warning' | 'urgent')[];
  onSelectTypes: (types: WineType[] | ((prev: WineType[]) => WineType[])) => void;
  onSelectCountries: (countries: Country[] | ((prev: Country[]) => Country[])) => void;
  onSelectRegions: (regions: string[] | ((prev: string[]) => string[])) => void;
  onSelectStatuses: (statuses: ('ok' | 'warning' | 'urgent')[] | ((prev: ('ok' | 'warning' | 'urgent')[]) => ('ok' | 'warning' | 'urgent')[])) => void;
  onClearAll: () => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export default function FilterBar({
  selectedTypes,
  selectedCountries,
  selectedRegions,
  selectedStatuses,
  onSelectTypes,
  onSelectCountries,
  onSelectRegions,
  onSelectStatuses,
  onClearAll,
  showFilters,
  setShowFilters,
}: FilterBarProps) {
  const hasActiveFilters = useMemo(
    () => selectedTypes.length > 0 || selectedCountries.length > 0 || selectedRegions.length > 0 || selectedStatuses.length > 0,
    [selectedTypes.length, selectedCountries.length, selectedRegions.length, selectedStatuses.length]
  );
  
  const activeFilterCount = useMemo(
    () => selectedTypes.length + selectedCountries.length + selectedRegions.length + selectedStatuses.length,
    [selectedTypes.length, selectedCountries.length, selectedRegions.length, selectedStatuses.length]
  );

  return (
    <TouchableOpacity 
      style={[
        styles.filterButton, 
        (showFilters || hasActiveFilters) && styles.filterButtonActive
      ]}
      onPress={() => setShowFilters(!showFilters)}
    >
      <Filter 
        size={20} 
        color={(showFilters || hasActiveFilters) ? Colors.secondary : Colors.text} 
      />
      {activeFilterCount > 0 && !showFilters && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{activeFilterCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// Separate component for the dropdown
export function FilterDropdown({
  selectedTypes,
  selectedCountries,
  selectedRegions,
  selectedStatuses,
  onSelectTypes,
  onSelectCountries,
  onSelectRegions,
  onSelectStatuses,
  onClearAll,
  hasActiveFilters,
}: Omit<FilterBarProps, 'showFilters' | 'setShowFilters'> & { hasActiveFilters: boolean }) {
  // Memoize regions list - only recalculate when needed
  const allRegions = useMemo(() => getAllRegionsWithCountry(), []);
  
  // Filter regions based on selected countries (memoized)
  const filteredRegions = useMemo(
    () => selectedCountries.length === 0 
      ? allRegions 
      : allRegions.filter(r => selectedCountries.includes(r.country)),
    [allRegions, selectedCountries]
  );
  
  // Memoize toggle functions with functional setState to prevent unnecessary re-renders
  const handleToggleType = useCallback((type: WineType) => {
    onSelectTypes((prev: WineType[]) => 
      prev.includes(type) ? prev.filter((t: WineType) => t !== type) : [...prev, type]
    );
  }, [onSelectTypes]);
  
  const handleToggleCountry = useCallback((country: Country) => {
    onSelectCountries((prev: Country[]) => 
      prev.includes(country) ? prev.filter((c: Country) => c !== country) : [...prev, country]
    );
  }, [onSelectCountries]);
  
  const handleToggleRegion = useCallback((region: string) => {
    onSelectRegions((prev: string[]) => 
      prev.includes(region) ? prev.filter((r: string) => r !== region) : [...prev, region]
    );
  }, [onSelectRegions]);
  
  const handleToggleStatus = useCallback((status: 'ok' | 'warning' | 'urgent') => {
    onSelectStatuses((prev: ('ok' | 'warning' | 'urgent')[]) => 
      prev.includes(status) ? prev.filter((s: 'ok' | 'warning' | 'urgent') => s !== status) : [...prev, status]
    );
  }, [onSelectStatuses]);

  return (
    <View style={styles.filtersDropdown}>
          <FilterSection title={translations.filters.type}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsScrollContainer}
            >
              {WINE_TYPES.map((type) => (
                <FilterChip
                  key={type}
                  label={type}
                  isSelected={selectedTypes.includes(type)}
                  onPress={() => handleToggleType(type)}
                />
              ))}
            </ScrollView>
          </FilterSection>
          
          <FilterSection title={translations.filters.country}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsScrollContainer}
            >
              {COUNTRIES.map((country) => (
                <FilterChip
                  key={country}
                  label={country}
                  isSelected={selectedCountries.includes(country)}
                  onPress={() => handleToggleCountry(country)}
                />
              ))}
            </ScrollView>
          </FilterSection>
          
          <FilterSection title={translations.filters.region}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsScrollContainer}
            >
              {filteredRegions.map((region) => (
                  <FilterChip
                    key={region.value}
                    label={region.label}
                    isSelected={selectedRegions.includes(region.value)}
                    onPress={() => handleToggleRegion(region.value)}
                  />
                ))}
            </ScrollView>
          </FilterSection>
          
          <FilterSection title={translations.filters.reorderStatus}>
            {REORDER_STATUSES.map((status) => (
              <FilterChip
                key={status}
                label={translations.reorderStatus[status]}
                isSelected={selectedStatuses.includes(status)}
                onPress={() => handleToggleStatus(status)}
              />
            ))}
          </FilterSection>
          
          {hasActiveFilters && (
            <TouchableOpacity style={styles.clearAllButton} onPress={onClearAll}>
              <Text style={styles.clearAllText}>{translations.actions.clearAllFilters}</Text>
            </TouchableOpacity>
          )}
        </View>
  );
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <View style={styles.filterSection}>
      <Text style={styles.filterSectionTitle}>{title}</Text>
      <View style={styles.chipsContainer}>
        {children}
      </View>
    </View>
  );
}

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

function FilterChip({ label, isSelected, onPress }: FilterChipProps) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        isSelected && styles.selectedChip
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.chipText,
        isSelected && styles.selectedChipText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Colors.secondary,
    fontSize: 10,
    fontWeight: '700',
  },
  filtersDropdown: {
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  clearAllButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  clearAllText: {
    color: Colors.secondary,
    fontSize: 13,
    fontWeight: '600',
  },
  filterSection: {
    marginBottom: 10,
  },
  filterSectionTitle: {
    fontSize: 12,
    color: Colors.lightText,
    marginBottom: 6,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipsScrollContainer: {
    paddingRight: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedChip: {
    backgroundColor: 'rgba(125, 29, 63, 0.1)',
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500',
  },
  selectedChipText: {
    color: Colors.primary,
    fontWeight: '600',
  },
});