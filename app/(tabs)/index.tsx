import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, TextInput, TouchableOpacity, Text, Platform } from 'react-native';
import { useWineStore } from '@/store/wineStore';
import { Wine, ReorderStatus } from '@/types/wine';
import WineCard from '@/components/WineCard';
import EmptyState from '@/components/EmptyState';
import FilterBar from '@/components/FilterBar';
import InventorySummary from '@/components/InventorySummary';
import Colors from '@/constants/colors';
import { translations } from '@/constants/translations';
import { Search, X, AlertTriangle } from 'lucide-react-native';
import Toast from '@/components/Toast';

export default function InventoryScreen() {
  const wines = useWineStore((state) => state.wines);
  const searchWines = useWineStore((state) => state.searchWines);
  const getReorderStatus = useWineStore((state) => state.getReorderStatus);
  const getWinesNeedingReorder = useWineStore((state) => state.getWinesNeedingReorder);
  const getTotalSalesInPeriod = useWineStore((state) => state.getTotalSalesInPeriod);
  
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'region'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showReorderToast, setShowReorderToast] = useState(false);
  
  const winesNeedingReorder = getWinesNeedingReorder();
  const weeklySales = getTotalSalesInPeriod(7);
  
  // Calculate total bottles in inventory
  const totalBottles = wines.reduce((total, wine) => total + wine.quantity, 0);
  
  // Show reorder notification on first load if there are wines needing reorder
  useEffect(() => {
    if (winesNeedingReorder.length > 0) {
      setShowReorderToast(true);
    }
  }, []);
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // In a real app, you might fetch updated data here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  
  // Get filtered wines based on search and filters
  const getFilteredWines = useCallback(() => {
    // First apply search
    let result = searchQuery ? searchWines(searchQuery) : wines;
    
    // Then apply filters
    if (selectedCountry) {
      result = result.filter(wine => wine.country === selectedCountry);
    }
    
    if (selectedRegion) {
      result = result.filter(wine => wine.region === selectedRegion);
    }
    
    if (selectedStatus) {
      result = result.filter(wine => getReorderStatus(wine) === selectedStatus as ReorderStatus);
    }
    
    // Apply sorting
    result = [...result].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'quantity':
          comparison = a.quantity - b.quantity;
          break;
        case 'region':
          comparison = a.region.localeCompare(b.region);
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [wines, searchQuery, selectedCountry, selectedRegion, selectedStatus, sortBy, sortDirection, searchWines, getReorderStatus]);
  
  const filteredWines = getFilteredWines();
  
  const handleSort = (field: 'name' | 'quantity' | 'region') => {
    if (sortBy === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and reset direction to asc
      setSortBy(field);
      setSortDirection('asc');
    }
  };
  
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  const clearAllFilters = () => {
    setSelectedCountry(null);
    setSelectedRegion(null);
    setSelectedStatus(null);
    setSearchQuery('');
  };
  
  const renderItem = ({ item }: { item: Wine }) => (
    <WineCard wine={item} />
  );
  
  return (
    <View style={styles.container}>
      <InventorySummary 
        winesNeedingReorder={winesNeedingReorder.length}
        totalBottles={totalBottles}
      />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.lightText} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={translations.actions.search}
            placeholderTextColor={Colors.lightText}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={18} color={Colors.lightText} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <FilterBar
        selectedCountry={selectedCountry}
        selectedRegion={selectedRegion}
        selectedStatus={selectedStatus}
        onSelectCountry={setSelectedCountry}
        onSelectRegion={setSelectedRegion}
        onSelectStatus={setSelectedStatus}
        onClearAll={clearAllFilters}
      />
      
      <View style={styles.sortContainer}>
        <TouchableOpacity 
          style={styles.sortButton} 
          onPress={() => handleSort('name')}
        >
          <Text style={[
            styles.sortButtonText,
            sortBy === 'name' && styles.activeSortButton
          ]}>
            {translations.wine.name} {sortBy === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.sortButton} 
          onPress={() => handleSort('region')}
        >
          <Text style={[
            styles.sortButtonText,
            sortBy === 'region' && styles.activeSortButton
          ]}>
            {translations.wine.region} {sortBy === 'region' && (sortDirection === 'asc' ? '↑' : '↓')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.sortButton} 
          onPress={() => handleSort('quantity')}
        >
          <Text style={[
            styles.sortButtonText,
            sortBy === 'quantity' && styles.activeSortButton
          ]}>
            {translations.wine.quantity} {sortBy === 'quantity' && (sortDirection === 'asc' ? '↑' : '↓')}
          </Text>
        </TouchableOpacity>
      </View>
      
      {wines.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={filteredWines}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState 
              title="Nessun risultato"
              description="Prova a modificare i filtri per vedere più vini"
            />
          }
        />
      )}
      
      <Toast
        message={`⚠️ ${winesNeedingReorder.length} vini sotto la soglia di riordino`}
        type="warning"
        visible={showReorderToast}
        onClose={() => setShowReorderToast(false)}
        duration={5000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: Colors.card,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: Colors.text,
  },
  clearButton: {
    padding: 4,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  sortButtonText: {
    fontSize: 14,
    color: Colors.lightText,
  },
  activeSortButton: {
    color: Colors.primary,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
});