import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Filter, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { translations } from '@/constants/translations';
import { regions } from '@/constants/regions';

interface FilterBarProps {
  selectedCountry: string | null;
  selectedRegion: string | null;
  selectedStatus: string | null;
  onSelectCountry: (country: string | null) => void;
  onSelectRegion: (region: string | null) => void;
  onSelectStatus: (status: string | null) => void;
  onClearAll: () => void;
}

export default function FilterBar({
  selectedCountry,
  selectedRegion,
  selectedStatus,
  onSelectCountry,
  onSelectRegion,
  onSelectStatus,
  onClearAll,
}: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const hasActiveFilters = selectedCountry || selectedRegion || selectedStatus;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={[
            styles.filterButton,
            hasActiveFilters && styles.activeFilterButton
          ]} 
          onPress={toggleFilters}
        >
          <Filter size={18} color={hasActiveFilters ? Colors.primary : Colors.text} />
          <Text style={[
            styles.filterButtonText,
            hasActiveFilters && styles.activeFilterButtonText
          ]}>
            Filtri
          </Text>
        </TouchableOpacity>
        
        {hasActiveFilters && (
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={onClearAll}
          >
            <X size={16} color={Colors.lightText} />
            <Text style={styles.clearButtonText}>Cancella Tutti</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {showFilters && (
        <View style={styles.filtersContainer}>
          <FilterSection title={translations.filters.country}>
            <FilterChip
              label="Italy"
              isSelected={selectedCountry === 'Italy'}
              onPress={() => onSelectCountry(selectedCountry === 'Italy' ? null : 'Italy')}
            />
            <FilterChip
              label="France"
              isSelected={selectedCountry === 'France'}
              onPress={() => onSelectCountry(selectedCountry === 'France' ? null : 'France')}
            />
          </FilterSection>
          
          {selectedCountry && (
            <FilterSection title={translations.filters.region}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsScrollContainer}
              >
                {regions[selectedCountry as 'Italy' | 'France'].map((region) => (
                  <FilterChip
                    key={region}
                    label={region}
                    isSelected={selectedRegion === region}
                    onPress={() => onSelectRegion(selectedRegion === region ? null : region)}
                  />
                ))}
              </ScrollView>
            </FilterSection>
          )}
          
          <FilterSection title={translations.filters.reorderStatus}>
            <FilterChip
              label={translations.reorderStatus.ok}
              isSelected={selectedStatus === 'ok'}
              onPress={() => onSelectStatus(selectedStatus === 'ok' ? null : 'ok')}
            />
            <FilterChip
              label={translations.reorderStatus.warning}
              isSelected={selectedStatus === 'warning'}
              onPress={() => onSelectStatus(selectedStatus === 'warning' ? null : 'warning')}
            />
            <FilterChip
              label={translations.reorderStatus.urgent}
              isSelected={selectedStatus === 'urgent'}
              onPress={() => onSelectStatus(selectedStatus === 'urgent' ? null : 'urgent')}
            />
          </FilterSection>
        </View>
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
  container: {
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  activeFilterButton: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  activeFilterButtonText: {
    color: Colors.primary,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(125, 29, 63, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  clearButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  filtersContainer: {
    marginTop: 12,
  },
  filterSection: {
    marginBottom: 12,
  },
  filterSectionTitle: {
    fontSize: 14,
    color: Colors.lightText,
    marginBottom: 8,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.divider,
  },
  selectedChip: {
    backgroundColor: 'rgba(125, 29, 63, 0.15)',
  },
  chipText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedChipText: {
    color: Colors.primary,
    fontWeight: '500',
  },
});